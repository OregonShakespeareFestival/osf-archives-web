import Ember from 'ember';

export default Ember.Controller.extend({
  minYear: 1935,
  maxYear: null,
  init: function () {
    this._super();
    this.set('maxYear', (new Date().getFullYear()));
  }
});
