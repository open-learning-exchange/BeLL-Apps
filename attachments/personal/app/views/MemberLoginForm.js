$(function() {

  App.Views.MemberLoginForm = Backbone.View.extend({
    
    className: "form login-form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey"
    },

    render: function() {
      // create the form
      this.form = new Backbone.Form({model:this.model})
      this.$el.append(this.form.render().el)
      // give the form a submit button
      var $button = $('<a class="login-form-button btn btn-block btn-lg btn-success" id="formButton">Submit</button>')
      this.$el.append($button)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      var that = this
      this.form.commit()
      var credentials = this.form.model
      var db = null;
      db = PouchDB('members')
     
      function map(doc) {
        if(doc.login) {
          emit(doc.login, null);
        }
      }
      db.query({map: map}, {
        reduce: false, 
        key: credentials.get('login'), 
        include_docs: true
      }, function(err, response) {
        if(response.total_rows > 0 && response.rows[0].doc.pass == credentials.get('pass')) {
          $.cookie('Member.login', response.rows[0].doc.login)
          $.cookie('Member._id', response.rows[0].doc._id)
          console.log('Login successful')
          that.trigger('success:login')
        }
      });
    },


  })

})
