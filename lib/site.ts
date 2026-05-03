const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yiseul-portfolio.vercel.app'

export const siteUrl = (
  configuredSiteUrl.includes('portpolio2yiseul.vercel.app')
    ? 'https://yiseul-portfolio.vercel.app'
    : configuredSiteUrl
).replace(/\/+$/, '')
