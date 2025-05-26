import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // catch any import that ends with `/ui/button`
      {
        find: /\/ui\/button$/,
        replacement: path.resolve(
          __dirname,
          "src/components/ui/Button.jsx"
        ),
      },
      // keep your existing "@" alias
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/firebase-messaging-sw.js": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
