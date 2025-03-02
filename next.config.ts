/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["boredapeyachtclub.com", "larvalabs.com", "opensea.io"], // Pievieno visus NFT attēlu hostus
  },
};

module.exports = nextConfig;
