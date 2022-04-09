[oktopod](../README.md) / default

# Class: default

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [actions](default.md#actions)
- [bus](default.md#bus)
- [idToService](default.md#idtoservice)
- [listenerToWrapper](default.md#listenertowrapper)
- [serviceToEvents](default.md#servicetoevents)

### Methods

- [clear](default.md#clear)
- [emit](default.md#emit)
- [fnOff](default.md#fnoff)
- [fnOn](default.md#fnon)
- [getServiceById](default.md#getservicebyid)
- [off](default.md#off)
- [on](default.md#on)
- [register](default.md#register)
- [sendTo](default.md#sendto)
- [serviceOff](default.md#serviceoff)
- [serviceOn](default.md#serviceon)
- [unregister](default.md#unregister)

## Constructors

### constructor

• **new default**()

#### Defined in

[src/oktopod.ts:40](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L40)

## Properties

### actions

• **actions**: `Object`

Xstate action helpers bound to the current instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `emit` | (`eventName`: `string` \| (`ctx`: `any`, `evt`: `any`) => `string`, `data`: `any`) => `any` |
| `forwardTo` | (`serviceId`: `string` \| `string`[] \| (`ctx`: `any`, `evt`: `any`) => `string` \| `string`[]) => (`ctx`: `any`, `evt`: `any`) => `void` |
| `sendTo` | <TService\>(`serviceId`: `string` \| `string`[] \| (`ctx`: `any`, `evt`: `any`) => `string` \| `string`[], `event`: `ResolveEventType`<`TService`\> \| (`ctx`: `any`, `evt`: `any`) => `ResolveEventType`<`TService`\>) => (`ctx`: `any`, `evt`: `any`) => `void` |

#### Defined in

[src/oktopod.ts:38](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L38)

___

### bus

• `Protected` **bus**: `Emitter`<`Record`<`EventType`, `unknown`\>\>

#### Defined in

[src/oktopod.ts:18](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L18)

___

### idToService

• `Protected` **idToService**: `Map`<`string`, `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }, `TypegenDisabled`\> \| `ActorRef`<`any`, `any`\>\>

#### Defined in

[src/oktopod.ts:25](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L25)

___

### listenerToWrapper

• `Protected` **listenerToWrapper**: `Map`<(...`args`: `any`[]) => `void`, (...`args`: `any`[]) => `void`\>

#### Defined in

[src/oktopod.ts:30](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L30)

___

### serviceToEvents

• `Protected` **serviceToEvents**: `Map`<`Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }, `TypegenDisabled`\> \| `ActorRef`<`any`, `any`\>, `Map`<`string`, () => `void`\>\>

#### Defined in

[src/oktopod.ts:20](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L20)

## Methods

### clear

▸ **clear**(`event`): `void`

Clear all listeners for a specific event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | event name |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:226](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L226)

___

### emit

▸ **emit**(`event`, `data?`): `void`

Emit event to all listeners

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | event to emit |
| `data?` | `unknown` | data for the event |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:241](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L241)

___

### fnOff

▸ `Protected` **fnOff**(`event`, `listener`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`boolean`

#### Defined in

[src/oktopod.ts:190](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L190)

___

### fnOn

▸ `Protected` **fnOn**(`event`, `listener`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | (`payload`: [`EventPayload`](../README.md#eventpayload)<`any`\>) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/oktopod.ts:91](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L91)

___

### getServiceById

▸ **getServiceById**<`TService`\>(`id`): `undefined` \| `TService`

Gets service by id

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TService` | extends `ActorRef`<`any`, `any`\> \| `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> = `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of Xstate service |

#### Returns

`undefined` \| `TService`

Xstate service

#### Defined in

[src/oktopod.ts:290](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L290)

___

### off

▸ **off**(`event`, `listener`): `boolean`

Unregister listener from the event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | event name |
| `listener` | `string` \| `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }, `TypegenDisabled`\> \| `ActorRef`<`any`, `any`\> \| (...`args`: `any`[]) => `void` | function or Xstate service that was registered for the event |

#### Returns

`boolean`

true if unregistered successfully

#### Defined in

[src/oktopod.ts:175](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L175)

___

### on

▸ **on**(`event`, `listener`): () => `void`

Subscribe to the event with a function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | event to subscribe to |
| `listener` | (`payload`: [`EventPayload`](../README.md#eventpayload)<`any`\>) => `void` | function to be triggered |

#### Returns

`fn`

function to unsubscribe

▸ (): `void`

Subscribe to the event with a function

##### Returns

`void`

function to unsubscribe

#### Defined in

[src/oktopod.ts:50](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L50)

▸ **on**<`TService`\>(`event`, `listener`, `send`): (`unregister?`: `boolean`) => `void`

Subscribe  Xstate service to an event

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TService` | extends `ActorRef`<`any`, `any`\> \| `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> = `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | event name |
| `listener` | `TService` | Xstate service |
| `send` | `ResolveEventType`<`TService`\>[``"type"``] | event to send to the service |

#### Returns

`fn`

function to unsubscribe if true is passed as the first argument service will be
also unregistered from the event bus

▸ (`unregister?`): `void`

Subscribe  Xstate service to an event

##### Parameters

| Name | Type |
| :------ | :------ |
| `unregister?` | `boolean` |

##### Returns

`void`

function to unsubscribe if true is passed as the first argument service will be
also unregistered from the event bus

#### Defined in

[src/oktopod.ts:60](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L60)

___

### register

▸ **register**(`service`): () => `void`

Register the service with the event bus, so later events can be sent to the
service by using the service id property

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `service` | `Interpreter`<`any`, `any`, `any`, `any`, `any`\> | Xstate service to register |

#### Returns

`fn`

function to unregister the service

▸ (): `void`

Register the service with the event bus, so later events can be sent to the
service by using the service id property

##### Returns

`void`

function to unregister the service

#### Defined in

[src/oktopod.ts:251](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L251)

___

### sendTo

▸ **sendTo**<`TService`\>(`serviceId`, `event`): `void`

Send a particular event to a particular service

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TService` | extends `ActorRef`<`any`, `any`\> \| `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> = `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceId` | `string` \| `string`[] \| () => `string`[] | id of Xstate service |
| `event` | `ResolveEventType`<`TService`\> | event to send |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:304](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L304)

___

### serviceOff

▸ `Protected` **serviceOff**(`event`, `listener`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | `string` \| `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }, `TypegenDisabled`\> \| `ActorRef`<`any`, `any`\> |

#### Returns

`boolean`

#### Defined in

[src/oktopod.ts:201](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L201)

___

### serviceOn

▸ `Protected` **serviceOn**<`TService`\>(`event`, `listener`, `send`): (`unregister?`: `boolean`) => `void`

Register Xstate service with the event bus

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TService` | extends `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }, `TypegenDisabled`\> \| `ActorRef`<`any`, `any`\> = `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | event name |
| `listener` | `TService` | Xstate service |
| `send` | `ResolveEventType`<`TService`\>[``"type"``] | event to send to the service |

#### Returns

`fn`

unregister function

▸ (`unregister?`): `void`

Register Xstate service with the event bus

##### Parameters

| Name | Type |
| :------ | :------ |
| `unregister?` | `boolean` |

##### Returns

`void`

unregister function

#### Defined in

[src/oktopod.ts:109](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L109)

___

### unregister

▸ **unregister**(`service`): `void`

Unregister service from the event bus

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `service` | `Interpreter`<`any`, `any`, `any`, `any`, `any`\> | Xstate service to unregister |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:270](https://github.com/ivandotv/oktopod/blob/529045f/src/oktopod.ts#L270)
