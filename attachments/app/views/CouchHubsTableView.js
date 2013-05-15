var CouchHubsTableView = Backbone.View.extend({

  tagName: "table",

  className: "table table-striped",

  initialize: function(){
    this.collection.on('add', this.addOne, this)
    this.collection.on('reset', this.addAll, this)
    this.$el.append("<h2>Databases on this device</h2><a href='/hubbell/_design/hub/index.html?q=hubs#sync-app'>View databases on this device</a><br><br><BR><BR><BR><BR>")
    this.$el.append("<h2>Databases on devices in this area</h2><div style='padding: 15px'><h3 style='float:left;'>Katapor School BeLL</h3><a style='float: left; margin: 16px;' class='btn' href='add-couch-hub.html'> <i class='icon-plus-sign'></i> Create a new Database</a></div>")
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


