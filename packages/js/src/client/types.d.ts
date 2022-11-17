export interface SwellClientRequiredOptions {
	store: string;
	key: string;
}

export interface SwellClientInitOptions extends SwellClientRequiredOptions {
	url?: string;
	vaultUrl?: string;
	useCamelCase?: boolean;
	previewContent?: boolean;
	sessionCookie?: string;
	locale?: string;
	currency?: string;
}

export interface SwellClientOptions {
	useCamelCase: boolean;
	previewContent: boolean;
	locale?: string;
	currency?: string;
	sessionCookie?: string;
}

export interface SwellClient {
	url: string;
	vaultUrl: string;
	store: string;
	key: string;
	options: SwellClientOptions;
}
