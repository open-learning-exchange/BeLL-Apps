$(function() {

  App.Views.Dashboard = Backbone.View.extend({

    template: $('#template-Dashboard').html(),

    vars: {},

    render: function() {
      var dashboard = this
      this.$el.html(_.template(this.template, this.vars))
      groups = new App.Collections.Groups()
      groups.fetch({success: function() {
        groupsSpans = new App.Views.GroupsSpans({collection: groups})
        groupsSpans.render()
        // dashboard.$el.children('.groups').append(groupsDiv.el)
        $('.groups').append(groupsSpans.el)
      }})
    }

  })

})

