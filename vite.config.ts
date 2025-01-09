import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  // @ts-expect-error
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ["svelte-awesome"],
  },

  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
