$(function () {

    App.Views.Configurations = Backbone.View.extend({
    
        initialize: function () {
            this.$el.html('<h3>Please Add the Configurations First<h3>')
        },
        events: {
            "click #formButton": "setForm",
        },

        render: function () {
           this.form = new Backbone.Form({
                model: this.model
            })
           this.$el.append(this.form.render().el)
            this.$el.append('<a style="margin-left:2px" class="btn btn-success" id="formButton">Submit Configurations </a>')
            
        },
        setForm:function(){
          
          this.form.commit()
        
         if (this.form.validate() != null) {
                return
            }
            
          var Config=this.form.model
          
          var config = new App.Collections.Configurations()
    	    	config.fetch({async:false})
    	    	var con=config.first()
    	    	
    	    	con.set('name',Config.get('name'))
    	    	con.set('nationName',Config.get('nationName'))
    	    	con.set('nationUrl',Config.get('nationUrl'))
    	    	con.set('code',Config.get('code'))
    	    	con.set('type',Config.get('type'))
    	    	
    	    	
                con.save(null,{ success: function(doc,rev){
        
              			  	alert('Configurations are Successfully Added')
              			    Backbone.history.navigate('dashboard', {trigger: true})
              			    //$('#nav').show()
  						}})
    	    	

        
        },

    })

})