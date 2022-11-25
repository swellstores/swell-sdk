type CamelCaseKey<T extends string> =
	T extends `${infer K1}_${infer K2}${infer K3}`
		? `${Lowercase<K1>}${Uppercase<K2>}${CamelCaseKey<K3>}`
		: Lowercase<T>;

export type CamelCase<T extends object | undefined | null> = {
	[K in keyof T as CamelCaseKey<string & K>]: T[K] extends Array<
		infer U extends object
	>
		? Array<CamelCase<U>>
		: T[K] extends object | undefined | null
		? CamelCase<T[K]>
		: T[K];
};
