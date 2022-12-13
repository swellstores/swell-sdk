import { describe, it, expect } from "vitest";
import products from "./products.json";
import expandedProducts from "./expanded-products.json";
import { productSchema } from "./productSchema";

describe("Product schema", () => {
	it("is valid for base products", () => {
		products.forEach((product) => {
			expect(() => productSchema.parse(product)).not.toThrow();
		});
	});

	it("is valid for expanded products", () => {
		expandedProducts.forEach((product) => {
			expect(() => productSchema.parse(product)).not.toThrow();
		});
	});
});
