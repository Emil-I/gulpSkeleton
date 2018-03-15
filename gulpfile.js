'use strict';

const gulp = require('gulp');
const del = require('del');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const dist = {
  root: 'app/dist'
};
const base = {
  root: 'app/src'
};

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


gulp.task('clean', function() {
  return del(dist.root);
});


gulp.task('html', function() {
  return gulp.src('app/src/*.html')
    .pipe(gulp.dest(dist.root));
});


gulp.task('build:css', function() {
  return gulp.src('app/src/styles/main.*', {
      base: base.root
    })
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: 'last 3 version',
      cascade: false
    }))
    .pipe(gulp.dest(dist.root));
});


gulp.task('copy:image', function() {
  return gulp.src('app/src/img/**', {
      base: base.root
    })
    .pipe(gulp.dest(dist.root));
});

gulp.task('copy:fonts', function() {
  return gulp.src('app/src/fonts/**', {
      base: base.root
    })
    .pipe(gulp.dest(dist.root));
});


gulp.task('build',
  gulp.series('clean', gulp.parallel('html', 'copy:image', 'copy:fonts', 'build:css')));

/*
END
*/
