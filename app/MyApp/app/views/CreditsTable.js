/**
 * Created by Sadia.Rasheed on 7/20/2016.
 */
$(function () {
    App.Views.CreditsTable = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped",
        events:{
        },
        addOne: function (model, credits) {
            var creditsRow = new App.Views.CreditsRow({
                model: model
            })
            creditsRow.memberId=this.memberId
                    creditsRow.stepType= model.attributes.outComes;
            creditsRow.credits = credits;
                    creditsRow.render()
                    this.$el.append(creditsRow.el);
        },
        addAll: function() {
            var that = this;
            var courseProgress = new App.Collections.membercourseprogresses()
            courseProgress.memberId = this.memberId;
            courseProgress.courseId = this.courseId;
            courseProgress.fetch({
                async:false,
            });
            var indexOfCurrentStep;
            var credits;
            for(var i = 0 ; i < that.collection.length ; i++) {
                var model = that.collection.models[i];
                 indexOfCurrentStep =courseProgress.models[0].get('stepsIds').indexOf(model.get('_id'));
                if(model.attributes.outComes.length > 1) { // if step type is "paper and quiz" then separate outcomes and result of paper and quiz in two separate rows
                    var tempOutComes=model.attributes.outComes;
                    model.attributes.outComes = tempOutComes[0];
                    credits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][0];
                    that.addOne(model, credits);
                    model.attributes.outComes = tempOutComes[1];
                    credits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][1];
                    that.addOne(model, credits);
                } else {
                    credits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep];
                    that.addOne(model, credits);
                }
            }
        },
        render: function () {
            this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Submit' + '</th><th>' + 'Grade' + '</th><th>' + 'Percentage' + '</th></tr>');
            this.addAll();
        }
    })
})
