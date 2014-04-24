$(function() {
  App.Views.MeetUpTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",
	roles:null,
    addOne: function(model){
      var meetupRow = new App.Views.MeetUpRow({model: model,roles:this.roles})
      meetupRow.render()  
      this.$el.append(meetupRow.el)
    },

    addAll: function(){
   	  
   	  this.$el.html("<tr><th>Topic</th><th colspan='4'>Actions</th></tr>")
      var manager = new App.Models.Member({_id:$.cookie('Member._id')})
      manager.fetch({async:false})
      this.roles=manager.get("roles")
 // @todo this does not work as expected, either of the lines
 // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
 
    },

    render: function() {
      this.addAll()
    }

  })

})

