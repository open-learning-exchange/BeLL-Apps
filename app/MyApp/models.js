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

});

$(function() {

    App.Models.Group = Backbone.Model.extend({
        //This model refers to a course

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
            kind: "Group" // Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },

        schema: {
            CourseTitle: 'Text',
            languageOfInstruction: 'Text',
            memberLimit: 'Text',
            courseLeader: {   //Consists of List of IDs of member(s)from members database which are assigned as Leader(s)/Teacher(s) for given course.
                type: 'Select',
                options: null
            },
            description: 'TextArea',

            method: 'Text',
            gradeLevel: { //Defines that given course is designed to be taught for which level of education.
                type: 'Select',
                options: ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'College', 'Post-Grad']
            },
            subjectLevel: {  //Defines the level of detail provided in given course
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

            members: {   //Consists of list of IDs of all leaders and students added in this course. These IDs are fetched from members database
                type: 'Checkboxes',
                options: null // Populate this when instantiating
            }

        }

    })

});

$(function() {

  App.Models.Assignment = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/assignments/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
            : App.Server + '/assignments/' + this.id // For READ
      } else {
        var url = App.Server + '/assignments' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Assignment"
    }

  })

});

$(function() {

  App.Models.Feedback = Backbone.Model.extend({

    idAttribute: "_id",
    //This model refers to the feedback for any resource.

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/feedback/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
            : App.Server + '/feedback/' + this.id // For READ
      } else {
        var url = App.Server + '/feedback' // for CREATE
      }
      return url
    },

    defaults: {
      kind: "Feedback" //Saves kind of document according to corresponding db's.Mostly used in couch db views.
    },

    schema: {
      rating: 'Text', //Rating(saved in the form of integers from 1 to 5) given for a particular resource
      comment: 'TextArea', //Comments given for a particular resource
      resourceId: 'Text', //Id of that particular resource for which feedback is given. This id is coming from resources db.
      memberId: 'Text',//Id of that member who is giving his/her feedback for a particular resource. This id is coming from members db.
      communityCode: 'Text' //The value of 'code' attribute from community configurations
    }

  })

});

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

            userId: { //ID of the person who is creating the event. It comes from its document in members database
                validators: ['required'],
                type: 'Hidden'
            },
            url: {
                type: 'Hidden'
            }
        }
    })

});

$(function() {

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
            time: 'Text',
            communityCode: 'Text'
        }


    })

});

$(function() {

	App.Models.Mail = Backbone.Model.extend({

		idAttribute: "_id",
		url: function() {
			if (_.has(this, 'id')) {
				var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/mail/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
					: App.Server + '/mail/' + this.id // For READ
			} else {
				var url = App.Server + '/mail' // for CREATE
			}
			return url
		},

		schema: {
			sednerId: 'Text',  //ID of the person who is sending email, person logged in. Its value can be read from cookie with name of Member._id.
			receiverId: 'Text', //ID of document in members database to which email is being sent
			subject: 'Text',
			body: 'Text',
			type: 'Text',  //what kind of mail is it, e.g simple 'mail' or a 'course-ivite'
			status: 'Text',
			sentDate: 'Text',
			mailingList: 'Text'
		},
		saveAttachment: function(formEl, fileEl, revEl) {
			// Work with this doc in the files database
			var server = App.Server
			var input_db = "mail"
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
							url: '/mail/' + couchDoc._id + '/' + _.keys(couchDoc._attachments)[0] + '?rev=' + couchDoc._rev,
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
									model.trigger('savedAttachment')
								}
							})
						}
					})
				}
			})
		}


	})

});

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
            stepsIds: 'null', //list of stepsIDs from document in groups database having provided courseId
            stepsStatus: 'null', //On each index it contains the status(pass/fail/pending) of member in corresponding step from stepsIds array
            stepsResult: 'null' //On each index it contains the marks obtained by member in corresponding step from stepsIds array
        }

    })

});

