import { afterEach, describe, expect, it, vi } from "vitest";
import { ofetch } from "ofetch";
import request, { HTTP_METHOD } from ".";
import { init } from "../client";
import * as utils from "../utils";

vi.mock("ofetch", () => ({
	ofetch: vi.fn(),
}));

describe("request", () => {
	afterEach(() => {
		vi.resetModules();
		vi.restoreAllMocks();
	});

	describe("updating cookies prior to the request", () => {
		const client = init({
			store: "test-store",
			key: "test-key",
		});

		const getCookieStub = vi.spyOn(utils, "getCookie");

		describe("request parameters", () => {
			getCookieStub.mockImplementation((name) => {
				switch (name) {
					case "swell-session":
						return "token-cookie";
					case "swell-locale":
						return "locale-cookie";
					case "swell-currency":
						return "currency-cookie";
					default:
						return undefined;
				}
			});
			it("should use the cookies as a fallback to every missing option", async () => {
				await expect(
					request(client, HTTP_METHOD.GET, "/products"),
				).resolves.not.toThrow();
				expect(ofetch).toHaveBeenCalledWith(expect.any(String), {
					method: HTTP_METHOD.GET,
					headers: {
						"X-Session": "token-cookie",
						"X-Locale": "locale-cookie",
						"X-Currency": "currency-cookie",
					},
				});
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
					request(clientWithOptions, HTTP_METHOD.GET, "/products"),
				).resolves.not.toThrow();
				expect(ofetch).toHaveBeenCalledWith(expect.any(String), {
					method: HTTP_METHOD.GET,
					headers: {
						"X-Session": "client-token",
						"X-Locale": "client-locale",
						"X-Currency": "client-currency",
					},
				});
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
					request(clientWithOptions, HTTP_METHOD.GET, "/products", {
						sessionToken: "override-token",
						currency: "override-currency",
						locale: "override-locale",
					}),
				).resolves.not.toThrow();
				expect(ofetch).toHaveBeenCalledWith(expect.any(String), {
					method: HTTP_METHOD.GET,
					headers: {
						"X-Session": "override-token",
						"X-Locale": "override-locale",
						"X-Currency": "override-currency",
					},
				});
			});
		});
	});
});
