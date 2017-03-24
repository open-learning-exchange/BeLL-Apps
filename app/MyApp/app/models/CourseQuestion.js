$(function() {

    App.Models.CourseQuestion = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/coursequestion/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/coursequestion/' + this.id // For READ
            } else {
                var url = App.Server + '/coursequestion' // for CREATE
            }
            return url
        },
        defaults: {
            kind: 'coursequestion'//Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },
        schema: {
            Type: 'Text', //Type of question, e.g: MCQ, Rating Scale etc.
            Statement: 'Text', //Question statement.
            Answer: [], //This array attribute saves answer(s) of a question when a user submit survey response.
            Options: [],//This array attribute saves options of a question(only applicable for MCQ and Rating Scale)
            Ratings: [],//This array attribute saves rating options of a question(only applicable for Rating Scale)
            CorrectAnswer: [],
            Marks: []
        }
    })
})