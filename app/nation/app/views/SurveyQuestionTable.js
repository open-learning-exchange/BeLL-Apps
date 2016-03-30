$(function() {

    App.Views.SurveyQuestionTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",
        id:"parentDiv",

        initialize: function() {
        },
        addOne: function(model) {
            var surveyQuestionRowView = new App.Views.SurveyQuestionRow({
                model: model
            })
            surveyQuestionRowView.Id = this.Id
            surveyQuestionRowView.render()
            this.$el.append(surveyQuestionRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>'+App.languageDictValue.get('Questions')+'</th><th colspan="2">'+App.languageDictValue.get('Actions')+'</th></tr>')
            if (this.collection.length == 0)
                this.$el.append('<tr><td colspan="2"> '+App.languageDictValue.get('empty_Survey')+' <td></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

})