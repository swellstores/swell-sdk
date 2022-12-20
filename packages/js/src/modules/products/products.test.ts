import { describe, it, vi, expect, afterEach, beforeEach } from "vitest";
import { init } from "client";
import request from "request";
import { getProduct, getProductList } from "./products";

vi.mock("request");

describe("modules/products", () => {
	beforeEach(() => {
		vi.mocked(request).mockImplementationOnce(() => Promise.resolve({}));
	});

	afterEach(() => {
		vi.resetModules();
		vi.restoreAllMocks();
	});

	const client = init({ key: "test-key", store: "test-store" });

	describe("getProduct", () => {
		it('should call request with "GET" and "products/:id"', async () => {
			await getProduct(client, "product-id");

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products/product-id",
				{},
			);
		});

		it('should call request with "GET" and "products/:slug"', async () => {
			await getProduct(client, "product-slug");

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products/product-slug",
				{},
			);
		});

		it("should call request with requestOptions", async () => {
			await getProduct(client, "product-id", {
				requestOptions: {
					sessionToken: "test-session",
					locale: "test-locale",
					currency: "test-currency",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products/product-id",
				{
					sessionToken: "test-session",
					locale: "test-locale",
					currency: "test-currency",
				},
			);
		});

		it("should call request with expand", async () => {
			await getProduct(client, "product-id", {
				expand: ["categories", "variants"],
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products/product-id",
				{
					searchParams: {
						expand: "categories,variants",
					},
				},
			);
		});
	});

	describe("getProductList", () => {
		it('should call request with "GET" and "products"', async () => {
			await getProductList(client);

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.any(Object),
			);
		});

		it("should call request with requestOptions", async () => {
			await getProductList(client, {
				requestOptions: {
					currency: "EUR",
					locale: "es-ES",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					currency: "EUR",
					locale: "es-ES",
				}),
			);
		});

		it("should call request with pagination options", async () => {
			await getProductList(client, {
				page: 2,
				limit: 10,
				sort: "price",
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: expect.objectContaining({
						page: 2,
						limit: 10,
						sort: "price",
					}),
				}),
			);
		});

		it("should call request with category filter", async () => {
			await getProductList(client, {
				filters: {
					category: "test-category",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							category: "test-category",
						},
					},
				}),
			);
		});

		it("should call request with attribute filters", async () => {
			await getProductList(client, {
				filters: {
					attributes: {
						brand: "test-brand",
					},
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							brand: "test-brand",
						},
					},
				}),
			);
		});

		it("should call request with price filter", async () => {
			await getProductList(client, {
				filters: {
					price: [10, 20],
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							price: [10, 20],
						},
					},
				}),
			);
		});
	});

	describe("getActiveVariant", () => {
		it("should return the base product's data when there are no variants", () => {
			expect(getActiveVariant(baseProduct)).toEqual({
				productId: baseProduct.id,
				priceData: {},
			});
			expect(getActiveVariant(standardPriceOnlyProduct)).toEqual({
				productId: standardPriceOnlyProduct.id,
				priceData: {
					standard: standardPriceOnlyProduct.purchaseOptions?.standard,
				},
			});
			expect(getActiveVariant(subscriptionPriceOnlyProduct)).toEqual({
				productId: subscriptionPriceOnlyProduct.id,
				priceData: {},
			});
			const firstPlan =
				subscriptionPriceOnlyProduct.purchaseOptions?.subscription?.plans?.[0];
			expect(
				getActiveVariant(
					subscriptionPriceOnlyProduct,
					undefined,
					firstPlan?.id,
				),
			).toEqual({
				productId: subscriptionPriceOnlyProduct.id,
				priceData: {
					subscription: firstPlan,
				},
			});
		});

		it("should return the product data when there aren't matching variants", () => {
			const selectedProductOptions: SelectedProductOption[] = [
				{
					// Color
					optionId: "random-id",
					// Blue
					valueId: "63a317b5402cc79c52f6c240",
				},
			];

			expect(
				getActiveVariant(
					{ ...baseProduct, variants: productVariants },
					selectedProductOptions,
				),
			).toEqual({
				productId: baseProduct.id,
				priceData: baseProduct.purchaseOptions,
			});
		});

		it("should return the variant data when there are matching variants", () => {
			const selectedProductOptions: SelectedProductOption[] = [
				{
					// color
					optionId: "63a31771402cc79c52f6c23d",
					// green
					valueId: "63a317b5402cc79c52f6c241",
				},
				{
					// size
					optionId: "63a31796402cc79c52f6c23e",
					// medium
					valueId: "63a317b5402cc79c52f6c243",
				},
			];

			const matchingVariant = productVariants?.results[0]; // green, medium

			expect(
				getActiveVariant(
					{ ...baseProduct, variants: productVariants },
					selectedProductOptions,
				),
			).toEqual({
				...matchingVariant,
				productId: baseProduct.id,
				variantId: matchingVariant.id,
				priceData: {},
			});
		});

		it("should return the correct price data for a base product with standard PO", () => {
			const selectedProductOptions: SelectedProductOption[] = [
				{
					// color
					optionId: "63a31771402cc79c52f6c23d",
					// green
					valueId: "63a317b5402cc79c52f6c241",
				},
				{
					// size
					optionId: "63a31796402cc79c52f6c23e",
					// large
					valueId: "63a317b5402cc79c52f6c244",
				},
			];

			const productWithPricedVariant = {
				...standardPriceOnlyProduct,
				variants: {
					...productVariants,
					results: [...productVariants.results, variantWithPriceData],
				},
			};
			const productWithPOVariant = {
				...standardPriceOnlyProduct,
				variants: {
					...productVariants,
					results: [...productVariants.results, variantWithPurchaseOption],
				},
			};
			const productWithoutPricedVariant = {
				...standardPriceOnlyProduct,
				variants: {
					...productVariants,
					results: [...productVariants.results, variantWithoutPriceData],
				},
			};

			expect(
				getActiveVariant(productWithPricedVariant, selectedProductOptions),
			).toEqual({
				...variantWithPriceData,
				productId: productWithPricedVariant.id,
				variantId: variantWithPriceData.id,
				priceData: {
					standard: {
						origPrice: 180,
						price: 165,
					},
				},
			});

			expect(
				getActiveVariant(productWithPOVariant, selectedProductOptions),
			).toEqual({
				...variantWithPurchaseOption,
				productId: productWithPOVariant.id,
				variantId: variantWithPurchaseOption.id,
				priceData: {
					standard: {
						price: 40,
						sale: true,
						salePrice: 40,
						origPrice: 50,
					},
				},
			});

			expect(
				getActiveVariant(productWithoutPricedVariant, selectedProductOptions),
			).toEqual({
				...variantWithoutPriceData,
				productId: productWithoutPricedVariant.id,
				variantId: variantWithoutPriceData.id,
				priceData: {
					standard: productWithoutPricedVariant.purchaseOptions?.standard,
				},
			});
		});

		it("should return the correct price data for a base product with subscription PO", () => {
			const selectedProductOptions: SelectedProductOption[] = [
				{
					// color
					optionId: "63a31771402cc79c52f6c23d",
					// green
					valueId: "63a317b5402cc79c52f6c241",
				},
				{
					// size
					optionId: "63a31796402cc79c52f6c23e",
					// large
					valueId: "63a317b5402cc79c52f6c244",
				},
			];

			const selectedOptionsNoPrice: SelectedProductOption[] = [
				{
					// color
					optionId: "63a31771402cc79c52f6c23d",
					// blue
					valueId: "63a317b5402cc79c52f6c240",
				},
				{
					// size
					optionId: "63a31796402cc79c52f6c23e",
					// large
					valueId: "63a317b5402cc79c52f6c244",
				},
			];

			const blueLargeVariant = productVariants.results[2];

			const planId = "637bd8f91a71b700129a641a"; // yearly
			const plan =
				subscriptionPriceOnlyProduct.purchaseOptions?.subscription?.plans?.find(
					(plan) => plan.id === planId,
				);
			const ADD_PRICE = 8; // add price for the plan above

			const productWithPricedVariant = {
				...subscriptionPriceOnlyProduct,
				variants: {
					...productVariants,
					results: [...productVariants.results, variantWithPriceData],
				},
			};
			const productWithPOVariant = {
				...subscriptionPriceOnlyProduct,
				variants: {
					...productVariants,
					results: [...productVariants.results, variantWithPurchaseOption],
				},
			};
			const productWithoutPricedVariant = {
				...subscriptionPriceOnlyProduct,
				variants: {
					...productVariants,
				},
			};

			expect(
				getActiveVariant(
					productWithPricedVariant,
					selectedProductOptions,
					planId,
				),
			).toEqual({
				...variantWithPriceData,
				productId: productWithPricedVariant.id,
				variantId: variantWithPriceData.id,
				priceData: {
					subscription: { ...plan, price: (plan?.price as number) + ADD_PRICE },
				},
			});

			expect(
				getActiveVariant(productWithPOVariant, selectedProductOptions, planId),
			).toEqual({
				...variantWithPurchaseOption,
				productId: productWithPOVariant.id,
				variantId: variantWithPurchaseOption.id,
				priceData: {
					subscription: { ...plan, price: (plan?.price as number) + ADD_PRICE },
				},
			});

			expect(
				getActiveVariant(
					productWithoutPricedVariant,
					selectedOptionsNoPrice,
					planId,
				),
			).toEqual({
				...blueLargeVariant,
				productId: productWithoutPricedVariant.id,
				variantId: blueLargeVariant.id,
				priceData: {
					subscription: plan,
				},
			});
		});

		it("should return the correct price data for a base product with both PO", () => {
			const selectedProductOptions: SelectedProductOption[] = [
				{
					// color
					optionId: "63a31771402cc79c52f6c23d",
					// green
					valueId: "63a317b5402cc79c52f6c241",
				},
				{
					// size
					optionId: "63a31796402cc79c52f6c23e",
					// large
					valueId: "63a317b5402cc79c52f6c244",
				},
			];

			const selectedOptionsNoPrice: SelectedProductOption[] = [
				{
					// color
					optionId: "63a31771402cc79c52f6c23d",
					// blue
					valueId: "63a317b5402cc79c52f6c240",
				},
				{
					// size
					optionId: "63a31796402cc79c52f6c23e",
					// large
					valueId: "63a317b5402cc79c52f6c244",
				},
			];

			const blueLargeVariant = productVariants.results[2];

			const planId = "637bd8f91a71b700129a641a"; // yearly
			const plan =
				subscriptionPriceOnlyProduct.purchaseOptions?.subscription?.plans?.find(
					(plan) => plan.id === planId,
				);
			const ADD_PRICE = 8; // add price for the plan above

			const productWithPricedVariant = {
				...productWithBothPurchaseOptions,
				variants: {
					...productVariants,
					results: [...productVariants.results, variantWithPriceData],
				},
			};
			const productWithPOVariant = {
				...productWithBothPurchaseOptions,
				variants: {
					...productVariants,
					results: [...productVariants.results, variantWithPurchaseOption],
				},
			};
			const productWithoutPricedVariant = {
				...productWithBothPurchaseOptions,
				variants: {
					...productVariants,
				},
			};

			expect(
				getActiveVariant(
					productWithPricedVariant,
					selectedProductOptions,
					planId,
				),
			).toEqual({
				...variantWithPriceData,
				productId: productWithPricedVariant.id,
				variantId: variantWithPriceData.id,
				priceData: {
					standard: {
						origPrice: 180,
						price: 165,
					},
					subscription: { ...plan, price: (plan?.price as number) + ADD_PRICE },
				},
			});

			expect(
				getActiveVariant(productWithPOVariant, selectedProductOptions, planId),
			).toEqual({
				...variantWithPurchaseOption,
				productId: productWithPOVariant.id,
				variantId: variantWithPurchaseOption.id,
				priceData: {
					standard: {
						price: 40,
						sale: true,
						salePrice: 40,
						origPrice: 50,
					},
					subscription: { ...plan, price: (plan?.price as number) + ADD_PRICE },
				},
			});

			expect(
				getActiveVariant(
					productWithoutPricedVariant,
					selectedOptionsNoPrice,
					planId,
				),
			).toEqual({
				...blueLargeVariant,
				productId: productWithoutPricedVariant.id,
				variantId: blueLargeVariant.id,
				priceData: {
					standard: {
						active: true,
						price: 100,
						prices: [],
						sale: false,
						salePrice: 80,
					},
					subscription: plan,
				},
			});
		});
	});

	describe("getProductList", () => {
		it('should call request with "GET" and "products"', async () => {
			await getProductList(client);

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.any(Object),
			);
		});

		it("should call request with requestOptions", async () => {
			await getProductList(client, {
				requestOptions: {
					currency: "EUR",
					locale: "es-ES",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					currency: "EUR",
					locale: "es-ES",
				}),
			);
		});

		it("should call request with pagination options", async () => {
			await getProductList(client, {
				page: 2,
				limit: 10,
				sort: "price",
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: expect.objectContaining({
						page: 2,
						limit: 10,
						sort: "price",
					}),
				}),
			);
		});

		it("should call request with category filter", async () => {
			await getProductList(client, {
				filters: {
					category: "test-category",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							category: "test-category",
						},
					},
				}),
			);
		});

		it("should call request with attribute filters", async () => {
			await getProductList(client, {
				filters: {
					attributes: {
						brand: "test-brand",
					},
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							brand: "test-brand",
						},
					},
				}),
			);
		});

		it("should call request with price filter", async () => {
			await getProductList(client, {
				filters: {
					price: [10, 20],
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							price: [10, 20],
						},
					},
				}),
			);
		});
	});
});

