const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Base config that applies to either development or production mode.
const config = {
  entry: {
    index: path.resolve(__dirname, 'src', 'index.ts'),
    'view-data': path.resolve(__dirname, 'src', 'view-data.ts'),
  },
  output: {
    // Compile the source files into a bundle.
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    static: [
      path.resolve(__dirname, 'dist'),
      path.resolve(__dirname, 'public'),
    ],
    open: true,
    port: 8081,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        // Load CSS files. They can be imported into JS files.
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    // Generate the HTML index page based on our template.
    // This will output the same index page with the bundle we
    // created above added in a script tag.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: 'src/view-data.html',
      filename: 'view-data.html',
      chunks: ['view-data'],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // Always output to dist for both dev and prod
    config.output.path = path.resolve(__dirname, 'dist');

    // Generate source maps for our code for easier debugging.
    config.devtool = 'eval-cheap-module-source-map';

    // Include the source maps for Blockly for easier debugging Blockly code.
    config.module.rules.push({
      test: /(blockly\/.*\.js)$/,
      use: [require.resolve('source-map-loader')],
      enforce: 'pre',
    });

    // Ignore spurious warnings from source-map-loader
    config.ignoreWarnings = [/Failed to parse source map/];
  }
  return config;
};
