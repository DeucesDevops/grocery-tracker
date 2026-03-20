/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained build in .next/standalone —
  // no node_modules needed in the final Docker image.
  output: "standalone",
};

export default nextConfig;