$(function() {

    App.Models.CourseSchedule = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/courseschedule/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/courseschedule/_design/bell/_view/ScheduleByCourseId?key="' + this.courseId + '"&include_docs=true ' // For READ
            } else {
                var url = App.Server + '/courseschedule' // for CREATE
            }

            return url
        }

    })

});

$(function() {

    App.Models.AssignmentPaper = Backbone.Model.extend({
        //This model refers to the submission of a document against any step having outcome as Paper.

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/assignmentpaper/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/assignmentpaper/' + this.id // For READ
            } else {
                var url = App.Server + '/assignmentpaper' // for CREATE
            }
            return url
        },

        schema: {
            sednerId: 'Text',  //ID of the person who submitted the document (i.e Learner's ID)
            courseId: 'Text', //Refers to course which had that paper step
            stepId: 'Text',  //Refers to step against which the document was submitted. Its type will be either paper or Paper and Quiz both.
            sentDate: 'Text', //Date of submission
            stepNo: 'Text' //The number of step displayed on Dashboard>>Courses>>Manage>>list of Steps underneath
        },
        saveAttachment: function(formEl, fileEl, revEl) {
            // Work with this doc in the files database
            var server = App.Server
            var input_db = "assignmentpaper"
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
                            url: '/assignmentpaper/' + couchDoc._id + '/' + _.keys(couchDoc._attachments)[0] + '?rev=' + couchDoc._rev,
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
                                    model.trigger('savedAttachment')
                                }
                            })
                        }
                    })
                }
            })
        }


    })

});

$(function() {

    App.Models.UserMeetup = Backbone.Model.extend({

        idAttribute: "_id",
        initialize: function() {},
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/usermeetups/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/usermeetups/' + this.id // For READ
            } else {
                var url = App.Server + '/usermeetups' // for CREATE
            }

            return url
        },

        schema: {
            memberId: 'Text',
            meetupId: 'Text',
            meetupTitle: 'Text'
        }
    })

});

$(function() {

    App.Models.ReleaseNotes = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/configurations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/configurations/' + this.id // For READ
            } else {
                var url = App.Server + '/configurations' // for CREATE
            }

            return url
        }
    })

});

$(function() {

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
            kind: "Member", //Saves kind of document according to corresponding db's.Mostly used in couch db views.
            roles: ["Learner"], //Saves roles of a specific member
            bellLanguage:"" //This is used to show BeLL-Apps in member-selected language
        },

        toString: function() {
            return this.get('login') + ': ' + this.get('firstName') + ' ' + this.get('lastName')
        },
        schema: {
            firstName: {
                type:'Text'
            },
            lastName: {
                type:'Text'
            },
            middleNames: 'Text',
            login: {
                type:'Text'
            },
            password: {
                type:'Text'
            },
            phone: 'Text',
            email: 'Text',
            language: 'Text', // Saves language which member speaks OR native/mother language of Member
            BirthDate: 'Date',
            visits: 'Text', //Total count of visits by a specific member
            Gender: {
                type: 'Select',
                options: [{
                    val: 'Male',
                    label: 'Male'
                }, {
                    val: 'Female',
                    label: 'Female'
                }]
            },
            levels: { //Grade level of a specific member
                type: 'Select',
                options: [{
                    val: '1',
                    label: '1'
                }, {
                    val: '2',
                    label: '2'
                }, {
                    val: '3',
                    label: '3'
                }, {
                    val: '4',
                    label: '4'
                }, {
                    val: '5',
                    label: '5'
                }, {
                    val: '6',
                    label: '6'
                }, {
                    val: '7',
                    label: '7'
                }, {
                    val: '8',
                    label: '8'
                }, {
                    val: '9',
                    label: '9'
                }, {
                    val: '10',
                    label: '10'
                }, {
                    val: '11',
                    label: '11'
                }, {
                    val: '12',
                    label: '12'
                }, {
                    val: 'Higher',
                    label: 'Higher'
                }]
            },
            status: 'Text', //Saves status which tells us that whether a member is active/de-active.If a member well resign, then he will be deactivated
            yearsOfTeaching: { //Total teaching experience of a member
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
            community: 'Text', //Contains the value of 'code' from configurations.
            region: 'Text',//Region name of member/its community
            nation: 'Text',//Name of nation to which community(in which members exists) is registered.
            lastLoginDate:'Date',// Saves date when last time a member logged in
            lastEditDate:'Date' // Saves date when last time a member updated his/her profile
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
                                    model.trigger('savedAttachment')
                                }
                            })
                        }
                    })
                } // End error, no Doc

            }) // End openDoc()
        }

    })

});

