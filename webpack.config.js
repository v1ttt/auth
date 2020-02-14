const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, options) => {
  const devMode = options.mode !== 'production'

  const config = {
    context: path.resolve(__dirname, 'src'),
    mode: options.mode,
    entry: {
      auth: './ts/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'js/[name].js',
      publicPath: '/',
    },
    devtool: devMode ? 'cheap-module-eval-source-map' : false,
    module: {
      rules: [
        {
          test: /\.html$/,
          use: 'html-loader',
        },
        {
          test: /\.(tsx?|jsx?)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      new CleanWebpackPlugin(),
    ],
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true,
      proxy: {
        '/api/**': {
          target: '#',
          secure: false,
          changeOrigin: true,
        },
      },
    },
  }

  const pages = glob.sync(path.resolve(__dirname, 'src', 'pages', '*.html'))
  pages.forEach(file => {
    const name = path.basename(file, '.html')
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: path.resolve(file),
      })
    )
    if (devMode) {
      config.entry.pages = pages
    }
  })

  return config
}
