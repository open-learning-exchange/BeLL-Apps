$(function() {

    App.Views.MeetupInvitation = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv"

        },

        title: null,
        entityId: null,
        type: null,
        senderId: null,

        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

            Backbone.history.navigate('meetups', {
                trigger: true
            })

        },
        SetParams: function(ti, e, t, s) {
            this.title = ti
            this.entityId = e
            this.type = t
            this.senderId = s

        },
        render: function() {

            //members is required for the form's members field
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            var members = new App.Collections.Members()
            var that = this
            var inviteForm = this
            inviteForm.on('InvitationForm:MembersReady', function() {
                
                this.model.schema.members.options = members
                // create the form
                this.form = new Backbone.Form({
                    model: inviteForm.model
                })
                this.$el.append(this.form.render().el)
                this.form.fields['members'].$el.hide()

                this.form.fields['invitationType'].$el.change(function() {
                    var val = that.form.fields['invitationType'].$el.find('option:selected').text()
                    if (val == App.languageDict.get('Members')) {
                        that.form.fields['members'].$el.show()
                    } else {
                        that.form.fields['members'].$el.hide()
                    }
                })
                // give the form a submit button
                var $button = $('<a class="btn btn-success" id="formButton">'+languageDictValue.attributes.Invite+'</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="cancelButton">'+languageDictValue.attributes.Cancel+'</button>');
                that.form.fields['invitationType'].$el.find('label').html(languageDictValue.attributes.Invitation_Type);
                var gradeLevelArray=App.languageDict.get('inviteMemberArray');
                for(var i=0;i<gradeLevelArray.length;i++)
                {
                    that.form.fields['invitationType'].$el.find('option').eq(i).html(gradeLevelArray[i]);

                }
            })

            // Get the course ready to process the form
            members.once('sync', function() {
                inviteForm.trigger('InvitationForm:MembersReady')

            })
            members.fetch();
            applyCorrectStylingSheet(directionOfLang)
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var member = new App.Models.Member({
                _id: $.cookie('Member._id')
            })
            member.fetch({
                async: false
            })
            // Put the form's input into the model in memory
            this.form.commit()
            var memberList = new App.Collections.Members()
            memberList.fetch({
                async: false
            })

            var temp
            var that = this
            var currentdate = new Date();
            if (this.model.get("invitationType") == "All") {
                memberList.each(function(m) {
                    temp = new App.Models.Mail()
                    temp.set("senderId", that.model.senderId)
                    temp.set("receiverId", m.get("_id"))
                    temp.set("status", "0")
                    temp.set("subject", "Meetup Invitation | " + that.model.title)
                    temp.set("type", "Meetup-invitation")
                    temp.set("body", that.model.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >'+languageDictValue.attributes.Accept+'</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >'+languageDictValue.attributes.Reject+'</button>')
                    temp.set("sendDate", currentdate)
                    temp.set("entityId", that.model.resId)
                    temp.save()

                })

            } else if (this.model.get("invitationType") == "Members") {
                memberList.each(function(m) {
                    var that2 = that;
                    if (that.model.get("members").indexOf(m.get("_id")) > -1) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Meetup Invitation | " + that.model.title)
                        temp.set("body", that.model.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >'+languageDictValue.attributes.Accept+'</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >'+languageDictValue.attributes.Reject+'</button>')
                        temp.set("type", "Meetup-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        temp.save()
                    }
                })
            }
            $('#invitationdiv').fadeOut(1000)
            alert(App.languageDict.attributes.Invitation_Sent_Success)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

            Backbone.history.navigate('meetups', {
                trigger: true
            })

        }


    })

})