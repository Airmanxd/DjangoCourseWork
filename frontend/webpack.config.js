const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

function resolvePath(dir) {
    return path.join(__dirname, dir);
}
const appUrl = process.env.APP_URL || 'http://localhost:8000';
module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.jsx',
    },
    output: {
        path: resolvePath('www'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: '',
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        // alias: {
        //     '@': resolvePath('src'),
        // },
    },
    devtool: 'eval',
    devServer: {
        hot: true,
        open: false,
        compress: true,
        contentBase: '/www/',
        disableHostCheck: true,
        historyApiFallback: true,
        watchOptions: {
            poll: 1000,
        },
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '/backend' : {
                target : 'localhost:3000',
                router: () => 'http://localhost:8000',
                pathRewrite: {'^/backend' : ''},
                logLevel: 'debug',
            },
        }
    },
    optimization: {
        minimizer: [new TerserPlugin({
            sourceMap: true,
            terserOptions: {
                compress: {
                    drop_console: true
                }
            }
        })],
    },
    module: {
        rules: [{
                test: /\.(mjs|js|jsx|ts|tsx)$/,
                use: 'babel-loader',
                include: [
                    resolvePath('src'),
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[name].[ext]',

                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|m4a)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[ext]',

                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[ext]',

                },
            },
            {
                test: /\.svg$/,
                use: [{
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [{
                                    removeViewBox: false,
                                    minifyStyles: false
                                }, ],
                            },
                            memo: true,
                            // ? set default svg props like this
                            // svgProps: {
                            //     width: '18px',
                            //     height: '18px',
                            // },
                        },
                    },
                    'url-loader',

                ],
            }
        ],
    },
    plugins: [
            // Development only plugins
            new webpack.DefinePlugin({
                'process.env.APP_URL': JSON.stringify(appUrl),
            }),
            new Dotenv({
                path: `./.env`, // Path to .env file
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new HtmlWebpackPlugin({
            filename: './index.html',
            template: './public/index.html',
            inject: true,
            minify: false, 
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
    ].filter(Boolean),
};
