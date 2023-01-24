import { describe, it, vi, expect, afterEach, beforeEach } from "vitest";
import { init } from "client";
import request from "request";
import { getAttribute, getAttributeList } from "./attributes";

vi.mock("request");

describe("modules/attributes", () => {
	beforeEach(() => {
		vi.mocked(request).mockImplementationOnce(() => Promise.resolve({}));
	});

	afterEach(() => {
		vi.resetModules();
		vi.restoreAllMocks();
	});

	const client = init({ key: "test-key", store: "test-store" });

	describe("getAttribute", () => {
		it('should call request with "GET" and "attributes/:id"', async () => {
			await getAttribute(client, "attribute-id");

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"attributes/attribute-id",
				{},
			);
		});

		it("should call request with requestOptions", async () => {
			await getAttribute(client, "attribute-id", {
				requestOptions: {
					sessionToken: "test-session",
					locale: "test-locale",
					currency: "test-currency",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"attributes/attribute-id",
				{
					sessionToken: "test-session",
					locale: "test-locale",
					currency: "test-currency",
				},
			);
		});
	});

	describe("getAttributeList", () => {
		it('should call request with "GET" and "attributes"', async () => {
			await getAttributeList(client);

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"attributes",
				expect.any(Object),
			);
		});

		it("should call request with requestOptions", async () => {
			await getAttributeList(client, {
				requestOptions: {
					locale: "es-ES",
				},
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"attributes",
				expect.objectContaining({
					locale: "es-ES",
				}),
			);
		});

		it("should call request with pagination options", async () => {
			await getAttributeList(client, {
				page: 1,
				limit: 50,
			});

			expect(request).toHaveBeenCalledWith(
				client,
				"GET",
				"attributes",
				expect.objectContaining({
					searchParams: expect.objectContaining({
						page: 1,
						limit: 50,
					}),
				}),
			);
		});
	});
});
