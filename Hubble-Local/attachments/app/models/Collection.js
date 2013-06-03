$(function() {

  App.Models.Collection = Backbone.Model.extend({
    defaults: {
      kind: 'collection'
    },

    replicate: function () {

      // Push
      this.trigger('pushing')
      Pouch.replicate('http://' + this.get('url'), this.get('url'), {
        continuous: false,
        complete: function(resp) {
          this.trigger('pushingComplete')
          // renderStats()
        }
      })

      // Pull
      this.trigger('pulling')
      Pouch.replicate(this.get('url'), 'http://' + this.get('url'), {
        continuous: false,
        complete: function(resp) {
          this.trigger('pullComplete')
          // pullResps[url] = resp
          // renderStats()
        }
      })
    }

  })

})