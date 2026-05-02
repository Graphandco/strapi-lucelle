/** @type {import('next').NextConfig} */
const supabasePatterns = (() => {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   if (!url) return [];
   try {
      const { protocol, hostname } = new URL(url);
      return [
         {
            protocol: protocol.replace(":", ""),
            hostname,
            pathname: "/storage/v1/object/public/**",
         },
      ];
   } catch {
      return [];
   }
})();

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
         {
            protocol: "https",
            hostname: "payload.graphandco.com",
            // pathname: "/api/media/file/**",
         },
         {
            protocol: "https",
            hostname: "www.gravatar.com",
            pathname: "/avatar/**",
         },
         {
            protocol: "https",
            hostname: "gravatar.com",
            pathname: "/avatar/**",
         },
         ...supabasePatterns,
      ],
   },
};

export default nextConfig;
