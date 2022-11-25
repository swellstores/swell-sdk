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
