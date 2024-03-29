import { createEventEmitter, EventEmitter } from './createEventEmitter';

function waitTime(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

test('async emit', async () => {
  const ctx = createEventEmitter()
  const callQueue: Array<[string, any[]]> = []

  ctx.on('event1', async function callback1(this: EventEmitter, ...args: any[]) {
    callQueue.push(['callback1', args])
    await this.emit('event2')
  })
  ctx.on('event1', (...args: any[]) => {
    callQueue.push(['callback2', args])
  })
  ctx.on('event2', async (...args: any[]) => {
    await waitTime(10)
    callQueue.push(['callback3', args])
  })
  await ctx.emit('event1', 1, 2)
  expect(callQueue[0][1]).toEqual([1, 2])
  expect(callQueue[2][1]).toEqual([1, 2])
  expect(callQueue.map((c) => c[0])).toEqual(['callback1', 'callback3', 'callback2'])

  expect(ctx.stacks[0].callbacks).toHaveLength(2)
  expect(ctx.stacks[0].callbacks[0].eventStacks).toHaveLength(1)

  // console.log(JSON.stringify(ctx.stacks, null, '  '))
})

test('async emit warn', async () => {
  const ctx = createEventEmitter()
  const callQueue: Array<[string, any[]]> = []

  ctx.on('event1', function callback1(this: EventEmitter, ...args: any[]) {
    callQueue.push(['callback1', args])
    this.emit('event2')
  })
  ctx.on('event1', (...args: any[]) => {
    callQueue.push(['callback2', args])
  })
  ctx.on('event2', function callback3(this: EventEmitter, ...args: any[]) {
    callQueue.push(['callback3', args])
    this.emit('event1')
  })
  const emitErrorFn = jest.fn()
  ctx.on('emit_error', emitErrorFn)
  await ctx.emit('event1', 1, 2)
  expect(emitErrorFn).toHaveBeenCalled()
})

test('fake instance', () => {
  const ctx = createEventEmitter()
  const instance = ctx.fakeInstance([])
  expect(ctx.stacks !== instance.stacks).toBe(true)
})

test('handler has error', async () => {
  const ctx = createEventEmitter()

  ctx.on('event1', () => {
    throw new Error('test1')
  })
  ctx.on('event1', async () => {
    await waitTime(10)
    throw new Error('test2')
  })
  const handlerErrorFn = jest.fn()
  const asyncHandlerErrorFn = jest.fn()
  ctx.on('handler_error', handlerErrorFn)
  ctx.on('async_handler_error', asyncHandlerErrorFn)
  await ctx.emit('event1', 1, 2)
  expect(handlerErrorFn).toHaveBeenCalled()
  expect(asyncHandlerErrorFn).toHaveBeenCalled()
})

test('emit inner event', async () => {
  const ctx = createEventEmitter()
  await expect(ctx.emit('emit_error')).rejects.toThrow()
})
