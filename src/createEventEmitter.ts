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
      const context = ensureEventContext(eventName)
      if (context.status === 'running') {
        // console.warn('可能存在循环触发，请检查具体监听回调函数')
        return
      }
      context.status = 'running'
      for (const handler of context.handlers) {
        const result = handler.apply(instance, args)
        if (isPromise(result)) {
          await result
        }
      }
      context.status = 'wait'
    },
  }

  return instance
}
