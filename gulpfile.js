var clean, coffee, distPath, gulp, srcPath;

gulp = require('gulp');

coffee = require("gulp-coffee");

clean = require("gulp-clean");

distPath = './dist/';

srcPath = './src/';

gulp.task('clean', function() {
  return gulp.src(distPath).pipe(clean());
});

gulp.task('copy', ['clean'], function() {
  return gulp.src(["./LICENSE", "./*.json", "./*.md", srcPath + "**/*.json", srcPath + "**/*.md", srcPath + "**/*.yaml"]).pipe(gulp.dest(distPath));
});

gulp.task('coffee', ['clean'], function() {
  return gulp.src([srcPath + "**/*.coffee"]).pipe(coffee({
    bare: true
  })).pipe(gulp.dest(distPath));
});

gulp.task('default', ['copy', 'coffee']);