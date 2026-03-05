/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Needed for docker
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

module.exports = nextConfig;
