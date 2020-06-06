const HtmlWebPackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        'visits-generator': './src/index.js',
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/dist`,
        publicPath: '/',
    },
    devServer: {
        contentBase: `${__dirname}/src`,
        historyApiFallback: true,
        port: 3000,
        proxy: {
            '/api/*': {
                target: 'http://localhost:8080',
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.html$/i,
                exclude: /node_modules/,
                use: ['html-loader'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                exclude: /node_modules/,
                use: ['file-loader'],
            },
        ],
    },
    performance: {
        hints: false,
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            components: `${__dirname}/src/components`,
            model: `${__dirname}/src/model`,
        },
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
        }),
        new CopyPlugin({
            patterns: [{ from: './src/images/', to: './images' }],
        }),
    ],
}
