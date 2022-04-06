import { createMachine, interpret } from 'xstate'
import { createTestBus, createTestMachine } from '../__fixtures__/test-utils'

describe('Action - emit', () => {
  test('Emit event', () => {
    const bus = createTestBus()
    const busEvent = 'bus_event'
    const serviceEventToSend = 'EVENT_A'
    const payload = { data: 'foo' }

    const receiverService = interpret(createTestMachine('receiver')).start()
    bus.on(busEvent, receiverService, serviceEventToSend)

    interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              TEST: {
                actions: [bus.actions.emit(busEvent, payload)]
              }
            }
          }
        }
      })
    )
      .start()
      .send({ type: 'TEST' })

    expect(receiverService.state.context.event).toStrictEqual({
      data: payload,
      type: serviceEventToSend,
      event: busEvent
    })
    expect(receiverService.state.matches('state_a')).toBe(true)
  })

  test('Derive emit event via function', () => {
    const bus = createTestBus()
    const busEvent = 'bus_event'
    const serviceEventToSend = 'EVENT_A'
    const payload = { data: 'foo' }

    const receiverService = interpret(createTestMachine('receiver')).start()
    bus.on(busEvent, receiverService, serviceEventToSend)

    interpret(
      createMachine({
        initial: 'idle',
        context: {
          busEvent
        },
        states: {
          idle: {
            on: {
              TEST: {
                actions: [
                  bus.actions.emit((ctx) => {
                    return ctx.busEvent
                  }, payload)
                ]
              }
            }
          }
        }
      })
    )
      .start()
      .send({ type: 'TEST' })

    expect(receiverService.state.context.event).toStrictEqual({
      data: payload,
      type: serviceEventToSend,
      event: busEvent
    })
    expect(receiverService.state.matches('state_a')).toBe(true)
  })

  test('Derive payload  via function', () => {
    const bus = createTestBus()
    const busEvent = 'bus_event'
    const serviceEventToSend = 'EVENT_A'
    const payload = { data: 'foo' }
    const { emit } = bus.actions

    const receiverService = interpret(createTestMachine('receiver')).start()
    bus.on(busEvent, receiverService, serviceEventToSend)

    interpret(
      createMachine({
        initial: 'idle',
        context: {
          busEvent,
          payload
        },
        states: {
          idle: {
            on: {
              TEST: {
                actions: [
                  emit(
                    (ctx) => {
                      return ctx.busEvent
                    },
                    (ctx: any) => {
                      return ctx.payload
                    }
                  )
                ]
              }
            }
          }
        }
      })
    )
      .start()
      .send({ type: 'TEST' })

    expect(receiverService.state.context.event).toStrictEqual({
      data: payload,
      type: serviceEventToSend,
      event: busEvent
    })
    expect(receiverService.state.matches('state_a')).toBe(true)
  })
})
