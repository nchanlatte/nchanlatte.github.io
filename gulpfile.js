// Common
const gulp = require('gulp');
const glob = require('glob');
const del = require('del');
const path = require('path');
const merge = require('merge-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
// JS
const rollup = require('rollup-stream');
const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup');
const uglify = require('gulp-uglify');
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

gulp.task('js', () => {
  return merge(glob.sync('js/*.js').map(entry => {
    return rollup({
      entry,
      sourceMap: true,
      format: 'cjs',
      plugins: [
        babel(babelrc.default()),
      ],
    })
    .pipe(source(path.resolve(entry), path.resolve('js')))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(sourcemaps.write('.'))
  })).pipe(gulp.dest(`${BUILD}/js`));
});

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

gulp.task('html', ['js', 'css', 'copy-static'], () => {
  return gulp.src('pages/**/*.html')
    .pipe(nunjucksRender({
      path: ['templates'],
    }))
    .pipe(inline({
      rootpath: BUILD
    }))
    .pipe(gulp.dest(BUILD));
});


gulp.task('default', ['clean', 'js', 'css', 'copy-static', 'html']);

gulp.task('watch', ['default'], () => {
  gulp.watch('js/**', ['js', 'html']);
  gulp.watch('sass/**', ['css', 'html']);
  gulp.watch('static/**', ['copy-static', 'html']);
  gulp.watch(['templates/**', 'pages/**'], ['html']);
});
