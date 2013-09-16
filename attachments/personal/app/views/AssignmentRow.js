$(function() {

  // An row with an assignment which mostly consists of it's associated Resource
  App.Views.AssignmentRow = Backbone.View.extend({

    tagName: "tr",

    events: {

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
        // @todo We might add the actual fields of the Assignment model to vars later
        // if/when there is interesting data in the model like when it was assigned.
        this.vars.resource = resource.toJSON()
        if(_.isObject(this.vars.resource._attachments)) {
          this.vars.resource.fileName = (_.keys(this.vars.resource._attachments)[0])
            ? _.keys(this.vars.resource._attachments)[0]
            : ''

          this.$el.html(this.template(this.vars))
        }
      }, this)
      resource.fetch()
      
    },


  })

})
