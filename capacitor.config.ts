import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gamifiedtodo.app",
  appName: "Gamified Todo",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
