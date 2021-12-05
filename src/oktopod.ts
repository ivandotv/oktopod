import mitt from 'mitt'
import invariant from 'tiny-invariant'
import { EventObject, Interpreter, InterpreterStatus } from 'xstate'

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
    Interpreter<any, any, any>,
    Map<string, () => void>
  >

  protected idToService: Map<string, Interpreter<any, any, any>>

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

  on(
    event: string,
    listener: Interpreter<any, any, any, any>,
    send: string
  ): (unregister?: boolean) => void

  on(
    event: string,
    listener:
      | Interpreter<any, any, any, any>
      | ((payload: EventPayload) => void),
    send?: string
  ): () => void | ((unregister?: boolean) => void) {
    if (listener instanceof Interpreter) {
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

  protected serviceOn(
    event: string,
    listener: Interpreter<any, any, any, any>,
    send?: string
  ): (unregister?: boolean) => void {
    invariant(send, `When using machine as listener, please provide send type`)

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

    const machineListener = normalizeListener((data: EventPayload) => {
      if (listener.status !== InterpreterStatus.Running) {
        /* istanbul ignore next */
        if (__DEV__) {
          console.warn(
            `Event ${data.event} not sent to service: ${listener.id} because the service is not running`
          )
        }

        return
      }

      if (listener.state.nextEvents.findIndex((evt) => evt === send) < 0) {
        /* istanbul ignore next */
        if (__DEV__) {
          console.warn(
            `Event ${data.event} not sent to service ${listener.id} because the service does not accept event: ${send}`
          )
        }

        return
      }

      listener.send(send, data)
    })

    const unsubscribe = (unregister = false): void => {
      if (unregister) {
        this._unregister(listener)

        return
      }
      this.bus.off(event, machineListener)
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      this.serviceToEvents.get(listener)!.delete(event)
    }

    this.bus.on(event, machineListener)
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    this.serviceToEvents.get(listener)!.set(event, unsubscribe)

    return unsubscribe
  }

  off(
    event: string,
    listener: Interpreter<any, any, any> | ((...args: any[]) => void)
  ): void {
    if (listener instanceof Interpreter) {
      const listenerData = this.serviceToEvents.get(listener)
      if (listenerData) {
        const unregisterHandler = listenerData.get(event)
        unregisterHandler && unregisterHandler()
        listenerData.delete(event)
      }

      return
    }

    const listenerWrapper = this.listenerToWrapper.get(listener)
    if (listenerWrapper) {
      this.bus.off(event, listenerWrapper)
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

  private _register(service: Interpreter<any, any, any>): void {
    if (!this.serviceToEvents.get(service)) {
      this.serviceToEvents.set(service, new Map())
      this.idToService.set(service.id, service)
    }
  }

  unregister(service: Interpreter<any, any, any>): void {
    this._unregister(service)
  }

  private _unregister(service: Interpreter<any, any, any>): void {
    const eventData = this.serviceToEvents.get(service)
    if (eventData) {
      eventData.forEach((unsubscribe) => unsubscribe())
      this.serviceToEvents.delete(service)
    }
    this.idToService.delete(service.id)
  }

  getServiceById<
    TContext = any,
    TStateSchema = any,
    TEvent extends EventObject = EventObject
  >(id: string): Interpreter<TContext, TStateSchema, TEvent> | undefined {
    return this.idToService.get(id)
  }
}
