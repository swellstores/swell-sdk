import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import useProductList from "./useProductList";
import server from "mocks/server";
import { SwellContextProvider } from "provider";
import type { ReactNode } from "react";

const store = "swell-store";
const storeKey = "swell-store-key";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useProductList", () => {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<SwellContextProvider storeKey={storeKey} store={store}>
			{children}
		</SwellContextProvider>
	);

	it("should fetch the product list", async () => {
		const { result, waitForValueToChange } = renderHook(
			() => useProductList(),
			{
				wrapper,
			},
		);

		expect(result.current?.products).toBeNull();
		expect(result.current?.loading).toBe(true);
		await waitForValueToChange(() => result.current?.loading);
		expect(result.current.products).toEqual({
			products: [
				{
					id: "1",
					myProperty: "my_value",
					name: "Product 1",
				},
			],
		});
		expect(result.current?.loading).toBe(false);
		expect(result.current.error).toBeNull();
	});
});
