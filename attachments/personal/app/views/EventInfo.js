$(function () {

    App.Views.EventInfo = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "table table-striped resourceDetail",
        sid: null,
        rid: null,
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyEvent": function (e) {
            
             var vars = this.model.toJSON()
             var mId=$.cookie('Member._id')
             
             this.model.destroy()
             
             alert("Event Successfully Deleted!!!")
                    Backbone.history.navigate('calendar', {
                        trigger: true
                    })
      
        }
        },
        initialize: function () {
            this.$el.append('<th colspan="2"><h6>Event Detail</h6></th>')
        },
        render: function () {
            var vars = this.model.toJSON()
            var date=new Date(vars.schedule)
                vars.schedule=date.toUTCString()
                
            console.log(vars)
            
            this.$el.append("<tr><td>Title</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>Description</td><td>" + vars.description + "</td></tr>")
            this.$el.append("<tr><td>Start Date</td><td>" + vars.startDate + "</td></tr>")
            this.$el.append("<tr><td>End Date</td><td>" + vars.endDate+ "</td></tr>")
            this.$el.append("<tr><td>Timing</td><td>" + vars.startTime + "-"+vars.endTime+"</td></tr>")
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyEvent">Destroy</button><a href="#calendar" style="margin-left:10px" class="btn btn-info">&lt;&lt; Calendar</a></td></tr>')

        },

    })

})