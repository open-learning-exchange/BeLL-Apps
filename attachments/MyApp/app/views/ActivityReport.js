$(function () {

    App.Views.ActivityReport = Backbone.View.extend({
		vars: {},
		events: {
		
		},
        template: $('#template-ActivityReport').html(),
        initialize: function () {
       
        },
        render: function () {
        console.log(this.data)
        this.vars=this.data
        this.$el.html(_.template(this.template,this.vars));
         
        }
    })

})