export const baseProduct: CamelCase<Product> = {
	name: "test-product-1",
	sku: null,
	active: true,
	images: null,
	purchaseOptions: {},
	variable: true,
	description: null,
	tags: [],
	metaTitle: null,
	metaDescription: null,
	slug: "test-product-1",
	attributes: {
		size: ["small", "medium", "large"],
		color: ["red", "blue", "green"],
	},
	delivery: "shipment",
	bundle: null,
	price: 0,
	stockTracking: false,
	options: [
		{
			id: "63a31771402cc79c52f6c23d",
			values: [
				{
					id: "63a317b5402cc79c52f6c23f",
					name: "red",
				},
				{
					id: "63a317b5402cc79c52f6c240",
					name: "blue",
				},
				{
					id: "63a317b5402cc79c52f6c241",
					name: "green",
					price: 8,
				},
			],
			name: "Color",
			active: true,
			inputType: "select",
			variant: true,
			description: null,
			required: true,
			attributeId: "color",
		},
		{
			id: "63a31796402cc79c52f6c23e",
			values: [
				{
					id: "63a317b5402cc79c52f6c242",
					name: "small",
				},
				{
					id: "63a317b5402cc79c52f6c243",
					name: "medium",
				},
				{
					id: "63a317b5402cc79c52f6c244",
					name: "large",
				},
			],
			name: "Size",
			active: true,
			inputType: "select",
			variant: true,
			description: null,
			required: true,
			attributeId: "size",
		},
		{
			id: "637bd8128112c28cbb634de4",
			values: [
				{
					id: "63a63d848e1fc847b9377668",
					name: "toggle",
					price: 150,
				},
			],
			name: "toggle",
			active: true,
			inputType: "toggle",
			variant: true,
			description: "theres a description",
			required: false,
			parentId: null,
			attributeId: "toggle",
		},
	],
	currency: "USD",
	dateCreated: "2022-12-21T14:18:49.592Z",
	stockStatus: null,
	dateUpdated: "2022-12-21T14:27:02.133Z",
	id: "63a315c983c4e90012aab7e7",
};

