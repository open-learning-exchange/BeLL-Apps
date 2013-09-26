$(function() {

  App.Models.Member = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/members/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/members/' + this.id // For READ
      }
      else {
        var url = App.Server + '/members' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Member"
    },

    toString: function() {
      return this.get('login') + ': ' + this.get('firstName') + ' ' + this.get('lastName')
    },

    schema: {
      login: 'Text',
      pass: 'Text',
      firstName: 'Text',
      lastName: 'Text',
      middleNames: 'Text',
      phone: 'Text',
      email: 'Text',
      levels: {
        type: 'Checkboxes',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      },
      roles: {
        type: 'Checkboxes',
        options: ['student', 'teacher', 'head', 'coach', 'lead']
      }

    },

  }) 

})
