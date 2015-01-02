$(function() {
  App.Views.CommunitiesTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",
    
    
    vars:{},
    
    addOne: function(model){
      var CommunityRow = new App.Views.CommunityRow({model: model})
      CommunityRow.render()  
     this.$el.append(CommunityRow.el)
    },

    addAll: function(){
      // @todo this does not work as expected, either of the lines
      // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
    },

    render: function() {
    
     this.$el.append('<tr><th>Community-Name</th><th>#Members</th><th colspan="2">Actions</th></tr>')
      this.addAll()
    }

  })

})


