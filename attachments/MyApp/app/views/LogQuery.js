$(function () {

    App.Views.LogQuery = Backbone.View.extend({

		events: {
            "click #report_button" : function(e){
            var communityName="Local"
            if($("#community-select").val()){
            communityName=$("#community-select").val()
            }
				if( $("#start-date").val() && $("#end-date").val()){
					console.log("community: " + $("#community-select").val() + "\t" +
                        "Start-Date: " + $("#start-date").val() + "    " +
                        "End-Date: " + $("#end-date").val());
					App.Router.LogActivity(communityName,$("#start-date").val(),$("#end-date").val())
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