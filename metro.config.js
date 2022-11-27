// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

console.log("dirname", __dirname);

module.exports = getDefaultConfig(__dirname);
