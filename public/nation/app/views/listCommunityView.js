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
        	var selectedValues = $('#comselect').val();
        	if(!selectedValues){
    		    alert('Please select Community first')	 
    		    return
    		 } 
    		 App.startActivityIndicator()
    		 var sendPub=new Array()		 
    		 
    		if(selectedValues.length>0){
    			for (var i = 0; i < selectedValues.length; i++) {
					var cUrl=selectedValues[i]
					var cName=$("#comselect option[value='"+selectedValues[i]+"']").text()
					   sendPub.push({
								 communityUrl:cUrl,
								 communityName:cName,
								 publicationId:this.pId,
								 Viewed:false
							})
				}	
			$.couch.db("publicationdistribution").bulkSave({"docs":sendPub }, {
					success: function(data) {
						console.log(data);
					},
					error: function(status) {
						console.log(status);
					}
				});	
    		}
    
    		$("#list option[value='2']").text()
        	$('#invitationdiv').fadeOut(1000)
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
            App.stopActivityIndicator()

        },
        synchResCommunityWithURL : function(communityurl,communityname,res) 
        {
        	
        	console.log('http://'+ communityname +':'+App.password+'@'+ communityurl + ':5984/pubresources')
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
                    "target": 'http://'+ communityname +':'+App.password+'@'+ communityurl + ':5984/pubresources',
                    "doc_ids":res
            	}),
                success: function (response) {
				console.log(response)
                },
                async: false
            })
        },
        synchPubCommunityWithURL : function(communityurl,communityname,pId) 
        {
        	
        	
        	console.log('http://'+ communityname +':'+App.password+'@'+ communityurl + ':5984/recpublication')
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
                    "target": 'http://'+ communityname +':'+App.password+'@'+ communityurl + ':5984/recpublication',
                    "doc_ids":pId
            	}),
                success: function (response) {
				console.log(response)
                },
                async: false
            })
        },
        /*
        
        Replicate: function () {
        
          App.startActivityIndicator()
          
           var that = this
           var temp = $.url().attr("host").split(".")
           var currentHost=$.url().attr("host")
           
           var nationURL=''
           var nationName=''
           var type=''
    
    	    var configurations=Backbone.Collection.extend({

    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})	
    	    var config=new configurations()
    	      config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
        
    	    
    	    type=cofigINJSON.rows[0].doc.type

//    	      if(type=='nation')
//    	       {
//    	       	   nationURL= App.Server
//    	       	   nationName=cofigINJSON.rows[0].doc.name
//    	       }
//    	        else{
//    	     	   	nationURL=cofigINJSON.rows[0].doc.nationUrl
//    	        	nationName=cofigINJSON.rows[0].doc.nationName
//    	       }
    	    
				nationURL=cofigINJSON.rows[0].doc.nationUrl
    	        nationName=cofigINJSON.rows[0].doc.nationName
    			App.$el.children('.body').html('Please Wait…')
    			var waitMsg = ''
    			var msg = ''
    			
            $.ajax({
    			url : 'http://'+ nationName +':oleoleole@'+nationURL+':5984/communities/_all_docs?include_docs=true',
    			type : 'GET',
    			dataType : "jsonp",
    			success : function(json) {
    				for(var i=0 ; i<json.rows.length ; i++)
    				{
    					var community = json.rows[i]
    					var communityurl = community.doc.url
    					var communityname = community.doc.name
    					msg = waitMsg
    					waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
    					App.$el.children('.body').html(waitMsg)
    					that.synchCommunityWithURL(communityurl,communityname)
    					waitMsg = msg
    					waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.'
    					App.$el.children('.body').html(waitMsg)
      				}
      				if(type!="nation")
      				{
      					msg = waitMsg
    					waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
    					that.synchCommunityWithURL(nationURL,nationName)
    					waitMsg = msg
    					waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.<br>Replication completed.'	
      				}
    			}
  			 })
  			App.stopActivityIndicator()
        },
        synchCommunityWithURL : function(communityurl,communityname) 
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
        */
        
    })

})