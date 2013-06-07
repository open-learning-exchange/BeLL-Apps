$(function() {

  App.Views.ResourcesTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",

    template: $('#template-ResourcesTable').html(),

    templateHeader: $('#template-ResourcesTableHeader').html(),

    initialize: function(){
      this.$el.append(_.template(this.template))
      // @todo The better way to approach this would be to attach a Collection model to this view. The whoami doc may
      // be pointless...
      var that = this
      $.couch.db(App.thisDb).openDoc("whoami", {
        success: function(doc) {
          doc.db = App.thisDb
          that.$el.children('.header').append(_.template(that.templateHeader, doc))
        }
      })
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

