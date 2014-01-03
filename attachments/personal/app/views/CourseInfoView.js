$(function() {

  App.Views.CourseInfoView = Backbone.View.extend({

  
    authorName : null,  
    tagName: "table",

    className: "courseInfo-table",
    initialize: function(){ 
	 this.$el.html('<th colspan="20">Course Information</th>')  
    },

    add: function(model){
        //Single Author Should not be displayed multiple times on The Screen
	
    },


    render: function() {
    
      console.log(this.model)
      console.log(this.leader)
      
      var courseInfo=this.model.toJSON()
      var leaderInfo=this.leader.toJSON()
      
      this.$el.append('<tr><td>Name : </td><td>' + courseInfo.name + '</td></tr>')
       this.$el.append('<tr><td>Levels : </td><td>' + courseInfo.levels + '</td></tr>')     
      this.$el.append('<tr><td>Description : </td><td>' + courseInfo.description + '</td></tr>')
      
      this.$el.append('<tr><td>LeaderName: </td><td>' + leaderInfo.firstName+ ' '+leaderInfo.lastName+'</td></tr>')
      this.$el.append('<tr><td>Leader Email : </td><td>' + courseInfo.leaderEmail + '</td></tr>')
      this.$el.append('<tr><td>Leader Phone Number : </td><td>' + courseInfo.leaderPhone + '</td></tr>')
      var bgcolor=''
      var fgcolor=''
       if(courseInfo.backgroundColor=='')
          bgcolor='Not Set'
      this.$el.append('<tr><td>Background Color : </td><td><div style="border:2px solid black;width:50px;height:20px;background-color:'+courseInfo.backgroundColor+'"></div>'+bgcolor+'</td></tr>')
      if(courseInfo.foregroundColor=='')
          fgcolor='Not Set'
      this.$el.append('<tr><td>foreground Color :</td><td><div style="border:2px solid black;width:50px;height:20px;background-color:'+courseInfo.foregroundColor+'"></div>'+fgcolor+'</td></tr>')
      
    },

  })

})

