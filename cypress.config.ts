import { defineConfig } from "cypress";
import * as fs from "node:fs/promises";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/",
    viewportWidth: 1200,
    viewportHeight: 1024,

    setupNodeEvents(on, _config) {
      on("task", {
        readdir: fs.readdir,
      });
    },
  },
});
