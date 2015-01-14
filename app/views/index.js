import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },
  afterRenderEvent : function(){
    var that = this;
    $('.js-year-range').ionRangeSlider({
      type: "double",
      min: this.get('controller.minYear'),
      max: this.get('controller.maxYear'),
      hide_min_max: true,
      step: 1,
      onFinish: function () {
        that.set('target', that.controller.get('target'));
        that.send('search');
      }
    });

    this.set('target', this.controller.get('target'));
    this.send('search', true);
  }
});
