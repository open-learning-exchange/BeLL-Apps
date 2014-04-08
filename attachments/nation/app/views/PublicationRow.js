$(function () {

    App.Views.PublicationRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
        	"click .destroy": function (event) {
                alert("deleting")
                this.model.destroy()
                event.preventDefault()
            },
            "click #a":function(id)
            {
            	alert(id)
            }
        },

        vars: {},

        template: _.template($("#template-PublicationRow").html()),

        initialize: function (e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function () {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()
          		
                vars.isManager = this.isManager
                var date=new Date(vars.Date)
                vars.Date=date.toUTCString()
			
                this.$el.append(this.template(vars))


        },


    })

})