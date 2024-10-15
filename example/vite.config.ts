import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 使服务可以被外部访问
    port: 3000, // 你可以设置你喜欢的端口
    open: true, // 是否在启动服务时自动打开浏览器
  },
});
