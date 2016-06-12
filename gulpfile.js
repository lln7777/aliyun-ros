var gulp = require('gulp');
var coffee = require("gulp-coffee");
var clean = require("gulp-clean");
var watch = require('gulp-watch');
var distPath = './dist/';
var srcPath = './src/';
var testPath = './test/';

function c2j() {
  gulp.src([srcPath + "**/*.coffee"]).pipe(coffee({
    bare: true
  })).pipe(gulp.dest(distPath));
  gulp.src([testPath + "**/*.coffee"]).pipe(coffee({
    bare: true
  })).pipe(gulp.dest('./test/'));
}

gulp.task('clean', function() {
  return gulp.src(distPath).pipe(clean());
});

gulp.task('copy', ['clean'], function() {
  return gulp.src(["./LICENSE", "./*.json", "./*.md", srcPath + "**/*.json", srcPath + "**/*.md", srcPath + "**/*.yaml"]).pipe(gulp.dest(distPath));
});

gulp.task('coffee', ['clean'], c2j);

gulp.task('default', ['copy', 'coffee']);

gulp.task('watch', function(){
  watch("**/*.coffee", {cwd:srcPath}, c2j);
});
