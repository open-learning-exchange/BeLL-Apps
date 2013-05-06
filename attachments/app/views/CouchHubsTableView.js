var CouchHubsTableView = Backbone.View.extend({

  tagName: "table",

  className: "table table-striped",

  initialize: function(){
    this.collection.on('add', this.addOne, this)
    this.collection.on('reset', this.addAll, this)
    this.$el.append("<a href='add-couch-hub.html'> <i class='icon-plus-sign'></i> Create a new Hub</a>")
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


