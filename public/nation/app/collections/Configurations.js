$(function() {

  App.Collections.Configurations = Backbone.Collection.extend({

      url: function () {
          if (this.u) {
              alert(this.u)
              return this.u
          }
          else {
              var url = App.Server + '/configurations/_all_docs?include_docs=true'
              return url
          }
      },
      parse: function (response) {

          var docs = _.map(response.rows, function (row) {
              return row.doc
          })
          return docs
      },


      comparator: function (model) {
          var Name = model.get('Name')
          if (Name) return Name.toLowerCase()
      },
      model: App.Models.Configuration
  })
})
