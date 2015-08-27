$(function() {

    App.Models.Resource = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/resources/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/resources/' + this.id // For READ
            } else {
                var url = App.Server + '/resources' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'Resource'
        },

        schema: {
            title: 'Text',
            author: {
                title: 'Author/Editor',
                type: 'Text'
            }, // Author Field is required when adding the resource with tag news else no need for that.
            Publisher: 'Text',
            language: {
                type: 'Select',
                options: [{
                    val: 'Arabic',
                    label: 'Arabic'
                }, {
                    val: 'Asante',
                    label: 'Asante'
                }, {
                    val: 'Chinese',
                    label: 'Chinese'
                }, {
                    val: 'English',
                    label: 'English'
                }, {
                    val: 'Ewe',
                    label: 'Ewe'
                }, {
                    val: 'French',
                    label: 'French'
                }, {
                    val: 'Hindi',
                    label: 'Hindi'
                }, {
                    val: 'Kyrgyzstani',
                    label: 'Kyrgyzstani'
                }, {
                    val: 'Nepali',
                    label: 'Nepali'
                }, {
                    val: 'Portuguese',
                    label: 'Portuguese'
                }, {
                    val: 'Punjabi',
                    label: 'Punjabi'
                }, {
                    val: 'Russian',
                    label: 'Russian'
                }, {
                    val: 'Somali',
                    label: 'Somali'
                }, {
                    val: 'Spanish',
                    label: 'Spanish'
                }, {
                    val: 'Swahili',
                    label: 'Swahili'
                }, {
                    val: 'Urdu',
                    label: 'Urdu'
                }]
            },

            Year: 'Text',

            subject: {
                title: 'Subjects',
                type: 'Select',
                options: ['Agriculture', 'Arts', 'Business and Finance', 'Environment', 'Food and Nutrition', 'Geography', 'Health and Medicine', 'History', 'Human Development', 'Languages', 'Law', 'Learning', 'Literature', 'Math', 'Music', 'Politics and Government', 'Reference', 'Religion', 'Science', 'Social Sciences', 'Sports', 'Technology']
            },
            Level: {
                title: 'Levels',
                type: 'Select',
                options: ['All', 'Early Education', 'Lower Primary', 'Upper Primary', 'Lower Secondary', 'Upper Secondary', 'Undergraduate', 'Graduate', 'Professional'],
            },
            Tag: {
                title: 'Collection',
                type: 'Select',
                options: ['Add New']
            },
            Medium: {
                type: 'Select',
                options: ['Text', 'Graphic/Pictures', 'Audio/Music/Book ', 'Video']
            },
            openWith: {
                type: 'Select',
                options: ['Just download', 'HTML', 'PDF.js', 'Flow Video Player', 'BeLL Video Book Player', 'Native Video']
            },
            uploadDate: 'Date',
            averageRating: 'Text',
            articleDate: {
                title: 'Date Added to Library',
                type: 'Date'
            },
            addedBy: 'Text',
        }
    })

})