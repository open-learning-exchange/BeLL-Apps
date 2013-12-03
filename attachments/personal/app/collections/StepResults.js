$(function() {

  App.Collections.StepResults = Backbone.Collection.extend({

    url: function() {
      var url = App.Server + '/stepresults/_design/bell/_view/GetMemberLevels?key="' +$.cookie('Member._id') + '"&include_docs=true'
      return url
    },

    parse: function(results) {
      var m = []
      var i 
      for(i = 0 ; i< results.rows.length ; i++)
      {   
        if(results.rows[i].doc.courseId == this.courseId && results.rows[i].doc.stepId == this.stepId){
          m.push(results.rows[i].doc)
        }
      }
      return m
    },
     
    model: App.Models.StepResult,

  })

})
