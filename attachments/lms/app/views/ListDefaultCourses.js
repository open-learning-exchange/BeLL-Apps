$(function() {

  App.Views.ListDefaultCourses = Backbone.View.extend({

    tagName: "table",
    className: "table table-striped",
    
    events: {
     // Handling the Destroy button if the user wants to remove this Element from its shelf
      "click .courseremover" : function(e) {
	    var rid = e.currentTarget.value
	    var rtitle = this.model.get("courseTitles")
	    var rids = this.model.get("courseIds") 
	    var index = rids.indexOf(rid)
	    rids.splice(index,1)
	    rtitle.splice(index,1)
	    this.model.set("courseIds",rids)
	    this.model.set("courseTitles",rtitle)
	    this.model.save()
	    var that = this
	    this.model.on('sync',function(){
	        location.reload()
	    })
	},
     "click .levelResView" : function(e) {
	  var rid = e.currentTarget.attributes[0].value
	  var levelId = this.model.get("_id")
	  var revid = this.model.get("_rev")
	  Backbone.history.navigate('resource/atlevel/feedback/'+rid+'/'+levelId+'/'+revid, {trigger: true})
	},
    },
  render: function() {
	console.log(this.model)
	var i=0
	var rtitle = this.model.get("courseTitles")
	var rid = this.model.get("courseIds")
	this.$el.append("</BR>")
	this.$el.append("<tr><td><B>Course Name</B></td><td><B>Action</B></td></tr>")
	if(this.model.get("courseTitles")){
	for(i=0;i<this.model.get("courseTitles").length;i++){
	this.$el.append("<tr><td>"+rtitle[i]+"</td><<td><button class='courseremover btn btn-danger' value='"+rid[i]+"'>Remove </button><input type='hidden' id='"+rid[i]+"' value='"+rtitle[i]+"'/>")    
      }
    }
  }

  })

})

