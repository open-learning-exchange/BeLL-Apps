$(function() {

    App.Views.InvitationForm = Backbone.View.extend({

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
        },
        SetParams: function(ti, e, t, s) {
            this.title = ti
            this.entityId = e
            this.type = t
            this.senderId = s

        },
        render: function() {

            //members is required for the form's members field
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
                this.form.fields['levels'].$el.hide()
                this.form.fields['invitationType'].$el.find('label').html(App.languageDict.attributes.Invitation_Type);
                 var invitationType=App.languageDict.get("Invitation_Type_Array");
                    for(var i=0;i<invitationType.length;i++){
                        this.form.fields['invitationType'].$el.find('option').eq(i).html(invitationType[i]);
                  }
                this.form.fields['invitationType'].$el.change(function() {
                    var val = that.form.fields['invitationType'].$el.find('option:selected').text();
                    if (val == App.languageDict.attributes.Members) {
                        that.form.fields['members'].$el.show();
                        that.form.fields['levels'].$el.hide();
                        $('.bbf-form .field-members').find('label').eq(0).html(App.languageDict.attributes.Members);
                    } else if (val == App.languageDict.attributes.level_Single) {

                        that.form.fields['members'].$el.hide()
                        that.form.fields['levels'].$el.show();
                        var invitationType=App.languageDict.get("inviteForm_levels");
                        $('.bbf-form .field-levels').find('label').html(App.languageDict.attributes.Levels);
                        for(var i=0;i<invitationType.length;i++){
                            $('.bbf-form .field-levels .bbf-editor ul').find('li').eq(i).find('label').html(invitationType[i]);
                        }

                    } else {
                        that.form.fields['members'].$el.hide()
                        that.form.fields['levels'].$el.hide()
                    }
                });
                // give the form a submit button
                var $button = $('<a class="btn btn-success" id="formButton">'+App.languageDict.attributes.Invite+'</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="cancelButton">'+App.languageDict.attributes.Cancel+'</button>');

            })

            // Get the course ready to process the form
            members.once('sync', function() {
                inviteForm.trigger('InvitationForm:MembersReady')

            })

            members.fetch()

        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
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
                    temp.set("receiverId", m.get("_id"));
                    temp.set("status", "0")
                    temp.set("subject", "Course Invitation | " + that.model.title)
                    temp.set("type", "course-invitation")
                    temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                    temp.set("sendDate", currentdate)
                    temp.set("entityId", that.model.resId)
                    temp.save()
                    //            temp = new App.Models.Invitation()
                    //            temp.set("title",that.model.title)
                    //            temp.set("senderId",that.model.senderId)
                    //            temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                    //            temp.set("memberId",m.get("_id"))
                    //			temp.set("entityId",that.model.resId)
                    //            temp.set("type",that.model.type)
                    //            temp.save()
                })

            } else if (this.model.get("invitationType") == "Members") {
                memberList.each(function(m) {
                    var that2 = that;
                    if (that.model.get("members").indexOf(m.get("_id")) > -1) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Course Invitation | " + that.model.title)
                        temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                        temp.set("type", "course-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        //            temp = new App.Models.Invitation()
                        //            temp.set("title",that2.model.title)
                        //            temp.set("senderId",that2.model.senderId)
                        //            temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                        //            temp.set("memberId",m.get("_id"))
                        //            temp.set("entityId",that2.model.resId)
                        //            temp.set("type",that2.model.type)
                        temp.save()
                    }
                })
            } else {
                //Fetching The Members and then checking each levels whether they have the same level then incrementing the counnt and save
                memberList.each(function(m) {
                    if (m.attributes.hasOwnProperty("levels") && (that.model.get("levels").indexOf(m.get("levels")) > -1)) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Course Invitation | " + that.model.title)
                        temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                        temp.set("type", "course-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        //                  temp = new App.Models.Invitation()
                        //                  temp.set("title",that.title)
                        //                  temp.set("senderId",that.senderId)
                        //                  temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                        //                  temp.set("memberId",m.get("_id"))
                        //                  temp.set("entityId",that.resId)
                        //                  temp.set("type",that.type)
                        temp.save()
                    }
                });

            }

            $('#invitationdiv').fadeOut(1000)
            alert(App.languageDict.attributes.Invitation_Sent_Success)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

        }


    })

})