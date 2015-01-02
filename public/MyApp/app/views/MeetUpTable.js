$(function() {
  App.Views.MeetUpTable = Backbone.View.extend({

    tagName: "table",

    className: "btable btable-striped",
	roles:null,
    addOne: function(model){
      var meetupRow = new App.Views.MeetUpRow({model: model,roles:this.roles})
      meetupRow.render()  
      this.$el.append(meetupRow.el)
    },
events:{	
    	"click .pageNumber" : function(e)
		{
			this.collection.startkey = ""
			this.collection.skip = e.currentTarget.attributes[0].value
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		},
    
    },
    addAll: function(){
   	  
   	  this.$el.html("<tr><th>Topic</th><th colspan='4'>Actions</th></tr>")
      var manager = new App.Models.Member({_id:$.cookie('Member._id')})
      manager.fetch({async:false})
      this.roles=manager.get("roles")
 // @todo this does not work as expected, either of the lines
 // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
 var groupLength;
      var context=this
      $.ajax({
    			url : '/meetups/_design/bell/_view/count?group=false',
    			type : 'GET',
    			dataType : "json",
    			success : function(json) {
    			   meetupLength=json.rows[0].value
    	           if(context.displayCollec_Resources!=true)
      				{
					  var pageBottom="<tr><td colspan=7>"
					   var looplength=meetupLength/20
					   
					   for(var i=0; i<looplength; i++)
					   {
						  if(i==0)
						  pageBottom+='<a  class="pageNumber" value="'+i*20+'">Home</a>&nbsp&nbsp'
						  else
						  pageBottom+='<a  class="pageNumber" value="'+i*20+'">'+i+'</a>&nbsp&nbsp'
					   }
						pageBottom+="</td></tr>"
					   context.$el.append(pageBottom)
				   }
    			
    			}
  			 })
    },

    render: function() {
      this.addAll()
    }

  })

})

