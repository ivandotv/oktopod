# Oktopod

Event Bus for Xstate Machines

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ivandotv/oktopod/Test)
![Codecov](https://img.shields.io/codecov/c/gh/ivandotv/oktopod)
[![GitHub license](https://img.shields.io/github/license/ivandotv/oktopod)](https://github.com/ivandotv/oktopod/blob/main/LICENSE)

This is a small (less than 1KB) event bus implementation that is primarily made for sending events between Xstate services that are completely decoupled, and it also supports regular listeners (functions).

Play with a simple demo on [codesandbox](https://codesandbox.io/s/xstate-event-bus-demo-nvrhje?file=/src/App.tsx)

<!-- toc -->

- [Motivation](#motivation)
- [Installation](#installation)
- [Communication between services](#communication-between-services)
  - [Registering the service with the event bus](#registering-the-service-with-the-event-bus)
  - [Event bus action helpers](#event-bus-action-helpers)
    - [sendTo](#sendto)
    - [forwardTo](#forwardto)
    - [emit](#emit)
- [Register Service for event bus events](#register-service-for-event-bus-events)
- [Simple function listeners](#simple-function-listeners)
  - [Unregister all listeners](#unregister-all-listeners)
- [API docs](#api-docs)
- [License](#license)

<!-- tocstop -->

## Motivation

After working with Xstate on a couple of projects, one problem was always present. At some point, there was always a need to enable communication between services that are completely decoupled. There was a need for some kind of event bus. So I've made this little module that enables just that.

This module is a specialized event bus that can route events between services.

## Installation

```sh
npm install oktopod
```

## Communication between services

There are two ways for the event bus to work with Xstate services.

1. By registering the service with the event bus. When the service is registered, other services can send events directly to the registered service, just by knowing the service id.

2. Register the service with the event bus for specific events. This way the service can respond to any event that is emitted via the event bus.

### Registering the service with the event bus

Let's start with creating the machine, starting the service, and registering the service with the event bus.

```ts
import Oktopod from 'oktopod'
import { interpret } from 'xstate'
import { createMachine } from './machines'
// create the event bus
const eventBus = new Oktopod()

const service = interpret(createMachine()).start()

const unregisterFn = eventBus.register(service)
//unreigster later
unregisterFn()
// or
eventBus.unreigster(service)
```

When the service is registered with the event bus, it can be retrieved with the service `id`

```ts
eventBus.getServiceById(service.id)
```

Other services can send events directly to the registered service, all they need is access to the event bus.

In the next example, the service (`machineTwo`) has access to the event bus, and when the service receives the `SEND_HELLO` event, it will send the `HELLO` event with data `{foo:'bar'}` to the service with the `id` of `machineOne` (which is registered with the event bus)

```ts
export function machineTwo(eventBus: Oktopod) {
  // event bus has special actions for xstate services
  const { sendTo } = eventBus.actions

  return {
    id: 'machineTwo',
    initial: 'idle',
    states: {
      idle: {
        on: {
          SEND_HELLO: {
            actions: sendTo('machineOne', {
              type: 'HELLO',
              data: { foo: 'bar' }
            })
          }
        }
      }
    }
  }
}

const machineOne = {
  id: 'machineOne',
  initial: 'idle',
  states: {
    idle: {
      on: {
        HELLO: {
          //^  triggered via event bus
          actions: (_ctx, evt) => {
            //evt: {type: 'HELLO', data:{foo:'bar'}}
          }
        }
      }
    }
  }
}

const serviceOne = interpret(machineOne).start()
//serviceTwo needs access to the even bus
const serviceTwo = interpret(machineTwo(eventBus)).start()

//serviceOne needs to be registered with the event bus
eventBus.register(serviceOne)

serviceTwo.send({ type: 'SEND_HELLO' })
```

Another way to send the even to the machine is by using the event bus directly.

```ts
eventBus.register(serviceOne)

/*
if useStrict is true, the event bus will throw if
service is not present or does not accept the event
 */
const useStrict = true
eventBus.sendTo(
  service.id,
  {
    type: 'EVENT_A',
    data
  },
  useStrict
)
```

Few very important things to keep in mind:

- `serviceOne` will **only** receive the `HELLO` event if the machine is in the state where one of the next accepted events is `HELLO`. This protects from services that have `strict` mode enabled (which throws an error if the service can't receive the event that is sent to it)

- `serviceOne` will **only** receive the event if it running. If the service is in a `final` state then the event will not be sent.

### Event bus action helpers

As seen in the previous example event bus comes with some `xstate actions` that can be used from inside the machine.
You can access them via `actions` property on the `Oktopod` instance

```ts
eventBusInstance.actions //property
```

`actions` property is bound to the event bus instance so it can safely be de-structured

```ts
const { sendTo, forwardTo } = eventBusInstance.actions
```

#### sendTo

`sendTo` Sends an event to Xstate service that is registered with the event bus.

```ts
sendTo('machineOne', {
  // or array of id's ['machineOne','machineX']
  type: 'HELLO',
  data: { foo: 'bar' }
})

// OR

sendTo(
  (ctx, evt) => {
    return 'moonMachine'
    // or
    return ['machineOne', 'machineX', 'machineY']
  },
  (ctx, evt) => {
    return {
      type: 'HELLO',
      data: { earthTemp: '46℃' }
    }
  }
)
// OR
// combination of the above

//strict mode
sendTo('machineOne', {}, true)
```

In `strict` mode (third argument), the event bus will an throw error if the service that is being sent to is not registered with the event bus.

#### forwardTo

`forwardTo` Forwards the received event to a service that is registered with the event bus. In the next example, `machineOne` will forward `SOME_EVENT` to `machineTwo` (which is registered with the event bus).

```ts
const { forwardTo } = eventBusInstance.actions

createMachine({
  id: 'machineOne',
  initial: 'idle',
  context: {},
  states: {
    idle: {
      on: {
        SOME_EVENT: {
          actions: [forwardTo('machineTwo')]
        }
      }
    }
  }
})
```

You can use it like this:

```ts
forwardTo('machineOne')

// or
forwardTo(['machineOne', 'machineTwo', 'machineThree'])
// or
forwardTo((ctx, evt) => {
  return 'machineOne'
  // or
  return ['machineOne', 'machineTwo', 'machineThree']
})
//strict mode
forwardTo('machineOne', true)
```

In `strict` mode, the event bus will throw an error if the service that is being forwarded to is not registered with the event bus.

#### emit

`emit` Emits the event on the event bus and any listeners that are registered for that specific event will be triggered.

```ts
emit('HELLO_WORLD', { foo: 'bar' })
// OR
emit(
  (ctx, evt) => {
    return 'HELLO_WORLD'
  },
  (ctx: any) => {
    return { foo: 'bar' }
  }
)
```

## Register Service for event bus events

In addition to facilitating communication between services,
event bus can directly register xstate service to respond to events that are sent via event bus (you can also register for all events that are emitted from the even bus by using a `"*"` as event name)

```ts
const eventBus = new Oktopod()

const unsubscribeFn = bus.on('HELLO_WORLD', service, 'EVENT_ON_SERVICE')
//or register for all events
const unsubscribeFn = bus.on('*', service, 'EVENT_ON_SERVICE')

//emit the event
eventBus.emit('HELLO_WORLD', { foo: 'bar' })

//example machine
const machine = {
  initial: 'idle',
  context: {},
  states: {
    idle: {
      on: {
        EVENT_ON_SERVICE: {
          actions: (ctx, evt) => {
            // evt will be:
            //   {
            //   type: 'EVENT_ON_SERVICE', <- xstate event
            //   event: 'HELLO_WORLD', <- bus event
            //   data: { foo: 'bar' } <- bus event data
            // }
          }
        }
      }
    }
  }
}

//unregister later
unsubscribeFn()
// or
eventBus.off('HELLO_WORLD', service)
```

In the example above, machine service has been registered for the `HELLO_WORLD` event on the event bus, and when that event is emitted, the service will receive `EVENT_ON_SERVICE` event.

Like in the _service to service_ communication previously documented, the service will not receive the event if it is not supported, or the service is not running (it's in its final state, and doesn't accept any events)

## Simple function listeners

> Note: This part has nothing to do with xstate services

Event bus can also accept functions as listeners. This functionality enables you to hook other parts of your app to the event bus.

```ts
import Oktopod, { EventPayload } from 'oktopod'

const eventBus = new Oktopod()

//register simple function
const listener = (evt: EventPayload<{ foo: string }>) => {
  //  evt will be:
  //{ data: { foo: 'bar' }, event: 'hello' }
}

const unregister = eventBus.on('hello', listener)
//unregister later
unregister()
// or
eventBus.off('hello', listener)

//trigger the listener
eventBus.emit('hello', { foo: 'bar' })
```

### Unregister all listeners

You can unregister all listeners for a specific event. This will clear all listeners (services and functions).

```ts
eventBus.clear('event_name')
```

## API docs

`Oktopod` is written in TypeScript, [auto generated API documentation](docs/api/README.md) is available.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

`Oktopod` means `Octopus` in Serbian :)
