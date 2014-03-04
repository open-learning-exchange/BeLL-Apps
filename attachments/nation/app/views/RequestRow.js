$(function () {

    App.Views.RequestRow = Backbone.View.extend({

        tagName: "tr",
        
        template: _.template($("#template-RequestRow").html()),

        initialize: function (e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function () {
            var vars = this.model.toJSON()
            var sender = new App.Models.Member({
                "_id": vars.senderId
            })
            sender.fetch({
                async: false
            })
            vars.login=sender.toJSON().login
				if(vars.date==undefined){
			    vars.date="Not available"
			}
			
				if(vars.sendFromName==undefined){
			    vars.sendFromName="Not available"
			}

				vars.from=""
                this.$el.append(this.template(vars))


        },


    })

})