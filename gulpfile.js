'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const util = require('gulp-util');
const watch = require('gulp-watch');

gulp.task('default', function () {
  gulp.src(['src/core', 'src/test'])
    .pipe(jshint())
    .pipe(gulp.dest('dist'))
    .on('error', util.log);

  gulp.src(['src/cli/**'])
    .pipe(jshint())
    .pipe(gulp.dest('dist/bin'))
    .on('error', util.log);
});
