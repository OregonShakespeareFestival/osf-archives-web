import Ember from 'ember';

export default Ember.View.extend({
  modelChanged: function () {
    var self = this;
    // Preload images
    var model = this.get('controller.model');
    if (model) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        $('.results-section.articles').attr('data-total-items', self.get('controller.totalItems'));
      });
    }
  }.observes('controller.model')
});
