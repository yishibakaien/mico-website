// import path from 'path'; // es6 写法无效，待研究
const path = require('path');

const glob = require('glob');

const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 将行内样式提取到单独的css文件里

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // html模板生成器

const CleanPlugin = require('clean-webpack-plugin'); // 文件夹清除工具

const CopyWebpackPlugin = require('copy-webpack-plugin'); //  文件拷贝

let config = {
    entry: {
        index: './src/js/index.js',
        dress: './src/js/dress.js',
        about: './src/js/about.js'
    },
    output: {
        path: path.join(__dirname, 'dist'), // 打包后的目录
        publicPath: '', // 模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].[hash:6].js', // 根据对应入口名称,生成对应js名称
        chunkFilename: 'js/[id].chunk.js' // chunk生成的配置
    },
    resolve: {
        root: [],
        // 设置require或import的时候可以不需要带后缀
        extensions: ['', '.js', '.css', '.styl']
    },
    module: {
        preLoaders: [
            { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
        ],
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css')
        }, {
            test: /\.styl$/,
            loader: ExtractTextPlugin.extract('css!stylus')
        }, {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader?name=./fonts/[name].[ext]'
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'url',
            query: {
                limit: 10000, // 10kb 图片转base64。
                name: '../images/[name].[ext]?' // 输出目录以及名称
            }
        }]
    },
    plugins: [
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
        new ExtractTextPlugin('css/[name].[hash:6].css'), // 提取CSS行内样式,转化为link引入
        new webpack.optimize.UglifyJsPlugin({ // js压缩
            compress: {
                warnings: false
            }
        }),
        new CopyWebpackPlugin([
            { from: './src/images', to: './images' } // 拷贝图片
        ])
    ],
    externals: {
        $: 'jQuery'
    },
    // devtool: '#source-map',
    devServer: {
        // contentBase: './',
        host: 'localhost',
        port: 3001, // 端口
        inline: true,
        hot: false,
    }
};

let pages = Object.keys(getEntries('./src/*.html'));
let confTitle = [
    { name: 'index', title: '这是首页标题' },
    { name: 'dress', title: '3D试衣' },
    { name: 'about', title: '这是关于我标题' }
];

//  html-webpack-plugin 配置项，生成HTML模板
pages.forEach(pathname => {
    // 根据系统路径来取文件名，window下的做法，其它系统另测
    let itemName = pathname.split('src\\');
    console.log('pathName', pathname); // ['src\index']
    console.log('itemName', itemName); // ['', 'index']
    // 配置项
    let conf = {
        filename: itemName[1] + '.html', // 生成的html存放路径，相对于path
        template: pathname + '.html', // html模板路径
        inject: true, // 允许插件修改哪些内容，包括head与body
        hash: false, // 是否添加hash值
        chunks: ['common', itemName[1]],
        minify: { // 压缩HTML文件
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: false // 删除空白符与换行符（压缩html）
        }
    };
    confTitle.forEach((item, index) => {
        if (item.name === itemName[1]) {
            conf.title = confTitle[index].title;
        }
    });
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

// 按文件名来获取入口文件(即需要生成的模板文件数量)
function getEntries(filePath) {
    let files = glob.sync(filePath);
    let entries = {},
        entry,
        dirname,
        basename,
        pathname,
        extname;
    for (let i = 0; i < files.length; i++) {
        // src下所有 html 文件名
        entry = files[i];
        // 上层目录名
        dirname = path.dirname(entry);
        // 拓展名
        extname = path.extname(entry);
        // 不含拓展名的文件名
        basename = path.basename(entry, extname);
        // 上层目录名 + 文件名合成路径 如 src/index
        pathname = path.join(dirname, basename);
        // 
        entries[pathname] = './' + entry;
    }
    return entries;
}

module.exports = config;
