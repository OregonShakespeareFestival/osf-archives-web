import Ember from 'ember';

export default Ember.View.extend({
  modelChanged: function () {
    var self = this;
    // Preload images
    var model = this.get('controller.model');
    if (model) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        $('.results-section.videos').attr('data-total-items', self.get('controller.totalItems'));
      });
    }
  }.observes('controller.model'),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', function () {
      Ember.run.later(function() {
        VideoGrid.init();
      }, 4000);
    });
  }
});
