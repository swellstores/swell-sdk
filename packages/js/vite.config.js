import { defineConfig } from "vite";
import { resolve } from "path";
import tsConfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

const deps = Object.keys(pkg.dependencies);

export default defineConfig({
	build: {
		lib: {
			// eslint-disable-next-line no-undef
			entry: resolve(__dirname, "src/index.ts"),
			name: "@swell/js",
			fileName: "index",
		},
		rollupOptions: {
			external: deps,
		},
	},
	plugins: [tsConfigPaths(), dts()],
});
