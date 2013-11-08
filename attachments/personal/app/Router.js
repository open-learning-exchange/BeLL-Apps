$(function() {

  App.Router = new (Backbone.Router.extend({

    routes: {
      ''                            	   : 'Dashboard', 
      'dashboard'                   	   : 'Dashboard',
      'login'                       	   : 'MemberLogin',
      'logout'                      	   : 'MemberLogout',
      'courses'                     	   : 'Groups',
      'my-courses'                  	   : 'MemberGroups',
      'course/edit/:groupId'        	   : 'GroupForm',
      'course/assign/:groupId'       	   : 'GroupAssignments', // @todo delete and change refs to it
      'course/assignments/:groupId' 	   : 'GroupAssignments',
      'course/link/:groupId'         	   : 'GroupLink',
      'update-assignments'                 : 'UpdateAssignments',
      'resource/feedback/add/:resourceId'  : 'FeedbackForm',
      'newsfeed'                   	       : 'NewsFeed',
      'newsfeed/:authorTitle'       	   : 'Article_List',
      'search-bell'					 	   : 'SearchBell',
      'search-result'				   	   :'SearchResult',
      'member/add'                  	   : 'MemberForm',
	  'member/edit/:mid'                   : 'MemberForm',
	  'calendar'                  	       : 'calendar',
	  'calendar/:eid'                  	   : 'calendaar',
	  'addEvent'						   : 'addEvent',
      'addResource/:rid/:title'            : 'AddResourceToShelf',
      '*nomatch'  						   : 'errornotfound'
    },


errornotfound: function(){
      alert("no route matching")
    },
addEvent: function(){
	 var model = new App.Models.Calendar()
      var modelForm = new App.Views.CalendarForm({model: model})
	App.$el.children('.body').html('<h3 class="signup-heading">Add Event</h3>')
	App.$el.children('.body').append(modelForm.el)
	    modelForm.render()
},
calendaar: function(eventId){
	App.$el.children('.body').html('<h5>Event Details</h5>')
	var cmodel = new App.Models.Calendar({_id : eventId})
	cmodel.fetch({async:false})
	console.log(cmodel)
	App.$el.children('.body').append('<br/><b>Title: </b>'+cmodel.attributes.title)
	App.$el.children('.body').append('<br/><b>Description: </b>'+cmodel.attributes.description)
	App.$el.children('.body').append('<br/><b>Starting from: </b>'+new Date(cmodel.attributes.start))
	App.$el.children('.body').append('<br/><b>Ending at: </b>'+new Date(cmodel.attributes.end))
},
calendar: function(){
	App.$el.children('.body').html("<div id='calendar'><div id='addEvent' class='btn btn-bg btn-success' onclick =\"document.location.href='#addEvent'\">Add Event</div></div>")

	$(document).ready(function() {

		 
		 var temp2 = []
		 var allEvents=new App.Collections.Calendars()
		 allEvents.fetch({async:false})
		 allEvents.each(function(evnt){
			var temp=new Object()
			temp.title=evnt.attributes.title
			temp.start=evnt.attributes.start
			temp.end=evnt.attributes.end
			temp.url="calendar/"+evnt.id
			temp.allDay=false
			console.log(evnt)
			temp2.push(temp)	
			});
		var calendar = $('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
		selectable: true,
		eventClick: function(evnt) {
			Backbone.history.navigate(evnt.url,{trigger :true})
			return false  
		 },	
		events: temp2,
		});

	});
},
 MemberForm: function(memberId) {
      this.modelForm('Member', 'Member', memberId, 'login')
    },

    modelForm : function(className, label, modelId, reroute) {
      // Set up
      var model = new App.Models[className]()
      var modelForm = new App.Views[className + 'Form']({model: model})

      // Bind form to the DOM
      if (modelId) {
        App.$el.children('.body').html('<h3>Update Profile </h3>')
      }
      else {
        App.$el.children('.body').html('<h3 class="signup-heading">Add a ' + label + '</h3>')
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
 $('#olelogo').remove()
      })

      // Set up the model for the form
      if (modelId) {
        model.id = modelId
        model.once('sync', function() {
          model.trigger('Model:ready')
        }) 
        model.fetch({async:false})
    }
      else {
        model.trigger('Model:ready')
      }
    },


    SearchResult : function(text){
      skipStack.push(skip)
      if(text){
          searchText = text
      }
      else{
        searchText = $("#searchText").val()
      }
      $('ul.nav').html($("#template-nav-logged-in").html())
      var search = new App.Views.Search()
      App.$el.children('.body').html(search.el)
      search.render()
      $("#searchText").val(searchText)
      $('#olelogo').remove()
  },
  
  SearchBell: function() {
      $('ul.nav').html($("#template-nav-logged-in").html())
      var search = new App.Views.Search()
      App.$el.children('.body').html(search.el)
      search.render()
      $('#olelogo').remove()
    },
    Dashboard: function() {
      $('ul.nav').html($("#template-nav-logged-in").html())
      var dashboard = new App.Views.Dashboard()
      App.$el.children('.body').html(dashboard.el)
      dashboard.render()
      $('#olelogo').remove()
    },

    MemberLogin: function() {
      // Prevent this Route from completing if Member is logged in.
      if($.cookie('Member._id')) {
        Backbone.history.navigate('dashboard', {trigger: true})
        return
      }
      var credentials = new App.Models.Credentials()
      var memberLoginForm = new App.Views.MemberLoginForm({model: credentials})
      memberLoginForm.once('success:login', function() {
        $('ul.nav').html($("#template-nav-logged-in").html())
        $('#logo').html($("#template-logoimg").html())
        Backbone.history.navigate('dashboard', {trigger: true})
      })
      memberLoginForm.render()
      App.$el.children('.body').html('<h1 class="login-heading">Member login</h1>')
      App.$el.children('.body').append(memberLoginForm.el)
      // Override the menu
      $('ul.nav').html($('#template-nav-log-in').html())
       $('#logo').html($("#template-logoimg").html())
    },

    MemberLogout: function() {
      $.removeCookie('Member.login')
      $.removeCookie('Member._id')
      Backbone.history.navigate('login', {trigger: true})
    },

    Groups: function() {
      groups = new App.Collections.Groups()
      groups.fetch({success: function() {
        $('#olelogo').remove();
        groupsTable = new App.Views.GroupsTable({collection: groups})
        groupsTable.render()

        App.$el.children('.body').html('<h1 class="teams_table_heading"></h1>')
        App.$el.children('.body').append('<table class=table-striped><tr><th><h6>Team Names</h6></th><th><h6>Assignments</h6></th></tr></table>')
        App.$el.children('.body').append(groupsTable.el)
      }})
    },

    MemberGroups: function() {
      groups = new App.Collections.MemberGroups()
      groups.memberId = $.cookie('Member._id')
      groups.fetch({success: function() {
        $('#olelogo').remove();
        groupsTable = new App.Views.GroupsTable({collection: groups})
        groupsTable.render()
        App.$el.children('.body').html('<h1>My Courses</h1>')
        App.$el.children('.body').append(groupsTable.el)
      }})
    },

    GroupAssignments: function(groupId) {

      var group = new App.Models.Group()
      group.id = groupId
      group.once('sync', function() {
        var groupAssignments = new App.Collections.GroupAssignments({group: group})
        groupAssignments.groupId = groupId
        var groupAssignmentsTable = new App.Views.GroupAssignmentsTable({collection: groupAssignments})
        App.$el.children('.body').html(groupAssignmentsTable.el)
        groupAssignmentsTable.vars.groupName = group.get('name')
        groupAssignmentsTable.render()
        groupAssignments.fetch()
      })
      group.fetch()
    },
    
    NewsFeed : function(){
     
     var resources = new App.Collections.NewsResources()
     resources.fetch({success: function() {
         var resourcesTableView = new App.Views.ResourcesTable({collection: resources})
         resourcesTableView.render()
         App.$el.children('.body').html(resourcesTableView.el)
      }}) 
    },
    
    /*
     * Article_List fetches the Article againt AuthorTitle and Displays
     */
    
    Article_List : function(authorTitle){
         var resources = new App.Collections.NewsResources()
         resources.fetch({success: function() {
                   var articleTableView = new App.Views.ArticleTable({collection: resources})
                   articleTableView.setAuthorName(authorTitle)
                   articleTableView.render()  
                   App.$el.children('.body').html(articleTableView.el)
         }})
    },
    AddResourceToShelf : function (rid,title){
            var shelfItem=new App.Models.Shelf()
            shelfItem.set('memberId',$.cookie('Member._id'))
            shelfItem.set('resourceId',rid)
            shelfItem.set('resourceTitle',title)
            App.ShelfItems[rid] = [title]
            shelfItem.save()
            skip = skipStack.pop()
            App.Router.SearchResult(searchText)
    },
    
    /*
     * Syncing pages
     * 
     * @todo At the moment the syncing process replicates all databases from the server but 
     * it should be selective according to the "linked group's assignments".  Linking more
     * than one group is having some issues and the UpdateAssignments route will need to 
     * be made much more intelligent.  
     */

    GroupLink: function(groupId) {
      App.once('done:pull_doc_ids', function(){
        Backbone.history.navigate('dashboard', {trigger: true})
      })
      App.pull_doc_ids([groupId], window.location.origin + '/groups', 'groups')
    },

    // This route may no longer be needed so long as we are running the replication on
    // an interval from App.start()

    UpdateAssignments: function() {
     $('#olelogo').remove();
      App.$el.children('.body').html('<div class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
      App.$el.children('.body').append('<h3 class="assignments">Checking for new assignments... </h3>')
      PouchDB.replicate(window.location.origin + '/assignments', 'assignments', {
        complete: function(){
          $('.assignments').append(' Done.')
          App.$el.children('.body').append('<h3 class="courses">Checking for new courses... </h3>')
          PouchDB.replicate(window.location.origin + '/groups', 'groups', {
            complete: function(){
              $('.courses').append(' Done.')
              App.$el.children('.body').append('<h3 class="members">Checking for new members... </h3>')
              PouchDB.replicate(window.location.origin + '/members', 'members', {
                complete: function(){
                  $('.members').append(' Done.')
                  App.$el.children('.body').append('<h3 class="feedback">Sending feedback... </h3>')
                  PouchDB.replicate('feedback', window.location.origin + '/feedback', {
                    complete: function(){
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

    FeedbackForm: function(resourceId) {
      var feedbackModel = new App.Models.Feedback({resourceId: resourceId, memberId: $.cookie('Member._id')})
      feedbackModel.on('sync', function() {
        Backbone.history.navigate('dashboard', {trigger: true})
      })
      var feedbackForm = new App.Views.FeedbackForm({model: feedbackModel})
      feedbackForm.render()
      App.$el.children('.body').html('<h1>Add Feedback</h1>')
      App.$el.children('.body').append(feedbackForm.el)
    }

  }))

})
