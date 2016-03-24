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

// HTML
import htmlmin from 'gulp-htmlmin'

// Rollup
import { rollup } from 'rollup'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import { minify } from 'uglify-js'
import uglify from 'rollup-plugin-uglify'

gulp.task('clean', callback => del('dist/', callback))

gulp.task('release:chrome', ['clean'], () => {
  gulp.run('chrome')
})
gulp.task('release:opera', ['clean'], () => {
  gulp.run('opera')
})
gulp.task('release:firefox', ['clean'], () => {
  gulp.run('firefox')
})

gulp.task('chrome', [
  'generic',
  'js_min',
  'scss:chrome',
  'img',
  'html',
])
gulp.task('opera', [
  'generic',
  'js',
  'scss:opera',
  'img',
  'html',
])
gulp.task('firefox', [
  'generic',
  'js',
  'scss:firefox',
  'img',
  'html',
])

gulp.task('generic', () =>
  gulp
    .src(['./src/generic/*', '!./src/generic/*.js'])
    .pipe(gulp.dest('dist'))
)

gulp.task('html', () =>
  gulp
    .src('./src/*.html')
    .pipe(htmlmin())
    .pipe(gulp.dest('dist'))
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
    .pipe(gulp.dest('dist/images'))
)

function rollupify(file, enableUglify = false) {
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

  return rollup({
    entry: `./src/js/${file}`,
    plugins,
  }).then(bundle =>
    bundle.write({
      dest: `./dist/js/${file}`,
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

function scss(browsers) {
  return gulp
    .src('vendor/bootswatch/**/style.scss')
    .pipe(sass({
      includePaths: ['vendor/', 'src/scss'],
    }).on('error', sass.logError))
    .pipe(csscomb())
    .pipe(
      postcss([
        autoprefixer({
          browsers,
          cascade: false,
          remove: true,
        }),
      ])
    )
    .pipe(cleancss())
}

gulp.task('scss:web', () =>
  scss(['last 2 versions', 'Firefox ESR'])
    .pipe(gulp.dest('dist/bootswatch/'))
)

gulp.task('scss:firefox', () =>
  scss(['Firefox ESR'])
    .pipe(gulp.dest('dist/bootswatch/'))
)

gulp.task('scss:chrome', () =>
  scss(['last 2 Chrome versions'])
    .pipe(gulp.dest('dist/bootswatch/'))
)

gulp.task('scss:opera', () =>
  scss(['last 2 Opera versions'])
    .pipe(gulp.dest('dist/bootswatch/'))
)

gulp.task('lint', () =>
  gulp
    .src(['*.js', '**/*.js', '!node_modules/**', '!vendor/**', '!dist/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
)
