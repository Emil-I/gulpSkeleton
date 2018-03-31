'use strict';

const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const debug = require('gulp-debug');
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const minify_css = require('gulp-minify-css');
const minify_js = require('gulp-js-minify');
const minify_image = require('gulp-image');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

const dist = {
  root: 'dist',
  fonts: 'src/fonts/**',
  styles: 'src/styles/*.*',
  html: 'src/*.html',
  img: 'src/img/**',
  script: 'src/js/**/*.js',
  lib: 'src/lib/**'
};

const base = {
  root: 'src'
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
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .on('error', notify.onError(function(err) {
      return {
        title: 'sass',
        message: err.message
      }
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(autoprefixer({
      browsers: 'last 3 version',
      cascade: false
    }))
    .pipe(concat('styles/main.css'))
    .pipe(gulpIf(!isDevelopment, minify_css()))
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
    .pipe(gulpIf(!isDevelopment, minify_image()))
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

// scripts
gulp.task('build:script', function() {
  return gulp.src(dist.script, {
      base: base.root
    })
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('js/main.js'))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, minify_js()))
    .pipe(gulp.dest(dist.root));
});

// move lib
gulp.task('move:lib', function() {
  return gulp.src(dist.lib, {
      base: base.root,
      since: gulp.lastRun('move:lib')
    })
    .pipe(newer(dist.root))
    .pipe(debug({
      title: 'move:lib'
    }))
    .pipe(gulp.dest(dist.root));
});




// move bootstrap
gulp.task('move:bootstrap', function() {
  return gulp.src('node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('dist/lib/bootstrap'))
});

// move jquery
gulp.task('move:jquery', function() {
  return gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('dist/lib/jquery'))
});

gulp.task('move',
  gulp.series('move:bootstrap', 'move:jquery'));





// serve
gulp.task('serve', function() {
  browserSync.init({
    server: dist.root
  });
  browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});


// WATCHERS
gulp.task('watch', function() {
  gulp.watch(dist.html, gulp.series('html'));
  gulp.watch(dist.fonts, gulp.series('copy:fonts'));
  gulp.watch(dist.img, gulp.series('copy:image'));
  gulp.watch(dist.styles, gulp.series('build:css'));
  gulp.watch(dist.script, gulp.series('build:script'));
});


/*
   RUN BUILD DEV
*/
gulp.task('build:all',
  gulp.series('clean', 'move', gulp.parallel('html', 'copy:image', 'copy:fonts', 'build:css', 'build:script', 'move:lib')));


/*
RUN BUILD WATCH SERVE
*/
gulp.task('default',
  gulp.series('build:all', gulp.parallel('watch', 'serve')));


/*
RUN BUILD PROD
*/
gulp.task('build',
  gulp.series('build:all'));

/*
   END
*/
