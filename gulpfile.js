var gulp = require('gulp'),
  less = require('gulp-less'),
  gaze = require('gaze'),
  jade = require('gulp-jade'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  stylish = require('jshint-stylish'),
  minifyCSS = require('gulp-minify-css'),
  connect = require('gulp-connect'),
  imagemin = require('gulp-imagemin');

/**
 * @usage: gulp connect
 *
 * 创建服务器，hostname：localhost；port：8001
 */
gulp.task('connect', function() {
  connect.server({
    port: 12000,
    root: 'webapp',
    livereload: true
  });
});

/**
 * @usage: gulp less
 *
 * 编译less文件
 */
gulp.task('less', function() {
  gulp
    .src('webapp/less/greenbird.less')
    .pipe(less())
    .pipe(gulp.dest('webapp/dest/css'));
});

/**
 * @usage: gulp imagemin
 *
 * 优化image
 */
gulp.task('imagemin', function() {
  console.info('imagemin');
});

/**
 * @usage: gulp jade
 *
 * 编译jade文件
 */
gulp.task('jade', function() {
  gulp
    .src('webapp/template/**/*.jade')
    .pipe(jade({
      pretty: true,
      doctype: 'html'
    }))
    .pipe(gulp.dest('webapp/dest/template'));
});

/**
 * @usage: gulp concat
 *
 * 串接js文件，同时jshint
 */
gulp.task('concat', function() {
  gulp
    .src(['webapp/js/**/*.js', '!webapp/js/config.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat('greenbird.js'))
    .pipe(gulp.dest('webapp/dest/js'));
});


gulp.task('watch', function() {
  gulp.watch(['webapp/template/**/*.jade'], ['jade']);
  gulp.watch(['webapp/less/**/*.less'], ['less']);
  gulp.watch(['webapp/js/**/*.js'], ['concat']);
});

gulp.task('watch-less', function() {
    gulp.watch(['webapp/less/**/*.less'], ['less']);
});

gulp.task('build', ['jade', 'concat', 'less']);
gulp.task('build-less', ['less']);

gulp.task('default', ['connect', 'build', 'watch']);