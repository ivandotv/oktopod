import { createMachine, interpret } from 'xstate'
import { createTestBus, createTestMachine } from './__fixtures__/test-utils'

describe('Action - sendTo', () => {
  test('Send event to target via id', () => {
    const bus = createTestBus()

    const type = 'EVENT_A'
    const eventToSend = { type, data: 'foo' }

    const receiverService = interpret(createTestMachine('receiver')).start()
    bus.register(receiverService)

    interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              SEND_TO: {
                actions: [bus.actions.sendTo(receiverService.id, eventToSend)]
              }
            }
          }
        }
      })
    )
      .start()
      .send({ type: 'SEND_TO' })

    expect(receiverService.state.context.event).toStrictEqual(eventToSend)
    expect(receiverService.state.matches('state_a')).toBe(true)
  })

  test('Send action to multiple targets via array of ids', () => {
    const bus = createTestBus()
    const eventToSend = { type: 'EVENT_A', data: 'foo' }

    const receiverService = interpret(createTestMachine('receiver')).start()
    bus.register(receiverService)

    const receiverServiceTwo = interpret(
      createTestMachine('receiverTwo')
    ).start()
    bus.register(receiverServiceTwo)

    interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              SEND_TO: {
                actions: [
                  bus.actions.sendTo(
                    [receiverService.id, receiverServiceTwo.id],
                    eventToSend
                  )
                ]
              }
            }
          }
        }
      })
    )
      .start()
      .send({ type: 'SEND_TO' })

    expect(receiverService.state.context.event).toStrictEqual(eventToSend)
    expect(receiverService.state.matches('state_a')).toBe(true)

    expect(receiverServiceTwo.state.context.event).toStrictEqual(eventToSend)
    expect(receiverServiceTwo.state.matches('state_a')).toBe(true)
  })

  test('Send action to multiple targets via function', () => {
    const bus = createTestBus()

    const eventToSend = { type: 'EVENT_A', data: 'foo' }

    const receiverService = interpret(createTestMachine('receiver')).start()
    bus.register(receiverService)

    const receiverServiceTwo = interpret(
      createTestMachine('receiverTwo')
    ).start()
    bus.register(receiverServiceTwo)

    interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              SEND_TO: {
                actions: [
                  bus.actions.sendTo((_ctx, evt) => {
                    return evt.ids
                  }, eventToSend)
                ]
              }
            }
          }
        }
      })
    )
      .start()
      .send({
        type: 'SEND_TO',
        ids: [receiverService.id, receiverServiceTwo.id]
      })

    expect(receiverService.state.context.event).toStrictEqual(eventToSend)
    expect(receiverService.state.matches('state_a')).toBe(true)

    expect(receiverServiceTwo.state.context.event).toStrictEqual(eventToSend)
    expect(receiverServiceTwo.state.matches('state_a')).toBe(true)
  })

  test('Send payload derived from function', () => {
    const bus = createTestBus()
    const eventToSend = { type: 'EVENT_A', data: 'foo' }

    const receiverService = interpret(createTestMachine('receiver')).start()
    bus.register(receiverService)

    const receiverServiceTwo = interpret(
      createTestMachine('receiverTwo')
    ).start()
    bus.register(receiverServiceTwo)

    interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              SEND_TO: {
                actions: [
                  bus.actions.sendTo(
                    (_ctx, evt) => {
                      return evt.ids
                    },
                    (_ctx, evt) => {
                      return evt.eventToSend
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
      .send({
        type: 'SEND_TO',
        ids: [receiverService.id, receiverServiceTwo.id],
        eventToSend
      })

    expect(receiverService.state.context.event).toStrictEqual(eventToSend)
    expect(receiverService.state.matches('state_a')).toBe(true)

    expect(receiverServiceTwo.state.context.event).toStrictEqual(eventToSend)
    expect(receiverServiceTwo.state.matches('state_a')).toBe(true)
  })
})
