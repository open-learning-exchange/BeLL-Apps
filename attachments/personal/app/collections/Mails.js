$(function() {

  App.Collections.Mails = Backbone.Collection.extend({

	initialize: function(e){
		if(e){
			if(e.senderId){
				this.url= App.Server + '/mail/_design/bell/_view/sentbox?include_docs=true&key="'+e.senderId+'"&limit=2&skip='+e.skip
			}
			else if(e.receiverId){
				this.url= App.Server + '/mail/_design/bell/_view/inbox?include_docs=true&key="'+e.receiverId+'"&limit=2&skip='+e.skip
			}
			else{
				this.url= App.Server + '/mail/_all_docs?include_docs=true&limit=2&skip='+e.skip
			}
		}
		else{
			this.url= App.Server + '/mail/_all_docs?include_docs=true&limit=2&skip='+e.skip
		}
	},
	
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.Mail


  })

})
