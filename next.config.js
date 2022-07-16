/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "pbs.twimg.com",
    ],
  },
};

module.exports = withBundleAnalyzer({ nextConfig });
