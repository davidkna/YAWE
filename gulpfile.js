/* eslint "comma-dangle": ["error", { "functions": "never" }]*/
const gulp = require('gulp')
const del = require('del')

// Linting
const eslint = require('gulp-eslint')

// Rollup
const { rollup } = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const { minify } = require('uglify-es')

const uglify = require('rollup-plugin-uglify')

gulp.task('clean', callback => del('dist/', callback))

gulp.task('release:chrome', ['clean'], () => {
  gulp.run('min')
})
gulp.task('release:opera', ['clean'], () => {
  gulp.run('nomin')
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
    .pipe(gulp.dest('dist'))
)

gulp.task('html', () =>
  gulp
    .src(['./src/html/*.html'])
    .pipe(gulp.dest('dist'))
)

gulp.task('themes', () =>
  gulp
    .src(['./node_modules/yawe-themes/themes/**/*'])
    .pipe(gulp.dest('dist/themes'))
)

gulp.task('img', () =>
  gulp
    .src([
      './src/images/icon_16x16.png',
      './src/images/icon_19x19.png',
      './src/images/icon_38x38.png',
      './src/images/icon_48x48.png',
      './src/images/icon_128x128.png'
    ])
    .pipe(gulp.dest('dist/images'))
)

function rollupConfig(file, enableUglify = false) {
  const plugins = file !== 'app.js' ? [] : [
    commonjs(),
    nodeResolve()
  ]

  if (enableUglify) {
    plugins.push(uglify({
      mangle: {
        toplevel: true
      },
      compress: {
        unsafe: true,
        passes: 3
      }
    }, minify))
  }

  return {
    entry: `./src/js/${file}`,
    plugins
  }
}

function rollupify(file, enableUglify = false) {
  return rollup(rollupConfig(file, enableUglify)).then(bundle =>
    bundle.write({
      format: 'es',
      dest: `./dist/js/${file}`
    }))
}

gulp.task('js', ['js:app', 'js:options'])
gulp.task('js_min', ['js:app_min', 'js:options_min'])

gulp.task('js:options', () =>
    rollupify('options.js')
)
gulp.task('js:options_min', () =>
    rollupify('options.js', true)
)

gulp.task('js:app', () =>
  rollupify('app.js')
)
gulp.task('js:app_min', () =>
  rollupify('app.js', true)
)

gulp.task('lint', () =>
  gulp
    .src(['./gulpfile.js', './src/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
)

