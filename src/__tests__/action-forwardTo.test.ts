import { createMachine, interpret } from 'xstate'
import { createActions } from '../utils'
import { createTestBus, createTestMachine } from './__fixtures__/test-utils'

describe('ForwardTo action creator', () => {
  test('Forward event to target via id', () => {
    const bus = createTestBus()
    const { busForwardTo } = createActions(bus)

    const eventToSend = { type: 'EVENT_A', data: 'foo', event: 'foo' }

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
                actions: [busForwardTo(receiverService.id)]
              }
            }
          }
        }
      })
    )
      .start()
      .send(eventToSend)

    expect(receiverService.state.context.event).toStrictEqual({
      event: eventToSend.event,
      data: eventToSend.data
    })
    expect(receiverService.state.context.type).toBe(eventToSend.type)
    expect(receiverService.state.matches('state_a')).toBe(true)
  })

  test('Send action to multiple targets via array of ids', () => {
    const bus = createTestBus()
    const { busForwardTo } = createActions(bus)

    const eventToSend = { type: 'EVENT_A', data: 'foo', event: 'foo' }

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
                  busForwardTo([receiverService.id, receiverServiceTwo.id])
                ]
              }
            }
          }
        }
      })
    )
      .start()
      .send(eventToSend)

    expect(receiverService.state.context.event).toStrictEqual({
      event: eventToSend.event,
      data: eventToSend.data
    })
    expect(receiverService.state.context.type).toBe(eventToSend.type)
    expect(receiverService.state.matches('state_a')).toBe(true)

    expect(receiverServiceTwo.state.context.event).toStrictEqual({
      event: eventToSend.event,
      data: eventToSend.data
    })
    expect(receiverServiceTwo.state.context.type).toBe(eventToSend.type)
    expect(receiverServiceTwo.state.matches('state_a')).toBe(true)
  })

  test('Send action to multiple targets via function', () => {
    const bus = createTestBus()
    const { busForwardTo } = createActions(bus)

    const eventToSend = { type: 'EVENT_A', data: 'foo', event: 'foo' }

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
                  busForwardTo((_ctx, evt) => {
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
        ids: [receiverService.id, receiverServiceTwo.id],
        ...eventToSend
      })

    expect(receiverService.state.context.event).toStrictEqual({
      event: eventToSend.event,
      data: eventToSend.data
    })
    expect(receiverService.state.context.type).toBe(eventToSend.type)
    expect(receiverService.state.matches('state_a')).toBe(true)

    expect(receiverServiceTwo.state.context.event).toStrictEqual({
      event: eventToSend.event,
      data: eventToSend.data
    })
    expect(receiverServiceTwo.state.context.type).toBe(eventToSend.type)
    expect(receiverServiceTwo.state.matches('state_a')).toBe(true)
  })
})
