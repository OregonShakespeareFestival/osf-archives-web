import Ember from 'ember';

export default Ember.View.extend({
  modelChanged: function () {
    // Preload images
    var model = this.get('controller.model');
    if (model) {
      
      Ember.run.scheduleOnce('afterRender', this, function() {
        // TODO: Why is imagesLoaded going away?
        if (typeof(this.$()) == 'undefined') return;
        
        this.$().imagesLoaded( $.proxy(function( $images, $proper, $broken ) {
          this._preloadImages($('.card__figure__image').toArray());
        }, this));
      });
    }
  }.observes('controller.model'),
  _preloadImages: function (images) {
    if (images.length === 0) {
      return false;
    }
    var $image = $(images.pop()),
        $preload = $(new Image());
    $preload.attr('src', $image.attr('src'));
    
    $preload.on('load', function () {
      var imageRatio = this.height / this.width,
          imageClass = (imageRatio) > 1 ? 'card__figure--tall' : 'card__figure--wide';
      $image.closest('.card__figure').addClass(imageClass);

      // TODO: Fix rendering issue after filtering images
      // $('.card-grid').isotope({
      //   itemSelector: '.card-container',
      //   layoutMode: 'packery'
      // });
    });

    this._preloadImages(images);
  }
});