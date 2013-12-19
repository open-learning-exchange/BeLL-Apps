$(function() {

  App.Views.MailView = Backbone.View.extend({
    
    tagName: "ul",
    className: "mail-table",
     template : _.template($("#template-mail").html()),
    initialize: function(){
    },
    

    addOne: function(model){
      var vars=model.toJSON()
      console.log(vars)
      if(vars.subject){
    this.$el.append(this.template(vars))
    	}
    },

    addAll: function(){
      this.collection.forEach(this.addOne, this)
    },
    render: function() {
      this.addAll()
    }

  })

})

