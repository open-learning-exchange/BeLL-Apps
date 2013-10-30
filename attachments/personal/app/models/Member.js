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
	  firstName: {validators: ['required', 'text']},
      lastName: {validators: ['required', 'text']},
      middleNames:{validators: ['required', 'text']},
      username: {validators: ['required', 'text']},
      password: {validators: ['required', 'text']},
      phone: 'Text',
      email:  {validators: ['required', 'email']},
	BirthDate:  'Date',
	 Gender: {
        type: 'Select',
        options: ['Male', 'Female', 'Unspecified']
      },
      levels: {
        type: 'Select',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      },
      roles: {
        type: 'Checkboxes',
        options: ['admin', 'student', 'teacher', 'head', 'coach', 'lead']
      }
    },

  }) 

})
