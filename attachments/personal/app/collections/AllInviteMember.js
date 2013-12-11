$(function() {

  App.Collections.AllInviteMember = Backbone.Collection.extend({


    url: function(){
    var url= App.Server + '/invitations/_design/bell/_view/AllInvitesAgainstId?key=["' + this.memberId + '","' + this.entityId + '"]&include_docs=true'
  	return url
    },				
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },	
    																				     
    model: App.Models.Invitation,
  })

})
