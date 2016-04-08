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
import alias from 'rollup-plugin-alias'
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
  'common',
  'js_min',
  'scss_chrome',
])
gulp.task('opera', [
  'common',
  'js',
  'scss_opera',
])
gulp.task('firefox', [
  'common',
  'js',
  'scss_firefox',
])
gulp.task('web', [
  'common',
  'js:options_min',
  'js:app_web',
  'scss_firefox',
])

gulp.task('common', [
  'generic',
  'html',
  'img',
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

function rollupify(file, enableUglify = false, web = false) {
  const plugins = file !== 'app.js' ? [] : [
    alias({
      'helper/ajax': web ? 'node_modules/jsonp-promise/dist/index.js' : './helper/fetch',
    }),
    commonjs({
      exclude: [
        'node_modules/lodash-es/**',
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
gulp.task('js:app_web', () =>
  rollupify('app.js', true, true)
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

const targets = [
  {
    name: 'web',
    browsers: ['last 2 versions', 'Firefox ESR'],
  },
  {
    name: 'firefox',
    browsers: ['Firefox ESR'],
  },
  {
    name: 'chrome',
    browsers: ['last 2 Chrome versions'],
  },
    {
    name: 'chrome',
    browsers: ['last 2 Opera versions'],
  },
]

function scss(browsers) {
  const autoprefixerConfig = {
    browsers,
    cascade: false,
    remove: true,
  }

  const uncssConfig = {
    html: [
      'src/*.html', '.uncss_helper.html',
    ],
    ignore: [
      '.awesomeplete',
      '.tex',
      '.visually-hidden',
      '.mw-editsection',
      '.noprint',
      '.hlist.navbar.mini',
      '.dablink',
      '.hatnote',
      '.progress',
      '.progress-bar',
      '.loading',
      '.panel-body',
      'table',
      'summary',
      'details',
    ],
  }

  return gulp
    .src(themes.map(theme => `vendor/bootswatch/${theme}/style.scss`))
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
}

targets.forEach(target => {
  gulp.task(`scss_${target.name}`, () =>
      scss(target.browsers)
        .pipe(gulp.dest('dist/bootswatch/'))
    )
})
