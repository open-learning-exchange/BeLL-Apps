$(function() {

  App.Views.ResourceRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .destroy" : function() {
        this.model.destroy()
      },
      "click .trigger-modal" : function() {
        $('#myModal').modal({show:true})
      }
    },

    template : _.template($("#template-ResourceRow").html()),

    initialize: function() {
      this.model.on('destroy', this.remove, this)
    },
    
    render: function () {
      var vars = {
        name: this.model.get('name'),
        openWith: this.openWith(),
        id: this.model.id,
        sendTo: "#collection/resource/send/" + App.thisDb + "/" + this.model.id
        // @todo This hardcoded db is asking for trouble...
      }
      this.$el.append(this.template(vars))
    },

    openWith: function() {

      var openWith
      switch(this.model.get('openWith')){ 
        case "PDFjs": 
          var _attachments = this.model.get('_attachments')
          if(_.isObject(_attachments)) {
            var attachments = _.keys(this.model.get('_attachments'))
            openWith = "../apps/PDFjs/web/viewer.html?url=/"+ thisDb + "/" + this.model.get('_id') + "/" + attachments[0]
          }
          break
      } 

      return openWith

    }

  })

})
