$(function() {

  App.Views.GroupAssignmentsTable = Backbone.View.extend({

    template: $('#template-GroupAssignmentsTable').html(),

    vars: {},
  
    initialize: function() {
      // Update models when they update
      this.collection.on('change', function(model) {
        console.log(model)
      })
      // When collection originally loads, add all
      this.collection.on('sync', function(model) {
        this.addAll()
      }, this)
    },

    addAll: function() {
      this.collection.each(this.addOne, this)
    },

    addOne: function(model){
      var resource = new App.Models.Resource()
      var that = this
      resource.SetRid(model.get('resourceId'))
      resource.fetch({success: function() {
      var vals = resource.attributes.rows[0].doc
      console.log(vals)
      that.$el.children('table').append("<tr>")
      that.$el.children('table').append("<td>"+vals.title+"</td>")
      if(vals._attachments){
        that.$el.children('table').append("<td><a class='btn open' href='/apps/_design/bell/bell-resource-router/index.html#open/"+vals._id+"' target='_blank'>Open</a><td>")
        that.$el.children('table').append("<td><a class='btn open' href='/apps/_design/bell/bell-resource-router/index.html#download/"+vals._id+"' target='_blank'>Download</a><td>")
       } else {
            that.$el.children('table').append("<td>No Attachment</td>")
            that.$el.children('table').append("<td>No Attachment</td>")
       }
       that.$el.children('table').append("<td><a class='btn open' href='#resource/feedback/add/"+model.get('resourceId')+"'>FeedBack </a></td>")
       that.$el.children('table').append("</tr>")
      }})
    },

    render: function() {
      this.$el.html(_.template(this.template, this.vars))
    }

  })

})

