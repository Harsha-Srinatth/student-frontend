import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react() , tailwindcss()],
  server: {
  // Use IPv4 instead of IPv6 to avoid permission issues
    port: 5173,
    // proxy: {
    //   "/api": 'http://localhost:5000',
    // },
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
