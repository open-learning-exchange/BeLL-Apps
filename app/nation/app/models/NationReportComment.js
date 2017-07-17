$(function() {

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
            commentOutput: {
                type: 'TextArea',
                fieldAttrs: {id:'report_comment',class:'bbf-field redactor_textbox'}
            },
            comment: {
                type: 'TextArea',
                fieldAttrs: {id:'markdown_report_comment',class:'bbf-field redactor_textbox'}
            },
            memberLogin: 'Text',
            time: 'Text'
        }
    })

})