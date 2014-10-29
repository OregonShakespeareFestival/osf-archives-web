import Ember from 'ember';
import SearchResult from '../models/search-result';

export default Ember.Route.extend({
  actions: {
    search: function () {
      var term = $('.js-search').val();
      var _this = this;
      Ember.$.getJSON('http://localhost:3000/search_results.json?q=' + term, function(res) {
        var searchResult = _this.store.createRecord('search-result');
        searchResult.set('searchTerm', term);
        searchResult.set('filters', res.filters);
        searchResult.set('images', res.images);
        searchResult.set('videos', res.videos);
        searchResult.set('audios', res.audios);
        searchResult.set('documents', res.documents);
        _this.controllerFor('index').set('model', searchResult);
      });
    }
  }

});