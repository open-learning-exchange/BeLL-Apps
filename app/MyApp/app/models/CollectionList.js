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
            descriptionOutput: {
                type: 'TextArea',
                fieldAttrs: {id:'collection_description',class:'bbf-field redactor_textbox'}
            },
            description: {
                type: 'TextArea',
                fieldAttrs: {id:'markdown_collection_description',class:'bbf-field redactor_textbox'}
            },
            NesttedUnder: {        //To make one collection nested under another.
                title: 'Nested Under',
                type: 'Select',
                options: [{val:'--Select--',label:'--Select--'}]
            },
            AddedBy: 'Text',
            AddedDate: 'Text'
        }

    })
})