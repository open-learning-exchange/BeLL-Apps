$(function() {

  App.Views.siteFeedback = Backbone.View.extend({
    
    tagName: "div",
   id: "site-feedback",
    authorName : null,
    
   initialize: function(){
   
   },
   
   events: {
      "click #formButton": "setForm",
		"click #CancelButton":"cancelform" ,
		"click #ViewAllButton":"gotoRoute"
    },
gotoRoute: function(){
 Backbone.history.navigate('siteFeedback', {trigger: true})
},
 cancelform: function() {
  $('#site-feedback').animate({height:'toggle'})
  $('#comment',this.$el).val("")    
 },
 setForm: function() {
    if($('#comment').val().length!=0){
           var temp=Backbone.history.location.href
           var now = new Date();
        now.getDate()
        temp=temp.split('#')
        var peri='';
        if($("#priority").is(':checked')){
               peri='urgent'
        
        } 
        this.model.set({
              
              comment:$('#comment').val(),
              category:$('input[name="category"]:checked').val() , 
              priority:peri,
              PageUrl:"Personal:"+temp[1],
              Resolved:'0',
              memberLogin:$.cookie('Member.login'),
              time: now.toString()
            })
    
        this.model.save()  
        alert("Feedback Successfully Sent")
            $('#comment',this.$el).val("")    
     }
    $('#site-feedback').animate({height:'toggle'})
  },



    render: function() {
    
        this.$el.append('<div class="form-field"><input name="PageUrl" id="PageUrl" type="text"></div>  ')
        this.$el.append('<div class="form-field"><input name="priority" value="urgent" id="priority" type="checkbox"><label for="priority">urgent</label></div>  ')
        this.$el.append('<div class="form-field"><textarea  rows="7" type="text" name="comment" id="comment"></textarea></div>')
        this.$el.append('<div class="form-field"><input name="Resolved" id="Resolved" type="text"></div>')
        this.$el.append('<div class="form-field"> <input type="radio" checked name="category" value="Bug">&nbsp Bug &nbsp&nbsp&nbsp<input type="radio" name="category" value="Question">&nbsp Question &nbsp&nbsp&nbsp<input type="radio" name="category" value="Suggestion">&nbsp Suggestion &nbsp&nbsp&nbsp</div>')
        this.$el.append('<div class="form-field"><input name="memberLogin" id="memberLogin" type="text"></div>  ')
        this.$el.append('<div class="form-field"><input name="time" id="time" type="text"></div>    ')
      
      
        $('#PageUrl',this.$el).hide()
        $('#Resolved',this.$el).hide()
        $('#memberLogin',this.$el).hide()
        $('#time',this.$el).hide()

        var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button><button class="btn btn-hg btn-info" id="ViewAllButton">View</button><button class="btn btn-hg btn-primary" id="formButton">Submit</button></div>')
        this.$el.append($button)

    }

  })

})