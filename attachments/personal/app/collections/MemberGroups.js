$(function() {

  App.Collections.MemberGroups = Backbone.Collection.extend({

    url: App.Server + '/groups/_all_docs?include_docs=true',
    

    parse: function(results) {
      var m = []
      var memberId = this.memberId
      var i 
      for(i = 0 ; i< results.rows.length ; i++)
      {   
        if(results.rows[i].doc.members.indexOf(memberId) != -1) {
          m.push(results.rows[i].doc)
        }
      }
      return m
    },

    model: App.Models.Group,
    
    comparator: function(model) {
      var title = model.get('name')
      if (title) return title.toLowerCase()
    }
  })

})
