$(function() {

    App.Models.membercourseprogress = Backbone.Model.extend({
        //This model consists of results of one member in one course

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/membercourseprogress/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/membercourseprogress/' + this.id // For READ
            } else {
                var url = App.Server + '/membercourseprogress' // for CREATE
            }
            return url
        },
        defaults: {
            kind: "course-member-result"
        },
        schema: {
            courseId: 'Text',
            memberId: 'Text',
            stepsIds: 'null', //list of stepsIDs from document in courses database having provided courseId
            stepsStatus: 'null', //On each index it contains the status(pass/fail/pending) of member in corresponding step from stepsIds array
            stepsResult: 'null', //On each index it contains the marks obtained by member in corresponding step from stepsIds array
            pqAttempts: 'null' //On each index it contains the no. of attempts
        }
    })
})