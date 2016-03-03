import babel from 'gulp-babel'
import csscomb from 'gulp-csscomb'
import eslint from 'gulp-eslint'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'
import postcss from 'gulp-postcss'

import gulp from 'gulp'
import del from 'del'

import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import sass from 'gulp-sass'

import rollup from 'rollup-stream'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'

gulp.task('clean', callback => del('dist/', callback))

gulp.task('release:chrome', ['clean'], () => {
	gulp.run('chrome')
})

gulp.task('chrome', [
	'generic',
	'js:app',
	'js:options',
	'scss:chrome',
	'img',
	'html',
])

gulp.task('release:opera', ['clean'], () => {
	gulp.run('opera')
})

gulp.task('release:firefox', ['clean'], () => {
	gulp.run('opera')
})

gulp.task('opera', [
	'generic',
	'js:app',
	'js:options',
	'scss:opera',
	'img',
	'html',
])

// Works in firefox nightly
gulp.task('release:firefox', ['clean'], () => {
	gulp.run('firefox')
})

gulp.task('firefox', [
	'generic',
	'js:app',
	'js:options',
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
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
)


gulp.task('js:options', () => {
	rollup({
		entry: './src/js/options.js',
	})
		.pipe(source('options.js', './src/js'))
		.pipe(buffer())
		.pipe(babel())
		.pipe(gulp.dest('./dist/js/'))
})
gulp.task('js:app', () =>
	rollup({
		entry: './src/js/app.js',
		plugins: [
			commonjs(),
			nodeResolve(),
		],
	})
		.pipe(source('app.js', './src/js'))
		.pipe(buffer())
		.pipe(babel())
		.pipe(gulp.dest('./dist/js/'))
)

function scss(browsers) {
	const processors = [
		autoprefixer({
			browsers,
			cascade: false,
			remove: true,
		}),
		cssnano,
	]

	return gulp
		.src('vendor/bootswatch/**/style.scss')
		.pipe(sass({
			includePaths: ['vendor/bootstrap/', 'src/scss'],
		}).on('error', sass.logError))
		.pipe(csscomb())
		.pipe(postcss(processors))
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
		.src(['**/*.js', '!node_modules/**', '!vendor/**', '!dist/**'])
		.pipe(eslint())
    .pipe(eslint.format())
		.pipe(eslint.failAfterError())
)
