$(function() {

	App.Collections.MailUnopened = Backbone.Collection.extend({

		initialize: function(e) {
			if (e) {
				if (e.receiverId) {
					this.url = App.Server + '/mail/_design/bell/_view/unopened?key="' + e.receiverId + '"'
				} else {
					console.log("unable to find receiverId in MailUnopened Collection")
				}
			}

		},

		parse: function(response) {
			var docs = _.map(response.rows, function(row) {
				return row.doc
			})
			return docs
		}



	})

})