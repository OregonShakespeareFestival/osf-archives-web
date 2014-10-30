import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
      Ember.run.scheduleOnce('afterRender', function () {
        Ember.run.later(function() {
          new CBPGridGallery( document.getElementById( 'grid-gallery' ) );
        }, 4000);
      });
  }
});