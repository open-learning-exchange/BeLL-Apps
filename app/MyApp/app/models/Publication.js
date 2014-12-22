$(function () {

    App.Models.Publication = Backbone.Model.extend({

        idAttribute: "_id",

        url: function () {
        if(this.recPub==true)
        {
        	    if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/recpublication/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                : App.Server + '/recpublication/' + this.id // For READ
            } else {
                var url = App.Server + '/recpublication' // for CREATE
            }
        
        }
        else
        {
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
            kind: 'publication'
        },

        schema: {
            Date: 'Text',
            IssueNo:'Number',
            editorName:'Text',
            editorEmail:'Text',
            editorPhone:'Text',
            resources:{
                type:'Select',
                options:[]
            }
//            ,
//            resources:{
//                type:'Select',
//                options:[]
//            }
        },
        setUrl: function(newUrl) {
            this.url = newUrl;
        }
    })

})