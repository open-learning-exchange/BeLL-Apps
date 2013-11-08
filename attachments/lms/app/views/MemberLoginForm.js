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
      var memberLoginForm = this
      this.form.commit()
      var credentials = this.form.model
      $.getJSON('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + credentials.get('login') + '"', function(response) {
        console.log(response);
        if(response.total_rows > 0 && response.rows[0].doc.password == credentials.get('password')) {
          if(response.rows[0].doc.status == "active"){
          $.cookie('Member.login', response.rows[0].doc.login)
          $.cookie('Member._id', response.rows[0].doc._id)
          if ($.inArray('student', response.rows[0].doc.roles) == -1) {
              memberLoginForm.trigger('success:login')
          }
          else {
            memberLoginForm.trigger('success:login')
          }
        }
        else{
          alert("Your Account is Deactivated")
        }
      }
        else {
          alert('Login or Pass incorrect.')
        }
      });
    },


  })
})
