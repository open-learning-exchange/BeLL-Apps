$(function() {

  App.Views.MeetupSpan = Backbone.View.extend({

    tagName: "td",

    className: 'meetup-box',

    template : $("#template-Meetup").html(),

    render: function () {
      
      var vars = this.model.toJSON()
      this.$el.append(_.template(this.template, vars))
    }

  })

})
