$(function() {

    App.Views.SurveyRow = Backbone.View.extend({

        tagName: "tr",
        admin: null,
        events: {
            "click .destroy": function (event) {
                var languageDictValue=App.Router.loadLanguageDocs();
                if (confirm(languageDictValue.attributes.Confirm_Survey)) {
                    this.model.destroy();
                }
            }
        },

        vars: {},

        template: _.template($("#template-SurveyRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON()
            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()
            this.$el.append(this.template(vars))
        },


    })

})