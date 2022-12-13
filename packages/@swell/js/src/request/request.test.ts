import { afterEach, describe, expect, it, vi } from "vitest";
import { ofetch } from "ofetch";
import request, { HttpMethod } from ".";
import { init } from "client";
import * as utils from "internal/utils";

vi.mock("ofetch", () => ({
	ofetch: vi.fn(() => Promise.resolve({ test: true })),
}));

describe("request", () => {
	const client = init({
		store: "test-store",
		key: "test-key",
	});

	afterEach(() => {
		vi.resetModules();
		vi.restoreAllMocks();
	});

	describe("url building", () => {
		const path = "products";

		it("should call ofetch with the correct url", async () => {
			await request(client, HttpMethod.Get, path);

			expect(ofetch).toHaveBeenCalledWith(
				"https://test-store.swell.store/api/products",
				expect.anything(),
			);
		});

		it("should append parsed search params to the url", async () => {
			await request(client, HttpMethod.Get, path, {
				searchParams: { page: 1, limit: 10, $filters: { category: ["test"] } },
			});

			expect(ofetch).toHaveBeenCalledWith(
				"https://test-store.swell.store/api/products?page=1&limit=10&$filters[category][0]=test",
				expect.anything(),
			);
		});
	});

	describe("updating cookies prior to the request", () => {
		const getCookieStub = vi.spyOn(utils, "getCookie");

		describe("request parameters", () => {
			it("should use the cookies as a fallback to every missing option", async () => {
				getCookieStub.mockImplementation((name) => {
					switch (name) {
						case "swell-session":
							return "token-cookie";
						case "swell-locale":
							return "locale-cookie";
						case "swell-currency":
							return "currency-cookie";
					}
					return undefined;
				});
				await expect(
					request(client, HttpMethod.Get, "/products"),
				).resolves.not.toThrow();
				expect(ofetch).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining({
						headers: expect.objectContaining({
							"X-Session": "token-cookie",
							"X-Locale": "locale-cookie",
							"X-Currency": "currency-cookie",
						}),
					}),
				);
				expect(getCookieStub).toHaveBeenCalledTimes(3);
				expect(getCookieStub.mock.calls).toEqual(
					expect.arrayContaining([
						["swell-currency"],
						["swell-session"],
						["swell-locale"],
					]),
				);
			});

			it("should use the client options if specified", async () => {
				const clientWithOptions = init({
					store: "test-store",
					key: "test-key",
					locale: "client-locale",
					currency: "client-currency",
					sessionToken: "client-token",
				});
				await expect(
					request(clientWithOptions, HttpMethod.Get, "/products"),
				).resolves.not.toThrow();
				expect(ofetch).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining({
						headers: expect.objectContaining({
							"X-Session": "client-token",
							"X-Locale": "client-locale",
							"X-Currency": "client-currency",
						}),
					}),
				);
			});

			it("should use the request options if specified", async () => {
				const clientWithOptions = init({
					store: "test-store",
					key: "test-key",
					locale: "client-locale",
					currency: "client-currency",
					sessionToken: "client-token",
				});
				await expect(
					request(clientWithOptions, HttpMethod.Get, "/products", {
						sessionToken: "override-token",
						currency: "override-currency",
						locale: "override-locale",
					}),
				).resolves.not.toThrow();
				expect(ofetch).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining({
						headers: expect.objectContaining({
							"X-Session": "override-token",
							"X-Locale": "override-locale",
							"X-Currency": "override-currency",
						}),
					}),
				);
			});
		});
	});

	it("should call ofetch with the correct method", async () => {
		await request(client, HttpMethod.Get, "products");

		expect(ofetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				method: HttpMethod.Get,
			}),
		);

		await request(client, HttpMethod.Post, "products");

		expect(ofetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				method: HttpMethod.Post,
			}),
		);
	});

	describe("request headers", () => {
		it("should include the authorization header", async () => {
			await request(client, HttpMethod.Get, "products");

			expect(ofetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "Basic dGVzdC1rZXk=",
					}),
				}),
			);
		});

		it("should include the content-type and accept headers", async () => {
			await request(client, HttpMethod.Get, "products");

			expect(ofetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Accept: "application/json",
						"Content-Type": "application/json",
					}),
				}),
			);
		});
	});

	it('should call ofetch with mode: "cors"', async () => {
		await request(client, HttpMethod.Get, "products");

		expect(ofetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				mode: "cors",
			}),
		);
	});

	it('should call ofetch with credentials: "include"', async () => {
		await request(client, HttpMethod.Get, "products");

		expect(ofetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				credentials: "include",
			}),
		);
	});

	it("should call ofetch with the correct body", async () => {
		await request(client, HttpMethod.Post, "products", {
			body: { test: true },
		});

		expect(ofetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				body: '{"test":true}',
			}),
		);
	});

	it("parses the response body as JSON", async () => {
		vi.mocked(ofetch).mockImplementationOnce(() => {
			return Promise.resolve({ test: true });
		});

		const response = await request(client, HttpMethod.Get, "products");
		expect(response).toEqual({ test: true });
	});

	it("should not camelCase the response body", async () => {
		vi.mocked(ofetch).mockImplementationOnce(() => {
			return Promise.resolve({ test_field: true });
		});

		const response = await request(client, HttpMethod.Get, "products");
		expect(response).toEqual({ test_field: true });
	});

	it("should camelCase the response body if the client is configured to do so", async () => {
		vi.mocked(ofetch).mockImplementationOnce(() => {
			return Promise.resolve({ test_field: true });
		});

		const clientWithCamelCase = init({
			store: "test-store",
			key: "test-key",
			useCamelCase: true,
		});

		const response = await request(
			clientWithCamelCase,
			HttpMethod.Get,
			"products",
		);

		expect(response).toEqual({ testField: true });
	});
});
