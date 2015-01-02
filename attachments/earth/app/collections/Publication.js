$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.Publication = Backbone.Collection.extend({
    
    model: App.Models.Publication,

    url: function() {
    if(this.getlast==true)
    {
    	return App.Server + '/publications/_changes?include_docs=true&descending=true&limit=3'
    }
    else if(this.issue)
    {
          return App.Server + '/publications/_design/bell/_view/publicationIssue?include_docs=true&key='+this.issue

    
    }
      else{
      	return App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true'
      }
      
    },
    
    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    },
    comparator: function(model) {
      var issueNo = model.get('IssueNo')
      if (issueNo) return issueNo
    }
  
  })

})