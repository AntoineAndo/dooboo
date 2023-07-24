import * as dotenv from "dotenv";
dotenv.config();

const isDev = process.env.DEV_CLIENT == "true";

module.exports = {
  expo: {
    name: isDev ? "Dooboo (Dev)" : "Dooboo",
    slug: "dooboo",
    owner: "dooboo",
    version: "0.0.85",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#36D399",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: isDev ? "com.dooboo.app.dev" : "com.dooboo.app",
      versionCode: 85,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#36D399",
      },
      permissions: [
        "READ_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      IS_DEV_CLIENT: isDev,
      SUPABASE_URL: isDev
        ? process.env.REACT_SUPABASE_DEV_URL
        : process.env.REACT_SUPABASE_PROD_URL,
      SUPABASE_KEY: isDev
        ? process.env.REACT_SUPABASE_DEV_KEY
        : process.env.REACT_SUPABASE_PROD_KEY,
      SUPABASE_SERVICE_ROLE: isDev
        ? process.env.REACT_SUPABASE_DEV_SERVICE_ROLE
        : process.env.REACT_SUPABASE_PROD_SERVICE_ROLE,
      REACT_APP_GOOGLE_API_KEY: process.env.REACT_APP_GOOGLE_API_KEY,
      REACT_KAKAO_REST_API_KEY: process.env.REACT_KAKAO_REST_API_KEY,
      eas: {
        projectId: "8f55ac0e-3ad6-489d-9d3d-fc8eda940ad2",
      },
    },
    plugins: ["expo-localization"],
    updates: {
      url: "https://u.expo.dev/8f55ac0e-3ad6-489d-9d3d-fc8eda940ad2",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
};
