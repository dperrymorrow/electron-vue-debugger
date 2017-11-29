const path = require("path");
const webpack = require("webpack");
const ENV = process.env.NODE_ENV;
const minify = require("babel-minify-webpack-plugin");

module.exports = {
  entry: ENV == "development" ? "./dev/index.js" : "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "build.js",
    library: "ElectronVueDebugger",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
};

if (ENV === "development") {
  module.exports.devtool = "#source-map";
}

if (ENV === "production") {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({ "process.env": { NODE_ENV: '"production"' } }),
    new minify({ removeConsole: true, removeDebugger: true }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
  ]);
}
