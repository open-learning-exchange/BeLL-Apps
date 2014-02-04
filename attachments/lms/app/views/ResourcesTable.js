$(function() {

  App.Views.ResourcesTable = Backbone.View.extend({

    tagName: "table",
	isAdmin:null,
    className: "table table-striped",

    //template: $('#template-ResourcesTable').html(),

    initialize: function(){
      //this.$el.append(_.template(this.template))
     
    },
  addOne: function(model){
      var resourceRowView = new App.Views.ResourceRow({model: model,admin:this.isAdmin})
      resourceRowView.isManager = this.isManager
      resourceRowView.render()  
      this.$el.append(resourceRowView.el)
    },

    addAll: function(){
           
    if(this.isadmin > -1){
    	this.isAdmin=1
    }
    else{
    	this.isAdmin=0
    }
      this.collection.forEach(this.addOne, this)
    },

    render: function() {
       this.$el.html("<tr><th>Title</th><th colspan='6'>Actions</th></tr>")
      this.addAll()
    }

  })

})

