const gulp = require('gulp');
const del = require('del');
// CSS
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
// HTML
const nunjucksRender = require('gulp-nunjucks-render');
const inline = require('gulp-inline-source');

gulp.task('clean', () => {
  del.sync(['build']);
});

gulp.task('js', () => (
  gulp.src('js/*.js')
    .pipe(gulp.dest('build/js'))
));

gulp.task('css', () => (
  gulp.src('sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({ browsers: ['last 3 versions'] }),
      cssnano(),
    ]))
    .pipe(gulp.dest('build/css'))
));

gulp.task('copy-static', () => (
  gulp.src('static/**').pipe(gulp.dest('build'))
));

gulp.task('html', ['js', 'css', 'copy-static'], () => (
  gulp.src('pages/**/*.html')
    .pipe(nunjucksRender({
      path: ['templates'],
    }))
    .pipe(inline({
      rootpath: 'build'
    }))
    .pipe(gulp.dest('build'))
));


gulp.task('default', ['clean', 'js', 'css', 'copy-static', 'html']);

gulp.task('watch', ['default'], () => {
  gulp.watch('js/**', ['js', 'html']);
  gulp.watch('sass/**', ['css', 'html']);
  gulp.watch('static/**', ['copy-static', 'html']);
  gulp.watch(['templates/**', 'pages/**'], ['html']);
});