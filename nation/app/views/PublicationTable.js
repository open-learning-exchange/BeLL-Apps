$(function() {

  App.Views.PublicationTable = Backbone.View.extend({

    tagName: "table",
	isManager:null,
    className: "table table-striped",
    //template: $('#template-ResourcesTable').html(),

    initialize: function(){
      //this.$el.append(_.template(this.template))
    },
  addOne: function(model){
      var publicationRowView = new App.Views.PublicationRow({model: model})
      publicationRowView.render()
      this.$el.append(publicationRowView.el)
    },

    addAll: function(){
    this.$el.append('<tr><th>Date Issue</th><th>Issue No.</th><th>Editor Name</th><th>Editor Email</th><th>Editor Phone</th><th colspan="2">Actions</th></tr>')
      this.collection.forEach(this.addOne, this)
    },

    render: function() {
      this.addAll()
    },
  })

})

