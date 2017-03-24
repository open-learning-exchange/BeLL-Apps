/*
 * Takes courseId, startDate, and endDate parameters
 */
$(function() {

  App.Collections.CourseAssignmentsByDate = Backbone.Collection.extend({

    url: function() {
      // There is some way to have nicer range queries in CouchDB as hinted here -> http://stackoverflow.com/questions/3216868/querying-couchdb-documents-between-a-start-date-and-an-end-date
      // var url = App.Server + '/assignments/_design/bell/_view/CourseAssignmentsByDate?startkey=["' + this.courseId + '","' + this.startDate + '",""]&endkey=["' + this.courseId + '","\ufff0","' + this.endDate + '"]&include_docs=true'
      // Since we know the startDate and endDate days we can expect Assignments, we don't actually have to do a range for now.
      var url = App.Server + '/assignments/_design/bell/_view/CourseAssignmentsByDate?key=["' + this.courseId + '","' + this.startDate + '","' + this.endDate + '"]&include_docs=true'
      return url
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },

    model: App.Models.Assignment

  })

})