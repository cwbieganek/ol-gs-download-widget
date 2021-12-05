const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: path.resolve(__dirname, "static"), to: path.resolve(__dirname, "dist") }
			],
		}),
	],
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: path.resolve(__dirname, "src", "main.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js'
  },
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
		port: 9000
	},
};
