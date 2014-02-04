$(function () {

    App.Views.MeetUpForm = Backbone.View.extend({

        className: "form",
        id: 'meetUpForm',
        prevmemlist: null,
        events: {
            "click #MeetUpformButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #inviteMemberButton": "MemberInvite",
            "click #MeetUpcancel": function () {
                window.history.back()
            }

        },
        MemberInvite: function () {

            if ($("textarea[name='description']").val().length > 0) {
                $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
                var inviteModel = new App.Models.InviFormModel()
                inviteModel.resId = this.model.get("_id")
                inviteModel.senderId = $.cookie('Member._id')
                inviteModel.type = this.model.get("kind")
                inviteModel.title = this.model.get("name")
                var inviteForm = new App.Views.InvitationForm({
                    model: inviteModel
                })
                inviteForm.render()
                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el)
            } else {
                alert("Specify course description first")
            }
        },
        render: function () {
           
            $('#invitationdiv').hide()
            // members is required for the form's members field
            
            var btnText='Save'
            if(!this.model.get('_id')) 
              this.$el.append('<h3>Start a New Meetup</h3>')
             else
             {
               this.$el.append('<h3>Edit Meetup | '+this.model.get('title')+'</h3>')
               btnText='Update'
             }
             
             
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['Time'].$el.hide();
            
           
            var $sbutton = $('<a class="btn btn-success" id="MeetUpformButton">'+btnText+'</a>')
            var $ubutton = $('<a class="btn btn-success" id="formButton">Cancel</a>')
           // var $button = $('<a class="btn btn-success" id="meetInvitation">Invite Member</button><a role="button" id="ProgressButton" class="btn" href="#course/report/' + this.model.get("_id") + '/' +this.model.get("name") + '"> <i class="icon-signal"></i> Progress</a>')
            this.$el.append($sbutton)
            //this.$el.append($button)
            this.$el.append("<a class='btn btn-danger' id='MeetUpcancel'>Cancel</a>")
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function () {
            var that = this
            this.model.once('sync', function () {
                console.log(that.model)
                Backbone.history.navigate('meetups', {
                    trigger: true
                })
            })
            // Put the form's input into the model in memory
            this.form.commit()
            
            if (this.model.get("title").length == 0) {
                alert("MeetUp title is missing")
            } else if (this.model.get("description").length == 0) {
                alert("MeetUp Description is missing")
            } else if (this.model.get("meetupLocation").length == 0) {
                alert("MeetUp Location is missing")
            }  else {
            
                this.model.set('Time',$('#MeetupStartTime').val())
                this.model.set('creator',$.cookie('Member._id'))
                this.model.save(null,{success:function(responce){
                	var userMeetup=new App.Models.UserMeetups()
            
                  userMeetup.set({
                    memberId:$.cookie('Member._id'),
                    meetupId:responce.get('id'),
                    meetupTitle:responce.get('title'),
                    
                    })
                    
                    userMeetup.save()  
                }})
                
                
                    
            }
        },


    })

})