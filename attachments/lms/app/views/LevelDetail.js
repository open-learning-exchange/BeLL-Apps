$(function() {

  App.Views.LevelDetail = Backbone.View.extend({

    tagName: "table",
    className: "table table-striped",
    
    events: {
     // Handling the Destroy button if the user wants to remove this Element from its shelf
      "click .remover" : function(e) {
	    var rid = e.currentTarget.value
	    var rtitle = this.model.get("resourceTitles")
	    var rids = this.model.get("resourceId") 
	    var newTitles = new Array()
	    var newIds = new Array()
	    var i
	    for(i=0;i < rids.length ; i++ ){
	      if(rids[i]!=rid)
	       {
		  newIds.push(rids[i])
		  newTitles.push(rtitle[i])
	       }
	       else
	          break;
	    }
	    this.model.set("resourceId",newIds)
	    this.model.set("resourceTitles",newTitles)
	    this.model.save()
	    this.model.on('sync',function(){
		location.reload()
	    })
	    
	}
    },
  render: function() {
	var i=0
	var rtitle = this.model.get("resourceTitles")
	var rid = this.model.get("resourceId")
	for(i=0;i<this.model.get("resourceTitles").length;i++){
	  var r = new App.Models.Resource({"_id":rid[i]})
	  r.fetch({async:false})
	  if(r.get("_attachments")){
	  this.$el.append("<tr><td>"+rtitle[i]+"</td><td><a class='btn btn-info' href='/apps/_design/bell/bell-resource-router/index.html#open/"+rid[i]+"' target='_blank'><i class='icon-eye-open'></i>View</a></td><td><button class='remover btn btn-danger' value='"+rid[i]+"'>Remove </button><input type='hidden' id='"+rid[i]+"' value='"+rtitle[i]+"'/>")    
	}
	else{
	  this.$el.append("<tr><td>"+rtitle[i]+"</td><td>No Attachment</td><td><button class='remover btn btn-danger' value='"+rid[i]+"'>Remove </button><input type='hidden' id='"+rid[i]+"' value='"+rtitle[i]+"'/>")
	}
      }
  }

  })

})

