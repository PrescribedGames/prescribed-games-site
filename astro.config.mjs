import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://prescribedgames.com",
  output: "static",          // ← static build = no adapter required
});
