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
            vars.id  = this.model.attributes._id;
            vars.percentage = this.model.attributes.passingPercentage;
            var attchmentURL = null;
            var attachmentName = null;
            //If step has attachment paper then fetch that attachment paper so that it can be downloaded by "Download Paper" button
            var memberAssignmentPaper = new App.Collections.AssignmentPapers()
            memberAssignmentPaper.senderId=this.memberId
            memberAssignmentPaper.stepId= this.model.get('_id')
            memberAssignmentPaper.changeUrl = true;
            memberAssignmentPaper.fetch({
                async: false,
                success: function (json) {
                    if(json.models.length > 0) {
                        var existingModels = json.models;
                        attchmentURL = '/assignmentpaper/' + existingModels[0].attributes._id + '/';
                        if (typeof existingModels[0].get('_attachments') !== 'undefined') {
                            attchmentURL = attchmentURL + _.keys(existingModels[0].get('_attachments'))[0]
                            attachmentName = _.keys(existingModels[0].get('_attachments'))[0]
                        }
                        console.log("attachment name : " +attachmentName)
                    }
                }
            });
            if (attachmentName!= null){
              //  alert("attachment name : " +attachmentName)
                vars.attchmentURL = attchmentURL ;
                vars.attachmentName = attachmentName;
                vars.paperSubmitted = "Submitted";
            }
            else{
              //  alert("attachment name : " +attachmentName)
                vars.attchmentURL = null ;
                vars.attachmentName = null;
                vars.paperSubmitted = "NotSubmitted";
            }
            vars.stepNo = this.model.attributes.step;
            //vars.stepType = "";
            vars.credits = this.credits;
            vars.stepType =  this.stepType;
    this.$el.append(_.template(this.template, vars))
        }

    })

})