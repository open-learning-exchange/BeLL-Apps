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
               // $('.body').removeClass();
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
           // alert("Add one is called");
			var resourceRowView = new App.Views.ResourceRow({
				model: model,
				admin: this.isAdmin
			})
			resourceRowView.isManager = this.isManager
			resourceRowView.displayCollec_Resources = this.displayCollec_Resources

			resourceRowView.collections = this.collections

			resourceRowView.render()
			this.$el.append(resourceRowView.el);
            this.$('#openButton').html(App.languageDict.attributes.Open);
            this.$('#viewDetailsButton').html(App.languageDict.attributes.View+App.languageDict.attributes.Details);
            this.$('#addToMyLibraryButton').html(App.languageDict.attributes.Add_to_my_library);
            this.$('#feedbackButton').html(App.languageDict.attributes.Feedback);
            this.$('#deleteButton').html(App.languageDict.attributes.Delete);
            this.$('#hideButton').html(App.languageDict.attributes.Hide);

         //   alert(this.$el.find('#openButton').val());
		},

		addAll: function() {
			if (this.collection.length == 0) {
				this.$el.append("<tr><td width: 630px;>"+App.languageDict.attributes.No_Resource_Found+"</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
			}
			if (this.isadmin > -1) {
				this.isAdmin = 1
			} else {
				this.isAdmin = 0
			}
			this.collection.forEach(this.addOne, this)
		},
        changeDirection : function (){
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var con = config.first();
            var currentConfig = config.first().toJSON().rows[0].doc;
            var clanguage= currentConfig.currentLanguage;
            if(clanguage=="Urdu")
            {
                var library_page = $.url().data.attr.fragment;
                if(library_page=="resources")
                      {
                //    alert("Hello")
                    $('.body').addClass('addResource');
                }

                // $('.table-striped').css({direction:rtl});
            }
            else
            {
                $('.body').removeClass('addResource');
            }
        },
		render: function() {

			if (this.displayCollec_Resources != true) {

				this.$el.html("")
				if (this.removeAlphabet == undefined) {
					var viewText = "<tr></tr>"
					viewText += "<tr><td colspan=7  style='cursor:default' >"
					viewText += '<a  id="allresources">#</a>&nbsp;&nbsp;'
                    var str ;
                    var configurations = Backbone.Collection.extend({
                        url: App.Server + '/configurations/_all_docs?include_docs=true'
                    })
                    var config = new configurations()
                    config.fetch({
                        async: false
                    })
                    var con = config.first();
                    var currentConfig = config.first().toJSON().rows[0].doc;
                    var clanguage= currentConfig.currentLanguage;
                    if(clanguage=="Urdu")
                    {
                        str="ابپتٹجچحخدڈذرڑزژسشصضطظعغفقكگلمنںوهھءیے";
                    }
                   else
                        str= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


					for (var i = 0; i < str.length; i++) {
						var nextChar = str.charAt(i);
						viewText += '<a class="clickonalphabets"  value="' + nextChar + '">' + nextChar + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
					}
					viewText += "</td></tr>"
					this.$el.append(viewText);
                    if(clanguage=="Urdu")
                    {
                        $('#alphabetsOfLanguage').addClass('addResource');
                    }

				}
			}
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var con = config.first();
            var currentConfig = config.first().toJSON().rows[0].doc;
            var clanguage= currentConfig.currentLanguage;
            var languages = new App.Collections.Languages();
            languages.fetch({
                async: false
            });
            var languageDict;
            for(var i=0;i<languages.length;i++)
            {
                if(languages.models[i].attributes.hasOwnProperty("nameOfLanguage"))
                {
                    if(languages.models[i].attributes.nameOfLanguage==clanguage)
                    {
                        languageDict=languages.models[i];
                    }
                }
            }
            App.languageDict = languageDict;

			this.$el.append('<br/><br/>')
			this.$el.append("<tr id='actionAndTitle'><th style='width: 430px;'>"+languageDict.attributes.Title+"</th><th colspan='6'>"+languageDict.attributes.action+"</th></tr>")

			this.addAll()

			var text = '<tr><td>'

			if (this.collection.skip != 0) {
				text += '<a class="btn btn-success" id="backButton" >'+languageDict.attributes.Back+'</a>&nbsp;&nbsp;'
			}

			if (this.collection.length >= 20)
				text += '<a class="btn btn-success" id="nextButton">>'+languageDict.attributes.Next+'</a>'

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
									pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">'+languageDict.attributes.Home+'</a>&nbsp&nbsp'
								else
									pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
							}
							pageBottom += "</p></td></tr>"
							context.$el.append(pageBottom)
						}

					}
				})

			}



		}

	})

})