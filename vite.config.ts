import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    base: "/mini-hr-2.0/",   // ✅ REQUIRED for GitHub Pages
    plugins: [react()],
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    define: {
      // ⚠️ we’ll fix this properly below
      "process.env": {},
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
