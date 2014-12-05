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
                
               // <input type="checkbox" value="Resources" name="syncData">Resources<br>
               //<input type="checkbox" value="Application" name="syncData" >Application<br><br><br>
                var $button = $('<h6>Select Item(\'s) To Sync</h6><br><br><input type="checkbox" value="ActivityReports" name="syncData">Log Activity Reports<br><input type="checkbox" value="Reports" name="syncData">Reports<br>')
                
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
						context.checkAvailableUpdates()
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
        //following function compare version numbers.
		/*<li>0 if the versions are equal</li>
		A negative integer iff v1 < v2
		A positive integer iff v1 > v2
		NaN if either version string is in the wrong format*/

		versionCompare: function (v1, v2, options) {
			var lexicographical = options && options.lexicographical;
			zeroExtend = options && options.zeroExtend;
			v1parts = v1.split('.');
			v2parts = v2.split('.');

			function isValidPart(x) {
				return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
			}

			if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
				return NaN;
			}

			if (zeroExtend) {
				while (v1parts.length < v2parts.length) v1parts.push("0");
				while (v2parts.length < v1parts.length) v2parts.push("0");
			}

			if (!lexicographical) {
				v1parts = v1parts.map(Number);
				v2parts = v2parts.map(Number);
			}

			for (var i = 0; i < v1parts.length; ++i) {
				if (v2parts.length == i) {
					return 1;
				}

				if (v1parts[i] == v2parts[i]) {
					continue;
				}
				else if (v1parts[i] > v2parts[i]) {
					return 1;
				}
				else {
					return -1;
				}
			}

			if (v1parts.length != v2parts.length) {
				return -1;
			}

			return 0;
		},
		checkAvailableUpdates: function () {
			var context = this;
			var configuration;
			var configurationModel=new App.Collections.Configurations()
				configurationModel.fetch({success:function(res){
		     			configuration=res.first()
		     								 
				 },async: false})
			var nationName = configuration.get("nationName")
			var nationURL = configuration.get("nationUrl")
			var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true'

			// console.log(nationConfig)
			// alert('check')
			//alert('http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true')
			$.ajax({
				url: nationConfigURL,
				type: 'GET',
				dataType: "jsonp",
				success: function (json) {
					var nationConfig = json.rows[0].doc
					nationConfigJson = nationConfig
					if (typeof nationConfig.version === 'undefined') {
						/////No version found in nation
					}
					else if (nationConfig.version == configuration.get('version')) {
						///No updatea availabe
					}
					else {
						if(context.versionCompare(nationConfig.version, configuration.get('version'))<0){
							console.log("Nation is at low level")
						}
						else if (context.versionCompare(nationConfig.version, configuration.get('version'))>0) {
						context.updateApp()
						}
						else{
						console.log("Nation is uptodate")
						}
					}
				}
			})
			return;
		},
		updateApp:function(){
		
				var configurations = Backbone.Collection.extend({
					url: App.Server + '/configurations/_all_docs?include_docs=true'
				})
				var config = new configurations()
				config.fetch({
					async: false
				})
				var currentConfig = config.first().toJSON().rows[0].doc
				currentConfig.version = this.latestVersion
				var nationName = currentConfig.nationName
				var nationURL = currentConfig.nationUrl
				$.ajax({
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json; charset=utf-8'
					},
					type: 'POST',
					url: '/_replicate',
					dataType: 'json',
					data: JSON.stringify({
						"source": 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/apps',
						"target": "apps"
					}),
					success: function (response) {
						console.log(response)
					},
					async: false
				})

				$.ajax({
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'multipart/form-data'
					},
					type: 'PUT',
					url: App.Server + '/configurations/' + currentConfig._id + '?rev=' + currentConfig._rev,
					dataType: 'json',
					data: JSON.stringify(currentConfig),
					success: function (response) {
						console.log(response)
						alert("Successfully updated to latest version.")
					},
					async: false
				})
			
		}
    })

})