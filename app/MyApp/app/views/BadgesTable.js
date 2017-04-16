$(function () {

    App.Views.BadgesTable = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped",
        id:"badges-details",

        addOne: function (model, credits, status, attempts) {
            var badgesRow = new App.Views.BadgesRow({
                model: model
            })
            badgesRow.memberId=this.memberId
            badgesRow.stepType= model.attributes.outComes;
            badgesRow.credits = credits;
            badgesRow.status = status;
            badgesRow.attempts = attempts;
            badgesRow.render()
            this.$el.append(badgesRow.el);
        },

        addAll: function() {
            var that = this;
            var courseProgress = new App.Collections.membercourseprogresses()
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
                indexOfCurrentStep =courseProgress.models[0].get('stepsIds').indexOf(model.get('_id'));
                attempts = courseProgress.models[0].get('pqAttempts')[indexOfCurrentStep];
                status = courseProgress.models[0].get('stepsStatus')[indexOfCurrentStep][attempts[indexOfCurrentStep]];
                credits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][attempts[indexOfCurrentStep]];
                that.addOne(model, credits, status, attempts);    
            }
        },

        render: function () {
            this.$el.html('<tr><th>' + App.languageDict.get('StepNO') + '</th><th>' + App.languageDict.get('Submit') + '</th><th>' + App.languageDict.get('Grade') + '</th><th>' + App.languageDict.get('Percentage') + '</th><th>' + App.languageDict.get('Review') + '</th></tr>');
            this.addAll();
        }
    })
})