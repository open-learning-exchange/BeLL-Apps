$(function() {

    App.Models.CourseAnswer = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/courseanswer/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/courseanswer/' + this.id // For READ
            } else {
                var url = App.Server + '/courseanswer' // for CREATE
            }
            return url
        },
        defaults: {
            kind: 'courseanswer'//Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },
        schema: {
            Type: 'Text', //Type of question, e.g: MCQ, Rating Scale etc.
            Statement: 'Text', //Question statement.
            MemberID: [], //This is an array attributes of answer that takes Member id.
            CourseID: [], //This is an array attributes of answer that takes Member id
            StepID: [], //This is an array attributes of answer that takes Member id
            QuestionID: [], //This is an array attributes of answer that takes Member id
            Answer: [], //This array attribute saves answer(s) of a question when a user submit survey response.
            Options: [],//This array attribute saves options of a question(only applicable for MCQ and Rating Scale)
            Ratings: [],//This array attribute saves rating options of a question(only applicable for Rating Scale)
            CorrectAnswer: [],//This array attribute saves correct answer(s) of a question when a user submit survey response.
            Marks: [], // This is an array attribute saves the mark of a question when a user submits
            AttemptMarks: [],
            PreResult: [],
            pqattempts: 'Text'
        }
    })
})