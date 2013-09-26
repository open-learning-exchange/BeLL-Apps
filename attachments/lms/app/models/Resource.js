/*

@todo Implement vocabularies on this Model

Controlled Vocabulary:

Subject
AGR (Agriculture)
BUS (Business and Finance)
FAS (Fine Arts)
FNU (Food and Nutrition)
GEO (Geography)
HMD (Health & Medicine)
HIS (History)
HDV (Human Development)
LAN (Languages)
LAW (Law)
LEA (Learning)
LIT (Literature)
MAT (Math)
MUS (Music)
POL (Politics & Government)
REF (Reference)
REL (Religion)
SCI (Science)
SOC (Social Sciences)
SPO (Sports)
TEC (Technology)

Level:
EE (Early Education)
LP (Lower Primary)
UP (Upper Primary)
LS (Lower Secondary)
US (Upper Secondary)
UG (Undergraduate)
GR (Graduate)
PR (Professional)

Subject.Level (All Possible)
AGR.EE, AGR.LP, AGR.UP, AGR.LS, AGR.US, AGR.UG, AGR.GR, AGR.PR
BUS.EE, BUS.LP, BUS.UP, BUS.LS, BUS.US, BUS.UG, BUS.GR, BUS.PR
FAS.EE, FAS.LP, FAS.UP, FAS.LS, FAS.US, FAS.UG, FAS.GR, FAS.PR
FNU.EE, FNU.LP, FNU.UP, FNU.LS, FNU.US, FNU,UG, FNU.GR, FNU.PR
GEO.EE, GEO.LP, GEO.UP, GEO.LS, GEO.US, GEO.UG, GEO.GR, GEO.PR
HMD.EE, HMD.LP. HMD.UP, HMD.LS, HMD.US, HMD.UG, HMD.GR, HMD.PR
HIS.EE, HIS.LP, HIS.UP, HIS.LS, HIS.US, HIS.UG, HIS.GR, HIS.PR
HDV.EE, HDV.LP, HDV.UP, HDV.LS, HDV.US, HDV.UG, HDV.GR, HDV.PR
LAN.EE, LAN.LP, LAN.UP, LAN.LS, LAN.US, LAN.UG, LAN.GR, LAN.PR
LAW.EE, LAW.LP, LAW.UP, LAW.LS, LAW.US, LAW.UG, LAW.GR, LAW.PR
LEA.EE, LEA.LP, LEA.UP, LEA.LS, LEA.US, LEA.UG, LEA.GR, LEA.PR
LIT.EE, LIT.LP, LIT.UP, LIT.LS, LIT.US, LIT.UG, LIT.GR, LIT.PR
MAT.EE, MAT.LP, MAT.UP, MAT.LS, MAT.US, MAT.UG, MAT.GR, MAT.PR
MUS.EE, MUS.LP, MUS.UP, MUS.LS, MUS.US, MUS.UG, MUS.GR, MUS.PR
POL.EE, POL.LP, POL.UP, POL.LS, POL.US, POL.UG, POL.GR, POL.PR
REF.EE, REF.LP, REF.UP, REF.LS, REF.US, REF.UG, REF.GR, REF.PR
REL.EE, REL.LP, REL.UP, REL.LS, REL.US, REL.UG, REL.GR, REL.PR
SCI.EE, SCI.LP, SCI.UP, SCI.LS, SCI.US, SCI.UG, SCI.GR, SCI.PR
SOC.EE, SOC.LP, SOC.UP, SOC.LS, SOC.US, SOC.UG, SOC.GR, SOC.PR
SPO.EE, SPO.LP, SPO.UP, SPO.LS, SPO.US, SPO.UG, SPO.GR, SPO.PR
TEC.EE, TEC.LP, TEC.UP, TEC.LS, TEC.US, TEC.UG, TEC.GR, TEC.PR

C3
C3

Fiction/Non-Fiction
-Instead of tagging all 800 resources as fiction or non-fiction, I am only tagging the outliers in certain fields (i.e. a comic book in the science section I tagged as fiction) although if necessary, I can tag them all. 

Length OR Classification
Picture Books (Short) - 15 pages or under
Picture Books (Long) - 15 pages or over
Chapter Books (Short) - Under 100 pages
Chapter Books (Long) - Over 100 pages
Drama (Short) - 2 acts or under
Drama (Long)- Over 2 acts
Short Stories
Fables
Fairy Tales
Nursery Rhymes

AND/OR

Audiobook
Mp3s
Video


Specific Tags
-I have been using LCSH (Library of Congress Subject Headings) as it is the current industry standard. However, if we are just going to initiate free tags, I can and probably should stop. 

*/

$(function() {

  App.Models.Resource = Backbone.Model.extend({

    idAttribute: "_id",

    url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/resources/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/resources/' + this.id // For READ
      }
      else {
        var url = App.Server + '/resources' // for CREATE
      }
      return url
    },

    defaults: {
      kind: 'Resource'
    },

    schema: {
      title: 'Text',
      description: 'Text',
      openWith: {
        type: 'Select',
        options: [ 'HTML', 'PDF.js', 'Flow Video Player', 'BeLL Video Book Player' ]
      },
      openURL: 'Text'
    },
    
    saveAttachment: function(formEl, fileEl, revEl) {

      // Work with this doc in the files database
      var server = App.Server
      var input_db = "resources"
      var input_id = (this.get('_id'))
        ? this.get('_id')
        : this.get('id')
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
                  url: server + "/"+ input_db +"/"+ input_id,
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
              url: server + "/"+ input_db +"/"+ input_id,
              success: function(response) {
                model.trigger('savedAttachment')
              }
            })
          }

        }, // End success, we have a Doc
        
        // @todo I don't think this code will ever be run.
        // If there is no CouchDB document with that ID then we'll need to create it before we can attach a file to it.
        error: function(status) {
          $.couch.db(input_db).saveDoc({"_id":input_id}, {
            success: function(couchDoc) {
              // Now that the Couch Doc exists, we can submit the attachment,
              // but before submitting we have to define the revision of the Couch
              // Doc so that it gets passed along in the form submit.
              $(revEl).val(couchDoc.rev);
              // @todo This file submit stopped working. Couch setting coming from different origin? 
              $(formEl).ajaxSubmit({
                // Submit the form with the attachment
                 url: "/"+ input_db +"/"+ input_id,
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

})
