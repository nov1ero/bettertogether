import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/bettertogether/", // Ensure this matches your repo name
  define: {
    global: "globalThis",
    "process.env": {},
  },
});
