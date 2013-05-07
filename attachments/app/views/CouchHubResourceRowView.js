var CouchHubResourceRowView = Backbone.View.extend({

  tagName: "tr",

  events: {
    "click .destroy" : function() {
      this.model.destroy()
    }
  },

  template : _.template($("#template-CouchHubResourceRowView").html()),

  initialize: function() {
    this.model.on('destroy', this.remove, this)
  },
  
  render: function () {
    this.$el.append(this.template(this.model.toJSON()))
  },

  openWith: function() {

    var openWith
    switch(this.model.get('openWith')){ 
      case "PDFjs": 
        var attachments = _.keys(this.model.get('_attachments'))
        openWith = "../apps/PDFjs/web/viewer.html?url=/"+ thisDb + "/" + this.model.get('_id') + "/" + attachments[0]
        break
    } 

    return openWith

  }

}); 
