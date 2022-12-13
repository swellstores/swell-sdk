import defaultOptions from "./defaults.json";
import { removeTrailingSlash } from "internal/utils";
import type {
	SwellClientInitOptions,
	SwellClient,
	SwellCamelCaseClient,
	SwellClientInitCamelCaseOptions,
	SwellClientInitSnakeCaseOptions,
} from "./types";

export function init(
	options: SwellClientInitCamelCaseOptions,
): SwellCamelCaseClient;

export function init(options: SwellClientInitSnakeCaseOptions): SwellClient;

/**
 * Initializes the Swell client.
 * @param options - The client options.
 */
export function init(options: SwellClientInitOptions): SwellClient {
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
			sessionToken: options.sessionToken,
		},
	};
}
