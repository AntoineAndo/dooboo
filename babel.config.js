module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-paper/babel',
      [
        "module:react-native-dotenv",
        {
          envName: "REACT_APP",
          moduleName: "@env",
          path: ".env"
        }
      ]
    ]
  };
};
