$(function() {

  App.Collections.ScriptCollection = Backbone.Collection.extend({


	initialize: function(e){
	
	if(e.swtch==1){
	this.url=App.Server + '/membercourseprogress/_design/bell/_view/AllCourses?key="' + e.courseId+ '"&include_docs=true'
	}
	else{
	this.url=App.Server + '/'+e.db+'/_all_docs?include_docs=true'
	}
	},
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    }
     
 

  })

})
