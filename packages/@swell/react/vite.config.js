import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			// eslint-disable-next-line no-undef
			entry: resolve(__dirname, "src/index.ts"),
			name: "@swell/react",
			fileName: "swell-react",
		},
	},
});
