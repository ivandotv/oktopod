/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createMachine } from 'xstate'
import { createActions } from '../../utils'
import { Oktopod } from '../../oktopod'

export function createTestEmitMachine(
  id: string,
  bus: Oktopod,
  targets: string | string[],
  event: { type: string; payload: string }
) {
  const { sendTo } = createActions(bus)

  return createMachine({
    id,
    strict: true,
    preserveActionOrder: true,
    initial: 'idle',
    context: {},
    states: {
      idle: {
        on: {
          SEND_TO: {
            actions: [sendTo(targets, event)]
          },
          SEND_TO_VIA_FUNCTION: {
            actions: [
              sendTo((_ctx, evt) => {
                return evt.targets
              }, event)
            ]
          }
          //   PURE_ACTION: {
          //     actions: pure((ctx, evt) => {
          //       return []
          //     })
          //   }
        }
      }
    }
  })
}
