$(function() {

  App.Collections.Invitations = Backbone.Collection.extend({

    url: App.Server + '/invitations/_design/bell/_view/GetIniviteByMemberId?include_docs=true&key="'+$.cookie("Member._id")+'"',

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.Invitation,

    comparator: function(model) {
      var title = model.get('title')
      if (title) return title.toLowerCase()
    },


  })

})
