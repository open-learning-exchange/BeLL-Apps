$(function() {

    App.Collections.Configurations = Backbone.Collection.extend({

        url: function() {
            if (this.u) {
                alert(this.u)
                return this.u
            } else {
                var url = App.Server + '/configurations/_all_docs?include_docs=true'
                return url
            }
        },
        parse: function(response) {

            var models = []
            _.each(response.rows, function(row) {
                if (row.doc._id != '_design/bell') {
                    models.push(row.doc);
                }
            });
            return models;
            //      var docs = _.map(response.rows, function(row) {
            //        return row.doc
            //      })
            //      return docs
        },
        comparator: function(model) {
            var Name = model.get('name')
            if (Name) return Name.toLowerCase()
        },

        model: App.Models.Configuration

    })

})