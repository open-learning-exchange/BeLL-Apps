$(function() {

    App.Collections.CourseStepQuestions = Backbone.Collection.extend({

        model: App.Models.CourseQuestion,
        url: function() {
            if (this.keys != 'undefined')
                return App.Server + '/coursequestion/_all_docs?include_docs=true&keys=[' + this.keys + ']'
            else
                return App.Server + '/coursequestion/_all_docs?include_docs=true'
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