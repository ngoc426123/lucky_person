const gulp = require('gulp');
const browserSync = require('browser-sync');

const html = require(`./build-html.js`);
const style = require(`./build-style.js`);
const script = require(`./build-script.js`);
const data = require(`./build-data.js`);

const watch = function () {
  browserSync.init({
    server:{
      baseDir : './build/',
    }
  });

  gulp.watch('src/scss/*', gulp.series(style))
  gulp.watch('src/scss/**/*', gulp.series(style))
  gulp.watch('src/js/*', gulp.series(script))
  gulp.watch('src/js/**/*', gulp.series(script))
  gulp.watch('src/html/*', gulp.series(html))
  gulp.watch('src/html/**/*', gulp.series(html))
  gulp.watch('src/data/*', gulp.series(data))
}

watch.displayName = `Runner: watch`;

module.exports = watch;