$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      ''                            : '',
      'landingPage'                 : 'LandingScreen',
      'becomemember'                :  'BecomeMemberForm',
      'login'                       : 'MemberLogin',
      'logout'                      : 'MemberLogout',
      'resources'                   : 'Resources',
      'resource/add'                : 'ResourceForm',
      'resource/edit/:resourceId'   : 'ResourceForm',
      'resource/feedback/:resourceId'      : 'ResourceFeedback',
      'resource/invite/:resourceId/:name/:kind'      : 'ResourceInvitation',
      'resource/feedback/add/:resourceId'  : 'FeedbackForm',
      'courses'                       : 'Groups',
      'course/edit/:groupId'          : 'GroupForm',
      'course/default'                : 'Explore_Bell_Courses',
      'course/assign/:groupId'        : 'GroupAssign',
      'course/assignments/week-of/:groupId'   : 'GroupWeekOfAssignments',
      'course/manage/:groupId'   : 'ManageCourse',
       'addItemstoLevel/:lid/:rid/:title'    :  'AddItemsToLevel', 
      'level/add/:groupId/:levelId'       : 'AddLevel',
      'level/view/:levelId/:rid'       : 'ViewLevel',
      'course/assignments/week-of/:groupId/:weekOf'   : 'GroupWeekOfAssignments',
      'course/assignments/:groupId' : 'GroupAssignments',
      'course/add'                  : 'GroupForm',
      'members'                     : 'Members',
      'member/add'                  : 'MemberForm',
      'member/edit/:memberId'       : 'MemberForm',
      'compile/week'                : 'CompileManifestForWeeksAssignments',
      'compile'                     : 'CompileManifest',
      'search-bell'		    : 'SearchBell',
      'search-bell/:levelId/:rId'   : 'SearchBell',
      'search-result'		    :'SearchResult',
      'assign-to-level'	    :'AssignResourcetoLevel',
      'assign-to-shelf'		    :'AssignResourcetoShelf',
      'create-quiz/:lid/:rid/:title'				:'CreateQuiz',
      'demo-version'				:'DemoVersion',
      'savedesc/:lid'                : 'saveDescprition',
      'resource/atlevel/feedback/:rid/:levelid/:revid': 'LevelResourceFeedback',
      'search/courses' : 'SearchCourses',
      'assign-to-default-courses'	    :'AssignCoursestoExplore',
      
      
    },
    LandingScreen : function(){
      $('ul.nav').html($('#template-nav-log-in').html()).hide()
      App.$el.children('.body').html($('#template-LandingPage').html())
    },
    BecomeMemberForm : function() {
      var m = new App.Models.Member()
      var bform = new App.Views.BecomeMemberForm({model:m})
      bform.on('BecomeMemberForm:done', function() {
        Backbone.history.navigate('courses', {trigger: true})
      })
      bform.render()
      App.$el.children('.body').html('<h1>Become A Member</h1>')
      App.$el.children('.body').append (bform.el)
    },
    DemoScreen: function(){
      $('ul.nav').html($("#template-nav-logged-in").html())       
      var demo = new App.Views.Demo()
      App.$el.children('.body').html(demo.el)
      demo.render()
    },
    DemoVersion : function()
    {
    	$('ul.nav').html($("#template-nav-logged-in").html()).show()
    	 var demo = new App.Views.Demo()
	     App.$el.children('.body').html(demo.el)
	     demo.render()

    },
    MemberLogin: function() {
      // Prevent this Route from completing if Member is logged in.
      if($.cookie('Member._id')) {
        Backbone.history.navigate('courses', {trigger: true})
        return
      }
      var credentials = new App.Models.Credentials()
      var memberLoginForm = new App.Views.MemberLoginForm({model: credentials})
      memberLoginForm.once('success:login', function() {
       // $('ul.nav').html($("#template-nav-logged-in").html())
       // Backbone.history.navigate('courses', {trigger: true})
          Backbone.history.navigate('courses', {trigger: true})
      })
      memberLoginForm.render()
      //App.$el.children('.body').html('<h1>Member login</h1>')
      App.$el.children('.body').html(memberLoginForm.el)
      //Override the menu
     $('ul.nav').html($('#template-nav-log-in').html()).hide()
    },

    MemberLogout: function() {
      $.removeCookie('Member.login')
      $.removeCookie('Member._id')
      Backbone.history.navigate('landingPage', {trigger: true})
    },

    ResourceForm : function(resourceId) {
      var resource = (resourceId)
        ? new App.Models.Resource({_id: resourceId})
        : new App.Models.Resource()
      resource.on('processed', function() {
        Backbone.history.navigate('resources', {trigger: true})
      })
      var resourceFormView = new App.Views.ResourceForm({model: resource})
      App.$el.children('.body').html(resourceFormView.el)
      if(resource.id) {
        App.listenToOnce(resource, 'sync', function() {
          resourceFormView.render()
        })
        resource.fetch()
      }
      else {
        resourceFormView.render()
      }
    },

    Resources: function(database) {
      var resources = new App.Collections.Resources()
      resources.fetch({success: function() {
        var resourcesTableView = new App.Views.ResourcesTable({collection: resources})
        resourcesTableView.render()
        App.$el.children('.body').html('<h1>Resources</h1>')
        App.$el.children('.body').append(resourcesTableView.el)
      }})
    },

    ResourceFeedback: function(resourceId) {
      var resource = new App.Models.Resource()
      resource.id = resourceId
      resource.on('sync', function() {
        var resourceFeedback = new App.Collections.ResourceFeedback()
        resourceFeedback.resourceId = resourceId
        var feedbackTable = new App.Views.FeedbackTable({collection: resourceFeedback})
        resourceFeedback.on('sync', function() {
          feedbackTable.render()
          App.$el.children('.body').html('<h1>Feedback for "' + resource.get('title') + '"</h1>')
          App.$el.children('.body').append('<a class="btn" href="#resource/feedback/add/' + resourceId + '"><i class="icon-plus"></i> Add your feedback</a>')
          App.$el.children('.body').append(feedbackTable.el)
        })
        resourceFeedback.fetch()
      })
      resource.fetch()
    },
    
    FeedbackForm: function(resourceId) {
      var feedbackModel = new App.Models.Feedback({resourceId: resourceId, memberId: $.cookie('Member._id')})
      feedbackModel.on('sync', function() {
        Backbone.history.navigate('resource/feedback/' + resourceId, {trigger: true})
      })
      var feedbackForm = new App.Views.FeedbackForm({model: feedbackModel})
      var user_rating 
      feedbackForm.render()
     
      App.$el.children('.body').html('<h1>Add Feedback</h1>')
      App.$el.children('.body').append('<p style="font-size:15px;">&nbsp;&nbsp;<span style="font-size:50px;">.</span>Rating </p>')
      App.$el.children('.body').append('<div id="star" data-score="0"></div>')
      $('#star').raty()
       $("#star > img").click(function(){
          feedbackForm.setUserRating($(this).attr("alt"))
      });

      App.$el.children('.body').append(feedbackForm.el)
   },

  
    ResourceInvitation: function(resourceId,name,kind) {
      var inviteModel = new App.Models.InviFormModel()
      inviteModel.entityId = resourceId
      inviteModel.senderId =  $.cookie('Member._id')
      inviteModel.type = kind
      inviteModel.title = name
      console.log(inviteModel);
      var inviteForm = new App.Views.InvitationForm({model: inviteModel})
      inviteForm.render()
      App.$el.children('.body').html('<h1>Send Invitation</h1>')
      App.$el.children('.body').append(inviteForm.el)
    },

    Groups: function() {
      $('ul.nav').html($("#template-nav-logged-in").html()).show()
      $('#itemsinnavbar').html($("#template-nav-logged-in").html())
      groups = new App.Collections.Groups()
      groups.fetch({success: function() {
        groupsTable = new App.Views.GroupsTable({collection: groups})
        groupsTable.render()
        App.$el.children('.body').html('<h1>Courses</h1>')
        App.$el.children('.body').append(groupsTable.el)
      }})
    },

    Members: function() {
      members = new App.Collections.Members()
      members.fetch({success: function() {
        membersTable = new App.Views.MembersTable({collection: members})
        membersTable.render()
        App.$el.children('.body').html('<h1>Members</h1>')
        App.$el.children('.body').append(membersTable.el)
      }})
    },

    GroupForm : function(groupId) {
      this.modelForm('Group', 'Course', groupId, 'courses')
    },

    MemberForm: function(memberId) {
      this.modelForm('Member', 'Member', memberId, 'members')
    },

    modelForm : function(className, label, modelId, reroute) {
      // Set up
      var model = new App.Models[className]()
      var modelForm = new App.Views[className + 'Form']({model: model})

      // Bind form to the DOM
      if (modelId) {
        App.$el.children('.body').html('<h1>Edit this ' + label + '</h1>')
      }
      else {
        App.$el.children('.body').html('<h1>Add a ' + label + '</h1>')
      }
      App.$el.children('.body').append(modelForm.el)

      // Bind form events for when Group is ready
      model.once('Model:ready', function() {
        // when the users submits the form, the group will be processed
        modelForm.on(className + 'Form:done', function() {
          Backbone.history.navigate(reroute, {trigger: true})
        }) 
        // Set up the form
        modelForm.render()
      })

      // Set up the model for the form
      if (modelId) {
        model.id = modelId
        model.once('sync', function() {
          model.trigger('Model:ready')
        }) 
        model.fetch()
      }
      else {
        model.trigger('Model:ready')
      }
    },

    GroupAssign: function(groupId) {
      var assignResourcesToGroupTable = new App.Views.AssignResourcesToGroupTable()
      assignResourcesToGroupTable.groupId = groupId
      assignResourcesToGroupTable.render()
      App.$el.children('.body').html(assignResourcesToGroupTable.el)
    },

    GroupWeekOfAssignments: function(groupId, weekOf) {

      // Figure out our week range
      if(!weekOf) {
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
      table.resources.on('sync', function() {
        table.assignments.fetch()
      })
      table.assignments.on('sync', function() {
        table.group.fetch()
      })    
      table.group.on('sync', function() {
        table.render()
      })
      table.resources.fetch()
    },
     
    //New Requirement of Managing the course Level 
    
    ManageCourse : function(groupId){
      $('#itemsinnavbar').html($("#template-nav-logged-in").html())
      levels = new App.Collections.CourseLevels()
      levels.groupId = groupId
      
      
      levels.fetch({success: function() {
        levels.sort()
        lTable = new App.Views.LevelsTable({collection: levels})
        lTable.render()
        App.$el.children('.body').html('<h1>Course Steps</h1>')
        App.$el.children('.body').append('<button class="btn btn-success"  onclick = "document.location.href=\'#level/add/'+groupId+'/nolevel\'">Add Step</button>')
        App.$el.children('.body').append(lTable.el)
      }})
    },
    
    AddLevel : function(groupId,levelId){
      $('#itemsinnavbar').html($("#template-nav-logged-in").html())
       var Cstep = new App.Models.CourseStep()
       var lForm = new App.Views.LevelForm({model: Cstep})
       Cstep.set({courseId : groupId})
       if (levelId == "nolevel") {
     
          App.$el.children('.body').html('<h1>New Step</h1>')
          lForm.edit = false
          lForm.previousStep = 0
          lForm.render()
          App.$el.children('.body').append(lForm.el)
      }
      else{
          Cstep.set({"_id":levelId})
          Cstep.once('sync', function() {
          App.$el.children('.body').html('<h1>Edit Step</h1>')
          lForm.edit = true
          lForm.ques = Cstep.get("questions")
          lForm.ans = Cstep.get("answers")
          lForm.opt = Cstep.get("qoptions")
          lForm.res = Cstep.get("resourceId")
          lForm.rest= Cstep.get("resourceTitles")
          lForm.previousStep = Cstep.get("step")
          lForm.render()
          App.$el.children('.body').append(lForm.el)
        }) 
        Cstep.fetch()
      }
      
    },
    AddItemsToLevel : function(lid,rid,title){
           $('#itemsinnavbar').html($("#template-nav-logged-in").html())
           App.$el.children('.body').html('<h1>Mange | '+title+'</h1>')
           App.$el.children('.body').append('<button class="btn btn-info"  onclick = "document.location.href=\'#search-bell/'+lid+'/'+rid+'\'">Add Resources</button>')
           App.$el.children('.body').append('<button class="btn btn-info"  onclick = "document.location.href=\'#create-quiz/'+lid+'/'+rid+'\'">Create Quiz</button>')
    },
     CreateQuiz: function(lid,rid,title){
         var levelInfo = new App.Models.CourseStep({"_id":lid})
         levelInfo.fetch({success: function() {
         var quiz = new App.Views.QuizView()
         quiz.levelId = lid
         quiz.revId = rid
         quiz.ltitle = title
         if(levelInfo.get("questions")){
           App.$el.children('.body').html('<h3>Edit Quiz for |'+title+'</h3>')
            quiz.quizQuestions = levelInfo.get("questions")
            quiz.questionOptions = levelInfo.get("qoptions")
            quiz.answers = levelInfo.get("answers")
            
         }
         App.$el.children('.body').html(quiz.el)
         quiz.render()
         if(levelInfo.get("questions")){
           quiz.displayQuestionInView(0)
         }
     }})
     },
     saveDescprition : function(lid){
       var level= new App.Models.CourseStep({"_id":lid})
       var that = this
       level.fetch({success: function() {
       level.set("description",$('#LevelDescription').val())
        var that=this
        level.save()
        level.on('sync',function(){
            document.location.href='#level/view/'+lid+'/'+level.get("rev");
        })
       }})
     },
     ViewLevel: function(lid,rid){
         var levelInfo = new App.Models.CourseStep({"_id":lid,"_rev":rid})
         var that = this
         levelInfo.fetch({success: function() {
            var levelDetails = new App.Views.LevelDetail({model : levelInfo})
             levelDetails.render()
             App.$el.children('.body').html('<h3>Step Details |'+levelInfo.get("title")+'</h3>')
             App.$el.children('.body').append('<a class="btn btn-success"  target="_blank" href=\'#level/add/'+levelInfo.get("courseId")+'/'+lid+'\'">Edit Step</a>&nbsp;&nbsp;')
             App.$el.children('.body').append("</BR></BR><B>Description</B></BR><TextArea id='LevelDescription' rows='5' cols='100' style='width:98%;'>"+levelInfo.get("description")+"</TextArea></BR>")
	     App.$el.children('.body').append("<button class='btn btn-success' style='float:right;' onclick='document.location.href=\"#savedesc/"+lid+"\"'>Save</button></BR></BR>")
             App.$el.children('.body').append('<B>Resources</B><a class="btn btn-success"  style="float:right;" target="_blank" href=\'#search-bell/'+lid+'/'+rid+'\'">Add</a>')
             App.$el.children('.body').append(levelDetails.el)
             App.$el.children('.body').append('</BR>')
             if(levelInfo.get("questions") == null){
                App.$el.children('.body').append('<a class="btn btn-success"  style="float:right;" target="_blank" href=\'#create-quiz/'+levelInfo.get("_id")+'/'+levelInfo.get("_rev")+'/'+levelInfo.get("title")+'\'">Create Quiz</a>&nbsp;&nbsp;')
                //Backbone.history.navigate('create-quiz/'+levelInfo.get("_id")+'/'+levelInfo.get("_rev")+'/'+levelInfo.get("title"), {trigger: true})
             }else{
               App.$el.children('.body').append('<B>'+levelInfo.get("title")+' - Quiz</B><a class="btn btn-primary"  style="float:right;" target="_blank" href=\'#create-quiz/'+levelInfo.get("_id")+'/'+levelInfo.get("_rev")+'/'+levelInfo.get("title")+'\'">Edit Quiz</a>&nbsp;&nbsp;')
             }
         }})
     },
     
    
     LevelResourceFeedback: function(rid,levelid,revid) {
      var feedbackModel = new App.Models.Feedback({resourceId: rid, memberId: $.cookie('Member._id')})
      feedbackModel.on('sync', function() {
        Backbone.history.navigate('level/view/'+levelid+'/'+revid, {trigger: true})
      })
      var feedbackForm = new App.Views.FeedbackForm({model: feedbackModel})
      var user_rating 
      feedbackForm.render()
     
      App.$el.children('.body').html('<h1>Add Feedback</h1>')
      App.$el.children('.body').append('<p style="font-size:15px;">&nbsp;&nbsp;<span style="font-size:50px;">.</span>Rating </p>')
      App.$el.children('.body').append('<div id="star" data-score="0"></div>')
      $('#star').raty()
       $("#star > img").click(function(){
          feedbackForm.setUserRating($(this).attr("alt"))
      });

      App.$el.children('.body').append(feedbackForm.el)
   },

     //***************************************Explore Bell Setup***********************************************************
     
     Explore_Bell_Courses : function(){
         var dfcourses = new App.Models.ExploreBell({"_id":"set_up"})
         var that = this
         dfcourses.fetch({success: function() {
              var clist = new App.Views.ListDefaultCourses({model : dfcourses})
              clist.render()
              App.$el.children('.body').html('<h3>Explore Bell | Default Courses</h3>')
              App.$el.children('.body').append("<a class='btn btn-success'  href='#search/courses'>Add Courses</a>")
              App.$el.children('.body').append(clist.el)
              
         }})
     },
    AssignCoursestoExplore : function(){
     
 	 var clist = new App.Models.ExploreBell({"_id":"set_up"})
	 clist.fetch({async:false})
         console.log(clist)
         var that = this
         oldIds =  clist.get("courseIds")
         oldTitles = clist.get("courseTitles")
         console.log(oldIds)
         
        $("input[name='result']").each( function () {
          if ($(this).is(":checked"))
	      {
  			var rId = $(this).val();
  	                if(oldIds.indexOf(rId) == -1){
                          rtitle.push($(this).attr('rTitle'))
                          rids.push(rId)
                        }
              }
	    });
        
         clist.set("courseIds",oldIds.concat(rids))
         clist.set("courseTitles",oldTitles.concat(rtitle))
	clist.save()
	 clist.on('sync',function(){
	      alert("Selected Courses are set as default")
	      Backbone.history.navigate('course/default', {trigger: true})
         })
      
    },
    // Search Module Router Version 1.0.0
    
    AssignResourcetoShelf : function()
    {
    	if(typeof grpId === 'undefined'){
 
   			document.location.href='#courses'
   			return
 		}
    	// Interating through all the selected courses
        $("input[name='result']").each( function () {
	  if ($(this).is(":checked"))
	    {
  	      var rId = $(this).val();
  	      var title = $(this).attr('rTitle')
  	      var shelfItem=new App.Models.Shelf()
              shelfItem.set('memberId',$.cookie('Member._id'))
              shelfItem.set('resourceId',rId)
              shelfItem.set('resourceTitle',title)
              //Adding the Selected Resource to the Shelf Hash(Dictionary)
              shelfItem.save(null, {
            	  success: function(model,response,options) {}
              });
	    }
	});
    	document.location.href='#course/assignments/week-of/' + grpId
    },
    
    
    AssignResourcetoLevel : function()
    {
    	
        if(typeof grpId === 'undefined'){
   	    document.location.href='#courses'
        }
 		//var rids = new Array()
        //var rtitle = new Array()
         var cstep = new App.Models.CourseStep({"_id":grpId,"_rev":levelrevId})
	 cstep.fetch({async:false})
         var oldIds =  cstep.get("resourceId")
         var oldTitles = cstep.get("resourceTitles")
         
        $("input[name='result']").each( function () {
          if ($(this).is(":checked"))
	      {
  			var rId = $(this).val();
  	                if(oldIds.indexOf(rId) == -1){
                          rtitle.push($(this).attr('rTitle'))
                          rids.push(rId)
                        }
              }
	    });
        
         cstep.set("resourceId",oldIds.concat(rids))
         cstep.set("resourceTitles",oldTitles.concat(rtitle))
	 console.log(cstep)
	 cstep.save()
	 cstep.on('sync',function(){
	      alert("Your Resources have been updated successfully")
	      Backbone.history.navigate('course/manage/'+cstep.get("courseId"), {trigger: true})
         })
    	 
    },
      
  SearchResult : function(text){
        
        if(typeof grpId === 'undefined'){
   			document.location.href='#courses'
 		}
        skipStack.push(skip)
        if(text){
            searchText = text
        }
        else{
            searchText = $("#searchText").val()
         }
		
		$("input[name='result']").each( function () {
          if ($(this).is(":checked"))
	      {
  			var rId = $(this).val();
  	        rtitle.push($(this).attr('rTitle'))
            rids.push(rId)
	      }
	    });
         $("input[name='tag']").each( function () {
	 		if ($(this).is(":checked")){
	     		tagFilter.push($(this).val());
	 		}
     	 })
     	 $("input[name='subject']").each( function () {
	 		if ($(this).is(":checked")){
	     		subjectFilter.push($(this).val());
	 		}
     	 })
     	
     	if(searchText != "" || (tagFilter && tagFilter.length>0) || (subjectFilter && subjectFilter.length>0))
	 	{
	        $('ul.nav').html($("#template-nav-logged-in").html())
	        var search = new App.Views.Search()
	        search.tagFilter = tagFilter
	        search.subjectFilter = subjectFilter
	        App.$el.children('.body').html(search.el)
	        search.render()
	        $("#searchText2").val(searchText)
	        $( "#srch" ).show()
	        $( ".row" ).hide()
	        $( ".search-bottom-nav" ).show()
	        $(".search-result-header").show()
	        $("#selectAllButton").show()
	 	}
   },
    SearchCoursesInDb : function(text){
       
        skipStack.push(skip)
        if(text){
            searchText = text
        }
        else{
            searchText = $("#searchText").val()
         }
       rtitle.length = 0
       rids.length = 0
        if(searchText != "")
	 	{
                    $('ul.nav').html($("#template-nav-logged-in").html())
                    var search = new App.Views.SearchCourses()
                    App.$el.children('.body').html(search.el)
                    search.render()
                    $("#searchText2").val(searchText)
                    $( "#srch" ).show()
                    $( ".row" ).hide()
                    $( ".search-bottom-nav" ).show()
                    $(".search-result-header").show()
                    $("#selectAllButton").show()
	 	}
   },
  
  
  SearchBell: function(levelId,rid,resourceIds) {
  
  	
      var levelInfo = new App.Models.CourseStep({"_id":levelId})
      levelInfo.fetch({success: function() {
      if(typeof levelId === 'undefined'){
   		document.location.href='#courses'
       }
       
       if(typeof rid === 'undefined'){
   		document.location.href='#courses'
       }
      grpId = levelId
      levelrevId = rid
      
      tagFilter.length = 0
       subjectFilter.length = 0
       rtitle.length = 0
       rids.length = 0
      
      $('ul.nav').html($("#template-nav-logged-in").html())
      var search = new App.Views.Search()
      search.resourceids = levelInfo.get("resourceId")
      App.$el.children('.body').html(search.el)
      search.render()
      $( "#srch" ).hide()
      $( ".search-bottom-nav" ).hide()
      $(".search-result-header").hide()
      $("#selectAllButton").hide()
      showSubjectCheckBoxes()
      }})
  },
 SearchCourses: function() {
      var levelInfo = new App.Models.ExploreBell({"_id":"set_up"})
      levelInfo.fetch({success: function() {
      $('ul.nav').html($("#template-nav-logged-in").html())
      var search = new App.Views.SearchCourses()
      App.$el.children('.body').html(search.el)
      search.render()
      $( "#srch" ).hide()
      $( ".search-bottom-nav" ).hide()
      $(".search-result-header").hide()
      $("#selectAllButton").hide()
      
      }})
  },
    CompileManifestForWeeksAssignments: function(weekOf) {

      // 
      // Setup
      // 

      // We're going to get the Assigned Resources docs and App docs into this bundles object to 
      // to feed to App.compileManifest
      bundles = {
        "apps" : {},
        "resources" : {}
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

      App.once('CompileManifestForWeeksAssignments:go', function() {
        // Figure out our week range
        if(!weekOf) {
          // Last Sunday
          weekOf = moment().subtract('days', (moment().format('d'))).format("YYYY-MM-DD")
        }
        assignments.startDate = weekOf
        assignments.endDate = moment(weekOf).add('days', 7).format('YYYY-MM-DD')
        assignments.fetch({success: function() {
          App.trigger('CompileManifestForWeeksAssignments:assignmentsReady')
        }})
      })


      //
      // Step 2
      //
      // Look at the Assignments and create Resource models from the resourceIds, 
      // then add those Resource Models to Resources Collection

      App.once('CompileManifestForWeeksAssignments:assignmentsReady', function() {
        assignments.each(function(assignment) {
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

      App.on('CompileManifestForWeeksAssignments:readyToFetchResources', function() {
        var count = 0
        resources.on('CompileManifestForWeeksAssignments:fetchedResource', function() {
          count++
          if(count == resources.models.length) {
            App.trigger('CompileManifestForWeeksAssignments:readyToBundleResources')
          }
        })
        resources.each(function(resource) {
          resource.fetch({success: function() {
            resources.trigger('CompileManifestForWeeksAssignments:fetchedResource')
          }})
        })
      })


      //
      // Step 4
      //
      // Now that resources has fetched Models, we can bundle them

      App.on('CompileManifestForWeeksAssignments:readyToBundleResources', function() {
        resources.each(function(resource) {
          bundles.resources[resource.get('_id')] = resource.toJSON()
        })
        App.trigger('CompileManifestForWeeksAssignments:readyToCompileApps')
      })


      //
      // Step 5
      //
      // Now that resources is bundled, fetch and bundle apps

      App.once('CompileManifestForWeeksAssignments:readyToCompileApps', function() {
        apps.fetch({success: function() {
          apps.each(function(app) {
            bundles.apps[app.get('_id')] = app.toJSON()
          })
          App.trigger('CompileManifestForWeeksAssignments:readyToCompileBundle')
        }})
        
      })


      //
      // Step 6
      //
      // Our bundles are ready, send to the compiler

      App.once('CompileManifestForWeeksAssignments:readyToCompileBundle', function() {
        // Listen for when compiling the manifest has finished
        App.once('compileManifest:done', function() {
          App.trigger('CompileManifestForWeeksAssignments:done')
        })
        App.compileManifest(bundles, targetDocURL)
      })


      //
      // Step 7
      //
      // Our compiler is now done, navigate to another page

      App.once('CompileManifestForWeeksAssignments:done', function() {
        Backbone.history.navigate('courses', {trigger: true})
      })


      //
      // All events have been binded. Go!
      //
      App.trigger('CompileManifestForWeeksAssignments:go')

    },

    CompileManifest: function() {
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
      resources.on('sync', function() {
        _.each(resources.models, function(resource) {
          replace += encodeURI('/resources/' + resource.id) + '\n'
          if(resource.get('kind') == 'Resource' && resource.get('_attachments')) {
            _.each(resource.get('_attachments'), function(value, key, list) {
              replace += encodeURI('/resources/' + resource.id + '/' + key) + '\n'
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
          App.trigger('compile:appsListReady')
        })
        apps.fetch()
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
