$(function() {

  App.Models.CourseStep = Backbone.Model.extend({

    idAttribute: "_id",
    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/coursestep/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/coursestep/' + this.id // For READ
      }
      else {
        var url = App.Server + '/coursestep' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Course Step"
    },
    
  schema: {
      title: 'Text',
      level:'Text',
      courseId : 'Text',
      resourceId:{
          type:'Select',
          options: [],
      },
      questions:{
          type:'Select',
          options: [],
      },
      qoptions:{
          type:'Select',
          options: [],
      },
      answers:{
          type:'Select',
          options: [],
      },
      allowedErrors:'Text',
      passingMarks:'Text',
    }  
  
  }) 

})
