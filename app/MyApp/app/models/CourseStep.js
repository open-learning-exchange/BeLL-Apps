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
            kind: "Course Step", // Saves kind of document according to corresponding db's.Mostly used in couch db views.
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
            totalMarks: {
                type: 'Text'
            },
            courseId: 'Text',
            resourceId: {   //list of IDs of resources attached with any step(level). These IDs are coming from resources database.
                type: 'Select',
                options: []
            },
            resourceTitles: { //Names of all those resources which are attached with given step.
                type: 'Select',
                options: []
            },
             questionslist: {  //Statements of Question(s) list added, if the step has an outcome/type as Quiz
                type: 'Select',
                options: []
            },
            passingPercentage: { //Least marks to be obtained for passing any step
                type: 'Select',
                options: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
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