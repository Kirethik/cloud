/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Needed for docker
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
