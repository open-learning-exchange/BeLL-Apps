var CouchHubResourcesTableView = Backbone.View.extend({

  tagName: "table",

  className: "table table-striped",

  initialize: function(){
    this.collection.on('add', this.addOne, this)
    this.collection.on('reset', this.addAll, this)
    var that = this
    $.couch.db(thisDb).openDoc("whoami", {
      success: function(doc) {
        that.$el.append("<div style='padding: 15px'><h3 style='float:left;'>Documents in " + doc.name + "</h3><a style='float: left; margin: 16px;' class='btn' href='add-couch-hub-resource.html#"+thisDb+"'> <i class='icon-plus-sign'></i> Create a new Document</a></div>")
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


