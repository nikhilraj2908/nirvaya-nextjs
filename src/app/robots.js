export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*']
      }
    ],
    sitemap: 'https://nirvayaeyecare.com/sitemap.xml'
  };
}
