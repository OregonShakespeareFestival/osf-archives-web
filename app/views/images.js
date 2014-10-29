import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
      var self = this;
      Ember.run.scheduleOnce('afterRender', function () {
        Ember.run.later(function() {
          new CBPGridGallery( document.getElementById( 'grid-gallery' ) )
        }, 2000);
      })
  }
});
