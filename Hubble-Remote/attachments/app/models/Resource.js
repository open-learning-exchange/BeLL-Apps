$(function() {

  App.Models.Resource = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      var url = (this.get('id'))
        ? '/' + App.thisDb + '/' + this.get('id') + "?rev=" + this.get('rev')
        : '/' + App.thisDb

      return "/" + window.thisDb
    },

    defaults: {
      kind: "Resource"
    },

    schema: {
      name: 'Text',
      description: 'Text',
      openWith: { type: 'Select', options: ['PDFjs', 'Download Only'] },
    },
    
    saveAttachment: function(formEl, fileEl, revEl) {

            // Work with this doc in the files database
            var input_db = 'files'
            var input_id = (this.get('_id'))
              ? this.get('_id')
              : this.get('id')
            //var input_rev = $('.documentForm input#_rev').val()
           
            // Start by trying to open a Couch Doc at the _id and _db specified
            $.couch.db(input_db).openDoc(input_id, {
              // If found, then set the revision in the form and save
              success: function(couchDoc) {
                // Defining a revision on saving over a Couch Doc that exists is required.
                // This puts the last revision of the Couch Doc into the input#rev field
                // so that it will be submitted using ajaxSubmit.
                $(revEl).val(couchDoc._rev);
                 
                // Submit the form with the attachment
                $(formEl).ajaxSubmit({
                  url: "/"+ input_db +"/"+ input_id,
                  success: function(response) {
                    alert("Your attachment was submitted.")
                  }
                })
              }, // End success, we have a Doc
              
              // If there is no CouchDB document with that ID then we'll need to create it before we can attach a file to it.
              error: function(status) {
                $.couch.db(input_db).saveDoc({"_id":input_id}, {
                  success: function(couchDoc) {
                    // Now that the Couch Doc exists, we can submit the attachment,
                    // but before submitting we have to define the revision of the Couch
                    // Doc so that it gets passed along in the form submit.
                    $(revEl).val(couchDoc.rev);
                    $(formEl).ajaxSubmit({
                      // Submit the form with the attachment
                      url: "/"+ input_db +"/"+ input_id,
                      success: function(response) {
                        alert("Your attachment was submitted.")
                      }
                    })
                  }
                })
              } // End error, no Doc
   
            }) // End openDoc()
    }

  })

})
