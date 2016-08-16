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

})