export const standardPriceOnlyProduct: CamelCase<Product> = {
	...baseProduct,
	price: 100,
	sale: false,
	salePrice: 80,
	purchaseOptions: {
		standard: {
			active: true,
			price: 100,
			prices: [],
			sale: false,
			salePrice: 80,
		},
	},
};

export const subscriptionPriceOnlyProduct: CamelCase<Product> = {
	...baseProduct,
	price: 90,
	purchaseOptions: {
		subscription: {
			active: true,
			plans: [
				{
					id: "63a3317090694e0012f869a0",
					name: "Monthly",
					active: true,
					description: null,
					price: 90,
					billingSchedule: {
						interval: "monthly",
						intervalCount: 1,
						limit: null,
						trialDays: 2,
					},
				},
				{
					id: "637bd8f91a71b700129a641a",
					name: "Yearly",
					active: true,
					description: "Description",
					price: 900,
					billingSchedule: {
						interval: "monthly",
						intervalCount: 1,
						limit: 200,
						trialDays: 3,
					},
				},
			],
		},
	},
};

export const productWithBothPurchaseOptions: CamelCase<Product> = {
	...baseProduct,
	price: 100,
	sale: false,
	salePrice: 80,
	purchaseOptions: {
		standard: {
			active: true,
			price: 100,
			prices: [],
			sale: false,
			salePrice: 80,
		},
		subscription: {
			active: true,
			plans: [
				{
					id: "63a3317090694e0012f869a0",
					name: "Monthly",
					active: true,
					description: null,
					price: 90,
					billingSchedule: {
						interval: "monthly",
						intervalCount: 1,
						limit: null,
						trialDays: 2,
					},
				},
				{
					id: "637bd8f91a71b700129a641a",
					name: "Yearly",
					active: true,
					description: "Description",
					price: 900,
					billingSchedule: {
						interval: "monthly",
						intervalCount: 1,
						limit: 200,
						trialDays: 3,
					},
				},
			],
		},
	},
};

