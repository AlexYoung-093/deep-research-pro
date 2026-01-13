/** @type {import('next').NextConfig} */
const nextConfig = {
  // 实验性功能
  experimental: {
    // 启用服务端组件
    serverComponentsExternalPackages: [],
  },
  // 允许的图片域名
  images: {
    domains: [],
  },
  // 重定向配置
  async redirects() {
    return [];
  },
  // 头部配置
  async headers() {
    return [
      {
        // 允许 SSE 连接
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-transform" },
          { key: "X-Accel-Buffering", value: "no" },
        ],
      },
    ];
  },
};

export default nextConfig;


