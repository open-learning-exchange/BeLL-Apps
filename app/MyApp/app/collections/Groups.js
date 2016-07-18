$(function() {

    App.Collections.Groups = Backbone.Collection.extend({

        url: function() {
            if (this.skip != undefined){
                    return App.Server + '/groups/_all_docs?include_docs=true&limit=20&skip=' + this.skip
            } else if(this.keys != undefined){
                return App.Server + '/groups/_all_docs?include_docs=true&keys=[' + this.keys + ']'
            } else {
                return App.Server + '/groups/_all_docs?include_docs=true'
            }
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Group,

        comparator: function(model) {
            if (model.get('CourseTitle') == undefined) {
                var title = model.get('name')
                model.set('CourseTitle', title)
                model.save()
            } else if (model.get('name') == undefined) {
                var title = model.get('CourseTitle')
                model.set('name', title)
                model.save()
            } else {
                var title = model.get('CourseTitle')
            }
            if (title) return title.toLowerCase()
        }


    })

})