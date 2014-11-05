import Ember from 'ember';

export default Ember.Route.extend({
  searchResult: null,
  apiResponse: null,

  getSearchResult: function (options) {
    var self = this;
    this.getData(options).then(function(response) {
      self.renderResponse(response, self);
    });
  },

  getData: function (options) {
    options = options || {};
    var term = options.term ? options.term : $('.js-search').val();
    var queryString = [];
    var defaultPerPage = 8;

    queryString.push('per_page=' + (options.per_page || defaultPerPage));
    queryString.push('page=' + (options.page || 1));

    queryString.push('q=' + term);
    queryString.push('t=' + options.type);

    var url = 'http://localhost:3000/search_results.json?' + queryString.join('&');

    return Ember.$.getJSON(url, function(response) {
      return response;
    });
  },

  renderResponse: function (response, self) {
    self.apiResponse = response;
    self.searchResult = self.store.createRecord('search-result');
    self.searchResult.set('searchTerm', response.query);
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
      var types = ['images', 'videos', 'audios', 'articles'];

      types.forEach( function(type) {
        self.getData({
          type: type
        }).then(function(response) {
          self.renderResponse(response, self);
        });
      });
    },

    page: function (type, skipTo) {
      this.getSearchResult({ type: type, page: this.getPageIndex(type, skipTo) });
    }
  }

});