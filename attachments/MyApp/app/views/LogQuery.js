$(function () {

    App.Views.LogQuery = Backbone.View.extend({

		events: {
            "click #report_button" : function(e){
				if($("#community-select").val() && $("#start-date").val() && $("#end-date").val()){
					console.log("community: " + $("#community-select").val() + "\t" + "Start-Date: " + $("#start-date").val() + "    " + "End-Date: " + $("#end-date").val());
				}
				else{
					console.log("At least one of the criteria for report is missing");
				}
            }
        },
        template: $('#template-LogQuery').html(),
        initialize: function () {
       
        },
        render: function () {
        this.$el.html(_.template(this.template));
         
        }
    })

})