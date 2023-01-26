import { useEffect, useState } from "react";
import useSwell from "swell/useSwell";
import { getProductList } from "@swell/js";
import type {
	Product,
	CamelCase,
	PaginatedResponse,
	GetProductListOptions,
} from "@swell/js";

export default function useProductList<F extends string = string>(
	options?: GetProductListOptions<F>,
) {
	const [products, setProducts] = useState<CamelCase<
		PaginatedResponse<Product>
	> | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const client = useSwell();

	useEffect(() => {
		let mounted = true;

		async function fetchProductList() {
			setLoading(true);
			try {
				const products = await getProductList(client, options);
				if (mounted) {
					setProducts(products);
					setError(null);
				}
			} catch (err) {
				if (mounted) setError(err as Error);
			} finally {
				if (mounted) setLoading(false);
			}
		}

		fetchProductList();

		return () => {
			mounted = false;
		};
	}, [client, options]);

	return { products, loading, error };
}
