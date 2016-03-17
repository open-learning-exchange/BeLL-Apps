$(function() {
	App.Views.GroupsTable = Backbone.View.extend({

		tagName: "table",

		className: "btable btable-striped",
		roles: null,

		addOne: function(model) {
         //   alert("addOne is called...");
			var groupRow = new App.Views.GroupRow({
				model: model,
				roles: this.roles
			})
			groupRow.courseId = this.courseId
			groupRow.render()
			this.$el.append(groupRow.el);


		},
        changeDirection : function (){
			var members = new App.Collections.Members()
			var member;
			var languageDictValue;
			members.login = $.cookie('Member.login');
			var clanguage = '';
			members.fetch({
				success: function () {
					if (members.length > 0) {
						member = members.first();
						clanguage = member.get('bellLanguage');
						languageDictValue = getSpecificLanguage(clanguage);
					}
				},
                async: false
			});
			App.languageDict = languageDictValue;
			var directionOfLang = App.languageDict.get('directionOfLang');
			if(directionOfLang.toLowerCase()==="right")
            {
                var library_page = $.url().data.attr.fragment;
                if(library_page=="courses")
                {
                    $('#parentLibrary').addClass('addResource');

                }
            }
            else
            {
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
			var members = new App.Collections.Members()
			var member;
			var languageDictValue;
			members.login = $.cookie('Member.login');
			var clanguage = '';
			members.fetch({
				success: function () {
					if (members.length > 0) {
						member = members.first();
						clanguage = member.get('bellLanguage');
						languageDictValue = getSpecificLanguage(clanguage);
					}
				},
                async: false
            });
			App.languageDict = languageDictValue;
			var languageDict = languageDictValue;
			var directionOfLang = App.languageDict.get('directionOfLang');
			this.$el.html("<tr><th>"+languageDictValue.attributes.Title+"</th><th colspan='0'>"+languageDictValue.attributes.action+"</th></tr>")
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

			var groupLength;
			var context = this
			$.ajax({
				url: '/groups/_design/bell/_view/count?group=false',
				type: 'GET',
				dataType: "json",
				success: function(json) {
					groupLength = json.rows[0].value
					if (context.displayCollec_Resources != true) {
						var pageBottom = "<tr><td colspan=7>"
						var looplength = groupLength / 20

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
			if(directionOfLang.toLowerCase()==="right")
            {
                $('link[rel=stylesheet][href~="app/Home.css"]').attr('disabled', 'false');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').removeAttr('disabled');
            }
            else
            {
                $('link[rel=stylesheet][href~="app/Home.css"]').removeAttr('disabled');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').attr('disabled', 'false');

            }
			this.collection.skip = 0
			this.addAll();
          //  location.reload();
		}

	})

})