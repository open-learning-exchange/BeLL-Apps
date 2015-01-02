$(function () {

    App.Collections.MemberGroups = Backbone.Collection.extend({

        url: function () {
            return App.Server + '/groups/_design/bell/_view/GetCourses?key="' + $.cookie('Member._id') + '"&include_docs=true'
        },

        parse: function (results) {
            var m = []
            var memberId = this.memberId
            var i
            for (i = 0; i < results.rows.length; i++) {
                m.push(results.rows[i].doc)
            }
            return m
        },

        model: App.Models.Group,
        comparator: function (model) {
            var title = model.get('name')
            if (title) return title.toLowerCase()
        }
    })

})