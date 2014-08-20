$(function () {

	App.Views.Dashboard = Backbone.View.extend({

		template: $('#template-Dashboard').html(),

		vars: {},
		nationConfiguration: null,
		latestVersion: null,
		nationConfigJson: null,
		events: {
			"click #updateButton": function (e) {
				var configurations = Backbone.Collection.extend({
					url: App.Server + '/configurations/_all_docs?include_docs=true'
				})
				var config = new configurations()
				config.fetch({
					async: false
				})
				var currentConfig = config.first().toJSON().rows[0].doc
				currentConfig.version = this.latestVersion
				var nationName = currentConfig.nationName
				var nationURL = currentConfig.nationUrl
				
				App.startActivityIndicator()
				$.ajax({
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json; charset=utf-8'
					},
					type: 'POST',
					url: '/_replicate',
					dataType: 'json',
					data: JSON.stringify({
					    "source": 'http://' + nationName + ':oleoleole@' + nationURL + '/apps',
						"target": "apps"
					}),
					success: function (response) {
						$.ajax({
							
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'multipart/form-data'
							},
							type: 'PUT',
							url: App.Server + '/configurations/' + currentConfig._id + '?rev=' + currentConfig._rev,
							dataType: 'json',
							data: JSON.stringify(currentConfig),
							success: function (response) {
							         alert("Successfully updated.")
							         location.reload();
							 },
							 
							async: false
						})
					      App.stopActivityIndicator()
					      
					},
					error: function(){
					      App.stopActivityIndicator()
					      alert("Not Replicated!")
					},
					async: false
				})

				
			},
			"click #showReleaseNotesDiv": function (e) {
				if ($('#releaseVersion').css('display') == 'none') {
					$("#releaseVersion").slideDown("slow", function () {

					});
				}
				else {
					$("#releaseVersion").slideUp("slow", function () {
						$('#appversion').val("")
						$('#notes').val("")
					});
				}
			},
			"click #cancelnotes": function (e) {
				$("#releaseVersion").slideUp("slow", function () {
					$('#appversion').val("")
					$('#notes').val("")
				});
			},
			"click #savenotes": function (e) {
				if ($('#appversion').val() == "") {
					alert("Please enter version no.")
					return
				}
				if ($('#notes').val() == "") {
					alert("Please enter release notes.")
					return
				}

				var configurations = Backbone.Collection.extend({
					url: App.Server + '/configurations/_all_docs?include_docs=true'
				})
				var config = new configurations()
				config.fetch({
					async: false
				})
				var con = config.first()
				con = (con.get('rows')[0]).doc
				var conTable = new App.Models.ReleaseNotes({
					_id: con._id
				})
				conTable.fetch({
					async: false
				})
				conTable.set('version', $('#appversion').val())
				conTable.set('notes', $('#notes').val())
				conTable.save(null, {
					success: function (e) {
						$("#releaseVersion").slideUp("slow", function () {
							$('#appversion').val("")
							$('#notes').val("")
							alert('Notes successfully saved.')
						})
					}
				})


			},
			"click #viewReleaseNotes": function (e) {
				if ($('#showReleaseNotes').css('display') == 'none') {
					$("#showReleaseNotes").slideDown("slow", function () {
						$("textarea#shownotes").val(nationConfigJson.notes)

					});
				}
				else {
					$("#showReleaseNotes").slideUp("slow", function () {});
				}
			}
		},
		render: function () {

			var dashboard = this
			this.vars.mails = 0
			var clanguage = App.configuration.get("currentLanguage")
            var typeofBell=App.configuration.get("type")
			console.log(App.languageDict)
			console.log(clanguage)
			this.vars.languageDict = App.languageDict;

			this.vars.imgURL = "img/header_slice.png"
			var a = new App.Collections.MailUnopened({
				receiverId: $.cookie('Member._id')
			})
			a.fetch({
				async: false
			})
			this.vars.mails = a.length
			this.$el.html(_.template(this.template, this.vars))

			groups = new App.Collections.MemberGroups()
			groups.memberId = $.cookie('Member._id')
			groups.fetch({
				success: function (e) {
					groupsSpans = new App.Views.GroupsSpans({
						collection: groups
					})
					groupsSpans.render()

					$('#cc').append(groupsSpans.el)

					TutorsSpans = new App.Views.TutorsSpans({
						collection: groups
					})

					TutorsSpans.render()
					$('#tutorTable').append(TutorsSpans.el)
				}
			})

			// dashboard.$el.children('.groups').append(groupsDiv.el)

			shelfSpans = new App.Views.ShelfSpans()
			shelfSpans.render()

			UserMeetups = new App.Collections.UserMeetups()
			UserMeetups.memberId = $.cookie('Member._id')
			UserMeetups.fetch({
				async: false
			})
			MeetupSpans = new App.Views.MeetupSpans({
				collection: UserMeetups
			})
			MeetupSpans.render()
			$('#meetUpTable').append(MeetupSpans.el)



			//this.$el.children('.now').html(moment().format('dddd') + ' | ' + moment().format('LL'))
			// Time
			$('.now').html(moment().format('dddd | DD MMMM, YYYY'))
			// Member Name
			var member = App.member
			var attchmentURL = '/members/' + member.id + '/'
			if (typeof member.get('_attachments') !== 'undefined') {
				attchmentURL = attchmentURL + _.keys(member.get('_attachments'))[0]
				document.getElementById("imgurl").src = attchmentURL
			}
			var temp = $.url().data.attr.host.split(".")
			temp = temp[0].substring(3)	
			if (temp == "") {
				temp = "local "
			}
			temp=temp.charAt(0).toUpperCase() + temp.slice(1);
			temp = temp + " Community BeLL"
			$('.bellLocation').html(temp)
			if (!member.get('visits')) {
				member.set('visits', 1)
				member.save()
			}
			if (parseInt(member.get('visits')) == 0) {
				temp = "Error!!"
			}
			else {
				temp = member.get('visits') + " visits"
			}
			var roles = "&nbsp;-&nbsp;"
			var temp1 = 0
			if (member.get("roles").indexOf("Learner") != -1) {
				roles = roles + "Learner"
				temp1 = 1
			}
			if (member.get("roles").indexOf("Leader") != -1) {
				if (temp1 == 1) {
					roles = roles + ",&nbsp;"
				}
				roles = roles + "Leader"
				temp1 = 1
			}
			if (member.get("roles").indexOf("Manager") != -1) {
				if (temp1 == 1) {
					roles = roles + ",&nbsp;"
				}
                if(typeofBell=='nation'){
                    roles = roles + '<a href="../nation/index.html#dashboard">Manager</a>'
                }
                else {
                    roles = roles + '<a href="#cummunityManage">Manager</a>'
                }
			}
			$('.visits').html(temp)
			$('.name').html(member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '</span>' + '&nbsp;<a href="#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>')
			dashboard.checkAvailableUpdates(member.get('roles'), dashboard)
			//dashboard.$el.append('<div id="updates"></div>')
		},
		checkAvailableUpdates: function (roles, dashboard) {
			var context = this
			if ($.inArray('Manager', roles) == -1) {
				return
			}
			var configuration = App.configuration
			var nationName = configuration.get("nationName")
			var nationURL = configuration.get("nationUrl")
			var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true'

			// console.log(nationConfig)
			// alert('check')
			//alert('http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true')
			
			$.ajax({
				url: nationConfigURL,
				type: 'GET',
				dataType: "jsonp",
				success: function (json) {
					var nationConfig = json.rows[0].doc
					nationConfigJson = nationConfig
					if (typeof nationConfig.version === 'undefined') {
						/////No version found in nation
					}
					else if (nationConfig.version == configuration.get('version')) {
						///No updatea availabe
					}
					else {
						if(context.versionCompare(nationConfig.version, configuration.get('version'))<0){
							console.log("Nation is at low level")
						}
						else if (context.versionCompare(nationConfig.version, configuration.get('version'))>0) {
							dashboard.latestVersion = nationConfig.version
							dashboard.$el.append('<button class="btn systemUpdate" id="updateButton">System Update Available (' + nationConfig.version + '). Press to update. </button>')
							dashboard.$el.append('<button class="btn systemUpdate" id="viewReleaseNotes">View Release Notes </button>')
						}
						else{
						console.log("Nation is uptodate")
						}
					}
				}
			})
			return;
		},
		//following function compare version numbers.
		/*<li>0 if the versions are equal</li>
		A negative integer iff v1 < v2
		A positive integer iff v1 > v2
		NaN if either version string is in the wrong format*/

		versionCompare: function (v1, v2, options) {
			var lexicographical = options && options.lexicographical;
			zeroExtend = options && options.zeroExtend;
			v1parts = v1.split('.');
			v2parts = v2.split('.');

			function isValidPart(x) {
				return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
			}

			if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
				return NaN;
			}

			if (zeroExtend) {
				while (v1parts.length < v2parts.length) v1parts.push("0");
				while (v2parts.length < v1parts.length) v2parts.push("0");
			}

			if (!lexicographical) {
				v1parts = v1parts.map(Number);
				v2parts = v2parts.map(Number);
			}

			for (var i = 0; i < v1parts.length; ++i) {
				if (v2parts.length == i) {
					return 1;
				}

				if (v1parts[i] == v2parts[i]) {
					continue;
				}
				else if (v1parts[i] > v2parts[i]) {
					return 1;
				}
				else {
					return -1;
				}
			}

			if (v1parts.length != v2parts.length) {
				return -1;
			}

			return 0;
		}
	})

})