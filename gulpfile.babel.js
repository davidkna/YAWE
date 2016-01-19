import gulp from 'gulp'
import browserify from 'browserify'
import del from 'del'
import source from 'vinyl-source-stream'

import autoprefixer from 'gulp-autoprefixer'
import concat from 'gulp-concat'
import csscomb from 'gulp-csscomb'
import cssnano from 'gulp-cssnano'
import eslint from 'gulp-eslint'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'

import sass from 'gulp-sass'

gulp.task('clean', callback => {
	return del('dist/', callback)
})

gulp.task('release:chrome', ['clean'], () => {
	gulp.run('chrome')
})

gulp.task('chrome', [
	'generic',
	'js:app',
	'js:options',
	'js:plugins',
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
	'js:plugins',
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
	'js:plugins',
	'scss:firefox',
	'img',
	'html',
])

gulp.task('generic', () => {
	return gulp.src(['./src/generic/*', '!./src/generic/*.js'])
	.pipe(gulp.dest('dist'))
})

gulp.task('html', () => {
	return gulp.src('./src/*.html')
	.pipe(htmlmin())
	.pipe(gulp.dest('dist'))
})

gulp.task('img', () => {
	return gulp.src([
		'./src/images/icon_16x16.png',
		'./src/images/icon_19x19.png',
		'./src/images/icon_38x38.png',
		'./src/images/icon_48x48.png',
		'./src/images/icon_128x128.png',
	])
	.pipe(imagemin())
	.pipe(gulp.dest('dist/images'))
})


gulp.task('js:options', () => {
	return browserify('./src/js/options.js')
	.bundle()
	.pipe(source('options.js'))
	.pipe(gulp.dest('./dist/js/'))
})
gulp.task('js:app', () => {
	return browserify('./src/js/app.js')
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest('./dist/js/'))
})

gulp.task('js:plugins', () => {
	return gulp.src('vendor/awesomplete/awesomplete.js')
	.pipe(concat('plugins.js'))
	.pipe(gulp.dest('./dist/js/'))
})

function scss(browserList) {
	return gulp.src('vendor/bootswatch/**/style.scss')
	.pipe(sass({
		includePaths: ['vendor/bootstrap/', 'src/scss'],
	}).on('error', sass.logError))
	.pipe(csscomb())
	.pipe(autoprefixer({
		browsers: browserList,
		cascade: false,
		remove: true,
	}))
	.pipe(cssnano())
}


gulp.task('scss:web', () => {
	return scss(['last 2 versions', 'Firefox ESR'])
	.pipe(gulp.dest('dist/bootswatch/'))
})

gulp.task('scss:firefox', () => {
	return scss(['Firefox ESR'])
	.pipe(gulp.dest('dist/bootswatch/'))
})

gulp.task('scss:chrome', () => {
	return scss(['last 2 Chrome versions'])
	.pipe(gulp.dest('dist/bootswatch/'))
})

gulp.task('scss:opera', () => {
	return scss(['last 2 Opera versions'])
	.pipe(gulp.dest('dist/bootswatch/'))
})

gulp.task('lint', () => {
	return gulp.src(['**/*.js', '!node_modules/**', '!vendor/**', '!dist/**'])
		.pipe(eslint())
    .pipe(eslint.format())
		.pipe(eslint.failAfterError())
})
