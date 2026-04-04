/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // unoptimized=true lets any Supabase storage URL load without domain whitelisting issues
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
