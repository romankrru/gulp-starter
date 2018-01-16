const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const stylus = require('gulp-stylus');
const watch = require('gulp-watch');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const eslint = require('gulp-eslint');

const config = require('./config/gulp.config');
const webpackDevConfig = require('./config/webpack.config.js');
const webpackProdConfig = require('./config/webpack.prod.config.js');

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
    .on('error', (err) => {
      browserSync.sockets.emit('fullscreen:message', {
        title: "Can't compile styles:",
        body: `Fix the error and reload the page. \n \n${err.message}`,
      });

      console.log('Error:');
      console.log('===============================');
      console.log(err);
    })
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
    .pipe(webpack(webpackDevConfig))
    .pipe(gulp.dest('./.tmp/js'))
    .pipe(browserSync.stream());
};

const buildScripts = () => {
  gulp.src('./src/common/index.js')
    .pipe(webpack(webpackProdConfig))
    .pipe(gulp.dest('./build/js'));
};

const images = () => (
  gulp.src(config.image.src)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
    }))
    .pipe(gulp.dest(config.image.tmp))
);

const buildImages = () => (
  gulp.src(config.image.src)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
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

gulp.task('lint', () => (
  gulp.src(['./src/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
));

gulp.task('clean:tmp', () => (
  del.sync('.tmp')
));

gulp.task('clean:build', () => (
  del.sync('build')
));

gulp.task('clean', ['clean:tmp', 'clean:build']);

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

gulp.task('develop', [
  'clean:tmp',
  'html',
  'styles',
  'scripts',
  'fonts',
  'images',
], () => {
  browserSync.init({
    server: config.html.tmp,
    plugins: ['bs-pretty-message'],
  });
  watch(config.image.src, images);
  watch(config.html.watch, html);
  watch(config.style.watch, styles);
  watch(config.fonts.src, fonts);
});

gulp.task('build', [
  'clean:build',
  'build:html',
  'build:styles',
  'build:scripts',
  'build:fonts',
  'build:images',
]);

gulp.task('serve', ['build'], () => {
  browserSync.init({ server: config.html.build });
});

gulp.task('default', ['develop']);
