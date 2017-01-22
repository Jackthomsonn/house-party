import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import nodemon from 'gulp-nodemon'
import browserify from 'browserify'
import babelify from 'babelify'
import cleanCSS from 'gulp-clean-css'
import source from 'vinyl-source-stream'
import ts from 'gulp-typescript'
import buffer from 'vinyl-buffer'
import tsify from 'tsify'

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

gulp.task('compile', function () {  
  return browserify()
    .add('./src/client/app.ts')
    .plugin(tsify)
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .on('error', function (error) { console.error(error); })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/'));
});

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
  gulp.watch('./src/client/**/*.ts', ['compile'])
  gulp.watch('./src/server/**/**/*.js', ['move'])
  gulp.watch('./src/*.html', ['move'])
  gulp.watch('./src/assets/scss/**/*.scss', ['sass'])
})

gulp.task('default', ['nodemon', 'compile', 'move', 'sass', 'watch'])