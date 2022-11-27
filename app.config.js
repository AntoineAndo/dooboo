const IS_DEV = process.env.APP_VARIANT === "development";

module.exports = {
  expo: {
    name: IS_DEV ? "Dooboo (Dev)" : "Dooboo",
    slug: "dooboo",
    owner: "dooboo",
    scheme: "dooboo",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./src/assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./src/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#36D399",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.dooboo.app",
      icon: "./src/assets/icon.png",
      adaptiveIcon: {
        foregroundImage: "./src/assets/adaptive-icon.png",
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
      favicon: "./src/assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "8f55ac0e-3ad6-489d-9d3d-fc8eda940ad2",
      },
    },
  },
};
