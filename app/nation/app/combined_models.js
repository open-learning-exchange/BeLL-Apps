$(function() {

    App.Models.Community = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/community/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/community/' + this.id // For READ

            } else {
                var url = App.Server + '/community' // for CREATE
            }
            return url
        },

        defaults: {
            kind: "Community",
            lastAppUpdateDate: " - ",
            version: " - ",
            lastActivitiesSyncDate: " - ",
            lastPublicationsSyncDate: " - "
        },

        schema: {
            Name: {
                type: 'Text',
                validators: ['required']
            },
            Code: {
                type: 'Text',
                validators: ['required']
            },
            Url: {
                type: 'Text',
                validators: ['required']
            },
            SponserName: {
                type: 'Text',
                validators: ['required']
            },
            SponerAddress: {
                type: 'Text',
                validators: ['required']
            },

            ContactFirstname: {
                type: 'Text',
                validators: ['required']
            },
            ContactMiddlename: {
                type: 'Text',
                validators: ['required']
            },
            ContactLastname: {
                type: 'Text',
                validators: ['required']
            },
            ContactPhone: {
                type: 'Text',
                validators: ['required']
            },
            ContactEmail: {
                type: 'Text',
                validators: ['required']
            },
            SuperManagerFirstname: {
                type: 'Text',
                validators: ['required']
            },
            SuperManagerMiddlename: {
                type: 'Text',
                validators: ['required']
            },
            SuperManagerLastname: {
                type: 'Text',
                validators: ['required']
            },
            SuperManagerPhone: {
                type: 'Text',
                validators: ['required']
            },
            SuperManagerEmail: {
                type: 'Text',
                validators: ['required']
            },
            LeaderId: {
                type: 'Text',
                validators: ['required']
            },
            LeaderPassword: {
                type: 'Text',
                validators: ['required']
            },
            LeaderEmail: {
                type: 'Text',
                validators: ['required']
            },
            UrgentName: {
                type: 'Text',
                validators: ['required']
            },
            UrgentPhone: {
                type: 'Text',
                validators: ['required']
            },
            AuthName: {
                type: 'Text',
                validators: ['required']
            },
            AuthDate: {
                type: 'Text',
                validators: ['required']
            }
        }

    })

});$(function() {

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
                options: ["Select an Option","Arabic", "Asante", "Chinese", "English", "Ewe", "French", "Hindi", "Kyrgyzstani", "Nepali", "Portuguese", "Punjabi", "Russian",
                    "Somali", "Spanish", "Swahili", "Urdu"
                ]
            },
            currentLanguage: {
                type: 'Text'
            }
        }
    })

});$(function() {

    App.Models.CourseStep = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/coursestep/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/coursestep/' + this.id // For READ
            } else {
                var url = App.Server + '/coursestep' // for CREATE
            }
            return url
        },

        defaults: {
            kind: "Course Step"
        },

        schema: {
            title: {
                type: 'Text',
                validators: ['required']
            },
            stepMethod: 'Text',
            description: {
                type: 'TextArea',
                validators: ['required']
            },
            stepGoals: 'TextArea',

            step: 'Text',
            courseId: 'Text',
            resourceId: {
                type: 'Select',
                options: [],
            },
            questions: {
                type: 'Select',
                options: [],
            },
            qoptions: {
                type: 'Select',
                options: [],
            },
            answers: {
                type: 'Select',
                options: [],
            },
            resourceTitles: {
                type: 'Select',
                options: [],
            },
            allowedErrors: {
                type: 'Text',
                validators: ['required']
            },
            outComes: {
                title: 'Outcomes',
                type: 'Checkboxes',
                options: ['Paper', 'Quiz']
            },
            passingPercentage: {
                type: 'Select',
                options: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            },
        },
        saveAttachment: function(formEl, fileEl, revEl) {

            // Work with this doc in the files database
            var server = App.Server
            var input_db = "coursestep"
            var input_id = (this.get('_id')) ? this.get('_id') : this.get('id')
            var model = this
            // Start by trying to open a Couch Doc at the _id and _db specified
            $.couch.db(input_db).openDoc(input_id, {
                // If found, then set the revision in the form and save
                success: function(couchDoc) {
                    $(revEl).val(model.get('_rev'));
                    // Submit the form with the attachment
                    $(formEl).ajaxSubmit({
                        url: server + "/" + input_db + "/" + input_id,
                        success: function(response) {
                            model.trigger('savedAttachment')
                        }
                    })

                }, // End success, we have a Doc

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
                                    console.log('file submitted successfully')
                                    model.trigger('savedAttachment')
                                }
                            })
                        }
                    })
                } // End error, no Doc

            }) // End openDoc()
        }

    })

});$(function() {

    App.Models.Credentials = Backbone.Model.extend({

        idAttribute: "_id",

        schema: {
            login: {
                type: 'Text',
                validators: ['required']
            },
            password: {
                type: 'Password',
                validators: ['required']
            },
        }

    })

});$(function() {

    App.Models.DailyLog = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/activitylog/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/activitylog/' + this.id // For READ
            } else {
                var url = App.Server + '/activitylog' // for CREATE
            }

            return url
        },
        schema: {
            "male_deleted_count": 'number',
            "female_deleted_count": 'number',
            "logDate": "Text",
            "female_visits": 'number',
            "male_visits": 'number',
            "female_new_signups": 'number',
            "male_new_signups": 'number',
            "resourcesIds": [],
            "female_rating": [],
            "female_timesRated": [],
            "male_rating": [],
            "male_timesRated": [],
            "resources_opened": [],
            "resources_names": [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
            "female_opened": [],
            "male_opened": []
        }
    })

});$(function() {

    App.Models.Group = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/groups/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/groups/' + this.id // For READ
            } else {
                var url = App.Server + '/groups' // for CREATE
            }
            return url
        },

        defaults: {
            kind: "Group"
        },

        schema: {
            CourseTitle: 'Text',
            languageOfInstruction: 'Text',
            memberLimit: 'Text',
            courseLeader: {
                type: 'Select',
                options: null,
            },
            description: 'TextArea',

            method: 'Text',
            gradeLevel: {
                type: 'Select',
                options: ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'College', 'Post-Grad']
            },
            subjectLevel: {
                type: 'Select',
                options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            startDate: 'Text',
            endDate: 'Text',
            frequency: {
                type: 'Radio',
                options: ['Daily', 'Weekly']
            },
            Day: {
                type: 'Checkboxes',
                options: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            },
            startTime: 'Text',
            endTime: 'Text',
            location: 'Text',

            backgroundColor: 'Text',
            foregroundColor: 'Text',

            members: {
                type: 'Checkboxes',
                options: null // Populate this when instantiating
            },

        },

    })

});$(function() {

    App.Models.Member = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/members/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/members/' + this.id // For READ
            } else {
                var url = App.Server + '/members' // for CREATE
            }
            return url
        },

        defaults: {
            kind: "Member",
            roles: ["Learner"]
        },

        toString: function() {
            return this.get('login') + ': ' + this.get('firstName') + ' ' + this.get('lastName')
        },

        schema: {
            firstName: {
                validators: ['required']
            },
            lastName: {
                validators: ['required']
            },
            middleNames: 'Text',
            login: {
                validators: ['required']
            },
            password: {
                validators: ['required']
            },
            phone: 'Text',
            email: 'Text',
            language: 'Text',
            BirthDate: 'Date',
            visits: 'Text',
            Gender: {
                type: 'Select',
                options: ['Male', 'Female']
            },
            levels: {
                type: 'Select',
                options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Higher']
            },
            status: 'Text',
            yearsOfTeaching: {
                type: 'Select',
                options: ['None', '1 to 20', 'More than 20']
            },
            teachingCredentials: {
                type: 'Select',
                options: ['Yes', 'No']
            },
            subjectSpecialization: 'Text',
            forGrades: {
                type: 'Checkboxes',
                options: ['Pre-k', 'Grades(1-12)', 'Higher Education', 'Completed Higer Education', 'Masters', 'Doctrate', 'Other Professional Degree']
            },
        },



        saveAttachment: function(formEl, fileEl, revEl) {

            // Work with this doc in the files database
            var server = App.Server
            var input_db = "members"
            var input_id = (this.get('_id')) ? this.get('_id') : this.get('id')
            var model = this

            // Start by trying to open a Couch Doc at the _id and _db specified
            $.couch.db(input_db).openDoc(input_id, {
                // If found, then set the revision in the form and save
                success: function(couchDoc) {
                    // If the current doc has an attachment we need to clear it for the new attachment
                    if (_.has(couchDoc, '_attachments')) {
                        //	alert('asdfasd')
                        $.ajax({
                            url: '/members/' + couchDoc._id + '/' + _.keys(couchDoc._attachments)[0] + '?rev=' + couchDoc._rev,
                            type: 'DELETE',
                            success: function(response, status, jqXHR) {
                                //	alert('success')
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
                            }
                        })
                    }

                }, // End success, we have a Doc

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
                                    console.log('file submitted successfully')
                                    model.trigger('savedAttachment')
                                }
                            })
                        }
                    })
                } // End error, no Doc

            }) // End openDoc()
        }

    })

});$(function() {

    App.Models.NationReport = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/nationreports/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/nationreports/' + this.id // For READ
            } else {
                var url = App.Server + '/nationreports' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'NationReport'
        },

        schema: {
            title: 'Text',
            author: 'Text', // Author Field is required when adding the resource with tag news else no need for that.
            // For Resources with more than one and where one open file must be specified
            Date: 'Date',

        },


        saveAttachment: function(formEl, fileEl, revEl) {

            // Work with this doc in the files database
            var server = App.Server
            var input_db = "nationreports"
            var input_id = (this.get('_id')) ? this.get('_id') : this.get('id')
            var model = this

            // Start by trying to open a Couch Doc at the _id and _db specified
            $.couch.db(input_db).openDoc(input_id, {
                // If found, then set the revision in the form and save
                success: function(couchDoc) {
                    // If the current doc has an attachment we need to clear it for the new attachment
                    if (_.has(couchDoc, '_attachments')) {
                        $.ajax({
                            url: '/nationreports/' + couchDoc._id + '/' + _.keys(couchDoc._attachments)[0] + '?rev=' + couchDoc._rev,
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
                                alert("Successfully Saved!")
                                model.trigger('savedAttachment')
                                Backbone.history.navigate("reports", {
                                    trigger: true
                                })
                            },
                            error: function(response) {
                                alert("Error")
                            },
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
                            alert('error success')
                            // Now that the Couch Doc exists, we can submit the attachment,
                            // but before submitting we have to define the revision of the Couch
                            // Doc so that it gets passed along in the form submit.
                            $(revEl).val(couchDoc.rev);
                            // @todo This file submit stopped working. Couch setting coming from different origin?
                            $(formEl).ajaxSubmit({
                                // Submit the form with the attachment
                                url: "/" + input_db + "/" + input_id,
                                success: function(response) {
                                    console.log('file submitted successfully')
                                    model.trigger('savedAttachment')
                                }
                            })
                        }
                    })
                } // End error, no Doc

            }) // End openDoc()
        }

    })

});$(function() {

    App.Models.NationReportComment = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/nationreports/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/nationreports/' + this.id // For READ
            } else {
                var url = App.Server + '/nationreports' // for CREATE
            }

            return url
        },

        defaults: {
            kind: "NationReportComment"
        },


        schema: {
            NationReportId: 'Text',
            commentNumber: 'Text',
            comment: 'TextArea',
            memberLogin: 'Text',
            time: 'Text'
        }
    })

});$(function() {

    App.Models.Publication = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/publications/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/publications/' + this.id // For READ
            } else {
                var url = App.Server + '/publications' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'publication'
        },

        schema: {
            Date: 'Text',
            IssueNo: 'Number',
            editorName: 'Text',
            editorEmail: 'Text',
            editorPhone: 'Text',
            resources: {
                type: 'Select',
                options: []

            }
        },

    })
    App.Models.sendPublication = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/publicationdistribution/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/publicationdistribution/' + this.id // For READ
            } else {
                var url = App.Server + '/publicationdistribution' // for CREATE
            }
            return url
        }

    })

});$(function() {

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

});$(function() {

    App.Models.report = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/report/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/report/' + this.id // For READ
            } else {
                var url = App.Server + '/report' // for CREATE
            }

            return url
        },
        defaults: {
            kind: "report"
        },


        schema: {
            PageUrl: 'Text',
            comment: 'TextArea',
            Resolved: 'Text',
            category: {
                type: 'Select',
                options: ['Bug', 'Question', 'Suggestion']
            },
            priority: {
                type: 'Checkboxes',
                options: ['urgent']
            },
            memberLogin: 'Text',
            time: 'Text'
        }


    })

});$(function() {

    App.Models.request = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/requests/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/requests/' + this.id // For READ
            } else {
                var url = App.Server + '/requests' // for CREATE
            }
            return url
        },

        defaults: {
            kind: "request"
        },

        schema: {
            senderId: 'Text',
            status: 'Text',
            sendFrom: 'Text',
            sendFromName: 'Text',
            request: 'TextArea',
            response: 'TextArea',
            type: 'Text',
            date: 'Text'
        }

    })

})