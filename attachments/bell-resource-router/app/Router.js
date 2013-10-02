$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      'open/:resourceId' : 'open', 
      'download/:resourceId' : 'download', 
    },

    open: function(resourceId) {
      var openUrl
      var resource = new App.Models.Resource({_id: resourceId})
      resource.on('sync', function() {
        // If there is a openURL, that overrides what we use to open, else we build the URL according to openWith
        if(resource.get('openUrl') && resource.get('openUrl').length > 0) {
          openUrl = resource.get('openUrl')
        }
        else if(resource.get('openWhichFile') && resource.get('openWhichFile').length > 0) {
          openUrl = resource.__proto__.openWithMap[resource.get('openWith')] + '/resources/' + resource.id + '/' + resource.get('openWhichFile')
        }
        else {
          openUrl = resource.__proto__.openWithMap[resource.get('openWith')] + '/resources/' + resource.id + '/' + _.keys(resource.get('_attachments'))[0]
        }
        window.location = openUrl
        //console.log(openUrl)
      })
      resource.fetch()
    }

  }))

})
