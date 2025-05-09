import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	base: "/peter-shin-dp/", // Set this to your repository name
	plugins: [react()],
	build: {
		outDir: "build",
	},
});
