/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nftsguard.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  exclude: ["/scanner/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
  },
};
