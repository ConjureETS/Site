'use strict';

let gulp = require('gulp');
let uglifyes = require('uglify-es');
let composer = require('gulp-uglify/composer');
let uglify = composer(uglifyes, console);
let rename = require('gulp-rename');
let concat = require('gulp-concat');
let Fiber = require('fibers');
let cleanCSS = require('gulp-clean-css');
let sass = require('gulp-sass');
sass.compiler = require('sass');

const directories = {
    source: './resources/',
    destination: './public/'
};

gulp.task('sass', function () {
    return gulp.src(directories.source + 'sass/**/*.scss')
        .pipe(sass({fiber: Fiber}).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directories.destination + 'css/'));
});

gulp.task('js', function () {
    return gulp.src(directories.source + 'js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directories.destination + 'js/'));
});

gulp.task('watch', function() {
    gulp.watch([directories.source + 'sass/**/*.scss'], gulp.series('sass'));
    gulp.watch([directories.source + 'js/**/*.js'], gulp.series('js'));

});