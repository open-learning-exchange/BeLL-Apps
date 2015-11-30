$(function() {

    App.Views.MeetUpForm = Backbone.View.extend({

        className: "form",
        id: 'meetUpForm',
        prevmemlist: null,
        saved: null,
        btnText: 'Save',
        events: {
            "click #MeetUpformButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #InviteMembers": "MemberInvite",
            "click #MeetUpcancel": function() {
                window.history.back()
            }

        },
        MemberInvite: function() {

            var model = this.model
            console.log(model)

            if (!model.get('id')) {
                this.setForm()
                return
            }
            if ($("textarea[name='description']").val().length > 0) {

                $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
                var inviteModel = new App.Models.InviMeetup()
                inviteModel.resId = model.get("id")
                inviteModel.senderId = $.cookie('Member._id')
                inviteModel.type = model.get("kind")
                inviteModel.title = model.get("title")
                inviteModel.description = model.get("description")
                var inviteForm = new App.Views.MeetupInvitation({
                    model: inviteModel
                })
                inviteForm.render()
                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el)
            } else {
                alert("Specify Meetup description first")
            }
        },
        render: function() {

            $('#invitationdiv').hide()
            // members is required for the form's members field

            if (!this.model.get('_id'))
                this.$el.append('<h3>Start a New Meetup</h3>')
            else {
                this.$el.append('<h3>Edit Meetup | ' + this.model.get('title') + '</h3>')
                this.btnText = 'Update'
            }


            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            if (this.btnText != 'Update')
                this.form.fields['Day'].$el.hide();

            var $sbutton = $('<a class="btn btn-success" id="MeetUpformButton">' + this.btnText + '</a>')

            var $ubutton = $('<a class="btn btn-success" id="formButton">Cancel</a>')
            // var $button = $('<a class="btn btn-success" id="meetInvitation">Invite Member</button><a role="button" id="ProgressButton" class="btn" href="#course/report/' + this.model.get("_id") + '/' +this.model.get("name") + '"> <i class="icon-signal"></i> Progress</a>')
            this.$el.append($sbutton)
            //this.$el.append($button)
            if (this.btnText != 'Update')
                this.$el.append('<a class="btn btn-info" id="InviteMembers">Invite Members</a>')

            this.$el.append("<a class='btn btn-danger' id='MeetUpcancel'>Cancel</a>")

            console.log(this.model);

            applyStylingSheet();

            /*  var picker = new Backbone.UI.TimePicker({
             model: this.model,
             content: 'Time',
             })
             */
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },
        setForm: function() {

            if (this.model.get('id')) {
                alert('Saved already')
                return
            }

            var that = this
            /* this.model.once('sync', function () {
             console.log(that.model)
             Backbone.history.navigate('meetups', {
             trigger: true
             })
             })
             */
            // Put the form's input into the model in memory
            this.form.commit()

            if (this.model.get("title").length == 0) {
                alert("Meetup title is missing")
            } else if (this.model.get("description").length == 0) {
                alert("Meetup Description is missing")
            } else if (this.model.get("meetupLocation").length == 0) {
                alert("Meetup Location is missing")
            } else {

                this.model.set('creator', $.cookie('Member._id'))
                this.model.save(null, {
                    success: function(responce) {


                        if (that.btnText == 'Save') {
                            var userMeetup = new App.Models.UserMeetup()
                            userMeetup.set({
                                memberId: $.cookie('Member._id'),
                                meetupId: responce.get('id'),
                                meetupTitle: responce.get('title'),

                            })
                            userMeetup.save()
                            that.MemberInvite(responce)
                        } else {
                            var userMeetup = new App.Collections.UserMeetups()
                            userMeetup.meetupId = responce.get('id')
                            userMeetup.memberId = $.cookie('Member._id')
                            userMeetup.fetch({
                                async: false
                            })
                            if (res = userMeetup.first()) {
                                res.set('meetupTitle', responce.get('title'))
                                res.save()
                                alert('Updated Successfully')

                            }
                            Backbone.history.navigate('meetups', {
                                trigger: true
                            })
                        }

                    }
                })



            }
        },


    })

})