$(function() {

    App.Models.membercourseprogress = Backbone.Model.extend({

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
            stepsIds: 'null',
            stepsStatus: 'null',
            stepsResult: 'null'
        }

    })

})