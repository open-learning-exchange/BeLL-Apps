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
       	Name: {	type:'Text',
       			validators: ['required']
       		  },
        Url: {	type:'Text',
       			validators: ['required']
       		  },
       SponserName: {	type:'Text',
       			validators: ['required']
       		  },
        SponerAddress: {	type:'Text',
       			validators: ['required']
       		  },
       
        ContactFirstname: {	type:'Text',
       			validators: ['required']
       		  },
        ContactMiddlename: {	type:'Text',
       			validators: ['required']
       		  },
        ContactLastname: {	type:'Text',
       			validators: ['required']
       		  },
        ContactPhone: {	type:'Text',
       			validators: ['required']
       		  },
        ContactEmail: {	type:'Text',
       			validators: ['required']
       		  },
        SuperManagerFirstname: {	type:'Text',
       			validators: ['required']
       		  },
       	SuperManagerMiddlename: {	type:'Text',
       			validators: ['required']
       		  },	  
       	SuperManagerLastname: {	type:'Text',
       			validators: ['required']
       		  },	  
       	SuperManagerPhone: {	type:'Text',
       			validators: ['required']
       		  },	  
       	SuperManagerEmail: {	type:'Text',
       			validators: ['required']
       		  },	  
       	LeaderId: {	type:'Text',
       			validators: ['required']
       		  },	  	  
        LeaderPassword: {	type:'Text',
       			validators: ['required']
       		  },
       	UrgentName: {	type:'Text',
       			validators: ['required']
       		  },
        UrgentPhone: {	type:'Text',
       			validators: ['required']
       		  },
       	AuthName: {	type:'Text',
       			validators: ['required']
       		  },
        AuthDate: {	type:'Text',
       			validators: ['required']
       		  },	  	  
       		  	  
    },

  }) 

})
