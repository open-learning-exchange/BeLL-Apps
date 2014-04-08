$(function () {

    App.Views.MeetUpRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {},

        template: $("#template-MeetUpRow").html(),

        initialize: function (e) {
            //this.model.on('destroy', this.remove, this)
            this.roles = e.roles
        },

        render: function () {

            var vars = this.model.toJSON()


            if (this.roles.indexOf("Manager") != -1) {
                vars.isAdmin = 1
            } else {
                vars.isAdmin = 0
            }
            
          
          if (vars.creator && vars.creator==$.cookie('Member._id')) {
                vars.creator = 1
            } else {
                vars.creator = 0
            }

            console.log(vars)
            
            this.$el.append(_.template(this.template, vars))
        }

    })

})