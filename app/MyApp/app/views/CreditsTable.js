/**
 * Created by Sadia.Rasheed on 7/20/2016.
 */
$(function () {
    App.Views.CreditsTable = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped",
        
        addOne: function (model, credits, status, attempts) {
            var creditsRow = new App.Views.CreditsRow({
                model: model            })
            creditsRow.memberId = this.memberId;
            creditsRow.credits = credits;
            creditsRow.status = status;
            creditsRow.attempts = attempts;
            creditsRow.render();
            this.$el.append(creditsRow.el);
        },

        addAll: function() {
            var that = this;
            courseProgress = new App.Collections.membercourseprogresses()
            courseProgress.memberId = this.memberId;
            courseProgress.courseId = this.courseId;
            courseProgress.fetch({
                async:false
            });
            var indexOfCurrentStep;
            var credits;
            var status;
            var attempts;
            for(var i = 0 ; i < that.collection.length ; i++) {
                var model = that.collection.models[i];
                indexOfCurrentStep = courseProgress.models[0].get('stepsIds').indexOf(model.get('_id'));
                credits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep];
                status = courseProgress.models[0].get('stepsStatus')[indexOfCurrentStep];
                attempts = courseProgress.models[0].get('pqAttempts')[indexOfCurrentStep];
                that.addOne(model, credits, status, attempts);
            }
        },

        render: function () {
            this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Submit' + '</th><th>' + 'Grade' + '</th><th>' + 'Percentage' + '</th>><th>' + 'Review' + '</th></tr>');
            this.addAll();
        }
    })
})
