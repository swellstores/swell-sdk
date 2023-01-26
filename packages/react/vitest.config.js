import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		plugins: [react()],
		test: {
			cache: false,
		},
	}),
);
