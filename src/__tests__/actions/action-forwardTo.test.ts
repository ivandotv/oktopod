import { createMachine, interpret } from 'xstate'
import { createTestBus, createTestMachine } from '../__fixtures__/test-utils'

describe('Action - forwardTo', () => {
  test('Forward event to target via id', () => {
    const bus = createTestBus()
    const { forwardTo } = bus.actions
    const eventToSend = { type: 'EVENT_A', data: 'foo' }

    const receiverService = interpret(createTestMachine('receiver')).start()
    bus.register(receiverService)

    interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              EVENT_A: {
                actions: [forwardTo(receiverService.id)]
              }
            }
          }
        }
      })
    )
      .start()
      .send(eventToSend)

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
              EVENT_A: {
                actions: [
                  bus.actions.forwardTo([
                    receiverService.id,
                    receiverServiceTwo.id
                  ])
                ]
              }
            }
          }
        }
      })
    )
      .start()
      .send(eventToSend)

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

    const ids = [receiverService.id, receiverServiceTwo.id]

    interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              EVENT_A: {
                actions: [
                  bus.actions.forwardTo((_ctx, evt) => {
                    return evt.ids
                  })
                ]
              }
            }
          }
        }
      })
    )
      .start()
      .send({
        ids,
        ...eventToSend
      })

    expect(receiverService.state.context.event).toStrictEqual({
      ids,
      ...eventToSend
    })
    expect(receiverService.state.matches('state_a')).toBe(true)
    expect(receiverServiceTwo.state.context.event).toStrictEqual({
      ids,
      ...eventToSend
    })
    expect(receiverServiceTwo.state.matches('state_a')).toBe(true)
  })

  test('Throw if service is not registered', () => {
    const bus = createTestBus()
    const { forwardTo } = bus.actions
    const eventToSend = { type: 'EVENT_A', data: 'foo' }
    const receiverId = 'some_id'

    const senderService = interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              EVENT_A: {
                actions: [forwardTo(receiverId, true)]
              }
            }
          }
        }
      })
    ).start()

    expect(() => senderService.send(eventToSend)).toThrowError(/not present/)
  })
})
