import { rest } from "msw";

export const handlers = [
	rest.get("https://*.swell.store/api/products/:id", (_, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				name: "Product",
			}),
		);
	}),
];
