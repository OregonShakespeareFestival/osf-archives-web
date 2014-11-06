import Ember from 'ember';

export default Ember.Route.extend({
  buildSearchQuery: function(options) {
    options = options || {};

    if (!options.type) { throw new Error('Type is required.'); }

    var term = options.term ? options.term : $('.js-search').val();
    var queryString = [];
    var defaultPerPage = 8;

    queryString.push('per_page=' + (options.per_page || defaultPerPage));
    queryString.push('page=' + (options.page || 1));

    queryString.push('q=' + term);
    queryString.push('t=' + options.type);

    return 'http://localhost:3000/search_results.json?' + queryString.join('&');
  },

  bindData: function (response) {
    // Set the resource type controller's model and render into outlet.
    // Given that response.type == 'images'
    var controller = this.controllerFor(response.type);
    controller.set('model', response.data);

    // Paging
    var current_page = parseInt(controller.get('current_page'));
    var total_items = parseInt(controller.get('total_items'));
    var items_per_page = parseInt(controller.get('items_per_page'));
    var hasPreviousPage = current_page > 1;
    var hasNextPage = current_page < (Math.ceil(total_items / items_per_page));

    controller.set('hasPreviousPage', hasPreviousPage);
    controller.set('hasNextPage', hasNextPage);
  },

  getData: function (options) {
    return Ember.$.getJSON(this.buildSearchQuery(options), function(response) {
      return response;
    });
  },

  getPageIndex: function (controller, skipTo) {
    return parseInt(this.controllerFor(controller).get('model').current_page) + skipTo;
  },

  actions: {
    search: function () {
      var self = this;
      var types = [];
      $.each($('.js-filters .active'), function (){
        types.push($(this).attr('data-type'));
      });

      types.forEach( function(type) {
        self.getData({ type: type }).then(function(response) {
          self.bindData(response);
          self.render(type, { into: 'index', outlet: type });
        });
      });
    },

    page: function (type, skipTo) {
      var self = this;
      self.getData({ type: type, page: this.getPageIndex(type, skipTo) }).then(function(response) {
        self.bindData(response);
        self.render(type, { into: 'index', outlet: type });
      });
    },

    filter: function (type) {
      var self = this;
      var $filter = $('.js-filters [data-type=' + type + ']');
      $filter.toggleClass('active');

      // after a search just show hide container
      // TODO: Refactor this
      if ($filter.hasClass('active')) {
        if ($('section.' + type).length > 0) {
          $('section.' + type).show();
        }
        else {
          self.getData({ type: type }).then(function(response) {
            self.bindData(response);
            self.render(type, { into: 'index', outlet: type });
          });
        }
      } else {
        $('section.' + type).hide();
      }
    }
  }

});