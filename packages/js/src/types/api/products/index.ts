import type { BaseModel } from "..";

export * from "./expanded";

export interface Product extends BaseModel {
	active?: boolean | null;
	attributes?: Attributes | null;
	bundle_items?: BundleItem[] | null;
	bundle?: boolean | null;
	categories?: unknown[] | null;
	category_id?: string | null;
	category_index?: CategoryIndex | null;
	category?: unknown | null;
	code?: string | null;
	content?: Content | null;
	cost?: number | null;
	cross_sells?: CrossSell[] | null;
	currency?: string | null;
	customizable?: boolean | null;
	delivery?: DeliveryType | null;
	description?: string | null;
	discontinued?: boolean | null;
	images?: Image[] | null;
	meta_description?: string | null;
	meta_keywords?: string | null;
	meta_title?: string | null;
	name?: string | null;
	options?: ProductOption[] | null;
	orig_price?: number | null;
	price?: number | null;
	prices?: Price[] | null;
	purchase_options?: PurchaseOptions | null;
	quantity_inc?: number | null;
	quantity_min?: number | null;
	related_product_ids?: string[] | null;
	sale_price?: number | null;
	sale?: boolean | null;
	shipment_delivery?: boolean | null;
	shipment_dimensions?: ShipmentDimensions | null;
	shipment_location?: string | null;
	sku?: string | null;
	slug?: string | null;
	stock_level?: number | null;
	stock_purchasable?: boolean | null;
	stock_status?: string | null;
	stock_tracking?: boolean | null;
	tags?: string[] | null;
	type?: ProductType | null;
	up_sells?: UpSell[] | null;
	variable?: boolean | null;
	virtual?: boolean | null;
}

export type DeliveryType = "shipment" | "subscription" | "giftcard";
export type ProductType = "standard" | "digital" | "bundle" | "giftcard";

type Content = Record<string, unknown>;
type Attributes = Record<string, unknown>;

export interface Category {
	parent_id: string;
	product_id: string;
	date_created?: string;
	date_updated?: string;
	id: string;
	sort?: number;
}

export interface Variant {
	active?: boolean | null;
	attributes?: Attributes | null;
	currency?: string | null;
	date_created?: string | null;
	date_updated?: string | null;
	id?: string | null;
	name?: string | null;
	option_value_ids?: string[] | null;
	parent_id?: string | null;
	price?: number | null;
	prices?: Price[] | null;
	purchase_options?: PurchaseOptions | null;
	sale_price?: number | null;
	orig_price?: number | null;
	sale?: boolean | null;
	sku?: string | null;
}

export interface BundleItem {
	bundle_items?: BundleItem[] | null;
	delivery?: string | null;
	id?: string | null;
	options?: ProductOption[] | null;
	orig_price?: number | null;
	price?: number | null;
	product_id?: string | null;
	product_name?: string | null;
	product?: Product | null;
	quantity_total?: number | null;
	quantity?: number | null;
	shipment_weight?: number | null;
	stock_tracking?: boolean | null;
	variable?: string | null;
	variant_id?: string | null;
	variant?: Variant | null;
}

export interface PurchaseOptions {
	standard?: StandardPurchaseOption | null;
	subscription?: SubscriptionPurchaseOption | null;
}

export interface StandardPurchaseOption {
	active?: boolean | null;
	price?: number | null;
	prices?: Price[] | null;
	sale_price?: number | null;
	sale?: boolean | null;
	orig_price?: number | null;
}

export interface SubscriptionPurchaseOption {
	active?: boolean | null;
	plans?: SubscriptionPlan[] | null;
}

export interface SubscriptionPlan {
	active?: boolean | null;
	billing_schedule?: BillingSchedule | null;
	description?: string | null;
	id?: string | null;
	name?: string | null;
	order_schedule?: OrderSchedule | null;
	price?: number | null;
}

export interface BillingSchedule {
	interval_count?: number | null;
	interval?: string | null;
	limit?: number | null;
	trial_days?: number | null;
}

export interface OrderSchedule {
	interval_count?: number | null;
	interval?: string | null;
	limit?: number | null;
}

export interface Price {
	account_group?: string | null;
	price?: number | null;
	quantity_max?: number | null;
	quantity_min?: number | null;
}

export type OptionInputType = "long_text" | "select" | "short_text" | "toggle";

export type ProductOption = {
	active?: boolean | null;
	attribute_id?: string | null;
	description?: string | null;
	id?: string | null;
	input_hint?: string | null;
	input_type?: OptionInputType | null;
	name?: string | null;
	parent_id?: string | null;
	price?: number | null;
	required?: boolean | null;
	value_id?: string | null;
	value?: string | null;
	values?: Array<ProductOptionValue> | null;
	variant?: boolean | null;
};

export interface ProductOptionValue {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	price?: number | null;
	shipment_weight?: number | null;
}

export interface CrossSell {
	discount_amount?: number | null;
	discount_percent?: number | null;
	discount_type?: string | null;
	id?: string | null;
	product_id?: string | null;
}

export interface UpSell {
	id?: string | null;
	product_id?: string | null;
}

export interface Image {
	file?: File | null;
	id?: string | null;
}

export interface File {
	content_type?: string | null;
	date_uploaded?: string | null;
	filename?: string | null;
	height?: number | null;
	id?: string | null;
	length?: number | null;
	md5?: string | null;
	url?: string | null;
	width?: number | null;
}

export type ShipmentDimensionsUnit = "in" | "cm";

export interface ShipmentDimensions {
	height?: number | null;
	length?: number | null;
	unit?: ShipmentDimensionsUnit | null;
	width?: number | null;
}

export interface CategoryIndex {
	id?: string | null;
	sort?: object | null;
}
