var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  autoprefixer: {}
});

app.import(app.bowerDirectory + '/ionrangeslider/js/ion.rangeSlider.min.js')
app.import(app.bowerDirectory + '/ionrangeslider/css/ion.rangeSlider.css')
app.import(app.bowerDirectory + '/ionrangeslider/css/ion.rangeSlider.skinNice.css')


app.import('vendor/modernizr.custom.js')
app.import('vendor/imagesloaded.pkgd.min.js')
app.import('vendor/masonry.pkgd.min.js')
app.import('vendor/classie.js')
app.import('vendor/cbpGridGallery.js')
app.import('vendor/group-helper.js')
app.import('vendor/video-grid.js')
app.import('vendor/isotope.pkgd.min.js')
app.import('vendor/packery-mode.pkgd.min.js')

var ionRangeSliderImages = pickFiles(app.bowerDirectory + '/ionrangeslider/img', {
    srcDir: '/',
    destDir: '/img'
});

module.exports = mergeTrees([app.toTree(), ionRangeSliderImages]);
