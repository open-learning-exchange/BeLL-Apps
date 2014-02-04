$(function () {

    App.Views.MeetupDetails = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "table table-striped resourceDetail",
        sid: null,
        rid: null,
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyMeetupItem": function (e) {
            
             var vars = this.model.toJSON()
             var mId=$.cookie('Member._id')
    
             var userMeetups=new App.Collections.UserMeetups() 
             userMeetups.memberId=mId
             userMeetups.meetupId=vars._id
             
             userMeetups.fetch({async:false})
             
             
         var model;
			 while (model = userMeetups.first()) {
  							model.destroy();
			  }
             
             alert("Successfully removed from My Meetups ")
             Backbone.history.navigate('dashboard', {trigger: true})
             
            
            }
            
        },
        initialize: function () {
            this.$el.append('<th colspan="2"><h6>Meetup Detail</h6></th>')
        },
        render: function () {
            var vars = this.model.toJSON()
            var date=new Date(vars.schedule)
                vars.schedule=date.toUTCString()
                
            console.log(vars)
            
            this.$el.append("<tr><td>Title</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>Description</td><td>" + vars.description + "</td></tr>")
            this.$el.append("<tr><td>Date</td><td>" + vars.schedule + "</td></tr>")
            this.$el.append("<tr><td>Time</td><td>" + vars.Time + "</td></tr>")
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyMeetupItem">Unjoin</button></td></tr>')

        },

    })

})