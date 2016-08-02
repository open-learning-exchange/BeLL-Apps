/**
 * Created by Sadia.Rasheed on 7/20/2016.
 */

$(function () {

    App.Views.CreditsRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {

        },

        template: $("#template-CreditsRow").html(),

        initialize: function (e) {

        },

        render: function () {
            var vars = this.model.toJSON();
            var courseProgress = new App.Collections.membercourseprogresses()
            courseProgress.memberId = this.memberId;
            courseProgress.courseId = this.courseId;
            courseProgress.fetch({
                async:false,

            });
            console.log(courseProgress);
            vars.stepNo = this.model.attributes.step;
            vars.stepType = [];
            var indexOfCurrentStep=courseProgress.models[0].get('stepsIds').indexOf(this.model.get('_id'));
            for(var i=0;i<this.model.attributes.outComes.length;i++)
            {
                var type =this.model.attributes.outComes[i];
                vars.stepType.push(type);
            }
            if(vars.stepType.length > 1){
                vars.paperCredits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][0];
                vars.quizCredits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][1];
                vars.stepStatusOfPaper = courseProgress.models[0].get('stepsStatus')[indexOfCurrentStep];
                if(vars.stepStatusOfPaper.indexOf('2')>-1 )
                {
                    vars.status='Awaiting';
                }

                else if(vars.stepStatusOfPaper.indexOf('0')>-1){
                    vars.status='Fail';
                }
                else{
                    vars.status='Pass';
                }
            }
            else{

                if(vars.stepType[0] == "Paper"){
                    vars.paperCredits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep];
                    vars.quizCredits = "N/A";
                    vars.stepStatusOfPaper = courseProgress.models[0].get('stepsStatus')[indexOfCurrentStep];
                    if(vars.stepStatusOfPaper=='2' )
                    {
                        vars.status='Awaiting';
                    }
                    else if(vars.stepStatusOfPaper=='1'){
                        vars.status='Pass';
                    }
                    else{
                        vars.status='Fail';
                    }
                }
                else {
                    vars.quizCredits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep];
                    vars.paperCredits = "N/A";
                    if(courseProgress.models[0].get('stepsStatus')[indexOfCurrentStep]=='1'){
                        vars.status='Pass';
                    }
                    else{
                        vars.status='Fail';
                    }
                }
            }
           
            this.$el.append(_.template(this.template, vars))

        }

    })

})