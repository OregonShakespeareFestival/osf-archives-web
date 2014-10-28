import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    search: function () {
      var term = $('.js-search').val();
      var _this = this;
      Ember.$.getJSON('http://localhost:3000/search_results.json?q=' + term, function(res) {
        _this.controllerFor('index').set('model', res);
      });
    }
  }

});