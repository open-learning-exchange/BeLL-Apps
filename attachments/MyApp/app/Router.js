$(function(){
   
   App.Router=new(Backbone.Router.extend({
       
      routes:{
            // '': 'MemberLogin',
//             'dashboard': 'Dashboard',
//             'ereader':'eReader',
//             'login': 'MemberLogin',
//             'logout': 'MemberLogout',
//             'member/add': 'MemberForm',
//             'member/edit/:mid': 'MemberForm',
//             'resources': 'Resources',
//             'resource/detail/:rsrcid/:shelfid/:revid': 'Resource_Detail',
//             
//             'courses': 'Groups',
//             'course/manage/:groupId': 'ManageCourse',
//             'course/details/:courseId/:name': 'CourseDetails',
//             
//             'meetups':'ListMeetups',
//             'meetup/add':'Meetup',
//             'meetup/delete/:MeetupId':'deleteMeetUp',
//             'meetup/detail/:meetupId/:title':'meetupDetails',
//             'meetup/details/:meetupId/:title': 'meetupDetails',
//             'meetup/manage/:meetUpId':'Meetup',
//             
//             'members': 'Members',
//             
//             'reports': 'Reports',
//     	    'reports/edit/:resportId': 'ReportForm',
//             'reports/add': 'ReportForm',
				
            '': 'LandingScreen',
            'teams': 'Resources',
            'landingPage': 'LandingScreen',
            'becomemember': 'BecomeMemberForm',
            
            
            'resources': 'Resources',
            'resource/add': 'ResourceForm',
            'resource/edit/:resourceId': 'ResourceForm',
            'resource/feedback/:resourceId': 'ResourceFeedback',
            'resource/invite/:resourceId/:name/:kind': 'ResourceInvitation',
            'resource/feedback/add/:resourceId': 'FeedbackForm',
            'resource/feedback/add/:resourceId/:title': 'FeedbackForm',
            'courses': 'Groups',
            'courses/:courseId':'Groups',
            'meetups':'ListMeetups',
            'meetup/add':'Meetup',
            'meetup/delete/:MeetupId':'deleteMeetUp',
            'meetup/details/:meetupId/:title':'meetupDetails',
            'meetup/manage/:meetUpId':'Meetup',
            'course/details/:courseId/:courseName':'courseDetails',
            'course/edit/:groupId': 'GroupForm',
            'course/default': 'Explore_Bell_Courses',
            'course/assign/:groupId': 'GroupAssign',
            'course/assignments/week-of/:groupId': 'GroupWeekOfAssignments',
            'course/manage/:groupId': 'ManageCourse',
            'addItemstoLevel/:lid/:rid/:title': 'AddItemsToLevel',
            'level/add/:groupId/:levelId/:totalLevels': 'AddLevel',
            'level/view/:levelId/:rid': 'ViewLevel',
            'course/assignments/week-of/:groupId/:weekOf': 'GroupWeekOfAssignments',
            'course/assignments/:groupId': 'GroupAssignments',
            'course/add': 'GroupForm',
            'members': 'Members',
            'compile/week': 'CompileManifestForWeeksAssignments',
            'compile': 'CompileManifest',
            'resource/search': 'bellResourceSearch',
            'search-bell/:levelId/:rId': 'SearchBell',
            'search-bell/:publicationId': 'SearchPresources',
            'search-result': 'SearchResult',
            'assign-to-level': 'AssignResourcetoLevel',
            'assign-to-shelf': 'AssignResourcetoShelf',
            'create-quiz/:lid/:rid/:title': 'CreateQuiz',
            'demo-version': 'DemoVersion',
            'savedesc/:lid': 'saveDescprition',
            'addToshelf/:rid/:title'       : 'AddToshelf',
            'resource/atlevel/feedback/:rid/:levelid/:revid': 'LevelResourceFeedback',
            'search/courses': 'SearchCourses',
            'assign-to-default-courses': 'AssignCoursestoExplore',
            'siteFeedback': 'viewAllFeedback',
            'course/report/:groupId/:groupName': 'CourseReport',
            'myRequests': 'myRequests',
            'AllRequests': 'AllRequests',
            'replicateResources': 'Replicate',
            'reports': 'Reports',
    	    'reports/edit/:resportId': 'ReportForm',
            'reports/add': 'ReportForm',
            'collection':'Collection',
            'listCollection/:collectionId':'ListCollection',
            'listCollection/:collectionId/:collectionName':'ListCollection',
            'viewpublication':'ViewPublication',
            'publicationdetail/:publicationId': 'PublicationDetails',
            'abc':'resourcesTagScript',
            'abcde':'resourcesIdScript',
            
            			
            '': 'MemberLogin',
            'dashboard': 'Dashboard',
            'ereader': 'eReader',
            'info': 'info',
            'login': 'MemberLogin',
            'logout': 'MemberLogout',
            'my-courses': 'MemberGroups',
           //(same in LMS)  'course/edit/:groupId': 'GroupForm',
           //(same in LMS)    'course/assignments/:groupId': 'GroupAssignments',
           //(same in LMS)   'search-result': 'SearchResult',
           //(same in LMS)   'siteFeedback': 'viewAllFeedback',
           //(same in LMS)   'member/add': 'MemberForm',
           //(same in LMS)   'logout': 'MemberLogout',
           //(same in LMS)     'login': 'MemberLogin',
           //(same in LMS)   'member/edit/:memberId': 'MemberForm',
           //(same in LMS) 'course/details/:courseId/:name': 'CourseDetails', // @todo delete and change refs to it
            'CourseInfo/:courseId': 'CourseInfo',
            'course/resign/:courseId': 'ResignCourse',
            'course/members/:courseId':'GroupMembers',
            'course/link/:groupId': 'GroupLink',
            'update-assignments': 'UpdateAssignments',
            'resource/feedback/add/:resourceId': 'FeedbackForm',
            'newsfeed': 'NewsFeed',
            'newsfeed/:authorTitle': 'Article_List',
            'search-bell': 'SearchBell',
            'member/add': 'MemberForm',
            'member/edit/:mid': 'MemberForm',
            'addResource/:rid/:title/:revid': 'AddResourceToShelf',
            'resource/detail/:rsrcid/:shelfid/:revid': 'Resource_Detail', //When Item is Selected from the shelf 
            'meetup/detail/:meetupId/:title': 'Meetup_Detail',
            'calendar': 'CalendarFunction',
            'calendar/event/:eid': 'calendaar',
            'calendar-event/edit/:eid': 'EditEvent',
            'addEvent': 'addEvent',
            'report/:Url': 'report',
            'courses/barchart': 'CoursesBarChart',
            'mail': 'email',
            '*nomatch': 'errornotfound',
        

        
      
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

            App.ShelfItems = {}
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
            
           // $('#olelogo').remove()
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
	EditTag: function (value) {
	    var roles = this.getRoles()
	    if (roles.indexOf("Manager") > -1) {

	        if (value != 'Add New') {
	            var collections = new App.Collections.listRCollection()
	            collections.major = true
	            collections.fetch({
	                async: false
	            })
	            $('#invitationdiv').fadeIn(1000)
	            document.getElementById('cont').style.opacity = 0.2
	            document.getElementById('nav').style.opacity = 0.2
	            var collectionlist = new App.Models.CollectionList({
	                _id: value
	            })
	            collectionlist.fetch({
	                async: false
	            })
	            collections.remove(collectionlist)
	            var inviteForm = new App.Views.ListCollectionView({
	                model: collectionlist
	            })

	            inviteForm.render()

	            $('#invitationdiv').html('&nbsp')
	            $('#invitationdiv').append(inviteForm.el)
	            collections.each(function (a) {
	                $('#invitationForm .bbf-form .field-NesttedUnder select').append('<option value="' + a.get('_id') + '" class="MajorCategory">' + a.get('CollectionName') + '</option>')
	            })
	            $('#invitationForm .bbf-form .field-NesttedUnder select option[value="' + collectionlist.get('NesttedUnder') + '"]').attr('selected', 'selected');
	            if ($("#invitationForm .bbf-form .field-IsMajor input").is(':checked')) {
	                $("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'hidden')
	            } else {
	                $("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'visible')
	            }
	            $('#invitationForm .bbf-form .field-AddedDate input', this.el).datepicker({
	                todayHighlight: true
	            });
	            $("input[name='AddedBy']").attr("disabled", true);
	        }
	    }
	},
	AddNewSelect: function (value) {
	    if (value == 'Add New') {
	        var collections = new App.Collections.listRCollection()
	        collections.major = true
	        collections.fetch({
	            async: false
	        })
	        $('#invitationdiv').fadeIn(1000)
	        document.getElementById('cont').style.opacity = 0.2
	        document.getElementById('nav').style.opacity = 0.2
	        var collectionlist = new App.Models.CollectionList()
	        var inviteForm = new App.Views.ListCollectionView({
	            model: collectionlist
	        })
	        inviteForm.render()
	        $('#invitationdiv').html('&nbsp')
	        $('#invitationdiv').append(inviteForm.el)
	        $("input[name='AddedBy']").val($.cookie("Member.login"));
	        var currentDate = new Date();
	        $('#invitationForm .bbf-form .field-AddedDate input', this.el).datepicker({
	            todayHighlight: true
	        });
	        $('#invitationForm .bbf-form .field-AddedDate input', this.el).datepicker("setDate", currentDate);
	        $("input[name='AddedBy']").attr("disabled", true);
	        $("input[name='AddedDate']").attr("disabled", true);
	        collections.each(function (a) {
	            $('#invitationForm .bbf-form .field-NesttedUnder select').append('<option value="' + a.get('_id') + '" class="MajorCategory">' + a.get('CollectionName') + '</option>')
	        })

	    } else {
	        document.getElementById('cont').style.opacity = 1
	        document.getElementById('nav').style.opacity = 1
	        $('#invitationdiv').hide()

	    }

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
        
   
   
   }))
  


})