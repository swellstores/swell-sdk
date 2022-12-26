export type SwellPaginationOptions = {
	page?: number;
	limit?: number;
	sort?: string;
};

export type AttributeValue = string | number | string[] | number[];

export type SwellAttributes<F extends string = string> = {
	[key in F]?: AttributeValue;
};
