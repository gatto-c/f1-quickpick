'use strict';

var path = require('path');
var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

/**
 * watch:sass
 * Watches the SASS file and runs the 'sass'
 * task when changes have been made
 *
 * Dependency: 'build' task
 */
gulp.task('watch:sass', ['build'],function () {
  watch('client/**/*.scss', batch(function (events, done) {
    gulp.start('sass', done);
  }));
});

/**
 * watch:ng
 * Watches the AngularJS code and runs the
 * 'default' task when changes have been made.
 *
 * Dependency: 'build' task
 */
gulp.task('watch:ng', ['build'],function () {
  watch(['client/my-ng-files/**/*.ng.*.js','client/my-ng-files/**/*.ng.template.html'], batch(function (events, done) {
    gulp.start('default', done);
  }));
});

gulp.task('watch:config', ['build'],function () {
  watch(['config/*.json'], batch(function (events, done) {
    gulp.start('default', done);
  }));
});

/**
 * watch
 * Task composed of other watch subtasks
 */
gulp.task('watch',['watch:sass','watch:ng', 'watch:config']);

//gulp.task('watch', ['scripts:watch', 'inject'], function () {
//  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);
//
//  gulp.watch([
//    path.join(conf.paths.src, '/app/**/*.css'),
//    path.join(conf.paths.src, '/app/**/*.scss')
//  ], function(event) {
//    if(isOnlyChange(event)) {
//      gulp.start('styles-reload');
//    } else {
//      gulp.start('inject-reload');
//    }
//  });
//
//
//  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
//    browserSync.reload(event.path);
//  });
//});
