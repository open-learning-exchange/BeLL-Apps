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
      description: 'TextArea',
      step :'Text',
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
      resourceTitles:{
          type:'Select',
          options: [],
      },
      allowedErrors:'Text',
      
      passingPercentage:{
          type:'Select',
          options: [10,20,30,40,50,60,70,80,90,100],
      },
    }  
  
  }) 

})
