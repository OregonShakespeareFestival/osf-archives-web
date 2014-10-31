import DS from 'ember-data';

export default DS.Model.extend({
  searchTerm: DS.attr('string'),
  filters: {}
});
