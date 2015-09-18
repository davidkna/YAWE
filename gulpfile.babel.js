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

gulp.task('generic:chrome', () => {
	return gulp.src(['./src/chrome/*', '!./src/chrome/*.js'])
		.pipe(gulp.dest('dist'))
})

gulp.task('html', () => {
	return gulp.src('./src/*.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist'))
})

gulp.task('img', () => {
	return gulp.src('./src/images/*.png')
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

gulp.task('js:app', () => {
	return browserify('./src/js/app.js')
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('./dist/js/'))
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

gulp.task('js:helper', () => {
	return gulp.src('./src/js/helper.js')
		.pipe(babel())
		.pipe(gulp.dest('./dist/js/'))
})

gulp.task('js:helper_min', () => {
	return gulp.src('./src/js/helper.js')
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js/'))
})

gulp.task('js:wiki', () => {
	return gulp.src('./src/js/wiki.js')
		.pipe(babel())
		.pipe(gulp.dest('./dist/js/'))
})

gulp.task('js:wiki_min', () => {
	return gulp.src('./src/js/wiki.js')
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js/'))
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
		.pipe(gulp.dest('dist/bootswatch/'))
}


gulp.task('scss:web', () => {
	return scss(['> 1%', 'last 2 versions', 'Firefox ESR'])
})

gulp.task('scss:firefox', () => {
	return scss(['Firefox ESR'])
})

gulp.task('scss:chrome', () => {
	return scss(['last 2 Chrome versions'])
})

gulp.task('scss:opera', () => {
	return scss(['last 2 Opera versions'])
})
