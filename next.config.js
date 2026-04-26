/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lzluqxxakgdshhqiomcy.supabase.co'],
    },
    transpilePackages: [
        'react-markdown',
        'remark-gfm',
        'remark-parse',
        'remark-rehype',
        'rehype-raw',
        'micromark',
        'mdast-util-to-hast',
        'unified',
    ],
}

module.exports = nextConfig
