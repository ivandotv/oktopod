import { ActorRef, Interpreter, InterpreterStatus } from 'xstate'
import { EventPayload } from './oktopod'

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
        `Event ${evt} not sent to service: ${service.id}. Service is not running`
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
        `Event: ${evt} not sent to service: ${service.id}. Service does not accept the event.`
      )
    }

    return false
  }

  return true
}

export function resolveIds(
  idOrFn: string | string[] | ((ctx: any, evt: any) => string | string[]),
  ctx: any,
  evt: any
): string | string[] {
  let ids: string | string[]
  if (isFunction(idOrFn)) {
    ids = idOrFn(ctx, evt)
  } else {
    ids = Array.isArray(idOrFn) ? idOrFn : [idOrFn]
  }

  return ids
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function'
}

export function normalizeListener(
  cb: (data: EventPayload) => void
): () => void {
  return (...args: any[]): void => {
    const data = args.length > 0 ? args[args.length - 1] : undefined
    cb(data)
  }
}
