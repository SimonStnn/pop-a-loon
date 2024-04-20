const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

let mode;
if (process.env.npm_lifecycle_script.includes('development'))
  mode = 'development';
else mode = 'production';

const browser = process.env.BROWSER;

console.log(`Building for ${browser} in ${mode} mode`);
console.log(`Version: ${process.env.npm_package_version}`);
console.log(`Remote: ${process.env.REMOTE}`);

module.exports = {
  mode,
  entry: {
    background: './src/background/background.ts',
    content: './src/content/content.ts',
    popup: './src/popup/index.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin(['REMOTE']),
    new HtmlWebpackPlugin({
      template: './src/popup/index.html', // Specify the path to your HTML template
      filename: './popup.html', // Specify the output filename
    }),
    new CopyWebpackPlugin({
      patterns: [
        // Copy resource files to dist
        { from: 'resources/', to: 'resources/' },
        // Copy manifest.json to dist
        {
          from: `manifest.json`,
          to: 'manifest.json',
          transform: (content) => {
            const manifest = JSON.parse(content.toString());
            manifest.version = process.env.npm_package_version;

            const manifest_overrides = fs.readFileSync(
              `manifest.${browser}.json`
            );

            return JSON.stringify({
              ...manifest,
              ...JSON.parse(manifest_overrides),
            });
          },
        },
      ],
    }),
  ],
  devtool: mode == 'development' ? 'inline-source-map' : undefined,
};
