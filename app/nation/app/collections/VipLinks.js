$(function() {

    App.Collections.VipLinks = Backbone.Collection.extend({

        model: App.Models.VipLink,
        url: function() {
            if (this.keys != undefined)
                return App.Server + '/viplinks/_all_docs?include_docs=true&keys=[' + this.keys + ']'
            else
                return App.Server + '/viplinks/_all_docs?include_docs=true'

        },
        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        },

        comparator: function(model) {
            var type = model.get('Type')
            if (type) return type.toLowerCase()
        }

    })

})