$(function() {

  App.Models.Credentials = Backbone.Model.extend({

    idAttribute: "_id",

    schema: {
      login: 'Text',
      password: 'Password'
    }

  })

});

$(function() {

  App.Models.App = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/apps/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
            : App.Server + '/apps/' + this.id // For READ
      } else {
        var url = App.Server + '/apps' // for CREATE
      }
      return url
    }

  })

});

$(function() {

    App.Models.Shelf = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/shelf/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/shelf/' + this.id // For READ
            } else {
                var url = App.Server + '/shelf' // for CREATE
            }

            return url
        },

        schema: {
            memberId: 'Text', //Id of member who added a library resource to its shelf.This id is actually coming from members db.
            resourceId: 'Text', //Id of resource added in shelf.This id is actually coming from resources db.
            resourceTitle: 'Text' //Title of added resource
        }
    })

});

$(function() {

    App.Models.Invitation = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/invitations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/invitations/' + this.id // For READ
            } else {
                var url = App.Server + '/invitations' // for CREATE
            }
            return url
        },

        defaults: {
            kind: "invitation"
        },

        schema: {
            title: 'Text',
            type: 'Text',
            senderId: 'Text',
            senderName: 'Text',
            entityId: 'Text',
            memberId: 'Text'
        }

    })

});

$(function() {

    App.Models.CourseStep = Backbone.Model.extend({
        //This model refers to the structure of step (i.e Lesson) envolved in any course

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
            kind: "Course Step" // Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },

        schema: {
            title: {
                type: 'Text'
            },
            stepMethod: 'Text',
            description: {
                type: 'TextArea'
            },
            stepGoals: 'TextArea',

            step: 'Text',
            courseId: 'Text',
            resourceId: {   //list of IDs of resources attached with any step(level). These IDs are coming from resources database.
                type: 'Select',
                options: []
            },
            questions: {  //Statements of Question(s) added, if the step has an outcome/type as Quiz
                type: 'Select',
                options: []
            },
            qoptions: { //Options provided against each question.
                type: 'Select',
                options: []
            },
            answers: { //List of correct answer against each question.
                type: 'Select',
                options: []
            },
            resourceTitles: { //Names of all those resources which are attached with given step.
                type: 'Select',
                options: []
            },
            outComes: { //Type of Step e.g
                //1. Quiz
                //2. Paper/Assignment
                //3. Paper and Quiz
                title: 'Outcomes',
                type: 'Checkboxes',
                options: ['Paper', 'Quiz']
            },
            passingPercentage: { //Least marks to be obtained for passing any step
                type: 'Select',
                options: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            }
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
                                    model.trigger('savedAttachment')
                                }
                            })
                        }
                    })
                } // End error, no Doc

            }) // End openDoc()
        }

    })

});

$(function() {

    App.Models.InviFormModel = Backbone.Model.extend({
        //This model is used for inviting members for a course.
        schema: {
            invitationType: { //Gives user 3 options in selection criteria for invitation
                type: 'Select',
                options:[
                    {
                        val: 'All', //invite all members.
                        label: 'All'
                    },
                    {
                        val: 'Level', //invite members of a specific level
                        label: 'Level'
                    },
                    {
                        val: 'Members', //invite specific members
                        label: 'Members'
                    }
                ]
              //  options: ['All', 'Level', 'Members']
            },
            levels: {
                type: 'Checkboxes',
                options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Higher']
            },
            members: {
                type: 'Checkboxes', //when invitationType's value is Members then list of members is displayed with a checkbox against each member to send him an invite.
                options: null // Populate this when instantiating
            }
        }

    })

});

