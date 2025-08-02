import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns:[
      {
        protocol:"https",
        hostname:"placehold.co"
      },
      {
        protocol:"https",
        hostname:"res.cloudinary.com"
      }
    ]
    ,
    // domains:["res.cloudinary.com", "placehold.co"]
  },
};

export default nextConfig;
