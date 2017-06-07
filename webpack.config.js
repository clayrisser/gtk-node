import webpack from 'webpack';

const debug = process.env.NODE_ENV !== 'production';

export default {
  context: __dirname,
  entry: './src/node-gtk3.js',
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
        options: JSON.stringify({
          presets: [
            'es2015',
            'node5'
          ]
        })
      }
    ],
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  output: {
    path: __dirname + '/lib/',
    filename: 'node-gtk3.min.js'
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^bindings$/, require.resolve("./src/bindings"))
  ],
  node: {
    fs: 'empty'
  }
};
