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
import uglify from 'rollup-plugin-uglify'

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
  'generic',
  'html',
  'img',
  'scss',
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

function rollupConfig(file, enableUglify = false) {
  const plugins = file !== 'app.js' ? [] : [
    commonjs({
      include: [
        'node_modules/dompurify/**',
      ],
      exclude: [
        'node_modules/awesomeplete/**',
        'node_modules/jsop-promise/**',
        'src/**',
      ],
    }),
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
    .src(['./gulpfile.babel.js', './src/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
)

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
  ],
}

themes.forEach(theme => {
  gulp.task(`scss_${theme}`, () =>
        gulp.src(`vendor/bootswatch/${theme}/style.scss`, {
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
          ])
        )
        .pipe(gulp.dest('dist/bootswatch/'))
  )
})

gulp.task('scss', themes.map(theme => `scss_${theme}`))