export const productVariants: CamelCase<PaginatedResponse<Variant>> = {
	count: 9,
	results: [
		{
			parentId: "63a315c983c4e90012aab7e7",
			name: "green, medium",
			active: true,
			optionValueIds: ["63a317b5402cc79c52f6c241", "63a317b5402cc79c52f6c243"],
			currency: "USD",
			dateCreated: "2022-12-21T14:27:02.177Z",
			id: "63a317b6e464240012091e2e",
		},
		{
			parentId: "63a315c983c4e90012aab7e7",
			name: "green, small",
			active: true,
			optionValueIds: ["63a317b5402cc79c52f6c241", "63a317b5402cc79c52f6c242"],
			currency: "USD",
			dateCreated: "2022-12-21T14:27:02.171Z",
			id: "63a317b6e464240012091e2d",
		},
		{
			parentId: "63a315c983c4e90012aab7e7",
			name: "blue, large",
			active: true,
			optionValueIds: ["63a317b5402cc79c52f6c240", "63a317b5402cc79c52f6c244"],
			currency: "USD",
			dateCreated: "2022-12-21T14:27:02.166Z",
			id: "63a317b6e464240012091e2c",
		},
		{
			parentId: "63a315c983c4e90012aab7e7",
			name: "blue, medium",
			active: true,
			optionValueIds: ["63a317b5402cc79c52f6c240", "63a317b5402cc79c52f6c243"],
			currency: "USD",
			dateCreated: "2022-12-21T14:27:02.166Z",
			id: "63a317b6e464240012091e2b",
		},
		{
			parentId: "63a315c983c4e90012aab7e7",
			name: "green, medium, toggle",
			active: true,
			optionValueIds: [
				"63a317b5402cc79c52f6c241",
				"63a317b5402cc79c52f6c243",
				"63a63d848e1fc847b9377668",
			],
			currency: "USD",
			dateCreated: "2022-12-21T14:27:02.177Z",
			id: "63a317b6e464240012091e2e",
		},
	],
	page: 1,
	pages: {
		"1": {
			start: 1,
			end: 5,
		},
		"2": {
			start: 6,
			end: 9,
		},
	},
};

