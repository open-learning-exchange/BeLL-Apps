$(function() {

    App.Models.Community = Backbone.Model.extend({

        idAttribute: "_id",
        server: '',
        url: function() {
            console.log(this.server);
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? 'http://'+ this.server + '/community/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    :  'http://'+ this.server +'/community/' + this.id // For READ

            } else {
                var url = 'http://'+ this.server +'/community' // for CREATE
            }
            console.log(url);
            return url
        }

    })

})