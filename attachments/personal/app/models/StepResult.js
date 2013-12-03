$(function() {

  App.Models.StepResult = Backbone.Model.extend({
  
  idAttribute: "_id",
  url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/stepresults/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/stepresults/' + this.id // For READ
      }
      else {
        var url = App.Server + '/stepresults' // for CREATE
      }
      return url
    },
 defaults: {
      kind: "stepresult"
    },
    
  schema: {
      courseId  :'Text',
      stepId   :  'Text',
      memberId : 'Text',
      status   : 'Text',
    }  

}) 

})
