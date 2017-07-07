$(function() {

    App.Models.MeetUp = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/meetups/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/meetups/' + this.id // For READ
            } else {
                var url = App.Server + '/meetups' // for CREATE
            }

            return url
        },
        defaults: {
            kind: "Meetup"
        },


        schema: {
            title: 'Text',
            descriptionOutput: {
                type: 'TextArea',
                fieldAttrs: {id:'MeetupDescription',class:'bbf-field redactor_textbox'}
            },
            description: {
                type: 'TextArea',
                fieldAttrs: {id:'markdownMeetupDescription',class:'bbf-field redactor_textbox'}
            },
            startDate: 'Text',
            endDate: 'Text',
            recurring: {
                type: 'Radio',
                options: ['Daily', 'Weekly',{val:null, label:'None'}]
            },
            Day: {
                type: 'Checkboxes',
                options: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            },
            startTime: 'Text',
            endTime: 'Text',
            category: {
                type: 'Select',
                options:[
                    {val:'ICT',
                    label:'ICT'},
                    {val:'First Time',
                        label:'First Time'},
                    {val:'Mothers',
                        label:'Mothers'},
                    {val:'General',
                        label:'General'},
                    {val:'E Learning',
                        label:'E Learning'},
                    {val:'Farming',
                        label:'Farming'},
                    {val:'Academic Discussion',
                        label:'Academic Discussion'},
                    {val:'Academic Help',
                        label:'Academic Help'},
                    {val:'Awareness',
                        label:'Awareness'},
                ]
              //  options: ['ICT', 'First Time', 'Mothers', 'General', 'E Learning', 'Farming', 'Academic Discussion', 'Academic Help', 'Awareness']
            },
            meetupLocation: 'Text'
        }

    })

})