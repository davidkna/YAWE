/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import gulp from 'gulp'
import del from 'del'

// Linting
import eslint from 'gulp-eslint'
import jscs from 'gulp-jscs'

// CSS
import autoprefixer from 'autoprefixer'
import cleancss from 'gulp-clean-css'
import csscomb from 'gulp-csscomb'
import postcss from 'gulp-postcss'
import sass from 'gulp-sass'
import uncss from 'gulp-uncss'

// HTML
import htmlmin from 'gulp-htmlmin'

// Rollup
import { rollup } from 'rollup'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import { minify } from 'uglify-js'

const uglify = require('rollup-plugin-uglify')

export function clean() {
  return del('dist/')
}

export function manifest() {
  return gulp
    .src('./src/manifest.json')
    .pipe(gulp.dest('dist'))
}

const htmlOptions = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  decodeEntities: true,
  minifyCSS: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
}

export function html() {
  return gulp
    .src(['./src/html/*.html'])
    .pipe(htmlmin(htmlOptions))
    .pipe(gulp.dest('dist'))
}

export function img() {
  return gulp
    .src([
      './src/images/icon_16x16.png',
      './src/images/icon_19x19.png',
      './src/images/icon_38x38.png',
      './src/images/icon_48x48.png',
      './src/images/icon_128x128.png',
    ])
    .pipe(gulp.dest('dist/images'))
}

function rollupConfig(file, enableUglify = false) {
  const plugins = file !== 'app.js' ? [] : [
    commonjs(),
    nodeResolve(),
  ]

  if (enableUglify) {
    plugins.push(uglify({
      mangle: {
        screw_ie8: true,
        toplevel: true,
      },
      compress: {
        screw_ie8: true,
      },
    }, minify))
  }

  return {
    entry: `./src/js/${file}`,
    plugins,
  }
}

function rollupify(file, enableUglify = false) {
  return rollup(rollupConfig(file, enableUglify)).then(bundle =>
    bundle.write({
      dest: `./dist/js/${file}`,
    }))
}

export function jsApp(cb) {
  rollupify('app.js')
      .then(() => cb())
}

export function jsOptions(cb) {
  rollupify('options.js')
    .then(() => cb())
}

export function jsAppMin(cb) {
  rollupify('app.js', true)
    .then(() => cb())
}

export function jsOptionsMin(cb) {
  rollupify('options.js', true)
    .then(() => cb())
}

export function lint() {
  return gulp
    .src(['./gulpfile.babel.js', './src/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
}

const themes = [
  'cerulean',
  'classic',
  'cosmo',
  'custom',
  'cyborg',
  'darkly',
  'flatly',
  'journal',
  'lumen',
  'paper',
  'readable',
  'sandstone',
  'simplex',
  'slate',
  'spacelab',
  'superhero',
  'united',
  'yeti',
]

const autoprefixerConfig = {
  browsers: ['Chrome >= 51', 'Firefox >= 49', 'Opera >= 38', 'Edge 14'],
  cascade: false,
  remove: true,
}

const uncssConfig = {
  html: [
    'src/*.html', '.uncss_helper.html',
  ],
  ignore: [
    '.active',
    '.awesomeplete',
    '.btn',
    '.dablink',
    'div.awesomplete > ul:empty',
    'div.awesomplete > ul[hidden]',
    '.dropdown',
    '.hatnote',
    '.hlist.navbar.mini',
    '.icon-menu',
    '.loading',
    '.mw-editsection',
    '.noprint',
    '.panel-body',
    '.progress',
    '.progress-bar',
    '.show',
    '.tex',
    '.visually-hidden',
    'details',
    'summary',
    'table',
    '#yawe',
  ],
}

export function scss() {
  return gulp.src(themes.map(theme => `vendor/bootswatch/${theme}/style.scss`), {
    base: 'vendor/bootswatch',
  })
      .pipe(sass({
        includePaths: ['vendor/', 'src/scss'],
      }).on('error', sass.logError))
      .pipe(uncss(uncssConfig))
      .pipe(csscomb())
      .pipe(cleancss())
      .pipe(
        postcss([
          autoprefixer(autoprefixerConfig),
        ]),
      )
      .pipe(gulp.dest('dist/bootswatch/'))
}

export function js() {
  return gulp.parallel(jsApp, jsOptions)
}

export function common() {
  return gulp.parallel(
    html,
    img,
    manifest,
    scss,
  )
}

export function jsMin() {
  return gulp.parallel(jsAppMin, jsOptionsMin)
}

export function min() {
  return gulp.parallel(common, jsMin)
}

export function noMin() {
  return gulp.parallel(common, js)
}

export function releaseChrome() {
  return gulp.series(clean, min)
}

export function releaseOpera() {
  return gulp.series(clean, noMin)
}

export function releaseFirefox() {
  return gulp.series(clean, noMin)
}
