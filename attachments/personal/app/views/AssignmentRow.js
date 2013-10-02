$(function() {

  // An row with an assignment which mostly consists of it's associated Resource
  App.Views.AssignmentRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      'click .open': function() {
        Backbone.history.navigate('resource/feedback/add/' + this.model.get('resourceId'), {trigger: true})
      },

    vars: {},

    template : _.template($("#template-AssignmentRow").html()),
    
    render: function () {
      this.vars = this.model.toJSON()
      var resource = new App.Models.Resource({_id: this.model.get('resourceId')})
      resource.on('sync', function() {
        this.vars.resource = resource.toJSON()
        this.$el.html(this.template(this.vars))
      }, this)
      resource.fetch()
    },


  })

})
