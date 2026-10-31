import type { Config } from "@react-router/dev/config";

import { deploymentBasePath } from "./deployment.config.ts";

export default {
  ssr: false,
  appDirectory: "src/app",
  basename:
    import.meta.env.MODE === "production" ? deploymentBasePath : "/",
} satisfies Config;
