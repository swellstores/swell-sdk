import { describe, expect, it } from "vitest";
import { init } from "./client";
import defaults from "./defaults.json";
import type {
	SwellClientInitOptions,
	SwellClientInitSnakeCaseOptions,
} from "./types";

describe("Client Init", () => {
	it("should throw an error when missing required options", () => {
		const noKey: Partial<SwellClientInitOptions> = {
			store: "test-store",
		};
		expect(() => init(noKey as SwellClientInitSnakeCaseOptions)).toThrowError(
			'Missing required option: "key"',
		);

		const noStore: Partial<SwellClientInitOptions> = {
			key: "test-key",
		};
		expect(() => init(noStore as SwellClientInitSnakeCaseOptions)).toThrowError(
			'Missing required option: "store"',
		);

		const emptyObj: Partial<SwellClientInitOptions> = {};
		expect(() =>
			init(emptyObj as SwellClientInitSnakeCaseOptions),
		).toThrowError('Missing required option: "store"');
	});

	it("should contain the required passed in properties", () => {
		const options: SwellClientInitOptions = {
			store: "test-store",
			key: "test-key",
		};
		const client = init(options);
		expect(client.key).toEqual(options.key);
		expect(client.store).toEqual(options.store);
	});

	it("should set the default options when not specified", () => {
		const options: SwellClientInitOptions = {
			store: "test-store",
			key: "test-key",
		};
		const client = init(options);
		expect(client.key).toEqual(options.key);
		expect(client.store).toEqual(options.store);
		expect(client.vaultUrl).toEqual(defaults.vaultUrl);
		expect(client.options.useCamelCase).toEqual(defaults.useCamelCase);
		expect(client.options.previewContent).toEqual(defaults.previewContent);
		expect(client.options.locale).toBeUndefined();
		expect(client.options.currency).toBeUndefined();
	});

	it("should not set default options when specified", () => {
		const options: SwellClientInitOptions = {
			store: "test-store",
			key: "test-key",
			vaultUrl: "test-vault-url",
			useCamelCase: false,
			previewContent: true,
		};
		const client = init(options);
		expect(client.key).toEqual(options.key);
		expect(client.store).toEqual(options.store);
		expect(client.vaultUrl).toEqual(options.vaultUrl);
		expect(client.options.useCamelCase).toEqual(options.useCamelCase);
		expect(client.options.previewContent).toEqual(options.previewContent);
		expect(client.options.locale).toBeUndefined();
		expect(client.options.currency).toBeUndefined();
	});

	it("should set locale and currency when specified", () => {
		const options: SwellClientInitOptions = {
			store: "test-store",
			key: "test-key",
			locale: "en-US",
			currency: "USD",
		};

		const client = init(options);
		expect(client.options.locale).toEqual(options.locale);
		expect(client.options.currency).toEqual(options.currency);
	});

	it("should compute the correct URL when not using a custom URL", () => {
		const options: SwellClientInitOptions = {
			store: "test-store",
			key: "test-key",
		};
		const client = init(options);
		expect(client.url).toEqual("https://test-store.swell.store");
	});
});
