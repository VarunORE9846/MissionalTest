/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
  },
};

export default nextConfig;
