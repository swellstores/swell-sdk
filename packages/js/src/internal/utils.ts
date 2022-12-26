import type { CamelCase } from "types/utils";

const ONE_WEEK = 60 * 60 * 24 * 7;

export function removeTrailingSlash(url: string) {
	return url.replace(/\/$/, "");
}

export function safeAwait<T>(promise: Promise<T>) {
	return promise
		.then((data) => ({ data, err: null }))
		.catch((err: Error) => ({ data: null, err }));
}

export const isBrowser = () => (globalThis as any)?.document !== undefined;

export function getCookie(name: string) {
	if (!isBrowser()) {
		return;
	}

	const value = `; ${(globalThis as any)?.document?.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(";").shift();
	}

	return null;
}

export function setCookie(name: string, value: string) {
	if (!isBrowser()) {
		return;
	}
	const expires = new Date(Date.now() * ONE_WEEK).toUTCString();
	(
		globalThis as any
	).document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function base64(string: string) {
	if (typeof btoa === "function") {
		return btoa(string);
	}
	return Buffer.from(string).toString("base64");
}

export function objectToCamel<T extends object>(object: T): CamelCase<T> {
	if (Array.isArray(object)) {
		const result = object.map((item) => {
			if (item !== null && typeof item === "object") {
				return objectToCamel(item);
			}
			return item;
		});

		return result as CamelCase<T>;
	}

	const result = Object.keys(object).reduce((acc, key) => {
		const camelKey = camelCase(key);
		const value = object[key as keyof T];

		if (value !== null && typeof value === "object") {
			acc[camelKey] = objectToCamel(value);
		} else {
			acc[camelKey] = value;
		}

		return acc;
	}, {} as Record<string, unknown>);

	return result as CamelCase<T>;
}

export function camelCase(key: string) {
	return key.replace(/(_[a-z0-9])/gi, ($1) =>
		$1.toUpperCase().replace("_", ""),
	);
}
