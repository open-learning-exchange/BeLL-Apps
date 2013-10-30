$(function() {

  App.Views.MemberLoginForm = Backbone.View.extend({
    
    className: "form login-form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey",
		"click #formButton2": "signup"
    },

    render: function() {
      // create the form
      this.form = new Backbone.Form({model:this.model})
      this.$el.append(this.form.render().el)
      // give the form a submit button
      var $button = $('<a class="login-form-button btn btn-block btn-lg btn-success" id="formButton">Login</button>')
var $button2 = $('<div class="signup-div"><a class="signup-form-button btn btn-block btn-lg btn-info" id="formButton2">SignUp</button></div>')
      this.$el.append($button) 
this.$el.append($button2)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

 signup: function() {
	 Backbone.history.navigate('member/add', {trigger: true})
	},

    setForm: function() {
      var memberLoginForm = this
      this.form.commit()
      var credentials = this.form.model
      $.getJSON('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + credentials.get('login') + '"', function(response) {
      if(response.total_rows > 0 && response.rows[0].doc.pass == credentials.get('pass')) {
          $.cookie('Member.login', response.rows[0].doc.login)
          $.cookie('Member._id', response.rows[0].doc._id)
          memberLoginForm.trigger('success:login')
        }
        else {
          alert('Login or Pass incorrect.')
        }
      });
    },


  })

})
