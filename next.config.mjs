/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: (() => {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE ||
        "https://project-25-2-scrum-team-2.onrender.com";
      try {
        const parsed = new URL(apiBase);
        return [
          {
            protocol: parsed.protocol.replace(":", ""),
            hostname: parsed.hostname,
            port: parsed.port || "",
            pathname: "/img-upload/**",
          },
        ];
      } catch (e) {
        return [];
      }
    })(),
  },
};

export default nextConfig;
