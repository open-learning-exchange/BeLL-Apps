$(function() {

    App.Models.Survey = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/survey/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/survey/' + this.id // For READ
            } else {
                var url = App.Server + '/survey' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'survey',
            sentTo: [],
            submittedBy: [],
            questions: []
        },

        schema: {
            Date: 'Text',
            SurveyNo: 'Number',
            SurveyTitle:'Text'
        }

    })
})