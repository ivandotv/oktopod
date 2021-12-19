import { createMachine, interpret } from 'xstate'
import { createActions } from '../utils'
import { createTestBus, createTestMachine } from './__fixtures__/test-utils'

describe('SendTo action', () => {
  test('Send event to target via id', () => {
    const bus = createTestBus()
    const { sendTo } = createActions(bus)

    const eventToSend = { type: 'EVENT_A', data: 'foo', event: 'foo' }

    const receiverService = interpret(createTestMachine('receiver'))
    receiverService.start()
    bus.register(receiverService)

    interpret(
      createMachine({
        initial: 'idle',
        context: {},
        states: {
          idle: {
            on: {
              SEND_TO: {
                actions: [sendTo(receiverService.id, eventToSend)]
              }
            }
          }
        }
      })
    )
      .start()
      .send({ type: 'SEND_TO' })

    expect(receiverService.state.context.event).toStrictEqual({
      event: eventToSend.event,
      data: eventToSend.data
    })

    expect(receiverService.state.context.type).toBe(eventToSend.type)
    expect(receiverService.state.matches('state_a')).toBe(true)
  })
  test.todo('Send action to multiple targets via array of ids')
  test.todo('Send action via multiple target via function')
  test.todo('Send hardcoded payload')
  test.todo('Send payload derived from function')
})
