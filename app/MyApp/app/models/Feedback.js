$(function() {

  App.Models.Feedback = Backbone.Model.extend({

    idAttribute: "_id",
    //This model refers to the feedback for any resource.

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/feedback/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
            : App.Server + '/feedback/' + this.id // For READ
      } else {
        var url = App.Server + '/feedback' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Feedback" //Saves kind of document according to corresponding db's.Mostly used in couch db views.
    },

    schema: {
      rating: 'Text', //Rating(saved in the form of integers from 1 to 5) given for a particular resource
      comment: 'TextArea', //Comments given for a particular resource
      resourceId: 'Text', //Id of that particular resource for which feedback is given. This id is coming from resources db.
      memberId: 'Text',//Id of that member who is giving his/her feedback for a particular resource. This id is coming from members db.
      communityCode: 'Text' //The value of 'code' attribute from community configurations
    }

  })

})