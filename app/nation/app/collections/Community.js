$(function() {

    App.Collections.Community = Backbone.Collection.extend({

        initialize: function(e) {

            if (e) {
                if(e.status == "accepted")
                    this.url = App.Server + '/community/_design/bell/_view/getCommunityByStatus?include_docs=true&key="accepted"'
                else
                    this.url = App.Server + '/community/_all_docs?include_docs=true' + '&limit=' + e.limit
            } else {
                this.url = App.Server + '/community/_all_docs?include_docs=true'
            }
        },
        setUrl: function(url) {
            this.url = url;
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },



        comparator: function(model) {
            var Name = model.get('name')
            if (Name) return Name.toLowerCase()
        },
        model: App.Models.Community

    })

})