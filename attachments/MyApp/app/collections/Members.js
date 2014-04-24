$(function () {

    App.Collections.Members = Backbone.Collection.extend({

       url: function() {
			if(this.login)
			{
				return App.Server + '/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + this.login + '"'
			}
			else if(this.skip)
			{
			  return App.Server + '/members/_design/bell/_view/Members?include_docs=true&limit=20&skip='+this.skip
			}
			else
			{
				return App.Server + '/members/_design/bell/_view/Members?include_docs=true'
			}
		},

        parse: function (response) {
            var docs = _.map(response.rows, function (row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Member,

        comparator: function (model) {
            var title = model.get('login')
            if (title) return title.toLowerCase()
        }


    })

})