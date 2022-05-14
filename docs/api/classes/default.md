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

[src/oktopod.ts:42](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L42)

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

[src/oktopod.ts:40](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L40)

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

[src/oktopod.ts:227](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L227)

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

[src/oktopod.ts:242](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L242)

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

[src/oktopod.ts:291](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L291)

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

[src/oktopod.ts:176](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L176)

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

[src/oktopod.ts:52](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L52)

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

[src/oktopod.ts:62](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L62)

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

[src/oktopod.ts:252](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L252)

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

[src/oktopod.ts:306](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L306)

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

[src/oktopod.ts:271](https://github.com/ivandotv/oktopod/blob/b0ed172/src/oktopod.ts#L271)
