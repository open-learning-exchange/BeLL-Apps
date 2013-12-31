$(function() {

  App.Views.CourseScheduleForm = Backbone.View.extend({
  template : $("#template-CourseSchedule").html(),
  events : {
    "click #saveSchedule" : function(e){
        var addToDb = true
        var cs = new App.Models.CourseSchedule()
        if(this.courseId != undefined){
          cs.set("courseId",this.courseId)
          if(this.edit == true){
              cs.set("_id",this.sid)
              cs.set("_rev",this.srevid)
              console.log(cs)    
          }
          
        }else{
          addToDb = false
        }
        if($("#endTime").val().length > 0 && $("#startTime").val().length > 0 ){
           
                  cs.set("startTime",$("#startTime").val())
                  cs.set("endTime",$("#endTime").val())
        }
        else{
                alert("Please Enter time")
                addToDb = false
        }
        if($("#endDate").val().length > 0 && $("#startDate").val().length > 0){
             
             if( (new Date($("#endDate").val()).getTime() > new Date($("#startDate").val()).getTime()))
             {
               cs.set("startDate",$("#startDate").val())
               cs.set("endDate",$("#endDate").val())
             }
             else{
                 alert("Invalid dates specified")
                 addToDb = false 
             }
        }
         else{
              alert("Invalid dates specified")
              addToDb = false 
        }
       
        if($("#location").val().length > 0){
           cs.set("location",$("#location").val())
        } else{
              alert("Location not specified") 
              addToDb = false 
        }
        cs.set("type",$("#type").val())
        if($("#type").val() == "Monthly"){
          cs.set("monthsDates",$("#monthDates").val())
        }
        else if($("#type").val() == "Weekly"){
          cs.set("weekDays",$("#weekDays").val())
        }
       console.log(cs)
       var that = this
        if(addToDb){
          cs.set("kind","Schedule")
          cs.on('sync',function(){
          alert("Schedule Saved Successfully")
          Backbone.history.navigate("#course/manage/"+that.courseId ,{trigger:true})
        })
          cs.save()
          
      }
   }
  },
    render: function () {
      this.$el.append(_.template(this.template))
    }
  })
})