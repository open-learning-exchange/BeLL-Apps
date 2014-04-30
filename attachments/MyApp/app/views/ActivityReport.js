$(function () {

	App.Views.ActivityReport = Backbone.View.extend({
		vars: {},
		events: {

		},
		template: $('#template-ActivityReport').html(),
		initialize: function () {

		},
		render: function () {
			var context = this;
			$.ajax({
				url: '/members/_design/bell/_view/MaleCount?group=false',
				type: 'GET',
				dataType: "json",
				success: function (json) {
					context.vars = context.data
					context.vars.MaleMembers = json.rows[0].value
					$.ajax({
						url: '/members/_design/bell/_view/FemaleCount?group=false',
						type: 'GET',
						dataType: "json",
						success: function (json) {
							context.vars.FemaleMembers = json.rows[0].value
							context.vars.startDate = context.startDate
							context.vars.endDate = context.endDate
							context.vars.CommunityName = context.CommunityName
							context.$el.html(_.template(context.template, context.vars));

						}
					})
				}
			})


		}
	})

})