$(function() {

  App.Views.ResourcesTable = Backbone.View.extend({

  
    authorName : null,  
    tagName: "table",

    className: "table table-striped",
    initialize: function(){
    },
    addOne: function(model){
  
    if(model.get("Tag") == "News"){
        if($.inArray( model.get('author').toLowerCase(),this.authorName) == -1){
            var resourceRowView = new App.Views.ResourceRow({model: model})
            resourceRowView.render()  
            this.$el.append(resourceRowView.el)
            this.authorName.push(model.get('author').toLowerCase())  
       }
    }
    
    },

    addAll: function(){
      this.authorName = []
      this.collection.forEach(this.addOne, this)
    },
    render: function() {
      this.addAll()
    }

  })

})

