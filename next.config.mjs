/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: `${process.env.NEXT_PUBLIC_SUPABASE_PROJECTID}.supabase.co`,
        protocol: "https",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });

    config.resolve.alias.canvas = false;

    return config;
  },
};

export default nextConfig;
