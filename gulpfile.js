// Common
const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
// CSS
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
// HTML
const nunjucksRender = require('gulp-nunjucks-render');
const inline = require('gulp-inline-source');

const BUILD = 'public';

gulp.task('clean', () => del.sync([`${BUILD}/**`, `!${BUILD}`]));

gulp.task('css', () => {
  return gulp.src('sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({ browsers: ['last 3 versions'] }),
      cssnano(),
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${BUILD}/css`));
});

gulp.task('copy-static', () => gulp.src('static/**').pipe(gulp.dest(BUILD)));

gulp.task('html', () => {
  return gulp.src('pages/**/*.html')
    .pipe(nunjucksRender({
      path: ['templates'],
    }))
    .pipe(inline({
      rootpath: BUILD
    }))
    .pipe(gulp.dest(BUILD));
});


gulp.task('default', cb => runSequence('clean', ['css', 'copy-static'], 'html', cb));

gulp.task('watch', ['default'], () => {
  gulp.watch('sass/**', cb => runSequence('css', 'html', cb));
  gulp.watch('static/**', runSequence('copy-static', 'html', cb));
  gulp.watch(['templates/**', 'pages/**'], ['html']);
});
