$(function() {

  App.Models.report = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/report/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/report/' + this.id // For READ
      }
      else {
        var url = App.Server + '/report' // for CREATE
      }
      
      return url
    },
	   defaults: {
      kind: "report"
    },


 schema: {
      PageUrl: 'Text',
      comment: 'TextArea',
      Resolved: 'Text',
      category: { type: 'Select', options: ['Bug' , 'Question' ,'Suggestion'] },
      priority: { type: 'Checkboxes',options: ['urgent']},
      memberLogin: 'Text',
      time: 'Text'
    }


}) 

})
