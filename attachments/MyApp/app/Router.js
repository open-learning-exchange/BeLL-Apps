$(function(){
   
   App.Router=new(Backbone.Router.extend({
       
      
      routes:{'': 'MemberLogin',
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
            'resource/search': 'bellResourceSearch',
            'search-bell/:levelId/:rId': 'SearchBell',
            'assign-to-level': 'AssignResourcetoLevel',
            
            'courses': 'Groups',
            'course/manage/:groupId': 'ManageCourse',
            'course/details/:courseId/:courseName':'courseDetails',
            'usercourse/details/:courseId/:courseName':'UserCourseDetails',
            'course/report/:groupId/:groupName': 'CourseReport',
            'course/assignments/week-of/:groupId/:weekOf': 'GroupWeekOfAssignments',
            'course/assignments/:groupId': 'GroupAssignments',
            'course/add': 'GroupForm',
            'CourseInfo/:courseId': 'CourseInfo',
            'course/resign/:courseId': 'ResignCourse',
            'course/members/:courseId':'GroupMembers',
            
            'level/add/:groupId/:levelId/:totalLevels': 'AddLevel',
            'level/view/:levelId/:rid': 'ViewLevel',
            'savedesc/:lid': 'saveDescprition',
            'create-quiz/:lid/:rid/:title': 'CreateQuiz',
            
             'collection':'Collection',
             'listCollection/:collectionId':'ListCollection',
            'listCollection/:collectionId/:collectionName':'ListCollection',
            'meetups':'ListMeetups',
            'meetup/add':'Meetup',
            'meetup/delete/:MeetupId':'deleteMeetUp',
            'usermeetup/detail/:meetupId/:title':'Meetup_Detail',
            'meetup/details/:meetupId/:title': 'usermeetupDetails',
            'meetup/manage/:meetUpId':'Meetup',
            
            
            'members': 'Members',
            
            'reports': 'Reports',
    	    'reports/edit/:resportId': 'ReportForm',
            'reports/add': 'ReportForm',
            
            'mail': 'email',
            'newsfeed': 'NewsFeed',
            
            'courses/barchart': 'CoursesBarChart',
            
            'calendar': 'CalendarFunction',
            'addEvent': 'addEvent',
            'calendar/event/:eid': 'calendaar',
            'calendar-event/edit/:eid': 'EditEvent',
            
            'siteFeedback': 'viewAllFeedback',
            
            'myRequests': 'myRequests',
            'AllRequests': 'AllRequests',
            'replicateResources': 'Replicate',
			'savingPochDB' : 'PochDB',
			'deletePouchDB': 'deletePouchDB',
			'course/invitations/add': 'addCourseInvi',
			
			'compile': 'CompileManifest',
			
},
addCourseInvi:function(){

var test=new App.Models.CourseInvitation()
    test.set('courseId','test')
    test.set('userId','test')
    test.save(null,{success:function(error,response){
        console.log(response)
        alert('success')
    }
    
    })

 var collection=new App.Collections.CourseInvitations()
    collection.courseId='test'
    collection.fetch({async:false},{success:function(res){
    	console.log(res)
    }})

},
      initialize: function () {
            this.bind("all", this.startUpStuff)
            this.bind("all", this.checkLoggedIn)
            this.bind("all", this.renderNav)
        },
        eReader:function(){
           // alert('match with ereader')
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
            //cv Set up
            var context =this
            var model = new App.Models[className]()
            var modelForm = new App.Views[className + 'Form']({
                model: model
            })
            // Bind form to the DOM
            if (modelId) {
            
            	model.id = modelId
            	model.fetch({
                    async: false
                })
            	
                App.$el.children('.body').html('<h3>Edit ' + label + ' | ' + model.get('firstName') + '  '+model.get('lastName') + '</h3>')
                
                
            } else {
                App.$el.children('.body').html('<h3>Add ' + label + '</h3>')
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
            var resourcesTableView
            var temp = $.url().data.attr.host.split(".")  // get name of community
                temp = temp[0].substring(3)
            if(temp=="")
            temp='local'
            var roles = this.getRoles();
            
            var resources = new App.Collections.Resources({skip:0})
            resources.fetch({
                success: function () {
                    resourcesTableView = new App.Views.ResourcesTable({
                        collection: resources
                    })
                    resourcesTableView.isManager = roles.indexOf("Manager")
                       
                    var btnText='<p style="margin-top:20px"><a class="btn btn-success" href="#resource/add">Add New Resource</a>'
                        btnText+='<a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>Request Resource</a>'
                    App.$el.children('.body').html(btnText)
                    
                    App.$el.children('.body').append('<p style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;color:#0088CC;text-decoration: underline;">Resources</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">Collections</a></p>')
                     
                    if(roles.indexOf("Manager") !=-1 &&  ( temp=='hagadera' || temp=='dagahaley' || temp=='ifo'|| temp=='somalia' || temp=='demo') ){
					//App.$el.children('.body').append('<button style="margin:-87px 0 0 400px;" class="btn btn-success"  onclick = "document.location.href=\'#viewpublication\'">View Publications</button>')
						App.$el.children('.body').append('<button style="margin:-120px 0 0 550px;" class="btn btn-success"  onclick = "document.location.href=\'#replicateResources\'">Sync Library to Somali Bell</button>')
                     
					}
					 App.$el.children('.body').append('<button style="margin-top:-64px;margin-left:20px;float: right;" class="btn btn-info" onclick="document.location.href=\'#resource/search\'">Search</button>')
                    
							 while(App.collectionslist.length==0)
							 {
								 alert("Retriving records")
							 }
							
							 console.log(App.collectionslist.length)
							 resourcesTableView.collections=App.collectionslist	
                     		 resourcesTableView.render()
                     		App.$el.children('.body').append(resourcesTableView.el)
						
                     

                }
            })      
           App.stopActivityIndicator() 
            
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
                   $(".form .field-Level select").find('option').removeAttr("selected")
               }
            }
       },

        bellResourceSearch:function(){
                  
                   popAll()            
                    var search = new App.Views.Search()
                    search.addResource=false
                    search.render()
                    App.$el.children('.body').html(search.el)
                    
                	$("#multiselect-collections-search").multiselect().multiselectfilter();
                    $("#multiselect-levels-search").multiselect().multiselectfilter();
					$("#multiselect-medium-search").multiselect({
  					    multiple: false,
   					    header: "Select an option",
   					    noneSelectedText: "Select an Option",
   					    selectedList: 1
				     });
						
					$("#srch").hide()
                    $(".search-bottom-nav").hide()
                    $(".search-result-header").hide()
                    $("#selectAllButton").hide()
                    
                    showSubjectCheckBoxes()
                    
                    $("#multiselect-subject-search").multiselect().multiselectfilter();
        
        
        },
        SearchBell: function (levelId, rid, resourceIds) {

            var levelInfo = new App.Models.CourseStep({
                "_id": levelId
            })
            levelInfo.fetch({
                success: function () {
                    if (typeof levelId === 'undefined') {
                        document.location.href = '#courses'
                    }

                    if (typeof rid === 'undefined') {
                        document.location.href = '#courses'
                    }
                    
                      grpId = levelId
                      levelrevId = rid
                      
                      ratingFilter.length=0
                    
                      rtitle.length = 0
                      rids.length = 0
                    
                    var search = new App.Views.Search()
                    search.resourceids = levelInfo.get("resourceId")
                    search.addResource=true
                    App.$el.children('.body').html(search.el)
                    search.render()
                    
                   // alert($("#multiselect-subject-search"))
                    
                    
                    $("#multiselect-collections-search").multiselect().multiselectfilter();
                    $("#multiselect-levels-search").multiselect().multiselectfilter();
					$("#multiselect-medium-search").multiselect({
  					    multiple: false,
   					    header: "Select an option",
   					    noneSelectedText: "Select an Option",
   					    selectedList: 1
				     });
						
						
						
                    $("#srch").hide()
                    $(".search-bottom-nav").hide()
                    $(".search-result-header").hide()
                    $("#selectAllButton").hide()
                    showSubjectCheckBoxes()
                    
                    $("#multiselect-subject-search").multiselect().multiselectfilter();
                }
            })
        },
        AssignResourcetoLevel: function () {

            if (typeof grpId === 'undefined') {
                document.location.href = '#courses'
            }
            //var rids = new Array()
            //var rtitle = new Array()
            var cstep = new App.Models.CourseStep({
                "_id": grpId,
            })
            cstep.fetch({
                async: false
            })
            var oldIds = cstep.get("resourceId")
            var oldTitles = cstep.get("resourceTitles")

            $("input[name='result']").each(function () {
                if ($(this).is(":checked")) {
                    var rId = $(this).val();
                    if (oldIds.indexOf(rId) == -1) {
                        rtitle.push($(this).attr('rTitle'))
                        rids.push(rId)
                    }
                }
            });

            cstep.set("resourceId", oldIds.concat(rids))
            cstep.set("resourceTitles", oldTitles.concat(rtitle))
            cstep.save(null,{success:function(responseModel,responseRev){
            	
            	cstep.set("_rev",responseRev.rev)
            	alert("Your Resources have been updated successfully")
                Backbone.history.navigate('level/view/'+responseRev.id+'/'+responseRev.rev, {trigger: true})
            
            }})
            

        },
        Groups: function () {
         App.startActivityIndicator()
            groups = new App.Collections.Groups()
            groups.fetch({
                success: function () {
                    groupsTable = new App.Views.GroupsTable({
                        collection: groups
                    })
                    groupsTable.render()

                    var button = '<p id="library-top-buttons">'
                    button += '<a class="btn btn-success" style="width: 110px"; href="#course/add">Add Course</a>'
                    button += '<a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Course")>Request Course</a>'
                    button += '<span style="float:right"><input id="searchText"  placeholder="Search" value="" size="30" style="height:24px;margin-top:1%;" type="text"><span style="margin-left:10px">'
                    button += '<button class="btn btn-info" onclick="CourseSearch()">Search</button></span>'
                    button += '</p>'
                    App.$el.children('.body').html(button)
                    App.$el.children('.body').append('<h3>Courses</h3>')
                    App.$el.children('.body').append(groupsTable.el)
                }
            })
              App.stopActivityIndicator()
        },
        CreateQuiz: function (lid, rid, title) {
            var levelInfo = new App.Models.CourseStep({
                "_id": lid
            })
            levelInfo.fetch({
                success: function () {
                    var quiz = new App.Views.QuizView()
                    quiz.levelId = lid
                    quiz.revId = levelInfo.get('_rev')
                    quiz.ltitle = title
                    if (levelInfo.get("questions")) {
                        App.$el.children('.body').html('<h3>Edit Quiz for |' + title + '</h3>')
                        quiz.quizQuestions = levelInfo.get("questions")
                        quiz.questionOptions = levelInfo.get("qoptions")
                        quiz.answers = levelInfo.get("answers")

                    }
                    App.$el.children('.body').html(quiz.el)
                    quiz.render()
                    if (levelInfo.get("questions")) {
                        quiz.displayQuestionInView(0)
                    }
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
            App.$el.children('.body').append('<div class="courseInfo-header"><a href="#usercourse/details/' + courseId + '/' + courseModel.get('name') + '"><button type="button" class="btn btn-info" id="back">Back</button></a>&nbsp;&nbsp;&nbsp;&nbsp<a href="#course/resign/' + courseId + '"><button id="resignCourse" class="btn resignBtn btn-danger" value="0">Resign</button></a>&nbsp;&nbsp;</div>')
            App.$el.children('.body').append(viewCourseInfo.el)
            
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
        courseDetails:function(courseId,courseName){
        	
        	var courseModel=new App.Models.Group({_id:courseId})
               courseModel.fetch({async:false})
    
           var courseLeader = courseModel.get('courseLeader')
           var courseMembers = courseModel.get('members')
        	
          var button = '<br><a href="#courses"><button class="btn btn-success">Back to courses</button></a>'
          if(courseMembers && courseMembers.indexOf($.cookie('Member._id'))==-1)
          {
          	button += '&nbsp;&nbsp;<button class="btn btn-danger" id="admissionButton">Admission</button><br/><br/>'
          }
          else
          {
          	button += '<br/><br/>'
          }
        	
           App.$el.children('.body').html('<div id="courseName-heading"><h3>Course Details | '+courseName+'</h3></div>')
           App.$el.children('.body').append(button)
           
           var memberModel = new App.Models.Member()
               memberModel.set('_id', courseLeader)
               memberModel.fetch({async: false})
            
          var  ccSteps = new App.Collections.coursesteps()
                ccSteps.courseId = courseId
                ccSteps.fetch({async:false})

          var GroupDetailsView=new App.Views.GroupView({model:courseModel})
              GroupDetailsView.courseLeader=memberModel
              GroupDetailsView.render()
        
          
          var courseStepsView=new App.Views.CourseStepsView({collection:ccSteps})  
               courseStepsView.render()
               
          App.$el.children('.body').append(GroupDetailsView.el)
          App.$el.children('.body').append('<div id="courseSteps-heading"><h5>Course Steps</h5></div>') 
          App.$el.children('.body').append(courseStepsView.el)
          
   			$('#admissionButton').on('click', function (e) {
        		$(document).trigger('Notification:submitButtonClicked')
    		})
        },
        UserCourseDetails: function (courseId, name) {
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
                            header: "h3",
                            heightStyle: "content" 
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
         GroupMembers:function(cId)
        {
           var groupMembers=new App.Views.GroupMembers()
           groupMembers.courseId=cId
           groupMembers.render()
           App.$el.children('.body').html(groupMembers.el)
                 
        },
        GroupForm: function (groupId) {
            this.modelForm('Group', 'Course', groupId, 'courses')
             
        },
        GroupAssign: function (groupId) {
            var assignResourcesToGroupTable = new App.Views.AssignResourcesToGroupTable()
            assignResourcesToGroupTable.groupId = groupId
            assignResourcesToGroupTable.render()
            App.$el.children('.body').html(assignResourcesToGroupTable.el)
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
            mail.save();
            alert("Successfully resigned from " + courseModel.get('name') + ' . ')

            Backbone.history.navigate('dashboard', {
                trigger: true
            })

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

                App.$el.children('.body').html('<h3>New Step</h3>')
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
                    App.$el.children('.body').html('<h3>Edit Step</h3>')
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
                    App.$el.children('.body').append('<B>Resources</B>&nbsp;&nbsp;<a class="btn btn-success"  style="" href=\'#search-bell/' + lid + '/' + rid + '\'">Add</a>')
                    App.$el.children('.body').append(levelDetails.el)
                    App.$el.children('.body').append('</BR>')
                    if (levelInfo.get("questions") == null) {
                        App.$el.children('.body').append('<a class="btn btn-success"  style="float:right;"  href=\'#create-quiz/' + levelInfo.get("_id") + '/' + levelInfo.get("_rev") + '/' + levelInfo.get("title") + '\'">Create Quiz</a>&nbsp;&nbsp;')
                        //Backbone.history.navigate('create-quiz/'+levelInfo.get("_id")+'/'+levelInfo.get("_rev")+'/'+levelInfo.get("title"), {trigger: true})
                    } else {
                        App.$el.children('.body').append('<B>' + levelInfo.get("title") + ' - Quiz</B><a class="btn btn-primary"  style="float:right;" href=\'#create-quiz/' + levelInfo.get("_id") + '/' + levelInfo.get("_rev") + '/' + levelInfo.get("title") + '\'">Edit Quiz</a>&nbsp;&nbsp;')
                    }
                }
            })
        },
        saveDescprition: function (lid) {
            var level = new App.Models.CourseStep({
                "_id": lid
            })
            var that = this
            level.fetch({
                success: function () {
                    level.set("description", $('#LevelDescription').val())
                    var that = this
                    level.save()
                    level.on('sync', function () {
                        document.location.href = '#level/view/' + lid + '/' + level.get("rev");
                    })
                }
            })
        },
        GroupSearch: function () {

            var cSearch
            cSearch = new App.Views.CourseSearch()
            cSearch.render()
        var button = '<p style="margin-top:15px">'
            button += '<a class="btn btn-success" href="#course/add">Add a new Cource</a>'
            button += '<a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Course")>Request Course</a>'
            button += '<a style="margin-left:10px" class="btn btn-info" onclick="ListAllCourses()">View All Courses</a>'
            button += '<span style="float:right">Keyword:&nbsp;<input id="searchText"  placeholder="Search" value="" size="30" style="height:24px;margin-top:1%;" type="text"><span style="margin-left:10px">'
            button += '<button class="btn btn-info" onclick="CourseSearch()">Search</button></span>'
            button += '</p>'
            App.$el.children('.body').html(button)
            App.$el.children('.body').append('<h3>Courses</h3>')
            App.$el.children('.body').append(cSearch.el)
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
       Meetup_Detail:function(meetupId,title){
            var meetupModel=new App.Models.MeetUp({_id:meetupId})
            meetupModel.fetch({async:false})
            var meetup_details=new App.Views.MeetupDetails({model:meetupModel})
            meetup_details.render()
            App.$el.children('.body').html(meetup_details.el)
        
        },
       usermeetupDetails:function(meetupId,title){
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


                    App.$el.children('.body').html('<h3>Members<a style="margin-left:20px" class="btn btn-success" href="#member/add">Add a New Member</a></h3>')


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
            App.$el.children('.body').append('<p style="margin-top:10px"><a class="btn btn-success" href="#reports/add">Add a new Report</a></p>')
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
        ReportForm: function (reportId) {
            var report = (reportId) ? new App.Models.CommunityReport({
                _id: reportId
            }) : new App.Models.CommunityReport()
            report.on('processed', function () {
                Backbone.history.navigate('report', {
                    trigger: true
                })
            })
            var reportFormView = new App.Views.ReportForm({
                model: report
            })
            App.$el.children('.body').html(reportFormView.el)

            if (report.id) {
                App.listenToOnce(report, 'sync', function () {
                    reportFormView.render()
                })
                report.fetch()
            } else {
                reportFormView.render()
            }
        },

        routeStartupTasks: function () {
            $('#invitationdiv').hide()
            $('#debug').hide()

        },
        Resource_Detail: function (rsrcid, sid, revid) {
            var resource = new App.Models.Resource({_id:rsrcid})
            resource.fetch({
                success: function () {
                
                    var Tags = resource.toJSON().Tag
                    var key=JSON.stringify(Tags);
                    var setTags=Array()
                    var TagColl = Backbone.Collection.extend(
								{
									url: App.Server + '/collectionlist/_design/bell/_view/DocById?keys=' + key + '&include_docs=true'
								})
								var collTag = new TagColl()
								collTag.fetch(
								{
									async: false
								})
								collTag=collTag.first()
								if(collTag!=undefined)
								{
									accessedTags=collTag.toJSON().rows
									_.each(accessedTags, function(a) { 
							
										setTags.push(a.value)	
									})
						 
								
								
								}
								resource.set({'Tag':setTags})
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
                    App.$el.children('.body').append('<a class="btn btn-primary"" href="'+url_togo+'"><i class="icon-plus"></i> Add your feedback</a>')
                    App.$el.children('.body').append('<a class="btn btn-primary" style="margin:20px" href="#resources"><< Back to Resources</a>')
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
              shelfItem.set('resourceTitle',unescape(title))
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
	  Collection: function ()
				{
					App.startActivityIndicator()

					var temp = $.url().data.attr.host.split(".") // get name of community
					temp = temp[0].substring(3)
					if (temp == "")
						temp = 'local'

					var roles = this.getRoles()
					var collections = new App.Collections.listRCollection()
					collections.major = true
					collections.fetch(
					{

						success: function ()
						{
							var collectionTableView = new App.Views.CollectionTable(
							{
								collection: collections
							})
							collectionTableView.render()
							App.$el.children('.body').html('<p><a class="btn btn-success" href="#resource/add">Add New Resource</a><a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>Request Resource</a></p></span>')

							App.$el.children('.body').append('<p style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;">Resources</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;color:#0088CC;text-decoration: underline;">Collections</a></p>')

							if (roles.indexOf("Manager") != -1 && (temp == 'hagadera' || temp == 'dagahaley' || temp == 'ifo' || temp == 'somalia'))
								App.$el.children('.body').append('<button style="margin:margin: -55px 0 0 650px;" class="btn btn-success"  onclick = "document.location.href=\'#replicateResources\'">Sync Library to Somali Bell</button>')

							if (roles.indexOf("Manager") != -1)
								App.$el.children('.body').append('<button style="margin:-90px 0px 0px 500px;" class="btn btn-success"  onclick="AddColletcion()">Add Collection</button>')
							App.$el.children('.body').append(collectionTableView.el)
						},
						async: false
					})
					var subcollections = new App.Collections.listRCollection()
					subcollections.major = false
					subcollections.fetch(
					{
						async: false
					})
					if (roles.indexOf("Manager") != -1)
					{
						_.each(subcollections.last(subcollections.length).reverse(), function (a)
						{
							if (a.get('NesttedUnder') == '--Select--')
							{
								$('#collectionTable').append('<tr><td><a href="#listCollection/' + a.get('_id') + '/' + a.get('CollectionName') + '">' + a.get('CollectionName') + '</a></td><td><button onclick=EditColletcion(' + a.get('_id') + ')><i class="icon-edit pull-right"></i></button></td></tr>')
							}
							else
							{
								$('#' + a.get('NesttedUnder') + '').parent().after('<tr><td>&nbsp&nbsp&nbsp&nbsp<a href="#listCollection/' + a.get('_id') + '/' + a.get('CollectionName') + '">' + a.get('CollectionName') + '</a></td><td><button onclick=EditColletcion("' + a.get('_id') + '")><i class="icon-edit pull-right"></i></button></td></tr>')

							}

						});
					}
					else
					{
						_.each(subcollections.last(subcollections.length).reverse(), function (a)
						{
							if (a.get('NesttedUnder') == '--Select--')
							{
								$('#collectionTable').append('<tr><td><a href="#listCollection/' + a.get('_id') + '/' + a.get('CollectionName') + '">' + a.get('CollectionName') + '</a></td><td></td></tr>')
							}
							else
							{
								$('#' + a.get('NesttedUnder') + '').parent().after('<tr><td>&nbsp&nbsp&nbsp&nbsp<a href="#listCollection/' + a.get('_id') + '/' + a.get('CollectionName') + '">' + a.get('CollectionName') + '</a></td><td></td></tr>')

							}

						});
					}


					App.stopActivityIndicator()




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
         ListCollection: function (collectionId,collectionName) {
            App.startActivityIndicator()
            var that=this
            var temp = $.url().data.attr.host.split(".")  // get name of community
                temp = temp[0].substring(3)
            if(temp=="")
            temp='local'
            var roles = this.getRoles()
            var collectionlist = new App.Models.CollectionList({
	                _id: collectionId
	            })
	            collectionlist.fetch({
	                async: false
	            })
        
            var collId = Array()
            collId.push(collectionId)
             collId=JSON.stringify(collId);
            var resources = new App.Collections.Resources({collectionName:collId})
            resources.fetch({
                success: function () {
                    var resourcesTableView = new App.Views.ResourcesTable({
                        collection: resources
                    })
                    //console.log(App.collectionlist)
				resourcesTableView.collections=App.collectionslist	
                resourcesTableView.isManager = roles.indexOf("Manager")
                resourcesTableView.render()
                    App.$el.children('.body').html('<p><a class="btn btn-success" href="#resource/add">Add New Resource</a><a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>Request Resource</a><span style="float:right"></span></p>')

                    App.$el.children('.body').append('<p style="font-size:30px;color:#808080;"><a href="#resources"style="font-size:30px;color:#0088CC;text-decoration: underline;">Resources</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">Collections</a> </p>')
                     
                    if(roles.indexOf("Manager") !=-1 &&  ( temp=='hagadera' || temp=='dagahaley' || temp=='ifo' || temp=='local' || temp=='somalia') )
                     App.$el.children('.body').append('<button style="margin:-90px 0px 0px 500px;" class="btn btn-success"  onclick = "document.location.href=\'#replicateResources\'">Sync Library to Somali Bell</button>')
                    App.$el.children('.body').append('<p style="font-size: 30px;font-weight: bolder;color: #808080;width: 450px;word-wrap: break-word;">'+collectionlist.get('CollectionName')+'</p>')
                    
                    App.$el.children('.body').append(resourcesTableView.el)
                    
                    $('#backButton').click(function(){
                       Backbone.history.navigate('#resources',{trigger:false})
                    })
                }
            })
            App.stopActivityIndicator()
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
     AllRequests: function () {
            App.$el.children('.body').html('&nbsp')
            var col = new App.Collections.Requests()
            col.fetch({
                async: false
            })
            var colView = new App.Views.RequestTable({
                collection: col
            })
            colView.render()
            App.$el.children('.body').append(colView.el)
        },
        myRequests: function () {
            App.$el.children('.body').html('&nbsp')
            var col = new App.Collections.Requests({
                memberId: ($.cookie('Member._id'))
            })
            col.fetch({
                async: false
            })
            var colView = new App.Views.RequestTable({
                collection: col
            })
            colView.render()
            App.$el.children('.body').append(colView.el)
        },
       Replicate: function () {
        
          App.startActivityIndicator()
          
           var that = this
           var temp = $.url().attr("host").split(".")
           var currentHost=$.url().attr("host")
           
           var nationURL=''
           var nationName=''
           var type=''
    
    	    var configurations=Backbone.Collection.extend({

    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})	
    	    var config=new configurations()
    	      config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
    
    	        type=cofigINJSON.rows[0].doc.type
				nationURL=cofigINJSON.rows[0].doc.nationUrl
    	        nationName=cofigINJSON.rows[0].doc.nationName
    			App.$el.children('.body').html('Please Wait…')
    			var waitMsg = ''
    			var msg = ''
    			
            $.ajax({
    			url : 'http://'+ nationName +':oleoleole@'+nationURL+':5984/communities/_all_docs?include_docs=true',
    			type : 'GET',
    			dataType : "jsonp",
    			success : function(json) {
    				for(var i=0 ; i<json.rows.length ; i++)
    				{
    					var community = json.rows[i]
    					var communityurl = community.doc.url
    					var communityname = community.doc.name
    					msg = waitMsg
    					waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
    					App.$el.children('.body').html(waitMsg)
    					that.synchCommunityWithURL(communityurl,communityname)
    					waitMsg = msg
    					waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.'
    					App.$el.children('.body').html(waitMsg)
      				}
      				if(type!="nation")
      				{
      					msg = waitMsg
    					waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
    					that.synchCommunityWithURL(nationURL,nationName)
    					waitMsg = msg
    					waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.<br>Replication completed.'	
      				}
    			}
  			 })
  			App.stopActivityIndicator()
        },
        synchCommunityWithURL : function(communityurl,communityname) 
        {
        	console.log('http://'+ communityname +':oleoleole@'+ communityurl + ':5984/resources')
        	$.ajax({
            	headers: {
                	'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
            	type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                	"source": "resources",
                    "target": 'http://'+ communityname +':oleoleole@'+ communityurl + ':5984/resources'
            	}),
                success: function (response) {

                },
                async: false
            })
     },         
 PochDB:function(){
//       
//         alert("in pouch app sync") 
			db=new PouchDB('testing');

//  		db.put({
//   				title: 'Heroes'
// 				}, 'mydoc', function(err, response) {});
// 
//      alert('end of pouch app sync')
//      

	  db.replicate.from('http://127.0.0.1:5984/resources',function(error, response){
		if(error){
		console.log(error)
		  alert('there is an error')
		}
		else{
		  console.log(response)
		  alert('success for replication')
		}

	  });
//       
//       db.get('mydoc',function(error,response){
//            console.log(response)
//            alert('this is responce')
//       });
//       

 },
 deletePouchDB:function(){
 
    db=new PouchDB('testing');
    var test=db.allDocs({include_docs: true},function(error,response){
        console.log(response)
        alert('this is responce')
     
     });

	db.get('9ecd3cd4886e1b513b9aaaed7a000654',function(error,response){
			console.log(response)
			alert('this is responce')
		});
 
 },
 
    CompileManifest: function() {
      // The resources we'll need to inject into the manifest file
      var resources = new App.Collections.Resources()
      var apps = new App.Collections.Apps()
      var config=new App.Collections.Configurations()
      var MemberCourseProgress = new App.Collections.membercourseprogresses()
      var lang=new App.Collections.Languages()
      var members=new App.Collections.Members()
      var collectionlist=new App.Collections.listRCollection()
      var logMember=new App.Collections.Members()
      var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
      var login = loggedIn.get("login")        
      
      logMember.login=login
      var Meetups = new App.Collections.Meetups()
      var Groups = new App.Collections.MemberGroups()
          Groups.memberId = $.cookie('Member._id')
      var Reports=new App.Collections.Reports()
      
      
      var memId=$.cookie('Member._id')
      // The URL of the device where we'll store transformed files
      var deviceURL = '/devices/_design/all'
      // The location of the default files we'll tranform
      var defaultManifestURL = '/apps/_design/bell/manifest.default.appcache'
      var defaultUpdateURL = '/apps/_design/bell/update.default.html'
      var shelfitems=new App.Collections.shelfResource()
      shelfitems.compile=true
      // URLs to save transformed files to      
      var transformedManifestURL = deviceURL + '/manifest.appcache'
      var transformedUpdateURL = deviceURL + '/update.html'
      // The string to find in the default manifest file that we'll replace with Resources
      var find = '{replace me}'
      var replace = '# Compiled at ' + new Date().getTime() + '\n'
      
      // Compile the new manifest file and save it to devices/all
      resources.on('sync', function() {
        _.each(resources.models, function(resource) {
          if(resource.get('kind') == 'Resource' && resource.get('_attachments')) {
            _.each(resource.get('_attachments'), function(value, key, list) {
            })
          }
        })
        App.trigger('compile:resourceListReady')
      })

      App.once('compile:resourceListReady', function() {
        apps.once('sync', function() {
          _.each(apps.models, function(app) {
            _.each(app.get('_attachments'), function(value, key, list) {
              replace += encodeURI('/apps/' + app.id + '/' + key) + '\n'
            })
          })
          App.trigger('compile:configurations')
        })
        apps.fetch()
        
      })
      App.once('compile:configurations',function(){
       config.once('sync', function() {
        _.each(config.models, function(configs) {
          replace += encodeURI('/configurations/_all_docs?include_docs=true') + '\n'
        })
       App.trigger('compile:languages')
      })   
        config.fetch()
      })
      App.once('compile:languages',function(){
      
            lang.once('sync', function() {
         replace += encodeURI('/shelf/_design/bell/_view/DuplicateDetection?include_docs=true&key="'+memId+'"')+'\n'
        _.each(lang.models, function(langs) {
          replace += encodeURI('/languages/_all_docs?include_docs=true') + '\n'
        })
      
      App.trigger('compile:members')
      })
      
      lang.fetch()  
      
      })
	App.once('compile:members', function() {
	  
				  members.once('sync', function() {
				      replace+=encodeURI('/members/_design/bell/_view/Members?include_docs=true')+'\n'
					_.each(members.models, function(mem) {
					  replace += encodeURI('/members/'+mem.id)+'\n'
					})
	  
					  App.trigger('compile:shelfResource')
				  })
		  members.fetch()
	  
		})
		App.once('compile:shelfResource',function(){
		
	  
				  shelfitems.once('sync', function() {
				      replace += encodeURI('/shelf/_design/bell/_view/DuplicateDetection?include_docs=true&key="'+memId+'"')+'\n'
				      
					_.each(shelfitems.models, function(mem) {
					var resId=mem.get('resourceId')
					console.log(resId)
					var resource=new App.Models.Resource({_id:resId})
                                         resource.fetch({success:function(resp){
                                            replace+=encodeURI('/resources/'+resId)+ '\n'
                                             if (resource.get('kind') == 'Resource' && resource.get('_attachments')) {
											_.each(resource.get('_attachments'), function (value, key, list) {
												replace += encodeURI('/resources/' + resId + '/' + key) + '\n'
											})
										}
                                         }
					})
	  
				  })
		 
							  App.trigger('compile:collectionList')

		})
		 shelfitems.fetch()
		})
	App.once('compile:collectionList',function(){
	  
				collectionlist.once('sync', function() {
          replace += encodeURI('/collectionlist/_design/bell/_view/allrecords?include_docs=true') + '\n'
	 App.trigger('compile:Meetups')
      })
		  collectionlist.fetch()
		
	
	})			
	App.once('compile:Meetups', function() {  
				Meetups.once('sync', function() {
					
					  replace += encodeURI('/meetups/_all_docs?include_docs=true')+'\n'
					  replace += encodeURI('/usermeetups/_design/bell/_view/getUsermeetups?key="' + memId + '"&include_docs=true')+'\n'
					  
	                  _.each(Meetups.models, function(meetup) {
					  		replace += encodeURI('/meetups/'+meetup.id)+'\n'
					  		
					})  
					  App.trigger('compile:Groups')
				  })
		  Meetups.fetch()
		})	
		
  App.once('compile:Groups', function() {  
				Groups.once('sync', function() {
					
					  replace += encodeURI('/groups/_all_docs?include_docs=true')+'\n'
					  replace += encodeURI('/groups/_design/bell/_view/GetCourses?key="'+ memId +'"&include_docs=true')+'\n'
					  
	                  _.each(Groups.models, function(group) {
					  		replace += encodeURI('/groups/'+group.id)+'\n'
					  		replace += encodeURI('/coursestep/_design/bell/_view/StepsData?key="'+ group.id +'"&include_docs=true')+'\n'
					  		MemberCourseProgress.courseId=group.id
					  		MemberCourseProgress.memberId=memId
					  		MemberCourseProgress.fetch({success:function(){
					  		//don't encode this url because it contain's '[' & ']' which spoil the key
					  		replace += ('/membercourseprogress/_design/bell/_view/GetMemberCourseResult?key=["'+memId+'","'+group.id+'"]&include_docs=true')+'\n'
					  		}})
					  		levels = new App.Collections.CourseLevels()
                            levels.groupId = group.id
                            levels.fetch({async:false})
                            levels.each(function(level){
                               var resources=level.get('resourceId')
                              _.each(resources,function(res){
                              console.log(res)
                                     var resource=new App.Models.Resource({_id:res})
                                         resource.fetch({success:function(resp){
                                            replace+=encodeURI('/resources/'+res)+ '\n'
                                             if (resource.get('kind') == 'Resource' && resource.get('_attachments')) {
											_.each(resource.get('_attachments'), function (value, key, list) {
												replace += encodeURI('/resources/' + res + '/' + key) + '\n'
											})
										}
                                         }})
                                        
                              },this)
                               
                            },this)
					})  
					  App.trigger('compile:CommunityReport')
				  })
		  Groups.fetch()
		})							
 App.once('compile:CommunityReport', function() {  
				
				Reports.once('sync', function() {	
					  replace += encodeURI('/communityreports/_design/bell/_view/allCommunityReports?include_docs=true')+'\n'
	                  _.each(Reports.models, function(report) {
					  		replace += encodeURI('/communityreports/'+report.id)+'\n'
					})  
					  App.trigger('compile:appsListReady')
				  })
		  Reports.fetch()
		})	
		
      App.once('compile:appsListReady', function() {

        $.get(defaultManifestURL, function(defaultManifest) {
          var transformedManifest = defaultManifest.replace(find, replace)
          $.getJSON(deviceURL, function(deviceDoc){
            var xhr = new XMLHttpRequest()
            xhr.open('PUT', transformedManifestURL + '?rev=' + deviceDoc._rev, true)
            xhr.onload = function(response) { 
              App.trigger('compile:done')
            }
            xhr.setRequestHeader("Content-type", "text/cache-manifest" );
            xhr.send(new Blob([transformedManifest], {type: 'text/plain'}))
          })
        })
      })
      
      // Save the update.html file to devices/all
      App.once('compile:done', function() {
        $.get(defaultUpdateURL, function(defaultUpdateHTML) {
          // We're not transforming the default yet
          transformedUpdateHTML = defaultUpdateHTML
          $.getJSON(deviceURL, function(deviceDoc){
            var xhr = new XMLHttpRequest()
            xhr.open('PUT',transformedUpdateURL + '?rev=' + deviceDoc._rev, true)
            xhr.onload = function(response) { 
              App.$el.children('.body').html('<a class="btn" href="' + transformedUpdateURL + '">Resources compiled. Click here to update your device.</a>')
            }
            xhr.setRequestHeader("Content-type", "text/html" );
            xhr.send(new Blob([transformedUpdateHTML], {type: 'text/plain'}))
          })
        })
      })

      // Start the process
      resources.fetch()
    }
              
   }))
  


})