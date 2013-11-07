$(function() {

  App.Models.Resource = Backbone.Model.extend({

    idAttribute: "_id",
    rid:null,
    
    url: function() {
      return App.Server + '/resources/_design/bell/_view/ResourceById?include_docs=true&key="'+this.rid+'"'
    },
    SetRid: function(r){
        this.rid = r
    },
    defaults: {
      kind: 'Resource'
    },
})
  
})
