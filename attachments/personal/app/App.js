$(function() {


  App = new (Backbone.View.extend({

    // Settings
    Server: '',

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
      this.$el.html(_.template(this.template))
      Backbone.history.start({pushState: false})
    },

    closeModal: function() {
      $("#modal").modal("hide")
    },


    pull_doc_ids: function(include_doc_ids, from, to) {
      this.trigger('start:pull_doc_ids')
      var App = this
      var all_doc_ids = []
      var exclude_doc_ids = []
      Pouch(from, function(err, remote) {
        remote.allDocs({}, function(err, res) {
          console.log(res)
          // Get all_doc_ids
          _.each(res.rows, function(row) { 
            all_doc_ids.push(row.id) 
          })
          // Build exclude_doc_ids
          _.each(all_doc_ids, function(id) {
            if(!_.contains(include_doc_ids, id)) {
              exclude_doc_ids.push(id)
            }
          })
          console.log(exclude_doc_ids)
          remote.replicate.to(to, { doc_ids:exclude_doc_ids }, function(err, res) {
            console.log(res)
            App.trigger('done:pull_doc_ids')
          })
        })
      })
    }

  }))


})
