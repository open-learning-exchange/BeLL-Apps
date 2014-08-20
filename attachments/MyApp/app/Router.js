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
            'configuration/add':'Configure',
            'search-bell/:publicationId': 'SearchPresources',
            'members': 'Members',
            'reports': 'Reports',
            // added to new page   'reports/sync' : 'syncReports',
    	    'reports/edit/:resportId': 'ReportForm',
            'reports/add': 'ReportForm',
            'mail': 'email',
            
            'newsfeed': 'NewsFeed',
            'badges' :'Badges',
            
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
			'dbInfo':'dbinfo',
			'weeklyreports':'WeeklyReports',
			'removecache':'UpdateManifest',
			'logreports':'LogQuery',
			// Not required 'syncLog':'syncLogActivitiy',
			'reportsActivity':'LogActivity',
			'setbit' : 'setNeedOptimizedBit',
			'CompileAppManifest' : 'CompileAppManifest',
          'cummunityManage':'cummunityManage',
          'configuration': 'Configuration'
			
			
},
cummunityManage: function() {

   App.$el.children('.body').html('')
   App.$el.children('.body').append('<a href="#configuration"><button class="btn btn-hg btn-primary" id="configbutton">Configurations</button></a>')
   App.$el.children('.body').append('<button class="btn btn-hg btn-primary" onclick=SyncDbSelect() id="sync">Sync With Nation</button>')
},
Configuration: function() {
   var config = new App.Collections.Configurations()
   config.fetch({
       async: false
   })
   var configuration = config.first()
   var configView = new App.Views.ConfigurationView()
   configView.model = configuration
   configView.render()
   App.$el.children('.body').html(configView.el)

},
SyncDbSelect: function() {
   $('#invitationdiv').fadeIn(1000)
   var inviteForm = new App.Views.listSyncDbView()

   inviteForm.render()
   $('#invitationdiv').html('&nbsp')
   $('#invitationdiv').append(inviteForm.el)
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
            //this.bind("all",this.checkForUpdates)
        },
      /*onUpdateReady: function () {
          alert('found new version!');
      },
      checkForUpdates: function () {
          window.applicationCache.addEventListener('updateready', function(){
          alert('found new version!');
          },false);
      },*/
        eReader:function(){
           // alert('match with ereader')
            this.underConstruction()
        },
        Badges:function(){
            this.underConstruction()
        },
        underConstruction:function(){
            App.$el.children('.body').html('<div style="margin:0 auto"><h4>This Functionality is under Construction</h4></div>')
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
        
      Configure:function(){
      
           conModel = new App.Models.Configuration()
            var conForm = new App.Views.Configurations({
                model: conModel
            })
            conForm.render()
            App.$el.children('.body').html(conForm.el)
      
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
            $('.form .field-firstName input').attr('maxlength','25');
            $('.form .field-lastName input').attr('maxlength','25');
            $('.form .field-middleNames input').attr('maxlength','25');
            $('.form .field-login input').attr('maxlength','25');
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
                       
                    var btnText='<p style="margin-top:20px"><a class="btn btn-success" href="#resource/add">Add New Resource</a>';
                        btnText+='<a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>Request Resource</a>';
                        btnText+='<button style="margin-left:10px;"  class="btn btn-info" onclick="document.location.href=\'#resource/search\'">Search<img width="25" height="0" style="margin-left: 10px;" alt="Search" src="img/mag_glass4.png"></button>'
                    App.$el.children('.body').html(btnText)
                    
                    App.$el.children('.body').append('<p style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;color:#0088CC;text-decoration: underline;">Resources</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">Collections</a></p>')
                     /*Added to nation sync part
                    if(roles.indexOf("Manager") !=-1 &&  ( temp=='hagadera' || temp=='dagahaley' || temp=='ifo'|| temp=='somalia' || temp=='demo') ){
					//App.$el.children('.body').append('<button style="margin:-87px 0 0 400px;" class="btn btn-success"  onclick = "document.location.href=\'#viewpublication\'">View Publications</button>')
						App.$el.children('.body').append('<button style="margin:-120px 0 0 550px;" class="btn btn-success"  onclick = "document.location.href=\'#replicateResources\'">Sync Library to Somali Bell</button>')
                     
					}*/
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
           $('.form .field-subject select').multiselect().multiselectfilter();
           
           $('.form .field-Level select').attr("multiple", true);
           $('.form .field-Level select').multiselect().multiselectfilter();
           if(resource.id==undefined)
           {
           		$('.form .field-Level select').multiselect('uncheckAll');
			   $('.form .field-subject select').multiselect('uncheckAll')           
           }
           $('.form .field-Tag select').attr("multiple", true);
           $('.form .field-Tag select').click(function () {
               context.AddNewSelect(this.value)
           });
           $('.form .field-Tag select').dblclick(function () {
               context.EditTag(this.value)
           });
           var identifier = '.form .field-Tag select'
           
           this.RenderTagSelect(identifier)
           $('.form .field-Tag select').multiselect().multiselectfilter();
           $('.form .field-Tag select').multiselect("uncheckAll");
           
  
          
           if (resource.id) {
               $('.form .field-subject select').multiselect("refresh");
               if(resource.get('Tag'))
               {
                   var total = resource.get('Tag').length
                   for (var counter = 0; counter < total; counter++)
                   {
                       $('.form .field-Tag select option[value="' + resource.get('Tag')[counter] + '"]').attr('selected', 'selected')
                    }
                    $('.form .field-Tag select').multiselect("refresh");
                   //$('.form .field-Tag select option[value="Add New"]:selected').removeAttr("selected")
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
                    search.render()
                    App.$el.children('.body').html(search.el)

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
        SearchPresources: function (publicationId) {

            var publications = new App.Models.Publication({
                "_id": publicationId
            })
            publications.fetch({
                success: function () {
                    
                    var search = new App.Views.Search()
                    grpId = publicationId
                    search.addResource=true
                    search.Publications=true
                    App.$el.children('.body').html(search.el)
                    search.render()
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
                },async:false
            })
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
        	if (course.get('courseLeader') != undefined && course.get('courseLeader') == $.cookie('Member._id') || roles.indexOf("Manager") != -1){
        		App.$el.children('.body').append('<button class="btn btn-success" style="margin-left:784px;margin-top:-74px"  onclick = "document.location.href=\'#course/manage/' + cId + '\'">Manage</button>')
        	}    
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
           var courseName = courseModel.get('name')
           var courseMembers = courseModel.get('members')
        	
          var button = '<br><a href="#courses"><button class="btn btn-success">Back to courses</button></a>'
          if(courseMembers && courseMembers.indexOf($.cookie('Member._id'))==-1)
          {
          	button += '&nbsp;&nbsp;<button class="btn btn-danger" id="admissionButton" onClick=sendAdminRequest("'+courseLeader+'","'+encodeURI(courseName)+'","'+courseId+'")>Admission</button><br/><br/>'
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
    	    nationName=cofigINJSON.nationName       
            
            var roles = this.getRoles()
            members = new App.Collections.Members()
            members.fetch({
                success: function () {
                    membersTable = new App.Views.MembersTable({
                        collection: members
                    })
                    membersTable.community_code=code+nationName.substring(3,5)
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
            	//<a style="margin-left:20px" class="btn btn-success" href="#reports/sync">Syn With Nation</a> removed append
            	App.$el.children('.body').append('<p style="margin-top:10px"><a class="btn btn-success" href="#reports/add">Add a new Report</a><a style="margin-left:20px" class="btn btn-success" href="#logreports">Activity Report</a></p>')
			
			}
			else{
				App.$el.children('.body').append('<p style="margin-top:10px;margin-left:10px;"><a class="btn btn-success" href="#logreports">Activity Report</a></p>')
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
        
        /*
        Removed because this function is moved in nation all sync in one page
        syncReports:function(){
        
              App.startActivityIndicator()
         var configurationModel=new App.Collections.Configurations()
		     configurationModel.fetch({success:function(res){
		     
					        var conf=res.first()
					        console.log(conf)
					        var nationName=conf.get('nationName')
					        var nationURL=conf.get('nationUrl')					        
							$.ajax({
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json; charset=utf-8'
								},
								type: 'POST',
								url: '/_replicate',
								dataType: 'json',
								data: JSON.stringify({
									"source": "communityreports",
									"target": 'http://'+ nationName +':'+App.password+'@'+ nationURL + ':5984/communityreports'
								}),
								success: function (response) {
                                            App.stopActivityIndicator()
                                            alert('sync successfully ')
                                            Backbone.history.navigate('reports',{trigger: true})
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) { 
								            App.stopActivityIndicator()
                    						alert("Status: " + textStatus); alert("Error: " + errorThrown);
                    						Backbone.history.navigate('reports', {trigger: true}) 
                					}, 
								async: false
							})
					 
				 }})


        },*/
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
        //also used for collection editing from collection listing page
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
							App.$el.children('.body').html('<p style="margin-top:20px"><a class="btn btn-success" href="#resource/add">Add New Resource</a><a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>Request Resource</a></p></span>')

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
	mergecollection:function(collectionIdes,collectionText){
	
	
	     for(var i=0 ; i < collectionIdes.length ; i++)
	     {
	        var collModel=new App.Models.CollectionList({_id:collectionIdes[i]})
	           collModel.fetch({success:function(res){   
	               res.destroy()
	           }})
	      }

	    var resColl=new App.Collections.Resources()
	        resColl.collectionName=JSON.stringify(collectionIdes)
	        resColl.fetch({success:function(res){
	                
	                var collectionModel=new App.Models.CollectionList()
	                    collectionModel.set('CollectionName',collectionText)
	                    collectionModel.set('Description',"")
	                    collectionModel.set('IsMajor',true)
	                    collectionModel.set('NesttedUnder','--Select--')
	                    collectionModel.set('AddedBy',$.cookie('Member.login'))
	                    collectionModel.set('AddedDate',new Date())
	                    collectionModel.set('show',true)
	                    collectionModel.save(null,{success:function(responceCollec,revInfo){
	                       
	                        var newCollId=revInfo.id
	                        
							res.each(function(model){
							      resourceTags=model.get('Tag')
							      if(Array.isArray(resourceTags)){	
							    	for(var i=0 ; i < collectionIdes.length ; i++)
						          		if(resourceTags.indexOf(collectionIdes[i]) != -1){ 
						          		    var index=resourceTags.indexOf(collectionIdes[i])
						               		resourceTags.splice(index,1)
						                  }
						             resourceTags.push(newCollId)
						             model.set('Tag',resourceTags) 
						             model.save()
						            } 
			    
							 })
	                        alert('Collections Merge Successfully')
	                         document.getElementById('cont').style.opacity = 1
                              document.getElementById('nav').style.opacity = 1
                             $('#invitationdiv').hide()
                             location.reload()
	                        
	                   }})

	        
	        		
	        
	        
	        }})
	
	
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
                resourcesTableView.displayCollec_Resources=true    
				resourcesTableView.collections=App.collectionslist	
                resourcesTableView.isManager = roles.indexOf("Manager")
                resourcesTableView.render()
                    App.$el.children('.body').html('<p style="margin-top:20px"><a class="btn btn-success" href="#resource/add">Add New Resource</a><a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>Request Resource</a><span style="float:right"></span></p>')

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
     
          this.underConstruction()
           //  var resources = new App.Collections.NewsResources()
//             resources.fetch({
//                 success: function () {
//                     var resourcesTableView = new App.Views.ResourcesTable({
//                         collection: resources
//                     })
//                     resourcesTableView.render()
//                     App.$el.children('.body').html("&nbsp")
//                     App.$el.children('.body').append(resourcesTableView.el)
//                 }
//             })
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
        /* Aded in the Nation
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
    			url : 'http://'+ nationName +':'+App.password+'@'+nationURL+':5984/communities/_all_docs?include_docs=true',
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
        },*/
        synchCommunityWithURL : function(communityurl,communityname) 
        {
        	console.log('http://'+ communityname +':'+App.password+'@'+ communityurl + ':5984/resources')
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
                    "target": 'http://'+ communityname +':'+App.password+'@'+ communityurl + ':5984/resources'
            	}),
                success: function (response) {

                },
                async: false
            })
     },         
 PochDB:function(){
 	  var memId=$.cookie('Member._id')
      var memName=$.cookie('Member.login')
      var logMember=new App.Collections.Members()
      var loggedIn = new App.Models.Member({
                "_id": memId
            })
            loggedIn.fetch({
                async: false
            })
       var URL=null     
      var login = loggedIn.get("login")        
      var hostUrl = Backbone.history.location.href
            hostUrl = hostUrl.split('/')
            var hostName=hostUrl[2].split('.')
      var MemberCourseProgress=new PouchDB('membercourseprogress');
      var configurations= new PouchDB('configurations')
      //condition to check cloudant.com or an IP address 
      if (hostName[0].match(/^\d*[0-9](\.\d*[0-9])?$/))
      {
      //not cloudant
      	URL='http://'+hostUrl[2]
      }
      else
      {
      //cloudant
      	URL='http://'+hostName[0]+':'+App.password+'@'+hostUrl[2]
      }
	  MemberCourseProgress.replicate.from(URL+'/membercourseprogress',function(error, response){
		if(error){
		console.log("membercourseprogress replication error :"+error)
		}
		else{
		  console.log("Successfully replicated to local membercourseprogress :" + response)
		}

	  });	
	  configurations.replicate.from(URL+'/configurations',function(error, response){
		if(error){
		console.log("configurations replication error :"+error)
		}
		else{
		  console.log("Successfully replicated to local configurations :" + response)
		}

	  });													  
	  MemberCourseProgress.replicate.to(URL+'/membercourseprogress',function(error, response){
		if(error){
		console.log("membercourseprogress replication to server error :"+error)
		}
		else{
		  console.log("Successfully replicated membercourseprogress :" + response)
		}

	  });
	  var FeedBackDb=new PouchDB('feedback');
	       FeedBackDb.replicate.to(URL+'/feedback',function(error, response){
		if(error){
		console.log("FeedBackDb replication error :"+error)
		}
		else{
		  console.log("Successfully replicated FeedBackDb :" + response)
		}

	  }); 

	 var CourseStep=new PouchDB('coursestep');
	  CourseStep.replicate.from(URL+'/coursestep',function(error, response){
		if(error){
		console.log("coursestep replication error :"+error)
		}
		else{
		  console.log("Successfully replicated coursestep :" + response)
		}

	  });
	  CourseStep.replicate.to(URL+'/coursestep',function(error, response){
		if(error){
		console.log("coursestep replication error :"+error)
		}
		else{
		  console.log("Successfully replicated coursestep :" + response)
		}

	  });
	this.saveFrequency(URL);
	this.saveResources(URL);
	this.WeeklyReports();	 
 },
 saveResources:function(URL){
 				 var Resources=new PouchDB('resources');
 				 var Saving
 				 var Groups = new App.Collections.MemberGroups()
          		Groups.memberId = $.cookie('Member._id')
				Groups.once('sync', function() {
				      _.each(Groups.models, function(group) {
					  		levels = new App.Collections.CourseLevels()
                            levels.groupId = group.id
                            levels.fetch({async:false})
                            levels.each(function(level){
                               var resources=level.get('resourceId')
                              _.each(resources,function(res){
                                     var resource=new App.Models.Resource({_id:res})
                                         resource.fetch({success:function(resp){
                            var resModel=resp.toJSON()
                                console.log(resModel)
                            Resources.get(resModel._id,function(err,resdoc){
                            		
                            		if(!err){
                            		     console.log('Sum   '+resModel.sum +'    '+ resdoc.sum)
                            		     console.log('timesRated   '+resModel.timesRated +'    '+ resdoc.timesRated)
                            		     if(!resModel.sum || !resModel.timesRated)
                            		     {
                            		     resource.set('sum',0)
                            		     resource.set('timesRated',0)
                            		     
                            		     }
                            		     else{
                            		     resource.set('sum',parseInt(resModel.sum)+parseInt(resdoc.sum))
                            		     resource.set('timesRated',parseInt(resModel.timesRated)+parseInt(resdoc.timesRated))
                            		     }
                            		     resource.save(null,{success:function(rupdatedModel,revisoions){
                            		           Resources.put({
    										  		sum:0,
    										  		timesRated: 0
                            		     		},resdoc._id,resdoc._rev,function(error,info){
                            		     		
                            		     		})
                            		     }})
                            		}else{
                            		    Resources.post({
                            		          _id: resModel._id,
    										  sum:0,
    										  timesRated: 0
                            		     })
                            		}              
                            })										 
                                         }})
                                        
                              })
                               
                            })
					})  
				  })
		  Groups.fetch()		
 },
 saveFrequency:function(URL){
 			if($.cookie('Member._id'))
 			{
 				var ResourceFrequencyDB=new PouchDB('resourcefrequency');
				var resourcefreq = new App.Collections.ResourcesFrequency()
				resourcefreq.memberID = $.cookie('Member._id')
				resourcefreq.fetch(null,{success:function(doc,rev){
								console.log(resourcefreq.toJSON())
			var myjson=resourcefreq.first().toJSON()
				ResourceFrequencyDB.put(myjson,myjson._id,myjson._rev,function(error,info){
				
					if(error){
							console.log("ResourceFrequencyDB replication error :"+error)
						}else{
				  			console.log("Successfully replicated ResourceFrequencyDB :" + info)
						}
				})
				
				}})

	  ResourceFrequencyDB.replicate.to(URL+'/resourcefrequency',function(error, response){
						if(error){
							console.log("ResourceFrequencyDB replication error :"+error)
						}else{
				  			console.log("Successfully replicated ResourceFrequencyDB :" + response)
						}

	             });
 			}
 },
 LogQuery:function(){
        var type="community"
        var configurations=Backbone.Collection.extend({

    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})	
    	    var config=new configurations()
    	        config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
    		if( cofigINJSON.rows[0].doc.type){
    		    type=cofigINJSON.rows[0].doc.type
    		}
		var log = new App.Views.LogQuery()
		log.type=type
		log.render()
		App.$el.children('.body').html(log.el)
		//currently hiding for all kind of communities and nations.
		$("#community-select").hide()
		/*if(type=='community'){
		$("#community-select").hide()
		}
		if(type=='nation'){
		$("#community-select").multiselect({
					multiple: false,
					header: "Select A Community",
					noneSelectedText: "Select A Community",
					selectedList: 1
				 });
		}*/
//         $.datepicker.setDefaults({
//             dateFormat: 'mm-dd-yy'
//         });
		$('#start-date').datepicker({
               dateFormat: "yy-mm-dd",
               todayHighlight: true
            });
        $('#end-date').datepicker({
               dateFormat: "yy-mm-dd",
               todayHighlight: true
            });
 }, 
 changeDateFormat:function(date)
 {
 var datePart = date.match(/\d+/g), year = datePart[0], month = datePart[1], day = datePart[2];
  return year+'/'+month+'/'+day;
 },
 deletePouchDB:function(){
    var Resources=new PouchDB('resources');
 	Resources.destroy(function(err,info){
 	if(err)
 	console.log(err)
 	else
 	console.log("deleted successfully " + info)
 	})
    var FeedBackDb=new PouchDB('feedback');
	FeedBackDb.destroy(function(err, info) {
	if(err)
 	console.log(err)
 	else
	console.log("Successfully Deleted feedback"+info)
	});
    var Members=new PouchDB('members');
	Members.destroy(function(err, info) { 
	if(err)
 	console.log(err)
 	else
		console.log("Successfully Deleted members"+info)
	});
	var ResourceFrequencyDB=new PouchDB('resourcefrequency');
	ResourceFrequencyDB.destroy(function(err, info) {
	if(err)
 	console.log(err)
 	else 
	console.log("Successfully Destroy ResourceFrequency"+info)
	});
	var membercourseprogress=new PouchDB('membercourseprogress');
	membercourseprogress.destroy(function(err, info) {
	if(err)
 	console.log(err)
 	else 
	console.log("Successfully Destroy membercourseprogress"+info)
	});
	var coursestep=new PouchDB('coursestep');
	coursestep.destroy(function(err, info) {
	if(err)
 	console.log(err)
 	else 
	console.log("Successfully Destroy coursestep"+info)
	});
	
	var activitylogs=new PouchDB('activitylogs');
	activitylogs.destroy(function(err, info) {
	if(err)
 	console.log(err)
 	else 
	console.log("Successfully Destroy activitylogs"+info)
	});
	return true
},
dbinfo:function() {
    var Resources=new PouchDB('resources');
    Resources.info(function(err,info){console.log(info)})
    var FeedBackDb=new PouchDB('feedback');
    FeedBackDb.info(function(err,info){console.log(info)})
	var Members=new PouchDB('members');
	Members.info(function(err,info){console.log(info)})
	var ResourceFrequencyDB=new PouchDB('resourcefrequency');
	ResourceFrequencyDB.info(function(err,info){console.log(info)})
	var CourseStep=new PouchDB('coursestep');
	CourseStep.info(function(err,info){console.log(info)})
	var MemberCourseProgress=new PouchDB('membercourseprogress');
	MemberCourseProgress.info(function(err,info){console.log(info)
	console.log(err)
	})
	var activitylogs=new PouchDB('activitylogs');
	activitylogs.info(function(err,info){console.log(info)})
},
CompileAppManifest:function(){

    var apps = new App.Collections.Apps()
    var find = '{replace me}'
    var replace = '# Compiled at ' + new Date().getTime() + '\n'
    var defaultManifestURL = '/apps/_design/bell/manifest.default.appcache'
    var appsURL = '/apps/_design/bell'
    var transformedManifestURL = appsURL + '/manifest.appcache'
    
    apps.once('sync', function() {
          _.each(apps.models, function(app) {
            _.each(app.get('_attachments'), function(value, key, list) {
              if (key !== "manifest.appcache") replace += encodeURI('/apps/' + app.id + '/' + key) + '\n'
            })
          })
          App.trigger('compile:appsListReady')
        })
    apps.fetch()
    
    App.once('compile:appsListReady', function() {

        $.get(defaultManifestURL, function(defaultManifest) {
          var transformedManifest = defaultManifest.replace(find, replace)
			 $.getJSON(appsURL, function(appsDoc){
				var xhr = new XMLHttpRequest()
				xhr.open('PUT', transformedManifestURL + '?rev=' + appsDoc._rev, true)
				xhr.onload = function(response) { 
				  App.trigger('compile:done')
				}
				xhr.setRequestHeader("Content-type", "text/cache-manifest" );
				xhr.send(new Blob([transformedManifest], {type: 'text/plain'}))
			  })
        })
      })
   App.once('compile:done', function() {
        alert('menifist file is creted in Bell-apps')
      })

},
 CompileManifest: function() {
      App.startActivityIndicator()
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
      var memName=$.cookie('Member.login')
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
				 replace += ('/shelf/_design/bell/_view/DuplicateDetection?include_docs=true&key="'+memId+'"')+'\n'
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
					  replace += encodeURI('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="'+memName+'"')+'\n'					  
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
      App.stopActivityIndicator()
    },
    UpdateManifest:function(){
     // The URL of the device where we'll store transformed files
      var deviceURL = '/devices/_design/all'
      // The location of the default files we'll tranform
      var defaultManifestURL = '/apps/_design/bell/manifest.default.appcache'
       // URLs to save transformed files to      
      var transformedManifestURL = deviceURL + '/manifest.appcache'
      // The string to find in the default manifest file that we'll replace with Resources
      var find = '{replace me}'
      var replace = '# Compiled at ' + new Date().getTime() + '\n'
      
      // Compile the new manifest file and save it to devices/all
     

        $.get(defaultManifestURL, function(defaultManifest) {
          var transformedManifest = defaultManifest.replace(find, replace)
          $.getJSON(deviceURL, function(deviceDoc){
            var xhr = new XMLHttpRequest()
            xhr.open('PUT', transformedManifestURL + '?rev=' + deviceDoc._rev, true)
            xhr.onload = function(response) { 
            }
            xhr.setRequestHeader("Content-type", "text/cache-manifest" );
            xhr.send(new Blob([transformedManifest], {type: 'text/plain'}))
          })
        })
      
     
    },
     WeeklyReports:function(){
    
        var logdb = new PouchDB('activitylogs');
        var that = this;
        logdb.allDocs({include_docs: true},
            function(err, response) {
                if (!err) {
                    var collection = response.rows; // all docs from PouchDB's 'activitylogs' db
                    for (var i = 0; i < response.total_rows; i++) { // if # of rows is zero, then
                        // PouchDB's activitylogs db has no docs in it to sync to CouchDB's activitylog db
                        activitylog = collection[i].doc;
                        activitylogDate = activitylog.logDate;
                        var logModel = new App.Collections.ActivityLog();
                        logModel.logDate = activitylogDate;

                        logModel.fetch( {success: function(res, resInfo) {
//                         console.log(res)
//                         alert("sdads");
                            if(res.length == 0){ // CouchDB's activitylog db has ZERO (or NO) documents with attrib "logDate"
                                // having value == collection[i].doc.logDate, so a new activitylog doc will be added to CouchDB
                                // having same json as that of collection[i].doc's (pointed to by 'activitylog' var above)
                                // from PouchDB's activitylogs db.
                                that.createLogs(activitylog);
                            } else { // Couchdb's activitylog db does have atleast one doc having attrib "logDate" with a
                                // value == collection[i].doc.logDate
                                logsonServer = res.first();
                                that.updateLogs(activitylog, logsonServer);
                            }
                        },
                            error: function(err) {
                                console.log("WeeklyReports:: Error looking for (daily) activitylog doc for today's date in CouchDB");
//                                alert("WeeklyReports:: Error looking for (daily) activitylog doc for today's date in CouchDB");
                            }});
                    }
                } else {
                    console.log("Error fetching documents of 'activitylogs' db in PouchDB. Please try again or refresh page.");
//                    alert("Error fetching documents of 'activitylogs' db in PouchDB. Please try again or refresh page.");
                }
            }
        );
        
    },
    createLogs:function(activitylog){

            var toDelete_id = activitylog._id;
            var toDelete_rev = activitylog._rev;
            var logdb=new PouchDB('activitylogs');
            //alert('here in create log function')
			var dailylogModel = new App.Models.DailyLog();
            var dailyLog = activitylog;
//            delete activitylog._rev;
//            delete activitylog._id;
//				console.log(activitylog);
//            dailylogModel.set(activitylog); community

            dailylogModel.set('logDate' , activitylog.logDate);
            dailylogModel.set('community' , activitylog.community);
            dailylogModel.set('resourcesIds' , activitylog.resourcesIds)
            dailylogModel.set('resources_opened' , activitylog.resources_opened)
            dailylogModel.set('male_visits' , activitylog.male_visits)
            dailylogModel.set('female_visits' , activitylog.female_visits)
            dailylogModel.set('male_rating' , activitylog.male_rating)
            dailylogModel.set('female_rating' , activitylog.female_rating)
            dailylogModel.set('male_timesRated' , activitylog.male_timesRated)
            dailylogModel.set('female_timesRated' , activitylog.female_timesRated)
            dailylogModel.set('male_opened' , activitylog.male_opened)
            dailylogModel.set('female_opened' , activitylog.female_opened)

            dailylogModel.save(null,{success:function(res,resInfo){
                logdb.remove(activitylog, function(err, response) {
                   if(err){
                        console.log(err)
                        alert('mainRouter:: createLogs:: error: could NOT Remove pouch doc');
                   }else{
//                        console.log('mainRouter:: createLogs:: removed Pouch doc successfully: ');
//                        console.log(response);
//                        alert('mainRouter:: createLogs:: removed Pouch doc successfully');
                   }
               });
            }});

    },
    updateLogs:function(activitylog,logsonServer){
    
    		   var activitylog_resRated=0;
               if(activitylog.resourcesIds){
               activitylog_resRated = activitylog.resourcesIds
               }
               var activitylog_resOpened =0;
               if( activitylog.resources_opened){
               activitylog_resOpened = activitylog.resources_opened
               }
               var logsonServer_resRated =0;
               if( logsonServer.get('resourcesIds')){
               logsonServer_resRated = logsonServer.get('resourcesIds')
               }
               var logsonServer_resOpened = 0;
               if(logsonServer.get('resources_opened')){
               	logsonServer_resOpened=logsonServer.get('resources_opened')
               }
               
               var logsonServer_male_visits = 0;
               if(logsonServer.get('male_visits')){
               	logsonServer_male_visits=logsonServer.get('male_visits')
               }
               var logsonServer_female_visits = 0;
               if(logsonServer.get('female_visits')){
               	logsonServer_female_visits=logsonServer.get('female_visits')
               
               }
               var logsonServer_male_rating = 0;
               if(logsonServer.get('male_rating')){
               	logsonServer_male_rating=logsonServer.get('male_rating')
               }
               var logsonServer_female_rating = 0;
               if(logsonServer.get('female_rating')){
                logsonServer_female_rating = logsonServer.get('female_rating')
               }
               
               var logsonServer_male_timesRated = 0;
               if(logsonServer.get('male_timesRated')){
               	logsonServer_male_timesRated = logsonServer.get('male_timesRated')
               }
               var logsonServer_female_timesRated = 0;
               if(logsonServer.get('female_timesRated')){
               	logsonServer_female_timesRated = logsonServer.get('female_timesRated')
               }
               
               var logsonServer_male_opened = 0;
               if(logsonServer.get('male_opened')){
               	logsonServer_male_opened= logsonServer.get('male_opened')
               } 
               var logsonServer_female_opened = 0;
               if(logsonServer.get('female_opened')){
               	logsonServer_female_opened = logsonServer.get('female_opened')
               }
        
                logsonServer_male_visits=parseInt(logsonServer_male_visits)+parseInt(activitylog.male_visits)
                logsonServer_female_visits=parseInt(logsonServer_female_visits)+parseInt(activitylog.female_visits)
                
               for(i=0 ; i < activitylog_resRated.length ; i++){
                     resId=activitylog_resRated[i]
                     index=logsonServer_resRated.indexOf(resId)
                     //alert('index'+index)
                     if(index==-1){
                     
                            logsonServer_resRated.push(resId)
                            logsonServer_male_rating.push(activitylog.male_rating[i])
                            logsonServer_female_rating.push(activitylog.female_rating[i])
                            logsonServer_male_timesRated.push(activitylog.male_timesRated[i])
                            logsonServer_female_timesRated.push(activitylog.female_timesRated[i])
                            
                     }else{ 
                     
                            logsonServer_male_rating[index] = parseInt(logsonServer_male_rating[index]) + parseInt(activitylog.male_rating[i])
                            logsonServer_female_rating[index] = parseInt(logsonServer_female_rating[index]) + parseInt(activitylog.female_rating[i])
                            logsonServer_male_timesRated[index] = parseInt(logsonServer_male_timesRated[index]) + parseInt(activitylog.male_timesRated[i])
                            logsonServer_female_timesRated[index] = parseInt(logsonServer_female_timesRated[index]) + parseInt(activitylog.female_timesRated[i])
                     }        
               }
               for(i=0 ; i < activitylog_resOpened.length ; i++){
                    resId=activitylog_resOpened[i]
                    index=logsonServer_resOpened.indexOf(resId)
                    if(index==-1){
                             logsonServer_resOpened.push(resId)
                             logsonServer_male_opened.push(activitylog.male_opened[i])
                             logsonServer_female_opened.push(activitylog.female_opened[i])
                     }else{
                             logsonServer_male_opened[index] = parseInt(logsonServer_male_opened[index]) + parseInt(activitylog.male_opened[i])
                             logsonServer_female_opened[index]=parseInt(logsonServer_female_opened[index])+parseInt(activitylog.female_opened[i])
                     }
               }
               //alert('in update logs')
               logsonServer.set('resourcesIds' , logsonServer_resRated)
               logsonServer.set('resources_opened' , logsonServer_resOpened)
               logsonServer.set('male_visits' , logsonServer_male_visits)
               logsonServer.set('female_visits' , logsonServer_female_visits)
               logsonServer.set('male_rating' , logsonServer_male_rating)
               logsonServer.set('female_rating' , logsonServer_female_rating)
               logsonServer.set('male_timesRated' , logsonServer_male_timesRated)
               logsonServer.set('female_timesRated' , logsonServer_female_timesRated)
               logsonServer.set('male_opened' , logsonServer_male_opened)
               logsonServer.set('female_opened' , logsonServer_female_opened)
               
               var logdb=new PouchDB('activitylogs')
               logsonServer.save(null,{success:function(model,modelInfo){
                   console.log("MyAppRouter:: updateLogs:: successfully updated (community) CouchDB with activitylog from Pouch");
               //alert('save function')
                      logdb.remove(activitylog,function(err, info) {
							if(err){
                                console.log("MyAppRouter:: updateLogs:: Failed to delete Pouch activitylog doc after it had been synced i-e its data pushed to (community) CouchDB");
                                console.log(err);
//                                alert("MyAppRouter:: updateLogs:: could NOT Remove couch doc");
                            } else {
                                console.log("MyAppRouter:: updateLogs:: Successfully deleted Pouch activitylog doc after it had been synced with community CouchDB");
//                                console.log(info);
//                                alert('MyAppRouter:: updateLogs:: Successfully Deleted pouch doc')
                            }

					  });
               }});
      
    },
       LogActivity:function(CommunityName,startDate,endDate){
       	   var rpt = new App.Views.ActivityReport()
           var type="community"
           var configurations=Backbone.Collection.extend({

    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})	
    	    var config=new configurations()
    	        config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
    		if( cofigINJSON.rows[0].doc.type){
    		    type=cofigINJSON.rows[0].doc.type
    		}
    		
           var logData=new App.Collections.ActivityLog()
           logData.startkey=this.changeDateFormat(startDate)
           logData.endkey=this.changeDateFormat(endDate)
           if(CommunityName!='all')
           logData.name=CommunityName
           logData.fetch({
               async:false
           })
           var logReport=logData.first();
           if(logReport==undefined){
           alert("No Activity Logged .")
           }
            var report_resRated = logReport.get('resourcesIds')
            var report_resOpened = [];
            if(logReport.get('resources_opened')){
            report_resOpened = logReport.get('resources_opened')
            }
            var report_male_visits = 0;
            if(logReport.get('male_visits')){
            report_male_visits=logReport.get('male_visits')
            }
            var report_female_visits = 0;
            if(logReport.get('female_visits')){
             report_female_visits=logReport.get('female_visits')
            } 
            var report_male_rating = []
            if(logReport.get('male_rating')){
            report_male_rating = logReport.get('male_rating')
            }
            var report_female_rating =[];
            if(logReport.get('female_rating')){
            report_female_rating = logReport.get('female_rating')
            } 
            var report_male_timesRated = [];
            if(logReport.get('male_timesRated')){
            report_male_timesRated = logReport.get('male_timesRated')
            }
            var report_female_timesRated = [];
            if(logReport.get('female_timesRated')){
            report_female_timesRated = logReport.get('female_timesRated')
            }
            var report_male_opened =[]
            if(logReport.get('male_opened')){
             report_male_opened = logReport.get('male_opened')
            } 
            var report_female_opened = []
            if(logReport.get('female_opened')){
            report_female_opened = logReport.get('female_opened')
            }

            logData.each(function (logDoc,index){
              
                   if(index>0){
                       // add visits to prev total
                       report_male_visits += logDoc.get('male_visits');
                       report_female_visits += logDoc.get('female_visits');
                       resourcesIds=logDoc.get('resourcesIds');
                       resourcesOpened=logDoc.get('resources_opened');

                       for(var i = 0; i < resourcesIds.length ; i++){
                           resId=resourcesIds[i]
                           index=report_resRated.indexOf(resId)
                           if(index==-1){
                               report_resRated.push(resId);
                               report_male_rating.push(logDoc.get('male_rating')[i])
                               report_female_rating.push(logDoc.get('female_rating')[i]);
                               report_male_timesRated.push(logDoc.get('male_timesRated')[i]);
                               report_female_timesRated.push(logDoc.get('female_timesRated')[i])

                           }else{

                               report_male_rating[index] = report_male_rating[index] + logDoc.get('male_rating')[i];
                               report_female_rating[index] = report_female_rating[index] + logDoc.get('female_rating')[i];
                               report_male_timesRated[index] = report_male_timesRated[index] + logDoc.get('male_timesRated')[i];
                               report_female_timesRated[index] = report_female_timesRated[index] + logDoc.get('female_timesRated')[i];

                           }
                       }
                       if(resourcesOpened)
                       for(var i=0 ; i < resourcesOpened.length ; i++){
                           resId=resourcesOpened[i]
                           index=report_resOpened.indexOf(resId)
                           if(index==-1){
                               report_resOpened.push(resId)
                               report_male_opened.push(logDoc.get('male_opened')[i])
                               report_female_opened.push(logDoc.get('female_opened')[i])
                           }else{
                               report_male_opened[index] = report_male_opened[index] + logDoc.get('male_opened')[i]
                               report_female_opened[index] = report_female_opened[index] + logDoc.get('female_opened')[i]
                           }

                       }


                   }
            });

           

           // find most frequently opened resources
           var times_opened_cumulative = [], Most_Freq_Opened = [];
           for (var i = 0; i < report_resOpened.length; i++) {
               times_opened_cumulative.push(report_male_opened[i] + report_female_opened[i]);
           }
           //
           var indices = [];
           var topCount = 5;
           if (times_opened_cumulative.length >= topCount) {
               indices = this.findIndicesOfMax(times_opened_cumulative, topCount);
           }
           else {
               indices = this.findIndicesOfMax(times_opened_cumulative, times_opened_cumulative.length);
           }
           // fill up most_freq_opened array
           var timesRatedTotalForThisResource, sumOfRatingsForThisResource;
           if (times_opened_cumulative.length > 0) {
               var most_freq_res_entry, indexFound;
               for (var i = 0; i < indices.length; i++) {
               	var res=new App.Models.Resource({_id:report_resOpened[indices[i]]})
                       res.fetch({
                          async:false
                       })
                  	var name=res.get('title')
                  
                   // create most freq opened resource entry and push it into Most_Freq_Opened array
                   most_freq_res_entry = {
                       "resourceName":	name ,
                       "timesOpenedCumulative": times_opened_cumulative[indices[i]],
                       "timesOpenedByMales": report_male_opened[indices[i]],
                       "timesOpenedByFemales": report_female_opened[indices[i]]
                   };
                   if ((indexFound = report_resRated.indexOf(report_resOpened[indices[i]])) === -1) { // resource not rated
                       most_freq_res_entry["avgRatingCumulative"] = "N/A";
                       most_freq_res_entry["avgRatingByMales"] = "N/A";
                       most_freq_res_entry["avgRatingByFemales"] = "N/A";
                       most_freq_res_entry["timesRatedByMales"] = "N/A";
                       most_freq_res_entry["timesRatedByFemales"] = "N/A";
                       most_freq_res_entry["timesRatedCumulative"] = "N/A";
                   }
                   else {
                       timesRatedTotalForThisResource = report_male_timesRated[indexFound] + report_female_timesRated[indexFound];
                       sumOfRatingsForThisResource = report_male_rating[indexFound] + report_female_rating[indexFound];
                       most_freq_res_entry["avgRatingCumulative"] = Math.round((sumOfRatingsForThisResource / timesRatedTotalForThisResource) * 100)/100;
                       most_freq_res_entry["avgRatingByMales"] = report_male_rating[indexFound];
                       most_freq_res_entry["avgRatingByFemales"] = report_female_rating[indexFound];
                       most_freq_res_entry["timesRatedByMales"] = report_male_timesRated[indexFound];
                       most_freq_res_entry["timesRatedByFemales"] = report_female_timesRated[indexFound];
                       most_freq_res_entry["timesRatedCumulative"] = timesRatedTotalForThisResource;
                   }
                   Most_Freq_Opened.push(most_freq_res_entry);
               }
           }

           // find highest rated resources
           var resources_rated_cumulative = [], Highest_Rated_Resources = [], Lowest_Rated_Resources = [];
           var lowestHowMany = 5;
           for (var i = 0; i < report_resRated.length; i++) {
               timesRatedTotalForThisResource = report_male_timesRated[i] + report_female_timesRated[i];
               sumOfRatingsForThisResource = report_male_rating[i] + report_female_rating[i];
               resources_rated_cumulative.push(sumOfRatingsForThisResource / timesRatedTotalForThisResource);
           }
           var indicesHighestRated = [], indicesLowestRated = [];
           if (resources_rated_cumulative.length >= topCount) {
               indicesHighestRated = this.findIndicesOfMax(resources_rated_cumulative, topCount);
               indicesLowestRated = this.findIndicesOfMin(resources_rated_cumulative, lowestHowMany);
           }
           else {
               indicesHighestRated = this.findIndicesOfMax(resources_rated_cumulative, resources_rated_cumulative.length);
               indicesLowestRated = this.findIndicesOfMin(resources_rated_cumulative, resources_rated_cumulative.length);
           }
           if (resources_rated_cumulative.length > 0) {
               var entry_rated_highest, entry_rated_lowest;
               // fill up Highest_Rated_resources list
               for (var i = 0; i < indicesHighestRated.length; i++) {
               	var res=new App.Models.Resource({_id:report_resRated[indicesHighestRated[i]]})
                       res.fetch({
                          async:false
                       })
                  	var name=res.get('title')
                   timesRatedTotalForThisResource = report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]];
                   // create highest rated resource entry and push it into Highest_Rated_Resources array
                   entry_rated_highest = {
                       "resourceName": name,
                       "avgRatingCumulative": Math.round(resources_rated_cumulative[indicesHighestRated[i]] * 100)/100,
                       "avgRatingByMales": report_male_rating[indicesHighestRated[i]],
                       "avgRatingByFemales": report_female_rating[indicesHighestRated[i]],
                       "timesRatedByMales": report_male_timesRated[indicesHighestRated[i]],
                       "timesRatedByFemales": report_female_timesRated[indicesHighestRated[i]],
                       "timesRatedCumulative": report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]]
                   };
                   if ((indexFound = report_resOpened.indexOf(report_resRated[indicesHighestRated[i]])) === -1) { // resource not rated
                       entry_rated_highest["timesOpenedByMales"] = "N/A";
                       entry_rated_highest["timesOpenedByFemales"] = "N/A";
                       entry_rated_highest["timesOpenedCumulative"] = "N/A";
                   }
                   else {
                       entry_rated_highest["timesOpenedByMales"] = report_male_opened[indexFound];
                       entry_rated_highest["timesOpenedByFemales"] = report_female_opened[indexFound];
                       entry_rated_highest["timesOpenedCumulative"] = times_opened_cumulative[indexFound];
                   }
                   Highest_Rated_Resources.push(entry_rated_highest);
               }
               // fill up Lowest_Rated_resources list
               for (var i = 0; i < indicesLowestRated.length; i++) {
                   timesRatedTotalForThisResource = report_male_timesRated[indicesLowestRated[i]] + report_female_timesRated[indicesLowestRated[i]];
                   // create lowest rated resource entry and push it into Lowest_Rated_Resources array
                   	var res=new App.Models.Resource({_id:report_resRated[indicesLowestRated[i]]})
                       res.fetch({
                          async:false
                       })
                  	var name=res.get('title')
                  
                   entry_rated_lowest = {
                       "resourceName": name,
                       "avgRatingCumulative": Math.round(resources_rated_cumulative[indicesLowestRated[i]] * 100)/100,
                       "avgRatingByMales": report_male_rating[indicesLowestRated[i]],
                       "avgRatingByFemales": report_female_rating[indicesLowestRated[i]],
                       "timesRatedByMales": report_male_timesRated[indicesLowestRated[i]],
                       "timesRatedByFemales": report_female_timesRated[indicesLowestRated[i]],
                       "timesRatedCumulative": report_male_timesRated[indicesLowestRated[i]] + report_female_timesRated[indicesLowestRated[i]]
                   };
                   if ((indexFound = report_resOpened.indexOf(report_resRated[indicesLowestRated[i]])) === -1) { // resource not rated
                       entry_rated_lowest["timesOpenedByMales"] = "N/A";
                       entry_rated_lowest["timesOpenedByFemales"] = "N/A";
                       entry_rated_lowest["timesOpenedCumulative"] = "N/A";
                   }
                   else {
                       entry_rated_lowest["timesOpenedByMales"] = report_male_opened[indexFound];
                       entry_rated_lowest["timesOpenedByFemales"] = report_female_opened[indexFound];
                       entry_rated_lowest["timesOpenedCumulative"] = times_opened_cumulative[indexFound];
                   }
                   Lowest_Rated_Resources.push(entry_rated_lowest);
               }
           }
           console.log(Highest_Rated_Resources);
        
           var staticData={
               "Visits":{"male": report_male_visits, "female": report_female_visits},
               "Most_Freq_Open": Most_Freq_Opened,
               "Highest_Rated": Highest_Rated_Resources,
               "Lowest_Rated": Lowest_Rated_Resources
           };

           rpt.data=staticData;
           rpt.startDate=startDate
           rpt.endDate=endDate
           rpt.CommunityName=CommunityName
           rpt.render()
           App.$el.children('.body').html(rpt.el)
           /* After moving sync to nation
           var roles=this.getRoles()
    		if( (roles.indexOf("Leader")==-1&&roles.indexOf("SuperManager")==-1&&roles.indexOf("Manager")==-1) ||type=="nation"){
    	   		App.$el.children('.body').html(rpt.el)
            	
      		}
      		else{
      		App.$el.children('.body').html("<button class='btn btn-success' id='syncReport'>Sync Activity Reports To Nation</button>")
      		App.$el.children('.body').append(rpt.el)
           
      		}*/
       },
       /*Moved to nation
       syncLogActivitiy:function(){
        
             App.startActivityIndicator()
         var configurationModel=new App.Collections.Configurations()
		     configurationModel.fetch({success:function(res){
		     
					        var conf=res.first()
					        console.log(conf)
					        var nationName=conf.get('nationName')
					        var nationURL=conf.get('nationUrl')					        
							$.ajax({
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json; charset=utf-8'
								},
								type: 'POST',
								url: '/_replicate',
								dataType: 'json',
								data: JSON.stringify({
									"source": "activitylog",
									"target": 'http://'+ nationName +':'+App.password+'@'+ nationURL + '/activitylog'
								}),
								success: function (response) {
                                            App.stopActivityIndicator()
                                            alert("Successfully Replicated Reports")
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) { 
								            App.stopActivityIndicator()
								            alert("Error (Try Later)")
                					}, 
								async: false
							})
					 
				 }})


        },*/
       findIndicesOfMax: function (inp, count) {
            var outp = [];
            for (var i = 0; i < inp.length; i++) {
                outp.push(i); // add index to output array
                if (outp.length > count) {
                    outp.sort(function(a, b) { return inp[b] - inp[a]; }); // descending sort the output array
                    outp.pop(); // remove the last index (index of smallest element in output array)
                }
            }
            if (inp.length <= count) {
                outp.sort(function(a, b) { return inp[b] - inp[a]; });
            }
            return outp;
       },
       findIndicesOfMin: function (inp, count) {
           var outp = [];
           for (var i = 0; i < inp.length; i++) {
               outp.push(i); // add index to output array
               if (outp.length > count) {
                   outp.sort(function(a, b) { return inp[a] - inp[b]; }); // descending sort the output array
                   outp.pop(); // remove the last index (index of smallest element in output array)
               }
           }
           if (inp.length <= count) {
               outp.sort(function(a, b) { return inp[a] - inp[b]; });
           }
           return outp;
       },
      setNeedOptimizedBit: function () {

       	var count = 0;
       	var resources = new App.Collections.Resources()
       	resources.fetch({
       		async: false
       	})
       	resources.each(function (m) {
       		if (m.get('openWith') === 'PDF.js') {
       		if(m.get('need_optimization')==undefined){
       			m.set({
       				'need_optimization': true
       			})
       			m.save()
       			console.log("Done")
       		}
       		}
       		console.log(count)
       			count++
       	})


       }
   }))
  


})
