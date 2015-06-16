$(function() {
	App.Views.TutorsSpans = Backbone.View.extend({

		tagName: "tr",

		addOne: function(model) {
			var modelView = new App.Views.TutorSpan({
				model: model
			})
			modelView.render()
			$('#tutorTable').append(modelView.el)
		},

		addAll: function() {

			////temporary
			if ($.cookie('Member._id') == "821d357b8f3ba3c09836c91bebcb29d7") {
				var temp = ["English", "Algebra", "Midwifery"]
				for (var i = 0; i < 3; i++) {
					this.addOne(temp[i], this)
				}
			} else {

				if (this.collection.length != 0) {
					this.collection.each(this.addOne, this)
				} else {

					$('#tutorTable').append("<td class='course-box'>No Tutor</td>")
				}
			}
		},

		render: function() {
			//this.addAll()
			$('#tutorTable').append("<td class='course-box'> functionality is under construction </td>")
		}

	})

})