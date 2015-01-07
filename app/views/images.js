import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },
  afterRenderEvent : function(){
    this._preloadImages($('.card__figure__image').toArray());
  },
  modelChanged: function () {
    // Preload images
    var model = this.get('controller.model');
    if (model) {
      // TODO: Preload Refactor
      // for (var i=0; i<model.data.length; i++) {
      //   (new Image()).src = 'http://localhost:3000' + model.data[i].url;
      // }

      Ember.run.scheduleOnce('afterRender', function () {
        Ember.run.later(function() {
          new CBPGridGallery( document.getElementById( 'grid-gallery' ) );
        }, 4000);
      });
    }
  }.observes('controller.model'),
  _preloadImages: function (images) {
    var $image = $(images.pop()),
        $preload = $(new Image());
    $preload.attr('src', $image.attr('src'));
    
    $preload.on('load', function () {
      var imageRatio = this.height / this.width,
          imageClass = (imageRatio) > 1 ? 'card__figure--tall' : 'card__figure--wide';
      $image.closest('.card__figure').addClass(imageClass);

      $('.card-grid').isotope({
        itemSelector: '.card-container',
        layoutMode: 'packery'
      });
    });

    if (images.length > 0){
      this._preloadImages(images);
    }
  }
});