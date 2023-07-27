module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "transform-inline-environment-variables",
      ["module:react-native-dotenv"],
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            assets: "./assets",
          },
        },
      ],
    ],
  };
};
