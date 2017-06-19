// import path from 'path'; // es6 写法无效，待研究
const path = require('path');

const glob = require('glob');

const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 将行内样式提取到单独的css文件里

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // html模板生成器

const CleanPlugin = require('clean-webpack-plugin'); // 文件夹清除工具

const CopyWebpackPlugin = require('copy-webpack-plugin'); //  文件拷贝

// let pages = Object.keys(getEntries('./src/*.html'));

let entries = getEntries('./src/*.html');

// console.log('entries', entries);

const extractCss = new ExtractTextPlugin('css/[name].[hash:8].css');
// const extractStyl = new ExtractTextPlugin('css/[name][hash].styl.css');

let entry = {};

entries.forEach(item => {
    entry[item] = `./src/js/${item}.js`;
});

let config = {
    entry,
    output: {
        path: path.join(__dirname, 'dist'), // 打包后的目录
        publicPath: '', // 模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].[hash:8].js', // 根据对应入口名称,生成对应js名称
        chunkFilename: 'js/[id].chunk.js' // chunk生成的配置
    },
    resolve: {
        // root: [],
        // 设置require或import的时候可以不需要带后缀
        extensions: ['.js', '.css', '.styl']
    },
    module: {
        // preLoaders: [
        //     { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ }
        // ],
        rules: [{
            test: /\.js$/, 
            enforce: 'pre', // 取代preloader
            loader: 'eslint-loader', 
            exclude: path.resolve(__dirname, 'node_modules'),
        }, {
            test: /\.css$/,
            // loader: ExtractTextPlugin.extract('style', 'css')
            use: extractCss.extract({
                fallback: 'style-loader',
                use: ['css-loader']
            })
        }, {
            test: /\.styl$/,
            // loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'stylus'])
            use: extractCss.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader', 'stylus-loader']
            })
                // 这里存在一点问题，postcss编译时候会告警有 sourceMap，待解决

            // loader: ExtractTextPlugin.extract({
            //     fallback: 'style-loader', 
            //     use: [
            //         { 
            //             loader: 'css-loader', 
            //             options: { sourceMap: false } 
            //         },
            //         { 
            //             loader: 'postcss-loader', 
            //             options: { sourceMap: false } 
            //         },
            //         { 
            //             loader: 'stylus-loader', 
            //             options: { sourceMap: false } 
            //         }
            //     ]
            // })
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.resolve(__dirname, 'src'),
            exclude: path.resolve(__dirname, 'node_modules'),
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            query: {
                limit: 10000, // 10kb 图片转base64。
                name: '../images/[name].[ext]' // 输出目录以及名称
            }
        }, {
            // test: /\.(woff|woff2|ttf|eot|svg)(\?t=[0-9]\.[0-9]\.[0-9])?$/,
            test: /\.(woff|woff2|ttf|eot|svg)$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: '../fonts/[name].[ext]'
            }
        }]
    },
    plugins: [
        // 并不需要JQ
        // new webpack.ProvidePlugin({ // 全局配置加载
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery'
        // }),
        new CleanPlugin(['dist']), // 清空dist文件夹
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common', // 将公共模块提取,生成名为`common`的chunk
            minChunks: 3 // 提取至少3个模块共有的部分
        }),
        //new ExtractTextPlugin('css/[name].[hash:8].css'), // 提取CSS行内样式,转化为link引入
        extractCss,
        // extractStyl,
        new webpack.optimize.UglifyJsPlugin({ // js压缩
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),
        new CopyWebpackPlugin([
            { from: './src/images', to: './images' }, // 拷贝图片
            { from: './src/font', to: './font' } // 拷贝字体
        ])
    ],
    // externals: {
    //     $: 'jQuery'
    // },
    // devtool: '#source-map',
    devServer: {
        // contentBase: './',
        host: '127.0.0.1',
        port: 3001, // 端口
        inline: true,
        hot: false
        // proxy: {
        //     '/api/*': {
        //         target: 'http://192.168.1.11:8080',
        //         // target: 'http://192.168.1.250:8080',
        //         secure: false,
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    }
};

// 配置title 的尝试 类似 jade模板
let confTitle = [
    { name: 'index', title: '首页' },
    { name: 'dress', title: '3D试衣' },
    { name: 'about', title: '这是关于我标题' },
    { name: 'introduce', title: '厂家介绍' },
    { name: 'patterns_classify', title: '花型分类' },
    { name: 'patterns_list', title: '花型列表' },
    { name: 'patterns_detail', title: '花型详情' },
];

// template html
entries.forEach(item => {
    let conf = {
        filename: `${item}.html`,
        template: `./src/${item}.html`,
        inject: true, // 允许插件修改哪些内容，包括head与body
        hash: false, // 是否添加hash值
        chunks: ['common', item],
        minify: { // 压缩HTML文件
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: true // 删除空白符与换行符（压缩html）
        }
    };
    // 动态 title 的添加类似jade 模板
    confTitle.forEach((title, index) => {
        if (title.name === item) {
            conf.title = confTitle[index].title;
        }
    });
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

//  html-webpack-plugin 配置项，生成HTML模板
// pages.forEach(pathname => {
//     // 根据系统路径来取文件名，window下的做法，其它系统另测
//     let itemName = pathname.split('src\\');
//     console.log('pathName', pathname); // ['src\index']
//     console.log('itemName', itemName); // ['', 'index']
//     // 配置项
//     let conf = {
//         filename: itemName[1] + '.html', // 生成的html存放路径，相对于path
//         template: pathname + '.html', // html模板路径
//         inject: true, // 允许插件修改哪些内容，包括head与body
//         hash: false, // 是否添加hash值
//         chunks: ['common', itemName[1]],
//         minify: { // 压缩HTML文件
//             removeComments: true, // 移除HTML中的注释
//             collapseWhitespace: true // 删除空白符与换行符（压缩html）
//         }
//     };
//     confTitle.forEach((item, index) => {
//         if (item.name === itemName[1]) {
//             conf.title = confTitle[index].title;
//         }
//     });
//     config.plugins.push(new HtmlWebpackPlugin(conf));
// });

function getEntries(filePath) {
    let files = glob.sync(filePath);
    let basename = [],
        extname;
    for (let item of files) {
        extname = path.extname(item);
        basename.push(path.basename(item, extname));
    }
    console.log('basename', basename);
    return basename;
}

// ！！废弃！！
// 按文件名来获取入口文件(即需要生成的模板文件数量)
// function __getEntries(filePath) {
//     let files = glob.sync(filePath);
//     console.log('files', files);
//     let entries = {},
//         entry,
//         dirname,
//         basename,
//         pathname,
//         extname;
//     for (let i = 0; i < files.length; i++) {
//         // src下所有 html 文件名
//         entry = files[i];
//         // 上层目录名
//         dirname = path.dirname(entry);
//         // 拓展名
//         extname = path.extname(entry);
//         // 不含拓展名的文件名
//         basename = path.basename(entry, extname);
//         // 上层目录名 + 文件名合成路径 如 src/index
//         pathname = path.join(dirname, basename);
//         // 
//         entries[pathname] = './' + entry;
//     }
//     console.log('entries', entries);
//     return entries;
// }

module.exports = config;
