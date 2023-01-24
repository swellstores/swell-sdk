import request, { HttpMethod, RequestOptions } from "request";
import type { SwellCamelCaseClient, SwellClient } from "client/types";
import type { PaginatedResponse } from "types/api";
import type { ExpandableField, SwitchCamelCase } from "types/utils";
import type {
	GetCategoryExpandOptions,
	GetCategoryListOptions,
	GetCategoryOptions,
	GetCategoryResult,
} from "./types";
import type { Category } from "types/api/categories";

/**
 * Fetches a category using the passed-in identifier,
 * which can be either the category's ID or the category's slug.
 * @param client The client returned from the `init` function.
 * @param id Identifier for the category. Can be either the category's slug or the category's id.
 * @param options Options for expanding and setting custom request options for the request.
 */
export async function getCategory<
	C extends SwellClient | SwellCamelCaseClient,
	E extends Array<ExpandableField<GetCategoryExpandOptions>> = [],
>(
	client: C,
	id: string,
	options?: GetCategoryOptions<E>,
): Promise<SwitchCamelCase<C, GetCategoryResult<E>>> {
	const requestOptions: RequestOptions = {
		...options?.requestOptions,
	};

	if (options?.expand) {
		requestOptions.searchParams = {
			expand: options.expand.join(","),
		};
	}

	return request(client, HttpMethod.Get, `categories/${id}`, requestOptions);
}

/**
 * Returns a paginated list of the store's categories
 * @param client The client returned from the `init` function.
 * @param options Options for paginating the response.
 */
export async function getCategoryList<
	C extends SwellClient | SwellCamelCaseClient,
>(
	client: C,
	options: GetCategoryListOptions = {},
): Promise<SwitchCamelCase<C, PaginatedResponse<Category>>> {
	return request(client, HttpMethod.Get, "categories", {
		searchParams: {
			limit: options.limit,
			page: options.page,
			sort: options.sort,
		},
		...options.requestOptions,
	});
}
