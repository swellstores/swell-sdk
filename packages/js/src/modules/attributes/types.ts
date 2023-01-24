import type { SwellPaginationOptions } from "types/query";
import type { SwellSessionOptions } from "types/session";

export type GetAttributeListOptions = {
	requestOptions?: SwellSessionOptions;
} & SwellPaginationOptions;

export type GetAttributeOptions = {
	requestOptions?: SwellSessionOptions;
};
