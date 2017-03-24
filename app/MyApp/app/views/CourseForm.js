$(function () {

    App.Views.CourseForm = Backbone.View.extend({
        //This view is used to render "Add a Course" page and its bound with "Course" model
        className: "form",
        id: 'courseform',
        prevmemlist: null,
        btnText: 'Continue',
        events: {
            "click #sformButton": "setForm",
            "click #uformButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #inviteMemberButton": "MemberInvite",
            "click #coursescheduleButton": "CourseSchedule",
            "click #cancel": function () {
                window.history.back()
            }
        },

        CourseSchedule: function () {
            var form = new App.Views.CourseScheduleForm()
            form.courseId = this.model.id
            var model
            var cs = new App.Collections.CourseScheduleByCourse()
            cs.courseId = this.model.id
            cs.fetch({
                async: false
            })
            if (cs.length > 0) {
                model = cs.first()
                form.edit = true
                form.sid = model.get("_id")
                form.srevid = model.get("_rev")
            }
            form.render()
            App.$el.children('.body').html('<a id="BackToCourse" onclick = "location.reload()" class="btn btn-info"><< Back To Course</a>')
            App.$el.children('.body').append('<p id="scheduletitle">' + this.model.get("name") + '|Schedule</p>')
            App.$el.children('.body').append(form.el)
            $('#startTime').timepicker()
            $('#endTime').timepicker()
            $('#startDate').datepicker()
            $('#endDate').datepicker()
            $('#typeView').hide()
            $('.days').hide()
            if (cs.length > 0) {
                model = cs.first()
                $('#startTime').val(model.get("startTime"))
                $('#endTime').val(model.get("endTime"))
                $('#startDate').val(model.get("startDate"))
                $('#endDate').val(model.get("endDate"))
                $('#location').val(model.get("location"))
                $('#type').val(model.get("type"))
                if (model.get("type") == "Weekly") {
                    $('#weekDays').val(model.get("weekDays"))
                }
            }
            $('#type').on('change', function () {
                if (this.value == "Monthly") {
                    $('#typeView').show()
                    $('.days').hide()
                    $("#typeView").multiDatesPicker();
                } else if (this.value == "Weekly") {
                    $('.days').show()
                    $('#typeView').hide()
                } else {
                    $('.days').hide()
                    $('#typeView').hide()
                }
            });
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
                inviteForm.description = this.model.get("description")
                inviteForm.render();
                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el);
            } else {
                alert(App.languageDict.attributes.Prompt_Course_Desc)
            }
            var directionOfLang = App.languageDict.get('directionOfLang');
            if (directionOfLang.toLowerCase() === "right") {
                $('#invitationdiv').addClass('courseSearchResults_Bottom');
            }
            else {
                $('#invitationdiv').removeClass('courseSearchResults_Bottom');
            }
        },

        getRoles: function () {
            var member = new App.Models.Member()
            member.id = $.cookie('Member._id')
            member.fetch({
                async: false
            })
            return member.get('roles')
        },

        render: function () {
            $('#invitationdiv').hide()
            // members is required for the form's members field
            var courseForm = this
            if (this.model.get("_id") != undefined) {
                this.prevmemlist = this.model.get("members")
                this.model.on({
                    "change:statDate": this.sendMail,
                    "change:endDate": this.sendMail,
                    "change:startTime": this.sendMail,
                    "change:endTime": this.sendMail,
                    "change:location": this.sendMail
                });
            }
            if (!this.model.get("languageOfInstruction")) {
                this.model.set("languageOfInstruction", "")
            }
            this.model.schema.members.options = [];
            var memberList = new App.Collections.leadermembers();
            var config = new App.Collections.Configurations();
            var temp;
            config.fetch({
                async: false,
                success: function(){
                    temp = config.first().attributes.name;
                }
            })
            temp=temp.charAt(0).toUpperCase() + temp.slice(1);
            var typeofBell=config.first().attributes.type;
            if (typeofBell === "nation") {
                typeofBell=config.first().attributes.code;
            } else {
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                })
                var config = new configurations()
                config.fetch({
                    async: false
                })
                var con = config.first()
                con = (con.get('rows')[0]).doc;
                typeofBell=con.code;
            }
            memberList.fetch({
                success: function () {
                    //create the form
                    var optns = []
                    memberList.each(function (modl) {
                        if(typeofBell== modl.toJSON().community){
                            var temp = {
                                label: modl.toJSON().firstName + " " + modl.toJSON().lastName,
                                val: modl.toJSON()._id
                            }
                            optns.push(temp)
                        }
                    })
                    courseForm.model.schema.courseLeader.options = optns
                    courseForm.form = new Backbone.Form({
                        model: courseForm.model                  // courseForm.model is a 'Course' model instance. 'Course' is basically a course
                    })
                    courseForm.$el.append(courseForm.form.render().el)
                    $('.bbf-form').find('.field-courseLeader').find('.bbf-editor select').attr('multiple','multiple');
                    if(courseForm.model.get("courseLeader") == undefined) {
                        $('.bbf-form').find('.field-courseLeader').find('.bbf-editor select').val("0000");
                    } else {
                        $('.bbf-form').find('.field-courseLeader').find('.bbf-editor select').val(courseForm.model.get("courseLeader"));
                    }
                    courseForm.form.fields['members'].$el.hide()
                    if (courseForm.model.get("_id") == undefined) {
                        courseForm.form.fields['Day'].$el.hide()
                    }
                    $('.field-backgroundColor input').spectrum({
                        clickoutFiresChange: true,
                        preferredFormat: 'hex',
                        chooseText:App.languageDict.attributes.Choose,
                        cancelText:App.languageDict.attributes.Cancel
                    })
                    $('.field-foregroundColor input').spectrum({
                        clickoutFiresChange: true,
                        preferredFormat: 'hex',
                        chooseText:App.languageDict.attributes.Choose,
                        cancelText:App.languageDict.attributes.Cancel
                    })
                    // give the form a submit button
                    var $sbutton = $('<a class="course btn btn-success" id="sformButton">'+App.languageDict.attributes.Continue+'</button>')
                    var $ubutton = $('<a class="course btn btn-success" style="" id="uformButton">'+App.languageDict.attributes.Update+'</button>')
                    var $button = $('<a style="margin-top: -100px;" role="button" id="ProgressButton" class="btn" href="#course/report/' + courseForm.model.get("_id") + '/' + courseForm.model.get("name") + '"> <i class="icon-signal"></i> '+App.languageDict.attributes.Progress+'</a><a style="margin-top: -100px;"class="btn btn-success" id="inviteMemberButton">'+App.languageDict.attributes.Invite_Member+'</button><a style="margin-top: -100px;"class="btn btn-success" id="" href="#course/members/' + courseForm.model.get("_id") + '">'+App.languageDict.attributes.Members+'</a>')
                    if (courseForm.model.get("_id") != undefined) {
                        courseForm.$el.prepend($button)
                        courseForm.$el.append($ubutton)
                    } else {
                        courseForm.$el.append($sbutton)
                    }
                    courseForm.$el.append("<a class='btn btn-danger' style='margin-left : 20px;' id='cancel'>"+App.languageDict.attributes.Cancel+"</a>")
                },
                async: false
            });
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function () {
            var that = this
            var newEntery = 0
            this.model.once('sync', function () {
                Backbone.history.navigate('course/manage/' + that.model.get("id"), {
                    trigger: true
                })
            })
            // Put the form's input into the model in memory
            this.form.commit();
            var previousLeader = [];
            if(this.form.model.id) //if form's model has an "ID" attribute then we are editing existing course model.
            {
                var courseModel = new App.Models.Course({
                    _id: this.form.model.id
                });
                courseModel.fetch({
                    async: false
                });
                previousLeader = courseModel.get('courseLeader');
                if(previousLeader==undefined || previousLeader==null)
                {
                    previousLeader=[];
                }
            }

            this.model.set("name", this.model.get("CourseTitle"))
            // Send the updated model to the server
            if (this.model.get("_id") == undefined) {

                newEntery = 1;
                this.model.attributes.members.push($.cookie('Member._id'));
            }else {
                for(var i=0;i<this.prevmemlist.length;i++)
                {
                    this.model.attributes.members.push(this.prevmemlist[i]);
                }
            }
            if ($.trim(this.model.get('CourseTitle')).length == 0) {
                alert(App.languageDict.attributes.CourseTitle_Missing)
            } else if (this.model.get("description").length == 0) {
                alert(App.languageDict.attributes.Course_Desc_Missing)
            } else {
                var member = new App.Models.Member()
                member.id = $.cookie('Member._id')
                member.fetch({
                    async: false
                })
                if (member.get('roles').indexOf("Leader") == -1) {
                    member.get('roles').push("Leader")
                    member.save()
                }
                var leader = this.model.get('courseLeader');
                if (leader == null)
                {
                    leader=previousLeader;
                }
                var courseMembers = this.model.get('members');
                if(leader && leader.length>0)
                {
                    for(var i=0;i<leader.length;i++)
                    {
                        if (courseMembers.indexOf(leader[i]) == -1) { // new leader is not a member of the course already
                            courseMembers.push(leader[i])
                        }
                    }
                }
                this.model.set("members", courseMembers);
                var context = this
                var courseTitle = this.model.get('CourseTitle');
                var finalLeader=[];
                for(var i=0;i<previousLeader.length;i++){
                    finalLeader.push(previousLeader[i]);
                }
                for(var i=0;i<leader.length;i++){
                    if(finalLeader.indexOf(leader[i])==-1){
                        finalLeader.push(leader[i]);
                    }
                }
                this.model.set('courseLeader',finalLeader);
                this.model.set('CourseTitle', $.trim(courseTitle));
                this.model.save(null, {
                    success: function (e) {
                        var memprogress = new App.Models.membercourseprogress();
                        var stepsids = new Array();
                        var stepsres = new Array();
                        var stepsstatus = new Array();
                        var pqattempts = new Array();
                        if (newEntery == 1) {
                            memprogress.set("stepsIds", stepsids)
                            memprogress.set("memberId", $.cookie("Member._id"))
                            memprogress.set("stepsResult", stepsres)
                            memprogress.set("stepsStatus", stepsstatus)
                            memprogress.set("pqAttempts", pqattempts)
                            memprogress.set("courseId", e.get("id"));
                            memprogress.save()
                            if (context.model.get('courseLeader') && context.model.get('courseLeader').indexOf( $.cookie("Member._id"))==-1){  //&&context.model.get('courseLeader').indexOf('0000')==-1) {
                                for(var i=0;i<context.model.get('courseLeader').length;i++){
                                    memprogress.set("stepsIds", stepsids);
                                    memprogress.set("memberId",context.model.get('courseLeader')[i] )    //Needs some changes here
                                    memprogress.set("stepsResult", stepsres)
                                    memprogress.set("stepsStatus", stepsstatus)
                                    memprogress.set("pqAttempts", pqattempts)
                                    memprogress.set("courseId", e.get("id"))
                                    memprogress.save();
                                }
                            }

                            alert(App.languageDict.attributes.Course_Created_Success)
                        } else { 
                            if(leader && leader.length==0){
                                leader=previousLeader;
                            }
                            _.each(leader,function(leaderId){
                                var index = previousLeader.indexOf(leaderId);
                                if (index == -1) {
                                    var csteps = new App.Collections.coursesteps();
                                    csteps.courseId = context.model.get("_id"); // courseId
                                    csteps.fetch({
                                        success: function () {
                                            stepsids=[];
                                            stepsres=[];
                                            stepsstatus=[];
                                            pqattempts = [];
                                            csteps.each(function (m) {
                                                stepsids.push(m.get("_id"))
                                                stepsres.push("0")
                                                stepsstatus.push("0")
                                                pqattempts.push(0)
                                            })
                                            memprogress.set("stepsIds", stepsids)
                                            memprogress.set("memberId", leaderId)
                                            memprogress.set("stepsResult", stepsres)
                                            memprogress.set("stepsStatus", stepsstatus)
                                            memprogress.set("pqAttempts", pqattempts)
                                            memprogress.set("courseId", csteps.courseId)
                                            memprogress.save({
                                                success: function () {
                                                    alert(App.languageDict.attributes.Success_Saved_Msg)
                                                }
                                            })
                                        }
                                    });
                                }
                            });
                            var courseModel = new App.Models.Course()
                            courseModel.id = that.model.get("_id")
                            courseModel.fetch({
                                async: false
                            })
                            that.model.set("_rev", courseModel.get("_rev"))
                            alert(App.languageDict.attributes.Course_Updated_Success)
                        }
                    }
                })
            }
        },

        sendMail: function (e) {
            memberList = e._previousAttributes.members
            for (var i = 0; i < memberList.length; i++) {
                var mem = new App.Models.Member({
                    _id: memberList[i]
                })
                mem.fetch({
                    async: false
                })
                var currentdate = new Date();
                var mail = new App.Models.Mail();
                mail.set("senderId", $.cookie('Member._id'));
                mail.set("receiverId", mem.get("_id"));
                mail.set("subject", "Change of Course Schedule | " + e.get("name"));
                var mailText = "<b>Schedule is changed </b><br><br>New Schedule is:<br> Duration:   " + e.get('startDate') + '  to  ' + e.get('endDate') + '<br>'
                mailText += "Timing:        " + e.get('startTime') + '  to  ' + e.get('endTime')
                mailText += "<br>Locatoin:      " + e.get('location')
                mail.set("body", mailText);
                mail.set("status", "0");
                mail.set("type", "mail");
                mail.set("sentDate", currentdate);
                mail.save()
            }
        }
    })
})