$(function() {

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

});

$(function() {

    App.Models.reportComment = Backbone.Model.extend({

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
            kind: "reportComment"
        },


        schema: {
            reportId: 'Text',
            commentNumber: 'Text',
            comment: 'TextArea',
            memberLogin: 'Text',
            time: 'Text'
        }
    })

});

$(function() {

    App.Models.CommunityReportComment = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/communityreports/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/communityreports/' + this.id // For READ
            } else {
                var url = App.Server + '/communityreports' // for CREATE
            }

            return url
        },

        defaults: {
            kind: "CommunityReportComment"
        },


        schema: {
            CommunityReportId: 'Text',
            commentNumber: 'Text',
            comment: 'TextArea',
            memberLogin: 'Text',
            time: 'Text'
        }
    })

});

$(function() {

    App.Models.CommunityReport = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/communityreports/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/communityreports/' + this.id // For READ
            } else {
                var url = App.Server + '/communityreports' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'CommunityReport'
        },

        schema: {
            title: 'Text',
            author: 'Text', // Author Field is required when adding the resource with tag news else no need for that.
            // For Resources with more than one and where one open file must be specified
            Date: 'Date'

        },


        saveAttachment: function(formEl, fileEl, revEl) {

            // Work with this doc in the files database
            var server = App.Server
            var input_db = "communityreports"
            var input_id = (this.get('_id')) ? this.get('_id') : this.get('id')
            var model = this

            // Start by trying to open a Couch Doc at the _id and _db specified
            $.couch.db(input_db).openDoc(input_id, {
                // If found, then set the revision in the form and save
                success: function(couchDoc) {
                    // If the current doc has an attachment we need to clear it for the new attachment
                    if (_.has(couchDoc, '_attachments')) {
                        $.ajax({
                            url: '/communityreports/' + couchDoc._id + '/' + _.keys(couchDoc._attachments)[0] + '?rev=' + couchDoc._rev,
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
                                alert(App.languageDict.attributes.Success_Saved_Msg)
                                model.trigger('savedAttachment')
                                Backbone.history.navigate("reports", {
                                    trigger: true
                                })
                            },
                            error: function(response) {
                                alert(App.languageDict.attributes.Error)
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

});

$(function() {

    App.Models.ResourceFrequency = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/resourcefrequency/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/resourcefrequency/' + this.id // For READ
            } else {
                var url = App.Server + '/resourcefrequency' // for CREATE
            }

            return url
        },
        defaults: {
            kind: "resourcefrequency",
            memberID: "",
            resourceID: [],
            frequency: []
        }

    })

});

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
            description: 'TextArea',
            startDate: 'Text',
            endDate: 'Text',
            recurring: {
                type: 'Radio',
                options: ['Daily', 'Weekly']
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

});

$(function() {

    App.Models.Publication = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (this.recPub == true) {
                if (_.has(this, 'id')) {
                    var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/recpublication/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                        : App.Server + '/recpublication/' + this.id // For READ
                } else {
                    var url = App.Server + '/recpublication' // for CREATE
                }

            } else {
                if (_.has(this, 'id')) {
                    var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/publications/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                        : App.Server + '/publications/' + this.id // For READ
                } else {
                    var url = App.Server + '/publications' // for CREATE
                }

            }
            return url
        },

        defaults: {
            kind: 'publication' //Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },

        schema: {
            Date: 'Text', //Creation date of publication/issue
            IssueNo: 'Number', //Unique identification number of publication.
            editorName: 'Text',
            editorEmail: 'Text',
            editorPhone: 'Text',
            resources: { //Ids of those resources added in publication.These ids are actually coming from resources db.
                type: 'Select',
                options: []
            }
        },
        setUrl: function(newUrl) {
            this.url = newUrl;
        }
    })

});

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
            subType: "dummyy",//Added to make a community special one, asked by Stefan to add this attribute
            currentLanguage: '', //Saves language of BeLL-Apps
            registrationRequest: 'pending', //Saves status of community's registration request
            lastAppUpdateDate: '-', // Remembers the day when last time a community got an update from nation
            lastActivitiesSyncDate: '-', // Remembers the day when last time a community synced Activity logs and other data with nation
            lastPublicationsSyncDate: '-', // Remembers the day when last time a community synced(downloaded) publications from nation
            authName: '', // Saves name of that person who accepts/rejects community's registration request
            authDate: '', // Saves date of acceptation/rejection of community's registration request
        },
        schema: {
            //Community's information
            name: { //Name of a community.Used mostly for displaying purpose. Also it is being used in sending publications to communities etc.
                type: 'Text',
                validators: ['required']
            },
            code: { //Some specific value.Used mostly to specify a 'unique keyword' for community so that we can easily differentiate among multiple communities at nation side while sending data etc.
                type: 'Text', // To make code unique is not implemented yet.
                validators: ['required']
            },
            region: 'Text', // Saves region name in which community/nation exists
            nationName: { // Saves couch/futon's admin/userName of nation to which community is registered
                type: 'Text',
                validators: ['required']
            },
            nationUrl: { // Saves URL of nation to which community is registered
                type: 'Text',
                validators: ['required']
            },
            version: { // Saves current version of community/nation
                type: 'Text'
            },
            notes: { // Saves some descriptions about community/nation
                type: 'Text'
            },
            selectLanguage: { // This attribute is being used to select BeLL-Apps language(After easy-install it is only used for nation, for community there is another way to select language)
                type: 'Select',
                options:[]
            },
            //Sponsoring Organization
            sponsorName: { // Saves name of sponsoring organization
                type: 'Text'
            },
            sponsorAddress: { // Saves address of sponsoring organization
                type: 'Text'
            },
            sponsorUrl: { // Saves URL of sponsoring organization
                type: 'Text'
            },
            contactFirstName: { // Saves first name of manager
                type: 'Text'
            },
            contactMiddleName: { // Saves middle name of manager
                type: 'Text'
            },
            contactLastName: { // Saves last name of manager
                type: 'Text'
            },
            contactPhone: { // Saves phone# of manager
                type: 'Text'
            },
            contactEmail: { // Saves email of manager
                type: 'Text'
            },
            //Tech Support
            superManagerFirstName: { // Saves first name of tech-support Manager
                type: 'Text'
            },
            superManagerMiddleName: { // Saves middle name of tech-support Manager
                type: 'Text'
            },
            superManagerLastName: { // Saves last name of tech-support Manager
                type: 'Text'
            },
            superManagerPhone: { // Saves phone# of tech-support Manager
                type: 'Text'
            },
            superManagerEmail: { // Saves email of tech-support Manager
                type: 'Text'
            },
            type: 'Text', // Saves whether BeLL-Apps is a community or nation
            //Adding these attributes temporarily
            Name: { //This attribute is same as 'name'. We keep it here so that the communities in production can work smoothly.
                type: 'Text' // This attribute will be removed when all the communities will have 'easy-install' work.
            },
            Code: { //Same as 'code'.We keep it here so that the communities in production can work smoothly.
                type: 'Text' // This attribute will be removed when all the communities will have 'easy-install' work.
            },
            countDoubleUpdate: 'Number', //Saves status of community's update.
            kind: 'Text' // Saves kind of document according to corresponding db's.Mostly used in couch db views.
        }
    })

});

