$(function() {

  App.Views.NotificationTable = Backbone.View.extend({
    
    tagName: "table",
    className: "notification-table table-striped",
    authorName : null,
    
    initialize: function(){
	 this.$el.append('<th><h5>Sender<h5></th><th><h5>Title<h5></th><th><h5>Type<h5></th><th><h5>Actions<h5></th>')
    },
    addOne: function(model){
          art = new App.Views.NotificationRow({model: model})
          art.render()  
          this.$el.append(art.el)  
       
    },

    addAll: function(){
      this.collection.forEach(this.addOne, this)
    },
    render: function() {
      this.addAll()
    }

  })

})