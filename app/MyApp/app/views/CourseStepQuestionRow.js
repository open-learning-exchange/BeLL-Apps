$(function() {

    App.Views.CourseStepQuestionRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var questionModel = this.model;
                var CourseStepQuestionObject = new App.Models.CourseStep({
                    _id: this.Id
                })
                CourseStepQuestionObject.fetch({
                    async: false
                })
                var CourseStepQuestions = CourseStepQuestionObject.get('questionslist')
                var index = CourseStepQuestions.indexOf(this.model.get('_id'))
                if (index > -1) {
                    CourseStepQuestions.splice(index, 1);
                }
                this.$el.hide()
                var marks = parseInt(questionModel.get("Marks"));
                var totalMarks = parseInt(CourseStepQuestionObject.get("totalMarks"));
                CourseStepQuestionObject.set('totalMarks', (totalMarks-marks));
                CourseStepQuestionObject.set({
                    'questionslist': CourseStepQuestions
                })
                var that =  this
                CourseStepQuestionObject.save(null, {
                   success: function() {
                        questionModel.destroy();
                        var stepQuestion =  new App.Collections.CourseStepQuestions();
                        stepQuestion.stepId = that.Id
                        stepQuestion.fetch({
                            async: false
                        });
                        var courseStep = new App.Models.CourseStep({
                            _id: that.Id
                        })
                        courseStep.fetch({
                            async: false
                        })
                        for (var i = 0; i < stepQuestion.length; i++) {
                            if(stepQuestion.models[i].attributes.Type != "Multiple Choice"){
                                break;
                            } else {
                                if (i == stepQuestion.length-1) {
                                    courseStep.set("stepType", "Objective");
                                    courseStep.save();
                                }
                            }
                        }
                   }
                });
            },
            "click .edit_coursestep_question": function(event) {
                var courseQuizEdit = new App.Views.TestView();
                courseQuizEdit.questionModel = this.model;
                courseQuizEdit.coursesavefunction(this.Id, true, this.model);
            }

        },

        vars: {},

        template: _.template($("#template-CourseStepQuestionRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON();
            vars.languageDict=App.languageDict;
            this.$el.append(this.template(vars));
        },
    })
})
