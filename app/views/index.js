import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function () {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },
  afterRenderEvent : function(){
    var currentYear = new Date().getFullYear();
    var that = this;
    $('.js-year-range').ionRangeSlider({
      type: "double",
      min: 1935,
      max: currentYear,
      step: 1,
      onFinish: function () {
        that.set('target', that.controller.get('target'));
        that.send('search');
      }
    });
  }
});
