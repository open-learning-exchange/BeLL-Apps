$(function() {

  App.Collections.ActivityLog = Backbone.Collection.extend({

    url: function(){
         if(this.logDate)
           return App.Server + '/activitylog/_design/bell/_view/getdocBylogdate?include_docs=true&key="'+this.logDate+'"'
 
           return App.Server + '/activitylog/_design/bell/_view/getDocumentByDate?include_docs=true&startkey="'+this.startkey+'"&endkey="'+this.endkey+'"'
    },
    parse: function (response) {
            var docs = _.map(response.rows, function (row) {
                return row.doc
            })
            return docs
        },                                                                                     
    model: App.Models.DailyLog
    
  })

})
