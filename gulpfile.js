var gulp = require('gulp');
var prune = require('gulp-prune');
var newer = require('gulp-newer');
var sass = require('gulp-sass');
var mini = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Tarea para copiar src a dist
gulp.task('copy', ['mini'], function() {
    gulp.src(['src/**/*', '!src/assets/styles/sass/*'])
    .pipe(gulp.dest('dist/'))
    .pipe(livereload());
}); 
// Tarea para borrar archivos de dist cuando se borran en src
gulp.task('prune', ['copy'], function() {
    gulp.src(['src/**/*', '!src/assets/styles/**/'])
    .pipe(prune('dist/')) 
    .pipe(newer('dist/'))   
    .pipe(gulp.dest('dist'))
    
    
}); 

gulp.task('sass', function () {
  return gulp.src('src/assets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/assets/'))
});

gulp.task('mini', ['sass'], function () {
    gulp.src('src/assets/styles/sass/*.css')
    .pipe(mini())
    .pipe(gulp.dest('src/assets/styles/css'))
});

gulp.task('default', function () {
    livereload({ start: true })
    livereload.listen()
    gulp.watch('src/**/*', ['copy', 'prune', 'sass', 'mini']); 
});

gulp.task('modules', function(callback) {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-route/angular-route.js',
      'node_modules/angularfire/dist/angularfire.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/materialize-css/dist/js/materialize.js'
    ])
      .pipe(sourcemaps.init())
      .pipe(concat('modules.js'))
      .pipe(uglify('modules.js'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('src/modules'))

});