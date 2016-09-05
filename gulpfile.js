const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
// Metalsmith
const metalsmith = require('gulp-metalsmith');
const layouts = require('metalsmith-layouts');
const inplace = require('metalsmith-in-place');
const inline = require('gulp-inline-source');

gulp.task('clean', () => {
  del.sync(['build', 'assets/css']);
});

gulp.task('css', () => (
  gulp.src('sass/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    autoprefixer({ browsers: ['last 3 versions'] }),
    cssnano(),
  ]))
  .pipe(gulp.dest('assets/css'))
));

gulp.task('html', ['css'], () => (
  gulp.src('src/**')
    .pipe(metalsmith({
      root: __dirname,
      use: [
        // layouts({
        //   engine: 'handlebars',
        //   partials: 'partials',
        // }),
        // inplace({
        //   engine: 'handlebars',
        //   partials: 'partials',
        // }),
      ],
    }))
    .pipe(inline({
      rootpath: 'assets'
    }))
    .pipe(gulp.dest('build'))
));

gulp.task('default', ['clean', 'css', 'html']);

gulp.task('watch', ['default'], () => {
  gulp.watch('sass/**', ['css', 'html']);
  gulp.watch('src/**', ['html']);
})