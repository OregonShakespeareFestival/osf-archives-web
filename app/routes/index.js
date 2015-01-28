import Ember from 'ember';

export default Ember.Route.extend({
  defaultPerPage: 8,
  buildSearchQuery: function(options) {
    options = options || {};
    
    if (!options.type) { throw new Error('Type is required.'); }

    var term = options.term ? options.term : $('.js-search').val();
    var filters = this.activeFilters();

    var queryString = [];
    queryString.push('per_page=' + (options.per_page || this.defaultPerPage));
    queryString.push('page=' + (options.page || 1));

    queryString.push('q=' + term);
    queryString.push('t=' + options.type);
    queryString.push($.param({filters:filters}));

    return OsfArchivesWeb.API_HOST + '/search_results.json?' + queryString.join('&');
  },

  bindData: function (response, loadMore) {
    // Set the resource type controller's model and render into outlet.
    // Given that response.type == 'images'
    loadMore = loadMore || false;
    var controller = this.controllerFor(response.type);
    var responseModel = response.data;
    var currentModel = controller.get('model');

    if (loadMore && currentModel) {
      responseModel.data = currentModel.data.concat(responseModel.data);
    }
    controller.set('model', responseModel);

    // Paging
    var current_page = parseInt(controller.get('current_page'));
    var total_items = parseInt(controller.get('total_items'));
    var items_per_page = parseInt(controller.get('items_per_page'));
    var hasPreviousPage = current_page > 1;
    var hasNextPage = current_page < (Math.ceil(total_items / items_per_page));

    controller.set('hasPreviousPage', hasPreviousPage);
    controller.set('hasNextPage', hasNextPage);
    controller.set('totalItems', isNaN(total_items) ? 0 : total_items);
  },

  getData: function (options) {
    return Ember.$.post(this.buildSearchQuery(options), function(response) {
      return response;
    });
  },

  getPageIndex: function (controller, skipTo) {
    return parseInt(this.controllerFor(controller).get('model').current_page) + skipTo;
  },

  activeTypes: function() {
    var types = [];
    $.each($('.filter-types .active'), function (){
      var options = { type: $(this).attr('data-type') };
      if ($(this).attr('data-per-page')) {
        options.per_page = $(this).attr('data-per-page');
      }
      types.push(options);
    });
    return types;
  },

  activeFilters: function() {
    var self = this;
    var filters = {};
    $.extend(filters, self.yearFilter(), self.venueFilter(), self.workFilter());
    return filters;
  },

  yearFilter: function () {
    var range = $('.js-year-range').val().split(';');
    var startYear = range[0];
    var endYear = range[1];
    var indexController = this.controllerFor('index');
    var minYear = indexController.get('minYear').toString();
    var maxYear = indexController.get('maxYear').toString();

    if (startYear === minYear && endYear === maxYear) { return; }
    
    var filter;
    if (startYear === endYear) {
      filter = { year:(startYear) };
    } else {
      filter = { years:[startYear, endYear] };
    }

    return filter;
  },

  venueFilter: function () {
    var venueCount = $('.filter-venues .js-filters li ').length;
    var activeVenues = $('.filter-venues .js-filters li .active');
    var venues;

    if (activeVenues.length < venueCount) {

      venues = $.map($('.filter-venues .js-filters li .active'), function(venue){
        return $(venue).attr('data-type');
      });
      return {venues:venues};
    }
  },

  workFilter: function () {
    var work = $('select.works-list').val();
    if (work !== "") {
      return {work:work};
    }
  },

  doSearch: function (getFeaturedData) {
    var self = this;

    self.activeTypes().forEach( function(options) {
      if (getFeaturedData)
        options.term = 'featured';
      self.getData(options).then(function(response) {
        self.bindData(response);
        self.render(options.type, { into: 'index', outlet: options.type });
      });
    });
  },

  actions: {
    search: function (getFeaturedData) {
      this.doSearch(getFeaturedData);
    },

    page: function (type, skipTo) {
      var self = this;
      self.getData({ type: type, page: this.getPageIndex(type, skipTo) }).then(function(response) {
        self.bindData(response, true);
        self.render(type, { into: 'index', outlet: type });
      });
    },

    filterByType: function (type) {
      var self = this;
      var $filter = $('.js-filters [data-type=' + type + ']');
      $filter.toggleClass('active');
      $('section.' + type).toggleClass('is-active');
      // after a search just show hide container
      // TODO: Refactor this
      if ($filter.hasClass('active') && $('section.' + type).length === 0) {
        self.getData({ type: type }).then(function(response) {
          self.bindData(response);
          self.render(type, { into: 'index', outlet: type });
        });
      }
    },

    filterByVenue: function (venue) {
      var self = this;
      var $filter = $('.js-filters [data-type="' + venue + '"]');
      $filter.toggleClass('active');
      self.doSearch();
    }

    
  }

});