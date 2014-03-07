$(function() {

  App.Views.PublicationResourceTable = Backbone.View.extend({

    tagName: "table",
	isManager:null,
    className: "table table-striped",

    //template: $('#template-ResourcesTable').html(),

    initialize: function(){
      //this.$el.append(_.template(this.template))
    },
  addOne: function(model){
      var publicationResourceRowView = new App.Views.PublicationResourceRow({model: model})
      publicationResourceRowView.Id=this.Id
      publicationResourceRowView.render()
      this.$el.append(publicationResourceRowView.el)
    },

    addAll: function(){
    this.$el.append('<tr><th>Resource Title</th><th colspan="3">Actions</th></tr>')
    this.collection.forEach(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})

