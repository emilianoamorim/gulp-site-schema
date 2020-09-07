const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const babel = require('gulp-babel');
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const nunjucks = require('gulp-nunjucks');

sass.compiler = require('node-sass');

gulp.task('start', (done) => {
  nodemon({
    script: 'main.js'
  , tasks: (changedFiles) => {
      const tasks = []
      if (!changedFiles) return tasks;
      changedFiles.forEach((file) => {
        if (path.extname(file) === '.js' && !~tasks.indexOf('dev-scripts')) tasks.push('dev-scripts')
        if (path.extname(file) === '.scss' && !~tasks.indexOf('dev-sass')) tasks.push('dev-sass')
      })
      return tasks
    }
  , ext: 'js html scss'
  , ignore: ["node_modules/"]
  , env: { 'NODE_ENV': 'development' }
  , done: done
  })
});

/**
 * production environment tasks
 */

gulp.task('prod-html-compile', () => {
  return gulp.src([
    'src/**/*.html', 
    '!src/**/*.js',
    '!src/**/_*.html'
    ])
    .pipe(nunjucks.compile())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('prod-scripts', () => {
  return gulp.src([ 
    'node_modules/babel-polyfill/dist/polyfill.js',
    'src/scripts/*.js',
    '!src/vendor/**/*.js'
    ])
    .pipe(babel({ presets: [
      ["@babel/preset-env", {
        targets: {
          ie: 11
        }
      }]
    ] }))
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('prod-sass', () => {
  return gulp.src(['src/styles/**/*.scss', '!src/vendor/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(csso())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('prod-vendor', () => {
  return gulp
    .src(['./src/vendor/**/*'])
    .pipe(gulp.dest('./dist/vendor'));
});

gulp.task('prod-fonts', () => {
  return gulp
    .src(['./src/fonts/**/*'])
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('prod-images', () => {
  return gulp
    .src(['./src/images/**/*'])
    .pipe(gulp.dest('./dist/images'));
});

/**
 * dev environment tasks
 */

gulp.task('dev-html-compile', () => {
  return gulp.src([
    'src/**/*.html', 
    '!src/**/*.js',
    '!src/**/_*.html'
    ])
    .pipe(nunjucks.compile())
    .pipe(gulp.dest('www'))
});

gulp.task('dev-scripts', () => {
  return gulp.src([ 
    'node_modules/babel-polyfill/dist/polyfill.js',
    'src/scripts/*.js',
    '!src/vendor/**/*.js'
    ])
    .pipe(babel({ presets: [
      ["@babel/preset-env", {
        targets: {
          ie: 11
        }
      }]
    ] }))
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest('www/js'))
});

gulp.task('dev-sass', () => {
  return gulp.src(['src/styles/**/*.scss', '!src/vendor/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./www/css'));
});

gulp.task('dev-vendor', () => {
  return gulp
    .src(['./src/vendor/**/*'])
    .pipe(gulp.dest('./www/vendor'));
});

gulp.task('dev-fonts', () => {
  return gulp
    .src(['./src/fonts/**/*'])
    .pipe(gulp.dest('./www/fonts'));
});

gulp.task('dev-images', () => {
  return gulp
    .src(['./src/images/**/*'])
    .pipe(gulp.dest('./www/images'));
});

gulp.task('dev', gulp.series(
  'dev-scripts',
  'dev-html-compile',
  'dev-sass', 
  'dev-vendor',
  'dev-fonts',
  'dev-images', 
  'start'
));

gulp.task('production', gulp.series(
  'prod-scripts',
  'prod-html-compile',
  'prod-sass', 
  'prod-vendor',
  'prod-fonts',
  'prod-images'
));
