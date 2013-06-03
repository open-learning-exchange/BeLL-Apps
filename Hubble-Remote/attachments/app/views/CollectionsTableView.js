var CollectionsTableView = Backbone.View.extend({

  tagName: "table",

  className: "table table-striped",

  initialize: function(){
    this.collection.on('add', this.addOne, this)
    this.collection.on('reset', this.addAll, this)
    $("#app").append((_.template($("#collections-nav-template").html()))())
    $("#app").append("<a style='position: relative; bottom: 60px; float: right;' class='btn' href='add-couch-database.html'> <i class='icon-plus-sign'></i> Create a new Collection</a>")
  },

  addOne: function(model){
    var collectionView = new CollectionRowView({model: model})
    collectionView.render()  
    this.$el.append(collectionView.el)
  },

  addAll: function(){
    this.collection.forEach(this.addOne, this)
  },

  render: function() {
    this.addAll()
  }

})


