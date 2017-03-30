$(function() {

    App.Views.MailView = Backbone.View.extend({
        code: null,
        vars: {},
        recordsPerPage: null,
        modelNo: null,
        nextButton: null,
        unopen: null,
        searchText: null,
        resultArray: null,
        inViewModel: null,
        showNextButton: null,
        template: _.template($("#template-mail").html()),
        templateMailView: _.template($("#template-view-mail").html()),

        events: {
            "click #replyMailButton": function(e) {
                $("#recipients").val(this.vars.login)
                $("#subject").val("Re : " + this.vars.subject)
                $("#mailbodytexarea").val("")
            },
            "click #mailComposeButton": function(e) {
                $("#subject").val("")
                $("#recipients").val("")
                $("#mailbodytexarea").val("")
            },
            "click #nextButton": function(e) {
                this.modelNo = 0
                this.resultArray = []
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #all-mails": function(e) {
                this.modelNo = 0
                skip = 0
                this.searchText = ""
                $("#search-text").val("")
                this.resultArray = []
                this.unopen = false
                this.fetchRecords()
                $("#nextButton").show()
                $("#previousButton").hide()
            },

            "click #unread-mails": "unReadMails",
            "click #backpage": function(e) {

                this.render()
                this.unReadMails()

            },
            "click .deleteBtn": function(e) {
                var modelNo = e.currentTarget.value
                alert(modelNo)
                var selectedModel = this.collection.at(modelNo)
                var model = new App.Models.Mail()
                model.id = selectedModel.get("id")
                model.fetch({
                    async: false
                })
                model.destroy()

                this.render()
                this.unReadMails()
            },
            "click #previousButton": function(e) {
                if (skipStack.length > 1) {
                    skipStack.pop()
                    skip = skipStack.pop()
                    skipStack.push(skip)
                    this.resultArray = []
                    this.modelNo = 0
                    this.showNextButton = 1
                    this.fetchRecords()
                } else {
                    $("#previousButton").hide()
                }

            },
            "click #promote-accept": function (e) {
                console.log('id', e.currentTarget.value);
                var mmodel = new App.Models.Member({
                    _id: e.currentTarget.value
                })
                mmodel.fetch({
                    async: false
                })
                var username = mmodel.attributes.firstName+" "+mmodel.attributes.lastName
                roles = mmodel.get('roles');
                if (roles.indexOf('Manager') < 0) {
                    roles.push("Manager");// if promote to manager checkbox is ticked
                    mmodel.set('roles', roles);
                }
                var body = App.languageDict.attributes.Hi + '&nbsp;' + '<b>'+ $.cookie('Member.login') +  '</b>' + ',<br>' + '<br>' + App.languageDict.attributes.Member + ' <b>' + username + '</b> ' + App.languageDict.attributes.Has_Requested_Promote + '<br/><br/>';
                mailView.updateMailBody(body)
                mmodel.save(null, {
                    success: function () {
                        alert(App.languageDict.attributes.Promote_Request_Accepted)
                        return
                    }
                });
                var languageDictValue;
                var lang = getLanguage(mmodel.get('_id'))
                languageDict = getSpecificLanguage(lang);
                var temp
                var that = this
                var currentdate = new Date();
                var mailBody = languageDict.attributes.Hi+ '&nbsp;' + ' <b>' + username + '</b>' +',<br>' + '<br>' + languageDict.attributes.Your_Request_Has_Been_Accepted + '<br>';
                temp = new App.Models.Mail()
                temp.set("senderId", $.cookie('Member._id'))
                temp.set("receiverId", mmodel.get('_id'));
                temp.set("status", "0")
                temp.set("subject", languageDict.attributes.Manager_Request + " | " + username)
                temp.set("type", "manager-request")
                temp.set("body", mailBody)
                temp.set("sendDate", currentdate)
                temp.set("entityId",mmodel.get('_id'))
                temp.save()
            },
            "click #promote-reject": function (e) {
                var mmodel = new App.Models.Member({
                    _id: e.currentTarget.value
                })
                mmodel.fetch({
                    async: false
                })
                var username = mmodel.attributes.firstName+" "+mmodel.attributes.lastName;
                var body = App.languageDict.attributes.Hi + '&nbsp;' + '<b>'+ $.cookie('Member.login') +  '</b>' + ',<br>' + '<br>' + App.languageDict.attributes.Member + ' <b>' + username + '</b> ' + App.languageDict.attributes.Has_Requested_Promote + '<br/><br/>';
                mailView.updateMailBody(body) 
                var languageDictValue;
                var lang = getLanguage(mmodel.get("_id"))
                languageDict = getSpecificLanguage(lang);
                var temp
                var that = this
                var currentdate = new Date();
                var mailBody = languageDict.attributes.Hi+ '&nbsp;' + '<b>' + username + '</b>'+ ',<br>' + '<br>' + languageDict.attributes.Your_Request_Has_Been_Rejected;
                temp = new App.Models.Mail()
                temp.set("senderId", $.cookie('Member._id'))
                temp.set("receiverId",  mmodel.get('_id'));
                temp.set("status", "0")
                temp.set("subject", languageDict.attributes.Manager_Request + " | " + username)
                temp.set("type", "manager-request")
                temp.set("body", mailBody)
                temp.set("sendDate", currentdate)
                temp.set("entityId", mmodel.get('_id'))
                temp.save()
                alert(App.languageDict.attributes.Promote_Request_Rejected) 
            },
            
            "click #invite-accept": function(e) {
                if (mailView.inViewModel.get('type') == "admissionRequest") {
                    mailView.admissionRequestAccepted(e.currentTarget.value)
                    return
                }
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                var vacancyFull = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>"+App.languageDict.get('courseFull_msg')+"</div>"
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>"+App.languageDict.get('invite_Accepted')+"</div>"

                if (mailView.inViewModel.get('type') == "Meetup-invitation") {
                    mailView.meetupRequestAccepted(e.currentTarget.value)
                    mailView.updateMailBody(body)
                    return
                }

                var gmodel = new App.Models.Course({
                    _id: e.currentTarget.value
                })
                gmodel.fetch({
                    async: false
                })

                var that = this

                //*************check Vacancies for the Course**************

                var num = gmodel.get("members").length
                if (gmodel.get("memberLimit"))
                    if (gmodel.get("memberLimit") < num) {
                        alert(App.languageDict.attributes.Course_Full)
                        mailView.updateMailBody(vacancyFull)
                        return
                    }
                mailView.updateMailBody(body)
                if (gmodel.get("_id")) {
                    var memberlist = []
                    if (gmodel.get("members") != null) {
                        memberlist = gmodel.get("members")
                    }


                    if (memberlist.indexOf($.cookie('Member._id')) == -1) {
                        memberlist.push($.cookie('Member._id'))
                        gmodel.set("members", memberlist)
                        gmodel.save({}, {
                            success: function() {
                                var memprogress = new App.Models.membercourseprogress()
                                var csteps = new App.Collections.coursesteps();
                                var stepsids = new Array()
                                var stepsres = new Array()
                                var stepsstatus = new Array()
                                var pqattempts = new Array();
                                csteps.courseId = gmodel.get("_id")
                                csteps.fetch({
                                    success: function() {
                                        csteps.each(function(m) {
                                            //Issue#400
                                            var sresults = [];
                                            var sstatus = [];
                                            var sattempts = [];
                                             if((typeof m.get("coursestructure") === "undefined" || m.get("coursestructure") != "true") 
                                            && (m.get("outComes") !== undefined && m.get("outComes").length == 2))  {
                                           // if(m.get("outComes").length == 2) {
                                                var arr = [];
                                                var arr1 = [];
                                                var pqarr = [];
                                                pqarr.push(0)
                                                pqarr.push(0)
                                                arr.push("0")
                                                arr.push("0")
                                                arr1.push("")
                                                arr1.push("")
                                                sresults = arr1;
                                                sstatus = arr;
                                                sattempts = pqarr;
                                            } else {
                                                sresults = "";
                                                sstatus= '0';
                                                sattempts = 0
                                            }

                                            stepsids.push(m.get("_id"))
                                            stepsres.push(sresults)
                                            stepsstatus.push(sstatus)
                                            pqattempts.push(sattempts)
                                        })
                                        memprogress.set("stepsIds", stepsids)
                                        memprogress.set("memberId", $.cookie("Member._id"))
                                        memprogress.set("stepsResult", stepsres)
                                        memprogress.set("stepsStatus", stepsstatus)
                                        memprogress.set("pqAttempts", pqattempts)
                                        memprogress.set("courseId", csteps.courseId)
                                        memprogress.save({
                                            success: function() {}
                                        })
                                    alert(App.languageDict.attributes.Course_Added_Dashboard)
                                    Backbone.history.navigate('dashboard', {
                                    trigger: true
                                })
                                    }
                                })
                            }
                        })

                    } else {
                        alert(App.languageDict.attributes.Course_Existing_Dashboard)
                        Backbone.history.navigate('dashboard', {
                            trigger: true
                        })
                    }
                }
            },

            "click #invite-reject": function(e) {
                if (mailView.inViewModel.get('type') == "admissionRequest") {
                    mailView.admissoinRequestRejected(e.currentTarget.value)
                    return
                }
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>"+App.languageDict.get('invite_rejected')+"</div>"

                mailView.updateMailBody(body)
            },
            "click #search-mail": function(e) {
                skip = 0
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                this.searchText = $("#search-text").val()
                this.resultArray = []
                skipStack.push(skip)
                this.modelNo = 0
                this.fetchRecords()
            },
            "click #back": function(e) {
                skip = 0
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                this.resultArray = []
                skipStack.push(skip)
                this.modelNo = 0
                this.render()
                this.fetchRecords()
            }
        },
        unReadMails: function(e) {
            this.modelNo = 0
            skip = 0
            this.searchText = ""
            $("#search-text").val("")
            this.resultArray = []
            this.unopen = true
            this.fetchRecords()
            $("#nextButton").show()
            $("#previousButton").hide()
        },
        renderAllMails: function(e) {

            mailView.modelNo = 0
            skip = 0
            this.searchText = ""
            mailView.resultArray = []
            mailView.unopen = false
            mailView.fetchRecords()

            $("#nextButton").show()
            $("#previousButton").hide()

        },
        viewButton: function(e) {
            var modelNo = e.currentTarget.value
            var model = mailView.collection.at(modelNo)
            var attchmentURL = '/mail/' + model.get("_id") + '/'
            var attachmentName = ''
            if (typeof model.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(model.get('_attachments'))[0]
                attachmentName = _.keys(model.get('_attachments'))[0]
            }
            mailView.inViewModel = model
            model.set("status", "1")
            model.save()
            mailView.vars = model.toJSON()

            var member = new App.Models.Member()
            member.id = model.get('senderId')
            member.fetch({
                async: false
            })
            mailView.vars.firstName = member.get('firstName')
            mailView.vars.lastName = member.get('lastName')
            mailView.vars.email = member.get('login') + '.' + mailView.code + mailView.nationName.substring(3, 5) + '@olebell.org'
            mailView.vars.modelNo = modelNo
            mailView.vars.login = mailView.vars.email
            if (attachmentName != "") {
                mailView.vars.isAttachment = 1
                mailView.vars.attchmentURL = attchmentURL
            } else {
                mailView.vars.isAttachment = 0
            }
            mailView.$el.html('')
            mailView.$el.append(mailView.templateMailView(mailView.vars))
        },
        deleteButton: function(e) {
            var modelNo = e.currentTarget.value
            var selectedModel = mailView.collection.at(modelNo)
            selectedModel.destroy()
            mailView.renderAllMails()
        },
        initialize: function(args) {
            this.code = args.community_code
            this.nationName = args.nationName
            this.modelNo = 0
            skip = 0
            this.unopen = true
            this.recordsPerPage = 5
            this.nextButton = 1
            this.searchText = ""
            this.delegateEvents()
            this.resultArray = []
            this.showNextButton = 0
        },
        addOne: function(model) {
            vars = model.toJSON()
            var member = new App.Models.Member()
            member.set("id", model.get('senderId'))
            member.id = model.get('senderId')
            member.fetch({
                async: false
            })
            if (member.id == undefined) {
                var name = App.languageDict.get('Error');
            } else {
                var name = member.get('firstName') + ' ' + member.get('lastName')
            }
            if (vars.subject) {
                var row = ""
                if (vars.status == 0) {

                    row = '<tr bgcolor="B4D3EC" style="color:black">'
                } else {
                    row = '<tr bgcolor="E7E7E7" style="color:#2D2D34">'
                }
                var deleteId = "delete" + this.modelNo
                var viewId = "view" + this.modelNo

                row = row + '<td>' + vars.subject + '</td><td align="center">' + name + '</td><td id="viewDelCol"><button value="' + this.modelNo + '" id ="' + deleteId + '" class="btn btn-danger">'+App.languageDict.get("DeleteLabel")+'</button>&nbsp;&nbsp;<button value="' + this.modelNo + '" id="' + viewId + '" class="btn btn-primary" >'+App.languageDict.get("View")+'</button></td></tr>'
                $('#inbox_mails').append(row)
                this.modelNo++
                $("#" + deleteId).click(this.deleteButton)
                $("#" + viewId).click(this.viewButton)
                mailView = this;
                if(App.languageDict.get('directionOfLang').toLowerCase()==="right"){
                    $('#viewDelCol').find('td').eq(2).attr("align","left")
                }
                else {
                    $('#viewDelCol').find('td').eq(2).attr("align","right")
                }
            }
        },

        addAll: function() {

            $('#inbox_mails').html('')
            if (skipStack.length <= 1) {
                $('#previousButton').hide()
            } else {
                $('#previousButton').show()
            }
            this.collection.forEach(this.addOne, this)
        },
        render: function() {
            var lang = getLanguage($.cookie('Member._id'));
            App.languageDict = getSpecificLanguage(lang);
            this.vars.languageDict=App.languageDict;
            this.$el.html(this.template(this.vars))
            this.$el.append('<div class="mail-table"><span style="float:right; margin-left:10px;"><button id="nextButton" class="btn btn-primary fui-arrow-right"></button></span> <span style="float:right;"><button id="previousButton" class="btn btn-primary fui-arrow-left"></button></span></div>')
            $('#searchOnMail').find('input').eq(0).attr("placeholder",App.languageDict.get('searchMessages'))
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right")
            {
                $('#mailHeading').css({"color":"black","font-size":"25px","margin-right": "10%"})
                $('#searchOnMail').css("float","left");
                $('#errorMessage').css({"direction":"rtl"});
                $('#errorMessage').find('p').css({"color":"red","margin-right":"10%"});
            }
            else {
                $('#mailHeading').css({"color":"black","font-size":"25px"});
                $('#searchOnMail').css("float","right");
                $('#errorMessage').find('p').css({"color":"red","margin-left":"10%"});
            }
        },

        fetchRecords: function() {
            var obj = this
            var newCollection = new App.Collections.Mails({
                receiverId: $.cookie('Member._id'),
                unread: obj.unopen
            })

            newCollection.fetch({
                success: function() {
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(newCollection.models, obj.searchText))
                    if (obj.resultArray.length != limitofRecords && newCollection.models.length == limitofRecords) {
                        obj.fetchRecords()

                        return;
                    } else if (obj.resultArray.length == 0 && skipStack.length > 1) {
                        $("#nextButton").hide()
                        skipStack.pop()
                        return;
                    }

                    if (obj.resultArray.length == 0 && skipStack.length == 1) {
                        {

                            $("#errorMessage").show();
                            return
                        }
                    }

                    var ResultCollection = new App.Collections.Mails()
                    if (obj.resultArray.length > 0) {
                        $("#errorMessage").hide();
                        ResultCollection.set(obj.resultArray)
                        obj.collection = ResultCollection
                        obj.addAll()
                        if (obj.showNextButton == 1) {
                            $("#nextButton").show()
                            obj.showNextButton = 0
                        }
                    }
                }
            })

        },
        searchInArray: function(resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount

            {
                _.each(resourceArray, function(result) {
                    if (result.get("subject") != null && result.get("body") != null) {
                        skip++
                        if (result.get("subject").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 || result.get("body").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {

                            if (resultArray.length < limitofRecords) {
                                resultArray.push(result)
                            } else {
                                skip--
                            }
                        } else if (resultArray.length >= limitofRecords) {
                            skip--
                        }
                    }
                })

            }
            return resultArray
        },
        admissionRequestAccepted: function(courseId) {
            var memebersEnrolled = [];
            var course = new App.Models.Course();
            course.id = courseId
            course.fetch({
                async: false
            })

            memebersEnrolled = course.attributes.members
            var isAlreadyEnrolled = false;
            var receiverId = mailView.inViewModel.get('senderId');
            var member = new App.Models.Member()
            member.id = receiverId
            member.fetch({
                async: false
            })
            //mailView.vars.firstName = member.get('firstName')
           // mailView.vars.lastName = member.get('lastName')
           var firstName = member.get('firstName')
           var lastName = member.get('lastName')
            for (var i=0; i<memebersEnrolled.length;i++) {
                if (receiverId == memebersEnrolled[i]) {
                    console.log("reciever id"+receiverId)
                    isAlreadyEnrolled = true;
                }
            }
            console.log("flag:" + isAlreadyEnrolled)
            if (isAlreadyEnrolled){
                alert("Member is already enrolled in this course");
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = firstName + ' ' +'is already enrolled in '+' ' + course.attributes.CourseTitle;

            } else {
                var memId = mailView.inViewModel.get('senderId')
                course.get('members').push(memId)
                course.save(null, {
                    success: function (model, idRev) {
                        var memprogress = new App.Models.membercourseprogress()
                        var csteps = new App.Collections.coursesteps();
                        var stepsids = new Array()
                        var stepsres = new Array()
                        var stepsstatus = new Array()
                        var pqattempts = new Array();
                        csteps.courseId = idRev.id
                        csteps.fetch({
                            success: function () {
                                csteps.each(function (m) {
                                    //Issue#400
                                    var sresults = "";
                                    var sstatus = 0;
                                    var sattempts = 0;
                                    stepsids.push(m.get("_id"))
                                    stepsres.push(sresults)
                                    stepsstatus.push(sstatus)
                                    pqattempts.push(sattempts)
                                })
                                memprogress.set("stepsIds", stepsids)
                                memprogress.set("memberId", memId)
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
                        })

                    }
                })
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = App.languageDict.get('accepted_email_text')+' '+firstName+' '+lastName+'<br>'
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>" + App.languageDict.get('request_Accepted_already') + "</div>"
                mailView.inViewModel.save()
                var currentdate = new Date();
                var mail = new App.Models.Mail();
                mail.set("senderId", $.cookie('Member._id'));
                mail.set("receiverId", mailView.inViewModel.get('senderId'));
                mail.set("subject", App.languageDict.attributes.Adm_req_accepted + " | " + course.get('name'));
                mail.set("body", App.languageDict.attributes.adm_req_For_accepted + " \"" + course.get('name') + "\" ");
                mail.set("status", "0");
                mail.set("type", "mail");
                mail.set("sentDate", currentdate);
                mail.save()
            }
            mailView.updateMailBody(body)
        },
        admissoinRequestRejected: function(courseId) {
            var courseTitle;
            var memebersEnrolled = [];
            var course = new App.Models.Course();
            course.id = courseId
            course.fetch({
                success: function () {
                    if (course.length > 0) {
                        console.log(course.attributes.CourseTitle)
                    }
                },
                async: false
            })
            courseTitle = course.attributes.CourseTitle;
            memebersEnrolled = course.attributes.members
            var isAlreadyEnrolled = false;
            var receiverId = mailView.inViewModel.get('senderId');
            for (var i = 0 ; i<memebersEnrolled.length ; i++) {
                if (receiverId == memebersEnrolled[i]) {
                    isAlreadyEnrolled = true;
                }
            }
            console.log("flag:" + isAlreadyEnrolled)
            if (isAlreadyEnrolled){
                alert("Member is already enrolled in this course");
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = $.cookie('Member.login') + ' ' +'is already enrolled in '+' ' + course.attributes.CourseTitle;
                ///////
            } else {
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = 'Admission request received from user "a" has been Rejected<br>'
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>"+App.languageDict.attributes.request_Rejected_already+"</div>"
                var currentdate = new Date();
                var mail = new App.Models.Mail();
                mail.set("senderId", $.cookie('Member._id'));
                mail.set("receiverId", mailView.inViewModel.get('senderId'));
                alert(App.languageDict.attributes.Adm_req_rejected);
                mail.set("subject", App.languageDict.attributes.Adm_req_rejected+ " | " + course.attributes.CourseTitle)
                mail.set("body", App.languageDict.attributes.adm_req_For_rejected+" \"" + course.attributes.CourseTitle + "\" ");
                mail.set("status", "0");
                mail.set("type", "mail");
                mail.set("sentDate", currentdate);
                mail.save()
            }
            mailView.updateMailBody(body)
        },

        meetupRequestAccepted: function(meetupId) {
            var UMeetup = new App.Collections.UserMeetups()
            UMeetup.memberId = $.cookie('Member._id')
            UMeetup.meetupId = meetupId

            UMeetup.fetch({
                async: false
            })
            if (UMeetup.length > 0) {
                alert(App.languageDict.attributes.Already_Joined_MeetUp)
                return
            }

            var meetup = new App.Models.MeetUp()
            meetup.id = meetupId
            meetup.fetch({
                async: false
            })

            if (!meetup.get('title')) {
                alert(App.languageDict.attributes.MeetUp_not_Existing)
                return
            }
            var userMeetup = new App.Models.UserMeetup()

            userMeetup.set({
                memberId: $.cookie('Member._id'),
                meetupId: meetupId,
                meetupTitle: meetup.get('title')

            })
            userMeetup.save()

            alert(App.languageDict.attributes.Joined_Success)

        },
        updateMailBody: function(body) {
            var model = new App.Models.Mail()
            model.id = mailView.inViewModel.get("id")
            model.fetch({
                async: false
            })
            model.set('body', body)
            model.save()
            $('#mail-body').html('<br/>' + body)
        }

    })


})