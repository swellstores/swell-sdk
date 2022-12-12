export * from "./expanded";

export interface Product {
	id: string;
	attributes: Attributes;
	content?: Content;
	currency: string;
	images?: Image[] | null;
	name: string;
	options?: ProductOption[];
	orig_price?: number;
	price: number;
	sale?: boolean | null;
	sku?: string | null;
	slug: string;
	stock_level?: number | null;
	stock_status?: string | null;
	stock_tracking: boolean;
	description?: string | null;
	bundle?: boolean | null;
	meta_description?: string | null;
	meta_title?: string | null;
	purchase_options?: PurchaseOptions | null;
	tags?: string[];
	prices?: Price[];
	stock_purchasable?: boolean | null;
	type?: ProductType;
	active?: boolean;
	variable?: boolean;
	bundle_items?: BundleItem[];
	up_sells?: UpSell[];
	cross_sells?: CrossSell[];
	virtual?: boolean;
	delivery?: DeliveryType | null;
	date_created?: string;
	date_updated?: string;
	sale_price?: number | null;
	shipment_delivery?: boolean;
}

export enum DeliveryType {
	Shipment = "shipment",
	Subscription = "subscription",
	GiftCard = "giftcard",
}

export enum ProductType {
	Standard = "standard",
	Digital = "digital",
	Bundle = "bundle",
	GiftCard = "giftcard",
}

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
	id: string;
	parent_id: string;
	name: string;
	active: boolean;
	option_value_ids: string[];
	currency: string;
	date_created?: string;
	date_updated?: string;
	sku?: string | null;
	attributes?: Attributes;
	price?: number;
	prices?: Price[];
	purchase_options?: PurchaseOptions;
	sale?: boolean;
	sale_price?: number | null;
}

export interface BundleItem {
	id: string;
	product_id: string;
	variant_id?: string | null;
	options?: ProductOption[];
	quantity: number;
	quantity_total?: number;
	variable?: string;
	price?: number;
	orig_price?: number;
	delivery?: string;
	shipment_weight?: number;
	product_name?: string;
	stock_tracking?: boolean;
	bundle_items?: BundleItem[];
	product?: Product;
	variant?: Variant | null;
}

export interface PurchaseOptions {
	subscription?: SubscriptionPurchaseOption;
	standard?: StandardPurchaseOption;
}

export interface StandardPurchaseOption {
	active?: boolean;
	price: number;
	sale: boolean;
	sale_price?: number | null;
	prices?: Price[];
}

export interface SubscriptionPurchaseOption {
	active?: boolean;
	plans: SubscriptionPlan[];
}

export interface SubscriptionPlan {
	id: string;
	name: string;
	active?: boolean;
	description: string | null;
	price: number;
	prices?: Price[];
	billing_schedule: BillingSchedule;
	order_schedule?: OrderSchedule;
}

export interface BillingSchedule {
	interval: string;
	interval_count: number;
	limit: number | null;
	trial_days: number;
}

export interface OrderSchedule {
	interval: string;
	interval_count: number;
	limit: number | null;
}

export interface Price {
	price: number;
	account_group?: string;
	quantity_min?: number | null;
	quantity_max?: number | null;
}

export enum OptionInputType {
	Select = "select",
	ShortText = "short_text",
	LongText = "long_text",
	Toggle = "toggle",
}

export type ProductOption = {
	id: string;
	name: string;
	variant: boolean;
	value?: string;
	value_id?: string;
	values?: Array<ProductOptionValue | ExtendedOptionValue>;
	price?: number;
	input_type?: OptionInputType;
	required?: boolean;
	active?: boolean;
	attribute_id?: string;
	description?: string | null;
	input_hint?: string | null;
	parent_id?: string | null;
};

export interface ProductOptionValue {
	id: string | null; //weird but happened
	name: string;
}

export interface ExtendedOptionValue extends ProductOptionValue {
	price: number;
	description: null;
	shipment_weight?: number | null;
}

export interface CrossSell {
	id: string;
	product_id: string;
	discount_type: string;
	discount_amount?: number | null;
	discount_percent?: number | null;
}

export interface UpSell {
	id: string;
	product_id: string;
}

export interface Image {
	file: File;
	id: string;
}

export interface File {
	id?: string | null;
	date_uploaded?: string | null;
	length?: number | null;
	md5?: string | null;
	filename?: string | null;
	content_type?: string | null;
	url: string;
	width?: number | null;
	height?: number | null;
}
