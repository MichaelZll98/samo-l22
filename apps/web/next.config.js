/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  transpilePackages: ['@studio-l22/ui', '@studio-l22/core', '@studio-l22/types', '@studio-l22/config'],
}

module.exports = nextConfig
