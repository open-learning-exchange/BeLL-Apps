$(function() {

    App.Views.SurveyQuestionRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var questionModel = this.model;
                var surveyObject = new App.Models.Survey({
                    _id: this.Id
                })
                surveyObject.fetch({
                    async: false
                })
                var surQuestions = surveyObject.get('questions')
                var index = surQuestions.indexOf(this.model.get('_id'))
                if (index > -1) {
                    surQuestions.splice(index, 1);
                }
                this.$el.hide()

                surveyObject.set({
                    'questions': surQuestions
                })
                surveyObject.save(null, {
                   success: function() {
                       questionModel.destroy();
                   }
                });
            },
            "click .edit_survey_question": function(event) {
                var surveyId = this.Id;
                App.Router.openSurveyQuestionDialogBox(surveyId, true, this.model)
            }

        },

        vars: {},

        template: _.template($("#template-surveyQuestionRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON()
            this.$el.append(this.template(vars))
        },


    })

})