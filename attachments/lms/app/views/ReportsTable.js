$(function() {

  App.Views.ReportsTable = Backbone.View.extend({

    tagName: "table",
	isAdmin:null,
    className: "table table-striped",

    //template: $('#template-ResourcesTable').html(),

    initialize: function(){
      //this.$el.append(_.template(this.template))
    },
  addOne: function(model){
      var reportRowView = new App.Views.ReportsRow({model: model,admin:this.isAdmin})
      reportRowView.isadmin = this.isadmin
      reportRowView.render()
      this.$el.append(reportRowView.el)
    },

    addAll: function(){
    if(this.isadmin > -1){
    	this.isAdmin=1
    }
    else{
    	this.isAdmin=0
    }
    this.$el.append('<tr><th>Time</th><th>Title</th><th>Author</th><th colspan="3">Actions</th></tr>')
      this.collection.forEach(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})

