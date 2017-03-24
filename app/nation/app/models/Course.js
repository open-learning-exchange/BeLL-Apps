$(function() {

    App.Models.Course = Backbone.Model.extend({
        //This model refers to a course

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/courses/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/courses/' + this.id // For READ
            } else {
                var url = App.Server + '/courses' // for CREATE
            }
            return url
        },
        defaults: {
            kind: "Course" // Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },
        schema: {
            CourseTitle: 'Text',
            languageOfInstruction: 'Text',
            memberLimit: 'Text',
            courseLeader: {   //Consists of List of IDs of member(s)from members database which are assigned as Leader(s)/Teacher(s) for given course.
                type: 'Select',
                options: null
            },
            description: 'TextArea',
            method: 'Text',
            gradeLevel: { //Defines that given course is designed to be taught for which level of education.
                type: 'Select',
                options: ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'College', 'Post-Grad']
            },
            subjectLevel: {  //Defines the level of detail provided in given course
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
                options: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            },
            startTime: 'Text',
            endTime: 'Text',
            location: 'Text',
            backgroundColor: 'Text',
            foregroundColor: 'Text',
            members: {   //Consists of list of IDs of all leaders and students added in this course. These IDs are fetched from members database
                type: 'Checkboxes',
                options: null // Populate this when instantiating
            }
        }
    })
})