$(function() {

    App.Models.CollectionList = Backbone.Model.extend({
        //This model refers to the collection created in Resources.

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/collectionlist/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/collectionlist/' + this.id // For READ
            } else {
                var url = App.Server + '/collectionlist' // for CREATE
            }

            return url
        },
        defaults: {
            kind: "CollectionList",  //Used to differentiate that document from design docs. Usage in couchDB views.
            IsMajor: true,
            show: true //Show that CollectionName on Library page or not.. against each resource.
        },


        schema: {

            CollectionName: 'Text',

            Description: 'TextArea',
            NesttedUnder: {        //To make one collection nested under another.
                title: 'Nested Under',
                type: 'Select',
                options: [{val:'--Select--',label:'--Select--'}]
            },
            AddedBy: 'Text',
            AddedDate: 'Text'
        }

    })
});

$(function() {

    App.Models.InviMeetup = Backbone.Model.extend({
        //This model is used for inviting members for a meetup.
        schema: {
            invitationType: {
                type: 'Select',
              //  options: ['All', 'Members']
                options:[{
                    val: 'All',  //Invite all members of given bell for meetup
                    label: 'All'
                }, {
                        val: 'Members',  //Invite selective members for meetup.
                        label: 'Members'
                    }]
            },
            members: {   //when invitationType's value is Members then list of members is displayed with a checkbox against each member to send him an invite.
                type: 'Checkboxes',
                options: null // Populate this when instantiating
            }
        }

    })

});

