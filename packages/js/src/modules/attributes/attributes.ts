import request, { HttpMethod, RequestOptions } from "request";
import type { SwellCamelCaseClient, SwellClient } from "client/types";
import type { PaginatedResponse } from "types/api";
import type { SwitchCamelCase } from "types/utils";
import type { GetAttributeListOptions, GetAttributeOptions } from "./types";
import type { Attribute } from "types/api/attributes";

/**
 * Fetches an attribute using the attribute's id.
 * @param client The client returned from the `init` function.
 * @param id Identifier for the attribute.
 * @param options Options for expanding and setting custom request options for the request.
 */
export async function getAttribute<
	C extends SwellClient | SwellCamelCaseClient,
>(
	client: C,
	id: string,
	options?: GetAttributeOptions,
): Promise<SwitchCamelCase<C, Attribute>> {
	const requestOptions: RequestOptions = {
		...options?.requestOptions,
	};

	return request(client, HttpMethod.Get, `attributes/${id}`, requestOptions);
}

/**
 * Returns a paginated list of the store's attributes
 * @param client The client returned from the `init` function.
 * @param options Options for paginating the response.
 */
export async function getAttributeList<
	C extends SwellClient | SwellCamelCaseClient,
>(
	client: C,
	options: GetAttributeListOptions = {},
): Promise<SwitchCamelCase<C, PaginatedResponse<Attribute>>> {
	return request(client, HttpMethod.Get, "attributes", {
		searchParams: {
			limit: options.limit,
			page: options.page,
			sort: options.sort,
		},
		...options.requestOptions,
	});
}
