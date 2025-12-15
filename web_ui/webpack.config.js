const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Base config that applies to either development or production mode.
const config = {
  entry: {
    index: path.resolve(__dirname, 'src', 'index.ts'),
    'view-data': path.resolve(__dirname, 'src', 'view-data.ts'),
  },
  // The UI intentionally ships several already-minified vendor assets (Blockly, etc.)
  // via CopyWebpackPlugin. Webpack's default production minimizer will attempt to
  // re-minify those files and can fail depending on the syntax level used.
  // We disable minimization here to keep the build deterministic.
  optimization: {
    minimize: false,
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
    // We use the root index.html ("Awesome UI") and exclude the webpack bundle
    // because this UI uses its own script tags and logic.
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunks: [], // Do not inject the 'index' bundle
      inject: false // Do not inject anything
    }),
    new HtmlWebpackPlugin({
      template: 'src/view-data.html',
      filename: 'view-data.html',
      chunks: ['view-data'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'blockly', to: 'blockly' },
        { from: 'quotes.json', to: 'quotes.json' },
        { from: 'quotes.local.json', to: 'quotes.local.json', noErrorOnMissing: true },
        { from: 'main.js', to: 'main.js' },
        { from: 'toolbox.js', to: 'toolbox.js' },
        { from: 'block_definitions.js', to: 'block_definitions.js' },
        { from: 'block_definitions_gen.js', to: 'block_definitions_gen.js' },
        { from: 'startup.js', to: 'startup.js' },
        { from: 'terminal-drawer.js', to: 'terminal-drawer.js' },
      ],
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
