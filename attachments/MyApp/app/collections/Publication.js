$(function() {

  App.Collections.Publication = Backbone.Collection.extend({
    
    model: App.Models.Publication,
    
    url: function() {
    	var Url= this.Server + '/publications/_all_docs?include_docs=true&keys=[' + this.keys + ']'  
    	return Url
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