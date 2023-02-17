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
	id?: string | null;
	date_created?: string | null;
	date_updated?: string | null;
}

export type Content = Record<string, unknown>;
export type Attributes = Record<string, unknown>;

export interface Image {
	file?: File | null;
	id?: string | null;
}

export interface File {
	content_type?: string | null;
	date_uploaded?: string | null;
	filename?: string | null;
	height?: number | null;
	id?: string | null;
	length?: number | null;
	md5?: string | null;
	url?: string | null;
	width?: number | null;
}
