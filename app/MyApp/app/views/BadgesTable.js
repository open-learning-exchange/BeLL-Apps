 /**
 * Created by Sadia.Rasheed on 6/30/2016.
 */
 $(function () {

     App.Views.BadgesTable = Backbone.View.extend({
         tagName: "table",
         className: "table table-striped",
         id:"badges-details",

         events:{
         },
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

            // this.collection.forEach(this.addOne, this)
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
                 if(model.attributes.outComes.length > 1 && $.isArray(courseProgress.models[0].get('stepsResult')[indexOfCurrentStep])) { // if step type is "paper and quiz" then separate outcomes and result of paper and quiz in two separate rows
                     var tempOutComes=model.attributes.outComes;
                     model.attributes.outComes = tempOutComes[0];
                     credits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][0];
                     status = courseProgress.models[0].get('stepsStatus')[indexOfCurrentStep][0];
                     attempts = courseProgress.models[0].get('pqAttempts')[indexOfCurrentStep][0];
                     that.addOne(model, credits, status, attempts);
                     model.attributes.outComes = tempOutComes[1];
                     credits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][1];
                     status = courseProgress.models[0].get('stepsStatus')[indexOfCurrentStep][1];
                     attempts = courseProgress.models[0].get('pqAttempts')[indexOfCurrentStep][1];
                     that.addOne(model, credits, status, attempts);
                 } else {
                     credits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep];
                     status = courseProgress.models[0].get('stepsStatus')[indexOfCurrentStep];
                     attempts = courseProgress.models[0].get('pqAttempts')[indexOfCurrentStep];
                     that.addOne(model, credits, status, attempts);
                 }
             }
         },

         render: function () {
          //   this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Quiz Credits' + '</th><th>' + 'Paper Credits' + '</th><th>' + 'Status' + '</th></tr>');
             this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Submit' + '</th><th>' + 'Grade' + '</th><th>' + 'Percentage' + '</th></tr>');
             this.addAll();
             /////////////////////////////////////////

         }

     })
 })