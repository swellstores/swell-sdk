import { useEffect, useState } from "react";
import { getProduct } from "@swell/js";
import type { Product } from "@swell/js";
import useSwell from "swell/useSwell";

export default function useProduct(productProp: string | Product) {
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const client = useSwell();

	useEffect(() => {
		let mounted = true;

		async function fetchProduct(id: string) {
			setLoading(true);
			try {
				const product = await getProduct(client, id);

				setProduct(product);
			} catch (err) {
				setError(err as Error);
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		}

		if (typeof productProp === "string") {
			fetchProduct(productProp);
		} else {
			setProduct(productProp);
		}
		return () => {
			mounted = false;
		};
	}, [productProp, client]);

	return { product, loading, error };
}
