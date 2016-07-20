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
            vars.stepNo = this.model.attributes.step;
            vars['stepType']= [];
            vars.stepType.push('Paper');
            vars.stepType.push('Quiz');
            vars.paperCredits = 19;
            vars.quizCredits = 60;
            vars.status ="Pass";
            this.$el.append(_.template(this.template, vars))

        }

    })

})