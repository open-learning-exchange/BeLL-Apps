$(function() {

  App.Views.addComment = Backbone.View.extend({
    
  	tagName: "div",
    id: "comment-feedback",
    cId:null,
    initialize: function(e){
   		this.cId=e.commentId
   		this.model= new App.Models.reportComment
   		
   	},
   
    events: { 
    'click #submitFormButton': 'submit',
    'click #cancelFormButton': 'cancel'
    },
    cancel:function(){
    $('#debug').hide()
    this.remove()
    },
    submit: function(){
    if(this.form.getValue("comment").length!=0){
   		var now = new Date();
		now.getDate()
  		this.form.setValue({reportId:this.cId})
  		this.form.setValue({commentNumber:(this.collection.length+1)})
  		this.form.setValue({memberLogin:$.cookie('Member.login')})	
  		this.form.setValue({time: now.toString()})
    	this.form.commit()
    	this.model.save()  
   	 	this.form.setValue({comment:""})
   	 	this.collection.fetch({async:false})
   	 	this.model.set({"comment":""})	
   	 	this.render()
     }    
    },
        addOne:function(modl){
		$('#comments').append('<div id=tile><b>Login:</b>'+modl.toJSON().memberLogin+'<br/><b>Time:</b>'+modl.toJSON().time+'<br/><b>Comment:</b>'+modl.toJSON().comment+'</div>')
    console.log(modl.toJSON())
    },
    render: function() {
     $('#debug').show()
    this.$el.html('&nbsp;')
    $('#comments').html('&nbsp;')
    	this.collection.forEach(this.addOne,this)
       this.form = new Backbone.Form({ model: this.model })
       this.$el.append(this.form.render().el)
       this.form.fields['reportId'].$el.hide()
       this.form.fields['commentNumber'].$el.hide()
       this.form.fields['memberLogin'].$el.hide()
       this.form.fields['time'].$el.hide()
       var $button = $('<div id="r-formButton"><button class="btn btn-primary" id="submitFormButton">Add Comment</button><button class="btn btn-info" id="cancelFormButton">Cancel</button></div>')
       this.$el.append($button)
       $("#comments").animate({ scrollTop: $('#comments')[0].scrollHeight}, 3000);
    }

  })

})

