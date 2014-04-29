$(function () {

    App.Views.ActivityReport = Backbone.View.extend({
		vars: {},
		startDate:null,
		endDate:null,
		events: {
		
		},
        template: $('#template-ActivityReport').html(),
        initialize: function () {
       
        },
        render: function () {
        console.log(this.data)
        this.vars=this.data
        this.vars.startDate=this.startDate
        this.vars.endDate=this.endDate
        this.vars.CommunityName=this.CommunityName
        this.$el.html(_.template(this.template,this.vars));
         
        }
    })

})