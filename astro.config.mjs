import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless"; // use Vercel serverless adapter

export default defineConfig({
  site: "https://prescribedgames.com",
  output: "server",
  adapter: vercel(),
});
