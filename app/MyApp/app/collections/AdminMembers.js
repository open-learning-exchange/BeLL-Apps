/**
 * Created by saba.baig on 6/6/2016.
 */
$(function() {

    App.Collections.AdminMembers = Backbone.Collection.extend({

        url: function() {
            if (this.login) {
                return App.Server + '/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + this.login + '"'
            } else if (this.skip) {
                return App.Server + '/members/_design/bell/_view/Members?include_docs=true&limit=20&skip=' + this.skip
            } else if (this.searchText && this.searchText != "") {
                return App.Server + '/members/_design/bell/_view/search?include_docs=true&limit=20&key="' + this.searchText + '"'
            } else {
                return App.Server + '/members/_design/bell/_view/Members?include_docs=true'
            }
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        initialize: function() {
            this.sort_key = 'lastName';
        },
        comparator: function(a, b) {
            // Assuming that the sort_key values can be compared with '>' and '<',
            // modifying this to account for extra processing on the sort_key model
            // attributes is fairly straight forward.
            a = a.get(this.sort_key);
            b = b.get(this.sort_key);
            if (a > b)
                console.log("before")
            return a > b ? 1 : a < b ? -1 : 0;
        },

        model: App.Models.AdminMember

        //   comparator: function (model) {
        //             var title = model.get('login')
        //             if (title) return title.toLowerCase()
        //         }


    })

})