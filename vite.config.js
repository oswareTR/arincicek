import { defineConfig } from "vite";

// Local/dev/preview serve at /. GitHub project Pages needs the repo path.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/arincicek/" : "/",
});
