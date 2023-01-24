import type { Category, LImitedCategory } from ".";
import type { PaginatedResponse } from "types/api";
import type { Product } from "types/api/products";

export type WithParent<T extends Category> = T & {
	parent?: LImitedCategory | null;
};

export type WithProducts<T extends Category> = T & {
	products?: PaginatedResponse<Product> | null;
};

export type WithTop<T extends Category> = T & {
	top?: LImitedCategory | null;
};
