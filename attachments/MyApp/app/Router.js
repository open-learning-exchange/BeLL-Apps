$(function(){
   
   App.Router=new(Backbone.Router.extend({
       
      routes:{
            '': 'MemberLogin',
            'dashboard': 'Dashboard',
            'ereader':'eReader',
            'login': 'MemberLogin',
            'logout': 'MemberLogout',
            'member/add': 'MemberForm',
            'member/edit/:mid': 'MemberForm',
            
            'resources': 'Resources',
            'resource/add': 'ResourceForm',
            'resource/edit/:resourceId': 'ResourceForm',
            'resource/detail/:rsrcid/:shelfid/:revid': 'Resource_Detail',
            'resource/feedback/:resourceId': 'ResourceFeedback',
            'resource/feedback/add/:resourceId/:title': 'FeedbackForm',
            
            'courses': 'Groups',
            'course/manage/:groupId': 'ManageCourse',
            'course/details/:courseId/:name': 'CourseDetails',
            'course/report/:groupId/:groupName': 'CourseReport',
            'course/assignments/week-of/:groupId/:weekOf': 'GroupWeekOfAssignments',
            'course/assignments/:groupId': 'GroupAssignments',
            'course/add': 'GroupForm',
            
            'level/add/:groupId/:levelId/:totalLevels': 'AddLevel',
            'level/view/:levelId/:rid': 'ViewLevel',
            
            'meetups':'ListMeetups',
            'meetup/add':'Meetup',
            'meetup/delete/:MeetupId':'deleteMeetUp',
            'meetup/detail/:meetupId/:title':'meetupDetails',
            'meetup/details/:meetupId/:title': 'meetupDetails',
            'meetup/manage/:meetUpId':'Meetup',
            
            
            'members': 'Members',
            
            'reports': 'Reports',
    	    'reports/edit/:resportId': 'ReportForm',
            'reports/add': 'ReportForm',
            
            'mail': 'email',
            
            'courses/barchart': 'CoursesBarChart',
            
             'calendar': 'CalendarFunction',
             'addEvent': 'addEvent',
             'calendar/event/:eid': 'calendaar',
             'calendar-event/edit/:eid': 'EditEvent',
            
      
      },
      initialize: function () {
            this.bind("all", this.startUpStuff)
            this.bind("all", this.checkLoggedIn)
            this.bind("all", this.renderNav)
        },
        eReader:function(){
            alert('match with ereader')
        },
        startUpStuff: function () {
        
            if (App.idss.length == 0) {}
            $('div.takeQuizDiv').hide()
            $('#externalDiv').hide()
            $('#invitationdiv').hide()
            $('#debug').hide()
            
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
            $('div#nav .container').html(na.el)
        },
        checkLoggedIn: function () {
            if (!$.cookie('Member._id')) {
                if ($.url().attr('fragment') != 'login' && $.url().attr('fragment') != '' && $.url().attr('fragment') != 'member/add') {
                    Backbone.history.stop()
                    App.start()
                }
            } else {
                var expTime = $.cookie('Member.expTime')
                var d = new Date(Date.parse(expTime))
                var diff = Math.abs(new Date() - d)
                var expirationTime = 7200000
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
      MemberLogin: function () {
      
            // Prevent this Route from completing if Member is logged in.
            if ($.cookie('Member._id')) {
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
                return
            }
            credentials = new App.Models.Credentials()
            var memberLoginForm = new App.Views.MemberLoginForm({
                model: credentials
            })
            memberLoginForm.once('success:login', function () {
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
            })
            memberLoginForm.render()
            App.$el.children('.body').html('<h1 class="login-heading">Member login</h1>')
            App.$el.children('.body').append(memberLoginForm.el)
        },
        MemberLogout: function () {

            App.ShelfItems = null
            this.expireSession()
            Backbone.history.navigate('login', {
                trigger: true
            })
        },
        getRoles:function(){
        
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            
            return roles
        },
        Dashboard: function () {
          //if(!App.ShelfItems)
            {
            	App.ShelfItems={}
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
            }
            var dashboard = new App.Views.Dashboard()
            App.$el.children('.body').html(dashboard.el)
            dashboard.render()
            $('#olelogo').remove()
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
        Resources: function () {
            App.startActivityIndicator()
            var context=this
            var temp = $.url().data.attr.host.split(".")  // get name of community
                temp = temp[0].substring(3)
            if(temp=="")
            temp='local'
            var roles = this.getRoles()
            
            var resources = new App.Collections.Resources({skip:0})
            resources.fetch({
                success: function () {
                    var resourcesTableView = new App.Views.ResourcesTable({
                        collection: resources
                    })
                    resourcesTableView.isManager = roles.indexOf("Manager")
                    resourcesTableView.render()
                    
                    var btnText='<p><a class="btn btn-success" href="#resource/add">Add New Resource</a>'
                        btnText+='<a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>Request Resource</a>'
                    App.$el.children('.body').html(btnText)
                    
                    App.$el.children('.body').append('<p style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;color:#0088CC;text-decoration: underline;">Resources</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">Collections</a></p>')
                     
                    if(roles.indexOf("Manager") !=-1 &&  ( temp=='hagadera' || temp=='dagahaley' || temp=='ifo'|| temp=='somalia' || temp=='demo') ){
						App.$el.children('.body').append('<button style="margin:-87px 0 0 400px;" class="btn btn-success"  onclick = "document.location.href=\'#viewpublication\'">View Publications</button>')
						App.$el.children('.body').append('<button style="margin:-120px 0 0 550px;" class="btn btn-success"  onclick = "document.location.href=\'#replicateResources\'">Sync Library to Somali Bell</button>')
                     
					}
					 App.$el.children('.body').append('<button style="margin-top:-64px;margin-left:20px;float: right;" class="btn btn-info" onclick="document.location.href=\'#resource/search\'">Search</button>')
                     App.$el.children('.body').append(resourcesTableView.el)
                     

                }
            })
            App.stopActivityIndicator()
            
        },
        Groups: function () {
         App.startActivityIndicator()
            /****** Amendment script *****/
//            var allcrs = new App.Collections.Groups();
//            allcrs.fetch({
//                async: false
//            })
//            allcrs.each(function (m) {
//                if (m.get("name") == null) {
//                    m.set("name", "not defined")
//                    m.save()
//                }
//            })
            /***********/
            
            groups = new App.Collections.Groups()
            groups.fetch({
                success: function () {
                    groupsTable = new App.Views.GroupsTable({
                        collection: groups
                    })
                    groupsTable.render()

                    var button = '<p>'
                    button += '<a class="btn btn-success" style="width: 110px"; href="#course/add">Add Course</a>'
                    button += '<a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Course")>Request Course</a>'
                    button += '<span style="float:right"><input id="searchText"  placeholder="Search" value="" size="30" style="height:24px;margin-top:1%;" type="text"><span style="margin-left:10px">'
                    button += '<button class="btn btn-info" onclick="CourseSearch()">Search</button></span>'
                    button += '</p>'
                    App.$el.children('.body').html(button)
                    App.$el.children('.body').append('<h1>Courses</h1>')
                    App.$el.children('.body').append(groupsTable.el)
                }
            })
              App.stopActivityIndicator()
        },
         CourseReport: function (cId, cname) {
        	
        	var roles = this.getRoles()
        	var course = new App.Models.Group();
        	course.id = cId
        	course.fetch({async:false})
        	
            App.$el.children('.body').html("<h2> " + cname + "</h2>")
            App.$el.children('.body').append('<button class="btn btn-success" style="margin-left:784px;margin-top:-74px"  onclick = "document.location.href=\'#course/manage/' + cId + '\'">Manage</button>')
            App.$el.children('.body').append("<div id='graph'></div>")
            var allResults = new App.Collections.StepResultsbyCourse()
            
            if(course.get('courseLeader')!=$.cookie('Member._id') && roles.indexOf("Manager") ==-1)
            {
            	allResults.memberId = $.cookie('Member._id')
            }
            allResults.courseId = cId
            allResults.fetch({
                async: false
            })
            var vi = new App.Views.CoursesStudentsProgress({
                collection: allResults
            })
            vi.render()
            App.$el.children('.body').append(vi.el)
            
        },
        
        ManageCourse: function (groupId) {
        
           var that=this
            levels = new App.Collections.CourseLevels()
            levels.groupId = groupId

            var className = "Group"
            var model = new App.Models[className]()
            var modelForm = new App.Views[className + 'Form']({
                model: model
            })
            App.$el.children('.body').html('<br/>')
            App.$el.children('.body').append('<h3>Course Manage</h3>')
            App.$el.children('.body').append(modelForm.el)
            model.once('Model:ready', function () {
                // when the users submits the form, the group will be processed
                modelForm.on(className + 'Form:done', function () {
                    Backbone.history.navigate(reroute, {
                        trigger: true
                    })
                })
                // Set up the form
                modelForm.render()
                
           $('.form .field-startDate input').datepicker({
               todayHighlight: true
            });
            $('.form .field-endDate input').datepicker({
               todayHighlight: true
            });
  				
            $('.form .field-startTime input').timepicker({
              'minTime': '8:00am',
                'maxTime': '12:30am',
            
            });
  				
            $('.form .field-endTime input').timepicker({
                'minTime': '8:00am',
                'maxTime': '12:30am',
            
            });
            
              var Roles=that.getRoles()
             if(Roles.indexOf('Manager')==-1)
              $('.form .field-courseLeader select').attr("disabled", "true")
            
              $('.form .field-frequency input').click(function() {
    				if(this.value=='Weekly')
    				{
    				  $('.form .field-Day').show()
    				}
    				else{
    				$('.form .field-Day').hide()
    				}

				});

                
            })
            
          
            // Set up the model for the form
            if (groupId) {
                model.id = groupId
                model.once('sync', function () {
                    model.trigger('Model:ready')
                })
                model.fetch()
            } else {
                model.trigger('Model:ready')
            }

            levels.fetch({
                success: function () {
                    levels.sort()
                    lTable = new App.Views.LevelsTable({
                        collection: levels
                    })
                    lTable.groupId = groupId
                    lTable.render()
                    App.$el.children('.body').append("</BR><h3> Course Steps </h3>")
                    App.$el.children('.body').append(lTable.el)

                    $("#moveup").hide()
                    $("#movedown").hide()
                    $("input[type='radio']").hide();
                }
            })
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
        GroupForm: function (groupId) {
            this.modelForm('Group', 'Course', groupId, 'courses')
             
        },
        MemberForm: function (memberId) {
            this.modelForm('Member', 'Member', memberId, 'members')
        },
		modelForm: function (className, label, modelId, reroute) {
            //cv Set up
            var context =this
            var model = new App.Models[className]()
            var modelForm = new App.Views[className + 'Form']({
                model: model
            })
            // Bind form to the DOM
            if (modelId) {
                App.$el.children('.body').html('<h1>Edit this ' + label + '</h1>')
            } else {
                App.$el.children('.body').html('<h1>Add ' + label + '</h1>')
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
                 
                $('.form .field-startDate input').datepicker({
               todayHighlight: true
            });
            $('.form .field-endDate input').datepicker({
               todayHighlight: true
            });
  				
            $('.form .field-startTime input').timepicker({
                'minTime': '8:00am',
                'maxTime': '12:30am',
            });
  				
            $('.form .field-endTime input').timepicker({
               'minTime': '8:00am',
                'maxTime': '12:30am',            
            
            });
            
  				$('.form .field-frequency input').click(function() {
    				if(this.value=='Weekly')
    				{
    				  $('.form .field-Day').show()
    				}
    				else{
    				$('.form .field-Day').hide()
    				}

				});

            
               

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

        GroupAssign: function (groupId) {
            var assignResourcesToGroupTable = new App.Views.AssignResourcesToGroupTable()
            assignResourcesToGroupTable.groupId = groupId
            assignResourcesToGroupTable.render()
            App.$el.children('.body').html(assignResourcesToGroupTable.el)
        },

        GroupWeekOfAssignments: function (groupId, weekOf) {

            // Figure out our week range
            if (!weekOf) {
                // Last Sunday
                weekOf = moment().subtract('days', (moment().format('d'))).format("YYYY-MM-DD")
            }
            var startDate = weekOf
            var endDate = moment(weekOf).add('days', 7).format('YYYY-MM-DD')

            var table = new App.Views.AssignWeekOfResourcesToGroupTable()
            // Bind this view to the App's body
            App.$el.children('.body').html(table.el)
            // Set variables on this View
            table.group = new App.Models.Group()
            table.group.id = groupId
            table.resources = new App.Collections.Resources()
            table.assignments = new App.Collections.GroupAssignmentsByDate()
            table.assignments.groupId = groupId,
                table.assignments.startDate = startDate
                table.assignments.endDate = endDate
                table.weekOf = weekOf

                // Fetch the collections and model, render when ready
                table.resources.on('sync', function () {
                    table.assignments.fetch()
                })
                table.assignments.on('sync', function () {
                    table.group.fetch()
                })
                table.group.on('sync', function () {
                    table.render()
                })
                table.resources.fetch()
        },
        AddLevel: function (groupId, levelId, totalLevels) {
        
            var Cstep = new App.Models.CourseStep()
            Cstep.set({
                courseId: groupId
            })
            var lForm = new App.Views.LevelForm({
                model: Cstep
            })


            if (levelId == "nolevel") {

                App.$el.children('.body').html('<h1>New Step</h1>')
                lForm.edit = false
                lForm.previousStep = 0
                lForm.render()
                App.$el.children('.body').append(lForm.el)
                $("input[name='step']").attr("disabled", true);
            } else {
                Cstep.set({
                    "_id": levelId
                })
                Cstep.once('sync', function () {
                    App.$el.children('.body').html('<h1>Edit Step</h1>')
                    lForm.edit = true
                    lForm.ques = Cstep.get("questions")
                    lForm.ans = Cstep.get("answers")
                    lForm.opt = Cstep.get("qoptions")
                    lForm.res = Cstep.get("resourceId")
                    lForm.rest = Cstep.get("resourceTitles")
                    lForm.previousStep = Cstep.get("step")
                    lForm.render()
                    App.$el.children('.body').append(lForm.el)
                    $("input[name='step']").attr("disabled", true);
                })
                Cstep.fetch()
            }
            if (totalLevels != -1) {
                var tl = parseInt(totalLevels) + 1
                $("input[name='step']").val(tl)
            }
            //  $('#bbf-form input[name=step]').attr("disabled",true);
        },
        ViewLevel: function (lid, rid) {
            var levelInfo = new App.Models.CourseStep({
                "_id": lid,
              //  "_rev": rid
            })
            var that = this
            levelInfo.fetch({
                success: function () {
                    var levelDetails = new App.Views.LevelDetail({
                        model: levelInfo
                    })
                    levelDetails.render()
                    App.$el.children('.body').html('<h3> Step ' + levelInfo.get("step") + ' | ' + levelInfo.get("title") + '</h3>')
                    App.$el.children('.body').append('<a class="btn btn-success" href=\'#level/add/' + levelInfo.get("courseId") + '/' + lid + '/-1\'">Edit Step</a>&nbsp;&nbsp;')
                    App.$el.children('.body').append("<a class='btn btn-success' href='#course/manage/" + levelInfo.get('courseId') + "'>Back To Course </a>&nbsp;&nbsp;")
                    App.$el.children('.body').append("</BR></BR><B>Description</B></BR><TextArea id='LevelDescription' rows='5' cols='100' style='width:98%;'>" + levelInfo.get("description") + "</TextArea></BR>")
                    App.$el.children('.body').append("<button class='btn btn-success' style='float:right;' onclick='document.location.href=\"#savedesc/" + lid + "\"'>Save</button></BR></BR>")
                    App.$el.children('.body').append('<B>Resources</B>&nbsp;&nbsp;<a class="btn btn-success"  style="" target="_blank" href=\'#search-bell/' + lid + '/' + rid + '\'">Add</a>')
                    App.$el.children('.body').append(levelDetails.el)
                    App.$el.children('.body').append('</BR>')
                    if (levelInfo.get("questions") == null) {
                        App.$el.children('.body').append('<a class="btn btn-success"  style="float:right;" target="_blank" href=\'#create-quiz/' + levelInfo.get("_id") + '/' + levelInfo.get("_rev") + '/' + levelInfo.get("title") + '\'">Create Quiz</a>&nbsp;&nbsp;')
                        //Backbone.history.navigate('create-quiz/'+levelInfo.get("_id")+'/'+levelInfo.get("_rev")+'/'+levelInfo.get("title"), {trigger: true})
                    } else {
                        App.$el.children('.body').append('<B>' + levelInfo.get("title") + ' - Quiz</B><a class="btn btn-primary"  style="float:right;" target="_blank" href=\'#create-quiz/' + levelInfo.get("_id") + '/' + levelInfo.get("_rev") + '/' + levelInfo.get("title") + '\'">Edit Quiz</a>&nbsp;&nbsp;')
                    }
                }
            })
        },
        ListMeetups: function () {
          
          App.$el.children('.body').html('<h3>Meetups<a style="margin-left:20px" class="btn btn-success" href="#meetup/add">Add Meetup</a></h3>')
          var meetUps=new App.Collections.Meetups()
          meetUps.fetch({
                 async:false
           })
         var meetUpView=new App.Views.MeetUpTable({collection:meetUps})
         
         meetUpView.render()
         App.$el.children('.body').append(meetUpView.el)
        },
       meetupDetails:function(meetupId,title){
        
            var meetupModel=new App.Models.MeetUp({_id:meetupId})
            meetupModel.fetch({async:false})
            var meetupView=new App.Views.meetupView({model:meetupModel})
            meetupView.render()
            App.$el.children('.body').html(meetupView.el)
            
        
        },
        Meetup: function (meetUpId) {
        
            var className = "MeetUp"
            var model = new App.Models[className]()
             if(meetUpId){
             
            		  	model.id=meetUpId
              			model.fetch({async:false})
             }
            var modelForm = new App.Views[className + 'Form']({
                model: model
            })
            
            modelForm.render()
             
            App.$el.children('.body').html(modelForm.el)
            
            $('.form .field-startTime input').timepicker({
               'minTime': '8:00am',
                'maxTime': '12:30am',
            })
            $('.form .field-endTime input').timepicker({
                 'minTime': '8:00am',
                'maxTime': '12:30am',
            })
            $('.form .field-startDate input').datepicker({
               todayHighlight: true
            });
             $('.form .field-endDate input').datepicker({
               todayHighlight: true
            });
            
            $('.form .field-reoccuring input').click(function() {
    				if(this.value=='Weekly')
    				{
    				  $('.form .field-Day').show()
    				}
    				else{
    				$('.form .field-Day').hide()
    				}

				});

        },
        deleteMeetUp:function(meetupId){
        
       var  UserMeetups = new App.Collections.UserMeetups()
            UserMeetups.meetupId=meetupId
            UserMeetups.fetch({async:false})
            var model;
			while (model = UserMeetups.first()) {
                   model.destroy();
            }
           var meetupModel=new App.Models.MeetUp({_id:meetupId})
               meetupModel.fetch({async:false})
               meetupModel.destroy() 
               Backbone.history.navigate('meetups', {
                        trigger: true
                    })
        
        },
    Members: function () {
    
            App.startActivityIndicator()
            
    	 	var config=new App.Collections.Configurations()
    	     config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
        
    	    
    	    code=cofigINJSON.code       
            
            var roles = this.getRoles()
            members = new App.Collections.Members()
            members.fetch({
                success: function () {
                    membersTable = new App.Views.MembersTable({
                        collection: members
                    })
                    membersTable.community_code=code
                    if (roles.indexOf("Manager") > -1) {
                        membersTable.isadmin = true
                    } else {
                        membersTable.isadmin = false
                    }
                    membersTable.render()


                    App.$el.children('.body').html('<h1>Members<a style="margin-left:20px" class="btn btn-success" href="#member/add">Add a New Member</a></h1>')


                    App.$el.children('.body').append(membersTable.el)
                }
            })
                      App.stopActivityIndicator()
        },
        Reports: function () {
        
            App.startActivityIndicator()
            
            var roles =this.getRoles()
            var reports = new App.Collections.Reports()
            reports.fetch({
                async: false
            })
            var resourcesTableView = new App.Views.ReportsTable({
                collection: reports
            })
            resourcesTableView.isManager = roles.indexOf("Manager")
            resourcesTableView.render()
             App.$el.children('.body').html('')
            if(roles.indexOf("Manager")>-1){
            App.$el.children('.body').append('<p><a class="btn btn-success" href="#reports/add">Add a new Report</a></p>')
			}
			var temp = $.url().attr("host").split(".")
            temp = temp[0].substring(3)
            if(temp.length==0){
            temp="Community"
            }
			App.$el.children('.body').append('<h4><span style="color:gray;">'+temp+'</span> | Reports</h4>')
            App.$el.children('.body').append(resourcesTableView.el)
            App.stopActivityIndicator()

        },
        Resource_Detail: function (rsrcid, sid, revid) {
            var resource = new App.Models.Resource({_id:rsrcid})
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
        RenderTagSelect: function (iden) {
		
	    var collections = new App.Collections.listRCollection()
	    collections.major = true
	    collections.fetch({
	        async: false
	    })
	    collections.each(function (a) {
	        $(iden).append('<option value="' + a.get('_id') + '" class="MajorCategory">' + a.get('CollectionName') + '</option>')
	    })

	    var subcollections = new App.Collections.listRCollection()
	    subcollections.major = false
	    subcollections.fetch({
	        async: false
	    })
	    _.each(subcollections.last(subcollections.length).reverse(), function (a) {
	    	
	        if (a.get('NesttedUnder') == '--Select--') {
	            $(iden).append('<option value="' + a.get('_id') + '">' + a.get('CollectionName') + '</option>')
	        } else {
	            if ($(iden+' option[value="' + a.get("NesttedUnder") + '"]') != null) {
	                $(iden).find('option[value="' + a.get("NesttedUnder") + '"]').after('<option value="' + a.get('_id') + '">' + a.get('CollectionName') + '</option>')
	            }
	        }
	    })
	  },
         ResourceForm: function (resourceId) {
	    var context = this
	    var resource = (resourceId) ? new App.Models.Resource({
	        _id: resourceId
	    }) : new App.Models.Resource()
	    resource.on('processed', function () {
	        Backbone.history.navigate('resources', {
	            trigger: true
	        })
	    })
	    var resourceFormView = new App.Views.ResourceForm({
	        model: resource
	    })
	    App.$el.children('.body').html(resourceFormView.el)

	    if (resource.id) {
	        App.listenToOnce(resource, 'sync', function () {
	            resourceFormView.render()

	        })
	        resource.fetch({
	            async: false
	        })
	    } else {
	        resourceFormView.render()
	        $("input[name='addedBy']").val($.cookie("Member.login"));
	    }
	    $("input[name='addedBy']").attr("disabled", true);
	    $("select[class='bbf-date']").attr("disabled", true);
	    $("select[class='bbf-month']").attr("disabled", true);
	    $("select[class='bbf-year']").attr("disabled", true);

	    $('.form .field-subject select').attr("multiple", true);
	    $('.form .field-Level select').attr("multiple", true);
	    $('.form .field-Tag select').attr("multiple", true);


	    $('.form .field-Tag select').click(function () {
	        context.AddNewSelect(this.value)
	    });
	    $('.form .field-Tag select').dblclick(function () {
	        context.EditTag(this.value)
	    });
	    var identifier = '.form .field-Tag select'
	    this.RenderTagSelect(identifier)
	    
	    if(resource.id==undefined)
	    {
	    	$(".form .field-Tag select").find('option').removeAttr("selected");
	    	$("'.form .field-Level select").find('option').removeAttr("selected");
	    	$(".form .field-subject select").find('option').removeAttr("selected");
	    
	    }
	    
	    if (resource.id) {
	        if(resource.get('Tag'))
	        {
	        	var total = resource.get('Tag').length
	        for (var counter = 0; counter < total; counter++)
	            $('.form .field-Tag select option[value="' + resource.get('Tag')[counter] + '"]').attr('selected', 'selected')
	         $('.form .field-Tag select option[value="Add New"]:selected').removeAttr("selected")
	        }
	        if(resource.get('subject')==null){
	        	$(".form .field-subject select").find('option').removeAttr("selected");
	        }
	        if(resource.get('Tag')==null) {
	        	$(".form .field-Tag select").find('option').removeAttr("selected");
	        }
	        if(resource.get('Level')==null)  {
	        	$("'.form .field-Level select").find('option').removeAttr("selected")
	        }
	        console.log(resource.get('Level'))  
	    }
	},
        ResourceFeedback: function (resourceId) {
            var resource = new App.Models.Resource()
            resource.id = resourceId
            resource.on('sync', function () {
                var resourceFeedback = new App.Collections.ResourceFeedback()
                resourceFeedback.resourceId = resourceId
                var feedbackTable = new App.Views.FeedbackTable({
                    collection: resourceFeedback
                })
                resourceFeedback.on('sync', function () {
                    feedbackTable.render()
                    
                    App.$el.children('.body').html('<h3>Feedback for "' + resource.get('title') + '"</h3>')
                    var url_togo = "#resource/feedback/add/"+resourceId+"/"+resource.get('title')
                    App.$el.children('.body').append('<a class="btn" href="'+url_togo+'"><i class="icon-plus"></i> Add your feedback</a>')
                    App.$el.children('.body').append('<a class="btn" style="margin:20px" href="#resources"><< Back to Resources</a>')
                    App.$el.children('.body').append(feedbackTable.el)
                })
                resourceFeedback.fetch()
            })
            resource.fetch()
        },
        FeedbackForm: function (resourceId,title) {
      		var feedbackModel = new App.Models.Feedback({resourceId: resourceId, memberId: $.cookie('Member._id')})
      		feedbackModel.on('sync', function() {
        		Backbone.history.navigate('resource/feedback/' + resourceId, {trigger: true})
      		})
  			var resInfo=new App.Models.Resource({_id: resourceId})
      		resInfo.fetch({async:false})
  			var feedbackForm = new App.Views.FeedbackForm({model: feedbackModel})
   	   		feedbackForm.rtitle=resInfo.get('title')
  			var user_rating 
      feedbackForm.render()
     
     
      
      App.$el.children('.body').html('<h4 style="color:gray">Add Feedback For<span style="color:black;"> '+resInfo.get('title')+'</span></h4>')
      App.$el.children('.body').append('<p style="font-size:15px;">&nbsp;&nbsp;<span style="font-size:50px;">.</span>Rating </p>')
      App.$el.children('.body').append('<div id="star" data-score="0"></div>')
      $('#star').raty()
      $("#star > img").click(function(){
          feedbackForm.setUserRating($(this).attr("alt"))
      });

      App.$el.children('.body').append(feedbackForm.el)
   },
         email: function () {
            App.$el.children('.body').html('&nbsp')
            var config=new App.Collections.Configurations()
    	     config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()    	    
    	    code=cofigINJSON.code
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
        AddToshelf:function(rId,title){
      
      		 var memberShelfResource=new App.Collections.shelfResource() 
             memberShelfResource.resourceId=rId
             memberShelfResource.memberId=$.cookie('Member._id') 
             memberShelfResource.fetch({async:false})
      if(memberShelfResource.length==0){
      		
          var shelfItem=new App.Models.Shelf()
              shelfItem.set('memberId',$.cookie('Member._id'))
              shelfItem.set('resourceId',rId)
              shelfItem.set('resourceTitle',title)
              //Adding the Selected Resource to the Shelf Hash(Dictionary)
              shelfItem.save(null, {
            	  success: function(model,response,options) {}
              });
       		  alert('Successfully Add To Shelf')
       		 }
       else{
      		   alert('Already in Shelf')
       }
     
      
    },
    CalendarFunction:function(){
    

            App.$el.children('.body').html("<div id='addEvent' style='position:fixed;z-index:5;' class='btn btn-primary' onclick =\"document.location.href='#addEvent'\">Add Event</div><br/><br/>")
            App.$el.children('.body').append("<br/><br/><div id='calendar'></div>")
            $(document).ready(function () {

                var temp2 = []
                var allEvents = new App.Collections.Calendars()
                allEvents.fetch({
                    async: false
                })
                allEvents.each(function (evnt) {
                 
                if(evnt.get('startDate') && evnt.get('endDate'))
                 {	
                    var sdate=evnt.get('startDate').split('/')
                    var edate=evnt.get('endDate').split('/')
                    daysindex = new Array(0, 1, 2, 3, 4, 5, 6)
                	var sdates = getScheduleDatesForCourse(new Date(sdate[2], --sdate[0], sdate[1]), new Date(edate[2], --edate[0], edate[1]), daysindex)
                    var stime = convertTo24Hour(evnt.get("startTime"))
                    var etime = convertTo24Hour(evnt.get("endTime"))
                    
                 for (var i = 0; i < sdates.length; i++) {
                 
                            var temp = new Object()
                            temp.title = evnt.get('title')
                            temp.start = new Date(sdates[i].setHours(stime))
                            temp.end = new Date(sdates[i].setHours(etime))
                            temp.url = "calendar/event/" + evnt.id
                            temp.allDay = false
                            temp2.push(temp)
                   }
                  }  
                });

                var membercourses = new App.Collections.MemberGroups()
                membercourses.fetch({
                    async: false
                })
                console.log(membercourses.length)

                membercourses.each(function (model) {

                        var daysindex
                        if (model.get("frequency") == "Daily") {
                            daysindex = new Array(0, 1, 2, 3, 4, 5, 6)
                        } else {

                            daysindex = new Array()
                            var week = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
                            
                            var sweek = model.get("Day")
                            
                        if(sweek instanceof Array){}
            			else{
            					var temp=sweek
               					sweek=new Array()
               					sweek[0]=temp 
            				}
            				
                            var i = 0
                            while (i < sweek.length) {
                                daysindex.push(week.indexOf(sweek[i]))
                                i++
                            }
                        }
                        
                    if(model.get("startDate") && model.get("startDate"))
                    {
                        var sdate = model.get("startDate").split('/')
                        var edate = model.get("endDate").split('/')
                        
                         console.log(sdate)
                         console.log(edate)
                         
                        var sdates = getScheduleDatesForCourse(new Date(sdate[2], --sdate[0], sdate[1]), new Date(edate[2], --edate[0], edate[1]), daysindex)
                        
                        var stime = convertTo24Hour(model.get("startTime"))
                        var etime = convertTo24Hour(model.get("endTime"))
                        
                        for (var i = 0; i < sdates.length; i++) {
                            var temp = new Object()
                            temp.title = '\nCourse: \n'+model.get('name')
                            temp.start = new Date(sdates[i].setHours(stime))
                            temp.end = new Date(sdates[i].setHours(etime))
                            temp.allDay = false
                            temp2.push(temp)
                        }
                    }

                });
                
                var memMeetup=new App.Collections.UserMeetups()
                    memMeetup.memberId=$.cookie('Member._id')
                    memMeetup.fetch({async:false})
                
                  memMeetup.each(function(meetup){
                         model= new App.Models.MeetUp({_id:meetup.get('meetupId')})
                         model.fetch({async:false})
                         

                        var daysindex
                        if (model.get("reoccuring") == "Daily") {
                            daysindex = new Array(0, 1, 2, 3, 4, 5, 6)
                        } else {

                            daysindex = new Array()
                            var week = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
                            
                            var sweek = model.get("Day")
                            
                        if(sweek instanceof Array){}
            			else{
            					var temp=sweek
               					sweek=new Array()
               					sweek[0]=temp 
            				}
            				
                            var i = 0
                            while (i < sweek.length) {
                                daysindex.push(week.indexOf(sweek[i]))
                                i++
                            }
                        }
                        
                    if(model.get("startDate") && model.get("startDate"))
                    {
                        var sdate = model.get("startDate").split('/')
                        var edate = model.get("endDate").split('/')
                        
                         console.log(sdate)
                         console.log(edate)
                         
                        var sdates = getScheduleDatesForCourse(new Date(sdate[2], --sdate[0], sdate[1]), new Date(edate[2], --edate[0], edate[1]), daysindex)
                        
                        var stime = convertTo24Hour(model.get("startTime"))
                        var etime = convertTo24Hour(model.get("endTime"))
                        
                        for (var i = 0; i < sdates.length; i++) {
                            var temp = new Object()
                            temp.title = '\nMeetup: \n'+model.get('title')
                            temp.start = new Date(sdates[i].setHours(stime))
                            temp.end = new Date(sdates[i].setHours(etime))
                            temp.allDay = false
                            temp2.push(temp)
                        }
                    }

                
                  })
                    
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
     addEvent: function () {
            var model = new App.Models.Calendar()
            var modelForm = new App.Views.CalendarForm({
                model: model
            })
            App.$el.children('.body').html('<h3 class="signup-heading">Add Event</h3>')
            App.$el.children('.body').append(modelForm.el)
            modelForm.render()
            $('.bbf-form .field-startTime input').timepicker({
                'minTime': '8:00am',
                'maxTime': '12:30am',
            })
            $('.bbf-form .field-endTime input').timepicker({
                'minTime': '8:00am',
                'maxTime': '12:30am',
            })
            $('.bbf-form .field-startDate input').datepicker({
               todayHighlight: true
            });
             $('.bbf-form .field-endDate input').datepicker({
               todayHighlight: true
            });
        },
    calendaar: function (eventId) {
            App.$el.children('.body').html('&nbsp')
            var cmodel = new App.Models.Calendar({
                _id: eventId
            })
            cmodel.fetch({
                async: false
            })
            var eventView=new App.Views.EventInfo({model:cmodel})
            eventView.render()
            App.$el.children('.body').append(eventView.el)
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
        
   
   
   }))
  


})