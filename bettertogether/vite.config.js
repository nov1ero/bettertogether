import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodeResolve } from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodeResolve()],
  base: "/bettertogether/", // Ensure this matches your repo name
  define: {
    global: "globalThis",
    "process.env": {},
  },
  build: {
    rollupOptions: {
      external: ['@emailjs/browser'],
    },
  },
});
