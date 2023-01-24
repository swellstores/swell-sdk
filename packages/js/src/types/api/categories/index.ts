import type { BaseModel, Content, PaginatedResponse, Image } from "types/api";

export * from "./expanded";

export interface Category extends BaseModel {
	top_id?: string | null;
	slug?: string | null;
	name?: string | null;
	content?: Content | null;
	parent_id?: string | null;
	meta_title?: string | null;
	meta_description?: string | null;
	images?: Image[] | null;
	description?: string | null;
	id?: string | null;
	children?: PaginatedResponse<Category> | null;
}

export type LImitedCategory = Pick<Category, "top_id" | "id" | "name" | "slug">;
