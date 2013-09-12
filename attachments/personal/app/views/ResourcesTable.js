$(function() {

  App.Views.ResourcesTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",

    //template: $('#template-ResourcesTable').html(),

    initialize: function(){
      //this.$el.append(_.template(this.template))
    },

    addOne: function(model){
      var resourceRowView = new App.Views.ResourceRow({model: model})
      resourceRowView.render()  
      this.$el.append(resourceRowView.el)
    },

    addAll: function(){
      this.collection.forEach(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})

