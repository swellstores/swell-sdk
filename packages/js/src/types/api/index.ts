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

export interface BaseModel {
	id?: string;
	date_created?: string;
	date_updated?: string;
}
