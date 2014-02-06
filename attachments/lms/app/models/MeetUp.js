$(function() {

  App.Models.MeetUp = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/meetups/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/meetups/' + this.id // For READ
      }
      else {
        var url = App.Server + '/meetups' // for CREATE
      }
      
      return url
    },
    defaults: {
      kind: "Meetup"
    },


 schema: {
      title: 'Text',
      description: 'TextArea',
      schedule: 'Date',
      Time: {type:'Text',id:'ui-timepicker-input'},
      category: { type: 'Select', options: ['ICT', 'First Time' , 'Mothers' , 'General' , 'E Learning','Farming','Academic Discussion','Academic Help','Awareness'] },
      meetupLocation: 'Text',
    }
    
}) 

})
