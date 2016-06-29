$(function() {

    App.Models.VipLink = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/viplinks/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/viplinks/' + this.id // For READ

            } else {
                var url = App.Server + '/viplinks' // for CREATE
            }
            return url
        }

    })

})