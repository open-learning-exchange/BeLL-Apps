$(function() {

  App.Router = new (Backbone.Router.extend({

    routes: {
      ''                           : 'Dashboard', 
      'dashboard'                  : 'Dashboard',
      'login'                      : 'MemberLogin',
      'logout'                     : 'MemberLogout',
      'courses'                      : 'Groups',
      'my-courses'                      : 'MemberGroups',
      'course/edit/:groupId'         : 'GroupForm',
      'course/assign/:groupId'       : 'GroupAssignments', // @todo delete and change refs to it
      'course/assignments/:groupId'  : 'GroupAssignments',
      'course/link/:groupId'         : 'GroupLink',
      'update-assignments'         : 'UpdateAssignments',
      'resource/feedback/add/:resourceId'  : 'FeedbackForm',
      'newsfeed'                      : 'NewsFeed',
      'newsfeed/:authorTitle'         : 'Article_List'
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
         App.$el.children('.body').html('<h3>News Authors</h3>')
         App.$el.children('.body').append(resourcesTableView.el)
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
                   App.$el.children('.body').html('<h3>Article List</h3>')
                   App.$el.children('.body').append(articleTableView.el)
         }})
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
