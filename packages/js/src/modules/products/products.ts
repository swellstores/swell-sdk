import request, { HttpMethod, RequestOptions } from "request";
import type { SwellCamelCaseClient, SwellClient } from "client/types";
import type { PaginatedResponse } from "types/api";
import type {
	Product,
	Variant,
	WithVariants,
	ProductOption,
	SubscriptionPlan,
	StandardPurchaseOption,
} from "types/api/products";
import type { ExpandableField, SwitchCamelCase, CamelCase } from "types/utils";
import type {
	GetProductExpandOptions,
	GetProductListOptions,
	GetProductOptions,
	GetProductResult,
	SelectedProductOption,
} from "./types";

/**
 * Fetches a product using the passed-in identifier,
 * which can be either the product's ID or the product's slug.
 * @param client The client returned from the `init` function.
 * @param id Identifier for the product. Can be either the product's slug or the product's id.
 * @param options Options for expanding and setting custom request options for the request.
 */
export async function getProduct<
	C extends SwellClient | SwellCamelCaseClient,
	E extends Array<ExpandableField<GetProductExpandOptions>> = [],
>(
	client: C,
	id: string,
	options?: GetProductOptions<E>,
): Promise<SwitchCamelCase<C, GetProductResult<E>>> {
	const requestOptions: RequestOptions = {
		...options?.requestOptions,
	};

	if (options?.expand) {
		requestOptions.searchParams = {
			expand: options.expand.join(","),
		};
	}

	return request(client, HttpMethod.Get, `products/${id}`, requestOptions);
}

/**
 * Returns a paginated list of the store's products,
 * which can optionally be filtered by the passed-in attributes.
 * @param client The client returned from the `init` function.
 * @param options Options for filtering and paginating the response.
 */
export async function getProductList<
	C extends SwellClient | SwellCamelCaseClient,
	F extends string = string,
>(
	client: C,
	options: GetProductListOptions<F> = {},
): Promise<SwitchCamelCase<C, PaginatedResponse<Product>>> {
	const { category, price, attributes } = options.filters ?? {};

	const filters: Record<string, unknown> = { ...attributes };

	if (category) filters.category = category;
	if (price) filters.price = price;

	return request(client, HttpMethod.Get, "products", {
		searchParams: {
			$filters: filters,
			limit: options.limit,
			page: options.page,
			sort: options.sort,
		},
		...options.requestOptions,
	});
}

// TODO: move types out

type VariantPriceFields =
	| "price"
	| "prices"
	| "sale"
	| "salePrice"
	| "origPrice"
	| "purchaseOptions";

interface FallbackVariant {
	productId?: string;
	priceData?: {
		standard?: StandardPurchaseOption;
		subscription?: SubscriptionPlan;
	};
}

interface WithMatchingVariant
	extends FallbackVariant,
		Omit<Variant, VariantPriceFields> {
	variantId?: string | null;
}

export type ActiveVariant = FallbackVariant | WithMatchingVariant;

/**
 * Normalizes and returns the price data for a product based on the user's selected options,
 * alongside the rest of the matching variant's data, if found.
 * @param product The product to get the active variant from.
 * @param selectedOptions The options selected by the user, if any.
 * @param selectedPlanId The ID of the selected subscription plan, if any.
 * @returns The resolved price data for the product merged with the matching variant, if found.
 */
export function getActiveVariant(
	product: CamelCase<WithVariants<Product>>,
	selectedOptions?: SelectedProductOption[],
	selectedPlanId?: string | null,
): ActiveVariant {
	const variants = product?.variants?.results;

	const baseStandardData = product?.purchaseOptions?.standard;
	const baseSubscriptionData = product?.purchaseOptions?.subscription;

	const baseVariant = {
		productId: product.id,
		priceData: {
			...(baseStandardData && { standard: baseStandardData }),
			...(baseSubscriptionData &&
				selectedPlanId && {
					subscription: getPlan(baseSubscriptionData?.plans, selectedPlanId),
				}),
		},
	};

	if (!variants?.length) {
		return baseVariant;
	}

	const matchingVariant = variants?.find((variant) =>
		variant.optionValueIds?.every((valueId: string) =>
			selectedOptions?.some((option) => option?.valueId === valueId),
		),
	);

	if (!matchingVariant) {
		return baseVariant;
	}

	const priceData = {
		...(baseStandardData && {
			standard: getVariantStandardPrice(product, matchingVariant),
		}),
		...(baseSubscriptionData &&
			selectedPlanId && {
				subscription: getVariantSubscriptionPrice(
					product,
					matchingVariant,
					selectedPlanId,
				),
			}),
	};

	return {
		...baseVariant,
		...matchingVariant,
		variantId: matchingVariant.id,
		priceData,
	};
}

function getVariantStandardPrice(
	product: CamelCase<WithVariants<Product>>,
	matchingVariant?: CamelCase<Variant>,
): CamelCase<StandardPurchaseOption> | undefined {
	const productPurchaseOption = product?.purchaseOptions?.standard;
	// If the product doesn't have a standard purchase option, neither should the variant
	if (!productPurchaseOption) {
		return;
	}
	// If there is no matching variant, use the product's standard purchase option
	if (!matchingVariant) {
		return productPurchaseOption;
	}

	const variantPurchaseOption = matchingVariant?.purchaseOptions?.standard;
	// If the variant has a standard purchase option, use it
	if (variantPurchaseOption) {
		return variantPurchaseOption;
	}

	// If it doesn't, but still has price data, build a purchase option object from it
	if (matchingVariant?.price) {
		const { price, prices, sale, salePrice, origPrice } = matchingVariant;
		return {
			price,
			prices,
			sale,
			salePrice,
			origPrice,
		};
	}

	// If it doesn't have price data, use the product's standard purchase option as a fallback
	return productPurchaseOption;
}

function getVariantSubscriptionPrice(
	product: CamelCase<WithVariants<Product>>,
	matchingVariant?: CamelCase<Variant>,
	selectedPlanId?: string,
): CamelCase<SubscriptionPlan> | undefined {
	const productPurchaseOption = product?.purchaseOptions?.subscription;
	// If the product doesn't have a subscription purchase option, neither should the variant
	if (!productPurchaseOption || !selectedPlanId) {
		return;
	}

	const plans = productPurchaseOption?.plans;
	const selectedPlan = getPlan(plans, selectedPlanId);

	if (!selectedPlan) {
		return;
	}

	return addOptionPricesToPlan(
		selectedPlan,
		product?.options,
		matchingVariant?.optionValueIds,
	);
}

function addOptionPricesToPlan(
	selectedPlan: CamelCase<SubscriptionPlan>,
	productOptions?: CamelCase<ProductOption>[] | null,
	optionValueIds?: string[] | null,
) {
	// if missing anything, just return the plan as-is.
	if (!productOptions?.length || !optionValueIds?.length) {
		return selectedPlan;
	}

	let addedPrice = 0;
	productOptions.forEach((option) => {
		if (option?.values?.length) {
			option.values.forEach((value) => {
				// get all the options that match the variant's optionValueIds
				if (optionValueIds.includes(String(value.id))) {
					// add up the prices of those options
					addedPrice += value.price || 0;
				}
			});
		}
	});

	return {
		...selectedPlan,
		// add the total to the plan's price
		price: selectedPlan.price
			? selectedPlan.price + addedPrice
			: selectedPlan.price,
	};
}

function getPlan(
	plans: CamelCase<SubscriptionPlan>[] | null | undefined,
	planId: string | undefined,
) {
	return plans?.find((plan) => plan.id === planId);
}
