$(function() {
  App.Views.NationsTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",
    
    
    vars:{},
    
    addOne: function(model){
      var NationRow = new App.Views.NationRow({model: model})
      NationRow.render()  
      this.$el.append(NationRow.el)
    },

    addAll: function(){
      // @todo this does not work as expected, either of the lines
      // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
    },

    render: function() {
    
      this.$el.append('<thead><tr><th>Nation Name</th><th>Location</th><th>Communities</th></tr></thead>')
      this.addAll()
    }

  })

})


