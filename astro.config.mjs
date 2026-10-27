import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://theycallmewinson.github.io",
  base: "/Css-website",
  trailingSlash: "always",
  output: "static",
  devToolbar: { enabled: false },
});
