$(function() {

    App.Collections.Surveys = Backbone.Collection.extend({

        model: App.Models.Survey,

        url: function() {
            if(this.keys != 'undefined') {
                return App.Server + '/survey/_all_docs?include_docs=true&keys=[' + this.keys + ']'
            } else {
                return App.Server + '/survey/_all_docs?include_docs=true'
            }

        },

        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        },
        comparator: function(model) {
            var surveyNo = model.get('SurveyNo')
            if (surveyNo){
                return surveyNo
            }
        }

    })

})