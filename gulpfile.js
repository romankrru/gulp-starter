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
var del = require('del');
const eslint = require('gulp-eslint');

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

gulp.task('lint', () => {
  // ESLint ignores files with "node_modules" paths. 
  // So, it's best to have gulp ignore the directory as well. 
  // Also, Be sure to return the stream from the task; 
  // Otherwise, the task may end before the stream has finished. 
  return gulp.src(['./src/**/*.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property 
    // of the file object so it can be used by other modules. 
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console. 
    // Alternatively use eslint.formatEach() (see Docs). 
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on 
    // lint error, return the stream and pipe to failAfterError last. 
    .pipe(eslint.failAfterError());
});

function deploy() {
  return gulp.src(`${config.html.tmp}/**/*`)
    .pipe(sftp(require('./remote_config')));
}

gulp.task('deploy', deploy);

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

gulp.task('serve', [
  'clean:tmp',
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
  'clean:build',
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
