import defaultOptions from "./defaults.json";
import { removeTrailingSlash } from "../utils";
import type { SwellClientInitOptions, SwellClient } from "./types";

/**
 * Initializes the Swell client.
 * @param options
 */
export const init = (options: SwellClientInitOptions): SwellClient => {
	const { store, key } = options;
	if (!store) {
		throw new Error('Missing required option: "store"');
	}
	if (!key) {
		throw new Error('"Missing required option: "key"');
	}

	return {
		key,
		store,
		url: options.url
			? removeTrailingSlash(options.url)
			: `https://${options.store}.swell.store`,
		vaultUrl: options.vaultUrl
			? removeTrailingSlash(options.vaultUrl)
			: defaultOptions.vaultUrl,
		options: {
			useCamelCase: options.useCamelCase ?? defaultOptions.useCamelCase,
			previewContent: options.previewContent ?? false,
			locale: options.locale,
			currency: options.currency,
		},
	};
};

// export enum HTTP_METHOD {
// 	GET = "GET",
// 	POST = "POST",
// 	PUT = "PUT",
// 	DELETE = "DELETE",
// }

// export const get = (app: App, path: string, params?: any) => {
// 	return request(app, HTTP_METHOD.GET, path, params);
// };

// export const post = (app: App, path: string, params?: any) => {
// 	return request(app, HTTP_METHOD.POST, path, params);
// };

// export const put = (app: App, path: string, params?: any) => {
// 	return request(app, HTTP_METHOD.PUT, path, params);
// };

// export const del = (app: App, path: string, params?: any) => {
// 	return request(app, HTTP_METHOD.DELETE, path);
// };

// interface RequestOptions {
// 	searchParams?: string;
// 	headers?: Record<string, string>;
// 	body?: object;
// }

// const getBaseHeaders = (appOptions: InitOptions) => {
// 	const { sessionCookie, locale, currency, key } = appOptions;

// 	const baseHeaders: Record<string, string> = {
// 		"Content-Type": "application/json",
// 		Accept: "application/json",
// 		Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`,
// 	};

// 	const session = sessionCookie || getCookie("swell-session");
// 	const locale = locale || getCookie("swell-locale");
// 	const currency = currency || getCookie("swell-currency");

// 	if (session) {
// 		baseHeaders["swell-session"] = session;
// 	}

// 	if (locale) {
// 		baseHeaders["swell-locale"] = locale;
// 	}

// 	if (currency) {
// 		baseHeaders["swell-currency"] = currency;
// 	}

// 	return baseHeaders;
// };

// export const request = async (
// 	app: App,
// 	method: HTTP_METHOD,
// 	path: string,
// 	options?: RequestOptions,
// ) => {
// 	const { url } = app.options;
// 	const baseHeaders = getBaseHeaders(app.options);

// 	const searchParams = options?.searchParams ? `?${options.searchParams}` : "";

// 	const requestURL = `${url}/api/${path}${searchParams}`;

// 	const response = await fetch(requestURL, {
// 		method,
// 		headers: {
// 			...baseHeaders,
// 			...options?.headers,
// 		},
// 		body: JSON.stringify(options?.body),
// 	});

// 	return response.json();
// };
