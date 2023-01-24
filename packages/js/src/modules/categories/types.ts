import type {
	Category,
	WithParent,
	WithProducts,
	WithTop,
} from "types/api/categories";
import type { SwellPaginationOptions } from "types/query";
import type { SwellSessionOptions } from "types/session";
import type { Expand, ExpandableField } from "types/utils";

export type Option = {
	id: string;
	value: string | number;
};

export type GetCategoryListOptions = {
	requestOptions?: SwellSessionOptions;
} & SwellPaginationOptions;

export type GetCategoryExpandOptions = "parent" | "products" | "top";

export type GetCategoryOptions<
	E extends Array<ExpandableField<GetCategoryExpandOptions>>,
> = {
	expand?: E;
	requestOptions?: SwellSessionOptions;
};

export type GetCategoryResult<
	E extends Array<ExpandableField<GetCategoryExpandOptions>> = [],
> = Category &
	Expand<"parent", E, WithParent<Category>> &
	Expand<"products", E, WithProducts<Category>> &
	Expand<"top", E, WithTop<Category>>;
