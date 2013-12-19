$(function() {

  App.Collections.Mails = Backbone.Collection.extend({

	initialize: function(e){
		if(e){
			if(e.senderId){
				this.url= App.Server + '/mail/_design/bell/_view/sentbox?include_docs=true&key="'+e.senderId+'"'
			}
			else if(e.receiverId){
				this.url= App.Server + '/mail/_design/bell/_view/inbox?include_docs=true&key="'+e.receiverId+'"'
			}
			else{
				this.url= App.Server + '/mail/_all_docs?include_docs=true'
			}
		}
		else{
			this.url= App.Server + '/mail/_all_docs?include_docs=true'
		}
	},
	
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.Member


  })

})
