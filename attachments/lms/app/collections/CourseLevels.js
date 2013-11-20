$(function() {

  App.Collections.CourseLevels = Backbone.Collection.extend({

    url: function() {
      var url = App.Server + '/coursestep/_design/bell/_view/GroupData?key="' + this.groupId + '"&include_docs=true'
      return url
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.CourseStep,

  })

})
