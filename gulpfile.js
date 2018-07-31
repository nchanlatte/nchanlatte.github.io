// Common
const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
// CSS
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csswring = require('csswring');
// JS
const buble = require('gulp-buble');
const uglify = require('gulp-uglify');
// HTML
const nunjucksRender = require('gulp-nunjucks-render');
const inline = require('gulp-inline-source');

const BUILD = './';

gulp.task('clean', () => del.sync([`${BUILD}/**`, `!${BUILD}`]));

gulp.task('css', () => {
  return gulp.src('styles/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(gulp.dest(`${BUILD}/css`))
    .pipe(postcss([
      csswring({
        removeAllComments: true,
      }),
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${BUILD}/css`));
});

gulp.task('js', () => {
  return gulp.src('scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(buble())
    .pipe(gulp.dest(`${BUILD}/js`))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${BUILD}/js`));
});

gulp.task('copy-static', () => gulp.src('static/**').pipe(gulp.dest(BUILD)));

gulp.task('html', () => {
  return gulp.src('pages/**/*.njk')
    .pipe(nunjucksRender({
      path: ['templates'],
    }))
    .pipe(inline({
      rootpath: BUILD,
    }))
    .pipe(gulp.dest(BUILD));
});


gulp.task('default', cb => runSequence(['css', 'js', 'copy-static'], 'html', cb));

gulp.task('watch', () => {
  gulp.watch('styles/**', () => runSequence('css', 'html'));
  gulp.watch('scripts/**', () => runSequence('js', 'html'));
  gulp.watch('static/**', () => runSequence('copy-static', 'html'));
  gulp.watch(['templates/**', 'pages/**'], ['html']);
});
