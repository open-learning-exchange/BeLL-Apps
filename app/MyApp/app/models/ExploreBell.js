$(function() {

    App.Models.ExploreBell = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/explorebell/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/explorebell/' + this.id // For READ
            } else {
                var url = App.Server + '/explorebell' // for CREATE
            }

            return url
        }


    })

})