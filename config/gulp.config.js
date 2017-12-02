const config = {
  html: {
    src: './src/pages/*.html',
    build: './build',
    watch: './src/pages/**/*.html',
    tmp: './.tmp'
  },
  style: {
    src: './src/common/*.styl',
    build: './build/css',
    tmp: './.tmp/css',
    watch: ['./src/blocks/**/*.styl', './src/common/*.styl']
  },
  image: {
    src: ['./src/img/**/*.jpg', './src/img/**/*.png', './src/img/**/*.svg'],
    tmp: './.tmp/img',
    build: './build/img'
  },
  fonts: {
    src: ['./src/fonts/**/*'],
    tmp: './.tmp/fonts',
    build: './build/fonts'
  }
};

module.exports = config;