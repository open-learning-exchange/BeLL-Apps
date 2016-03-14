$(function() {

    App.Collections.Surveys = Backbone.Collection.extend({

        model: App.Models.Survey,

        url: function() {
            if(this.surveyNo) {
                return App.Server + '/survey/_design/bell/_view/surveyBySurveyNo?include_docs=true&key=' + this.surveyNo
            } else {
                return App.Server + '/survey/_design/bell/_view/allSurveys?include_docs=true'
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