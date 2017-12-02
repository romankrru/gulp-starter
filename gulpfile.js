const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const sftp = require('gulp-sftp');
const stylus = require('gulp-stylus');
const watch = require('gulp-watch');
const webpack = require('webpack-stream');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');

const path = {
  html: {
    src: './src/pages/*.html',
    dist: './public',
    watch: './src/pages/**/*.html'
  },
  style: {
    src: './src/common/*.styl',
    dist: './public/css',
    watch: ['./src/blocks/**/*.styl', './src/common/*.styl']
  },
  image: {
    src: ['./src/img/**/*.jpg', './src/img/**/*.png', './src/img/**/*.svg'],
    dist: './public/img'
  },
  fonts: {
    src: ['./src/fonts/**/*'],
    dist: './public/fonts'
  }
};

function buildHMTL() {
  return gulp.src(path.html.src)
    .pipe(rigger())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest(path.html.dist))
    .pipe(browserSync.stream());
}

function buildCSS() {
  return gulp.src(path.style.src)
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(rename({
      dirname: '',
      suffix: '.min',
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.style.dist))
    .pipe(browserSync.stream());
}

function buildJS() {
  gulp.src('./media/script/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream());
}

function optimizeImages() {
  return gulp.src(path.image.src)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }]
    }))
    .pipe(gulp.dest(path.image.dist));
}

const buildFonts = () => (
  gulp.src(path.fonts.src)
  .pipe(gulp.dest(path.fonts.dist))
);

function deploy() {
  return gulp.src(`${path.html.dist}/**/*`)
    .pipe(sftp(require('./remote_config')));
}

gulp.task('build:html', buildHMTL);
gulp.task('build:css', buildCSS);
gulp.task('build:js', buildJS);
gulp.task('build:fonts', buildFonts);
gulp.task('build:img', optimizeImages);
gulp.task('deploy', deploy);

gulp.task('serve', ['build:img', 'build:html', 'build:css', 'build:fonts', 'build:js'], () => {
  browserSync.init({ server: path.html.dist });
  watch(path.image.src, optimizeImages);
  watch(path.html.watch, buildHMTL);
  watch(path.style.watch, buildCSS);
  watch(path.fonts.src, buildFonts);
});

gulp.task('default', ['serve']);
