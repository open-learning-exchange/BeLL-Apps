$(function() {

  App.Collections.Configurations = Backbone.Collection.extend({

    initialize: function(e) {
      this.url = App.Server + '/configurations/_all_docs?include_docs=true'
    },
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },



    comparator: function(model) {
      var Name = model.get('Name')
      if (Name) return Name.toLowerCase()
    },
    model: App.Models.Configuration

  })

})