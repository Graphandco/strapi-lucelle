/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ["localhost", "shopping-list-admin.graphandco.com"],
      remotePatterns: [
         {
            protocol: "https",
            hostname: "shopping-list-admin.graphandco.com",
            pathname: "/uploads/**",
         },
      ],
   },
};

export default nextConfig;
