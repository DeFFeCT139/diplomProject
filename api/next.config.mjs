/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    experimental: {
        serverComponentsExternalPackages: ["@prisma/client", "prisma"],
    },
}

export default nextConfig;
