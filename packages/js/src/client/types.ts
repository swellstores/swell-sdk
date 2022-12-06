import type { SwellSessionOptions } from "types/session";

export interface SwellClientRequiredOptions {
	/**
	 * Your store's ID. Can be found inside your store's admin dashboard, under Developer > API keys.
	 */
	store: string;
	/**
	 * A public key from your store. Can likewise be found in your store's admin dashboard, under Developer > API keys.
	 */
	key: string;
}

export interface SwellClientInitOptionsBase
	extends SwellClientRequiredOptions,
		SwellSessionOptions {
	/**
	 * Your storefront's URL.
	 */
	url?: string;
	/**
	 * The URL for your credit card token's vault.
	 */
	vaultUrl?: string;
	/**
	 * Whether or not to convert the response syntax to camel case.
	 */
	useCamelCase?: boolean;
	/**
	 * Should be set to true when retrieving preview editor data.
	 */
	previewContent?: boolean;
}

export interface SwellClientInitCamelCaseOptions
	extends SwellClientInitOptionsBase {
	useCamelCase: true;
}

export interface SwellClientInitSnakeCaseOptions
	extends SwellClientInitOptionsBase {
	useCamelCase?: false;
}

export type SwellClientInitOptions =
	| SwellClientInitCamelCaseOptions
	| SwellClientInitSnakeCaseOptions;

export interface SwellClientOptions extends SwellSessionOptions {
	useCamelCase: boolean;
	previewContent: boolean;
}

export interface SwellClient {
	url: string;
	vaultUrl: string;
	store: string;
	key: string;
	options: SwellClientOptions;
}

export type SwellCamelCaseClient = Omit<SwellClient, "options"> & {
	options: Omit<SwellClientOptions, "useCamelCase"> & {
		useCamelCase: true;
	};
};
