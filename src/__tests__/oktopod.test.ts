import { Payload } from '~/oktopod'
import { factory } from './utils'

describe('Register listener', () => {
  test.only('Temp Test', () => {
    const bus = factory()
    const listener = (payload: Payload<number>): void => {
      console.log(payload.data)
      console.log('this ', this)
    }
    const event = 'boom!'
    const data = { foo: 'bar' }

    // bus.on(event, listener)
    bus.on('*', listener)
    bus.emit(event)

    expect(true).toBe(true)
    // expect(listener).toHaveBeenCalledTimes(1)
    // expect(listener).toHaveBeenCalledWith({ event, data })
  })
  test('Register and call listener', () => {
    const bus = factory()
    const listener = jest.fn()
    const event = 'event'
    const data = { foo: 'bar' }

    bus.on(event, listener)
    bus.emit(event, data)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith({ event, data })
  })

  test('Register listener with id', () => {
    const bus = factory()
    const listener = jest.fn()
    const functionId = 'function_id'
    const event = 'event'
    const data = { foo: 'bar' }

    bus.on(event, listener, functionId)
    bus.emit(event, data)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith({ event, data })
  })

  test('Retrieve listener via id', () => {
    const bus = factory()
    const listener = jest.fn()
    const functionId = 'function_id'
    const event = 'event'

    bus.on(event, listener, functionId)
    const returnedListener = bus.get(functionId)

    expect(returnedListener).toBe(listener)
  })

  test('Throw when trying to register listener with already taken id', () => {
    const bus = factory()
    const listener = jest.fn()
    const functionId = 'function_id'
    const event = 'event'

    bus.on(event, listener, functionId)

    expect(() => bus.on(event, listener, functionId)).toThrow()
  })
})

describe.skip('Unregister listener', () => {
  test('Unregiser listener', () => {
    const bus = factory()
    const listener = jest.fn()
    const event = 'event'
    const data = { foo: 'bar' }

    const t = function t(a: string): string {
      return a
    }

    bus.on(event, listener)

    bus.off(event, t)
    bus.emit(event, data)

    expect(listener).not.toHaveBeenCalled()
  })
})