import mitt from 'mitt'
import invariant from 'tiny-invariant'
import { ActorRef, EventFrom, Interpreter } from 'xstate'
import { createActions } from './actions'
import {
  isService,
  normalizeListener,
  serviceCanAcceptEvent,
  serviceIsRunning
} from './utils'

export type EventPayload<TData = any> = {
  event: string
  data: TData
}

export default class Oktopod {
  protected bus: ReturnType<typeof mitt> = mitt()

  protected serviceToEvents: Map<
    Interpreter<any, any, any> | ActorRef<any>,
    Map<string, () => void>
  > = new Map()

  protected idToService: Map<
    string,
    Interpreter<any, any, any> | ActorRef<any>
  > = new Map()

  protected listenerToWrapper: Map<
    (...args: any[]) => void,
    (...args: any[]) => void
  > = new Map()

  /**
   * Xstate action helpers bound to the current instance
   */
  actions: ReturnType<typeof createActions>

  constructor() {
    this.actions = createActions(this)
  }

  /**
   * Subscribe to the event with a function
   * @param event  - event to subscribe to
   * @param listener - function to be triggered
   * @returns function to unsubscribe
   */
  on(event: string, listener: (payload: EventPayload) => void): () => void

  /**
   * Subscribe  Xstate service to an event
   * @param event - event name
   * @param listener - Xstate service
   * @param send - event to send to the service
   * @returns function to unsubscribe if true is passed as the first argument service will be
   * also unregistered from the event bus
   */
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

    return this.fnOn(event, listener)
  }

  protected fnOn(event: string, listener: (payload: EventPayload) => void) {
    const wrappedListener = normalizeListener(listener)
    this.listenerToWrapper.set(listener, wrappedListener)
    this.bus.on(event, wrappedListener)

    return () => {
      this.bus.off(event, wrappedListener)
      this.listenerToWrapper.delete(listener)
    }
  }

  /**
   * Register Xstate service with the event bus
   * @param event - event name
   * @param listener - Xstate service
   * @param send - event to send to the service
   * @returns unregister function
   */
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
            `Event: ${event} is already registered for service: ${listener.id} to call: ${send}`
          )
        }

        return unregisterHandler
      }
    } else {
      this._register(listener)
    }

    const normalizedListener = normalizeListener((data: EventPayload) => {
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
      this.bus.off(event, normalizedListener)
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      this.serviceToEvents.get(listener)!.delete(event)
    }

    this.bus.on(event, normalizedListener)
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    this.serviceToEvents.get(listener)!.set(event, unsubscribe)

    return unsubscribe
  }

  /**
   * Unregister listener from the event
   * @param event - event name
   * @param listener - function or Xstate service that was registered for the event
   * @returns true if unregistered successfully
   */
  off(
    event: string,
    listener:
      | Interpreter<any, any, any>
      | ActorRef<any>
      | ((...args: any[]) => void)
      | string
  ): boolean {
    if (isService(listener) || typeof listener === 'string') {
      return this.serviceOff(event, listener)
    }

    return this.fnOff(event, listener)
  }

  protected fnOff(event: string, listener: (...args: any[]) => void) {
    const listenerWrapper = this.listenerToWrapper.get(listener)
    if (listenerWrapper) {
      this.bus.off(event, listenerWrapper)

      return true
    }

    return false
  }

  protected serviceOff(
    event: string,
    listener: Interpreter<any, any, any> | ActorRef<any> | string
  ): boolean {
    const resolvedListener =
      typeof listener === 'string' ? this.getServiceById(listener) : listener

    if (resolvedListener) {
      const listenerData = this.serviceToEvents.get(resolvedListener)
      if (listenerData) {
        const unregisterHandler = listenerData.get(event)
        unregisterHandler && unregisterHandler()
        listenerData.delete(event)

        return true
      }
    }

    return false
  }

  /**
   * Clear all listeners for a specific event
   * @param event - event name
   */
  clear(event: string): void {
    //services
    this.serviceToEvents.forEach((data) => {
      data.delete(event)
    })

    //functions
    this.bus.off(event)
  }

  /**
   * Emit event to all listeners
   * @param event - event to emit
   * @param data - data for the event
   */
  emit(event: string, data?: unknown): void {
    this.bus.emit(event, { event, data })
  }

  /**
   * Register the service with the event bus, so later events can be sent to the
   * service by using the service id property
   * @param service - Xstate service to register
   * @returns function to unregister the service
   */
  register(service: Interpreter<any, any, any, any, any>): () => void {
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

  /**
   * Unregister service from the event bus
   * @param service - Xstate service to unregister
   */
  unregister(service: Interpreter<any, any, any, any, any>): void {
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

  /**
   * Gets service by id
   * @param id  - id of Xstate service
   * @returns Xstate service
   */
  getServiceById<
    TService extends
      | Interpreter<any, any, any, any>
      | ActorRef<any> = Interpreter<any, any, any, any>
  >(id: string): TService | undefined {
    // @ts-expect-error - idToService also returns ActorRef type
    return this.idToService.get(id)
  }

  /**
   * Send a particular event to a particular service
   * @param serviceId - id of Xstate service
   * @param event - event to send
   */
  sendTo<
    TService extends
      | Interpreter<any, any, any, any>
      | ActorRef<any> = Interpreter<any, any, any, any>
  >(
    serviceId: string | string[] | (() => string[]),
    event: EventFrom<TService>
  ): void {
    let ids: string[]
    if (typeof serviceId === 'function') {
      ids = serviceId()
    } else {
      ids = Array.isArray(serviceId) ? serviceId : [serviceId]
    }

    ids.forEach((id) => {
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
    })
    // for (const id of ids) {
    // }
  }
}
