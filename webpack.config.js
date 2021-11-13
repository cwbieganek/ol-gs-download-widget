const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: path.resolve(__dirname, "src", "index.html"), to: path.resolve(__dirname, "dist") },
				{ from: path.resolve(__dirname, "src", "index.css"), to: path.resolve(__dirname, "dist") }
			],
		}),
	],
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: path.resolve(__dirname, "src", "main.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js'
  },
};
