$(function() {

	App.Views.ResourcesTable = Backbone.View.extend({

		tagName: "table",
		isAdmin: null,
		className: "table table-striped",
		//template: $('#template-ResourcesTable').html(),
		events: {
			"click #backButton": function(e) {
				if (this.collection.skip > 0) {
					this.collection.skip = parseInt(this.collection.skip) - 20
				}
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},
			"click #nextButton": function(e) {

				this.collection.skip = parseInt(this.collection.skip) + 20
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},
			"click .clickonalphabets": function(e) {
				this.collection.skip = 0
				var val = $(e.target).text()
				this.collection.startkey = val
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}

			},
			"click #allresources": function(e) {
				this.collection.startkey = ""
				this.collection.skip = 0
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},
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
		initialize: function() {
			//this.$el.append(_.template(this.template))

		},
		addOne: function(model) {
			var members = new App.Collections.Members()
			var member;
			var languageDictValue;
			members.login = $.cookie('Member.login');
			members.fetch({
				success: function () {
					if (members.length > 0) {
						member = members.first();
						var lang=member.get('bellLanguage');
						languageDictValue=getSpecificLanguage(lang);
					}
				},
				async:false

			});
			App.languageDict=languageDictValue;
			var resourceRowView = new App.Views.ResourceRow({
				model: model,
				admin: this.isAdmin
			})
			resourceRowView.isManager = this.isManager
			resourceRowView.displayCollec_Resources = this.displayCollec_Resources

			resourceRowView.collections = this.collections

			resourceRowView.render()
			this.$el.append(resourceRowView.el);
            if (App.languageDict.get('directionOfLang').toLowerCase()==="right")
			{
				$('.resourcInfoFirstCol').attr('colspan','8');
				$('.resourcInfoCol').attr('colspan','3');

			}
		},

		addAll: function() {
			var members = new App.Collections.Members()
			var member;
			var languageDictValue;
			members.login = $.cookie('Member.login');
			members.fetch({
				success: function () {
					if (members.length > 0) {
						member = members.first();
						var lang=member.get('bellLanguage');
						languageDictValue=getSpecificLanguage(lang);
					}
				},
				async:false

			});
			App.languageDict=languageDictValue;
			if (this.collection.length == 0) {
                if (App.languageDict.get('directionOfLang').toLowerCase()==="right"){
					this.$el.append("<tr><td style='width: 630px;text-align:right' colspan='8'>"+App.languageDict.attributes.No_Resource_Found+"</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
				}
				else{
					this.$el.append("<tr><td style='width: 630px;'>"+App.languageDict.attributes.No_Resource_Found+"</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
				}
			}
			if (this.isadmin > -1) {
				this.isAdmin = 1
			} else {
				this.isAdmin = 0
			}
			this.collection.forEach(this.addOne, this)
		},
        changeDirection : function (){
			var members = new App.Collections.Members()
			var member;
			var languageDictValue;
			members.login = $.cookie('Member.login');
			members.fetch({
				success: function () {
					if (members.length > 0) {
						member = members.first();
						var lang=member.get('bellLanguage');
						languageDictValue=getSpecificLanguage(lang);
					}
				},
				async:false

			});
			App.languageDict=languageDictValue;
            if (App.languageDict.get('directionOfLang').toLowerCase()==="right")
            {
                var library_page = $.url().data.attr.fragment;
                if(library_page=="resources")
                      {
                    $('#parentLibrary').addClass('addResource');
                }
            }
            else
            {
                $('#parentLibrary').removeClass('addResource');
            }
        },
		render: function() {

			if (this.displayCollec_Resources != true) {

				this.$el.html("")
				var members = new App.Collections.Members()
				var member;
				var languageDictValue;
				members.login = $.cookie('Member.login');
				members.fetch({
					success: function () {
						if (members.length > 0) {
							member = members.first();
							var lang=member.get('bellLanguage');
							languageDictValue=getSpecificLanguage(lang);
						}
					},
					async:false

				});
				App.languageDict=languageDictValue;
				if (this.removeAlphabet == undefined) {
					var viewText = "<tr></tr>"
					viewText += "<tr><td colspan=7  style='cursor:default' >"
					viewText += '<a  id="allresources">#</a>&nbsp;&nbsp;'
                    var str = [] ;
					str = App.languageDict.get("alphabets");
					for (var i = 0; i < str.length; i++) {
						var nextChar = str[i];
						viewText += '<a class="clickonalphabets"  value="' + nextChar + '">' + nextChar + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
					}
					viewText += "</td></tr>"
					this.$el.append(viewText);
                    if (App.languageDict.get('directionOfLang').toLowerCase()==="right")
                    {
                        $('#alphabetsOfLanguage').addClass('addResource');
                    }

				}
			}

			this.$el.append('<br/><br/>')
            if (App.languageDict.get('directionOfLang').toLowerCase()==="left")
			{
				this.$el.append("<tr id='actionAndTitle'><th style='width: 430px;'>"+App.languageDict.attributes.Title+"</th><th colspan='6'>"+App.languageDict.attributes.action+"</th></tr>")
			}
			else {
				this.$el.append("<tr id='actionAndTitle'><th style='width: 430px;'>"+App.languageDict.attributes.Title+"</th><th colspan='26' style='text-align: center'>"+App.languageDict.attributes.action+"</th></tr>")
			}
			this.addAll()

			var text = '<tr><td>'

			if (this.collection.skip != 0) {
				text += '<a class="btn btn-success" id="backButton" >'+App.languageDict.attributes.Back+'</a>&nbsp;&nbsp;'
			}

			if (this.collection.length >= 20)
				text += '<a class="btn btn-success" id="nextButton">'+App.languageDict.attributes.Next+'</a>'

			text += '</td></tr>'
			this.$el.append(text)



			var resourceLength;
			var context = this
			if (this.removeAlphabet == undefined) {
				$.ajax({
					url: '/resources/_design/bell/_view/count?group=false',
					type: 'GET',
					dataType: "json",
					success: function(json) {
						if (json.rows[0]) {
							resourceLength = json.rows[0].value;
						}
						if (context.displayCollec_Resources != true) {
							var pageBottom = "<tr><td colspan=7><p style='width: 940px; word-wrap: break-word;'>"
							var looplength = resourceLength / 20
							for (var i = 0; i < looplength; i++) {
								if (i == 0)
									pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">'+languageDictValue.attributes.Home+'</a>&nbsp&nbsp'
								else
									pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
							}
							pageBottom += "</p></td></tr>"
							context.$el.append(pageBottom)
						}

					}
				})

			}
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));

		}

	})

})