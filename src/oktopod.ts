import mitt from 'mitt'
import invariant from 'tiny-invariant'

export type Payload<TData = unknown> = {
  event: string
  data: TData
}
export class Oktopod {
  protected bus: ReturnType<typeof mitt>

  //ovo nije dobro - moram da mapiram
  // event + id = listener
  protected idToListener: Map<string, any>

  constructor() {
    this.bus = mitt()
    this.idToListener = new Map()
  }

  //TODO - koristiti handler type is mitt-a
  on(event: string, listener: (...args: unknown[]) => void, id?: string): void {
    if (id) {
      invariant(
        !this.idToListener.get(id),
        `Listener with ${id} is already registered `
      )

      this.idToListener.set(id, listener)
    }

    this.bus.on(event, listener)
  }

  emit(event: string, data: unknown): void {
    this.bus.emit(event, { event, data })
  }

  get<T = unknown>(id: string): T {
    return this.idToListener.get(id)
  }

  //TODO - ovo
  off(event: string, listener: (...args: any[]) => void): void

  off(event: string, id: string): void

  off(event: string, id: string | ((...args: any[]) => void)): void {
    // event = event ?? '*'
    if (typeof id === 'string') {
      //find the string and unregister
      const listener = this.idToListener.get(id)
      if (listener) {
        this.bus.off(event, listener)
      }
    } else {
      this.bus.off(event, id)
    }

    //TODO - this.bus.all , sta ima u keys  a sta u values
    // off - event , listener
    // off -  event, id
    // off - all events , listener
    // off - all events , id
  }

  clear(): void {
    this.bus.all.clear()
  }

  destroy(): void {
    this.clear()
  }
}
