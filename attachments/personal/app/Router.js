$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      ''                           : '', 
      'login'                      : 'MemberLogin',
      'logout'                      : 'MemberLogout',
      'teams'                      : 'Groups',
      'team/edit/:groupId'         : 'GroupForm',
      'team/assign/:groupId'       : 'GroupAssignments', // @todo delete and change refs to it
      'team/assignments/:groupId'  : 'GroupAssignments',
      'team/link/:groupId'         : 'GroupLink',
      'update-assignments'         : 'UpdateAssignments'
    },

    MemberLogin: function() {
      var credentials = new App.Models.Credentials()
      var memberLoginForm = new App.Views.MemberLoginForm({model: credentials})
      memberLoginForm.once('success:login', function() {
        $('ul.nav').html('<li> <a href="#teams"><i class="icon-flag icon-white"></i> My Teams</a></li> <li> <a href="../lms/index.html#resources"><i class="icon-search icon-white"></i> Explore the BeLL</a></li> <li> <a href="#update-assignments"><i class="icon-retweet icon-white"></i> Update device</a></li><li> <a href="#logout"><i class="icon-plane icon-white"></i> Log out</a></li>')
        Backbone.history.navigate('teams', {trigger: true})
      })
      memberLoginForm.render()
      App.$el.children('.body').html('<h1>Member login</h1>')
      App.$el.children('.body').append(memberLoginForm.el)
      // Override the menu
      $('ul.nav').html('<li> <a href="../lms/index.html#resources"><i class="icon-search icon-white"></i> Explore the BeLL</a></li><li> <a href="#update-assignments"><i class="icon-retweet icon-white"></i> Update device</a></li>')
    },

    MemberLogout: function() {
      $.removeCookie('Member.login')
      $.removeCookie('Member._id')
      Backbone.history.navigate('login', {trigger: true})
    },

    Groups: function() {
      groups = new App.Collections.Groups()
      groups.fetch({success: function() {
        groupsTable = new App.Views.GroupsTable({collection: groups})
        groupsTable.render()
        App.$el.children('.body').html('<h1>My Teams</h1>')
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
        Backbone.history.navigate('teams', {trigger: true})
      })
      App.pull_doc_ids([groupId], window.location.origin + '/groups', 'groups')
    },

    UpdateAssignments: function() {
      App.$el.children('.body').html('<div class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div><h2>Updating Assignments. One moment please.</h2>')
      PouchDB.replicate(window.location.origin + '/assignments', 'assignments', {
        complete: function(){
          PouchDB.replicate(window.location.origin + '/resources', 'resources', {
            complete: function(){
              PouchDB.replicate(window.location.origin + '/groups', 'groups', {
                complete: function(){
                  PouchDB.replicate(window.location.origin + '/members', 'members', {
                    complete: function(){
                      var loggedIn = ($.cookie('Member._id'))
                        ? true
                        : false
                      if(loggedIn) {
                        Backbone.history.navigate('teams', {trigger: true})
                      }
                      else {
                        Backbone.history.navigate('login', {trigger: true})
                      }
                    }
                  })
                }
              })
            }
          })
        }
      }) 
    }


  }))

})
