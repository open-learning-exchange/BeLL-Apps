$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.Resources = Backbone.Collection.extend({
    
    model: App.Models.Resource,
    url: function () { 
    	if(this.collectionName)
    	{
    		//return App.Server + '/resources/_design/bell/_view/listCollection?include_docs=true&key="' + this.collectionName + '"'
    		if(this.skip>=0)
    		{
    			return App.Server + '/resources/_design/bell/_view/listCollection?include_docs=true&limit=20&skip='+this.skip +'&keys=' + this.collectionName 
    		}
    		else
    		{
    			return App.Server + '/resources/_design/bell/_view/listCollection?include_docs=true&keys=' + this.collectionName
    		}
    	}
    	else if(this.skip>=0)
    	{
    		//return App.Server + '/resources/_all_docs?include_docs=true&limit=20&skip='+this.skip 
    		if(this.startkey && this.startkey!="")
    		{
    		//alert('result resource')
    			return App.Server + '/resources/_design/bell/_view/sortresources?include_docs=true&startkey="'+this.startkey+'"&limit=20&skip='+this.skip
    		}
    		else
    		{
    			return App.Server + '/resources/_design/bell/_view/sortresources?include_docs=true&limit=20&skip='+this.skip
    		}
    	}
    	else if(this.title)
    		{
    			return App.Server + '/resources/_design/bell/_view/resourceOnTtile?include_docs=true&key="' + this.title +'"'
    			//return App.Server + '/shelf/_design/bell/_view/getShelfItemWithResourceId?key="' +this.resourceId+ '"&include_docs=true'
    		}
    	else
    	{
    		return App.Server + '/resources/_all_docs?include_docs=true'
    	}
    },
    initialize: function (a) {
  		
    	if (a && a.collectionName)
    	{
    		this.collectionName = a.collectionName 
        }
        else if(a && a.skip>=0)
        {
        	this.skip = a.skip 
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
      var title = model.get('title')
      if (title) return title.toLowerCase()
    }
  
  })

})