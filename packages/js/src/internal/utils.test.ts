import {
	camelCase,
	isBrowser,
	removeTrailingSlash,
	objectToCamel,
} from "./utils";
import { describe, it, expect, vi } from "vitest";

describe("utils", () => {
	describe("removeTrailingSlash", () => {
		it("should not affect the output if there is no trailing slash", () => {
			expect(removeTrailingSlash("https://test.com")).toBe("https://test.com");
		});

		it("should remove trailing slash", () => {
			expect(removeTrailingSlash("test/")).toBe("test");
		});
	});

	describe("isBrowser", () => {
		it("should return true if window is defined", () => {
			vi.stubGlobal("document", {});
			expect(isBrowser()).toBe(true);
		});
	});

	describe("camelCase", () => {
		it("should convert snake_case to camelCase", () => {
			expect(camelCase("snake_case")).toBe("snakeCase");
			expect(camelCase("snake_case_2")).toBe("snakeCase2");
			expect(camelCase("snake__case")).toBe("snake_Case");
			expect(camelCase("snake_case_")).toBe("snakeCase_");
			expect(camelCase("snake_case__")).toBe("snakeCase__");
			expect(camelCase("test_snake_case")).toBe("testSnakeCase");
		});
	});

	describe("objectToCamel", () => {
		it("should convert snake_case keys to camelCase", () => {
			expect(objectToCamel({ snake_case: "test" })).toEqual({
				snakeCase: "test",
			});
		});

		it("should convert snake_case keys to camelCase in arrays", () => {
			expect(objectToCamel([{ snake_case: "test" }])).toEqual([
				{ snakeCase: "test" },
			]);
		});

		it("should convert snake_case keys to camelCase in nested objects", () => {
			expect(objectToCamel({ snake_case: { snake_case: "test" } })).toEqual({
				snakeCase: { snakeCase: "test" },
			});
		});

		it("should convert snake_case keys to camelCase in nested arrays", () => {
			expect(objectToCamel({ snake_case: [{ snake_case: "test" }] })).toEqual({
				snakeCase: [{ snakeCase: "test" }],
			});
		});

		it("should convert snake_case keys to camelCase many levels deep", () => {
			expect(
				objectToCamel({
					snake_case: {
						snake_case: {
							snake_case: [{ snake_case: { snake_case: "test" } }],
						},
					},
				}),
			).toEqual({
				snakeCase: {
					snakeCase: { snakeCase: [{ snakeCase: { snakeCase: "test" } }] },
				},
			});
		});
	});
});
