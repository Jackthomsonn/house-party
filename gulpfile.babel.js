import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import nodemon from 'gulp-nodemon'
import browserify from 'browserify'
import babelify from 'babelify'
import cleanCSS from 'gulp-clean-css'
import source from 'vinyl-source-stream'
import ts from 'gulp-typescript'

const tsProject = ts.createProject('tsconfig.json');

gulp.task('set-dev-node-env', () => {
  return process.env.NODE_ENV = 'development'
})

gulp.task('nodemon', ['set-dev-node-env'], () => {
  nodemon({
    script: './dist/index.js',
    env: {
      'NODE_ENV': 'development'
    }
  })
})

gulp.task('js', () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("dist"));
})

gulp.task('move', () => {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist/'))

  gulp.src(['./src/server/**/**/*.js'])
    .pipe(gulp.dest('./dist'))
})

gulp.task('sass', () => {
  gulp.src('./src/assets/scss/main.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/assets/'))
})

gulp.task('watch', () => {
  gulp.watch('./src/client/**/*.js', ['js'])
  gulp.watch('./src/server/**/**/*.js', ['move'])
  gulp.watch('./src/*.html', ['move'])
  gulp.watch('./src/assets/scss/**/*.scss', ['sass'])
})

gulp.task('default', ['nodemon', 'js', 'move', 'sass', 'watch'])