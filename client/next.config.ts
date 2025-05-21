/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'res.google.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com', // Ảnh Google
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com', // Ảnh GitHub
          port: '',
          pathname: '/**',
        },
      ],
    },
  };