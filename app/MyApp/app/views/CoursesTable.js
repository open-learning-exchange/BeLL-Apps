$(function() {
	App.Views.CoursesTable = Backbone.View.extend({

		tagName: "table",

		className: "btable btable-striped",
		roles: null,

		addOne: function(model) {
			var courseRow = new App.Views.CourseRow({
				model: model,
				roles: this.roles
			})
			courseRow.courseId = this.courseId
			courseRow.render()
			this.$el.append(courseRow.el);
		},

        changeDirection : function (){
			var languageDictValue;
			var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
			App.languageDict = languageDictValue;
			var directionOfLang = App.languageDict.get('directionOfLang');
			if(directionOfLang.toLowerCase() ==="right") {
                var library_page = $.url().data.attr.fragment;
                if(library_page == "courses") {
                    $('#parentLibrary').addClass('addResource');

                }
            } else {
                $('#parentLibrary').removeClass('addResource');
            }
        },

		events: {
			"click .pageNumber": function(e) {
				this.collection.startkey = ""
				this.collection.skip = e.currentTarget.attributes[0].value
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			}
		},

		addAll: function() {
			var languageDictValue;
			var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
			App.languageDict = languageDictValue;
			var languageDict = languageDictValue;
			var directionOfLang = App.languageDict.get('directionOfLang');
            this.$el.html("<tr><th style='width: 430px'>"+languageDictValue.attributes.Title+"</th><th colspan='7'>"+languageDictValue.attributes.action+"</th></tr>")
			var manager = new App.Models.Member({
				_id: $.cookie('Member._id')
			})
			manager.fetch({
				async: false
			})
			this.roles = manager.get("roles")
			// @todo this does not work as expected, either of the lines
			// _.each(this.collection.models, this.addOne())

			this.collection.forEach(this.addOne, this)
			var courseLength;
			var context = this
			$.ajax({
				url: '/courses/_design/bell/_view/count?course=false',
				type: 'GET',
				dataType: "json",
				success: function(json) {
					//courseLength = json.rows[0].value //when empty data are fetched it will show undefined error
					if (context.displayCollec_Resources != true) {
						var pageBottom = "<tr><td colspan=7>"
						var looplength = courseLength / 20

						for (var i = 0; i < looplength; i++) {
							if (i == 0)
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">'+languageDict.attributes.Home+'</a>&nbsp&nbsp'
							else
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
						}
						pageBottom += "</td></tr>"
						context.$el.append(pageBottom)
					}
				}
			})
		},

		render: function() {
			var directionOfLang = App.languageDict.get('directionOfLang');
			if(directionOfLang.toLowerCase() === "right") {
                $('link[rel=stylesheet][href~="app/Home.css"]').attr('disabled', 'false');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').removeAttr('disabled');
            } else {
                $('link[rel=stylesheet][href~="app/Home.css"]').removeAttr('disabled');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').attr('disabled', 'false');
            }
			this.collection.skip = 0
			this.addAll();
		}
	})

})