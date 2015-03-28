'use strict';

// -----------------------------------------------------------------------------
// VARIABLES & REQUIRE:

var PROJECT_ROOT = './'
  , ASSETS_DIR   = PROJECT_ROOT + 'assets/'
  , OUTPUT_ROOT  = PROJECT_ROOT + 'build/'
  , OUTPUT_DIR   = OUTPUT_ROOT + 'shared/'
  ;

var gulp = require('gulp')
  , $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'gulp.*']
    , replaceString: /\bgulp[\-.]/
    })
  , minimist = require('minimist')
  , del = require('del')
  , named = require('vinyl-named')
  , runSequence = require('run-sequence')
  , bourbon = require('node-bourbon')
  , neat = require('node-neat')
  , paths = {
      assets: {
        jsDir:   ASSETS_DIR + 'scripts'
      , scssDir: ASSETS_DIR + 'scss'
      , scssSptiteDir: ASSETS_DIR + 'scss/utility/sprite'
      , styleguideDir: ASSETS_DIR + 'styleguide/'
      }
    , output: {
        jsDir:  OUTPUT_DIR + 'scripts'
      , cssDir: OUTPUT_DIR + 'styles'
      , imgDir: OUTPUT_DIR + 'imgs'
      , imgSptiteDir: OUTPUT_DIR + 'imgs/sprite'
      , styleguideDir: OUTPUT_ROOT + 'styleguide'
      },
    };

// -----------------------------------------------------------------------------
// CLI OPTIONS:
// * --env prod - 本番用のオプション（ Minify Uglify などが実行される）

var args = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'dev' }
};
var options = minimist(process.argv.slice(2), args);
var isProduction = (options.env === 'prod') ? true : false;

// console.log('[build env]', options.env, '[is prod]', isProduction);

// -----------------------------------------------------------------------------
// TASK: SPRITE 生成
// * paths.assets.scssSptiteDir - スプライト用の元画像 & スプライト用テンプレート置き場
// * paths.output.imgSptiteDir  - 生成したスプライト画像置き場
// * Jinja template に Ratios が渡らないのでテンプレート側で調整

gulp.task('glue', function() {
  return gulp.src(paths.assets.scssSptiteDir + '/imgs/*')
    .pipe($.plumber())
    .pipe($.spriteGlue(paths.output.imgSptiteDir, {
        scss: paths.assets.scssSptiteDir
      , scssTemplate: paths.assets.scssSptiteDir + '/template/scss.jinja'
      , ratios: '2,1'
      , margin: '4'
      , namespace: ''
      // , force: true
    }));
});

// -----------------------------------------------------------------------------
// TASK: SASS コンパイル [lib-sass]

gulp.task('sass', function() {
  return gulp.src(paths.assets.scssDir + '/**/*.scss')
    .pipe($.plumber())
    .pipe($.sass({
        bundleExec: true
      , errLogToConsole: true
      , style: 'expanded'
      , includePaths: neat.includePaths
    }))
    .pipe(gulp.dest(paths.output.cssDir));
});

// -----------------------------------------------------------------------------
// TASK: Prefix をつける
gulp.task('autoprefixer', function() {
  return gulp.src(paths.output.cssDir + '/**/*.css')
    .pipe($.plumber())
    .pipe($.autoprefixer('last 2 version')) // PC
    // .pipe($.autoprefixer(['ios', 'android'])) // SP
    .pipe(gulp.dest(paths.output.cssDir));
});

// -----------------------------------------------------------------------------
// TASK: Styleguide

gulp.task('kss', function() {
  return gulp.src(paths.assets.scssDir + '/**/*.scss')
    .pipe($.plumber())
    .pipe($.kss({
      overview: paths.assets.styleguideDir + '/styleguide.md'
    , templateDirectory: paths.assets.styleguideDir + '/template'
    }))
    .pipe(gulp.dest(paths.output.styleguideDir));
});
gulp.task('move:style', function() {
  return gulp.src(paths.output.cssDir + '/styleguide.css')
    .pipe(gulp.dest(paths.output.styleguideDir + '/public/'));
});

// -----------------------------------------------------------------------------
// TASK: CSS の整理整頓
// * Media queries をまとめる
// * Minfy する

gulp.task('format:css', function() {
  return gulp.src(paths.output.cssDir + '/**/*.css')
    .pipe($.plumber())
    .pipe($.combineMediaQueries())
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.output.cssDir));
});

// -----------------------------------------------------------------------------
// TASK: WEBPACK

gulp.task('webpack', function() {
  return gulp.src(paths.assets.jsDir + '/*.js')
    .pipe($.plumber())
    .pipe(named())
    .pipe($.webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.output.jsDir));
});

// -----------------------------------------------------------------------------
// TASK: UGLIFY

gulp.task('uglify', function() {
  return gulp.src(paths.output.jsDir + '/**/*.js')
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe(gulp.dest(paths.output.jsDir));
});

// -----------------------------------------------------------------------------
// TASK: 不要なファイルやディレクトリを削除

gulp.task('clean', del.bind(null, [
  paths.output.cssDir + '/utility'
, paths.output.cssDir + '/styleguide.css'
]));

// -----------------------------------------------------------------------------
// TASK: build

gulp.task('build', function() {
  runSequence('glue', ['build:css', 'build:js']);
});
gulp.task('build:styleguide', function() {
  runSequence('glue', 'sass', 'kss', 'autoprefixer', 'format:css', 'move:style', 'clean');
});
gulp.task('build:css', function() {
  if (isProduction) runSequence('sass', 'autoprefixer', 'format:css', 'clean');
  else              runSequence('sass', 'autoprefixer');
});
gulp.task('build:js', function() {
  if (isProduction) runSequence('webpack', 'uglify');
  else              runSequence('webpack');
});


// -----------------------------------------------------------------------------
// TASK: watch

gulp.task('watch', function() {
  gulp.watch(paths.assets.scssDir + '/sprite/imgs', ['glue']);
  gulp.watch(paths.assets.scssDir + '/**/*.scss', ['build:css']);
  gulp.watch(paths.assets.jsDir   + '/**/*.js', ['build:js']);
});

gulp.task('watch:css', function() {
  gulp.watch(paths.assets.scssDir + '/**/*.scss', ['build:css']);
});

gulp.task('watch:js', function() {
  gulp.watch(paths.assets.jsDir   + '/**/*.js', ['build:js']);
});

// -----------------------------------------------------------------------------
// TASK: default

gulp.task('default', ['watch']);
