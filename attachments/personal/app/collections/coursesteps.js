$(function() {

  App.Collections.coursesteps = Backbone.Collection.extend({

    url: function() {
      var url = App.Server + '/coursestep/_design/bell/_view/StepsData?key="' + this.courseId + '"&include_docs=true'
      return url
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     comparator: function(m){
     	return m.get('step')
     },
    model: App.Models.CourseStep,

  })

})
