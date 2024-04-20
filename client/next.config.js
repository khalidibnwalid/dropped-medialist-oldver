/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, //i added this
  },
  env: {
    PUBLIC_IMG_PATH: process.env.IMG_PATH,
  },
}

module.exports = nextConfig
