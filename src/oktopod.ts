import mitt from 'mitt'
import invariant from 'tiny-invariant'
import { Interpreter } from 'xstate'

export type Payload<TData = unknown> = {
  event: string
  data: TData
}

function normalizeListener(cb: (data: Payload) => void): () => void {
  return (...args: any[]): void => {
    console.log('wrapper', args)
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

  constructor() {
    this.bus = mitt()
    this.machineToEvents = new Map()
  }

  on(event: string, listener: (payload: Payload) => void): () => void

  on(
    event: string,
    listener: Interpreter<any, any, any, any>,
    send?: string
  ): () => void

  on(
    event: string,
    listener: Interpreter<any, any, any, any> | ((payload: Payload) => void),
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
            console.log(
              `Event: ${event} is already registered for service: ${listener.id}`
            )
          }

          return unregisterHandler
        }
      } else {
        this.machineToEvents.set(listener, new Map())
      }

      const machineListener = normalizeListener((data: Payload) => {
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

    const regularListener = normalizeListener(listener)

    this.bus.on(event, regularListener)

    return () => {
      this.bus.off(event, regularListener)
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
        if (listenerData.size === 0) {
          //there is no more events registered for the machine
          this.machineToEvents.delete(listener)
        }
      }

      return
    }
    this.bus.off(event, listener)
  }

  offAll(event: string): void {
    this.machineToEvents.forEach(
      (data, machine: Interpreter<any, any, any>) => {
        data.delete(event)
        if (!data.size) {
          //machine has no more events remove reference to the machine
          this.machineToEvents.delete(machine)
        }
      }
    )

    this.bus.off(event)
  }

  removeMachine(machine: Interpreter<any, any, any>): void {
    const eventData = this.machineToEvents.get(machine)
    if (eventData) {
      eventData.forEach((unsubscribe) => unsubscribe())
      this.machineToEvents.delete(machine)
    }
  }

  emit(event: string, data: unknown): void {
    this.bus.emit(event, { event, data })
  }

  clear(): void {
    this.bus.all.clear()
    this.machineToEvents.clear()
  }

  destroy(): void {
    this.clear()
  }
}
