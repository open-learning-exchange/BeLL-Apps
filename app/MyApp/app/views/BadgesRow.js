/**
 * Created by Sadia.Rasheed on 7/4/2016.
 */
$(function () {

    App.Views.BadgesRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {

        },

        template: $("#template-BadgesRow").html(),

        initialize: function (e) {

        },

        render: function () {
            console.log(this.model);
            var vars = this.model.toJSON();
            var courseProgress = new App.Collections.membercourseprogresses()
            courseProgress.memberId = $.cookie('Member._id');
            courseProgress.courseId = this.model.get('courseId');
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
                // console.log(vars.stepType.length)
                vars.paperCredits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][0];
                vars.quizCredits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep][1];
            }
            else{

                if(vars.stepType[0] == "Paper"){
                    vars.paperCredits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep];
                    vars.quizCredits = "N/A";
                }
                else {
                    vars.quizCredits = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep];
                    vars.paperCredits = "N/A";
                }
            }
            var passingPercentage = this.model.attributes.passingPercentage;
            var marks = courseProgress.models[0].get('stepsResult')[indexOfCurrentStep];
            var intMarks = [];
            if($.isArray(marks)){
                for (var i=0; i < marks.length ; i++){
                    //  console.log('marks before parsing '+marks[i]);
                    intMarks.push(parseInt(marks[i]));
                    // console.log("intMarks after parsing : " +intMarks);
                }
            }
            else{
                intMarks.push(parseInt(marks));
            }

            if(intMarks.length > 1){
                if( intMarks[0]>= passingPercentage && intMarks[1]>= passingPercentage ){
                    vars.status ="Pass";
                }
                else{
                    vars.status ="Fail";
                }
            }
            else{
                if( intMarks[0] >= passingPercentage){
                    vars.status ="Pass";
                }
                else{
                    vars.status ="Fail";
                }
            }
            this.$el.append(_.template(this.template, vars))
        }

    })

})