import request, { HttpMethod } from "request";
import type { SwellCamelCaseClient, SwellClient } from "client/types";
import type { PaginatedResponse } from "types/api";
import type { SwellSessionOptions } from "types/session";
import type { Product } from "types/api/products";
import type { CamelCase } from "types/utils";

export async function getProduct<T extends SwellClient | SwellCamelCaseClient>(
	client: T,
	id: string,
	requestOptions: SwellSessionOptions = {},
): Promise<T extends SwellCamelCaseClient ? CamelCase<Product> : Product> {
	return request(client, HttpMethod.Get, `products/${id}`, requestOptions);
}

type ProductFilters<K extends string = string> = {
	filter?: [number, number];
	category?: string[];
} & {
	[key in K]?: string[];
};

export type GetProductsOptions<F extends string = string> = {
	page?: number;
	limit?: number;
	sort?: string;
	filters?: ProductFilters<F>;
	requestOptions?: SwellSessionOptions;
};

export async function getProducts<F extends string = string>(
	client: SwellClient,
	options: GetProductsOptions<F>,
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
