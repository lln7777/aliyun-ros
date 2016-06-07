var clean, coffee, distPath, gulp, srcPath, testPath;

gulp = require('gulp');

coffee = require("gulp-coffee");

clean = require("gulp-clean");

distPath = './dist/';

srcPath = './src/';

testPath = './test/'

gulp.task('clean', function() {
  return gulp.src(distPath).pipe(clean());
});

gulp.task('copy', ['clean'], function() {
  return gulp.src(["./LICENSE", "./*.json", "./*.md", srcPath + "**/*.json", srcPath + "**/*.md", srcPath + "**/*.yaml"]).pipe(gulp.dest(distPath));
});

gulp.task('coffee', ['clean'], function() {
  gulp.src([srcPath + "**/*.coffee"]).pipe(coffee({
    bare: true
  })).pipe(gulp.dest(distPath));
  gulp.src([testPath + "**/*.coffee"]).pipe(coffee({
    bare: true
  })).pipe(gulp.dest('./test/'));
});

gulp.task('default', ['copy', 'coffee']);