$(function () {

    App.Views.meetupView = Backbone.View.extend({


        authorName: null,
        tagName: "table",

        className: "btable btable-striped",
        initialize: function () {
            this.$el.html('<h3 colspan="20">Meetup | '+this.model.get('title')+'</h3>')
        },
        events:{
           
          'click  #joinMeetUp':'joinMeetUp',
          'click #meetupsInvitation':'MemberInvite'
        
        },

MemberInvite: function () {

                $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
            var inviteModel = new App.Models.InviMeetup()
                inviteModel.resId = this.model.get("_id")
                inviteModel.senderId = $.cookie('Member._id')
                inviteModel.type = this.model.get("kind")
                inviteModel.title = this.model.get("title")
                inviteModel.description = this.model.get("description")
            var inviteForm = new App.Views.MeetupInvitation({
                    model: inviteModel
                })
                inviteForm.render()
                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el)

        },
        add: function (model) {
            //Single Author Should not be displayed multiple times on The Screen

        },
        joinMeetUp:function(){
        
         var UMeetup=new App.Collections.UserMeetups()
                UMeetup.memberId=$.cookie('Member._id')
                UMeetup.meetupId=this.model.get('_id')
                  
                UMeetup.fetch({async:false}) 
             if(UMeetup.length>0)
             {
                 alert("Your have already joined this Meetup")
                 return 
             }
        
        
          var UserMeetUp=new App.Models.UserMeetup()
          UserMeetUp.set('memberId',$.cookie('Member._id'))
          UserMeetUp.set('meetupId',this.model.get('_id'))
          UserMeetUp.set('meetupTitle',this.model.get('title'))
          UserMeetUp.save()
          alert('successfully Added to your Meetups')
          Backbone.history.navigate('dashboard', {
                         trigger: true
                    })
        },


        render: function () {
            
            $('#invitationdiv').hide()
            var meetupInfo = this.model.toJSON()
                var date=new Date(meetupInfo.schedule)
                meetupInfo.schedule=date.toUTCString()

            this.$el.append('<tr><td><b>Title  </b></td><td>' + meetupInfo.title + '   ('+meetupInfo.category+')</td></tr>')  
            this.$el.append('<tr><td><b>Category  </b></td><td>' +meetupInfo.category +'</td></tr>')
            this.$el.append('<tr><td><b>Description </b></td><td>' + meetupInfo.description + '</td></tr>')
            this.$el.append('<tr><td><b>Location </b></td><td>' + meetupInfo.meetupLocation + '</td></tr>')
            this.$el.append('<tr><td><b>Date </b></td><td>' + meetupInfo.startDate+' --- '+meetupInfo.endDate + '</td></tr>')
            this.$el.append('<tr><td><b>Time </b></td><td>' + meetupInfo.startTime+' --- '+meetupInfo.endTime+ '</td></tr>')
            
            this.$el.append('<tr><td><a class="btn btn-success" id="joinMeetUp">Join Meetup</a><a style="margin-left:20px" class="btn btn-info" id="meetupsInvitation">Invite Members</a><a style="margin-left:20px" class="btn btn-info" href="#meetups">Back</a></td><td></td></tr>')
        }

    })

})