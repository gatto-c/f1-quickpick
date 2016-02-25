'use strict';

var path = require('path');
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var iife = require("gulp-iife");
var concat = require('gulp-concat');
var rimraf = require('rimraf');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var size = require('gulp-size');
var conf = require('./conf');
var ngConstant = require('gulp-ng-constant');
var argv = require('yargs').argv;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'f1Quickpick',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });
  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.sourcemaps.init())
    .pipe($.minifyCss({ processImport: false }))
    .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

var environment = argv.env || 'development';

gulp.task('env-config', function() {
  return gulp.src('config/' + environment + '.json')
    .pipe(ngConstant({name: 'f1Quickpick', deps: false}))
    .pipe(concat('app.ng.config.js'))
    .pipe(gulp.dest('client'));
});

/**
* ng-templates
* Assembles all the html templates and
* caches them using angular's template cache
*/
gulp.task('ng-templates', function () {
  return gulp.src('client/my-ng-files/**/*.ng.template.html')
    .pipe(templateCache( {
      module: "f1Quickpick",
      filename: 'gulp.ng.template.js'
    }))
    .pipe(gulp.dest('build/client'));
});

/**
 * assemble-files
 * Assembles all the ng files and concatenates them
 * into a singular file.
 *
 * Dependency: 'ng-templates' task
 */
gulp.task('assemble-files',['ng-templates'],function(){
  return gulp.src([
    'client/my-ng-files/**/*.ng.application.js',
    'client/my-ng-files/**/*.ng.constant.js',
    'client/**/*.ng.config.js',
    'client/my-ng-files/**/*.ng.application.factory.js',
    'client/my-ng-files/**/*.ng.provider.js',
    'client/my-ng-files/**/*.proxy.ng.factory.js',
    'client/my-ng-files/**/*.ng.factory.js',
    'client/my-ng-files/**/*.ng.filter.js',
    'client/my-ng-files/**/*.ng.service.js',
    'client/my-ng-files/**/*.ng.controller.js',
    'build/client/**/*.ng.template.js',
    'client/my-ng-files/**/*.ng.directive.js'])
    .pipe(iife())
    .pipe(concat('my-angular-all.js'))
    .pipe(gulp.dest('client'));
});

/**
 * clean
 * Forcefully removes the 'build' folder.
 *
 * Dependency: 'assemble-files' task
 */
gulp.task('clean', ['assemble-files'], function (cb) {
  rimraf('build', cb);
});

/**
 * sass
 * Runs SASS. Logs any errors if any
 * occur.
 * @Author: Nathan Tranquilla
 */
gulp.task('sass', function () {
  gulp.src('./client/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(concat('f1-quickpick.css'))
    .pipe(gulp.dest('client/css'));
});

/**
 * lint
 * Runs eslint and reports errors/warnings in code base
 */
gulp.task('lint', function() {
  return gulp.src('client/my-ng-files/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(size());
});

gulp.task('build', ['env-config', 'ng-templates', 'assemble-files', 'clean', 'sass', 'lint']);

//gulp.task('build', ['html', 'fonts', 'other']);
