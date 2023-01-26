import type { SwellCamelCaseClient, SwellClient } from "client/types";

type CamelCaseKey<T extends string> =
	T extends `${infer K1}_${infer K2}${infer K3}`
		? `${Lowercase<K1>}${Uppercase<K2>}${CamelCaseKey<K3>}`
		: Lowercase<T>;

type PreserveNull<T, P> = T extends null ? P | null : P;

export type CamelCase<T extends object | undefined | null> = {
	[K in keyof T as CamelCaseKey<string & K>]: T[K] extends
		| Array<infer U>
		| undefined
		| null
		? // extends array
		  U extends object | undefined | null
			? // array of objects
			  PreserveNull<T[K], Array<CamelCase<U>>>
			: // array of primitives
			  T[K]
		: // not array
		T[K] extends object | undefined | null
		? CamelCase<T[K]>
		: T[K];
};

export type SwitchCamelCase<
	C extends SwellClient | SwellCamelCaseClient,
	T extends object | undefined | null,
> = C extends SwellCamelCaseClient ? CamelCase<T> : T;
