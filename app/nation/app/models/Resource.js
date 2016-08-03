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
            kind: 'Resource'//Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },

        schema: {
            title: 'Text',//Saves title of a resource
            author: {//Saves author's name of a resource
                title: 'Author/Editor',
                type: 'Text'
            }, // Author Field is required when adding the resource with tag news else no need for that.
            Publisher: 'Text',//Saves publisher's name of a resource
            language: {//Saves language of a resource
                type: 'Select',
                options: [{
                    val: 'العربية',
                    label: 'العربية'
                }, {
                    val: 'English',
                    label: 'English'
                },{
                    val: 'اردو',
                    label: 'اردو'
                }]
            },

            Year: 'Text',//Year in which resource has been added

            subject: {//Subject name for which resource is added
                title: 'Subjects',
                type: 'Select',
                options: ['Agriculture', 'Arts', 'Business and Finance', 'Environment', 'Food and Nutrition', 'Geography', 'Health and Medicine', 'History', 'Human Development', 'Languages', 'Law', 'Learning', 'Literature', 'Math', 'Music', 'Politics and Government', 'Reference', 'Religion', 'Science', 'Social Sciences', 'Sports', 'Technology']
            },
            Level: {//Grade/Class level for which resource is added
                title: 'Levels',
                type: 'Select',
                options: ['All', 'Early Education', 'Lower Primary', 'Upper Primary', 'Lower Secondary', 'Upper Secondary', 'Undergraduate', 'Graduate', 'Professional']
            },
            Tag: {//Id(s) of collection doc in which resource has been added. These ids are actually coming from collectionlist db.
                title: 'Collection',
                type: 'Select',
                options: ['Add New']
            },
            Medium: {//Saves type/medium of resource e.g: video, audio of PDF etc.
                type: 'Select',
                options: ['Text', 'Graphic/Pictures', 'Audio/Music/Book ', 'Video']
            },
            openWith: {//Its value decides(provides information) in which way we want to open this resource, e.g: Bell-Reader, PDF, Video Player etc.
                type: 'Select',
                options: ['Just download', 'HTML', 'PDF.js', 'Flow Video Player', 'BeLL Video Book Player', 'Native Video']
            },
            uploadDate: 'Date',//Date of uploading resource
            averageRating: 'Text',//Total average rating of a resource
            articleDate: {//Date when a resource was added to library, mostly its same as uploadDate
                title: 'Date Added to Library',
                type: 'Date'
            },
            addedBy: 'Text'//Name of person/manager who is adding resource
        }
    })

})