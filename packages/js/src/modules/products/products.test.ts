import { describe, it, vi, expect, afterEach, beforeEach } from "vitest";
import { init } from "client";
import request from "request";
import { getProduct, getProductList } from "./products";

vi.mock("request");

describe("modules/products", () => {
	beforeEach(() => {
		vi.mocked(request).mockImplementationOnce(() => Promise.resolve({}));
	});

	afterEach(() => {
		vi.resetModules();
		vi.restoreAllMocks();
	});

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

	describe("getProductList", () => {
		it('should call request with "GET" and "products"', async () => {
			await getProductList(client);

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.any(Object),
			);
		});

		it("should call request with requestOptions", async () => {
			await getProductList(client, {
				requestOptions: {
					currency: "EUR",
					locale: "es-ES",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					currency: "EUR",
					locale: "es-ES",
				}),
			);
		});

		it("should call request with pagination options", async () => {
			await getProductList(client, {
				page: 2,
				limit: 10,
				sort: "price",
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: expect.objectContaining({
						page: 2,
						limit: 10,
						sort: "price",
					}),
				}),
			);
		});

		it("should call request with category filter", async () => {
			await getProductList(client, {
				filters: {
					category: "test-category",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							category: "test-category",
						},
					},
				}),
			);
		});

		it("should call request with attribute filters", async () => {
			await getProductList(client, {
				filters: {
					attributes: {
						brand: "test-brand",
					},
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							brand: "test-brand",
						},
					},
				}),
			);
		});

		it("should call request with price filter", async () => {
			await getProductList(client, {
				filters: {
					price: [10, 20],
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"products",
				expect.objectContaining({
					searchParams: {
						$filters: {
							price: [10, 20],
						},
					},
				}),
			);
		});
	});
});
