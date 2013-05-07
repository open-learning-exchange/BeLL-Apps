var CouchHubResource = Backbone.couch.Model.extend({

  defaults: {
    kind: "CouchHubResource"
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
