'use strict';

const gulp = require('gulp');


gulp.task('default', function() {
  return gulp.src('app/src/*.html')
    .pipe(gulp.dest('dist'));
})
