// Generated by ts-to-zod
import { z } from "zod";
import {
	DeliveryType,
	ProductType,
	OptionInputType,
	BundleItem,
} from "./../../types/api/products/index";

export const deliveryTypeSchema = z.nativeEnum(DeliveryType);

export const productTypeSchema = z.nativeEnum(ProductType);

const contentSchema = z.record(z.unknown());

const attributesSchema = z.record(z.unknown());

export const categorySchema = z.object({
	parent_id: z.string(),
	product_id: z.string(),
	date_created: z.string().optional(),
	date_updated: z.string().optional(),
	id: z.string(),
	sort: z.number().optional(),
});

export const billingScheduleSchema = z.object({
	interval: z.string(),
	interval_count: z.number(),
	limit: z.number().nullable(),
	trial_days: z.number(),
});

export const orderScheduleSchema = z.object({
	interval: z.string(),
	interval_count: z.number(),
	limit: z.number().nullable(),
});

export const priceSchema = z.object({
	price: z.number(),
	quantity_min: z.number().optional().nullable(),
	quantity_max: z.number().optional().nullable(),
});

export const optionInputTypeSchema = z.nativeEnum(OptionInputType);

export const productOptionValueSchema = z.object({
	id: z.string().nullable(),
	name: z.string(),
});

export const extendedOptionValueSchema = productOptionValueSchema.extend({
	price: z.number(),
	description: z.null(),
	shipment_weight: z.number().optional().nullable(),
});

export const crossSellSchema = z.object({
	id: z.string(),
	product_id: z.string(),
	discount_type: z.string(),
	discount_amount: z.number().optional().nullable(),
});

export const upSellSchema = z.object({
	id: z.string(),
	product_id: z.string(),
});

export const fileSchema = z.object({
	id: z.string().optional().nullable(),
	date_uploaded: z.string().optional().nullable(),
	length: z.number().optional().nullable(),
	md5: z.string().optional().nullable(),
	filename: z.null().optional(),
	content_type: z.string().optional().nullable(),
	url: z.string(),
	width: z.number().optional().nullable(),
	height: z.number().optional().nullable(),
});

export const purchaseOptionsStandardSchema = z.object({
	active: z.boolean().optional(),
	price: z.number(),
	sale: z.boolean(),
	sale_price: z.number().optional().nullable(),
	prices: z.array(priceSchema).optional(),
});

export const subscriptionPlanSchema = z.object({
	id: z.string(),
	name: z.string(),
	active: z.boolean().optional(),
	description: z.string().nullable(),
	price: z.number(),
	prices: z.array(priceSchema).optional(),
	billing_schedule: billingScheduleSchema,
	order_schedule: orderScheduleSchema.optional(),
});

export const productOptionSchema = z.object({
	id: z.string(),
	name: z.string(),
	variant: z.boolean(),
	value: z.string().optional(),
	value_id: z.string().optional(),
	values: z
		.array(z.union([productOptionValueSchema, extendedOptionValueSchema]))
		.optional(),
	price: z.number().optional(),
	input_type: optionInputTypeSchema.optional(),
	required: z.boolean().optional(),
	active: z.boolean().optional(),
	attribute_id: z.string().optional(),
	description: z.string().optional().nullable(),
	input_hint: z.string().optional().nullable(),
	parent_id: z.string().optional().nullable(),
});

export const imageSchema = z.object({
	file: fileSchema,
	id: z.string(),
});

export const purchaseOptionsSubscriptionSchema = z.object({
	active: z.boolean().optional(),
	plans: z.array(subscriptionPlanSchema),
});

export const purchaseOptionsSchema = z.object({
	subscription: purchaseOptionsSubscriptionSchema.optional(),
	standard: purchaseOptionsStandardSchema.optional(),
});

export const variantSchema = z.object({
	id: z.string(),
	parent_id: z.string(),
	name: z.string(),
	active: z.boolean(),
	option_value_ids: z.array(z.string()),
	currency: z.string(),
	date_created: z.string().optional(),
	date_updated: z.string().optional(),
	sku: z.string().optional().nullable(),
	attributes: attributesSchema.optional(),
	price: z.number().optional(),
	prices: z.array(priceSchema).optional(),
	purchase_options: purchaseOptionsSchema.optional(),
	sale: z.boolean().optional(),
	sale_price: z.number().optional().nullable(),
});

export const bundleItemSchema: z.ZodSchema<BundleItem> = z.lazy(() =>
	z.object({
		id: z.string(),
		product_id: z.string(),
		variant_id: z.string().optional().nullable(),
		options: z.array(productOptionSchema).optional(),
		quantity: z.number(),
		quantity_total: z.number().optional(),
		variable: z.string().optional(),
		price: z.number().optional(),
		orig_price: z.number().optional(),
		delivery: z.string().optional(),
		shipment_weight: z.number().optional(),
		product_name: z.string().optional(),
		variant: variantSchema.optional().nullable(),
		stock_tracking: z.boolean().optional(),
		bundle_items: z.array(bundleItemSchema).optional(),
	}),
);

export const productSchema = z.object({
	id: z.string(),
	attributes: attributesSchema,
	content: contentSchema.optional(),
	currency: z.string(),
	images: z.array(imageSchema).optional().nullable(),
	name: z.string(),
	options: z.array(productOptionSchema).optional(),
	orig_price: z.number().optional(),
	price: z.number(),
	sale: z.boolean().optional().nullable(),
	sku: z.string().optional().nullable(),
	slug: z.string(),
	stock_level: z.number().optional().nullable(),
	stock_status: z.string().optional().nullable(),
	stock_tracking: z.boolean(),
	description: z.string().optional().nullable(),
	bundle: z.boolean().optional().nullable(),
	meta_description: z.string().optional().nullable(),
	meta_title: z.string().optional().nullable(),
	purchase_options: purchaseOptionsSchema.optional().nullable(),
	tags: z.array(z.string()).optional(),
	prices: z.array(priceSchema).optional(),
	stock_purchasable: z.boolean().optional().nullable(),
	type: productTypeSchema.optional(),
	active: z.boolean().optional(),
	variable: z.boolean().optional(),
	bundle_items: z.array(bundleItemSchema).optional(),
	up_sells: z.array(upSellSchema).optional(),
	cross_sells: z.array(crossSellSchema).optional(),
	virtual: z.boolean().optional(),
	delivery: deliveryTypeSchema.optional().nullable(),
	date_created: z.string().optional(),
	date_updated: z.string().optional(),
	sale_price: z.number().optional().nullable(),
	shipment_delivery: z.boolean().optional(),
});