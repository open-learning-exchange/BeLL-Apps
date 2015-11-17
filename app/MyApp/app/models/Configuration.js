$(function() {

    App.Models.Configuration = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/configurations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/configurations/' + this.id // For READ
            } else {
                var url = App.Server + '/configurations' // for CREATE
            }

            return url
        },
        defaults: {
            currentLanguage: {
                type: 'Text'
            },
            subType: {
                type: 'Text'
            },
            flagDoubleUpdate: {
                type: 'Text'
            },
            "countDoubleUpdate": 0


        },
        schema: {
            name: {
                type: 'Text',
                validators: ['required']
            },
            code: {
                type: 'Text',
                validators: ['required']
            },
            type: {
                type: 'Select',
                options: ['community', 'nation'],
                validators: ['required']
            },
            region: 'Text',
            nationName: {
                type: 'Text',
                validators: ['required']
            },
            nationUrl: {
                type: 'Text',
                validators: ['required']
            },
            version: {
                type: 'Text'
            },
            notes: {
                type: 'Text'
            },
            selectLanguage: {
                type: 'Select',
              /*  options: ["العربية","Asante","中国","English","Ewe","français","हिंदी","Kyrgyzstani","नेपाली","português","ਪੰਜਾਬੀ ਦੇ","Русский","Soomaali","Español","Kiswahili",
                    "اردو"
                ]*/
                options: ["English","العربية",
                    "اردو"
                ]
            }
        }
    })

})