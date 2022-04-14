import { ActorRef, EventFrom, Interpreter } from 'xstate'
import Oktopod from './oktopod'
import { isFunction, resolveIds } from './utils'

export function createActions(bus: Oktopod) {
  return {
    /**
     * Send event to Xstate service that is registered with the bus
     * @param serviceId  - Xstate service id
     * @param event  - event to send
     */
    sendTo<
      TService extends
        | Interpreter<any, any, any, any, any>
        | ActorRef<any> = Interpreter<any, any, any, any>
    >(
      serviceId:
        | string
        | string[]
        | ((ctx: any, evt: any) => string | string[]),
      event:
        | EventFrom<TService>
        | ((ctx: any, evt: any) => EventFrom<TService>),
      strict?: boolean
    ): (ctx: any, evt: any) => void {
      return (ctx: any, evt: any) => {
        bus.sendTo(
          resolveIds(serviceId, ctx, evt),
          // @ts-expect-error - xstate ResolveEvent interferes with assertion
          isFunction(event) ? event(ctx, evt) : event,
          strict
        )
      }
    },
    /**
     * Forward event to a service by id
     * @param serviceId - Xstate service id
     */
    forwardTo(
      serviceId:
        | string
        | string[]
        | ((ctx: any, evt: any) => string | string[]),
      strict?: boolean
    ): (ctx: any, evt: any) => void {
      return (ctx: any, evt: any) => {
        bus.sendTo(resolveIds(serviceId, ctx, evt), evt, strict)
      }
    },
    /**
     * Emit event to bus
     * @param eventName - name of the even
     * @param data - data for the event
     */
    emit(
      eventName: string | ((ctx: any, evt: any) => string),
      data: any | ((ctx: any, evt: any) => any)
    ): any {
      return (ctx: any, evt: any) => {
        bus.emit(
          isFunction(eventName) ? eventName(ctx, evt) : eventName,
          isFunction(data) ? data(ctx, evt) : data
        )
      }
    }
  }
}
