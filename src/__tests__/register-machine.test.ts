import { interpret } from 'xstate'
import { createBus, createMachine } from './utils'

//todo - send event
//todo - send command

describe('Add machine to event bus', () => {
  test('register machine', () => {
    const bus = createBus()
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.register(service)

    expect(bus.getServiceById(service.id)).toBe(service)
  })

  test('Unregister machine', () => {
    const bus = createBus()
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.register(service)
    bus.unregister(service)

    expect(bus.getServiceById(service.id)).toBeUndefined()
  })

  test('Unregister machine via callback function', () => {
    const bus = createBus()
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()

    const unregister = bus.register(service)
    unregister()
    expect(bus.getServiceById(service.id)).toBeUndefined()
  })

  test('When the machine is unregistered, it does not respond to events', () => {
    const bus = createBus()
    const event = 'event'
    const data = { foo: 'bar' }
    const machine = createMachine('foo')
    const service = interpret(machine)
    service.start()

    bus.register(service)
    bus.on(event, service, 'EVENT_A')

    bus.unregister(service)
    bus.emit(event, data)

    expect(service.state.context.event).toBe(null)
  })
})
