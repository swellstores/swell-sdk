import { defineConfig } from "vite";
import { resolve } from "path";
import tsConfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			// eslint-disable-next-line no-undef
			entry: resolve(__dirname, "src/index.ts"),
			name: "@swell/js",
			fileName: "index",
		},
	},
	plugins: [tsConfigPaths(), dts()],
});
