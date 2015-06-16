$(function() {

  App.Collections.Resources = Backbone.Collection.extend({

    model: App.Models.Resource,
    url: function() {
      if (this.keys != 'undefined')
        return App.Server + '/resources/_all_docs?include_docs=true&keys=[' + this.keys + ']'
      else
        return App.Server + '/resources/_all_docs?include_docs=true'

    },
    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    },

    comparator: function(model) {
      var title = model.get('title')
      if (title) return title.toLowerCase()
    }

  })

})