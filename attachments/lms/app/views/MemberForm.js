$(function() {

  App.Views.MemberForm = Backbone.View.extend({
    
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
      this.form.fields['selectGrades'].$el.hide()
      
      
      var that = this
      this.form.fields['roles'].$el.change(function(){
        var values = new Array()
         $('input[name="c2_roles"]:checked').each(function() {
                values.push(this.value)
         })    
              if(values.indexOf("lead") > -1){
              that.form.fields['yearsOfTeaching'].$el.show()
              that.form.fields['teachingCredentials'].$el.show()
              that.form.fields['subjectSpecialization'].$el.show()
              that.form.fields['forGrades'].$el.show()
              that.form.fields['forGrades'].$el.change(function(){
              var gradeVal = new Array()
              $('input[name="c2_forGrades"]:checked').each(function() {
                  gradeVal.push(this.value)       
              })
    
                  if(gradeVal.indexOf("Grades") > -1){
                     that.form.fields['selectGrades'].$el.show()
                  }
                  else{
                    that.form.fields['selectGrades'].$el.hide() 
                  }
           })
        }
            else{
              that.form.fields['yearsOfTeaching'].$el.hide()
              that.form.fields['teachingCredentials'].$el.hide()
              that.form.fields['subjectSpecialization'].$el.hide()
              that.form.fields['forGrades'].$el.hide()
              that.form.fields['selectGrades'].$el.hide()
            }
        
      })
      // give the form a submit button
      var $button = $('<a class="btn" id="formButton">save</button>')
      this.$el.append($button)
    },

    setFormFromEnterKey: function(event) {
      event.preventDefault()
      this.setForm()
    },

    setForm: function() {
      var that = this
      this.model.once('sync', function() {
        that.trigger('MemberForm:done')
      })
      // Put the form's input into the model in memory
      this.form.setValue({status:"active"})
      this.form.commit()
      // Send the updated model to the server
      if($inArray("lead",this.model.get("roles")) == -1){
              that.model.set("yearsOfTeaching",null)
              that.model.set("teachingCredentials",null)
              that.model.set("subjectSpecialization",null)
              that.model.set("forGrades",null)
              that.model.set("selectGrades",null)
      }else
      {
          if($inArray("Grades",this.model.get("forGrades")) == -1){
            that.model.set("selectGrades",null)
          }
      }
      
      this.model.save()
    },


  })

})
