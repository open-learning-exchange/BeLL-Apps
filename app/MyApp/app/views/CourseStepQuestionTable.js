$(function() {

    App.Views.CourseStepQuestionTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        questionArray: [],
        courseStepModel: null,
        className: "table table-striped",
        id:"parentDiv",
        events: {
            "click #Rearrange": function(e) {
                if ($("input[name ='questionRow']").is(":visible")) {
                    $("#Rearrange").text(App.languageDictValue.attributes.Rearrange);
                    this.courseStepModel.set("questionslist", this.questionArray);
                    this.courseStepModel.save();
                    $("input[name = 'questionRow']").hide()
                    $("#moveup").hide()
                    $("#movedown").hide()
                } else {
                    $("#Rearrange").text(App.languageDictValue.attributes.Save);
                    $("input[name ='questionRow']").show()
                    $("#moveup").show()
                    $("#movedown").show()
                }
            },
            "click #moveup": function(e) {
                var current = null;
                var radioQuestions = document.getElementsByName('questionRow');
                for (var i = 0; i < radioQuestions.length; i++) {
                    if (radioQuestions[i].checked && i > 0) {
                        current = radioQuestions[i].parentNode.parentNode;
                        var prev = current.previousSibling;
                        var parent = current.parentNode;
                        if(prev)
                        {
                            this.swap(i, i - 1);
                            parent.removeChild(current);
                            parent.insertBefore(current, prev);
                        }
                        break;
                    }
                }
            },
            "click #movedown": function(e) {
                var current = null;
                var radioQuestions = document.getElementsByName('questionRow');
                for (var i = 0; i < radioQuestions.length; i++) {
                    if (radioQuestions[i].checked && i < (radioQuestions.length - 1)) {
                        current = radioQuestions[i].parentNode.parentNode;
                        var next = current.nextSibling;
                        var parent = current.parentNode;
                        if(next)
                        {
                            this.swap(i, i + 1);
                            parent.removeChild(next);
                            parent.insertBefore(next, current);
                        }
                        break;
                    }
                }
            }
        },

        initialize: function() {
        },
        swap: function(index1, index2) {
            if(index1 > -1 && index2 > -1) {
                var c = this.questionArray[index1];
                this.questionArray[index1] = this.questionArray[index2];
                this.questionArray[index2] = c;
            }
        },
        addOne: function(model) {
            var CourseStepQuestionRowView = new App.Views.CourseStepQuestionRow({
                model: model
            })
            CourseStepQuestionRowView.Id = this.Id;
            CourseStepQuestionRowView.render()
            this.$el.append(CourseStepQuestionRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>'+App.languageDict.attributes.Questions+'</th><th>'+App.languageDict.attributes.TotalMarks+'</th><th>'+App.languageDict.attributes.Type+'</th><th>'+App.languageDict.attributes.Actions+'</th></tr>');
            if (this.collection.length == 0)
                this.$el.append('<tr><td colspan="2"> '+App.languageDict.attributes.empty_Course+' <td></tr>');
                this.collection.forEach(this.addOne, this);
        },

        render: function() {
            this.addAll()
        }

    })

})