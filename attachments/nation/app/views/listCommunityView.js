$(function () {

    App.Views.listCommunityView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #cancelButton": "hidediv",
            "click #formButton":"syncData"
        },
        hidediv: function () {
            $('#invitationdiv').fadeOut(1000)
            
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
        },
        render: function () {
                
                var $button = $('<h6>Select Community(\'ies)</h6><select multiple id="comselect"></select><br><br><a class="btn btn-success" id="formButton">Send</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
        },
        syncData: function(){

        	alert("Sending data")
        	var selectedValues = $('#comselect').val();
    		if(selectedValues.length>0)
    		{
    			for (var i = 0; i < selectedValues.length; i++) {
    			var communityUrl=selectedValues[i]
    			var communityName=$("#comselect option[value='"+selectedValues[i]+"']").text()
    			this.synchResCommunityWithURL(communityUrl,communityName)
				this.synchPubCommunityWithURL(communityUrl,communityName)
				}
    		
    		}
    		
    		console.log(selectedValues)
    		
    		$("#list option[value='2']").text()
        	$('#invitationdiv').fadeOut(1000)
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
        },
        synchResCommunityWithURL : function(communityurl,communityname) 
        {
        	console.log('http://'+ communityname +':oleoleole@'+ communityurl + ':5984/resources')
        	$.ajax({
            	headers: {
                	'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
            	type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                	"source": "resources",
                    "target": 'http://'+ communityname +':oleoleole@'+ communityurl + ':5984/resources'
            	}),
                success: function (response) {

                },
                async: false
            })
        },
        synchPubCommunityWithURL : function(communityurl,communityname) 
        {
        	console.log('http://'+ communityname +':oleoleole@'+ communityurl + ':5984/publications')
        	$.ajax({
            	headers: {
                	'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
            	type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                	"source": "publications",
                    "target": 'http://'+ communityname +':oleoleole@'+ communityurl + ':5984/publications'
            	}),
                success: function (response) {

                },
                async: false
            })
        },
    })

})