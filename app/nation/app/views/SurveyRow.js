$(function() {

    App.Views.SurveyRow = Backbone.View.extend({

        tagName: "tr",
        admin: null,
        events: {
            "click .destroy": function (event) {
            }
        },

        vars: {},

        template: _.template($("#template-SurveyRow").html()),

        initialize: function(e) {

        },

        render: function() {


        },


    })

})