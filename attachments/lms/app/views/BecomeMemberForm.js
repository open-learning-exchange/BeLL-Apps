$(function() {

  App.Views.BecomeMemberForm = Backbone.View.extend({
    
    className: "form",

    events: {
      "click #formButton": "setForm",
      "submit form" : "setFormFromEnterKey",
    },
    
    render: function() {
      // create the form
      this.form = new Backbone.Form({ model: this.model })
      this.$el.append(this.form.render().el)
      this.form.fields['status'].$el.hide()
      this.form.fields['yearsOfTeaching'].$el.hide()
      this.form.fields['teachingCredentials'].$el.hide()
      this.form.fields['subjectSpecialization'].$el.hide()
      this.form.fields['forGrades'].$el.hide()
      this.form.fields['visits'].$el.hide()
      
      
      
      var that = this
      this.form.fields['roles'].$el.change(function(){
        var values = new Array()
         $('input[type="checkbox"]:checked').each(function() {
                values.push(this.value)
         })    
          if(values.indexOf("lead") > -1){
              that.form.fields['yearsOfTeaching'].$el.show()
              that.form.fields['teachingCredentials'].$el.show()
              that.form.fields['subjectSpecialization'].$el.show()
              that.form.fields['forGrades'].$el.show()
           }
            else{
              that.form.fields['yearsOfTeaching'].$el.hide()
              that.form.fields['teachingCredentials'].$el.hide()
              that.form.fields['subjectSpecialization'].$el.hide()
              that.form.fields['forGrades'].$el.hide()
              
            }
        
      })
      // give the form a submit button
      var $button = $('<a class="btn btn-success" id="formButton">Save</button>')
      this.$el.append($button)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
  		if(this.form.validate()!=null)
  		{
			return
  		}
  
    	
      var that = this
      this.model.once('sync', function() {
        alert("Thank you for becoming a member")
        $.cookie('Member.login', response.rows[0].doc.login,{path:"/apps/_design/bell/lms"})
        $.cookie('Member._id', response.rows[0].doc._id,{path:"/apps/_design/bell/lms"})
        $.cookie('Member.login', response.rows[0].doc.login,{path:"/apps/_design/bell/personal"})
        $.cookie('Member._id', response.rows[0].doc._id,{path:"/apps/_design/bell/personal"})
        that.trigger('BecomeMemberForm:done')
      })
      // Put the form's input into the model in memory
      this.form.setValue({status:"active"})
      this.form.commit()
      var addMem = true
            var existing = new App.Collections.Members()
            existing.fetch({async:false})
            existing.each(function(m){
                    if(m.get("login") == that.model.get("login")){
                      alert("Login already exist")
                      addMem = false  
                    }
             })
            
            
      // Send the updated model to the server
      if($.inArray("lead",this.model.get("roles")) == -1){
              that.model.set("yearsOfTeaching",null)
              that.model.set("teachingCredentials",null)
              that.model.set("subjectSpecialization",null)
              that.model.set("forGrades",null)
      }
      this.model.set("visits",0)
      if(addMem){
          this.model.save()
      }
    },


  })

})
