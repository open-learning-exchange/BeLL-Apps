$(function() {

    App.Views.ViewTest = Backbone.View.extend({
        vars: {},
        Questions: {},
        index: -1,
        TotalCount: 0,
        tagName: 'form',
        id: 'questionForm',
        attributes: {'method': 'post'},

        events: {
            "click #exitPressed": function(e) {
                $('div#viewTest').html('')
                Backbone.history.navigate('level/view/' + this.stepId + '/' + this.attributes.revisionid, {
                    trigger: true
                })
            },
            "click #finishPressed": function(e) {
                $('div#viewTest').html('')
                Backbone.history.navigate('level/view/' + this.stepId + '/' + this.attributes.revisionid, {
                    trigger: true
                })
            },
            "click #nextPressed": function(e) {
                this.renderQuestion();
            }
        },

        initialize: function() {
            this.template = _.template($("#template-viewTest").html())
            this.Questionlist = this.options.questionlist 
            this.stepId = this.options.stepId
            this.TotalCount = this.Questionlist.length 
        },

        renderQuestion: function() {
            if ((this.index + 1) != this.TotalCount) {
                this.index++
                this.$el.html('&nbsp')
                this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                var coursedetail = new App.Models.CourseQuestion({
                    _id: this.Questionlist[this.index]
                })
                coursedetail.fetch({
                    async: false
                });
                this.vars = coursedetail.toJSON();
                this.vars.languageDict=App.languageDict;
                var singleline = coursedetail.get("Statement")
                this.vars.singleLineQuestionTitle = singleline
                this.$el.append(this.template(this.vars));
                this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                this.$el.append('<div class="quizActions" ><div class="btn btn-danger" id="exitPressed">'+App.languageDict.attributes.Exit+'</div></div>')
                if((this.index + 1) == this.TotalCount){
                    this.$el.find('.quizActions').append('<div class="btn btn-info" id="finishPressed">'+App.languageDict.attributes.Finish+'</div>');
                } else {
                    this.$el.find('.quizActions').append('<div class="btn btn-primary" id="nextPressed">'+App.languageDict.attributes.Next+'</div>');
                }
            } 
        },

        start: function() {
            $('div.takeTestDiv').show()
            this.renderQuestion()
        },
       
        render: function() {
            this.start()
        }
    })
})