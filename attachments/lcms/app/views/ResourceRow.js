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

    vars: {},

    template : _.template($("#template-ResourceRow").html()),

    initialize: function() {
      this.model.on('destroy', this.remove, this)
    },
    
    render: function () {
      this.prepareVars()
      this.on('varsReady', function() {
        this.$el.append(this.template(this.vars))
      })
    },

    prepareVars : function() {
      this.vars = {
        name: this.model.get('name'),
        openWith: this.openWith(),
        id: this.model.id,
        sendTo: "#collection/resource/send/" + App.CollectionDb + "/" + this.model.id
      }
      this.on('openWithReady', function() {
        this.trigger('varsReady')
      })
    },

    openWith: function() {

      var openWith
      switch(this.model.get('openWith')){ 
        case "pdf-js-viewer": 
          var that = this
          $.couch.db('files').openDoc(this.model.id, {success: function(doc) {
            if (_.has(doc, '_attachments')) {
              var attachments = _.keys(doc._attachments)
              openWith = App.server + "/hubble/_design/pdf-js-viewer/web/viewer.html?url=/files/" + doc._id + "/" + attachments[0]
              that.vars.openWith = openWith
              that.trigger('openWithReady')
            }
            else {
              that.vars.openWith = ''
              that.trigger('openWithReady') 
            }
          }})
        break
      } 


    }

  })

})
