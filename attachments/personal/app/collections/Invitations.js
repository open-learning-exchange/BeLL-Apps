$(function() {

  App.Collections.Invitations = Backbone.Collection.extend({

    url: App.Server + '/invitations/_all_docs?include_docs=true',
    loggedIn : null,
    initialize:function(){
        loggedIn = new App.Models.Member({_id : $.cookie('Member._id')})
        loggedIn.fetch({async:false})
    },
    parse: function(response) {
      var vars = loggedIn.toJSON()
      var models = []
      _.each(response.rows, function(row) {
         if(row.doc.kind == "invitation"){
         if(row.doc.invitationType == "Level"){
             if(row.doc.levels.indexOf(vars.levels[0]) != -1){
                  models.push(row.doc)
               }
             }
          else if(row.doc.invitationType == "Members"){
             if(row.doc.members.indexOf(vars._id) != -1){
                  models.push(row.doc)
               }
             }
           models.push(row.doc)
         }
      })
      return models
    },
     
    model: App.Models.Invitation,

    comparator: function(model) {
      var title = model.get('title')
      if (title) return title.toLowerCase()
    },


  })

})
