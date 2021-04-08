const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argsv) => {
    const isDevelopment = argsv.mode !== 'production';

    return {
        entry: ['./src/main.js'],
        output: {
            filename: `assets/js/${isDevelopment ? 'buybtn.js' : 'buybtn.min.js'}`,
            chunkFilename: `assets/js/${isDevelopment ? '[id].js' : '[id].min.js'}`,
            path: path.resolve(__dirname, 'dist'),
        },
        mode: argsv.mode !== 'production' ? 'development' : 'production',
        devtool: argsv.mode !== 'production' ? 'source-map' : false,
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: (resourcePath, context) => {
                                    return path.relative(path.dirname(resourcePath), context) + '/';
                                }
                            }
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: isDevelopment
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                },
                // this will apply to both plain `.js` files
                // AND `<script>` blocks in `.vue` files
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        sourceMap: isDevelopment
                    },
                },
                // this will apply to both plain `.css` files
                // AND `<style>` blocks in `.vue` files
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: (resourcePath, context) => {
                                    return path.relative(path.dirname(resourcePath), context) + '/';
                                }
                            }
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: isDevelopment
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                },
                {
                    test: /.(png|jpg|gif|bmp|ico)$/i,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve(__dirname, 'src'),
                            outputPath: (resourcePath, context) => {
                                return resourcePath;
                            },
                            publicPath: '/',
                            userRelativePaths: false,
                            esModule: false,
                        }
                    }]
                }, {
                    test: /.(eot|svg|ttf|woff(2)?|otf)$/i,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve(__dirname, 'src'),
                            outputPath: (resourcePath, context) => {
                                return resourcePath;
                            },
                            publicPath: '/',
                            userRelativePaths: false,
                            esModule: false,
                        }
                    }]
                },
            ]
        },
        plugins: [
            // make sure to include the plugin!
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: `assets/css/${isDevelopment ? 'buybtn.css' : 'buybtn.min.css'}`,
                chunkFilename: `assets/css/${isDevelopment ? '[id].css' : '[id].css'}`,
            }),
        ],
    }
};