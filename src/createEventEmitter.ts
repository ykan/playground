export interface EventContext {
  status: 'wait' | 'running'
  handlers: Set<Function>
}

export interface EventEmitter {
  on: (eventName: string, handler: Function) => void
  off: (eventName: string, handler: Function) => void
  emit: (eventName: string, ...args: any[]) => Promise<void>
}

export function createEventEmitter() {
  const eventMap: Record<string, EventContext> = {}
  const innerEvents = ['emit_error', 'handler_error', 'async_handler_error']

  function ensureEventContext(eventName: string) {
    if (!eventMap[eventName]) {
      eventMap[eventName] = {
        status: 'wait',
        handlers: new Set(),
      }
    }
    return eventMap[eventName]
  }

  function isPromise(result: any): result is Promise<any> {
    return result && typeof result.then === 'function'
  }

  async function innerEmit(eventName: string, ...args: any[]) {
    const context = ensureEventContext(eventName)
    if (context.status === 'running') {
      // console.warn('可能存在循环触发，请检查具体监听回调函数')
      innerEmit('emit_error', '可能存在循环触发，请检查具体监听回调函数')
      return
    }
    context.status = 'running'
    for (const handler of context.handlers) {
      let result
      try {
        result = handler.apply(instance, args)
      } catch (e) {
        innerEmit('handler_error', e)
      }
      if (isPromise(result)) {
        await result.catch((e) => {
          innerEmit('async_handler_error', e)
        })
      }
    }
    context.status = 'wait'
  }

  const instance: EventEmitter = {
    on(eventName, handler) {
      const context = ensureEventContext(eventName)
      context.handlers.add(handler)
    },
    off(eventName, handler) {
      const context = ensureEventContext(eventName)
      context.handlers.delete(handler)
    },
    async emit(eventName, ...args) {
      // 不能发内部错误事件
      if (innerEvents.includes(eventName)) {
        throw new Error(`不要触发内部保留事件(${eventName})`)
      }
      await innerEmit(eventName, ...args)
    },
  }

  return instance
}
