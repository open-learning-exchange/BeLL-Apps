$(function() {

	App.Views.PublicationTable = Backbone.View.extend({

		authorName: null,
		tagName: "table",
		className: "table table-striped",
		collectionInfo: [],
		add: function(model) {
			this.collectionInfo[model._id] = [model.resources, model.courses, model.IssueNo]
			console.log(this.collectionInfo)
			this.$el.append('<tr><td>' + model.IssueNo + '</td><td><a name="' + model._id + '" class="synPublication btn btn-info">Sync publication</a></td></tr>')
		},
		events: {
			"click .synPublication": 'synPublication',
		},
		render: function() {

			this.$el.html('<tr><th>Issue Number</th><th>Actions</th></tr>')
			var that = this
			var DbUrl = this.Url
			$.ajax({
				url: DbUrl,
				type: 'GET',
				dataType: "jsonp",
				success: function(json) {
					//console.log(json)
					_.each(json.rows, function(row) {
						that.add(row.doc)
					})
				}
			})
		},
		synPublication: function(e) {
			console.log(e)
			var pubId = e.currentTarget.name
			resourcesIdes = this.collectionInfo[pubId][0]
			coursesIdes = this.collectionInfo[pubId][1]
			IssueNo = this.collectionInfo[pubId][2]

			var nationUrl = App.configuration.get('nationUrl')
			var nationName = App.configuration.get('nationName')

			this.syncCourses(nationUrl, nationName, coursesIdes, IssueNo)
			this.synResources(nationUrl, nationName, resourcesIdes, IssueNo)

		},
		synResources: function(nationUrl, nationName, resourcesIdes, IssueNo) {
			console.log('http://' + nationName + ':' + App.password + '@' + nationUrl + ':5984/resources')
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": 'http://' + nationName + ':' + App.password + '@' + nationUrl + ':5984/resources',
					"target": 'resources',
					'doc_ids': resourcesIdes
				}),
				success: function(response) {
					console.log(response)
					alert('Publication "' + IssueNo + '" Resources successfully Synced')
				},
			})
		},
		syncCourses: function(nationUrl, nationName, coursesIdes, IssueNo) {
			console.log('http://' + nationName + ':' + App.password + '@' + nationUrl + ':5984/courses')
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": 'http://' + nationName + ':' + App.password + '@' + nationUrl + ':5984/courses',
					"target": 'courses',
					'doc_ids': coursesIdes
				}),
				success: function(response) {
					console.log(response)
					alert('Publication "' + IssueNo + '" Courses successfully Synced')
				},
			})
		}

	})

})