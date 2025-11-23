/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: false,
  sassOptions: {
    sourceMap: false,
  },
  turbopack: {},
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = false
    }
    return config
  },
};

export default nextConfig;
