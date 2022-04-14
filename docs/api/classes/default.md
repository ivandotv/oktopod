[oktopod](../README.md) / default

# Class: default

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [actions](default.md#actions)

### Methods

- [clear](default.md#clear)
- [emit](default.md#emit)
- [getServiceById](default.md#getservicebyid)
- [off](default.md#off)
- [on](default.md#on)
- [register](default.md#register)
- [sendTo](default.md#sendto)
- [unregister](default.md#unregister)

## Constructors

### constructor

• **new default**()

#### Defined in

[src/oktopod.ts:39](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L39)

## Properties

### actions

• **actions**: `Object`

Xstate action helpers bound to the current instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `emit` | (`eventName`: `string` \| (`ctx`: `any`, `evt`: `any`) => `string`, `data`: `any`) => `any` |
| `forwardTo` | (`serviceId`: `string` \| `string`[] \| (`ctx`: `any`, `evt`: `any`) => `string` \| `string`[], `strict?`: `boolean`) => (`ctx`: `any`, `evt`: `any`) => `void` |
| `sendTo` | <TService\>(`serviceId`: `string` \| `string`[] \| (`ctx`: `any`, `evt`: `any`) => `string` \| `string`[], `event`: `ResolveEventType`<`TService`\> \| (`ctx`: `any`, `evt`: `any`) => `ResolveEventType`<`TService`\>, `strict?`: `boolean`) => (`ctx`: `any`, `evt`: `any`) => `void` |

#### Defined in

[src/oktopod.ts:37](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L37)

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

[src/oktopod.ts:224](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L224)

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

[src/oktopod.ts:239](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L239)

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

[src/oktopod.ts:288](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L288)

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

[src/oktopod.ts:173](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L173)

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

[src/oktopod.ts:49](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L49)

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

[src/oktopod.ts:59](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L59)

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

[src/oktopod.ts:249](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L249)

___

### sendTo

▸ **sendTo**<`TService`\>(`serviceId`, `event`, `strict?`): `void`

Send a particular event to a particular service

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TService` | extends `ActorRef`<`any`, `any`\> \| `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> = `Interpreter`<`any`, `any`, `any`, `any`, `TypegenDisabled`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceId` | `string` \| `string`[] | id of Xstate service |
| `event` | `ResolveEventType`<`TService`\> | event to send |
| `strict?` | `boolean` | if true, and service to send the event is not present, event bus will throw error |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:303](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L303)

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

[src/oktopod.ts:268](https://github.com/ivandotv/oktopod/blob/50bc108/src/oktopod.ts#L268)
