import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV == "development"

const connectSrc = [
  "'self'",
  ...(isDev ? ["http://localhost:8000", "https://dev-api.hammetedu.com"] : []),
  "https://dev-api.hammetedu.com",
  "https://staging-api.hammetedu.com",
  "https://api.hammetedu.com",
  "https://accounts.google.com",
  "https://*.googleusercontent.com",
].join(" ")

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com/gsi/client",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.unsplash.com https://accounts.google.com https://*.googleusercontent.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      `connect-src 'self' ${connectSrc}`,
      "frame-src 'self' https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
