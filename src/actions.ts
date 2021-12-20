import { ActorRef, EventFrom, Interpreter } from 'xstate'
import { Oktopod } from './oktopod'
import { isFunction, resolveIds } from './utils'

export function createActions(bus: Oktopod) {
  return {
    sendTo<
      TService extends
        | Interpreter<any, any, any, any>
        | ActorRef<any> = Interpreter<any, any, any, any>
    >(
      serviceId:
        | string
        | string[]
        | ((ctx: any, evt: any) => string | string[]),
      event: EventFrom<TService> | ((ctx: any, evt: any) => EventFrom<TService>)
    ): any {
      return (ctx: any, evt: any) => {
        bus.sendTo(
          resolveIds(serviceId, ctx, evt),
          // @ts-expect-error - xstate ResolveEvent interferes with assertion
          isFunction(event) ? event(ctx, evt) : event
        )
      }
    },
    forwardTo(
      serviceId: string | string[] | ((ctx: any, evt: any) => string | string[])
    ): any {
      return (ctx: any, evt: any) => {
        bus.sendTo(resolveIds(serviceId, ctx, evt), evt)
      }
    },
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