$(function() {

    App.Models.Language = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/languages/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/languages/' + this.id // For READ
            } else {
                var url = App.Server + '/languages' // for CREATE
            }

            return url
        }
    })

});

$(function() {

    App.Models.CourseInvitation = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/courseinvitations/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/courseinvitations/_design/bell/_view/getByCourseId?key="' + this.courseId + '"&include_docs=true ' // For READ
            } else {
                var url = App.Server + '/courseinvitations' // for CREATE
            }

            return url
        },
        defaults: {
            kind: "CourseInvitation"
        },
        schema: {
            courseId: 'Text', //Comes from groups database against the course for which invitation is sent
            userId: 'Text',
            status: 'Text'

        }
    })

});

$(function() {

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
            "male_deleted_count": 'number', //Count of male member deletions in a day
            "female_deleted_count": 'number',//Count of female member deletions in a day
            "logDate": "Text", //Date of the day for which activity log doc is created.
            "female_visits": 'number',//Count of female member visits in a day
            "male_visits": 'number',//Count of male member visits in a day
            "female_new_signups": 'number',//Count of new female sign-ups in a day
            "male_new_signups": 'number',//Count of new male sign-ups in a day
            "resourcesIds": [], //Saves ids of those resources which are opened and given feedback in a day
            "female_rating": [],//Rating count against each resource opened and rated by females in a day
            "female_timesRated": [], //Count of how many times a resource has been rated by females in a day
            "male_rating": [],//Rating count against each resource opened and rated by males in a day
            "male_timesRated": [],//Count of how many times a resource has been rated by males in a day
            "resources_opened": [],//Ids of opened resources in a day.These ids are actually coming from resources db.
            "resources_names": [], //Names of opened resources in a day
            "female_opened": [], //Ids of opened resources by females in a day
            "male_opened": [],//Ids of opened resources by males in a day
            "community": "Text" //Code of current community(value of 'code' from configurations model)
        }
    })

});

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
            kind: 'survey',//Saves kind of document according to corresponding db's.Mostly used in couch db views.
            sentTo: [],//This array attribute saves 'names' of those communities to which a particular survey has been sent from nation.It saves value of 'name' attribute from configurations of community
            submittedBy: [],//This array attribute saves 'names' of those communities who submitted response of a particular survey to nation.It saves value of 'name' attribute from configurations of community
            questions: [],//Ids of questions added in a survey.These ids are actually coming from surveyquestions db.
            answersToQuestions: [],//Ids of answer docs for questions added in a survey.These ids are actually coming from surveyanswers db.
            genderOfMember: '', //Gender of member who is submitting his/her response to a particular survey
            birthYearOfMember: '', //BirthDate of member who is submitting his/her response to a particular survey
            communityName: '',//Name of community to which member(who is submitting his/her response to a particular survey) belongs.It saves value of 'name' attribute from configurations of community
            memberId: '',//This value is a resultant of member login id + value of community attribute of that member's doc.This attribute is used to differentiate b/w multiple survey response docs of same survey
            receiverIds: []//This array attribute saves memberIds(as explained above) of those members to which survey has been sent
        },

        schema: {
            Date: 'Text',//Date when survey was added
            SurveyNo: 'Number',//Unique identification number of a survey.
            SurveyTitle:'Text' //Title of a survey
        }

    })
});

