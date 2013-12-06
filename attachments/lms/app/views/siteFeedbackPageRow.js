$(function() {

  App.Views.siteFeedbackPageRow = Backbone.View.extend({
  template0 : $("#template-siteReviewRowAdmin").html(),
  template1 : $("#template-siteReviewRownoAdmin").html(),
   tagName: "tr",
    authorName : null,
   events: {
      "click #resolveButton": "resolve",
    },
 	
 	resolve: function(e){
 		console.log(e)
 		e.preventDefault()
    	this.model.on('sync', function() {
        location.reload(); 
        })
          this.model.save( {Resolved : "1"}, {success :function(){}});
 	},
 	
   initialize: function(){
     if(  $.cookie('Member.login')=='admin'){
    this.template=this.template0
   }
  else{
  	this.template=this.template1
  }
   
   },
   
    render: function() {
  
  	      var vars = this.model.toJSON()
  	        this.$el.html(_.template(this.template, vars))
    }

  })

})

