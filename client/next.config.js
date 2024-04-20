/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, //i added this
  },
  env: {
    PUBLIC_IMG_PATH: process.env.IMG_PATH,
    PUBLIC_API_URL: process.env.API_URL,
  },
}

module.exports = nextConfig
