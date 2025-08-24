// vite.config.ts / vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    // 🔌 폰/다른 기기에서도 접속 가능하게 0.0.0.0 바인딩
    host: true,
    port: 5173,
    strictPort: true,

    // 🔄 터널(localtunnel/ngrok)처럼 https 프록시 뒤에서 HMR이 막힐 때 유용
    // (문제 없으면 지워도 됨)
    hmr: {
      protocol: "wss",
      clientPort: 443,
    },

    // 🌐 백엔드로 /api 프록시
    proxy: {
      "/api": {
        target: "https://sg3yrs-masil.duckdns.org",
        changeOrigin: true, // Host 헤더를 대상 도메인으로 변경
        secure: false, // 개발 편의: 인증서 문제 무시
        ws: false, // 웹소켓 안 쓰면 false
        // /api/user/1 -> https://sg3yrs-masil.duckdns.org/user/1
        rewrite: (path) => path.replace(/^\/api(\/|$)/, "/"),
        configure: (proxy) => {
          proxy.on("error", (err, req) => {
            console.error("[vite proxy] error:", err?.message, req?.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            // console.log("[vite proxy] res:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
