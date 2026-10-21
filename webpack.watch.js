const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");

// Watch rebuilds into the unpacked Chrome directory created by `npm run chrome`.
// Reload the extension on chrome://extensions after output changes.
module.exports = merge(common, {
  mode: "development",
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  output: {
    path: path.resolve(__dirname, "chrome/dist"),
    publicPath: "/dist/",
  },
});
