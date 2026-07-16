import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/guides/merge-pdf-on-windows",
        destination: "/guides/how-to-merge-pdf",
        permanent: true,
      },
      {
        source: "/guides/merge-pdf-on-mac",
        destination: "/guides/how-to-merge-pdf",
        permanent: true,
      },
      {
        source: "/guides/merge-pdf-on-iphone",
        destination: "/guides/how-to-merge-pdf",
        permanent: true,
      },
      {
        source: "/guides/merge-pdf-on-android",
        destination: "/guides/how-to-merge-pdf",
        permanent: true,
      },
      {
        source: "/guides/jpg-to-pdf-on-windows",
        destination: "/guides/how-to-convert-jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/guides/jpg-to-pdf-on-mac",
        destination: "/guides/how-to-convert-jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/guides/jpg-to-pdf-on-iphone",
        destination: "/guides/how-to-convert-jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/guides/jpg-to-pdf-on-android",
        destination: "/guides/how-to-convert-jpg-to-pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
