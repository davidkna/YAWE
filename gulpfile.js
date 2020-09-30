const { src, dest, parallel, series } = require('gulp')
const del = require('del')

// Linting
const eslint = require('gulp-eslint')

// Webpack
const webpack = require('webpack')
const path = require('path')

function clean() {
  return del('dist/')
}

function manifest() {
  return src('./src/manifest.json').pipe(dest('dist'))
}

function html() {
  return src(['./src/html/*.html']).pipe(dest('dist'))
}

function themes() {
  return src(['./node_modules/yawe-themes/themes/**/*']).pipe(dest('dist/themes'))
}

function img() {
  return src([
    './src/images/icon_16x16.png',
    './src/images/icon_19x19.png',
    './src/images/icon_38x38.png',
    './src/images/icon_48x48.png',
    './src/images/icon_128x128.png',
  ]).pipe(dest('dist/images'))
}

function webpackConfig(enableUglify = false) {
  return {
    entry: {
      app: './src/js/app.ts',
      options: './src/js/options.ts',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/js'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
        { test: /\.tsx?$/, loader: 'ts-loader' },
      ],
    },
    optimization: {
      minimize: enableUglify,
    },
    mode: 'production',
  }
}

function webpackify(file, enableUglify = false) {
  return webpack(webpackConfig(file, enableUglify))
}

function jsNomin(cb) {
  return webpackify().run(cb)
}

function jsMin(cb) {
  return webpackify(true).run(cb)
}

function lint() {
  return src(['**/*.js', '**/*.ts', '!node_modules/**', '!dest/**', '!docs/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

const common = parallel(html, img, manifest, themes)
const min = series(clean, parallel(common, jsMin))
const nomin = series(clean, parallel(common, jsNomin))

module.exports = {
  'release:chrome': min,
  'release:opera': min,
  'release:firefox': nomin,
  js: jsNomin,
  'js:min': jsMin,
  clean,
  lint,
  common,
  html,
  img,
  manifest,
  themes,
  min,
  nomin,
}
