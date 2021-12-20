import { interpret } from 'xstate'
import { createTestBus, createTestMachine } from './__fixtures__/test-utils'

describe('Machine listener', () => {
  test('Register machine for specific event', () => {
    const bus = createTestBus()
    const event = 'event'
    const type = 'EVENT_A'
    const data = { foo: 'bar' }
    const machine = createTestMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.on(event, service, type)
    bus.emit(event, data)

    expect(service.state.context.event).toStrictEqual({ event, data, type })
    expect(bus.getServiceById(service.id)).toBe(service)
  })

  test('If the same event is registered multiple times, same unsubscribe function is returned', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'foo' }
    const type = 'EVENT_A'
    const machine = createTestMachine('foo')
    const service = interpret(machine)
    service.start()

    const unsubscribe = bus.on(event, service, type)
    const unsubscribeTwo = bus.on(event, service, 'EVENT_B')
    bus.emit(event, data)

    expect(unsubscribe).toBe(unsubscribeTwo)
  })

  test('Emit event with no data', () => {
    const bus = createTestBus()
    const event = 'event'
    const type = 'EVENT_A'
    const machine = createTestMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.on(event, service, type)
    bus.emit(event)

    expect(service.state.context.event).toStrictEqual({
      event,
      data: undefined,
      type
    })
  })

  test('Register multiple machines for a specific event', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const type = 'EVENT_A'
    const machine = createTestMachine('one')
    const service = interpret(machine)
    service.start()

    const machineTwo = createTestMachine('two')
    const serviceTwo = interpret(machineTwo)
    serviceTwo.start()

    bus.on(event, service, type)
    bus.on(event, serviceTwo, type)
    bus.emit(event, data)

    expect(service.state.context.event).toStrictEqual({ event, data, type })
    expect(serviceTwo.state.context.event).toStrictEqual({ event, data, type })
  })

  test('Register machine for all events', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const type = 'EVENT_A'
    const eventTwo = 'event_two'
    const dataTwo = { foo_two: 'bar_two' }
    const machine = createTestMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.on('*', service, type)
    bus.emit(event, data)

    expect(service.state.context.event).toStrictEqual({ event, data, type })

    bus.emit(eventTwo, dataTwo)

    expect(service.state.context.event).toStrictEqual({
      event: eventTwo,
      data: dataTwo,
      type
    })
  })

  test('Do not send events to a stopped machine', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createTestMachine('foo')
    const service = interpret(machine)
    service.start()
    service.stop()

    bus.on(event, service, 'EVENT_A')
    bus.emit(event, data)

    expect(service.state.context.event).toBe(null)
  })

  test('Do not send event to a machine that do not accept particular event', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createTestMachine('foo')
    const service = interpret(machine)
    service.start()
    service.send('DONE')

    bus.on(event, service, 'EVENT_A')
    bus.emit(event, data)

    expect(service.state.context.event).toBe(null)
  })

  describe('Unregister', () => {
    test('Unregister machine for specific event', () => {
      const bus = createTestBus()
      const event = 'event'
      const data = { foo: 'bar' }
      const machine = createTestMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createTestMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      bus.on(event, service, 'EVENT_A')
      bus.off(event, service)
      bus.emit(event, data)

      expect(service.state.context.event).toBe(null)
    })

    test('Unregister machine for all events', () => {
      const bus = createTestBus()
      const data = { foo: 'bar' }
      const machine = createTestMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createTestMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      bus.on('*', service, 'EVENT_A')
      bus.off('*', service)
      bus.emit('foo', data)
      bus.emit('bar', data)

      expect(service.state.context.event).toBe(null)
    })

    test('Remove listener and unregister machine', () => {
      const bus = createTestBus()
      const event = 'foo'
      const data = { foo: 'bar' }
      const machine = createTestMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createTestMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      const unsubscribe = bus.on('*', service, 'EVENT_A')
      unsubscribe(true)
      bus.emit(event, data)

      expect(service.state.context.event).toBe(null)
      expect(bus.getServiceById(service.id)).toBeUndefined()
    })

    test('Unregister machine for specific event via returned unsubscribe function', () => {
      const bus = createTestBus()
      const event = 'event'
      const data = { foo: 'bar' }
      const machine = createTestMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createTestMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      const unsubscribe = bus.on(event, service, 'EVENT_A')
      unsubscribe()
      bus.emit(event, data)

      expect(service.state.context.event).toBe(null)
    })

    test('Unregister machine for all events via returned unsubscribe function', () => {
      const bus = createTestBus()
      const event = 'event'
      const data = { foo: 'bar' }
      const machine = createTestMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createTestMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      const unsubscribe = bus.on('*', service, 'EVENT_A')
      unsubscribe()
      bus.emit(event, data)

      expect(service.state.context.event).toBe(null)
    })
  })

  test('Clear all listeners for specific event', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createTestMachine('one')
    const service = interpret(machine)
    service.start()

    const machineTwo = createTestMachine('two')
    const serviceTwo = interpret(machineTwo)
    serviceTwo.start()

    bus.on(event, service, 'EVENT_A')
    bus.on(event, serviceTwo, 'EVENT_A')
    bus.clear(event)

    bus.emit(event, data)

    expect(service.state.context.event).toBe(null)
    expect(serviceTwo.state.context.event).toBe(null)
  })
})
