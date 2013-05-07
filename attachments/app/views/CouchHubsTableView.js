var CouchHubsTableView = Backbone.View.extend({

  tagName: "table",

  className: "table table-striped",

  initialize: function(){
    this.collection.on('add', this.addOne, this)
    this.collection.on('reset', this.addAll, this)
    this.$el.append("<div style='padding: 15px'><h1 style='float:left;'>Hubs</h1><a style='float: left; margin: 16px;' class='btn' href='add-couch-hub.html'> <i class='icon-plus-sign'></i> Create a new Hub</a></div>")
  },

  addOne: function(model){
    var couchHubView = new CouchHubRowView({model: model})
    couchHubView.render()  
    this.$el.append(couchHubView.el)
  },

  addAll: function(){
    this.collection.forEach(this.addOne, this)
  },

  render: function() {
    this.addAll()
  }

})


