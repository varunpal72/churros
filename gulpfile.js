'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const util = require('gulp-util');

gulp.task('default', function () {
    return gulp.src(['./test//*.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('dothings', function () {
   return gulp.src('core/src/**/*.js')
      .pipe(jshint())
      // .pipe(jshint.reporter('default'))
      .pipe(concat('app.js'))
      // .pipe(uglify())
      .pipe(gulp.dest('build'))
      .on('error', util.log);
});
