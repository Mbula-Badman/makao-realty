/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: process.env.IMAGE_HOSTNAME || "images.unsplash.com" }],
  },
};

export default nextConfig;
