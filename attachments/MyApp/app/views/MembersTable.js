$(function() {
  App.Views.MembersTable = Backbone.View.extend({

    tagName: "table",

    className: "btable btable-striped",

    addOne: function(model){
      var memberRow = new App.Views.MemberRow({model: model})
      memberRow.isadmin = this.isadmin
      memberRow.community_code=this.community_code 
      memberRow.render()  
      this.$el.append(memberRow.el)
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
    this.$el.html("<tr><th>Photo</th><th>Name</th><th>Visits</th><th>Email</th><th>Bell-Email</th><th>Actions</th></tr>")
      // @todo this does not work as expected, either of the lines
      // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
      
      var groupLength;
      var context=this
      $.ajax({
    			url : '/members/_design/bell/_view/count?group=false',
    			type : 'GET',
    			dataType : "json",
    			success : function(json) {
    			   memberLength=json.rows[0].value
    	           if(context.displayCollec_Resources!=true)
      				{
					  var pageBottom="<tr><td colspan=7>"
					   var looplength=memberLength/20
					   
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