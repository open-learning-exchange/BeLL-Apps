$(function() {

  App.Collections.coursesteps = Backbone.Collection.extend({

    url: function() {
      if (this.getAll) {
        return App.Server + '/coursestep/_all_docs?include_docs=true'
      } else {
        return App.Server + '/coursestep/_design/bell/_view/StepsData?key="' + this.courseId + '"&include_docs=true'
      }
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
    comparator: function(m) {
      return m.get('step')
    },
    model: App.Models.CourseStep

  })

})