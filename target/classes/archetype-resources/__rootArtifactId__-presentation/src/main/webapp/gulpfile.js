var gulp = require('gulp')
    , stylus = require('gulp-stylus')
    , minifyCSS = require('gulp-minify-css')
    , rename = require('gulp-rename')
    , jshint = require('gulp-jshint')
    , notify = require('gulp-notify')
    , plumber = require('gulp-plumber')
    , uglify = require('gulp-uglify')
    , del = require('del')
    , run = require('run-sequence')
    ;
var paths = {
    dist: {
        styles: 'dist/',
        javascript: 'dist/gumga/',
        images: 'dist/images'
    },
    dev: {
        javascript: 'app/modules/',
        stylus: 'resources/styles/',
        images: 'resources/images/'
    },
    images: {
        imgSrc: 'resources/images',
        imgDst: 'resources/images'
    }
};

var onError = function (err) {
    console.log(err);
};


gulp.task('css', function () {
    return gulp.src([paths.dev.stylus + '**/*.styl', '!' + paths.dev.stylus + 'gumga/**'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(stylus())
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.dist.styles));
});

gulp.task('javascript', function () {
    return gulp.src(['app/modules/gumga/**/*.js', '!app/modules/gumga/module.js'])
        .pipe(uglify())
        .pipe(gulp.dest('app/modules/gumga'))
});

gulp.task('jshint', function () {
    return gulp.src([paths.dev.javascript + '**/*.js', '!app/modules/gumga/**/*.js'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify({message: 'JS Hinting task complete'}));
});

gulp.task('clean', function (cb) {
    del(['dist/gumga.css'], cb);
});

gulp.task('watchers', function () {
    gulp.watch(paths.dev.stylus + '**/*.styl', ['run']);
    gulp.watch(paths.dev.javascript + '**/*.js', ['jshint']);
});

gulp.task('run', function () {
    run('css', 'clean');
});


gulp.task('default', ['run', 'jshint', 'watchers']);