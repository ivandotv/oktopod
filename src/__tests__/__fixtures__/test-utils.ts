/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ActorRefFrom, createMachine, spawn } from 'xstate'
import { createModel } from 'xstate/lib/model'
import Oktopod, { EventPayload } from '../../oktopod'

export function createTestBus() {
  return new Oktopod()
}

const childMachine = createMachine({
  initial: 'idle',
  id: 'child',
  states: {
    idle: {}
  }
})
const model = createModel(
  {
    event: null as EventPayload | null,
    actor: null as unknown as ActorRefFrom<typeof childMachine>
  },
  {
    events: {
      EVENT_A: (data: EventPayload) => data,
      EVENT_B: (data: EventPayload) => data,
      DONE: () => ({})
    }
  }
)

export function createTestMachine(id: string) {
  return model.createMachine({
    id,
    strict: true,
    preserveActionOrder: true,
    initial: 'idle',
    context: () => {
      return {
        ...model.initialContext,
        actor: spawn(childMachine)
      }
    },
    on: {
      DONE: 'done'
    },
    states: {
      idle: {
        on: {
          EVENT_A: {
            actions: model.assign((_ctx, event) => {
              return {
                event
              }
            }),
            target: 'state_a'
          },
          EVENT_B: {
            actions: model.assign((_ctx, event) => {
              return {
                event
              }
            }),
            target: 'state_b'
          }
        }
      },
      state_a: {
        on: {
          EVENT_A: {
            actions: model.assign((_ctx, event) => {
              return {
                event
              }
            })
          }
        }
      },
      state_b: {},
      done: {
        type: 'final'
      }
    }
  })
}
