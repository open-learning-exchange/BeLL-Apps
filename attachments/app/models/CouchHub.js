var CouchHub = Backbone.couch.Model.extend({

  defaults: {
    kind: "CouchHub"
  },

  // @todo This event thing ain't working so well 
  events: {
    "all": "createDatabase"
  },

  initialize: function(){
    this.on('all', this.createDatabase(), this)
  },

  schema: {
    name: 'Text',
    description: 'Text',
    database: 'Text'
  },

  createDatabase: function() {
    // create a database for the Group if there isn't one already
    console.log(this)
    if(this.get('database') == "" && this.get('_id')) {
      console.log('Attempting to create a database for hub ' + this.get("_id"))
      var databaseName = "hub-" + this.get('_id')
      var that = this
      $.couch.db(databaseName).create({
        success: function(data) {
          that.set("database", databaseName)
          that.save()
        },
        error: function(status) {
          console.log(status);
        }
      });
    }
  },

  
})
