$(function() {

  App.Views.GroupsTable = Backbone.View.extend({

    tagName: "table",
    className: "table table-striped",
	roles:null,
	
    addOne: function(model){
      var groupRow = new App.Views.GroupRow({model: model,roles:this.roles})
      groupRow.publicationId=this.publicationId
      groupRow.render()  
      this.$el.append(groupRow.el)
    },

    addAll: function(){
    
    this.$el.html("<tr><th>Title</th><th colspan='0'>Actions</th></tr>")
    var manager = new App.Models.Member({_id:$.cookie('Member._id')})
        manager.fetch({async:false})
        this.roles=manager.get("roles")
        this.collection.each(this.addOne, this)
    },

    render: function() {
        this.addAll()
    }

  })

})


