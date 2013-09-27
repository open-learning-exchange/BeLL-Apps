$(function() {

  App.Collections.MemberGroups = Backbone.Collection.extend({

    model: App.Models.Group,

    parse: function(results) {
      console.log(results)
      var m = []
      var memberId = this.memberId
      _.each(results, function(result) {
        if(result.members.indexOf(memberId) != -1) {
          m.push(result)
        }
      })
      return m
    },

    comparator: function(model) {
      var title = model.get('name')
      if (title) return title.toLowerCase()
    },

    sync: BackbonePouch.sync({
      db: PouchDB('groups')
    })


  })

})
