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
                if (this.btnText == 'Save') {
                    $('#invitationdiv').append('<h4 align = "center">'+App.languageDict.attributes.Prompt_MeetUp_save+'</h4>')
                }
                $('#invitationdiv').append(inviteForm.el);


            } else {
                alert(App.languageDict.attributes.Prompt_MeetUp_Location_First)
            }
        },
        render: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            $('#invitationdiv').hide()
            // members is required for the form's members field

            if (!this.model.get('_id'))
                this.$el.append('<h3>'+languageDictValue.attributes.start_new_meetUp+'</h3>')
            else {
                this.$el.append('<h3>'+languageDictValue.attributes.Edit_MeetUp+' | ' + this.model.get('title') + '</h3>')
                this.btnText = languageDictValue.attributes.Update
            }


            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['descriptionOutput'].$el.prepend('<a id="MeetupDescriptionLink" style="float:right; margin-right: 5%;">'+App.languageDict.attributes.Markdown+'</a>');
            this.form.fields['description'].$el.prepend('<a id="markdownMeetupDescriptionLink" style=" float:right; margin-right: 5%;">'+App.languageDict.attributes.Rich_Text+'</a>');
            this.form.fields['description'].$el.hide()
            if (this.btnText != languageDictValue.attributes.Update)
                this.form.fields['Day'].$el.hide();

            var $sbutton = $('<a class="btn btn-success" id="MeetUpformButton">' + this.btnText + '</a>')

            var $ubutton = $('<a class="btn btn-success" id="formButton">'+languageDictValue.attributes.Cancel+'</a>')
            var $button = $('<a class="btn btn-success" id="meetInvitation">Invite Member</button><a role="button" id="ProgressButton" class="btn" href="#course/report/' + this.model.get("_id") + '/' +this.model.get("name") + '"> <i class="icon-signal"></i> Progress</a>')
            this.$el.append($sbutton)
            if (this.btnText != languageDictValue.attributes.Update)
                this.$el.append('<a class="btn btn-info" id="InviteMembers">'+languageDictValue.attributes.Invite_Member+'</a>')

            this.$el.append("<a class='btn btn-danger' id='MeetUpcancel'>"+languageDictValue.attributes.Cancel+"</a>")
            

            applyCorrectStylingSheet(directionOfLang);

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
                alert(App.languageDict.attributes.Duplicate_Save)
                return
            }

            var that = this
            // Put the form's input into the model in memory
            this.form.commit()
            this.model.unset("descriptionOutput", { silent: true })
            if ($.trim(this.model.get("title")).length == 0) {
                alert(App.languageDict.attributes.MeetUp_Title_Missing)
            } else if (this.model.get("description").length == 0) {
                alert(App.languageDict.attributes.MeetUp_Desc_Missing)
            } else if (this.model.get("meetupLocation").length == 0) {
                alert(App.languageDict.attributes.Missing_MeetUp_Location)
            } else {

                this.model.set('creator', $.cookie('Member._id'))
                var titleOfMeetup = this.model.get("title");
                this.model.set("title", $.trim(titleOfMeetup))
                this.model.save(null, {
                    success: function(responce) {

                        if (that.btnText == 'Save') {
                            var userMeetup = new App.Models.UserMeetup()
                            userMeetup.set({
                                memberId: $.cookie('Member._id'),
                                meetupId: responce.get('id'),
                                meetupTitle: responce.get('title')

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
                                alert(App.languageDict.attributes.Updated_Successfully)

                            }
                            Backbone.history.navigate('meetups', {
                                trigger: true
                            })
                        }

                    }
                })



            }
        }


    })

})
