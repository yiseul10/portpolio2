/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    // 동적 라우팅에 대한 fallback 설정
    generateStaticParams: {
        fallback: true, // 또는 'blocking'
    },
    images: {
        domains: ['https://yotocrfidehgijxpimcp.supabase.co'],
    },
}

module.exports = nextConfig
