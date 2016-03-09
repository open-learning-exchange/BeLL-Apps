$(function() {

    App.Models.Question = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/surveyquestions/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/surveyquestions/' + this.id // For READ
            } else {
                var url = App.Server + '/surveyquestions' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'surveyquestions'
        },

        schema: {
            surveyId: 'Text',
            Type: 'Text',
            Statement: 'Text',
            Answer: [],
            Options: [],
            Ratings: [],
            RequireAnswer: false
        }

    })
})