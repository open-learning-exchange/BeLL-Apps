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
            senderId: 'Text',  //ID of the person who submitted the document (i.e Learner's ID)
            courseId: 'Text', //Refers to course which had that paper step
            stepId: 'Text',  //Refers to step against which the document was submitted. Its type will be either paper or Paper and Quiz both.
            questionId: 'Text',// Refers to Question ID
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
                    console.log(_.has(couchDoc, '_attachments'));
                    // If the current doc has an attachment we need to clear it for the new attachment
                    if (_.has(couchDoc, '_attachments')) {
                        $.ajax({
                            url: '/assignmentpaper/' + couchDoc._id + '/' + _.keys(couchDoc._attachments)[0] + '?rev=' + couchDoc._rev,
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
})