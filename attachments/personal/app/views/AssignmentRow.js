$(function() {

  // An row with an assignment which mostly consists of it's associated Resource
  App.Views.AssignmentRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      'click .open': function() {
        Backbone.history.navigate('resource/feedback/add/' + this.model.get('resourceId'), {trigger: true})
      },

      // Do a preview in a modal
      'click .trigger-modal' : function() {
        $('#myModal').modal({show:true})
      }
    },

    vars: {},

    template : _.template($("#template-AssignmentRow").html()),
    
    render: function () {
      this.vars = this.model.toJSON()
      var resource = new App.Models.Resource({_id: this.model.get('resourceId')})
      resource.on('sync', function() {
        this.vars.resource = resource.toJSON()
        // If there is a openURL, that overrides what we use to open, else we build the URL according to openWith
        if(resource.get('openWhichFile') && resource.get('openWhichFile').length > 0) {
          this.vars.openURL = resource.__proto__.openWithMap[resource.get('openWith')] + '/resources/' + resource.id + '/' + resource.get('openWhichFile')
        }
        else {
          this.vars.openURL = resource.__proto__.openWithMap[resource.get('openWith')] + '/resources/' + resource.id + '/' + _.keys(this.vars.resource._attachments)[0]

        }

        console.log(this.vars.openURL)
        this.$el.html(this.template(this.vars))
      }, this)
      resource.fetch()
      
    },


  })

})