const variantWithPriceData: CamelCase<Variant> = {
	parentId: "63a315c983c4e90012aab7e7",
	name: "green, large",
	active: true,
	optionValueIds: ["63a317b5402cc79c52f6c241", "63a317b5402cc79c52f6c244"],
	dateCreated: "2022-12-21T14:27:02.177Z",
	id: "63a317b6e464240012091e2f",
	currency: "USD",
	origPrice: 180,
	price: 165,
};

export const variantWithPurchaseOption: CamelCase<Variant> = {
	parentId: "63a315c983c4e90012aab7e7",
	name: "green, large",
	active: true,
	optionValueIds: ["63a317b5402cc79c52f6c241", "63a317b5402cc79c52f6c244"],
	currency: "USD",
	dateCreated: "2022-12-21T14:27:02.177Z",
	id: "63a317b6e464240012091e2f",
	purchaseOptions: {
		standard: {
			price: 40,
			sale: true,
			salePrice: 40,
			origPrice: 50,
		},
	},
};

const variantWithoutPriceData: CamelCase<Variant> = {
	parentId: "63a315c983c4e90012aab7e7",
	name: "green, large",
	active: true,
	optionValueIds: ["63a317b5402cc79c52f6c241", "63a317b5402cc79c52f6c244"],
	currency: "USD",
	dateCreated: "2022-12-21T14:27:02.177Z",
	id: "63a317b6e464240012091e2e",
};
