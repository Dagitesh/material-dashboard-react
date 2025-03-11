const path = require("path");

module.exports = function override(config) {
  config.module.rules.push({
    test: /\.js$/,
    enforce: "pre",
    use: ["source-map-loader"],
    exclude: [
      /node_modules\/stylis-plugin-rtl/, // Ignore stylis-plugin-rtl source map warning
    ],
  });
  return config;
};
