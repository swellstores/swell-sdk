import type { PaginatedResponse } from "types/api";
import type { Category, Product, UpSell, Variant } from "types/api/products";

export type WithVariants<T extends Product> = T & {
	variants?: PaginatedResponse<Variant>;
};

export type WithCategories<T extends Product> = T & {
	categories?: PaginatedResponse<Category>;
};

export type WithUpSellProducts<T extends Product> = T & {
	up_sells?: (UpSell & { product: Product })[];
};
