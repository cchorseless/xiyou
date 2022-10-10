const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {
    PanoramaManifestPlugin,
    PanoramaTargetPlugin
} = require('@aabao/webpack-panorama');

/** @type {import('webpack').Configuration} */
const isProduction = false;
const fileList = () => {
    let viewdir = [
        "config"
    ];
    let r = [];
    viewdir.forEach(file => {
        r.push({
            import: `./${file}`,
            filename: `${file}.js`
        })
    })
    return r
};
module.exports = {
    optimization: { // 1. 这个配置必须
        minimize: false
    },
    devtool: isProduction ? false : 'eval-source-map',
    mode: isProduction ? 'production' : 'development',
    context: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'layout/custom_game'),
        publicPath: 'file://{resources}/layout/custom_game/',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '...'],
        symlinks: false,
    },
    // entry: () => {
    //     let list = [{
    //         import: "./game",
    //         filename: "./game/game.js"
    //     }, ];
    //     return list;
    // },
    module: {
        rules: [{
                test: /\.xml$/,
                loader: '@aabao/webpack-panorama/lib/layout-loader',
            },
            {
                test: /\.[jt]sx$/,
                issuer: /\.xml$/,
                loader: '@aabao/webpack-panorama/lib/entry-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                },
            },
            {
                test: /\.js?$|\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-env']
                },
            },
            {
                test: /\.css$/,
                test: /\.(css|less)$/,
                issuer: /\.xml$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].css',
                    esModule: false
                },
            },
            {
                test: /\.less$/,
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        relativeUrls: false,
                    }
                }
            },
        ],
    },

    plugins: [
        new PanoramaTargetPlugin(),
        new PanoramaManifestPlugin({
            entries: [
                // 编译载入界面到custom_loading_screen
                {
                    import: './view/alldota2/loading/loading.xml',
                    filename: 'custom_loading_screen.xml',
                },
                {
                    import: './view/alldota2/team_select/team_select.xml',
                    filename: 'team_select.xml',
                },
                // 英雄选择
                {
                    import: './view/alldota2/hero_select/hero_select.xml',
                    type: 'HeroSelection'
                },
                // 结束界面
                {
                    import: './view/alldota2/end_screen/end_screen.xml',
                    type: 'EndScreen'
                },
                // 游戏界面
                {
                    import: './view/game_main.xml',
                    type: 'Hud'
                },
            ].concat(fileList()),
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
        }),
    ],
};
