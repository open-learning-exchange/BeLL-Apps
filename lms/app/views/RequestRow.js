$(function() {

  App.Views.RequestRow = Backbone.View.extend({

    tagName: "tr",
    template : $("#template-RequestRow").html(),

    render: function () {
    	var vars = this.model.toJSON()
    	var user=new App.Models.Member({_id:vars.senderId})
    	user.fetch({async:false})
    	user=user.toJSON()
    	vars.name=user.firstName+" "+user.lastName
       this.$el.html(_.template(this.template, vars))
    }

  })

})
