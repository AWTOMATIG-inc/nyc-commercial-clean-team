import { getBlogs } from "@/utility/getBlogs";

export default async function sitemap() {
    const blogs=await getBlogs()
    const blogUrls = blogs.map(blog => ({
        url: `${process.env.BASE_URL}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updatedAt).toISOString(),
    }));
    
  return [
    {
        url: `${process.env.BASE_URL}/`,
        lastModified: new Date().toISOString(), 
    },
    {
        url: `${process.env.BASE_URL}/about`,
        lastModified: new Date().toISOString(),
    },
    {
        url: `${process.env.BASE_URL}/services`,
        lastModified: new Date().toISOString(), 
    },
    {
        url: `${process.env.BASE_URL}/contact`,
        lastModified: new Date().toISOString(), 
    },
    {
        url: `${process.env.BASE_URL}/service-area`,
        lastModified: new Date().toISOString(), 
    },
    {
        url: `${process.env.BASE_URL}/booking`,
        lastModified: new Date().toISOString(), 
    },
    {
        url: `${process.env.BASE_URL}/booking/thankyou`,
        lastModified: new Date().toISOString(), 
    },
    {
        url: `${process.env.BASE_URL}/blogs`,
        lastModified: new Date().toISOString(), 
    },
    ...blogUrls
  ]
}
