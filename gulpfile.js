'use strict';

const gulp = require('gulp');
const del = require('del');
// const sourcemaps = require('gulp-sourcemaps');


gulp.task('clean', function() {
  return del('app/dist');
});

gulp.task('default', function() {
  return gulp.src('app/src/*.html')
    .pipe(gulp.dest('dist'));
});


gulp.task('copy:image', function() {
  return gulp.src('app/src/img/**', {
      base: 'app/src'
    })
    .pipe(gulp.dest('app/dist/'))
});


gulp.task('build', gulp.series('clean', gulp.parallel('default', 'copy:image')));
