$(function() {

    App.Views.MeetUpRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {},

        template: $("#template-MeetUpRow").html(),

        initialize: function(e) {
            //this.model.on('destroy', this.remove, this)
            this.roles = e.roles
        },

        render: function() {

            var vars = this.model.toJSON();

            if (this.roles.indexOf("Manager") != -1) {
                vars.isAdmin = 1;
                vars.languageDict=App.languageDict;

            } else {
                vars.isAdmin = 0;
                vars.languageDict=App.languageDict;
            }


            if (vars.creator && vars.creator == $.cookie('Member._id')) {
                vars.creator = 1
                vars.languageDict=App.languageDict;
            } else {
                vars.creator = 0
                vars.languageDict=App.languageDict;
            }

            if (vars._id != '_design/bell')
                this.$el.append(_.template(this.template, vars))
        }

    })

})