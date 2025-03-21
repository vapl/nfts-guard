/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["boredapeyachtclub.com", "larvalabs.com", "opensea.io"], // Pievieno visus NFT attēlu hostus
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true, // 301 Redirect (SEO draudzīgi)
      },
    ];
  },
};

module.exports = nextConfig;
