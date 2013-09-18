$(function() {

  App.Views.MemberLoginForm = Backbone.View.extend({
    
    className: "form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {
      // create the form
      this.form = new Backbone.Form({model:this.model})
      this.$el.append(this.form.render().el)
      // give the form a submit button
      var $button = $('<a class="btn" id="formButton">go</button>')
      this.$el.append($button)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      alert('')
      // @todo Check login and pass
    },


  })

})
