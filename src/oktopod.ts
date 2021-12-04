import mitt from 'mitt'
import invariant from 'tiny-invariant'
import { Interpreter, InterpreterStatus } from 'xstate'

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

  protected machineToEvents: Map<
    Interpreter<any, any, any>,
    Map<string, () => void>
  >

  protected idToMachine: Map<string, Interpreter<any, any, any>>

  protected listenerToWrapper: Map<
    (...args: any[]) => void,
    (...args: any[]) => void
  >

  constructor() {
    this.bus = mitt()
    this.machineToEvents = new Map()
    this.idToMachine = new Map()
    this.listenerToWrapper = new Map()
  }

  on(event: string, listener: (payload: EventPayload) => void): () => void

  on(
    event: string,
    listener: Interpreter<any, any, any, any>,
    send: string
  ): () => void

  on(
    event: string,
    listener:
      | Interpreter<any, any, any, any>
      | ((payload: EventPayload) => void),
    send?: string
  ): () => void {
    if (listener instanceof Interpreter) {
      //we have machine service
      invariant(
        send,
        `When using machine as listener, please provide send type`
      )
      const listenerData = this.machineToEvents.get(listener)

      if (listenerData) {
        const unregisterHandler = listenerData.get(event)
        if (unregisterHandler) {
          if (__DEV__) {
            console.warn(
              `Event: ${event} is already registered for service: ${listener.id}`
            )
          }

          return unregisterHandler
        }
      } else {
        this.machineToEvents.set(listener, new Map())
        this.idToMachine.set(listener.id, listener)
      }

      const machineListener = normalizeListener((data: EventPayload) => {
        if (listener.status !== InterpreterStatus.Running) {
          if (__DEV__) {
            console.warn(
              `Event ${data.event} not sent to service: ${listener.id} because the service is not running`
            )
          }

          return
        }

        if (listener.state.nextEvents.findIndex((evt) => evt === send) < 0) {
          if (__DEV__) {
            console.warn(
              `Event ${data.event} not sent to service ${listener.id} because the service does not accept event: ${send}`
            )
          }

          return
        }

        listener.send(send, data)
      })

      const unregister = (): void => {
        this.bus.off(event, machineListener)
      }

      this.bus.on(event, machineListener)
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      this.machineToEvents.get(listener)!.set(event, unregister)

      return unregister
    }

    const wrappedListener = normalizeListener(listener)

    this.listenerToWrapper.set(listener, wrappedListener)
    this.bus.on(event, wrappedListener)

    return () => {
      this.bus.off(event, wrappedListener)
      this.listenerToWrapper.delete(listener)
    }
  }

  off(
    event: string,
    listener: Interpreter<any, any, any> | ((...args: any[]) => void)
  ): void {
    if (listener instanceof Interpreter) {
      const listenerData = this.machineToEvents.get(listener)
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
    this.machineToEvents.forEach(
      (data, _machine: Interpreter<any, any, any>) => {
        data.delete(event)
      }
    )

    this.bus.off(event)
  }

  emit(event: string, data?: unknown): void {
    this.bus.emit(event, { event, data })
  }
}
