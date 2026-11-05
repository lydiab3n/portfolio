import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // three.js in its own file: visitors cache it once, and it loads without blocking the page
        manualChunks: (id: string) => (id.includes("node_modules/three") ? "three" : undefined),
      },
      input: {
        main: resolve(__dirname, "index.html"),
        room: resolve(__dirname, "room.html"),
      },
    },
  },
});
