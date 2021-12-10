export interface EventContext {
  status: 'wait' | 'running'
  handlers: Set<Function>
}

export interface EventCallback {
  callbackName: string
  eventStacks: EventStack[]
}

export interface EventStack {
  eventName: string
  callbacks: EventCallback[]
}

export interface EventEmitter {
  readonly stacks: EventStack[]
  on: (eventName: string, handler: Function) => void
  off: (eventName: string, handler: Function) => void
  emit: (eventName: string, ...args: any[]) => Promise<void>
}

export interface InnerMethods {
  fakeInstance: (eventStacks: EventStack[]) => EventEmitter
}

export function createEventEmitter() {
  const eventMap: Record<string, EventContext> = {}
  const allEventStacks: EventStack[] = []
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

  function createProxyInstanceWithStacks(eventStacks: EventStack[]) {
    return new Proxy(instance, {
      get(target, prop) {
        if (prop === 'stacks') {
          return eventStacks
        }
        return (target as any)[prop]
      },
      set(target, prop, newVal) {
        ;(target as any)[prop] = newVal
        return true
      },
    })
  }

  async function innerEmit(currentInstance: EventEmitter, eventName: string, ...args: any[]) {
    const context = ensureEventContext(eventName)
    if (context.status === 'running') {
      // console.warn('可能存在循环触发，请检查具体监听回调函数')
      innerEmit(currentInstance, 'emit_error', '可能存在循环触发，请检查具体监听回调函数')
      return
    }
    context.status = 'running'
    const currentEventStack: EventStack = {
      eventName,
      callbacks: [],
    }
    currentInstance.stacks.push(currentEventStack)
    for (const handler of context.handlers) {
      let result
      const handlerEventCallback: EventCallback = {
        callbackName: handler.name || 'anonymous function',
        eventStacks: [],
      }
      currentEventStack.callbacks.push(handlerEventCallback)
      const fakeInstance = createProxyInstanceWithStacks(handlerEventCallback.eventStacks)
      try {
        result = handler.apply(fakeInstance, args)
      } catch (e) {
        innerEmit(currentInstance, 'handler_error', e)
      }
      if (isPromise(result)) {
        await result.catch((e) => {
          innerEmit(currentInstance, 'async_handler_error', e)
        })
      }
    }
    context.status = 'wait'
  }

  const instance: EventEmitter & InnerMethods = {
    get stacks() {
      return allEventStacks
    },
    fakeInstance: createProxyInstanceWithStacks,
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
      await innerEmit(this, eventName, ...args)
    },
  }

  return instance
}
