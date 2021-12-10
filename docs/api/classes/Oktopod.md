[oktopod](../README.md) / Oktopod

# Class: Oktopod

## Table of contents

### Constructors

- [constructor](Oktopod.md#constructor)

### Properties

- [bus](Oktopod.md#bus)
- [idToService](Oktopod.md#idtoservice)
- [listenerToWrapper](Oktopod.md#listenertowrapper)
- [serviceToEvents](Oktopod.md#servicetoevents)

### Methods

- [clear](Oktopod.md#clear)
- [emit](Oktopod.md#emit)
- [getServiceById](Oktopod.md#getservicebyid)
- [off](Oktopod.md#off)
- [on](Oktopod.md#on)
- [register](Oktopod.md#register)
- [serviceOff](Oktopod.md#serviceoff)
- [serviceOn](Oktopod.md#serviceon)
- [unregister](Oktopod.md#unregister)

## Constructors

### constructor

• **new Oktopod**()

#### Defined in

[src/oktopod.ts:32](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L32)

## Properties

### bus

• `Protected` **bus**: `Emitter`<`Record`<`EventType`, `unknown`\>\>

#### Defined in

[src/oktopod.ts:18](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L18)

___

### idToService

• `Protected` **idToService**: `Map`<`string`, `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }\>\>

#### Defined in

[src/oktopod.ts:25](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L25)

___

### listenerToWrapper

• `Protected` **listenerToWrapper**: `Map`<(...`args`: `any`[]) => `void`, (...`args`: `any`[]) => `void`\>

#### Defined in

[src/oktopod.ts:27](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L27)

___

### serviceToEvents

• `Protected` **serviceToEvents**: `Map`<`Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }\>, `Map`<`string`, () => `void`\>\>

#### Defined in

[src/oktopod.ts:20](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L20)

## Methods

### clear

▸ **clear**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:187](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L187)

___

### emit

▸ **emit**(`event`, `data?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `data?` | `unknown` |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:195](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L195)

___

### getServiceById

▸ **getServiceById**<`TContext`, `TStateSchema`, `TEvent`\>(`id`): `undefined` \| `Interpreter`<`TContext`, `TStateSchema`, `TEvent`, { `context`: `TContext` ; `value`: `any`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TContext` | `any` |
| `TStateSchema` | `any` |
| `TEvent` | extends `EventObject` = `EventObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`undefined` \| `Interpreter`<`TContext`, `TStateSchema`, `TEvent`, { `context`: `TContext` ; `value`: `any`  }\>

#### Defined in

[src/oktopod.ts:227](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L227)

___

### off

▸ **off**(`event`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }\> \| (...`args`: `any`[]) => `void` |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:159](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L159)

___

### on

▸ **on**(`event`, `listener`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | (`payload`: [`EventPayload`](../README.md#eventpayload)<`unknown`\>) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/oktopod.ts:39](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L39)

▸ **on**<`TService`\>(`event`, `listener`, `send`): (`unregister?`: `boolean`) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TService` | extends `Interpreter`<`any`, `any`, `any`, `any`, `TService`\> = `Interpreter`<`any`, `any`, `any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | `TService` |
| `send` | `ResolveEventType`<`TService`\>[``"type"``] |

#### Returns

`fn`

▸ (`unregister?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `unregister?` | `boolean` |

##### Returns

`void`

#### Defined in

[src/oktopod.ts:41](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L41)

___

### register

▸ **register**(`service`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }\> |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/oktopod.ts:199](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L199)

___

### serviceOff

▸ `Protected` **serviceOff**(`event`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }\> |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:175](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L175)

___

### serviceOn

▸ `Protected` **serviceOn**<`TService`\>(`event`, `listener`, `send`): (`unregister?`: `boolean`) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TService` | extends `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }, `TService`\> = `Interpreter`<`any`, `any`, `any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | `TService` |
| `send` | `ResolveEventType`<`TService`\>[``"type"``] |

#### Returns

`fn`

▸ (`unregister?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `unregister?` | `boolean` |

##### Returns

`void`

#### Defined in

[src/oktopod.ts:85](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L85)

___

### unregister

▸ **unregister**(`service`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | `Interpreter`<`any`, `any`, `any`, { `context`: `any` ; `value`: `any`  }\> |

#### Returns

`void`

#### Defined in

[src/oktopod.ts:214](https://github.com/ivandotv/oktopod/blob/02ff2b1/src/oktopod.ts#L214)
