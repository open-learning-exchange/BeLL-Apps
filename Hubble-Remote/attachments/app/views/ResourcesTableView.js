var ResourcesTableView = Backbone.View.extend({

  tagName: "table",

  className: "table table-striped",

  initialize: function(){
    this.collection.on('add', this.addOne, this)
    this.collection.on('reset', this.addAll, this)
    var that = this
    $.couch.db(thisDb).openDoc("whoami", {
      success: function(doc) {
        that.$('tr.header').append("<td colspan=99 style='padding: 15px'><h3 style='float:left;'>Resources in " + doc.name + "</h3><a style='float: left; margin: 16px;' class='btn' href='add-couch-document.html#"+thisDb+"'> <i class='icon-plus-sign'></i> Create a new Resource</a></td>")
      }
    })
  },

  addOne: function(model){
    var resourceRowView = new window.ResourceRowView({model: model})
    resourceRowView.render()  
    this.$el.append(resourceRowView.el)
  },

  addAll: function(){
    this.collection.forEach(this.addOne, this)
  },

  render: function() {
    this.$el.append("<tr class='header'></tr>")
    this.addAll()
  }

})


