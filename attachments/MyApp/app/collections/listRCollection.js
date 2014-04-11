$(function() {

  App.Collections.listRCollection = Backbone.Collection.extend({

  
	url: function() {
     
     if(this.skip==0 && this.startkey!="")
        	return App.Server + '/collectionlist/_design/bell/_view/sortCollection?include_docs=true&startkey="'+this.startkey+'"&skip='+this.skip
        
     else if(this.skip==0 && this.startkey=="")
        	return App.Server + '/collectionlist/_design/bell/_view/allrecords?include_docs=true'
        	   	
     else if(this.major==true)
        return App.Server + '/collectionlist/_design/bell/_view/majorcatagory?include_docs=true'
     
      else if(this.major==false)
          return App.Server + '/collectionlist/_design/bell/_view/subcategory?include_docs=true'
      else
         return App.Server + '/collectionlist/_design/bell/_view/allrecords?include_docs=true'
    },
    parse: function(response) {
      
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
    comparator: function(item) {
        var name=item.get("CollectionName");
        if(name) return (name.toLowerCase())
    },
    model: App.Models.CollectionList,

  })

})
