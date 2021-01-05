const path = require('path');
const glob = require('glob');
const fs = require('fs');
const HTMLConfig = require('./config');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


const webpackConfig = {
	entry: {
		main: glob.sync(path.resolve(__dirname, './src/{js/common,views}/**/*.js')),
		vendors: glob.sync(path.resolve(__dirname, './src/js/vendors/**/*.js')),
        style: glob.sync(path.resolve(__dirname, './src/{scss/main.scss,views/**/*.scss}')),
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name].bundle.js',
	},
	optimization: {
		minimizer: [new OptimizeCSSAssetsPlugin({})]
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						"presets": [
						  [
							"@babel/preset-env",
							{
								"targets":{
									"esmodules": true
								 },
								"corejs": "3.8.2",
								"bugfixes": true,
								"useBuiltIns": "usage"
							}
						  ]
						]
					  }
				  }
			},
		  {
			test: /\.html$/i,
			loader: 'html-loader'
		  },
		  {
			test: /\.(png|svg|jpg|gif)$/,
			loader: 'file-loader',
			options: {
			  context: './static'
			}
		  },{
			test: /\.(handlebars|hbs)$/,
			loader: 'handlebars-loader',
			options: {
			  partialDirs: [
				path.join(__dirname, 'src'),
				path.join(__dirname, 'src', 'views'),
				path.join(__dirname, 'src', 'views', 'layouts'),
				path.join(__dirname, 'src', 'views', 'pages'),
				path.join(__dirname, 'src', 'views', 'partials')
			  ].concat(
				glob.sync('**/', {
				  cwd: path.resolve(__dirname, 'src', 'views', 'partials'),
				  realpath: true
				})
			  )
			}
		  },
		  {
			test: /\.(scss)$/,
			use: [
			  'style-loader',
			  {
				loader: MiniCssExtractPlugin.loader,
				options: {
				  publicPath: './scss'
				}
			  },
			  'css-loader',
			  'sass-loader'
			]
		  }
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
		  filename: 'css/[name].css',
		  chunkFilename: '[id].css'
		}),
		new CopyPlugin({
			patterns: [
				{ from: './src/static', to: 'static' }
			]}
		)
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist')
	}
};



fs.readdirSync(path.join(__dirname, 'src', 'views', 'pages')).forEach(page => {
    console.log(`Building page: ${page.toUpperCase()}`);

    const htmlPageInit = new HtmlWebPackPlugin({
      title: `${page.toUpperCase()} | ES20170Webpack`,
      template: `./src/views/pages/${page}/${page}.hbs`,
      filename: `./${page != "home" ? page + "/" : ""}index.html`,
      chunks: ['vendors', 'main'],
      minify: HTMLConfig.htmlMinifyOptions
    });

    //webpackConfig.entry[page] = `./src/views/pages/${page}/${page}.js`;   
    webpackConfig.plugins.push(htmlPageInit);

});


module.exports =  webpackConfig;