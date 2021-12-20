import { ActorRef, EventFrom, Interpreter, InterpreterStatus } from 'xstate'
import { Oktopod } from '.'

export function isService(
  value: unknown
): value is Interpreter<any, any, any, any> | ActorRef<any> {
  return value instanceof Interpreter
}

export function serviceIsRunning(
  service: Interpreter<any, any, any> | ActorRef<any>,
  evt: string
): boolean {
  // @ts-expect-error - ActorRef type has no "status" prop
  if (service.status !== InterpreterStatus.Running /* 1 */) {
    /* istanbul ignore next */
    if (__DEV__) {
      console.warn(
        `Event ${evt} not sent to service: ${service.id} because the service is not running`
      )
    }

    return false
  }

  return true
}

export function serviceCanAcceptEvent(
  service: Interpreter<any, any, any> | ActorRef<any>,
  evt: string
): boolean {
  const snapshot = service.getSnapshot()

  if (!snapshot.nextEvents.includes(evt)) {
    /* istanbul ignore next */
    if (__DEV__) {
      console.warn(
        `Event ${evt} not sent to service ${service.id} because the service does not accept event.`
      )
    }

    return false
  }

  return true
}

// eslint-disable-next-line
export function createActions(bus: Oktopod) {
  return {
    busSendTo<
      TService extends
        | Interpreter<any, any, any, any>
        | ActorRef<any> = Interpreter<any, any, any, any>
    >(
      serviceId: string | string[] | ((ctx: any, evt: any) => string[]),
      event: EventFrom<TService> | ((ctx: any, evt: any) => EventFrom<TService>)
    ): any {
      return (ctx: any, evt: any) => {
        bus.sendTo(
          resolveIds(serviceId, ctx, evt),
          typeof event === 'function' ? event(ctx, evt) : event
        )
      }
    },
    busForwardTo(
      serviceId: string | string[] | ((ctx: any, evt: any) => string[])
    ): any {
      return (ctx: any, evt: any) => {
        bus.sendTo(resolveIds(serviceId, ctx, evt), evt)
      }
    }
  }
}

function resolveIds(
  idOrFn: string | string[] | ((ctx: any, evt: any) => string[]),
  ctx: any,
  evt: any
): string | string[] {
  let ids: string[]
  if (typeof idOrFn === 'function') {
    ids = idOrFn(ctx, evt)
  } else {
    ids = Array.isArray(idOrFn) ? idOrFn : [idOrFn]
  }

  return ids
}
