/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "bizzare-jelly-strapi-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "bizzare-jelly.vercel.app",
      },
    ],
  },
};

export default nextConfig;
