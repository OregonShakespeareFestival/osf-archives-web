import Ember from 'ember';

export default Ember.Controller.extend({
  work: undefined,
  init: function () {
    this.getWorks();
  },
  getWorks: function () {
    var url = OsfArchivesWeb.API_HOST + '/production_credits/works.js';
    var that = this;
    
    return Ember.$.post(url, function(response) {
      that.set('works', response.works);
      return;
    });
  },
  filterByWork: function () {
    this.send('search')
  }.observes('work')

});

