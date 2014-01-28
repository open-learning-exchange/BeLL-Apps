$(function() {

  App.Collections.shelfResource = Backbone.Collection.extend({
  
  
 url:function()
    {
        if(this.deleteResource==1)
  		{
  			return App.Server + '/shelf/_design/bell/_view/getShelfItemWithResourceId?key="' +this.resourceId+ '"&include_docs=true'
  		}
  		else
  		{
       		return App.Server + '/shelf/_design/bell/_view/getResource?key=["'+this.memberId+'","'+this.resourceId+'"]&include_docs=true'
  		}
   
   },
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
    model: App.Models.Shelf,
    

  })

})
