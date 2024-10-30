import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "kanjistudy.stealthwork.app",
  appName: "Kanji Study",
  webDir: "out",
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    },
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
  },
  server: {
    androidScheme: "https",
    allowNavigation: ["*"],
  },
};

export default config;
