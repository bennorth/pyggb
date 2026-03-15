import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3000 },
  preview: { port: 3000 },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
