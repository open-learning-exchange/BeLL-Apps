$(function() {

  App.Views.CourseScheduleForm = Backbone.View.extend({
  template : $("#template-CourseSchedule").html(),
  events : {
    "click #addcourseschedule" : function(e){
       
       
       /* var cs = new App.Models.CourseSchedule()
        cs.set("courseId",this.courseId)
        cs.set("startTime",$("#startTime").val())
        cs.set("endTime",$("#endTime").val())
        cs.set("startDate",$("#startDate").val())
        cs.set("endDate",$("#endDate").val())
        cs.set("type",$("#type").val())
        if($("#type").val() == "Monthly"){
          cs.set("monthsDates",$("#monthDates").val())
        }
        else if($("#type").val() == "Weekly"){
          cs.set("weekDays",$("#weekDays").val())
        }
        cs.save({success:function(){
          Backbone.history.navigate("")
        }})
        
    */
    }
  },
    render: function () {
      this.$el.append(_.template(this.template))
    }
  })
})