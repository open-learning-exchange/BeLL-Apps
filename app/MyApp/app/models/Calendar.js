$(function() {

    App.Models.Calendar = Backbone.Model.extend({
//This model refers to the event which is being created on the Calender.
        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/calendar/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/calendar/' + this.id // For READ
            } else {
                var url = App.Server + '/calendar' // for CREATE
            }
            return url
        },

        schema: {
            title: {
                title: 'Event Name',
                validators: ['required']
            },
            description: {
                type: 'TextArea',
                title: "Event description",
                validators: ['required']
            },
            startDate: 'Text',
            endDate: 'Text',
            startTime: 'Text',
            endTime: 'Text',

            userId: { //ID of the person who is creating the event.
                validators: ['required'],
                type: 'Hidden'
            },
            url: {
                type: 'Hidden'
            }
        }
    })

})