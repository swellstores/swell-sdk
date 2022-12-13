import { describe, it, vi, expect } from "vitest";
import { init } from "client";
import request from "request";
import { getProduct } from "./products";

vi.mock("request");

describe("modules/products", () => {
	const client = init({ key: "test-key", store: "test-store" });

	describe("getProduct", () => {
		it('should call request with "GET" and "products/:id"', async () => {
			await getProduct(client, "product-id");

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products/product-id",
				{},
			);
		});

		it('should call request with "GET" and "products/:slug"', async () => {
			await getProduct(client, "product-slug");

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products/product-slug",
				{},
			);
		});

		it("should call request with requestOptions", async () => {
			await getProduct(client, "product-id", {
				sessionToken: "test-session",
				locale: "test-locale",
				currency: "test-currency",
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products/product-id",
				{
					sessionToken: "test-session",
					locale: "test-locale",
					currency: "test-currency",
				},
			);
		});
	});
});
