$(function() {

  App.Views.ReportsTable = Backbone.View.extend({

    tagName: "table",
	isManager:null,
    className: "table table-striped",

    //template: $('#template-ResourcesTable').html(),

    initialize: function(){
      //this.$el.append(_.template(this.template))
    },
  addOne: function(model){
      var reportRowView = new App.Views.ReportsRow({model: model})
      reportRowView.isManager = this.isManager
      reportRowView.render()
      this.$el.append(reportRowView.el)
    },

    addAll: function(){
    this.$el.append('<tr><th>Time</th><th>Title</th><th>Author</th><th>Views</th><th colspan="3">Actions</th></tr>')
      this.collection.forEach(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})

