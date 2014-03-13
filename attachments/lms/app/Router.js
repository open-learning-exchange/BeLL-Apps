$(function () {
    App.Router = new(Backbone.Router.extend({


        routes: {
            '': 'LandingScreen',
            'teams': 'Resources',
            'landingPage': 'LandingScreen',
            'becomemember': 'BecomeMemberForm',
            'login': 'MemberLogin',
            'logout': 'MemberLogout',
            'resources': 'Resources',
            'resource/add': 'ResourceForm',
            'resource/edit/:resourceId': 'ResourceForm',
            'resource/feedback/:resourceId': 'ResourceFeedback',
            'resource/invite/:resourceId/:name/:kind': 'ResourceInvitation',
            'resource/feedback/add/:resourceId': 'FeedbackForm',
            'resource/feedback/add/:resourceId/:title': 'FeedbackForm',
            'courses': 'Groups',
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
            'member/add': 'MemberForm',
            'member/edit/:memberId': 'MemberForm',
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
            'abcde':'resourcesIdScript'


        },
        initialize: function () {
            this.bind("all", this.checkLoggedIn)
            this.bind("all", this.routeStartupTasks)
            this.bind("all", this.renderNav)
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
            $('#nav .container').html(na.el)
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
        resourcesTagScript: function ()
			{
				var resources = new App.Collections.Resources()
				resources.fetch({
					async: false
				})
				resources.each(function (m)
				{
					var Tags = m.get("Tag")
					if ($.isArray(Tags))
					{
						if (flag){
							return;
						}
						var i = 0;
						var flag = false;
						while (i < Tags.length)
						{
							Tags[i] = Tags[i].replace("&", "n");
							Tags[i] = Tags[i].replace(";", " ");
							var coll = new App.Models.CollectionList(
							{
								_id: Tags[i]
							})
							coll.fetch(
							{
								async: false
							})
							//console.log(coll)
							if (coll.get('CollectionName') == undefined)
							{

								var TagColl = Backbone.Collection.extend(
								{
									url: App.Server + '/collectionlist/_design/bell/_view/collectionByName?key="' + Tags[i] + '"&include_docs=true'
								})
								//console.log(App.Server + '/collectionlist/_design/bell/_view/collectionByName?key="' + Tags[i] + '"&include_docs=true')
								var collTag = new TagColl()
								collTag.fetch(
								{
									async: false
								})
								//console.log(collTag)
								var matchedTag = collTag.first()
								if(matchedTag!=undefined){
								if (matchedTag.toJSON().rows[0] != undefined){
									Tags[i] = matchedTag.toJSON().rows[0].id;
									console.log(matchedTag.toJSON().rows[0].id)
									console.log(Tags[i])
									console.log(Tags)
									}
								}
								
								else
								{
									var newTag = new App.Models.CollectionList()
									newTag.set({
										'AddedBy': 'admin'
									})
									newTag.set({
										'AddedDate': '"05/3/2014"'
									})
									newTag.set({
										'CollectionName': Tags[i]
									})
									newTag.set({
										'Description': ''
									})
									newTag.set({
										'IsMajor': true
									})
									newTag.set({
										'NesttedUnder': "--Select--"
									})
									newTag.set({
										'kind': 'CollectionList'
									})
									newTag.set({
										'show': true
									})
									flag = true;
									newTag.save(null,{
										success: function (response, model){
											i = i - 1;
											Tags[i] = response.toJSON().id
											i = i + 1;
											flag = false;
										}
									})


								}

							}

							i = i + 1;
						}

					}
					console.log(Tags)
					m.set(
					{
						'Tag': Tags
					})
					m.save()
				})

			},
			resourcesIdScript: function ()
			{
				var resources = new App.Collections.Resources()
				resources.fetch(
				{
					async: false
				})
				resources.each(function (m)
				{

					var Tags = m.get("Tag")
					//console.log(Tags)
					console.log(m.get("_id"))
					if ($.isArray(Tags))
					{
						var i = 0;
						 while (i < Tags.length)
						{
							var coll = new App.Models.CollectionList(
							{
								_id: Tags[i]
							})
							coll.fetch(
							{
								async: false
							})
							//console.log(coll)
							if (coll.get('CollectionName') != undefined)
							{
							Tags[i]=coll.get('CollectionName')
							
							}

							i = i + 1;
						}
					}
					console.log(Tags)
					m.set(
					{
						'Tag': Tags
					})
					m.save()
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
        checkLoggedIn: function () {
            if (!$.cookie('Member._id')) {
                if ($.url().attr('fragment') != 'login' && $.url().attr('fragment') != '' && $.url().attr('fragment') != 'landingPage' && $.url().attr('fragment') != 'becomemember') {
                    Backbone.history.stop()
                    App.start()
                }
            }
            else{
    	     	var expTime=$.cookie('Member.expTime')
 			    var d = new Date(Date.parse(expTime))
             	var diff = Math.abs(new Date() - d)
           		 //alert(diff)
            	var expirationTime=7200000
            	if(diff<expirationTime)
           		 {
              	  var date=new Date()
              	  $.cookie('Member.expTime',date ,{path:"/apps/_design/bell"})
              	  $.cookie('Member.expTime',date,{path:"/apps/_design/bell"})
           		 }
           	 else{ 
                  this.expireSession()
                  Backbone.history.stop()
   			      App.start() 
               
            }
      	}
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
                	var pending=member.get("pendingReviews")
                	var resource=new App.Models.Resource({_id:pending[0]})
                	var response=resource.fetch({async:false})
                	if(response.status==200){
                		Backbone.history.navigate('resource/feedback/add/' + resource.attributes._id + '/' + resource.attributes.title, {
                    	trigger: true
                		})
                	}
                	else{
                		pending=pending.splice(0,1)      
                		member.set("pendingReviews",pending)      		
                	}
                }
            }
        },
     
        Reports: function (database) {
        
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
		
        viewAllFeedback: function () {
            var fed = new App.Collections.siteFeedbacks()
            fed.fetch({
                async: false
            })
            feedul = new App.Views.siteFeedbackPage({
                collection: fed
            })
            feedul.render()
            $('#see-all', feedul.$el).trigger("click");
            App.$el.children('.body').html('&nbsp')
            App.$el.children('.body').append(feedul.el)
            $("#previousButton").hide()
              $("#progress_img").hide()
        },
        LandingScreen: function () {
            var temp = $.url().attr("host").split(".")
            temp = temp[0].substring(3)
            var vars = new Object()
            vars.host = temp
            vars.visits = "null"
            var template = $('#template-LandingPage').html()
            App.$el.children('.body').html(_.template(template, vars))
            
        },
        BecomeMemberForm: function () {
        	
            var m = new App.Models.Member()
            var bform = new App.Views.BecomeMemberForm({
                model: m
            })
            bform.on('BecomeMemberForm:done', function () {
                window.location = "../lms/index.html#login"
            })
            bform.render()
            App.$el.children('.body').html('<h1>Become A Member</h1>')
            App.$el.children('.body').append(bform.el)
        },
        DemoScreen: function () {
            var demo = new App.Views.Demo()
            App.$el.children('.body').html(demo.el)
            demo.render()
        },
        DemoVersion: function () {
            var demo = new App.Views.Demo()
            App.$el.children('.body').html(demo.el)
            demo.render()

        },
        MemberLogin: function () {
            // Prevent this Route from completing if Member is logged in.
            if ($.cookie('Member._id')) {
                Backbone.history.navigate('resources', {
                    trigger: true
                })
                return
            }
            var credentials = new App.Models.Credentials()
            var memberLoginForm = new App.Views.MemberLoginForm({
                model: credentials
            })
            memberLoginForm.once('success:login', function () {
                window.location.href = "../personal/index.html#dashboard"
            })
            memberLoginForm.render()
            App.$el.children('.body').html(memberLoginForm.el)
            //Override the menu
        },

   		MemberLogout: function() {
       		this.expireSession()
      		Backbone.history.navigate('login', {trigger: true})
    	},
		expireSession:function(){
		
        $.removeCookie('Member.login',{path:"/apps/_design/bell"})
        $.removeCookie('Member._id',{path:"/apps/_design/bell"})
        $.removeCookie('Member.expTime',{path:"/apps/_design/bell"})
       
    
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
        Resources: function (database) {
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
   
    ResourceSearch: function () {
      // alert('in resource search function ')
      
     
      
        var collectionFilter=new Array()
        var subjectFilter=new Array()
        var levelFilter=new Array()
        var languageFilter=new Array()
            
        skipStack.push(skip)
            
        collectionFilter=$("#multiselect-collections-search").val()
        subjectFilter=$("#multiselect-subject-search").val()
        levelFilter=$("#multiselect-levels-search").val()
		languageFilter=$("#Language-filter").val()
		authorName=$('#Author-name').val()
		
		mediumFilter=$('#multiselect-medium-search').val()
		
       
        console.log(collectionFilter)  
		console.log(subjectFilter)
		console.log(levelFilter)
		console.log(languageFilter)
         
       //  alert(mediumFilter)
         
           $("input[name='star']").each(function () {
                if ($(this).is(":checked")) {
                    ratingFilter.push($(this).val());
                }
            })

            if (searchText != "" || (collectionFilter) || (subjectFilter) || (levelFilter) || (languageFilter) || (authorName)|| (mediumFilter) || (ratingFilter && ratingFilter.length > 0)) {
              // alert('in search')
                
                var search = new App.Views.Search()
                
                search.collectionFilter = collectionFilter
                search.languageFilter = languageFilter
                search.levelFilter = levelFilter
                search.subjectFilter = subjectFilter
                search.ratingFilter = ratingFilter
                search.mediumFilter = mediumFilter
                search.authorName = authorName
                
                search.addResource = false
                
                App.$el.children('.body').html(search.el)
                search.render()
                
                
                $("#srch").show()
                $(".row").hide()
                $('#not-found').show()
          
                $(".search-bottom-nav").hide()
                $(".search-result-header").hide()
                $("#selectAllButton").hide()
                
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
        ResourceInvitation: function (resourceId, name, kind) {
            var inviteModel = new App.Models.InviFormModel()
            inviteModel.entityId = resourceId
            inviteModel.senderId = $.cookie('Member._id')
            inviteModel.type = kind
            inviteModel.title = name
            var inviteForm = new App.Views.InvitationForm({
                model: inviteModel
            })
            inviteForm.render()
            App.$el.children('.body').html('<h1>Send Invitation</h1>')
            App.$el.children('.body').append(inviteForm.el)
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
        GroupSearch: function () {

            var cSearch
            cSearch = new App.Views.CourseSearch()
            cSearch.render()
            var button = '<p>'
            button += '<a class="btn btn-success" href="#course/add">Add a new Cource</a>'
            button += '<a style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Course")>Request Course</a>'
            button += '<a style="margin-left:10px" class="btn btn-info" onclick="ListAllCourses()">View All Courses</a>'
            button += '<span style="float:right">Keyword:&nbsp;<input id="searchText"  placeholder="Search" value="" size="30" style="height:24px;margin-top:1%;" type="text"><span style="margin-left:10px">'
            button += '<button class="btn btn-info" onclick="CourseSearch()">Search</button></span>'
            button += '</p>'
            App.$el.children('.body').html(button)
            App.$el.children('.body').append('<h1>Courses</h1>')
            App.$el.children('.body').append(cSearch.el)
        },
		Members: function () {
        App.startActivityIndicator()
			 var configurations=Backbone.Collection.extend({

    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})
    		var config=new configurations()
    	     config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
        
    	    
    	    code=cofigINJSON.rows[0].doc.code       
            
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
        // *********** MEMBER MEETUPS ****************************************************
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
        meetupDetails:function(meetupId,title){
        
            var meetupModel=new App.Models.MeetUp({_id:meetupId})
            meetupModel.fetch({async:false})
            var meetupView=new App.Views.meetupView({model:meetupModel})
            meetupView.render()
            App.$el.children('.body').html(meetupView.el)
            
        
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


        //New Requirement of Managing the course Level 


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
            App.$el.children('.body').append('<h3>Course Details</h3>')
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
        AddItemsToLevel: function (lid, rid, title) {
        
            App.$el.children('.body').html('<h1>Mange | ' + title + '</h1>')
            App.$el.children('.body').append('<button class="btn btn-info"  onclick = "document.location.href=\'#search-bell/' + lid + '/' + rid + '\'">Add Resources</button>')
            App.$el.children('.body').append('<button class="btn btn-info"  onclick = "document.location.href=\'#create-quiz/' + lid + '/' + rid + '\'">Create Quiz</button>')
        },
        CreateQuiz: function (lid, rid, title) {
            var levelInfo = new App.Models.CourseStep({
                "_id": lid
            })
            levelInfo.fetch({
                success: function () {
                    var quiz = new App.Views.QuizView()
                    quiz.levelId = lid
                    quiz.revId = rid
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


        LevelResourceFeedback: function (rid, levelid, revid) {
            var feedbackModel = new App.Models.Feedback({
                resourceId: rid,
                memberId: $.cookie('Member._id')
            })
            feedbackModel.on('sync', function () {
                Backbone.history.navigate('level/view/' + levelid + '/' + revid, {
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
        },

        // ***************************************Explore Bell Setup***********************************************************

        Explore_Bell_Courses: function () {
            var dfcourses = new App.Models.ExploreBell({
                "_id": "set_up"
            })
            var that = this
            dfcourses.fetch({
                success: function () {
                    var clist = new App.Views.ListDefaultCourses({
                        model: dfcourses
                    })
                    clist.render()
                    App.$el.children('.body').html('<h3>Explore Bell | Default Courses</h3>')
                    App.$el.children('.body').append("<a class='btn btn-success'  href='#search/courses'>Add Courses</a>")
                    App.$el.children('.body').append(clist.el)

                }
            })
        },

        AssignCoursestoExplore: function () {

            var clist = new App.Models.ExploreBell({
                "_id": "set_up"
            })
            clist.fetch({
                async: false
            })
            var that = this
            oldIds = clist.get("courseIds")
            oldTitles = clist.get("courseTitles")
            $("input[name='result']").each(function () {
                if ($(this).is(":checked")) {
                    var rId = $(this).val();
                    if (oldIds.indexOf(rId) == -1) {
                        rtitle.push($(this).attr('rTitle'))
                        rids.push(rId)
                    }
                }
            });

            clist.set("courseIds", oldIds.concat(rids))
            clist.set("courseTitles", oldTitles.concat(rtitle))
            clist.save()
            clist.on('sync', function () {
                alert("Selected Courses are set as default")
                Backbone.history.navigate('course/default', {
                    trigger: true
                })
            })

        },
        // Search Module Router Version 1.0.0

        AssignResourcetoShelf: function () {
            if (typeof grpId === 'undefined') {

                document.location.href = '#courses'
                return
            }
            // Interating through all the selected courses
            $("input[name='result']").each(function () {
                if ($(this).is(":checked")) {
                    var rId = $(this).val();
                    var title = $(this).attr('rTitle')
                    var shelfItem = new App.Models.Shelf()
                    shelfItem.set('memberId', $.cookie('Member._id'))
                    shelfItem.set('resourceId', rId)
                    shelfItem.set('resourceTitle', title)
                    //Adding the Selected Resource to the Shelf Hash(Dictionary)
                    shelfItem.save(null, {
                        success: function (model, response, options) {}
                    });
                }
            });
            document.location.href = '#course/assignments/week-of/' + grpId
        },


        AssignResourcetoLevel: function () {

            if (typeof grpId === 'undefined') {
                document.location.href = '#courses'
            }
            //var rids = new Array()
            //var rtitle = new Array()
            var cstep = new App.Models.CourseStep({
                "_id": grpId,
                "_rev": levelrevId
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
            cstep.save()
            cstep.on('sync', function () {
                alert("Your Resources have been updated successfully")
                Backbone.history.navigate('course/manage/' + cstep.get("courseId"), {
                    trigger: true
                })
            })

        },
        SearchCoursesInDb: function (text) {

            skipStack.push(skip)
            if (text) {
                searchText = text
            } else {
                searchText = $("#searchText").val()
            }
            rtitle.length = 0
            rids.length = 0
            if (searchText != "") {
            
                var search = new App.Views.SearchCourses()
                App.$el.children('.body').html(search.el)
                search.render()
                $("#searchText2").val(searchText)
                $("#srch").show()
                $(".row").hide()
                $(".search-bottom-nav").show()
                $(".search-result-header").show()
                $("#selectAllButton").show()
            }
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
        bellResourceSearch:function(){
                  
                   popAll()      // reset the SkipStack                  
                    var search = new App.Views.Search()
                        search.addResource=false
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
        
        
        },
        SearchCourses: function () {
            var levelInfo = new App.Models.ExploreBell({
                "_id": "set_up"
            })
            levelInfo.fetch({
                success: function () {
                    var search = new App.Views.SearchCourses()
                    App.$el.children('.body').html(search.el)
                    search.render()
                    $("#srch").hide()
                    $(".search-bottom-nav").hide()
                    $(".search-result-header").hide()
                    $("#selectAllButton").hide()

                }
            })
        },
        CompileManifestForWeeksAssignments: function (weekOf) {

            // 
            // Setup
            // 

            // We're going to get the Assigned Resources docs and App docs into this bundles object to 
            // to feed to App.compileManifest
            bundles = {
                "apps": {},
                "resources": {}
            }
            // Target Doc URL to attach our manifest.appcache to, fed to App.compileManifest
            targetDocURL = '/devices/_design/all'

            var assignments = new App.Collections.AssignmentsByDate()
            var resources = new App.Collections.Resources()
            var apps = new App.Collections.Apps()


            //
            // Step 1
            //
            // Fetch the assignments 

            App.once('CompileManifestForWeeksAssignments:go', function () {
                // Figure out our week range
                if (!weekOf) {
                    // Last Sunday
                    weekOf = moment().subtract('days', (moment().format('d'))).format("YYYY-MM-DD")
                }
                assignments.startDate = weekOf
                assignments.endDate = moment(weekOf).add('days', 7).format('YYYY-MM-DD')
                assignments.fetch({
                    success: function () {
                        App.trigger('CompileManifestForWeeksAssignments:assignmentsReady')
                    }
                })
            })


            //
            // Step 2
            //
            // Look at the Assignments and create Resource models from the resourceIds, 
            // then add those Resource Models to Resources Collection

            App.once('CompileManifestForWeeksAssignments:assignmentsReady', function () {
                assignments.each(function (assignment) {
                    var resource = new App.Models.Resource()
                    resource.id = assignment.get('resourceId')
                    resources.add(resource)
                })
                App.trigger('CompileManifestForWeeksAssignments:readyToFetchResources')
            })


            //
            // Step 3
            //
            // We now have a bunch of empty Resource Models in resources Collection but they have IDs.
            // Fetch each of those models, count our progress, and when finished trigger that we are done.

            App.on('CompileManifestForWeeksAssignments:readyToFetchResources', function () {
                var count = 0
                resources.on('CompileManifestForWeeksAssignments:fetchedResource', function () {
                    count++
                    if (count == resources.models.length) {
                        App.trigger('CompileManifestForWeeksAssignments:readyToBundleResources')
                    }
                })
                resources.each(function (resource) {
                    resource.fetch({
                        success: function () {
                            resources.trigger('CompileManifestForWeeksAssignments:fetchedResource')
                        }
                    })
                })
            })


            //
            // Step 4
            //
            // Now that resources has fetched Models, we can bundle them

            App.on('CompileManifestForWeeksAssignments:readyToBundleResources', function () {
                resources.each(function (resource) {
                    bundles.resources[resource.get('_id')] = resource.toJSON()
                })
                App.trigger('CompileManifestForWeeksAssignments:readyToCompileApps')
            })


            //
            // Step 5
            //
            // Now that resources is bundled, fetch and bundle apps

            App.once('CompileManifestForWeeksAssignments:readyToCompileApps', function () {
                apps.fetch({
                    success: function () {
                        apps.each(function (app) {
                            bundles.apps[app.get('_id')] = app.toJSON()
                        })
                        App.trigger('CompileManifestForWeeksAssignments:readyToCompileBundle')
                    }
                })

            })


            //
            // Step 6
            //
            // Our bundles are ready, send to the compiler

            App.once('CompileManifestForWeeksAssignments:readyToCompileBundle', function () {
                // Listen for when compiling the manifest has finished
                App.once('compileManifest:done', function () {
                    App.trigger('CompileManifestForWeeksAssignments:done')
                })
                App.compileManifest(bundles, targetDocURL)
            })


            //
            // Step 7
            //
            // Our compiler is now done, navigate to another page

            App.once('CompileManifestForWeeksAssignments:done', function () {
                Backbone.history.navigate('courses', {
                    trigger: true
                })
            })


            //
            // All events have been binded. Go!
            //
            App.trigger('CompileManifestForWeeksAssignments:go')

        },
        ViewPublication:function(){
        
			App.startActivityIndicator()
			var publicationCollection = new App.Collections.Publication()
			publicationCollection.getlast=true
			publicationCollection.fetch(
			{
				async: false
			})
			var publication = new App.Views.Publication()
			publication.render()
			App.$el.children('.body').html(publication.el)
			var publicationtable=new App.Views.PublicationTable({ collection:publicationCollection })
			publicationtable.render()
			App.$el.children('.body').append(publicationtable.el)
			
			App.stopActivityIndicator()
	        },
	    PublicationDetails: function (publicationId)
		{

			var publication = new App.Views.Publication()
			publication.render()
			App.$el.children('.body').html(publication.el)
			var publicationObject = new App.Models.Publication(
			{
				_id: publicationId
			})
			publicationObject.recPub=true
			publicationObject.fetch(
			{
				async: false
			})
			var coll = Array()
			var publicationIds=Array()
			var resources = publicationObject.get('resources')
			publicationIds.push(publicationId)
			var myJsonString = JSON.stringify(resources);
			var jSonId=JSON.stringify(publicationIds)
			App.$el.children('.body').append('<div style="margin-top:10px"><h6 style="float:left;">Issue No.' + publicationObject.get('IssueNo') + '</h6></div>')
			var i = 0
			_.each(resources, function ()
			{
				var resource = new App.Models.Resource(
				{
					_id: (resources[i])
				})
				resource.pubResource=true
				resource.fetch(
				{
					success: function(response) {
              		coll.push(resource)
					
              		var data = response.toJSON()
           		}
					,async: false
				})
				i++
			})
			var publicationresTable = new App.Views.PublicationResourceTable(
			{
				collection: coll
			})
			publicationresTable.Id = publicationId
			publicationresTable.render()
			App.$el.children('.body').append(publicationresTable.el)
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

//    	      if(type=='nation')
//    	       {
//    	       	   nationURL= App.Server
//    	       	   nationName=cofigINJSON.rows[0].doc.name
//    	       }
//    	        else{
//    	     	   	nationURL=cofigINJSON.rows[0].doc.nationUrl
//    	        	nationName=cofigINJSON.rows[0].doc.nationName
//    	       }
    	    
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
        CompileManifest: function () {
            // The resources we'll need to inject into the manifest file
            var resources = new App.Collections.Resources()
            var apps = new App.Collections.Apps()

            // The URL of the device where we'll store transformed files
            var deviceURL = '/devices/_design/all'
            // The location of the default files we'll tranform
            var defaultManifestURL = '/apps/_design/bell/manifest.default.appcache'
            var defaultUpdateURL = '/apps/_design/bell/update.default.html'
            // URLs to save transformed files to      
            var transformedManifestURL = deviceURL + '/manifest.appcache'
            var transformedUpdateURL = deviceURL + '/update.html'
            // The string to find in the default manifest file that we'll replace with Resources
            var find = '{replace me}'
            var replace = '# Compiled at ' + new Date().getTime() + '\n'

            // Compile the new manifest file and save it to devices/all
            resources.on('sync', function () {
                _.each(resources.models, function (resource) {
                    replace += encodeURI('/resources/' + resource.id) + '\n'
                    if (resource.get('kind') == 'Resource' && resource.get('_attachments')) {
                        _.each(resource.get('_attachments'), function (value, key, list) {
                            replace += encodeURI('/resources/' + resource.id + '/' + key) + '\n'
                        })
                    }
                })
                App.trigger('compile:resourceListReady')
            }) //????????

            App.once('compile:resourceListReady', function () {
                apps.once('sync', function () {
                    _.each(apps.models, function (app) {
                        _.each(app.get('_attachments'), function (value, key, list) {
                            replace += encodeURI('/apps/' + app.id + '/' + key) + '\n'
                        })
                    })
                    App.trigger('compile:appsListReady')
                })
                apps.fetch()
            })

            App.once('compile:appsListReady', function () {
                $.get(defaultManifestURL, function (defaultManifest) {
                    var transformedManifest = defaultManifest.replace(find, replace)
                    $.getJSON(deviceURL, function (deviceDoc) {
                        var xhr = new XMLHttpRequest()
                        xhr.open('PUT', transformedManifestURL + '?rev=' + deviceDoc._rev, true)
                        xhr.onload = function (response) {
                            App.trigger('compile:done')
                        }
                        xhr.setRequestHeader("Content-type", "text/cache-manifest");
                        xhr.send(new Blob([transformedManifest], {
                            type: 'text/plain'
                        }))
                    })
                })
            })

            // Save the update.html file to devices/all
            App.once('compile:done', function () {
                $.get(defaultUpdateURL, function (defaultUpdateHTML) {
                    // We're not transforming the default yet
                    transformedUpdateHTML = defaultUpdateHTML
                    $.getJSON(deviceURL, function (deviceDoc) {
                        var xhr = new XMLHttpRequest()
                        xhr.open('PUT', transformedUpdateURL + '?rev=' + deviceDoc._rev, true)
                        xhr.onload = function (response) {
                            App.$el.children('.body').html('<a class="btn" href="' + transformedUpdateURL + '">Resources compiled. Click here to update your device.</a>')
                        }
                        xhr.setRequestHeader("Content-type", "text/html");
                        xhr.send(new Blob([transformedUpdateHTML], {
                            type: 'text/plain'
                        }))
                    })
                })
            })

            // Start the process
            resources.fetch()
        }

    }))

})
