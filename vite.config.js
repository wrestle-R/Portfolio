import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import githubContributions from "./api/github-contributions.js"
import { seoPlugin } from "./scripts/seo-plugin.js"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin(), {
    name: 'github-activity-api',
    configureServer(server) {
      // Read credentials only in the Node dev server, matching Vercel Functions.
      const env = loadEnv(server.config.mode, server.config.envDir, '');
      const token = env.GITHUB_TOKEN || env.VITE_GITHUB_API;
      if (token && !process.env.GITHUB_TOKEN) process.env.GITHUB_TOKEN = token;
      server.middlewares.use('/api/github-contributions', (req, res) => {
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
        githubContributions(req, res);
      });
    },
  }],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
})