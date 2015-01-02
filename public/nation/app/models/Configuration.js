$(function() {

  App.Models.Configuration = Backbone.Model.extend({

      idAttribute: "_id",
      url: function() {
          if (_.has(this, 'id')) {
              var url = (_.has(this.toJSON(), '_rev'))
                  ? App.Server + '/configurations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                  : App.Server + '/configurations/' + this.id // For READ
          }
          else {
              var url = App.Server + '/configurations' // for CREATE
          }

          return url
      },
      schema:{
          name:{
              type:'Text',
              validators: ['required']
          },
          code:{
              type:'Text',
              validators: ['required']
          },
          type:{
              type: 'Select',
              options: ['community', 'nation'],
              validators: ['required']
          },
          nationName:{
              type:'Text',
              validators: ['required']
          },
          nationUrl:{
              type:'Text',
              validators: ['required']
          },
          version: {
              type:'Text'
          },
          notes: {
              type:'Text'
          },
          availableLanguages: {
              type: 'Select',
              options: ["English", "French", "Arabic", "Urdu"]
          },
          currentLanguage: {
              type:'Text'
          }
      }
}) 

})


