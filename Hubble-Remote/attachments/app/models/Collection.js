$(function() {

  App.Models.Collection = Backbone.Model.extend({

    idAttribute: "_id",

    defaults: {
      kind: "Collection"
    },

    // @todo This event thing ain't working so well 
    events: {
      "all": "createDatabase"
    },

    initialize: function(){
      // this.on('all', this.createDatabase(), this)
    },

    schema: {
      name: 'Text',
      description: 'Text',
      // @todo Have this disabled by default on form?
      database: 'Text'
    },

    createDatabase: function() {

      // create a database for the Group if there isn't one already
      if(this.get('database') == "" && this.get('_id')) {

        console.log('Attempting to create a database for hub ' + this.get("_id"))
        var databaseName = "hub-" + this.get('_id')
        var that = this

        $.couch.replicate(
          thisDb, 
          databaseName, 
          {
            success: function(data) {
              that.set("database", databaseName)
              that.save()
              // @todo set the whoami record for this database
              console.log("setting whoami")
              var whoami = that.toJSON()
              whoami.guid = whoami._id
              whoami._id = "whoami"
              whoami.id = "whoami"
              delete(whoami._rev)
              $.couch.db(databaseName).saveDoc(whoami)
            },
            error: function(status) {
              console.log(status)
            }
          },
          { 
            create_target: true,
            doc_ids: ["_design/hubbell-api"]
          }
        )

      }

    },
    
  })

})
