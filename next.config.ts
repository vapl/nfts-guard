/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "boredapeyachtclub.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "larvalabs.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "opensea.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.reservoir.tools",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.seadn.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.reservoir.tools",
        pathname: "/**",
      },
    ],
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
