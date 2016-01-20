var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

var entryFile = './src/js/index.js',
    outputFile = 'build-js.js',
    jsBuidDir = './dist/scripts',
    HTMLBuildDir = './dist';


gulp.task('connect', function() {
    connect.server({
        base: 'http://localhost',
        port: 9000,
        root: './dist',
        livereload: true
    });
});

gulp.task('js', function() {
    browserify(entryFile)
        .transform(
            babelify, 
            {presets: ["es2015", "stage-0"]}
        )
        .bundle()
        .on('error', function(err) {
            console.log('Error: ' + err.message);
        })
        .pipe( source( outputFile ))
        .pipe( gulp.dest( jsBuidDir ))
        .pipe( connect.reload() );
});

gulp.task('html', function() {
    gulp.src('./src/html/*.html')
        .on('error', function(err) {
            console.log('Error: ' + err.message);
        })
        .pipe( gulp.dest( HTMLBuildDir ))
        .pipe( connect.reload() );
});

gulp.task('watch', function() {
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/html/*.html', ['html']);
});

gulp.task('default', ['js', 'html', 'connect', 'watch']);