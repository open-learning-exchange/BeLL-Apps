$(function() {

  App.Models.Resource = Backbone.Model.extend({

    getAttachment: function() {
      var model = this
      Pouch('files', function(err, db) {
        db.get(model.id, function(err, doc) {
            model.set('_attachments', doc._attachments)
            model.trigger('getAttachmentDone')
        })
      })
    }

  })

})