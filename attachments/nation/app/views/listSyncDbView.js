$(function () {

    App.Views.listSyncDbView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #cancelButton": "hidediv",
            "click #formButton":"syncData",
            "click #selectAll":"selectAll"
        },
        hidediv: function () {
            $('#invitationdiv').fadeOut(1000)
            
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
        },
        render: function () {
                
                var $button = $('<h6>Select Item(\'s) To Sync</h6><br><br><input type="checkbox" value="Resources" name="syncData">Resources<br><input type="checkbox" value="ActivityReports" name="syncData">Log Activity Reports<br><input type="checkbox" value="Reports" name="syncData">Reports<br><input type="checkbox" value="Application" name="syncData" >Application<br><br><br>')
                
                this.$el.append($button)
                this.$el.append('<button class="btn btn-info" id="selectAll" style="width:110px">Select All</button><button style="margin-left:10px; width:110px" class="btn btn-success" id="formButton" style="width:110px">Send</button>')
                this.$el.append('<button class="btn btn-warning" id="cancelButton" style="width:110px;margin-left:10px">Cancel</button>')
        },
        selectAll: function(){
        	if($("#selectAll").text()=='Select All')
         	{
      			$("input[name='syncData']").each( function () {
						$(this).prop('checked', true);
      			})
      			$("#selectAll").text('Unselect All')
      		}
      		else{
      		 $("input[name='syncData']").each( function () {
						$(this).prop('checked', false);
      			})
      		   $("#selectAll").text('Select All')
      		
      		}
        },
        syncData: function(){
        	var context=this
        	App.startActivityIndicator()
        	$("input[name='syncData']").each(function () {
				if ($(this).is(":checked")) {
					if($(this).val()=='Resources'){
						context.ReplicateResource()
					}
					else if($(this).val()=='ActivityReports'){
						context.syncLogActivitiy()
					}
					else if($(this).val()=='Reports'){
						context.syncReports()
					}
					if ($(this).val()=='Application'){
			
					}
				}
            })    
        	$('#invitationdiv').fadeOut(1000)
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
            App.stopActivityIndicator()

        },
       ReplicateResource: function () {
        
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
				nationURL=cofigINJSON.rows[0].doc.nationUrl
    	        nationName=cofigINJSON.rows[0].doc.nationName
    			App.$el.children('.body').html('Please Wait…')
    			var waitMsg = ''
    			var msg = ''
    			
            $.ajax({
    			url : 'http://'+ nationName +':'+App.password+'@'+nationURL+':5984/communities/_all_docs?include_docs=true',
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
        	console.log('http://'+ communityname +':'+App.password+'@'+ communityurl + ':5984/resources')
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
                    "target": 'http://'+ communityname +':'+App.password+'@'+ communityurl + ':5984/resources'
            	}),
                success: function (response) {

                },
                async: false
            })
     },
       syncReports:function(){
        
              App.startActivityIndicator()
         var configurationModel=new App.Collections.Configurations()
		     configurationModel.fetch({success:function(res){
		     
					        var conf=res.first()
					        console.log(conf)
					        var nationName=conf.get('nationName')
					        var nationURL=conf.get('nationUrl')					        
							$.ajax({
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json; charset=utf-8'
								},
								type: 'POST',
								url: '/_replicate',
								dataType: 'json',
								data: JSON.stringify({
									"source": "communityreports",
									"target": 'http://'+ nationName +':'+App.password+'@'+ nationURL + ':5984/communityreports'
								}),
								success: function (response) {
                                            App.stopActivityIndicator()
                                            alert('sync successfully ')
                                            Backbone.history.navigate('reports',{trigger: true})
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) { 
								            App.stopActivityIndicator()
                    						alert("Status: " + textStatus); alert("Error: " + errorThrown);
                    						Backbone.history.navigate('reports', {trigger: true}) 
                					}, 
								async: false
							})
					 
				 }})


        }, 
       syncLogActivitiy:function(){ 
         var configurationModel=new App.Collections.Configurations()
		     configurationModel.fetch({success:function(res){
		     
					        var conf=res.first()
					        console.log(conf)
					        var nationName=conf.get('nationName')
					        var nationURL=conf.get('nationUrl')					        
							$.ajax({
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json; charset=utf-8'
								},
								type: 'POST',
								url: '/_replicate',
								dataType: 'json',
								data: JSON.stringify({
									"source": "activitylog",
									"target": 'http://'+ nationName +':'+App.password+'@'+ nationURL + '/activitylog'
								}),
								success: function (response) {
                                            alert("Successfully Replicated Reports")
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) { 
								            alert("Error (Try Later)")
                					}, 
								async: false
							})
					 
				 }})


        },
    })

})