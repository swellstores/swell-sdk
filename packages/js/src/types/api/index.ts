export * from "types/api/products";

export interface Page {
	start: number;
	end: number;
}

export interface PaginatedResponse<T> {
	count: number;
	results: T[];
	page: number;
	pages?: Record<string, Page>;
}
