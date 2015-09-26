import gulp from 'gulp'
import browserify from 'browserify'
import del from 'del'
import source from 'vinyl-source-stream'

import autoprefixer from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import concat from 'gulp-concat'
import csscomb from 'gulp-csscomb'
import imagemin from 'gulp-imagemin'
import minifyCss from 'gulp-minify-css'
import minifyHtml from 'gulp-minify-html'
import sass from 'gulp-sass'
import streamify from 'gulp-streamify'
import uglify from 'gulp-uglify'


gulp.task('clean', callback => {
	return del('dist/', callback)
})

gulp.task('release:chrome', ['clean'], () => {
	gulp.run('chrome')
})

gulp.task('chrome', [
	'generic:chrome',
	'js:app_min',
	'js:options_min',
	'js:plugins',
	'scss:chrome',
	'img:chrome',
	'html',
])

gulp.task('release:opera', ['clean'], () => {
	gulp.run('opera')
})

gulp.task('opera', [
	'generic:chrome',
	'js:app',
	'js:options',
	'js:plugins',
	'scss:opera',
	'img:chrome',
	'html',
])

// NOT WORKING YET
gulp.task('release:firefox', ['clean'], () => {
	gulp.run('firefox')
})

gulp.task('firefox', [
	'generic:firefox',
	'js:app_firefox',
	'js:options_firefox',
	'js:plugins_firefox',
	'js:firefox',
	'js:helper',
	'js:wiki',
	'js:ajax',
	'scss:firefox',
	'img:firefox',
	'html:firefox',
])

gulp.task('generic:chrome', () => {
	return gulp.src(['./src/chrome/*', '!./src/chrome/*.js'])
	.pipe(gulp.dest('dist'))
})

gulp.task('generic:firefox', () => {
	return gulp.src(['./src/firefox/*', '!./src/firefox/*.js'])
	.pipe(gulp.dest('dist'))
})

gulp.task('html', () => {
	return gulp.src('./src/*.html')
	.pipe(minifyHtml())
	.pipe(gulp.dest('dist'))
})

gulp.task('html:firefox', () => {
	return gulp.src('./src/*.html')
	.pipe(minifyHtml())
	.pipe(gulp.dest('dist/data'))
})

gulp.task('img:firefox', () => {
	return gulp.src([
		'./src/images/icon_16x16.png',
		'./src/images/icon_32x32.png',
		'./src/images/icon_48x48.png',
		'./src/images/icon_64x64.png',
	])
	.pipe(imagemin())
	.pipe(gulp.dest('dist/data/images'))
})

gulp.task('img:chrome', () => {
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

gulp.task('js:options_min', () => {
	return browserify('./src/js/options.js')
	.bundle()
	.pipe(source('options.js'))
	.pipe(streamify(uglify()))
	.pipe(gulp.dest('./dist/js/'))
})

gulp.task('js:options_firefox', () => {
	return gulp.src('./src/js/options.js')
	.pipe(babel())
	.pipe(gulp.dest('./dist/data/js/'))
})

gulp.task('js:app', () => {
	return browserify('./src/js/app.js')
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest('./dist/js/'))
})

gulp.task('js:app_firefox', () => {
	return gulp.src('./src/js/app.js')
	.pipe(babel())
	.pipe(gulp.dest('./dist/data/js/'))
})

gulp.task('js:app_min', () => {
	return browserify('./src/js/app.js')
	.bundle()
	.pipe(source('app.js'))
	.pipe(streamify(uglify()))
	.pipe(gulp.dest('./dist/js/'))
})

gulp.task('js:plugins', () => {
	return gulp.src('vendor/awesomplete/awesomplete.js')
	.pipe(concat('plugins.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js/'))
})

gulp.task('js:plugins_firefox', () => {
	return gulp.src('vendor/awesomplete/awesomplete.js')
	.pipe(concat('plugins.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/data/js/'))
})

gulp.task('js:firefox', () => {
	return gulp.src('src/firefox/index.js')
	.pipe(babel())
	.pipe(gulp.dest('./dist/'))
})

gulp.task('js:helper', () => {
	return gulp.src('src/helper.js')
	.pipe(babel())
	.pipe(gulp.dest('./dist/data/js/'))
})

gulp.task('js:wiki', () => {
	return gulp.src('src/wiki.js')
	.pipe(babel())
	.pipe(gulp.dest('./dist/data/js/'))
})

gulp.task('js:ajax', () => {
	return gulp.src('src/firefox/ajax.js')
	.pipe(babel())
	.pipe(gulp.dest('./dist/data/js/'))
})

function scss(browsers) {
	return gulp.src('vendor/bootswatch/**/style.scss')
	.pipe(sass({
		includePaths: ['vendor/bootstrap/', 'src/scss'],
	}).on('error', sass.logError))
	.pipe(csscomb())
	.pipe(autoprefixer({
		browsers: browsers,
		cascade: false,
		remove: true,
	}))
	.pipe(minifyCss())
}


gulp.task('scss:web', () => {
	return scss(['last 2 versions', 'Firefox ESR'])
	.pipe(gulp.dest('dist/bootswatch/'))
})

gulp.task('scss:firefox', () => {
	return scss(['Firefox ESR'])
	.pipe(gulp.dest('dist/data/bootswatch/'))
})

gulp.task('scss:chrome', () => {
	return scss(['last 2 Chrome versions'])
	.pipe(gulp.dest('dist/bootswatch/'))
})

gulp.task('scss:opera', () => {
	return scss(['last 2 Opera versions'])
	.pipe(gulp.dest('dist/bootswatch/'))
})
