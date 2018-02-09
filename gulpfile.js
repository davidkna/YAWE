/* eslint "comma-dangle": ["error", { "functions": "never" }] */
const gulp = require('gulp')
const del = require('del')

// Linting
const eslint = require('gulp-eslint')
const tslint = require('gulp-tslint')

// Webpack
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

gulp.task('clean', callback => del('dist/', callback))

gulp.task('release:chrome', ['clean'], () => {
  gulp.run('min')
})
gulp.task('release:opera', ['clean'], () => {
  gulp.run('min')
})
gulp.task('release:firefox', ['clean'], () => {
  gulp.run('nomin')
})

gulp.task('min', [
  'common',
  'js_min'
])
gulp.task('nomin', [
  'common',
  'js'
])

gulp.task('common', [
  'html',
  'img',
  'manifest',
  'themes'
])

gulp.task('manifest', () =>
  gulp
    .src('./src/manifest.json')
    .pipe(gulp.dest('dist')))

gulp.task('html', () =>
  gulp
    .src(['./src/html/*.html'])
    .pipe(gulp.dest('dist')))

gulp.task('themes', () =>
  gulp
    .src(['./node_modules/yawe-themes/themes/**/*'])
    .pipe(gulp.dest('dist/themes')))

gulp.task('img', () =>
  gulp
    .src([
      './src/images/icon_16x16.png',
      './src/images/icon_19x19.png',
      './src/images/icon_38x38.png',
      './src/images/icon_48x48.png',
      './src/images/icon_128x128.png'
    ])
    .pipe(gulp.dest('dist/images')))

const uglifyOptions = {
  parallel: true,
  sourceMap: true,
  uglifyOptions: {
    mangle: {
      toplevel: true
    },
    compress: {
      toplevel: true,
      unsafe: true,
      passes: 3
    },
    toplevel: true,
    ecma: 8
  }
}

function webpackConfig(enableUglify = false) {
  return {
    entry: {
      app: './src/js/app.ts',
      options: './src/js/options.ts'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/js')
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
        { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin(uglifyOptions)
      ]
    },
    mode: enableUglify ? 'production' : 'development'
  }
}

function webpackify(file, enableUglify = false) {
  return webpack(webpackConfig(file, enableUglify))
}

gulp.task('js', (cb) => {
  webpackify().run(cb)
})

gulp.task('js_min', (cb) => {
  webpackify(true).run(cb)
})

gulp.task('lint', ['eslint', 'tslint'])

gulp.task('eslint', () =>
  gulp
    .src('./gulpfile.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()))

gulp.task('tslint', () =>
  gulp
    .src('./src/**/*.ts')
    .pipe(tslint({
      formatter: 'verbose'
    }))
    .pipe(tslint.report()))
