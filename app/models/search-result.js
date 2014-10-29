import DS from 'ember-data';

export default DS.Model.extend({
  searchTerm: DS.attr('string'),
  filters: {},
  images: {
    current_page: DS.attr('number'),
    items_per_page: DS.attr('number'),
    total_items: DS.attr('number'),
    data: []
  },
  videos: {
    current_page: DS.attr('number'),
    items_per_page: DS.attr('number'),
    total_items: DS.attr('number'),
    data: []
  },
  audios: {
    current_page: DS.attr('number'),
    items_per_page: DS.attr('number'),
    total_items: DS.attr('number'),
    data: []
  },
  documents: {
    current_page: DS.attr('number'),
    items_per_page: DS.attr('number'),
    total_items: DS.attr('number'),
    data: []
  }
});
