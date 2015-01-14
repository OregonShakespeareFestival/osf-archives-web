import Ember from 'ember';

export default Ember.View.extend({
  modelChanged: function () {
    var self = this;
    // Preload images
    var model = this.get('controller.model');
    if (model) {
      
      Ember.run.scheduleOnce('afterRender', this, function() {
        // TODO: Why is imagesLoaded going away?
        if (typeof(this.$()) == 'undefined') return;
        
        $('.results-section.images').attr('data-total-items', self.get('controller.totalItems'));

        this.$().imagesLoaded( $.proxy(function( $images, $proper, $broken ) {
          this._preloadImages($('.card__figure__image').toArray());
        }, this));
      });
    }
  }.observes('controller.model'),
  _preloadImages: function (images) {
    if (images.length === 0) {
      new CBPGridGallery(document.getElementById('grid-gallery'));
      return false;
    }
    var $image = $(images.pop()),
        $preload = $(new Image());
    $preload.attr('src', $image.attr('src'));
    
    $preload.on('load', function () {
      // var imageRatio = this.height / this.width,
      //     imageClass = (imageRatio) > 1 ? 'card__figure--tall' : 'card__figure--wide';

      // TODO: Fix rendering issue after filtering images
      // $('.card-grid').isotope({
      //   itemSelector: '.card-container',
      //   layoutMode: 'packery'
      // });
    });

    this._preloadImages(images);
  }
});