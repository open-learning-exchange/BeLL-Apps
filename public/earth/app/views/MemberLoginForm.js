$(function() {

  App.Views.MemberLoginForm = Backbone.View.extend({
    template: $('#template-login').html(),
    vars: {},
    className: "form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {
      // create the form
      this.$el.html(_.template(this.template, this.vars))
      // this.form = new Backbone.Form({model:this.model})
      // $('#Login-form',this.$el).append(this.form.render().el)
      // give the form a submit button
      var $button = $('<button class="btn btn-success" id="formButton" style="background-color:#34495e; font-weight:700" >Sign In</button>')
      $('#submit-button',this.$el).append($button)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
//      this.setForm()
    },

    setForm: function() {
      var memberLoginForm = this
      var username=$('#username').val()
      var password=$('#password').val()
      $.getJSON('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + username + '"', function(response) {
      if(response.rows[0]){
          console.log("response: ");
        console.log(response);
        if(response.total_rows > 0 && response.rows[0].doc.password == password) {
          if(response.rows[0].doc.status == "active"){
            var date = new Date();
            //cookies are stored for /apps/_design/bell (same url for personal and lms)
          	$.cookie('Member.login', response.rows[0].doc.login, {
                                    path: "/apps/_design/bell"
                                })
            $.cookie('Member._id', response.rows[0].doc._id, {
                                    path: "/apps/_design/bell"
                                })
            $.cookie('Member.expTime', date, {
                                    path: "/apps/_design/bell"
                                })
            // save user's roles in cookie as well
//            $.cookie('Member.roles', response.rows[0].doc.roles, {
//               path: "/apps/_design/bell"
//            })
            if ($.inArray('student', response.rows[0].doc.roles) != -1) {
              if(response.rows[0].doc.roles.length < 2){
                    alert("You are not authorized to sign in");
              }
              else{
                 memberLoginForm.trigger('success:login');
              }
            }
            else {
              memberLoginForm.trigger('success:login');
            }
          }
          else{
            alert("Your account is deactivated");
          }
        }
        else {
          alert('Password Incorrect');
        }
      }
      else {
        alert('Login Incorrect');
      }
    });
    },


  })
})
