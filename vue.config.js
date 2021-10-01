var path = require("path");
module.exports = {
  lintOnSave: false,
  devServer: {
    hot: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    }
  }
};
