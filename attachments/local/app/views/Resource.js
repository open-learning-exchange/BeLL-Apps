$(function() {

  App.Views.Resource = Backbone.View.extend({

    tagName:  "tr",

    template: _.template($('#resource-item-template').html()),

    events: {
      "click .download" : "downloadAttachment"
    },

    initialize: function() {
      this.model.bind('change', this.render, this)
      this.model.bind('destroy', this.remove, this)
    },

    render: function() {
      /* DEBUGGING
      var obj = this.model.toJSON()
      alert(JSON.stringify(obj))
      Pouch(App.currentPouch).getAttachment(this.model.get('_id') + "/" + _.keys(this.model.get('_attachments'))[0], function(err, res) {
        alert('yar')
        window.URL = window.URL || window.webkitURL
        var link = resource.createElement('a')
        link.innerHTML = 'Click to download style.css.'
        link.href = window.URL.createObjectURL(res)
        // Give the Blob instance a name!
        link.download = 'something.pdf'
        resource.body.appendChild(link)
      })

      console.log(this.model.toJSON())
      */
      var model = this.model.toJSON()
      var vars = {
        pouchAttachment: _.has(model, "_attachments") ? model._id + "/" + _.keys(model._attachments)[0] : '',
        name: model.name,
        pouch: App.currentPouch
      }
      this.$el.html(this.template(vars))
      return this
    },

    downloadAttachment: function() {
      Pouch(App.currentPouch).getAttachment(this.model.get('_id') + "/" + _.keys(this.model.get('_attachments'))[0], function(err, res) {
        //alert("opening pdf nowt")
        window.location = window.URL.createObjectURL(res)
      })
    }

  })

})