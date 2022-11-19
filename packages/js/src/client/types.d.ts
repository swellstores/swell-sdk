import { SwellSessionOptions } from "../types/session";

export interface SwellClientRequiredOptions {
	store: string;
	key: string;
}

export interface SwellClientInitOptions
	extends SwellClientRequiredOptions,
		SwellSessionOptions {
	url?: string;
	vaultUrl?: string;
	useCamelCase?: boolean;
	previewContent?: boolean;
}

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
