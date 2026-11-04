/// <reference lib="webworker" />

import { ExpirationPlugin } from "@serwist/expiration";
import { CacheFirst } from "@serwist/strategies";
import { installSerwist } from "@serwist/sw";
import type { RuntimeCaching } from "@serwist/sw";
import type { PrecacheEntry } from "@serwist/precaching";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[];
};

const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: ({ request, url }) =>
      url.origin === self.location.origin &&
      ["script", "style", "image", "font"].includes(request.destination),
    handler: new CacheFirst({
      cacheName: "hammet-static-v1",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  },
];

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
});