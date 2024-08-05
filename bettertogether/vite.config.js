import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig({
  plugins: [react(), nodeResolve()],
  base: "/bettertogether/",
  define: {
    global: "globalThis",
    "process.env": {},
  },
  optimizeDeps: {
    include: ['@emailjs/browser'],
  },
});
