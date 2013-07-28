$(function() {


  App = new (Backbone.View.extend({

    // Settings
    Server: 'http://192.168.0.111:5984',
    CollectionsDb: 'hubble',
    ResourcesDb: '', // to be set dynamically depending on which Collection is being viewed
    FilesDb: 'files',

    // Backbone structure
    Models: {},
    Views: {},
    Collections: {},
    Vars: {}, // A place to persist variables in the session

    el: "body",

    template: $("#template-app").html(),

    events: {
      // For the x button on the modal
      "click .close" : "closeModal"
    },

    start: function(){
      // Default database
      $.couch.urlPrefix = App.Server
      this.$el.html(_.template(this.template))
      Backbone.history.start({pushState: false})
    },

    closeModal: function() {
      $("#modal").modal("hide")
    },

    sendResource: function(sourceDatabase, targetDatabase, sourceId, target) {
      $.couch.replicate(
        sourceDatabase, 
        targetDatabase, 
        {
          success: function() {
            target.trigger('received')
          },
          error: function(err) {
            alert('Woops, had a problem sending that.')
          }
        },
        {
          doc_ids: [ sourceId ]
        }
      )
    }


  }))


})