$(function() {
  App.Views.NationApplicationsTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",
    
    
    vars:{},
    
    addOne: function(model){
      var Row = new App.Views.NationApplicationRow({model: model})
          Row.render()
      this.$el.append(Row.el)
    },

    addAll: function(){
      // @todo this does not work as expected, either of the lines
      // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
    },

    render: function() {
    
      this.$el.append('<thead><tr><th>Organisation Name</th><th>Primary Contact</th><th>Actions</th></tr></thead>')
      this.addAll()
    }

  })

})


