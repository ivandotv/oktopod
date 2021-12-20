import mitt from 'mitt'
import invariant from 'tiny-invariant'
import { ActorRef, EventFrom, Interpreter } from 'xstate'
import { serviceCanAcceptEvent, isService, serviceIsRunning } from './utils'

export type EventPayload<TData = unknown> = {
  event: string
  data: TData
}

function normalizeListener(cb: (data: EventPayload) => void): () => void {
  return (...args: any[]): void => {
    const data = args.length > 0 ? args[args.length - 1] : undefined
    cb(data)
  }
}

export class Oktopod {
  protected bus: ReturnType<typeof mitt>

  protected serviceToEvents: Map<
    Interpreter<any, any, any> | ActorRef<any>,
    Map<string, () => void>
  >

  protected idToService: Map<string, Interpreter<any, any, any> | ActorRef<any>>

  protected listenerToWrapper: Map<
    (...args: any[]) => void,
    (...args: any[]) => void
  >

  constructor() {
    this.bus = mitt()
    this.serviceToEvents = new Map()
    this.idToService = new Map()
    this.listenerToWrapper = new Map()
  }

  on(event: string, listener: (payload: EventPayload) => void): () => void

  on<
    TService extends
      | Interpreter<any, any, any, any>
      | ActorRef<any> = Interpreter<any, any, any, any>
  >(
    event: string,
    listener: TService,
    send: Pick<EventFrom<TService>, 'type'>['type']
  ): (unregister?: boolean) => void

  on<
    TService extends
      | Interpreter<any, any, any, any>
      | ActorRef<any> = Interpreter<any, any, any, any>
  >(
    event: string,
    listener: TService | ((payload: EventPayload) => void),
    send?: Pick<EventFrom<TService>, 'type'>['type']
  ): () => void | ((unregister?: boolean) => void) {
    if (isService(listener)) {
      invariant(
        send,
        `When using machine as listener, please provide send type`
      )

      return this.serviceOn(event, listener, send)
    }

    const wrappedListener = normalizeListener(listener)
    this.listenerToWrapper.set(listener, wrappedListener)
    this.bus.on(event, wrappedListener)

    return () => {
      this.bus.off(event, wrappedListener)
      this.listenerToWrapper.delete(listener)
    }
  }

  protected serviceOn<
    TService extends Interpreter<any, any, any> | ActorRef<any> = Interpreter<
      any,
      any,
      any,
      any
    >
  >(
    event: string,
    listener: TService,
    send: Pick<EventFrom<TService>, 'type'>['type']
  ): (unregister?: boolean) => void {
    const eventData = this.serviceToEvents.get(listener)

    if (eventData) {
      const unregisterHandler = eventData.get(event)
      if (unregisterHandler) {
        /* istanbul ignore next */
        if (__DEV__) {
          console.warn(
            `Event: ${event} is already registered for service: ${listener.id}`
          )
        }

        return unregisterHandler
      }
    } else {
      this._register(listener)
    }

    const serviceListener = normalizeListener((data: EventPayload) => {
      if (!serviceIsRunning(listener, data.event)) {
        return
      }

      if (!serviceCanAcceptEvent(listener, send)) {
        return
      }

      listener.send(send, data)
    })

    const unsubscribe = (unregister = false): void => {
      if (unregister) {
        this._unregister(listener)

        return
      }
      this.bus.off(event, serviceListener)
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      this.serviceToEvents.get(listener)!.delete(event)
    }

    this.bus.on(event, serviceListener)
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    this.serviceToEvents.get(listener)!.set(event, unsubscribe)

    return unsubscribe
  }

  off(
    event: string,
    listener:
      | Interpreter<any, any, any>
      | ActorRef<any>
      | ((...args: any[]) => void)
  ): void {
    if (isService(listener)) {
      listener
      this.serviceOff(event, listener)

      return
    }

    const listenerWrapper = this.listenerToWrapper.get(listener)
    if (listenerWrapper) {
      this.bus.off(event, listenerWrapper)
    }
  }

  protected serviceOff(
    event: string,
    listener: Interpreter<any, any, any> | ActorRef<any>
  ): void {
    const listenerData = this.serviceToEvents.get(listener)
    if (listenerData) {
      const unregisterHandler = listenerData.get(event)
      unregisterHandler && unregisterHandler()
      listenerData.delete(event)
    }
  }

  clear(event: string): void {
    this.serviceToEvents.forEach((data) => {
      data.delete(event)
    })

    this.bus.off(event)
  }

  emit(event: string, data?: unknown): void {
    this.bus.emit(event, { event, data })
  }

  register(service: Interpreter<any, any, any>): () => void {
    this._register(service)

    return () => {
      this._unregister(service)
    }
  }

  private _register(service: Interpreter<any, any, any> | ActorRef<any>): void {
    if (!this.serviceToEvents.get(service)) {
      this.serviceToEvents.set(service, new Map())
      this.idToService.set(service.id, service)
    }
  }

  unregister(service: Interpreter<any, any, any>): void {
    this._unregister(service)
  }

  private _unregister(
    service: Interpreter<any, any, any> | ActorRef<any>
  ): void {
    const eventData = this.serviceToEvents.get(service)
    if (eventData) {
      eventData.forEach((unsubscribe) => unsubscribe())
      this.serviceToEvents.delete(service)
    }
    this.idToService.delete(service.id)
  }

  getServiceById<
    TService extends
      | Interpreter<any, any, any, any>
      | ActorRef<any> = Interpreter<any, any, any, any>
  >(id: string): TService | undefined {
    // @ts-expect-error - idToService also returns ActorRef type
    return this.idToService.get(id)
  }

  sendTo<
    TService extends
      | Interpreter<any, any, any, any>
      | ActorRef<any> = Interpreter<any, any, any, any>
  >(
    serviceId: string | string[] | (() => string[]),
    event: EventFrom<TService>
  ): void {
    // const resolve ids
    let ids: string[]
    if (typeof serviceId === 'function') {
      ids = serviceId()
    } else {
      ids = Array.isArray(serviceId) ? serviceId : [serviceId]
    }

    for (const id of ids) {
      const service = this.idToService.get(id)

      if (
        service &&
        // @ts-expect-error - find a way to narrow down event.type
        serviceIsRunning(service, event.type) &&
        // @ts-expect-error - find a way to narrow down event.type
        serviceCanAcceptEvent(service, event.type)
      ) {
        service.send(event)
      }
    }
  }
}
