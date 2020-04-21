"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require('del');
var tap = require("gulp-tap");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var beautify = require("posthtml-beautify");
var csso = require('gulp-csso');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var jsImport = require('gulp-js-import');
var rename = require("gulp-rename");
var webp = require('gulp-webp');
var imagemin = require('gulp-imagemin');
var svgstore = require('gulp-svgstore');
var spritesmith = require('gulp.spritesmith');
var buffer = require('vinyl-buffer');
var validate = require('gulp-html-validate');
var ghpages = require('gh-pages');
var env = process.env.NODE_ENV || "dev";
var isProd = env === "prod" ? true : false;
var paths = {
  src: {
    css: "source/sass/style.scss",
    html: "source/html/*.html",
    js: "source/js/main.js",
    cwebp: [
      "source/img/*.{jpg,png}",
      "!source/img/sprite@*.png",
      "!source/img/advantage-*.png"
    ],
    fonts: "source/fonts/**",
    imgs: [
      "source/img/**",
      "!source/img/sprite@*.png",
      "!source/img/advantage-*.png",
      "!source/img/*.webp",
      "!source/img/icon-*.svg",
      "!source/img/sprite.svg"
    ],
    svg: "source/img/icon-*.svg",
    png: "source/img/advantage-*.png",
  },
  build: {
    fonts: "build/fonts",
    imgs: "build/img",
    html: "build",
    js: "build/js/",
    cwebp: "build/img",
    imgs: "build/img",
    svg: "build/img",
    png: "build/img",
    css: "build/css/",
  },
  dest: {
    css: "source/css",
    html: "source/",
    js: "source/js/",
    cwebp: "source/img",
    svg: "source/img",
    png: "source/img",
  },
  watch: {
    css: "source/sass/**/*.scss",
    html: "source/html/**/*.html",
    js: "source/js/main.js",
    cwebp: "source/img/*.{jpg,png}",
    svg: "source/img/icon-*.svg",
    png: "source/img/advantage-*.png",
  }
}

gulp.task("delBuild", function () {
  return del("./build");
});

gulp.task("delWebp", function () {
  return del("source/img/*.webp");
});

gulp.task("delTempDev", function () {
  return del([
    "source/*.html",
    "source/js/script.js",
    "source/js/script.js.map",
    "source/img/sprite.svg",
    "source/img/sprite@1x.png",
    "source/img/sprite@2x.png",
    "source/img/*.webp",
  ]);
});

gulp.task("css", function () {
  return gulp.src(paths.src.css)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulpif(isProd, csso()))
    .pipe(sourcemap.write("."))
    .pipe(gulpif(isProd, gulp.dest(paths.build.css)))
    .pipe(gulpif(!isProd, gulp.dest(paths.dest.css)))
    .pipe(server.stream());
});

gulp.task("html", function () {
  let path = './source/html/includes';

  var configInclude = {
    root: `${path}`,
    encoding: 'utf8',
  };
  var configBeautify = {
    rules: {
      indent: 2,
      blankLines: false,
    },
  };

  var plugins = [
    include(configInclude),
    beautify(configBeautify)
  ];
  var options = {};

  return gulp.src(paths.src.html)
    .pipe(plumber())
    .pipe(tap((file) => (path = file.path)))
    .pipe(posthtml(plugins, options))
    .pipe(gulpif(isProd, gulp.dest(paths.build.html)))
    .pipe(gulpif(!isProd, gulp.dest(paths.dest.html)))
    .pipe(validate())
    .pipe(server.stream());
});

gulp.task("js", function () {
  return gulp.src(paths.src.js)
    .pipe(plumber())
    .pipe(jsImport())
    .pipe(rename("script.js"))
    .pipe(sourcemap.init())
    .pipe(gulpif(isProd, uglify()))
    .pipe(sourcemap.write("."))
    .pipe(gulpif(isProd, gulp.dest(paths.build.js)))
    .pipe(gulpif(!isProd, gulp.dest(paths.dest.js)))
    .pipe(server.stream());
});

gulp.task("cWebp", function () {
  return gulp.src(paths.src.cwebp)
    .pipe(webp({ quality: 75 }))
    .pipe(gulpif(isProd, gulp.dest(paths.build.cwebp)))
    .pipe(gulpif(!isProd, gulp.dest(paths.dest.cwebp)))
    .pipe(server.stream());
});

gulp.task("copyFonts", function () {
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.build.fonts))
});

gulp.task("copyImgs", function () {
  return gulp.src(paths.src.imgs)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(paths.build.imgs))
});

gulp.task("spriteSvg", function () {
  return gulp.src(paths.src.svg)
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulpif(isProd, gulp.dest(paths.build.svg)))
    .pipe(gulpif(!isProd, gulp.dest(paths.dest.svg)))
    .pipe(server.stream());
});

gulp.task("spritePng", function () {
  var fileNameSprite = 'sprite@1x.png';
  var fileNameSprite2x = 'sprite@2x.png';

  var spriteData = gulp.src(paths.src.png)
    .pipe(plumber())
    .pipe(
      spritesmith({
        algorithm: "left-right",
        retinaSrcFilter: 'source/img/advantage-*@2x.png',
        imgName: fileNameSprite,
        retinaImgName: fileNameSprite2x,
        // .css, .sass, .scss, .less, .styl/.stylus
        // cssFormat: 'scss', // с этой переменной нет ретины
        cssName: 'sprite.scss',
        padding: 5,
        imgPath: '../img/' + fileNameSprite,
        retinaImgPath: '../img/' + fileNameSprite2x
      })
    )

  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 5 })
    ]))
    .pipe(gulpif(isProd, gulp.dest(paths.build.png)))
    .pipe(gulpif(!isProd, gulp.dest(paths.dest.png)))
    .pipe(server.stream());

  return imgStream;
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(paths.watch.css, gulp.series("css"));
  gulp.watch(paths.watch.html, gulp.series("html"));
  gulp.watch(paths.watch.js, gulp.series("js"));
  gulp.watch(paths.watch.cwebp, gulp.series("delWebp", "cWebp"));
  gulp.watch(paths.watch.svg, gulp.series("spriteSvg"));
  gulp.watch(paths.watch.png, gulp.series("spritePng"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("first", gulp.series("spriteSvg", "spritePng", "cWebp", "css", "js", "html"));
gulp.task("start", gulp.series(gulp.parallel("delTempDev", "delWebp"), "first", "server"));
gulp.task("prod", gulp.series("delBuild", "first", "copyFonts", "copyImgs"));
ghpages.publish("build");
