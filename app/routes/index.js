import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function (controller, model) {
    this.controllerFor('index').set('model', null);
    this.controllerFor('images').set('model', null);
    this.controllerFor('videos').set('model', null);
    this.controllerFor('audios').set('model', null);
    this.controllerFor('documents').set('model', null);
  },
  getData: function (options) {
    options = options || {};
    var _this = this;
    var term = $('.js-search').val();

    var queryString = ['q=' + term];
    if (options.images_page)
      queryString.push('images_page=' + options.images_page);
    var url = 'http://localhost:3000/search_results.json?' + queryString.join('&');

    Ember.$.getJSON(url, function(res) {

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
  },
  getPageIndex: function (controller, skipTo) {
    return parseInt(this.controllerFor(controller).get('model').current_page) + skipTo;
  },
  actions: {
    search: function () {
      this.getData();
    },
    next: function () {
      this.getData({ 'images_page': this.getPageIndex('images', +1) });
    },
    prev: function () {
      this.getData({ 'images_page': this.getPageIndex('images', -1) });
    }
  }

});