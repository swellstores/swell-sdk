import type { SwellPaginationOptions } from "types/pagination";
import type { SwellSessionOptions } from "types/session";

export type Option = {
	id: string;
	value: string | number;
};

export enum PurchaseOptionType {
	Standard = "standard",
	Subscription = "subscription",
}

export interface InputSubscriptionPurchaseOption {
	type: PurchaseOptionType.Subscription;
	plan: string;
}

export interface InputStandardPurchaseOption {
	type: PurchaseOptionType.Standard;
}

export type PurchaseOption =
	| InputSubscriptionPurchaseOption
	| InputStandardPurchaseOption;

export type ProductFilters<K extends string = string> = {
	price?: [number, number];
	category?: string | string[];
} & {
	[key in K]?: string | string[];
};

export type GetProductListOptions<F extends string = string> = {
	filters?: ProductFilters<F>;
	requestOptions?: SwellSessionOptions;
} & SwellPaginationOptions;
