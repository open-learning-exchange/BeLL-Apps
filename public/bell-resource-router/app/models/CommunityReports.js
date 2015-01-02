$(function() {

  App.Models.CommunityReports = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? '/communityreports/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : '/communityreports/' + this.id // For READ
      }
      else {
        var url = App.Server + '/communityreports' // for CREATE
      }
      return url
    },

    openWithMap: {
      'HTML': '',
      'Just download': '',
      'PDF.js': '/apps/_design/bell/pdf.js/viewer.html#file=',
      'Flow Video Player': '/apps/_design/bell/FlowPlayer/index.html#url=',
      'BeLL Video Book Player': '/apps/_design/bell/bell-video-book-player/index.html#url=',
      'Native Video':''
    }

  })
  
})
