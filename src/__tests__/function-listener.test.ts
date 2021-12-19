import { createBus } from './__fixtures__/test-utils'

describe('Function listener', () => {
  test('Register listener for a specific event', () => {
    const bus = createBus()
    const listener = jest.fn()
    const event = 'event'

    bus.on(event, listener)
    bus.emit(event)

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('Listener recieves event data', () => {
    const bus = createBus()
    const listener = jest.fn()
    const event = 'event'
    const data = { foo: 'bar' }

    bus.on(event, listener)
    bus.emit(event, data)

    expect(listener).toHaveBeenCalledWith({ event, data })
  })

  test('Emit event with no data', () => {
    const bus = createBus()
    const listener = jest.fn()
    const event = 'event'

    bus.on(event, listener)
    bus.emit(event)

    expect(listener).toHaveBeenCalledWith({ event, data: undefined })
  })

  test('Register multiple listeners for a specific event', () => {
    const bus = createBus()
    const firstListener = jest.fn()
    const secondListener = jest.fn()
    const event = 'event'
    const data = { foo: 'bar' }

    bus.on(event, firstListener)
    bus.on(event, secondListener)
    bus.emit(event, data)

    expect(firstListener).toHaveBeenCalledTimes(1)
    expect(firstListener).toHaveBeenCalledWith({ event, data })
    expect(secondListener).toHaveBeenCalledTimes(1)
    expect(secondListener).toHaveBeenCalledWith({ event, data })
  })

  test('Regsiter listener for all events', () => {
    const bus = createBus()
    const listener = jest.fn()
    const event = 'event'
    const secondEvent = 'eventTwo'
    const data = { foo: 'bar' }
    const secondData = { foo: 'bar' }

    bus.on('*', listener)
    bus.emit(event, data)
    bus.emit(secondEvent, secondData)

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenCalledWith({ event, data })
    expect(listener).toHaveBeenCalledWith({
      event: secondEvent,
      data: secondData
    })
  })

  describe('Unregister', () => {
    test('Unregister listener for a specific event', () => {
      const bus = createBus()
      const listener = jest.fn()
      const event = 'event'
      const data = { foo: 'bar' }

      bus.on(event, listener)
      bus.off(event, listener)
      bus.emit(event, data)

      expect(listener).not.toHaveBeenCalled()
    })

    test('Unregister listener for all events', () => {
      const bus = createBus()
      const listener = jest.fn()
      const event = 'event'
      const data = { foo: 'bar' }
      const secondEvent = 'eventTwo'
      const secondData = { foo: 'bar' }

      bus.on('*', listener)
      bus.off('*', listener)
      bus.emit(event, data)
      bus.emit(secondEvent, secondData)

      expect(listener).not.toHaveBeenCalled()
    })

    test('Unregister listener for specific event via returned unsubscribe function', () => {
      const bus = createBus()
      const listener = jest.fn()
      const event = 'event'
      const data = { foo: 'bar' }

      const unsubscribe = bus.on(event, listener)
      unsubscribe()
      bus.emit(event, data)

      expect(listener).not.toHaveBeenCalled()
    })

    test('Unregister listener for all events via returned unsubscribe function', () => {
      const bus = createBus()
      const listener = jest.fn()
      const event = 'event'
      const data = { foo: 'bar' }
      const secondEvent = 'eventTwo'
      const secondData = { foo: 'bar' }

      const unsubscribe = bus.on('*', listener)
      unsubscribe()
      bus.emit(event, data)
      bus.emit(secondEvent, secondData)

      expect(listener).not.toHaveBeenCalled()
    })

    test('Clear all listeners for a specific event', () => {
      const bus = createBus()
      const firstListener = jest.fn()
      const secondListener = jest.fn()
      const event = 'event'
      const data = { foo: 'bar' }

      bus.on(event, firstListener)
      bus.on(event, secondListener)
      bus.clear(event)
      bus.emit(event, data)

      expect(firstListener).not.toHaveBeenCalled()
      expect(secondListener).not.toHaveBeenCalled()
    })
  })
})
