import request, { HttpMethod } from "request";
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
	requestOptions: SwellSessionOptions = {},
): Promise<T extends SwellCamelCaseClient ? CamelCase<Product> : Product> {
	return request(client, HttpMethod.Get, `products/${id}`, requestOptions);
}

/**
 * Returns a paginated list of the store's products,
 * which can optionally be filtered by the passed-in attributes.
 * @param client The client returned from the `init` function.
 * @param options Options for filtering and paginating the response.
 */
export async function getProductList<F extends string = string>(
	client: SwellClient,
	options: GetProductListOptions<F> = {},
) {
	return request<PaginatedResponse<Product>>(
		client,
		HttpMethod.Get,
		"products",
		{
			searchParams: options,
			...options.requestOptions,
		},
	);
}
