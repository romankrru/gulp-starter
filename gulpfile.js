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

const config = require('./config/gulp.config');

const html = () => (
  gulp.src(config.html.src)
  .pipe(rigger())
  .pipe(rename({ dirname: '' }))
  .pipe(gulp.dest(config.html.tmp))
  .pipe(browserSync.stream())
);

const buildHtml = () => (
  gulp.src(config.html.src)
  .pipe(rigger())
  .pipe(rename({ dirname: '' }))
  .pipe(gulp.dest(config.html.build))
);

const styles = () => (
  gulp.src(config.style.src)
  .pipe(sourcemaps.init())
  .pipe(stylus())
  .pipe(autoprefixer())
  .pipe(cleanCss())
  .pipe(rename({
    dirname: '',
    suffix: '.min',
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.style.tmp))
  .pipe(browserSync.stream())
);

const buildStyles = () => (
  gulp.src(config.style.src)
  .pipe(stylus())
  .pipe(autoprefixer())
  .pipe(cleanCss())
  .pipe(rename({
    dirname: '',
    suffix: '.min',
  }))
  .pipe(gulp.dest(config.style.build))
);

const scripts = () => {
  gulp.src('./src/common/index.js')
  .pipe(webpack(require('./config/webpack.config.js')))
  .pipe(gulp.dest('./.tmp/js'))
  .pipe(browserSync.stream())
};

const buildScripts = () => {
  gulp.src('./src/common/index.js')
  .pipe(webpack(require('./config/webpack.prod.config.js')))
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.stream())
};

const images = () => (
  gulp.src(config.image.src)
  .pipe(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }]
  }))
  .pipe(gulp.dest(config.image.tmp))
);

const buildImages = () => (
  gulp.src(config.image.src)
  .pipe(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }]
  }))
  .pipe(gulp.dest(config.image.build))
);

const fonts = () => (
  gulp.src(config.fonts.src)
  .pipe(gulp.dest(config.fonts.tmp))
);

const buildFonts = () => (
  gulp.src(config.fonts.src)
  .pipe(gulp.dest(config.fonts.build))
);

function deploy() {
  return gulp.src(`${config.html.tmp}/**/*`)
    .pipe(sftp(require('./remote_config')));
}

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('fonts', fonts);
gulp.task('images', images);

gulp.task('build:html', buildHtml);
gulp.task('build:styles', buildStyles);
gulp.task('build:scripts', buildScripts);
gulp.task('build:fonts', buildFonts);
gulp.task('build:images', buildImages);

gulp.task('deploy', deploy);

gulp.task('serve', [
  'html', 
  'styles',
  'scripts',
  'fonts',
  'images'
], () => {
  browserSync.init({ server: config.html.tmp });
  watch(config.image.src, images);
  watch(config.html.watch, html);
  watch(config.style.watch, styles);
  watch(config.fonts.src, fonts);
});

gulp.task('build', [
  'build:html',
  'build:styles',
  'build:scripts',
  'build:fonts',
  'build:images'
]);

gulp.task('serve:build', ['build'], () => {
  browserSync.init({ server: config.html.build });
});

gulp.task('default', ['serve']);
