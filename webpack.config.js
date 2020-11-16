/* Copyright G. Hemingway, 2020 - All rights reserved */
"use strict";

const path = require("path");

module.exports = {
  context: path.join(__dirname, "/src/client"),
  entry: ["babel-polyfill", "./main.js"],
  mode: "development",
  devtool: "source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public/js")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: ["url-loader"]
      }
    ]
  }
};
