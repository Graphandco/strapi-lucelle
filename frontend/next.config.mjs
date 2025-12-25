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
            hostname: "shopping-list-admin.graphandco.com",
            pathname: "/uploads/**",
         },
      ],
   },
};

export default nextConfig;
