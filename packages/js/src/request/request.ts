import { stringify } from "qs";
import { FetchOptions, ofetch } from "ofetch";

import { base64, getCookie, objectToCamel } from "internal/utils";
import type { SwellCamelCaseClient, SwellClient } from "client/types";
import type { SwellSessionOptions } from "types/session";
import type { CamelCase } from "types/utils";

export enum HttpMethod {
	Get = "GET",
	Post = "POST",
	Put = "PUT",
	Delete = "DELETE",
}

export interface RequestOptions extends SwellSessionOptions {
	searchParams?: Record<string, unknown>;
	headers?: Record<string, string>;
	body?: object;
}

async function request<T extends object>(
	client: SwellCamelCaseClient,
	method: HttpMethod,
	path: string,
	options?: RequestOptions,
): Promise<CamelCase<Awaited<T>>>;

async function request<T extends object>(
	client: SwellClient,
	method: HttpMethod,
	path: string,
	options?: RequestOptions,
): Promise<T>;

async function request<T extends object>(
	client: SwellClient,
	method: HttpMethod,
	path: string,
	options?: RequestOptions,
) {
	const { url } = client;
	const searchParams = options?.searchParams
		? `?${stringify(options.searchParams, {
				arrayFormat: "indices",
				encodeValuesOnly: true,
		  })}`
		: "";
	const requestURL = `${url}/api/${path}${searchParams}`;

	const sessionToken =
		options?.sessionToken ??
		client.options.sessionToken ??
		getCookie("swell-session");

	const locale =
		options?.locale ?? client.options.locale ?? getCookie("swell-locale");

	const currency =
		options?.currency ?? client.options.currency ?? getCookie("swell-currency");

	const headers: Record<string, unknown> = {
		...options?.headers,
		"Content-Type": "application/json",
		Accept: "application/json",
		Authorization: `Basic ${base64(client.key)}`,
	};

	if (sessionToken) {
		headers["X-Session"] = sessionToken;
	}

	if (locale) {
		headers["X-Locale"] = locale;
	}

	if (currency) {
		headers["X-Currency"] = currency;
	}

	const fetchOptions: FetchOptions<"json"> = {
		method,
		headers,
		mode: "cors",
		credentials: "include",
	};

	if (options?.body) {
		fetchOptions.body = JSON.stringify(options.body);
	}

	const response = await ofetch<T>(requestURL, fetchOptions);

	return client.options.useCamelCase ? objectToCamel(response) : response;
}

export default request;
