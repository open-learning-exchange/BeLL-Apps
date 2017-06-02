$(function() {

    App.Models.CoursecareerPath = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/coursecareerpath/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/coursecareerpath/' + this.id // For READ
            } else {
                var url = App.Server + '/coursecareerpath' // for CREATE
            }
            return url
        },
        defaults: {
            kind: 'coursecareerpath',//Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },
        schema: {
            Level_Name: 'Text', 
            Course_Title: 'Text', 
            CourseIds:[],//Array:Multiple Courses
            CourseCareer: []//Array:Arranging the Courses
        },
    })
})