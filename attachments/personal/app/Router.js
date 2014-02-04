$(function () {
    App.Router = new(Backbone.Router.extend({

        routes: {
            '': 'MemberLogin',
            'dashboard': 'Dashboard',
            'ereader': 'ereader',
            'info': 'info',
            'login': 'MemberLogin',
            'logout': 'MemberLogout',
            'courses': 'Groups',
            'my-courses': 'MemberGroups',
            'course/edit/:groupId': 'GroupForm',
            'course/details/:courseId/:name': 'CourseDetails', // @todo delete and change refs to it
            'CourseInfo/:courseId': 'CourseInfo',
            'course/resign/:courseId': 'ResignCourse',
            'course/assignments/:groupId': 'GroupAssignments',
            'course/members/:courseId':'GroupMembers',
            'course/link/:groupId': 'GroupLink',
            'update-assignments': 'UpdateAssignments',
            'resource/feedback/add/:resourceId': 'FeedbackForm',
            'newsfeed': 'NewsFeed',
            'newsfeed/:authorTitle': 'Article_List',
            'search-bell': 'SearchBell',
            'search-result': 'SearchResult',
            'member/add': 'MemberForm',
            'member/edit/:mid': 'MemberForm',
            'addResource/:rid/:title/:revid': 'AddResourceToShelf',
            'resource/detail/:rsrcid/:shelfid/:revid': 'Resource_Detail', //When Item is Selected from the shelf 
            'meetup/detail/:meetupId/:title': 'Meetup_Detail',
            'calendar': 'CalendarFunction',
            'calendar/event/:eid': 'calendaar',
            'calendar-event/edit/:eid': 'EditEvent',
            'calendar-event/delete/:eid': 'DeleteEvent',
            'addEvent': 'addEvent',
            'report/:Url': 'report',
            'siteFeedback': 'viewAllFeedback',
            'courses/barchart': 'CoursesBarChart',
            'mail': 'email',
            '*nomatch': 'errornotfound',
        },

        initialize: function () {
        	
            this.bind("all", this.startUpStuff)
            this.bind("all", this.checkLoggedIn)
            this.bind("all", this.renderNav)

           // this.bind("all", this.reviewStatus)
        },
        startUpStuff: function () {
            this.renderNav
            
            if (App.idss.length == 0) {}
            $('div.takeQuizDiv').hide()
            $('#externalDiv').hide()
            $('#debug').hide()
        },
         reviewStatus: function(){
        	 var member = new App.Models.Member({
                                _id: $.cookie('Member._id')
                            })
                            member.fetch({
                                async: false
                           })            
            if( member.get("pendingReviews")==undefined){
            var pending=[]
            	member.set("pendingReviews",pending)
            	member.save()
            }
            else{
            	var path=$.url().attr('fragment').split("/")
                if(member.get("pendingReviews").length!=0&&path[0]!="resource"&&path[1]!="feedback"&&path[2]!="add"){
                	console.log(member.get("pendingReviews"))
                	var pending=member.get("pendingReviews")
                	var resource=new App.Models.Resource({_id:pending[0]})
                	var response=resource.fetch({async:false})
                	if(response.status==200){
                		ratingModel = new App.Models.Feedback()
		                ratingModel.set('resourceId', resource.attributes._id)
		                ratingModel.set('memberId', $.cookie('Member._id'))
		                ratingView = new App.Views.FeedbackForm({
		                    model: ratingModel,resId:resource.attributes._id
		                })
		                $('#externalDiv').html('<h4 style="color:white">'+resource.attributes.title+'<h4>')
		                $('#externalDiv').append('<div id="star"></div>')
		                $('#star').append("Rating<br/>")
		                $('#star').raty()
		                $("#star > img").click(function () {
		                    ratingView.setUserRating($(this).attr("alt"))
		                });
		                ratingView.render()
		                $('#externalDiv').append(ratingView.el)
		                $('#externalDiv').show()
                		document.getElementById("top-nav").style.visibility="hidden"
                		document.getElementById("main-body").style.visibility="hidden"
                		
                		//Backbone.history.navigate('../lms/index.html#resource/feedback/add/' + resource.attributes._id + '/' + resource.attributes.title, {
                    	//trigger: true
                		//})
                	}
                	else{
                		pending.splice(0,1)      
                		member.set("pendingReviews",pending)
                		member.save()      		
                	}
                }
            }
        },
        errornotfound: function () {
            Backbone.history.navigate('login', {
                trigger: true
            })
        },
        email: function () {
            App.$el.children('.body').html('&nbsp')
            var configurations=Backbone.Collection.extend({

    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})
    		var config=new configurations()
    	     config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
        
    	    
    	    code=cofigINJSON.rows[0].doc.code
    	    console.log(code)
            var mymail = new App.Collections.Mails({
                skip: 0
            })
            mymail.fetch({
                async: false
            })
            var mailview = new App.Views.MailView({collection: mymail,community_code:code})
            mailview.render()
            App.$el.children('.body').append(mailview.el)
            skipStack.push(skip)
            mailview.fetchRecords()

        },
        GroupMembers:function(cId)
        {
           var groupMembers=new App.Views.GroupMembers()
           groupMembers.courseId=cId
           groupMembers.render()
           App.$el.children('.body').html(groupMembers.el)
                 
        },
        addIds: function (steps, results, newId) {
            steps.forEach(function (s) {
                //	console.log(s.toJSON().courseId)
                s.set("courseId", newId)
                s.save(null, {
                    success: function (model, response) {
                        console.log("successfully saves step")
                    },
                    error: function (model, response) {
                        (console.log(response))
                    }
                });

            })
            results.forEach(function (r) {
                //	console.log(r.toJSON().courseId)
                r.set("courseId", newId)
                r.save(null, {
                    success: function (model, response) {
                        console.log("successfully saves result")
                    },
                    error: function (model, response) {
                        (console.log(response))
                    }
                });
            })


        },
        info: function () {
            //App.$el.children('.body').html('<div id="underconstruction"><img src="img/cons.jpg" alt="Under Construction" height="100%" width="100%"> </div>')
            App.$el.children('.body').html(' ')

        },
        ereader: function () {
            //App.$el.children('.body').html('<div id="underconstruction"><img src="img/cons.jpg" alt="Under Construction" height="100%" width="100%"> </div>')
            App.$el.children('.body').html(' ')

        },
        

        checkLoggedIn: function () {
            if (!$.cookie('Member._id')) {
                console.log($.url().attr('fragment'))
                if ($.url().attr('fragment') != 'login' && $.url().attr('fragment') != '' && $.url().attr('fragment') != 'member/add') {
                    Backbone.history.stop()
                    App.start()
                }
            } else {
                var expTime = $.cookie('Member.expTime')
                var d = new Date(Date.parse(expTime))
                var diff = Math.abs(new Date() - d)
                //alert(diff)
                var expirationTime = 600000
                if (diff < expirationTime) {
                    var date = new Date()
                    $.cookie('Member.expTime', date, {
                        path: "/apps/_design/bell"
                    })
                    $.cookie('Member.expTime', date, {
                        path: "/apps/_design/bell"
                    })
                } else {
                    this.expireSession()
                    Backbone.history.stop()
                    App.start()

                }
            }
        },

        viewAllFeedback: function () {
            feed = new App.Collections.siteFeedbacks()
            feed.fetch({
                success: function () {
                    feedul = new App.Views.siteFeedbackPage({
                        collection: feed
                    })
                    feedul.render()
                    App.$el.children('.body').html('&nbsp')
                    App.$el.children('.body').append(feedul.el)
                }
            })
        },
        renderNav: function () {
            if ($.cookie('Member._id')) {
                var na = new App.Views.navBarView({
                    isLoggedIn: '1'
                })
            } else {
                var na = new App.Views.navBarView({
                    isLoggedIn: '0'
                })
            }
            $('div.navbar-collapse').html(na.el)
        },


        CoursesBarChart: function () {
            App.$el.children('.body').html('&nbsp')
            App.$el.children('.body').append('<div id="veticallable"><b>S<br/>T<br/>E<br/>P<br/>S<br/></b></div>')
            App.$el.children('.body').append('<div id="graph"></div>')
            App.$el.children('.body').append('<div id="horizontallabel"><b>COURSES</b></div>')
            var coursesResults = new App.Collections.memberprogressallcourses()
            coursesResults.memberId = $.cookie('Member._id')
            coursesResults.fetch({
                async: false
            })
            var chart = new App.Views.CoursesChartProgress({
                collection: coursesResults
            })
            chart.render()
            App.$el.children('.body').append(chart.el)
        },


        MemberForm: function (memberId) {
            this.modelForm('Member', 'Member', memberId, 'login')
        },

        modelForm: function (className, label, modelId, reroute) {
            // Set up
            var model = new App.Models[className]()
            var modelForm = new App.Views[className + 'Form']({
                model: model
            })

            // Bind form to the DOM
            if (modelId) {
                App.$el.children('.body').html('<h3>Update Profile </h3>')
            } else {
                App.$el.children('.body').html('<h3 class="signup-heading">Become a ' + label + '</h3>')
            }
            App.$el.children('.body').append(modelForm.el)

            // Bind form events for when Group is ready
            model.once('Model:ready', function () {
                // when the users submits the form, the group will be processed
                modelForm.on(className + 'Form:done', function () {
                    Backbone.history.navigate(reroute, {
                        trigger: true
                    })
                })
                // Set up the form
                modelForm.render()
                $('#olelogo').remove()
            })

            // Set up the model for the form
            if (modelId) {
                model.id = modelId
                model.once('sync', function () {
                    model.trigger('Model:ready')
                })
                model.fetch({
                    async: false
                })
            } else {
                model.trigger('Model:ready')
            }
        },


        SearchResult: function (text) {
            this.renderFeedback
            skipStack.push(skip)
            if (text) {
                searchText = text
            } else {
                searchText = $("#searchText").val()
            }
            var search = new App.Views.Search()
            App.$el.children('.body').html(search.el)
            search.render()
            $("#searchText").val(searchText)
            $('#olelogo').remove()
        },

        SearchBell: function () {

            var search = new App.Views.Search()
            App.$el.children('.body').html(search.el)
            search.render()
            $('#olelogo').remove()
        },
        Dashboard: function () {
            App.ShelfItems = {} // Resetting the Array Here http://stackoverflow.com/questions/1999781/javascript-remove-all-object-elements-of-an-associative-array
            $.ajax({
                type: 'GET',
                url: '/shelf/_design/bell/_view/DuplicateDetection?include_docs=true&key="' + $.cookie('Member._id') + '"',
                dataType: 'json', 
                success: function (response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        App.ShelfItems[response.rows[i].doc.resourceId] = [response.rows[i].doc.hidden + "+" + response.rows[i].doc.resourceTitle + "+" + response.rows[i].doc._id]
                    }
                },
                data: {},
                async: false
            });
            var dashboard = new App.Views.Dashboard()
            App.$el.children('.body').html(dashboard.el)
            dashboard.render()
            $('#olelogo').remove()
        },

        MemberLogin: function () {
            // Prevent this Route from completing if Member is logged in.
            if ($.cookie('Member._id')) {
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
                return
            }
            var credentials = new App.Models.Credentials()
            var memberLoginForm = new App.Views.MemberLoginForm({
                model: credentials
            })
            memberLoginForm.once('success:login', function () {
                $('#logo').html($("#template-logoimg").html())
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
            })
            memberLoginForm.render()
            App.$el.children('.body').html('<h1 class="login-heading">Member login</h1>')
            App.$el.children('.body').append(memberLoginForm.el)
            // Override the menu
            $('#logo').html($("#template-logoimg").html())
        },

        MemberLogout: function () {

            App.ShelfItems = {}
            this.expireSession()

            Backbone.history.navigate('login', {
                trigger: true
            })
        },
        expireSession: function () {

            $.removeCookie('Member.login', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member._id', {
                path: "/apps/_design/bell"
            })
            
            $.removeCookie('Member.expTime', {
                path: "/apps/_design/bell"
            })

        },

        Groups: function () {
            groups = new App.Collections.Groups()
            groups.fetch({
                success: function () {
                    $('#olelogo').remove();
                    groupsTable = new App.Views.GroupsTable({
                        collection: groups
                    })
                    groupsTable.render()

                    App.$el.children('.body').html('<h1 class="teams_table_heading"></h1>')
                    App.$el.children('.body').append('<table class=table-striped><tr><th><h6>Team Names</h6></th><th><h6>Assignments</h6></th></tr></table>')
                    App.$el.children('.body').append(groupsTable.el)
                }
            })
        },

        MemberGroups: function () {
            groups = new App.Collections.MemberGroups()
            groups.memberId = $.cookie('Member._id')
            groups.fetch({
                success: function () {
                    $('#olelogo').remove();
                    groupsTable = new App.Views.GroupsTable({
                        collection: groups
                    })
                    groupsTable.render()
                    App.$el.children('.body').html('<h1>My Courses</h1>')
                    App.$el.children('.body').append(groupsTable.el)
                }
            })
        },

        GroupAssignments: function (groupId) {
            var group = new App.Models.Group()
            group.id = groupId
            group.once('sync', function () {
                var groupAssignments = new App.Collections.GroupAssignments({
                    group: group
                })
                groupAssignments.groupId = groupId
                var groupAssignmentsTable = new App.Views.GroupAssignmentsTable({
                    collection: groupAssignments
                })
                App.$el.children('.body').html('&nbsp')
                App.$el.children('.body').append(groupAssignmentsTable.el)
                groupAssignmentsTable.vars.groupName = group.get('name')
                groupAssignmentsTable.render()
                groupAssignments.fetch()
            })
            group.fetch()
        },


        CourseDetails: function (courseId, name) {
            var ccSteps = new App.Collections.coursesteps()
            ccSteps.courseId = courseId
            
            ccSteps.fetch({
                success: function () {
                    App.$el.children('.body').html('&nbsp')
                    App.$el.children('.body').append('<p class="Course-heading">Course<b>|</b>' + name + '    <a href="#CourseInfo/' + courseId + '"><button class="btn fui-eye"></button></a><a id="showBCourseMembers" style="float:right;margin-right:10%" href="#course/members/'+courseId+'" style="margin-left:10px" class="btn btn-info">Course Members</a> </p>')
                    var levelsTable = new App.Views.CourseLevelsTable({
                        collection: ccSteps,
                    })
                    levelsTable.courseId=courseId
                    levelsTable.render()
                    App.$el.children('.body').append(levelsTable.el)
                    $("#accordion")
                        .accordion({
                            header: "h3"
                        })
                        .sortable({
                            axis: "y",
                            handle: "h3",
                            stop: function (event, ui) {
                                // IE doesn't register the blur when sorting
                                // so trigger focusout handlers to remove .ui-state-focus
                                ui.item.children("h3").triggerHandler("focusout");
                            }
                        });
                }
            })
        },
        CourseInfo: function (courseId) {

            var courseModel = new App.Models.Group()
            courseModel.set('_id', courseId)
            courseModel.fetch({
                async: false
            })

            var courseLeader = courseModel.get('courseLeader')
            var memberModel = new App.Models.Member()
            memberModel.set('_id', courseLeader)
            memberModel.fetch({
                async: false
            })

            var viewCourseInfo = new App.Views.CourseInfoView({
                model: courseModel
            })
            viewCourseInfo.leader = memberModel

            viewCourseInfo.render()
            App.$el.children('.body').html("&nbsp")
            App.$el.children('.body').append('<div class="courseInfo-header"><a href="#course/details/' + courseId + '/' + courseModel.get('name') + '"><button type="button" class="btn btn-info" id="back">Back</button></a>&nbsp;&nbsp;&nbsp;&nbsp<a href="#course/resign/' + courseId + '"><button id="resignCourse" class="btn resignBtn btn-danger" value="0">Resign</button></a>&nbsp;&nbsp;</div>')
            App.$el.children('.body').append(viewCourseInfo.el)



        },
        ResignCourse: function (courseId) {

            var memberId = $.cookie('Member._id')
            var courseModel = new App.Models.Group()
            courseModel.set('_id', courseId)
            courseModel.fetch({
                async: false
            })
            var courseMemebers = courseModel.get('members')
            var index = courseMemebers.indexOf(memberId)
            courseMemebers.splice(index, 1)
            courseModel.set({
                members: courseMemebers
            })
            courseModel.save();

            var memberProgress = new App.Collections.memberprogressallcourses()
            memberProgress.memberId = memberId
            memberProgress.fetch({
                async: false
            })
            memberProgress.each(function (m) {
                if (m.get("courseId") == courseId) {
                    m.destroy()
                }
            })

            var mail = new App.Models.Mail();
            var currentdate = new Date();
            var id = courseModel.get('courseLeader')
            var subject = 'Course Resignation | ' + courseModel.get('name') + ''
            var mailBody = 'Hi,<br>Member ' + $.cookie('Member.login') + ' has resign from ' + courseModel.get('name') + ''

            mail.set("senderId", $.cookie('Member._id'))
            mail.set("receiverId", id)
            mail.set("subject", subject)
            mail.set("body", mailBody)
            mail.set("status", "0")
            mail.set("type", "mail")
            mail.set("sentDate", currentdate)
            console.log(mail)
            mail.save();
            alert("Successfully resigned from " + courseModel.get('name') + ' . ')

            Backbone.history.navigate('dashboard', {
                trigger: true
            })

        },
        NewsFeed: function () {
            var resources = new App.Collections.NewsResources()
            resources.fetch({
                success: function () {
                    var resourcesTableView = new App.Views.ResourcesTable({
                        collection: resources
                    })
                    resourcesTableView.render()
                    App.$el.children('.body').html("&nbsp")
                    App.$el.children('.body').append(resourcesTableView.el)
                }
            })
        },

        /*
         * Article_List fetches the Article againt AuthorTitle and Displays
         */

        Article_List: function (authorTitle) {
            var resources = new App.Collections.NewsResources()
            resources.fetch({
                success: function () {
                    var articleTableView = new App.Views.ArticleTable({
                        collection: resources
                    })
                    articleTableView.setAuthorName(authorTitle)
                    articleTableView.render()
                    App.$el.children('.body').html("&nbsp")
                    App.$el.children('.body').append(articleTableView.el)
                }
            })
        },

        AddResourceToShelf: function (rid, title, revid) {
            var shelfItem = new App.Models.Shelf()
            shelfItem.set('memberId', $.cookie('Member._id'))
            shelfItem.set('resourceId', rid)
            shelfItem.set('resourceTitle', title)
            //Adding the Selected Resource to the Shelf Hash(Dictionary)
            shelfItem.save(null, {
                success: function (model, response, options) {
                    App.ShelfItems[rid] = [title + "+" + response.id + "+" + response.rev]
                }
            });
            //App.ShelfItems[rid] = [title]
            skip = skipStack.pop() // To Render on the same page poping the staring index of  current page values to display
            App.Router.SearchResult(searchText)
        },

        Resource_Detail: function (rsrcid, sid, revid) {
            var resource = new App.Models.Resource()
            resource.SetRid(rsrcid)
            resource.fetch({
                success: function () {
                    var resourceDetail = new App.Views.ResourcesDetail({
                        model: resource
                    })
                    resourceDetail.SetShelfId(sid, revid)
                    resourceDetail.render()
                    App.$el.children('.body').html(resourceDetail.el)
                }
            })

        },
        Meetup_Detail:function(meetupId,title){
        
            var meetupModel=new App.Models.MeetUp({_id:meetupId})
            meetupModel.fetch({async:false})
            var meetup_details=new App.Views.MeetupDetails({model:meetupModel})
            meetup_details.render()
            App.$el.children('.body').html(meetup_details.el)
        
        },

        //Calendar Methods  
        addEvent: function () {
            var model = new App.Models.Calendar()
            var modelForm = new App.Views.CalendarForm({
                model: model
            })
            App.$el.children('.body').html('<h3 class="signup-heading">Add Event</h3>')
            App.$el.children('.body').append(modelForm.el)
            modelForm.render()
        },
        DeleteEvent: function (eventId) {
            var cmodel = new App.Models.Calendar({
                _id: eventId
            })
            cmodel.fetch({
                async: false
            })
            cmodel.destroy({
                success: function () {
                    alert("Event Successfully Deleted!!!")
                    Backbone.history.navigate('calendar', {
                        trigger: true
                    })
                }
            })
        },
        EditEvent: function (eventId) {
            var cmodel = new App.Models.Calendar({
                _id: eventId
            })
            cmodel.fetch({
                async: false
            })

            var modelForm = new App.Views.CalendarForm({
                model: cmodel
            })
            modelForm.update = true
            App.$el.children('.body').html('<h3 class="signup-heading">Update Event</h3>')
            App.$el.children('.body').append(modelForm.el)
            modelForm.render()
        },
        calendaar: function (eventId) {
            App.$el.children('.body').html('&nbsp')
           
            App.$el.children('.body').append('<h5>Event Details</h5>')
             
            var cmodel = new App.Models.Calendar({
                _id: eventId
            })
            cmodel.fetch({
                async: false
            })
            App.$el.children('.body').append('<br/><b>Title: </b>' + cmodel.attributes.title)
            App.$el.children('.body').append('<br/><b>Description: </b>' + cmodel.attributes.description)
            App.$el.children('.body').append('<br/><b>Starting from: </b>' + new Date(cmodel.attributes.start))
            App.$el.children('.body').append('<br/><b>Ending at: </b>' + new Date(cmodel.attributes.end))
            App.$el.children('.body').append('<br/><br/><a class="btn btn-primary" href="#calendar-event/edit/' + eventId + '">Edit</a>')
            App.$el.children('.body').append('&nbsp;&nbsp;<a class="btn btn-primary" href="#calendar-event/delete/' + eventId + '">Delete</a>')
            App.$el.children('.body').append('&nbsp;&nbsp;<a href="#calendar" class="btn btn-info"><< Back To Calander</a>')
        },
        
        CalendarFunction: function () {

            App.$el.children('.body').html("<div id='addEvent' style='position:fixed;z-index:5;' class='btn btn-primary' onclick =\"document.location.href='#addEvent'\">Add Event</div><br/><br/>")
            App.$el.children('.body').append("<br/><br/><div id='calendar'></div>")
            $(document).ready(function () {

                var temp2 = []
                var allEvents = new App.Collections.Calendars()
                allEvents.fetch({
                    async: false
                })
                allEvents.each(function (evnt) {
                    var temp = new Object()
                    temp.title = evnt.attributes.title
                    temp.start = evnt.attributes.start
                    temp.end = evnt.attributes.end
                    temp.url = "calendar/event/" + evnt.id
                    temp.allDay = false
                    temp2.push(temp)
                });

                var membercourses = new App.Collections.MemberGroups()
                membercourses.fetch({
                    async: false
                })
                console.log(membercourses.length)

                membercourses.each(function (m) {


                    var cs = new App.Collections.CourseScheduleByCourse()
                    cs.courseId = m.get("_id")
                    //   alert(cs.courseId)

                    cs.fetch({
                        async: false
                    })

                    if (cs.length > 0) {
                        var model = cs.first()
                        var daysindex
                        if (model.get("type") == "Daily") {
                            daysindex = new Array(0, 1, 2, 3, 4, 5, 6)
                        } else {

                            daysindex = new Array()
                            var week = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
                            var sweek = model.get("weekDays")
                            var i = 0
                            while (i < sweek.length) {
                                daysindex.push(week.indexOf(sweek[i]))
                                i++
                            }
                        }

                        var sdate = model.get("startDate").split('/')
                        var edate = model.get("endDate").split('/')

                        var sdates = getScheduleDatesForCourse(new Date(sdate[2], sdate[0], sdate[1]), new Date(edate[2], edate[0], edate[1]), daysindex)
                        // alert(sdates)
                        var stime = convertTo24Hour(model.get("startTime"))
                        var etime = convertTo24Hour(model.get("endTime"))
                        for (var i = 0; i < sdates.length; i++) {

                            var temp = new Object()
                            temp.title = m.get('name')
                            temp.start = new Date(sdates[i].setHours(stime))
                            temp.end = new Date(sdates[i].setHours(etime))
                            temp.allDay = false
                            temp2.push(temp)
                        }

                    }

                });
                //alert(temp2.length)
                var calendar = $('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    selectable: true,
                    eventClick: function (event) {
                        Backbone.history.navigate(event.url, {
                            trigger: true
                        })
                        return false
                    },
                    events: temp2,
                });



            })
        },
        /*
         * Syncing pages
         *
         * @todo At the moment the syncing process replicates all databases from the server but
         * it should be selective according to the "linked group's assignments".  Linking more
         * than one group is having some issues and the UpdateAssignments route will need to
         * be made much more intelligent.
         */

        GroupLink: function (groupId) {
            App.once('done:pull_doc_ids', function () {
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
            })
            App.pull_doc_ids([groupId], window.location.origin + '/groups', 'groups')
        },

        // This route may no longer be needed so long as we are running the replication on
        // an interval from App.start()

        UpdateAssignments: function () {
            $('#olelogo').remove();
            App.$el.children('.body').html('<div class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
            App.$el.children('.body').append('<h3 class="assignments">Checking for new assignments... </h3>')
            PouchDB.replicate(window.location.origin + '/assignments', 'assignments', {
                complete: function () {
                    $('.assignments').append(' Done.')
                    App.$el.children('.body').append('<h3 class="courses">Checking for new courses... </h3>')
                    PouchDB.replicate(window.location.origin + '/groups', 'groups', {
                        complete: function () {
                            $('.courses').append(' Done.')
                            App.$el.children('.body').append('<h3 class="members">Checking for new members... </h3>')
                            PouchDB.replicate(window.location.origin + '/members', 'members', {
                                complete: function () {
                                    $('.members').append(' Done.')
                                    App.$el.children('.body').append('<h3 class="feedback">Sending feedback... </h3>')
                                    PouchDB.replicate('feedback', window.location.origin + '/feedback', {
                                        complete: function () {
                                            $('.feedback').append(' Done.')
                                            window.location = '/devices/_design/all/update.html'
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        },

        FeedbackForm: function (resourceId) {
            var feedbackModel = new App.Models.Feedback({
                resourceId: resourceId,
                memberId: $.cookie('Member._id')
            })
            feedbackModel.on('sync', function () {
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
            })
            var feedbackForm = new App.Views.FeedbackForm({
                model: feedbackModel
            })
            var user_rating
            feedbackForm.render()
            App.$el.children('.body').html('<h1>Add Feedback</h1>')
            App.$el.children('.body').append('<p style="font-size:15px;">&nbsp;&nbsp;<span style="font-size:50px;">.</span>Rating </p>')
            App.$el.children('.body').append('<div id="star" data-score="0"></div>')
            $('#star').raty()
            $("#star > img").click(function () {
                feedbackForm.setUserRating($(this).attr("alt"))
            });
            App.$el.children('.body').append(feedbackForm.el)
        }

    }))

})