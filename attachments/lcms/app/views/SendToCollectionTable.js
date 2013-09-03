$(function() {

  App.Views.SendToCollectionTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",

    initialize: function(){
      this.collection.on('add', this.addOne, this)
      this.collection.on('reset', this.addAll, this)
      this.$el.append("<div style='padding: 15px'><h2 style='float:left;'>Send to Collection...</h2></div>")
    },

    addOne: function(model){
      var rowView = new App.Views.SendToCollectionRow({model: model})
      rowView.render()  
      this.$el.append(rowView.el)
    },

    addAll: function(){
      this.collection.forEach(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})
