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

    var resourceTypes = [];
    if (options.images) resourceTypes.push('images');
    if (options.videos) resourceTypes.push('videos');
    if (options.audios) resourceTypes.push('audios');
    if (options.documents) resourceTypes.push('articles');

    var queryString = ['q=' + term, 't=' + resourceTypes.join(',')];
    queryString.push('images_per_page=8');
    queryString.push('videos_per_page=8');
    queryString.push('audios_per_page=8');
    queryString.push('articles_per_page=8');
    if (options.images_page) queryString.push('images_page=' + options.images_page);
    if (options.videos_page) queryString.push('videos_page=' + options.videos_page);
    if (options.audios_page) queryString.push('audios_page=' + options.audios_page);
    if (options.documents_page) queryString.push('articles_page=' + options.documents_page);

    var url = 'http://localhost:3000/search_results.json?' + queryString.join('&');

    Ember.$.getJSON(url, function(res) {

      var searchResult = _this.store.createRecord('search-result');

      searchResult.set('searchTerm', term);
      searchResult.set('filters', res.filters);

      _this.controllerFor('index').set('model', searchResult);

      if (options.images) {
        searchResult.set('images', res.images);
        _this.controllerFor('images').set('model', searchResult.images);
        _this.render('images', {
          into: 'index',
          outlet: 'images'
        });
      }
      if (options.videos) {
        searchResult.set('videos', res.videos);
        _this.controllerFor('videos').set('model', searchResult.videos);
        _this.render('videos', {
          into: 'index',
          outlet: 'videos'
        });
      }
      if (options.audios) {
        searchResult.set('audios', res.audios);
        _this.controllerFor('audios').set('model', searchResult.audios);
        _this.render('audios', {
          into: 'index',
          outlet: 'audios'
        });
      }
      if (options.documents) {
        searchResult.set('documents', res.articles);
        _this.controllerFor('documents').set('model', searchResult.documents);
        _this.render('documents', {
          into: 'index',
          outlet: 'documents'
        });
      }
    });
  },
  getPageIndex: function (controller, skipTo) {
    return parseInt(this.controllerFor(controller).get('model').current_page) + skipTo;
  },
  actions: {
    search: function () {
      this.getData({
        'images': true,
        'videos': true,
        'audios': true,
        'documents': true
      });
    },
    next: function () {
      this.getData({ 'images': true, 'images_page': this.getPageIndex('images', +1) });
    },
    prev: function () {
      this.getData({ 'images': true, 'images_page': this.getPageIndex('images', -1) });
    },
    next_videos: function () {
      this.getData({ 'videos': true, 'videos_page': this.getPageIndex('videos', +1) });
    },
    prev_videos: function () {
      this.getData({ 'videos': true, 'videos_page': this.getPageIndex('videos', -1) });
    },
    next_audios: function () {
      this.getData({ 'audios': true, 'audios_page': this.getPageIndex('audios', +1) });
    },
    prev_audios: function () {
      this.getData({ 'audios': true, 'audios_page': this.getPageIndex('audios', -1) });
    },
    next_documents: function () {
      this.getData({ 'documents': true, 'documents_page': this.getPageIndex('documents', +1) });
    },
    prev_documents: function () {
      this.getData({ 'documents': true, 'documents_page': this.getPageIndex('documents', -1) });
    }
  }

});