import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If your backend runs on a different port (e.g. 5000), this proxy lets you
// call "/api/..." from the frontend without CORS headaches during dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
