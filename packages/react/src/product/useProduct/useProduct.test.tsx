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

	it("should return a product", async () => {
		const { result, waitForNextUpdate } = renderHook(
			() => useProduct("my-product-id"),
			{
				wrapper,
			},
		);

		await waitForNextUpdate();

		expect(result.current.product).toEqual({ name: "Product" });
	});
});
