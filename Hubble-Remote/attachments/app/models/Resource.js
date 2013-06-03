var Resource = Backbone.couch.Model.extend({

  defaults: {
    kind: "Resource"
  },

  events: {

  },

  initialize: function(){

  },

  schema: {
    name: 'Text',
    description: 'Text',
    openWith: { type: 'Select', options: ['PDFjs', 'Download Only'] },
  },
  
})
