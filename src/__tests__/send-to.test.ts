import { interpret } from 'xstate'
import { createTestBus, createTestMachine } from './__fixtures__/test-utils'

describe('Bus sendTo functionality', () => {
  test('Send event to a single service', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'foo' }
    const type = 'EVENT_A'
    const service = interpret(createTestMachine('foo'))
    service.start()
    bus.register(service)

    bus.sendTo<typeof service>(service.id, {
      type,
      event,
      data
    })

    expect(service.state.context.event).toStrictEqual({ data, event, type })
  })

  test('Send event to multiple services', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'foo' }
    const type = 'EVENT_A'
    const service = interpret(createTestMachine('foo'))
    const serviceTwo = interpret(createTestMachine('bar'))
    service.start()
    serviceTwo.start()
    bus.register(service)
    bus.register(serviceTwo)

    bus.sendTo<typeof service>([service.id, serviceTwo.id], {
      type,
      event,
      data
    })

    expect(service.state.context.event).toStrictEqual({ data, event, type })
    expect(serviceTwo.state.context.event).toStrictEqual({ data, event, type })
  })

  test('Do nothing if service is not present', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'foo' }
    const service = interpret(createTestMachine('foo'))
    service.start()

    bus.sendTo<typeof service>(service.id, {
      type: 'EVENT_A',
      event,
      data
    })

    expect(service.state.matches('idle')).toBe(true)
  })

  test('Do nothing if the service does not accepts the event', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'foo' }
    const service = interpret(createTestMachine('foo'))
    service.start()

    bus.register(service)

    bus.sendTo<typeof service>(service.id, {
      // @ts-expect-error - wrong event on purpose
      type: 'EVENT_FAKE',
      event,
      data
    })

    expect(service.state.matches('idle')).toBe(true)
  })

  test('Do nothing if the service is stopped', () => {
    const bus = createTestBus()
    const event = 'event'
    const data = { foo: 'foo' }
    const service = interpret(createTestMachine('foo'))
    service.start()
    bus.register(service)
    service.stop()

    bus.sendTo<typeof service>(service.id, {
      type: 'EVENT_A',
      event,
      data
    })

    expect(service.state.matches('idle')).toBe(true)
  })
})
