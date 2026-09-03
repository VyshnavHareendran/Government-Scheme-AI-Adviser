import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendTarget = env.VITE_API_BASE_URL || "http://localhost:8000";

  return {
    plugins: [react()],

    server: {
      proxy: {
        "/auth": backendTarget,
        "/admin/dashboard": backendTarget,
        "/admin/citizens/": backendTarget,
        "/admin/employees/": backendTarget,
        "/admin/ai-recommendations": backendTarget,
        "/admin/reports": backendTarget,
        "/citizen-profile": backendTarget,
        "/schemes": backendTarget,
        "/rule-engine": backendTarget,
        "/recommendations": backendTarget,
        "/eligibility": backendTarget,
      },
    },
  };
});