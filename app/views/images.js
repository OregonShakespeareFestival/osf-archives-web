import Ember from 'ember';

export default Ember.View.extend({
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
  }.observes('controller.model')
});