import type { SwellAttributes, SwellPaginationOptions } from "types/query";
import type { SwellSessionOptions } from "types/session";

export type Option = {
	id: string;
	value: string | number;
};

// export type PurchaseOptionType = "standard" | "subscription";

// interface InputStandardPurchaseOption {
// 	type: "standard";
// }
// interface InputSubscriptionPurchaseOption {
// 	type: "subscription";
// 	planId: string;
// }

// type SelectedPurchaseOption =
// 	| InputSubscriptionPurchaseOption
// 	| InputStandardPurchaseOption;

// interface PurchaseOptions {
// 	subscription?: SubscriptionPurchaseOption;
// 	standard?: StandardPurchaseOption;
// }

// interface StandardPurchaseOption {
// 	active: boolean;
// 	price: number;
// 	sale: boolean;
// 	salePrice?: number;
// 	prices: Price[];
// }

// interface Price {
// 	price: number;
// 	quantityMin?: number;
// 	quantityMax?: number;
// 	accountGroup?: string;
// }

// interface SubscriptionPurchaseOption {
// 	active: boolean;
// 	plans: SubscriptionPlan[];
// }

// export interface SubscriptionPlan {
// 	id: string;
// 	name: string;
// 	active: boolean;
// 	description?: string;
// 	price: number;
// 	prices?: Price[];
// 	billingSchedule: BillingSchedule;
// 	orderSchedule: OrderSchedule;
// }

// export interface Schedule {
// 	interval: number;
// 	intervalUnit: string;
// 	limit?: number;
// }

// export interface BillingSchedule extends Schedule {
// 	trialDays?: number;
// }

// type OrderSchedule = Schedule;

export type ProductFilters<F extends string> = {
	price?: [number, number];
	category?: string | string[];
	attributes?: SwellAttributes<F>;
};

export type GetProductListOptions<F extends string = string> = {
	filters?: ProductFilters<F>;
	requestOptions?: SwellSessionOptions;
} & SwellPaginationOptions;

export type GetProductExpandOptions =
	| "categories"
	| "variants"
	| "up_sells.product";

export type SelectedProductOption = {
	optionId: string;
	valueId: string;
};

type StripExpandedAmount<T extends ExpandableField<string>> =
	T extends `${infer K}:${number}` ? K : T;

export type ExpandableField<T extends string> = T | `${T}:${number}`;

export type Expand<
	K extends string,
	E extends any[],
	T extends object,
> = K extends StripExpandedAmount<E[number]> ? T : unknown;

export type ExpandableFields = Array<ExpandableField<GetProductExpandOptions>>;

export type GetProductOptions<E extends ExpandableFields> = {
	expand?: E;
	requestOptions?: SwellSessionOptions;
};

// export type GetProductOptions2<T> = T extends ExpandableFields
// 	? GetProductOptions<T>
// 	: never;

export type PurchaseOption =
	| InputSubscriptionPurchaseOption
	| InputStandardPurchaseOption;

export type ProductFilters<F extends string> = {
	price?: [number, number];
	category?: string | string[];
	attributes?: SwellAttributes<F>;
};

export type GetProductListOptions<F extends string = string> = {
	filters?: ProductFilters<F>;
	requestOptions?: SwellSessionOptions;
} & SwellPaginationOptions;
