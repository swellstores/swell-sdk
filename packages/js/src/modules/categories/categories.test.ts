import { describe, it, vi, expect, afterEach, beforeEach } from "vitest";
import { init } from "client";
import request from "request";
import { getCategory, getCategoryList } from "./categories";

vi.mock("request");

describe("modules/categories", () => {
	beforeEach(() => {
		vi.mocked(request).mockImplementationOnce(() => Promise.resolve({}));
	});

	afterEach(() => {
		vi.resetModules();
		vi.restoreAllMocks();
	});

	const client = init({ key: "test-key", store: "test-store" });

	describe("getCategory", () => {
		it('should call request with "GET" and "categories/:id"', async () => {
			await getCategory(client, "category-id");

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"categories/category-id",
				{},
			);
		});

		it('should call request with "GET" and "categories/:slug"', async () => {
			await getCategory(client, "category-slug");

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"categories/category-slug",
				{},
			);
		});

		it("should call request with requestOptions", async () => {
			await getCategory(client, "category-id", {
				requestOptions: {
					sessionToken: "test-session",
					locale: "test-locale",
					currency: "test-currency",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"categories/category-id",
				{
					sessionToken: "test-session",
					locale: "test-locale",
					currency: "test-currency",
				},
			);
		});

		it("should call request with expand", async () => {
			await getCategory(client, "category-id", {
				expand: ["products", "top"],
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"categories/category-id",
				{
					searchParams: {
						expand: "products,top",
					},
				},
			);
		});
	});

	describe("getCategoryList", () => {
		it('should call request with "GET" and "categories"', async () => {
			await getCategoryList(client);

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"categories",
				expect.any(Object),
			);
		});

		it("should call request with requestOptions", async () => {
			await getCategoryList(client, {
				requestOptions: {
					currency: "EUR",
					locale: "es-ES",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"categories",
				expect.objectContaining({
					currency: "EUR",
					locale: "es-ES",
				}),
			);
		});

		it("should call request with pagination options", async () => {
			await getCategoryList(client, {
				page: 2,
				limit: 10,
				sort: "name",
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"categories",
				expect.objectContaining({
					searchParams: expect.objectContaining({
						page: 2,
						limit: 10,
						sort: "name",
					}),
				}),
			);
		});
	});
});
