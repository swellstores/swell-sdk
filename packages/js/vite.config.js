import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		lib: {
			// eslint-disable-next-line no-undef
			entry: resolve(__dirname, "src/index.ts"),
			name: "@swell/js",
			fileName: "swell-js",
		},
	},
});
