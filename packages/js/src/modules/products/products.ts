import request, { HttpMethod, RequestOptions } from "request";
import type { SwellCamelCaseClient, SwellClient } from "client/types";
import type { PaginatedResponse } from "types/api";
import type { SwellSessionOptions } from "types/session";
import type { Product } from "types/api/products";
import type { CamelCase } from "types/utils";
import type { GetProductListOptions } from "./types";

/**
 * Fetches a product using the passed-in identifier,
 * which can be either the product's ID or the product's slug.
 * @param client The client returned from the `init` function.
 * @param id Identifier for the product. Can be either the product's slug or the product's id.
 * @param requestOptions Overwrites the client options for the current request.
 */
export async function getProduct<T extends SwellClient | SwellCamelCaseClient>(
	client: T,
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
	T extends SwellClient | SwellCamelCaseClient,
	F extends string = string,
>(
	client: T,
	options: GetProductListOptions<F> = {},
): Promise<
	T extends SwellCamelCaseClient
		? CamelCase<PaginatedResponse<Product>>
		: PaginatedResponse<Product>
> {
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
