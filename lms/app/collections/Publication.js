$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.Publication = Backbone.Collection.extend({
    
    model: App.Models.Publication,

    url: function() {
    if(this.getlast==true)
    {
    	//return App.Server + '/recpublication/_changes?include_docs=true&descending=true&limit=2'
    	return App.Server + '/recpublication/_all_docs?include_docs=true'

    }
      else{
      	return App.Server + '/recpublication/_all_docs?include_docs=true'
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