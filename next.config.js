const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline",
  },
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: ({ request, url }) =>
          request.headers.get("RSC") === "1" ||
          request.headers.get("Next-Router-Prefetch") === "1" ||
          request.headers.get("Next-Router-State-Tree") === "1" ||
          url.pathname.includes("_rsc"),
        handler: "NetworkFirst",
        options: {
          cacheName: "next-rsc",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [200],
            headers: {
              "content-type": "text/x-component",
            },
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {},
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
