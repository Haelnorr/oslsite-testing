import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/the-pond': '/the-pond/1'
  },
  integrations: [react(), tailwind()],
  output: "server",
  adapter: netlify()
});