const gulp            = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync     = require('browser-sync');
const del             = require('del');
const karma           = require('karma');
const argv            = require('yargs').argv;

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const KarmaServer = karma.Server;

const lintOptions = {
  rules: {
    'no-console': 1,
    'no-undef': 1,
    'no-unused-vars': 1,
    'no-extra-semi': 1
  }
};



const testLintOptions = {
  rules: {
    'no-undef': 1
  }
};



function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  }
}



// script
gulp.task('scripts', () => {
  return gulp.src('src/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: [
        ['es2015', {modules: false}]
      ]
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.dev'))
    .pipe(reload({stream: true}));
});



// script
gulp.task('scripts:test', () => {
  console.log('called to test');
  return gulp.src('test/**/*.spec.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    // .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.test'))
    .pipe(reload({stream: true}));
});

// linting
gulp.task('lint', lint('src/**/*.js', lintOptions));
gulp.task('lint:test', lint('test/specs/**/*.js', testLintOptions));



// testing
gulp.task('test', ['scripts', 'scripts:test'], (done) => {
  let server =  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done)

  server.on('run_complete', function(){
    gulp.src('test/coverage/**/coverage.json')
      .pipe($.istanbulReport())
  })

  server.start()
});



gulp.task('watch:test', function() {
  gulp.watch(['src/*.js', 'test/specs/*.js'], ['test'])
});



// clean the miss before build
gulp.task('clean', del.bind(null, ['.dev', '.test', 'dist']));



gulp.task('minify', ['scripts'], () => {
  return gulp.src('.dev/*.js')
    .pipe($.stripCode({
      start_comment: 'strip-code',
      end_comment: 'end-strip-code'
    }))
    .pipe(gulp.dest('dist'))
    .pipe($.uglify())
    .pipe($.rename((path) => {
      path.basename += '.min';
      path.extname = '.js';
    }))
    .pipe(gulp.dest('dist'));
});


function getVersionArgs(args) {
  if(args.version) {
    return $.bump({version: args.version});
  } else if(args.type) {
    return $.bump({type: args.type});
  } else {
    return $.bump();
  }
}


gulp.task('bumpversion', () => {
    gulp.src(['src/**/*.js', 'src/**/*.sass', '*.json'], {base: './'})
      .pipe(getVersionArgs(argv))
      .pipe(gulp.dest('./'));
});

gulp.task('build', ['lint', 'minify'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
