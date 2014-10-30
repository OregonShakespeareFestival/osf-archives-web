import Ember from 'ember';

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
        searchResult.set('documents', res.articles);

        _this.controllerFor('index').set('model', searchResult);
        _this.controllerFor('images').set('model', searchResult.images);
        _this.controllerFor('videos').set('model', searchResult.videos);
        _this.controllerFor('audios').set('model', searchResult.audios);
        _this.controllerFor('documents').set('model', searchResult.documents);
      });

      this.render('images', {
        into: 'index',
        outlet: 'images'
      });

      this.render('videos', {
        into: 'index',
        outlet: 'videos'
      });

      this.render('audios', {
        into: 'index',
        outlet: 'audios'
      });

      this.render('documents', {
        into: 'index',
        outlet: 'documents'
      });
    }
  }

});