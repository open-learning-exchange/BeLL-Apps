var CouchHubResourcesTableView = Backbone.View.extend({

  tagName: "table",

  className: "table table-striped",

  initialize: function(){
    this.collection.on('add', this.addOne, this)
    this.collection.on('reset', this.addAll, this)
    var that = this
    $.couch.db(thisDb).openDoc("whoami", {
      success: function(doc) {
        that.$el.append("<h1>Hub: " + doc.name + "</h1>")
        that.$el.append("<a href='add-couch-hub-resource.html'><i class='icon-plus-sign'></i>Create new Resource</a>")
      }
    })
  },

  addOne: function(model){
    var couchHubResourceRowView = new CouchHubResourceRowView({model: model})
    couchHubResourceRowView.render()  
    this.$el.append(couchHubResourceRowView.el)
  },

  addAll: function(){
    this.collection.forEach(this.addOne, this)
  },

  render: function() {
    this.addAll()
  }

})


