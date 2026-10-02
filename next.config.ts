import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ["elevating-humbly-starry.ngrok-free.dev"],
    async redirects() {
        return [
            {
                source: "/admin",
                destination: "/admin/home",
                permanent: true,
            },
            {
                source: "/student",
                destination: "/student/home",
                permanent: true,
            },
            {
                source: "/teacher",
                destination: "/teacher/home",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
