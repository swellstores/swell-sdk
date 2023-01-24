import type { BaseModel } from "..";

interface BaseAttribute extends BaseModel {
	filterable?: boolean | null;
	name?: string | null;
	searchable?: boolean | null;
	visible?: boolean | null;
}

type StandardAttributeType =
	| "currency"
	| "file"
	| "image"
	| "number"
	| "text"
	| "textarea";
type OptionAttributeType = "checkbox" | "radio" | "select";

interface StandardAttribute extends BaseAttribute {
	type: StandardAttributeType;
}

export type AttributeType = StandardAttributeType | OptionAttributeType;

export interface OptionAttribute extends BaseAttribute {
	values?: string[] | null;
	type: OptionAttributeType;
}

export interface CheckBoxAttribute extends OptionAttribute {
	type: "checkbox";
	default?: string[] | null;
}

export interface SelectAttribute extends OptionAttribute {
	type: "select";
	default?: string | null;
}

export interface RadioAttribute extends OptionAttribute {
	type: "radio";
	default?: string | null;
}

export interface CurrencyAttribute extends StandardAttribute {
	type: "currency";
}

export interface NumberAttribute extends StandardAttribute {
	type: "number";
}

export interface TextAttribute extends StandardAttribute {
	type: "text";
}

export interface TextAreaAttribute extends StandardAttribute {
	type: "textarea";
}

export interface FileAttribute extends StandardAttribute {
	type: "file";
	multi?: boolean | null;
}

export interface ImageAttribute extends StandardAttribute {
	type: "image";
	multi?: boolean | null;
}

export type Attribute =
	| CheckBoxAttribute
	| CurrencyAttribute
	| FileAttribute
	| ImageAttribute
	| NumberAttribute
	| RadioAttribute
	| SelectAttribute
	| TextAreaAttribute
	| TextAttribute;
