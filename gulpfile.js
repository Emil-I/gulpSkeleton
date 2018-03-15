'use strict';

const gulp = require('gulp');
const del = require('del');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const newer = require('gulp-newer');
const debug = require('gulp-debug');

const dist = {
  root: 'app/dist',
  fonts: 'app/src/fonts/**',
  styles: 'app/src/styles/main.*',
  html: 'app/src/*.html',
  img: 'app/src/img/**'
};

const base = {
  root: 'app/src'
};

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// clean
gulp.task('clean', function() {
  return del(dist.root);
});

// copy html
gulp.task('html', function() {
  return gulp.src(dist.html)
    .pipe(gulp.dest(dist.root));
});

// build css from scss or sass
gulp.task('build:css', function() {
  return gulp.src(dist.styles, {
      base: base.root
    })
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: 'last 3 version',
      cascade: false
    }))
    .pipe(gulp.dest(dist.root));
});

// copy image
gulp.task('copy:image', function() {
  return gulp.src(dist.img, {
      base: base.root,
      since: gulp.lastRun('copy:image')
    })
    .pipe(newer(dist.root))
    .pipe(debug({
      title: 'copy:image'
    }))
    .pipe(gulp.dest(dist.root));
});

// copy fonts
gulp.task('copy:fonts', function() {
  return gulp.src(dist.fonts, {
      base: base.root,
      since: gulp.lastRun('copy:fonts')
    })
    .pipe(newer(dist.root))
    .pipe(debug({
      title: 'copy:fonts'
    }))
    .pipe(gulp.dest(dist.root));
});

/*
   RUN BUILD
*/
gulp.task('default',
  gulp.series('clean', gulp.parallel('html', 'copy:image', 'copy:fonts', 'build:css')));



// WATCHERS
gulp.task('watch', function() {
  gulp.watch(dist.styles, gulp.series('build:css'));
  gulp.watch(dist.fonts, gulp.series('copy:fonts'));
  gulp.watch(dist.img, gulp.series('copy:image'));
});


/*
RUN BUILD DEV
*/
gulp.task('dev', gulp.series('default', 'watch'));


/*
RUN BUILD PROD
*/
gulp.task('build', gulp.series('default'));

/*
   END
*/
