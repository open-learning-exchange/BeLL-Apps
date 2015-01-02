$(function() {

  App.Models.DailyLog = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/activitylog/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/activitylog/' + this.id // For READ
      }
      else {
        var url = App.Server + '/activitylog' // for CREATE
      }
      
      return url
    },
 schema: {
  "logDate": "Text",
   "female_visits": 'number',
   "male_visits": 'number',
   "resourcesIds": [],
   "female_rating": [],
   "female_timesRated": [],
   "male_rating": [],
   "male_timesRated": [],
   "resources_opened": [],
   "female_opened": [],
   "male_opened": []
    }
    
}) 

})
