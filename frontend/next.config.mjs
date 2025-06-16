/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ["localhost", "admin-elsass-compta.graphandco.net"],
      remotePatterns: [
         {
            protocol: "https",
            hostname: "admin-elsass-compta.graphandco.net",
            pathname: "/uploads/**",
         },
      ],
   },
};

export default nextConfig;