$(function() {

    App.Models.Question = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/surveyquestions/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/surveyquestions/' + this.id // For READ
            } else {
                var url = App.Server + '/surveyquestions' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'surveyquestions'//Saves kind of document according to corresponding db's.Mostly used in couch db views.
        },

        schema: {
            Type: 'Text', //Type of question, e.g: MCQ, Rating Scale etc.
            Statement: 'Text', //Question statement.
            Answer: [], //This array attribute saves answer(s) of a question when a user submit survey response.
            Options: [],//This array attribute saves options of a question(only applicable for MCQ and Rating Scale)
            Ratings: [],//This array attribute saves rating options of a question(only applicable for Rating Scale)
            RequireAnswer: false //Saves information whether answer of a question is required or not.True means required, false means optional.
        }

    })
});

/**
 * Created by saba.baig on 6/6/2016.
 */
$(function() {

    App.Models.AdminMember = Backbone.Model.extend({

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
            kind: "Member", //Saves kind of document according to corresponding db's. Mostly used in couch db views.
            "roles": ["Manager", "SuperManager"], //by default assigned roles of administrator
            bellLanguage:""    //Stores the language in which a user wants to render application
        },

        toString: function() {
            return this.get('login') + ': ' + this.get('firstName') + ' ' + this.get('lastName')
        },
        schema: {
            firstName: {
                type:'Text'
            },
            lastName: {
                type:'Text'
            },
            middleNames: 'Text',
            login: {
                type:'Text'
            },
            password: {
                type:'Text'
            },
            phone: 'Text',
            email: 'Text',
            language: 'Text', // Saves language which member speaks OR native/mother language of administrator
            BirthDate: 'Date',
            visits: 'Text',    //Total count of visits by administrator
            Gender: {
                type: 'Select',
                // options: ['Male', 'Female']
                options: [{
                    val: 'Male',
                    label: 'Male'
                }, {
                    val: 'Female',
                    label: 'Female'
                }]
            },
            levels: {    //Grade level of administrator (Super Manager)
                type: 'Select',
                options: [{
                    val: '1',
                    label: '1'
                }, {
                    val: '2',
                    label: '2'
                }, {
                    val: '3',
                    label: '3'
                }, {
                    val: '4',
                    label: '4'
                }, {
                    val: '5',
                    label: '5'
                }, {
                    val: '6',
                    label: '6'
                }, {
                    val: '7',
                    label: '7'
                }, {
                    val: '8',
                    label: '8'
                }, {
                    val: '9',
                    label: '9'
                }, {
                    val: '10',
                    label: '10'
                }, {
                    val: '11',
                    label: '11'
                }, {
                    val: '12',
                    label: '12'
                }, {
                    val: 'Higher',
                    label: 'Higher'
                }]
                //  options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Higher']
            },
            status: 'Text', //Saves status which tells us that whether a member is active/de-active.If a member well resign, then he will be deactivated
            yearsOfTeaching: { //Total teaching experience of administrator
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
            community: 'Text',  //Contains the value of 'code' from configurations.
            region: 'Text',  //Region name of member/its community
            nation: 'Text', //Name of nation to which community(in which administrator exists) is registered.
            lastLoginDate:'Date', // Saves date when last time administrator logged in
            lastEditDate:'Date'  // Saves date when last time administrator updated his/her profile
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