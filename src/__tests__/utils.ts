import { Oktopod } from '~/oktopod'

export function factory(): any {
  return {
    bus() {
      return new Oktopod()
    }
  }
}
