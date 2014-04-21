$(function() {
  App.Views.CollectionTable = Backbone.View.extend({

    tagName: "table",
	id:"collectionTable",
	display:false,
    className: "table table-striped",
	addOne: function(model){
      	 var collectionRow = new App.Views.CollectionRow({model: model})
      		 collectionRow.display=this.display
      		 collectionRow.render()  
      	this.$el.append(collectionRow.el)
    },
    events : {
		"click .clickonalphabets" : function(e)
		{
			this.collection.skip = 0
			var val = $(e.target).text()
			this.collection.startkey = val
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
			
		},
		"click #allresources" : function(e)
		{
			this.collection.startkey = ""
			this.collection.skip = 0
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
		},
		"click #mergeCollection" :function(e){
		    this.displayMergeForm()
		},
		"click #nextButton" :function(e){
		    this.collection.skip += 20
			this.collection.fetch({async:false})
			if(this.collection.length>0)
			{
				this.render()
			}
		},
	},
	displayMergeForm:function(){
	
	          $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
                $('#invitationdiv').html('<h5 style="margin-left:40px;margin-top:40px">Select Collections to Merge<h5>')

                var viewText='<p style="margin-left:20px;"><label style="margin-left:20px"><b>Collections</b></label><select multiple="true" style="width:400px;" id="selectCollections">'
                    this.collection.each(function(coll){
                         viewText+='<option value="'+coll.get('_id')+'">'+coll.get('CollectionName')+'</option>'
                    
                    })
                viewText+='</select></p>'
                
                $('#invitationdiv').append(viewText)
                
                $('#invitationdiv').append('<br><label style="margin-left:40px"><b>Name</b></label><input id="collectionName" type="text"></input>')
                $('#invitationdiv select').multiselect().multiselectfilter()
                $('#invitationdiv select').multiselect('uncheckAll')
               
                $('#invitationdiv').append('<br><br>') 
                $('#invitationdiv').append('<button class="btn btn-success" style="margin-left:40px" id="continueMerging" onClick="continueMerging()">Continue</button>')
                $('#invitationdiv').append('<button class="btn btn-danger" style="margin-left:20px"  id="cancelMerging" onClick="cancelMerging()">Cancel</button>')
	},
    addAll: function(){
    
    	var header="<tr><th colspan='6'>Collections"
            if(this.display==true)
              header+="<a id='mergeCollection' style='margin-left:20px' class='btn btn-info small'>Merge</a>"
    	      header+="</th></tr>"
    	this.$el.html(header)
				var viewText="<tr></tr>"
			
				viewText+="<tr><td colspan=7>"
				viewText+='<a  id="allresources" >#</a>&nbsp;&nbsp;'
				var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			
		  		for(var i=0; i<str.length; i++)
		   		{
			  	    var nextChar = str.charAt(i);
			 	 	viewText+='<a  class="clickonalphabets" value="'+nextChar+'">'+ nextChar +'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		   		}
				viewText+="</td></tr>"
				this.$el.append(viewText)
    	
  		this.collection.each(this.addOne, this)
  		if(this.collection.length <= 20)
  		{
  		  this.$el.append('<tr><td><button onClick="nextButton">Next</buttton></td></tr>')
  		
  		}
  		
    },

    render: function() {
        
        
	   
    	var roles=this.getRoles()
    	if(roles.indexOf('Manager')>=0)
    	{
    		this.display=true
    	}
    	else{
    		this.display=false
    	}
      this.addAll()
    },
     getRoles:function(){
        
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            
            return roles
        }

  })

})


