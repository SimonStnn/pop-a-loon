const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let mode;
if (process.env.npm_lifecycle_script.includes('development'))
  mode = 'development';
else mode = 'production';

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
    new HtmlWebpackPlugin({
      template: './src/popup/index.html', // Specify the path to your HTML template
      filename: './popup.html', // Specify the output filename
    }),
  ],
  devtool: mode == 'development' ? 'inline-source-map' : undefined,
};
