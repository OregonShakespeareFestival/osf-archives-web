import Ember from 'ember';

export default Ember.Route.extend({
  searchResult: null,
  apiResponse: null,
  getData: function (options) {
    options = options || {};
    var _this = this;
    var term = $('.js-search').val();

    var resourceTypes = [];
    if (options.images) { resourceTypes.push('images'); }
    if (options.videos) { resourceTypes.push('videos'); }
    if (options.audios) { resourceTypes.push('audios'); }
    if (options.documents) { resourceTypes.push('articles'); }

    var queryString = ['q=' + term, 't=' + resourceTypes.join(',')];
    queryString.push('images_per_page=8');
    queryString.push('videos_per_page=8');
    queryString.push('audios_per_page=8');
    queryString.push('articles_per_page=8');
    if (options.images_page) { queryString.push('images_page=' + options.images_page); }
    if (options.videos_page) { queryString.push('videos_page=' + options.videos_page); }
    if (options.audios_page) { queryString.push('audios_page=' + options.audios_page); }
    if (options.documents_page) { queryString.push('articles_page=' + options.documents_page); }

    var url = 'http://localhost:3000/search_results.json?' + queryString.join('&');

    Ember.$.getJSON(url, function(response) {
      _this.apiResponse = response;

      _this.searchResult = _this.store.createRecord('search-result');
      _this.searchResult.set('searchTerm', term);
      _this.searchResult.set('filters', response.filters);

      _this.controllerFor('index').set('model', _this.searchResult);

      if (options.images) { _this.renderResourceType('images', response.images); }
      if (options.videos) { _this.renderResourceType('videos', response.videos); }
      if (options.audios) { _this.renderResourceType('audios', response.audios); }
      if (options.documents) { _this.renderResourceType('documents', response.articles); }
    });
  },
  renderResourceType: function (resourceType, model) {
    var controller = this.controllerFor(resourceType);
    controller.set('model', model);

    // Paging
    var current_page = parseInt(controller.get('current_page'));
    var total_items = parseInt(controller.get('total_items'));
    var items_per_page = parseInt(controller.get('items_per_page'));
    var hasPreviousPage = current_page > 1;
    var hasNextPage = current_page < (Math.ceil(total_items / items_per_page));

    controller.set('hasPreviousPage', hasPreviousPage);
    controller.set('hasNextPage', hasNextPage);

    this.render(resourceType, {
      into: 'index',
      outlet: resourceType
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