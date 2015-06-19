var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');

var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var csscomb = require('gulp-csscomb');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var streamify = require('gulp-streamify')
var uglify = require('gulp-uglify');

// TODO: FIREFOX & Web


gulp.task('generic:chrome', function() {
    return gulp.src('./src/chrome/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('img', function() {
    return gulp.src('./src/images/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
});


gulp.task('js', ['js:app', 'js:options', 'js:plugins']);

gulp.task('js:options', function() {
    return browserify('./src/js/options.js')
        .bundle()
        .pipe(source('options.js'))//.pipe(streamify(uglify()))
        .pipe(gulp.dest('./dist/js/'));
});


gulp.task('js:app', function() {
    return browserify('./src/js/app.js')
        .bundle()
        .pipe(source('app.js'))//.pipe(streamify(uglify()))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js:plugins', function() {
    return gulp.src('vendor/awesomplete/awesomplete.js')
        .pipe(concat('plugins.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

function scss(browsers) {
	return gulp.src('vendor/bootswatch/**/style.scss')
		.pipe(sass({
				includePaths: ['vendor/bootstrap/', 'src/scss']
			}).on('error', sass.logError))
		.pipe(csscomb())
		.pipe(autoprefixer({
			browsers: browsers,
			cascade: false,
			remove: true
		})) // .pipe(csso())
		.pipe(gulp.dest('dist/bootswatch/'));
}


gulp.task('scss:web', function() {
	return scss(['> 1%', 'last 2 versions', 'Firefox ESR']);
});

gulp.task('scss:firefox', function() {
	return scss(['Firefox ESR']);
});

gulp.task('scss:chrome', function() {
	return scss(['last 2 Chrome versions']);
});

gulp.task('scss:opera', function() {
	return scss(['last 2 Opera versions']);
});
