import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://dummyjson.com/", // Replace with your backend URL (if your backend runs on port 3000)
        changeOrigin: true,
      },
    },
  },
});
