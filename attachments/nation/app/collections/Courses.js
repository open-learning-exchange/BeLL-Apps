$(function() {

  App.Collections.Courses = Backbone.Collection.extend({
    
    model: App.Models.Group,
    url: function () {
              if(this.seachText)
    			return App.Server + '/groups/_design/bell/_view/courseSearch?include_docs=true&key=' + this.seachText
    		  else if(this.keys!=undefined)
    		    return App.Server + '/groups/_all_docs?include_docs=true&keys=[' + this.keys + ']'
    		  else	
    		    return App.Server + '/groups/_all_docs?include_docs=true&limit=20'
   
    },
    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    },
    
    comparator: function(model) {
      var title = model.get('CourseTitle')
      if (title) return title.toLowerCase()
    }
  
  })

})