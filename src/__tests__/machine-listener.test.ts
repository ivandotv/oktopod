import { interpret } from 'xstate'
import { createBus, createMachine } from './utils'

describe('Machine listener', () => {
  test('Register machine for specific event', () => {
    const bus = createBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.on(event, service, 'EVENT_A')
    bus.emit(event, data)

    expect(service.state.context.event).toStrictEqual({ event, data })
    expect(bus.getServiceById(service.id)).toBe(service)
  })

  test('Machine can only register once for a specific event', () => {
    const bus = createBus()
    const event = 'event'
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()

    const unsubscribe = bus.on(event, service, 'EVENT_A')
    const unsubscribeTwo = bus.on(event, service, 'EVENT_A')

    expect(unsubscribe).toBe(unsubscribeTwo)
  })

  test('Emit event with no data', () => {
    const bus = createBus()
    const event = 'event'
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.on(event, service, 'EVENT_A')
    bus.emit(event)

    expect(service.state.context.event).toStrictEqual({
      event,
      data: undefined
    })
  })

  test('Register multiple machines for a specific event', () => {
    const bus = createBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createMachine('one')
    const service = interpret(machine)
    service.start()

    const machineTwo = createMachine('two')
    const serviceTwo = interpret(machineTwo)
    serviceTwo.start()

    bus.on(event, service, 'EVENT_A')
    bus.on(event, serviceTwo, 'EVENT_A')
    bus.emit(event, data)

    expect(service.state.context.event).toStrictEqual({ event, data })
    expect(serviceTwo.state.context.event).toStrictEqual({ event, data })
  })

  test('Register machine for all events', () => {
    const bus = createBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const eventTwo = 'event_two'
    const dataTwo = { foo_two: 'bar_two' }
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.on('*', service, 'EVENT_A')
    bus.emit(event, data)

    expect(service.state.context.event).toStrictEqual({ event, data })

    bus.emit(eventTwo, dataTwo)

    expect(service.state.context.event).toStrictEqual({
      event: eventTwo,
      data: dataTwo
    })
  })

  test('Do not send events to a stopped machine', () => {
    const bus = createBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()
    service.stop()

    bus.on(event, service, 'EVENT_A')
    bus.emit(event, data)

    expect(service.state.context.event).toBe(null)
  })

  test('Do not send event to a machine that do not accept particular event', () => {
    const bus = createBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()
    service.send('DONE')

    bus.on(event, service, 'EVENT_A')
    bus.emit(event, data)

    expect(service.state.context.event).toBe(null)
  })

  describe('Unregister', () => {
    test('Unregister machine for specific event', () => {
      const bus = createBus()
      const event = 'event'
      const data = { foo: 'bar' }
      const machine = createMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      bus.on(event, service, 'EVENT_A')
      bus.off(event, service)
      bus.emit(event, data)

      expect(service.state.context.event).toBe(null)
    })

    test('Unregister machine for all events', () => {
      const bus = createBus()
      const data = { foo: 'bar' }
      const machine = createMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      bus.on('*', service, 'EVENT_A')
      bus.off('*', service)
      bus.emit('foo', data)
      bus.emit('bar', data)

      expect(service.state.context.event).toBe(null)
    })

    test('Remove listener and unregister machine', () => {
      const bus = createBus()
      const event = 'foo'
      const data = { foo: 'bar' }
      const machine = createMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      const unsubscribe = bus.on('*', service, 'EVENT_A')
      unsubscribe(true)
      bus.emit(event, data)

      expect(service.state.context.event).toBe(null)
      expect(bus.getServiceById(service.id)).toBeUndefined()
    })

    test('Unregister machine for specific event via returned unsubscribe function', () => {
      const bus = createBus()
      const event = 'event'
      const data = { foo: 'bar' }
      const machine = createMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      const unsubscribe = bus.on(event, service, 'EVENT_A')
      unsubscribe()
      bus.emit(event, data)

      expect(service.state.context.event).toBe(null)
    })

    test('Unregister machine for all events via returned unsubscribe function', () => {
      const bus = createBus()
      const event = 'event'
      const data = { foo: 'bar' }
      const machine = createMachine('foo')
      const service = interpret(machine)

      service.start()

      const machineTwo = createMachine('foo')
      const serviceTwo = interpret(machineTwo)
      serviceTwo.start()

      const unsubscribe = bus.on('*', service, 'EVENT_A')
      unsubscribe()
      bus.emit(event, data)

      expect(service.state.context.event).toBe(null)
    })
  })

  test('Clear all listeners for specific event', () => {
    const bus = createBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createMachine('one')
    const service = interpret(machine)
    service.start()

    const machineTwo = createMachine('two')
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
