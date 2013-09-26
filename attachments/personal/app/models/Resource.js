$(function() {

  App.Models.Resource = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/resources/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/resources/' + this.id // For READ
      }
      else {
        var url = App.Server + '/resources' // for CREATE
      }
      return url
    },

    openWithMap: {
      'HTML': '',
      'PDF.js': '/apps/_design/bell/pdf.js/viewer.html#file=',
      'Flow Video Player': '/apps/_design/bell/FlowPlayer/index.html#url=',
      'BeLL Video Book Player': '/apps/_design/bell/bell-video-book-player/index.html#url='
    }

  })
  
})
