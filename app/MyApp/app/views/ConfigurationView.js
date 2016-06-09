$(function() {

	App.Views.ConfigurationView = Backbone.View.extend({

		template: _.template($("#template-Configuration").html()),
		vars: {},
		events: {
			"click #saveLanguage": function(e) {
				var isChanged = false
				var selectedVal = $("#languageSelection").val()
				if (selectedVal != "") {
					this.model.set('currentLanguage', selectedVal)
					isChanged = true
				}
				if ($('#appversion').val() != "") {
					this.model.set('version', $('#appversion').val())
					isChanged = true
				}
				if ($('#notes').val() != "") {
					this.model.set('notes', $('#notes').val())
					isChanged = true
				}
				if (isChanged) {
					var that = this
					this.model.save(null, {
						success: function(response, model) {
							that.model.set("_rev", response.get("rev"))
						}
					})
					alert(App.languageDict.attributes.Config_Saved)
					location.reload()
				} else {
					alert(App.languageDict.attributes.No_Changes)
				}
			}
		},
		render: function() {
			this.vars = this.model.toJSON()
			this.$el.html(this.template(this.vars))
			this.$el.append('<br>&nbsp;&nbsp;<button class="btn btn-success" id="saveLanguage" >Save</button>')
		}

	})

})