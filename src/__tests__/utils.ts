/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createModel } from 'xstate/lib/model'
import { EventPayload, Oktopod } from '~/oktopod'

export function createBus() {
  return new Oktopod()
}

const model = createModel(
  { event: null as EventPayload | null },
  {
    events: {
      EVENT_A: (data: EventPayload) => data,
      EVENT_B: (data: EventPayload) => data,
      DONE: () => ({})
    }
  }
)

export function createMachine(id: string) {
  return model.createMachine({
    id,
    strict: true,
    preserveActionOrder: true,
    initial: 'idle',
    context: { event: null },
    on: {
      DONE: 'done'
    },
    states: {
      idle: {
        on: {
          EVENT_A: {
            actions: model.assign((_ctx, evt) => {
              return {
                event: { data: evt.data, event: evt.event }
              }
            })
          }
        }
      },
      done: {}
    }
  })
}
