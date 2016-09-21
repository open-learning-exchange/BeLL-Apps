$(function() {

    App.Models.Resource = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (this.pubResource == true) {

                if (_.has(this, 'id')) {
                    var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/pubresources/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                        : App.Server + '/pubresources/' + this.id // For READ
                } else {
                    var url = App.Server + '/pubresources' // for CREATE
                }

            } else {
                if (_.has(this, 'id')) {
                    var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/resources/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                        : App.Server + '/resources/' + this.id // For READ
                } else {
                    var url = App.Server + '/resources' // for CREATE
                }

            }
            return url
        },

        defaults: {
            kind: 'Resource', //Saves kind of document according to corresponding db's.Mostly used in couch db views.
            status: ''
        },

        schema: {
            title: 'Text', //Saves title of a resource
            author: { //Saves author's name of a resource
                title: 'Author/Editor',
                type: 'Text'
            }, // Author Field is required when adding the resource with tag news else no need for that.
            Publisher: { //Saves publisher's name of a resource
                title: 'Publisher/Attribution',
                type: 'Text'
            },
            language: { //Saves language of a resource
                type: 'Select',
                options: []
            },

            Year: 'Text', //Year in which resource has been added

            linkToLicense: { //Saves web link of license to that resource if any
                title: 'Link To License',
                type: 'Text'
            },

            subject: { //Subject name for which resource is added
                title: 'Subjects',
                type: 'Select',
                options: ['Agriculture', 'Arts', 'Business and Finance', 'Environment', 'Food and Nutrition', 'Geography', 'Health and Medicine', 'History', 'Human Development', 'Languages', 'Law', 'Learning', 'Literature', 'Math', 'Music', 'Politics and Government', 'Reference', 'Religion', 'Science', 'Social Sciences', 'Sports', 'Technology']
            },
            Level: { //Grade/Class level for which resource is added
                title: 'Levels',
                type: 'Select',
                options: ['Early Education', 'Lower Primary', 'Upper Primary', 'Lower Secondary', 'Upper Secondary', 'Undergraduate', 'Graduate', 'Professional']
            },
            Tag: { //Id(s) of collection doc in which resource has been added. These ids are actually coming from collectionlist db.
                title: 'Collection',
                type: 'Select',
                options: []
            },
            Medium: { //Saves type/medium of resource e.g: video, audio of PDF etc.
                type: 'Select',
                options: ['Text', 'Graphic/Pictures', 'Audio/Music/Book ', 'Video']
            },
            openWith: { //Its value decides(provides information) in which way we want to open this resource, e.g: Bell-Reader, PDF, Video Player etc.
                type: 'Select',
                options: [{
                    val: 'Just download',
                    label: 'Just download'
                }, {
                    val: 'HTML',
                    label: 'HTML'
                }, {
                    val: 'PDF.js',
                    label: 'PDF'
                }, {
                    val: 'Bell-Reader',
                    label: 'Bell-Reader'
                }, {
                    val: 'MP3',
                    label: 'Audio (MP3)'
                }, {
                    val: 'Flow Video Player',
                    label: 'Video (MP4, FLV)'
                }, {
                    val: 'BeLL Video Book Player',
                    label: 'Video Book (webm+json)'
                }, {
                    val: 'Native Video',
                    label: 'Native Video'
                }]
            },
            resourceFor: { //For whom we are adding resource, either is it for Learner or Leader.
                type: 'Select',
                options: [{
                    val: 'Default',
                    label: 'Default'
                }, {
                    val: 'Leader',
                    label: 'Leader'
                }, {
                    val: 'Learner',
                    label: 'Learner'
                }]
            },
            resourceType: { // Which type of resource it is, whether is it a simple book or is it a book containing questions to discuss.
                type: 'Select',
                options: [{
                    val: 'Textbook',
                    label: 'Textbook'
                }, {
                    val: 'Lesson Plan',
                    label: 'Lesson Plan'
                }, {
                    val: 'Activities',
                    label: 'Activities'
                }, {
                        val: 'Exercises',
                        label: 'Exercises'
                    },
                    {
                        val: 'Discussion Questions',
                        label: 'Discussion Questions'
                    }]
            },
            uploadDate: 'Date', //Date of uploading resource
            averageRating: 'Text', //Total average rating of a resource
            articleDate: { //Date when a resource was added to library, mostly its same as uploadDate
                title: 'Date Added to Library',
                type: 'Date'
            },
            addedBy: 'Text', //Name of person/manager who is adding resource
            openUrl: [] //URL link if it is an HTML resource
        },

        saveAttachment: function(formEl, fileEl, revEl) {

            // Work with this doc in the files database
            var server = App.Server
            var input_db = "resources"
            var input_id = (this.get('_id')) ? this.get('_id') : this.get('id')
            var model = this

            // Start by trying to open a Couch Doc at the _id and _db specified
            $.couch.db(input_db).openDoc(input_id, {
                // If found, then set the revision in the form and save
                success: function(couchDoc) {
                    // If the current doc has an attachment we need to clear it for the new attachment
                    if (_.has(couchDoc, '_attachments')) {
                        $.ajax({
                            url: '/resources/' + couchDoc._id + '/' + _.keys(couchDoc._attachments)[0] + '?rev=' + couchDoc._rev,
                            type: 'DELETE',
                            success: function(response, status, jqXHR) {
                                // Defining a revision on saving over a Couch Doc that exists is required.
                                // This puts the last revision of the Couch Doc into the input#rev field
                                // so that it will be submitted using ajaxSubmit.
                                response = JSON.parse(response)
                                $(revEl).val(response.rev);
                                // Submit the form with the attachment
                                $(formEl).ajaxSubmit({
                                    url: server + "/" + input_db + "/" + input_id,
                                    success: function(response) {
                                        model.trigger('savedAttachment')
                                    }
                                })
                            }
                        })
                    }
                    // The doc does not already have attachment, ready to go
                    else {
                        $(revEl).val(model.get('rev'));
                        // Submit the form with the attachment
                        $(formEl).ajaxSubmit({
                            url: server + "/" + input_db + "/" + input_id,
                            success: function(response) {
                                model.trigger('savedAttachment')
                                alert(App.languageDict.attributes.Resource_Added_Success)
                                App.stopActivityIndicator()
                            },
                            error: function(response) {
                                alert(App.languageDict.attributes.Error)
                                App.stopActivityIndicator()
                            }
                        })
                    }
                }, // End success, we have a Doc
                handleError: function(s, xhr, status, e) {
                    // If a local callback was specified, fire it
                    if (s.error) {
                        s.error.call(s.context || window, xhr, status, e);
                    }
                    // Fire the global callback
                    if (s.global) {
                        (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
                    }
                },
                // @todo I don't think this code will ever be run.
                // If there is no CouchDB document with that ID then we'll need to create it before we can attach a file to it.
                error: function(status) {
                    $.couch.db(input_db).saveDoc({
                        "_id": input_id
                    }, {
                        success: function(couchDoc) {
                            // Now that the Couch Doc exists, we can submit the attachment,
                            // but before submitting we have to define the revision of the Couch
                            // Doc so that it gets passed along in the form submit.
                            $(revEl).val(couchDoc.rev);
                            // @todo This file submit stopped working. Couch setting coming from different origin?
                            $(formEl).ajaxSubmit({
                                // Submit the form with the attachment
                                url: "/" + input_db + "/" + input_id,
                                success: function(response) {
                                    model.trigger('savedAttachment')
                                }
                            })
                        }
                    })
                } // End error, no Doc

            }) // End openDoc()
        }

    })

})