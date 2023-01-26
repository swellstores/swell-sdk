import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import useProduct from "./useProduct";
import server from "mocks/server";
import { SwellContextProvider } from "provider";
import type { ReactNode } from "react";

const store = "swell-store";
const storeKey = "swell-store-key";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useProduct", () => {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<SwellContextProvider storeKey={storeKey} store={store}>
			{children}
		</SwellContextProvider>
	);

	it("should fetch a product when given an ID", async () => {
		const { result, waitForNextUpdate } = renderHook(
			() => useProduct("my-product-id"),
			{
				wrapper,
			},
		);

		await waitForNextUpdate();

		expect(result.current.product).toEqual({ name: "Product" });
		expect(result.current.error).toBeNull();
	});

	it("should use an existing product when passed", async () => {
		const product = { name: "Product" };
		const { result } = renderHook(() => useProduct(product), {
			wrapper,
		});

		expect(result.current.product).toEqual(product);
	});

	it("should update `loading` during and after fetching", async () => {
		const { result, waitForValueToChange } = renderHook(
			() => useProduct("my-product-id"),
			{
				wrapper,
			},
		);
		expect(result.current.loading).toBe(true);
		await waitForValueToChange(() => result.current.loading);
		expect(result.current.loading).toBe(false);
	});

	it("should update `error` on failed requests", async () => {
		const { result, waitForValueToChange } = renderHook(
			() => useProduct("invalid-id"),
			{
				wrapper,
			},
		);
		expect(result.current.error).toBeNull();
		await waitForValueToChange(() => result.current.error);
		expect(result.current.error).toBeInstanceOf(Error);
	});

	it("should return the activeVariant for the props", () => {
		const product = {
			id: "product-1",
			purchaseOptions: {
				standard: {
					price: 30,
				},
				subscription: {
					plans: [
						{
							id: "plan-1",
							name: "Monthly",
							price: 25,
						},
						{
							id: "plan-2",
							name: "Weekly",
							price: 20,
						},
					],
				},
			},
			options: [
				{
					id: "option-1",
					name: "Size",
					values: [
						{
							id: "option-value-1",
							name: "S",
						},
						{
							id: "option-value-2",
							name: "M",
						},
					],
				},
			],
			variants: {
				results: [
					{
						id: "variant-1",
						optionValueIds: ["option-value-1"],
						price: 30,
					},
					{
						id: "variant-2",
						optionValueIds: ["option-value-2"],
						price: 35,
					},
				],
			},
		};
		const selectedPlan = "plan-2";
		const selectedProductOptions = [
			{
				optionId: "option-1",
				valueId: "option-value-2",
			},
		];

		const expectedActiveVariant = {
			productId: "product-1",
			id: "variant-2",
			variantId: "variant-2",
			optionValueIds: ["option-value-2"],
			price: 35,
			priceData: {
				standard: {
					price: 35,
				},
				subscription: {
					id: "plan-2",
					name: "Weekly",
					price: 20,
				},
			},
		};

		const { result } = renderHook(
			() =>
				useProduct(product, {
					selectedPlanId: selectedPlan,
					selectedOptions: selectedProductOptions,
				}),
			{
				wrapper,
			},
		);

		expect(result.current.activeVariant).toEqual(expectedActiveVariant);
	});
});
