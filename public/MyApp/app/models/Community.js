$(function() {

  App.Models.Community = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/community/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/community/' + this.id // For READ
     
      }
      else {
        var url = App.Server + '/community' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Community"
    },

    schema: {
    
   community_code: {	type:'Text',
       					validators: ['required']
       				  },
       	nationName: {	type:'Text',
       					validators: ['required']
       		  },
        nationUrl: {	type:'Text',
       					validators: ['required']
       		  },
       
    },

  }) 

})
