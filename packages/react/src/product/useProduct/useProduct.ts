import { useEffect, useMemo, useState } from "react";
import useSwell from "swell/useSwell";
import {
	GetProductOptions,
	SelectedProductOption,
	getActiveVariant,
	getProduct,
} from "@swell/js";
import type { Product, CamelCase, ExpandableFields } from "@swell/js";

type UseProductOptions<E extends ExpandableFields> = {
	selectedOptions?: SelectedProductOption[];
	selectedPlanId?: string | null;
} & GetProductOptions<E>;

export default function useProduct<
	T extends CamelCase<Product>,
	E extends ExpandableFields = [],
>(
	productProp: string | T | undefined | null,
	options: UseProductOptions<E> = {},
) {
	const [product, setProduct] = useState<T | null | undefined>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const client = useSwell();

	useEffect(() => {
		let mounted = true;

		async function fetchProduct(id: string) {
			setLoading(true);
			try {
				const product = await getProduct(client, id, {
					expand: options.expand,
					requestOptions: options.requestOptions,
				});
				if (mounted) {
					setProduct(product);
					setError(null);
				}
			} catch (err) {
				if (mounted) setError(err as Error);
			} finally {
				if (mounted) setLoading(false);
			}
		}

		if (typeof productProp === "string") {
			fetchProduct(productProp);
		} else if (mounted) {
			setProduct(productProp);
		}
		return () => {
			mounted = false;
		};
	}, [client, options.expand, options.requestOptions, productProp]);

	const activeVariant = useMemo(
		() =>
			getActiveVariant(
				product,
				options.selectedOptions,
				options.selectedPlanId,
			),
		[options.selectedOptions, options.selectedPlanId, product],
	);

	return { product, activeVariant, loading, error };
}
