import Ember from 'ember';

export default Ember.Route.extend({
  searchResult: null,
  apiResponse: null,
  getData: function (options) {
    options = options || {};
    var term = options.term ? options.term : $('.js-search').val();
    var queryString = [];
    var resourceTypes = [];

    if (options.images) { resourceTypes.push('images'); }
    if (options.videos) { resourceTypes.push('videos'); }
    if (options.audios) { resourceTypes.push('audios'); }
    if (options.documents) { resourceTypes.push('articles'); }

    if (options.images_per_page || 8) { queryString.push('images_per_page=' + options.images_per_page || 8); }
    if (options.videos_per_page || 8) { queryString.push('videos_per_page=' + options.videos_per_page || 8); }
    if (options.audios_per_page || 8) { queryString.push('audios_per_page=' + options.audios_per_page || 8); }
    if (options.articles_per_page || 8) { queryString.push('articles_per_page=' + options.articles_per_page || 8); }

    if (options.images_page) { queryString.push('images_page=' + options.images_page); }
    if (options.videos_page) { queryString.push('videos_page=' + options.videos_page); }
    if (options.audios_page) { queryString.push('audios_page=' + options.audios_page); }
    if (options.documents_page) { queryString.push('articles_page=' + options.documents_page); }

    queryString.push('q=' + term);
    queryString.push('t=' + resourceTypes.join(','));

    var url = 'http://localhost:3000/search_results.json?' + queryString.join('&');

    return Ember.$.getJSON(url, function(response) {
      return response;
    });
  },
  renderResponse: function (response, self) {
    self.apiResponse = response;
    self.searchResult = self.store.createRecord('search-result');
    self.searchResult.set('searchTerm', term);
    self.searchResult.set('filters', response.filters);

    self.controllerFor('index').set('model', self.searchResult);

    if (response.images) { self.renderResourceType('images', response.images); }
    if (response.videos) { self.renderResourceType('videos', response.videos); }
    if (response.audios) { self.renderResourceType('audios', response.audios); }
    if (response.documents) { self.renderResourceType('documents', response.articles); }
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
      var self = this;

      this.getData({
        'images': true,
        'videos': true,
        'audios': true,
        'documents': true
      }).then(function(response) {
        self.renderResponse(response, self);
      });
    },
    next: function () {
      var self = this;
      this.getData({ 'images': true, 'images_page': this.getPageIndex('images', +1) })
          .then(function(response) {
            self.renderResponse(response, self);
          });
    },
    prev: function () {
      var self = this;
      this.getData({ 'images': true, 'images_page': this.getPageIndex('images', -1) })
          .then(function(response) {
            self.renderResponse(response, self);
          });
    },
    next_videos: function () {
      var self = this;
      this.getData({ 'videos': true, 'videos_page': this.getPageIndex('videos', +1) })
          .then(function(response) {
            self.renderResponse(response, self);
          });
    },
    prev_videos: function () {
      var self = this;
      this.getData({ 'videos': true, 'videos_page': this.getPageIndex('videos', -1) })
          .then(function(response) {
            self.renderResponse(response, self);
          });
    },
    next_audios: function () {
      var self = this;
      this.getData({ 'audios': true, 'audios_page': this.getPageIndex('audios', +1) })
          .then(function(response) {
            self.renderResponse(response, self);
          });
    },
    prev_audios: function () {
      var self = this;
      this.getData({ 'audios': true, 'audios_page': this.getPageIndex('audios', -1) })
          .then(function(response) {
            self.renderResponse(response, self);
          });
    },
    next_documents: function () {
      var self = this;
      this.getData({ 'documents': true, 'documents_page': this.getPageIndex('documents', +1) })
          .then(function(response) {
            self.renderResponse(response, self);
          });
    },
    prev_documents: function () {
      var self = this;
      this.getData({ 'documents': true, 'documents_page': this.getPageIndex('documents', -1) })
          .then(function(response) {
            self.renderResponse(response, self);
          });
    }
  }

});