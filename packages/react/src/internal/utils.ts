export function castError(error: unknown) {
	if (error instanceof Error) {
		return error;
	} else if (typeof error === "string") {
		return new Error(error);
	}

	return new Error("Unknown error");
}
