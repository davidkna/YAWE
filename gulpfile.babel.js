import gulp from 'gulp'
import del from 'del'

// Linting
import eslint from 'gulp-eslint'
import jscs from 'gulp-jscs'

// CSS
import autoprefixer from 'autoprefixer'
import cleancss from 'gulp-clean-css'
import csscomb from 'gulp-csscomb'
import flexbugs from 'postcss-flexbugs-fixes'
import postcss from 'gulp-postcss'
import sass from 'gulp-sass'

// Rollup
import { rollup } from 'rollup'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import { minify } from 'uglify-js'

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
  'js_min',
])
gulp.task('nomin', [
  'common',
  'js',
])

gulp.task('common', [
  'html',
  'img',
  'fonts',
  'manifest',
  'scss',
])

gulp.task('manifest', () =>
  gulp
    .src('./src/manifest.json')
    .pipe(gulp.dest('dist')),
)

gulp.task('html', () =>
  gulp
    .src(['./src/html/*.html'])
    .pipe(gulp.dest('dist')),
)

gulp.task('fonts', () =>
  gulp
    .src(['./vendor/fontello/fontello.woff2'])
    .pipe(gulp.dest('dist/fonts')),
)

gulp.task('img', () =>
  gulp
    .src([
      './src/images/icon_16x16.png',
      './src/images/icon_19x19.png',
      './src/images/icon_38x38.png',
      './src/images/icon_48x48.png',
      './src/images/icon_128x128.png',
    ])
    .pipe(gulp.dest('dist/images')),
)

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
      format: 'es',
      dest: `./dist/js/${file}`,
    }))
}

gulp.task('js', ['js:app', 'js:options'])
gulp.task('js_min', ['js:app_min', 'js:options_min'])

gulp.task('js:options', () =>
    rollupify('options.js'),
)
gulp.task('js:options_min', () =>
    rollupify('options.js', true),
)

gulp.task('js:app', () =>
  rollupify('app.js'),
)
gulp.task('js:app_min', () =>
  rollupify('app.js', true),
)

gulp.task('lint', () =>
  gulp
    .src(['./gulpfile.babel.js', './src/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail')),
)

const themes = [
  'cerulean',
  'cosmo',
  'custom',
  'cyborg',
  'darkly',
  'default',
  'flatly',
  'journal',
  'litera',
  'lumen',
  'lux',
  'materia',
  'minty',
  'pulse',
  'sandstone',
  'simplex',
  'slate',
  'solar',
  'spacelab',
  'superhero',
  'united',
  'yeti',
]

const autoprefixerConfig = {
  browsers: ['Chrome >= 57', 'Firefox >= 52', 'Opera >= 44', 'Edge 15'],
  cascade: false,
  remove: true,
}

gulp.task('scss', () =>
      gulp.src(themes.map(theme => `vendor/bootswatch/${theme}/style.scss`), {
        base: 'vendor/bootswatch',
      })
      .pipe(sass({
        includePaths: ['vendor/', 'src/scss/', 'node_modules/'],
      }).on('error', sass.logError))
      .pipe(csscomb())
      .pipe(cleancss())
      .pipe(
        postcss([
          autoprefixer(autoprefixerConfig),
          flexbugs,
        ]),
      )
      .pipe(gulp.dest('dist/bootswatch/')),
)
