 
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/',"/dashboard/client-feedback","/dashboard/bookings","/dashboard/users","/dashboard/subscribers"],
    },
    sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  }
}