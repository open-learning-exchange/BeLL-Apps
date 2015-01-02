$(function() {

  App.Models.Group = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/groups/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/groups/' + this.id // For READ
      }
      else {
        var url = App.Server + '/groups' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Group"
    },

    schema: {
      CourseTitle: 'Text',
      languageOfInstruction: 'Text',
      memberLimit: 'Text',
     courseLeader:{
            type:'Select',
            options:null,
      },
        description:'TextArea',
        
       method:'Text',
      gradeLevel: {
        type: 'Select',
        options: ['Pre-K','K','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12','College','Post-Grad']
      },
      subjectLevel: {
        type: 'Select',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
      },  
      startDate: 'Text',
      endDate: 'Text',
       frequency: {
        type: 'Radio',
        options: ['Daily', 'Weekly']
      },
      Day: {
        type: 'Checkboxes',
        options: ['Saturday', 'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']
      },
       startTime: 'Text',
      endTime: 'Text',
     location: 'Text',
      
     backgroundColor: 'Text',
      foregroundColor: 'Text',
      
     members: {
        type: 'Checkboxes',
        options: null // Populate this when instantiating
      },
      
    },

  }) 

})
