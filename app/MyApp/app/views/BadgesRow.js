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
            var vars = this.model.toJSON();
            vars.stepNo = this.model.attributes.step;
            vars.stepType="";
               vars.paperCredits = 19;
               vars.quizCredits = 60;
                vars.status ="Pass";
            this.$el.append(_.template(this.template, vars))
        }

    })

})