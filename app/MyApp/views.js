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

});

$(function() {

	window.isActivityLogChecked = false;
	App.Views.listSyncDbView = Backbone.View.extend({
		id: "invitationForm",

		events: {
			"click #cancelButton": "hidediv",
			"click #formButton": "syncData",
			"click #selectAll": "selectAll"
		},
		hidediv: function() {
			$('#invitationdiv').fadeOut(1000)

			setTimeout(function() {
				$('#invitationdiv').hide()
			}, 1000);
		},
		render: function() {

			// <input type="checkbox" value="Resources" name="syncData">Resources<br>
			//<input type="checkbox" value="Application" name="syncData" >Application<br><br><br>
			// added "Members Db" checkbox
            var $button = $('<h6>' + App.languageDict.get('Config_Sync_With_Nation_Head') + '</h6><br><br><input type="checkbox" value="ActivityReports" name="syncData">' + App.languageDict.get('Log_Activity_Reports') + '<br><input type="checkbox" value="Reports" name="syncData">' + App.languageDict.get('Reports') + '<br><input type="checkbox" value="ResourcesFeedbacks" name="syncData">' + App.languageDict.get('Resources_Feedbacks') + '<br><input type="checkbox" value="ApplicationFeedbacks" name="syncData">' + App.languageDict.get('Application_Feedbacks') + '<br><input type="checkbox" value="MembersDb" name="syncData">' + App.languageDict.get('Members_Database') + '<br><input type="checkbox" value="Surveys" name="syncData">' + App.languageDict.get('Surveys') + '<br>');
			this.$el.append($button);
			this.$el.append('<button class="btn btn-info" id="selectAll" style="width:110px">' + App.languageDict.get('Select_All') + '</button><button style="margin-left:10px; width:110px" class="btn btn-success" id="formButton" style="width:110px">' + App.languageDict.get('Send') + '</button>');
			this.$el.append('<button class="btn btn-warning" id="cancelButton" style="width:110px;margin-left:10px">' + App.languageDict.get('Cancel') + '</button>');
			if(App.languageDict.get('directionOfLang').toLowerCase()==="right")
			{
				this.$el.find('#formButton').css({"margin-left":"0px", "margin-right":"10px"});
				this.$el.find('#cancelButton').css({"margin-left":"0px", "margin-right":"10px"});
			}
		},
		selectAll: function() {
			if ($("#selectAll").text() == 'Select All') {
				$("input[name='syncData']").each(function() {
					$(this).prop('checked', true);
				})
				$("#selectAll").text('Unselect All')
			} else {
				$("input[name='syncData']").each(function() {
					$(this).prop('checked', false);
				})
				$("#selectAll").text('Select All')

			}
		},
		syncData: function() {
			var context = this
			App.startActivityIndicator()
			$("input[name='syncData']").each(function() {
				if ($(this).is(":checked")) {
					if ($(this).val() == 'Resources') {
                        context.ReplicateResource()
					} else if ($(this).val() == 'ActivityReports') {
						isActivityLogChecked = true;
						context.syncLogActivitiy()
					} else if ($(this).val() == 'Reports') {
						context.syncReports()
					} else if ($(this).val() == 'ResourcesFeedbacks') {
						context.syncResourcesFeedbacks()
					} else if ($(this).val() == 'ApplicationFeedbacks') {
						context.syncApplicationFeedbacks()
					}
					//**************************************************************************************************
					//Replicate Members db from community to nation
					else if ($(this).val() == 'MembersDb') {
						context.syncMembersDb()
					}
					//**************************************************************************************************
					else if ($(this).val() == 'Surveys') {
						context.syncSurveys();
					}
					if ($(this).val() == 'Application') {
						context.checkAvailableUpdates()
					}
				}
			})
			$('#invitationdiv').fadeOut(1000)
			setTimeout(function() {
				$('#invitationdiv').hide()
			}, 1000);
		},
		ReplicateResource: function() {

			App.startActivityIndicator()

			var that = this
			var temp = $.url().attr("host").split(".")
			var currentHost = $.url().attr("host")

			var nationURL = ''
			var nationName = ''
			var type = ''

			var configurations = Backbone.Collection.extend({

				url: App.Server + '/configurations/_all_docs?include_docs=true'
			})
			var config = new configurations()
			config.fetch({
				async: false
			})
			var currentConfig = config.first()
			var cofigINJSON = currentConfig.toJSON()

			type = cofigINJSON.rows[0].doc.type
			nationURL = cofigINJSON.rows[0].doc.nationUrl
			nationName = cofigINJSON.rows[0].doc.nationName
			App.$el.children('.body').html('Please Wait…')
			var waitMsg = ''
			var msg = ''
			$.ajax({
				url: 'http://' + nationName + ':' + App.password + '@' + nationURL + ':5984/communities/_all_docs?include_docs=true',
				type: 'GET',
				dataType: "jsonp",
				success: function(json) {
					for (var i = 0; i < json.rows.length; i++) {
						var community = json.rows[i]
						var communityurl = community.doc.url
						var communityname = community.doc.name
						msg = waitMsg
						waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
						App.$el.children('.body').html(waitMsg)
						that.synchCommunityWithURL(communityurl, communityname)
						waitMsg = msg
						waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.'
						App.$el.children('.body').html(waitMsg)
					}
					if (type != "nation") {
						msg = waitMsg
						waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
						that.synchCommunityWithURL(nationURL, nationName)
						waitMsg = msg
						waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.<br>Replication completed.'
					}
				}
			})
		},
		synchCommunityWithURL: function(communityurl, communityname) {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "resources",
					"target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/resources'
				}),
				success: function(response) {

				},
				async: false
			})
		},
		syncReports: function() {

			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "communityreports",
					"target": 'http://' + App.configuration.get('nationUrl') + '/communityreports'
				}),
				success: function(response) {
					alert(App.languageDict.attributes.Reports_Replicated_Success)
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})
		},
		syncLogActivitiy: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "activitylog",
					"target": 'http://' + App.configuration.get('nationUrl') + '/activitylog'
				}),
				success: function(response) {
					var communitycode = App.configuration.get('code');
					$.ajax({
						url: 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true',
						type: 'GET',
						dataType: 'jsonp',
						success: function(result) {
							var doc, communityModelId;
							for(var i = 0 ; i < result.rows.length ; i++) {
								var code;
								if(result.rows[i].value.Code != undefined){
									code = result.rows[i].value.Code;
								} else {
									code = result.rows[i].value.code;
								}
								if(communitycode == code) {
									doc = result.rows[i].value;
								}
							}
							if(doc != undefined) {
								communityModelId = doc._id;
							}
							//Replicate from Nation to Community
							$.ajax({
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json; charset=utf-8'
								},
								type: 'POST',
								url: '/_replicate',
								dataType: 'json',
								data: JSON.stringify({
									"source": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
									"target": "community",
									"doc_ids": [communityModelId]
								}),
								success: function(response) {
									var date = new Date();
									var year = date.getFullYear();
									var month = (1 + date.getMonth()).toString();
									month = month.length > 1 ? month : '0' + month;
									var day = date.getDate().toString();
									day = day.length > 1 ? day : '0' + day;
									var formattedDate = month + '-' + day + '-' + year;
									/////////////////////////////////////////////////////////////
									$.ajax({
										url: '/community/_design/bell/_view/getCommunityByCode?_include_docs=true',
										type: 'GET',
										dataType: 'json',
										success: function (result) {
											if (result.rows.length > 0) {
												var communityModel;
												for(var i = 0 ; i < result.rows.length ; i++) {
													var code;
													if(result.rows[i].value.Code != undefined){
														code = result.rows[i].value.Code;
													} else {
														code = result.rows[i].value.code;
													}
													if(communitycode == code) {
														communityModel = result.rows[i].value;
													}
												}
												if(communityModel != undefined) {
													communityModel.lastActivitiesSyncDate = month + '/' + day + '/' + year;
												}
												//Update the record in Community db at Community Level
												$.ajax({

													headers: {
														'Accept': 'application/json',
														'Content-Type': 'multipart/form-data'
													},
													type: 'PUT',
													url: App.Server + '/community/' + communityModelId + '?rev=' + communityModel._rev,
													dataType: 'json',
													data: JSON.stringify(communityModel),
													success: function(response) {
														//Replicate from Community to Nation
														$.ajax({
															headers: {
																'Accept': 'application/json',
																'Content-Type': 'application/json; charset=utf-8'
															},
															type: 'POST',
															url: '/_replicate',
															dataType: 'json',
															data: JSON.stringify({
																"source": "community",
																"target": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
																"doc_ids": [communityModelId]
															}),
															success: function(response) {
																alert(App.languageDict.attributes.ActivityReports_Replicated_Success)
																App.stopActivityIndicator();
															},
															async: false
														});
													},

													async: false
												});
											}
										}
									});
									/////////////////////////////////////////////////////////////
								},
								async: false
							});
						},
						error: function() {
						}
					});

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})


		},

		syncResourcesFeedbacks: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "feedback",
					"target": 'http://' + App.configuration.get('nationUrl') + '/feedback'
				}),
				success: function(response) {
					alert(App.languageDict.attributes.FeedbackDb_Replicated_Success)
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})


		},

		syncApplicationFeedbacks: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "report",
					"target": 'http://' + App.configuration.get('nationUrl') + '/report'
				}),
				success: function(response) {
					alert(App.languageDict.attributes.FeedbackDb_Replicated_Success)
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})
		},
		//******************************************************************************************************************
		//Replicate Members Db from community to nation
		syncMembersDb: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "members",
					"target": 'http://' + App.configuration.get('nationUrl') + '/members',
					"filter": "bell/adminFilter"
				}),
				success: function(response) {
					alert(App.languageDict.attributes.MemberDb_Replicated)
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})
		},
		syncSurveys: function() {
			var that = this;
			that.syncSurveyResponse();
			that.syncSurveyAnswers();
			//Saving community name in submittedBy for nation's record
			$.ajax({
				url: '/surveyresponse/_design/bell/_view/surveyResByCommunityName?_include_docs=true&key="' + App.configuration.get('name') + '"',
				type: 'GET',
				dataType: 'json',
				success: function (result) {
					var rows = result.rows;
					var surveyNumbers = [];
					for(var i = 0 ; i < rows.length ; i++) {
						if(surveyNumbers.indexOf(rows[i].value) == -1) {
							surveyNumbers.push(rows[i].value);
						}
					}
					$.ajax({
						url: 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/survey/_design/bell/_view/surveyBySurveyNo?_include_docs=true',
						type: 'GET',
						dataType: 'jsonp',
						success: function (surResult) {
							var surveyDocsFromNation = surResult.rows;
							var idsOfDocsToChange = [];
							for(var i = 0 ; i < surveyDocsFromNation.length ; i++) {
								var surveyModel = surveyDocsFromNation[i].value;
								var communityName = App.configuration.get('name');
								if(surveyNumbers.indexOf(surveyModel.SurveyNo) > -1 && surveyModel.submittedBy.indexOf(communityName) == -1) {
									idsOfDocsToChange.push(surveyModel._id)
								}
							}
							$.couch.allDbs({
								success: function(data) {
									if (data.indexOf('tempsurvey') != -1) {
										$.couch.db("tempsurvey").drop({
											success: function(data) {
												$.couch.db("tempsurvey").create({
													success: function(data) {
														that.updateNationSurveyDBForCommunityName(idsOfDocsToChange);
													},
													error: function(status) {
														console.log(status);
													}
												});
											},
											error: function(status) {
												console.log(status);
											},
											async: false
										});
									} else {
										$.couch.db("tempsurvey").create({
											success: function(data) {
												that.updateNationSurveyDBForCommunityName(idsOfDocsToChange);
											}
										});
									}
								}
							});
						},
						error: function(err) {
							console.log(err)
						}
					});
				},
				error: function(err) {
					console.log(err)
				}
			});
		},

		syncSurveyResponse: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "surveyresponse",
					"target": 'http://' + App.configuration.get('nationUrl') + '/surveyresponse'
				}),
				success: function(response) {
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Error (Try Later)")
				}
			});
		},

		syncSurveyAnswers: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "surveyanswers",
					"target": 'http://' + App.configuration.get('nationUrl') + '/surveyanswers'
				}),
				success: function(response) {
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Error (Try Later)")
				}
			});
		},

		updateNationSurveyDBForCommunityName: function(idsOfDocsToChange) {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/survey',
					"target": "tempsurvey",
					'doc_ids': idsOfDocsToChange
				}),
				async: false,
				success: function (response) {
					$.ajax({
						url: '/tempsurvey/_all_docs?include_docs=true',
						type:  'GET',
						dataType: 'json',
						success: function (surveyResult) {
							var surveyDocsFromComm = surveyResult.rows;
							var docsToChange = [];
							for (var i = 0; i < surveyDocsFromComm.length; i++) {
								var surveyModel = surveyDocsFromComm[i].doc;
								var communityName = App.configuration.get('name');
								if (idsOfDocsToChange.indexOf(surveyModel._id) > -1 && surveyModel.submittedBy.indexOf(communityName) == -1) {
									surveyModel.submittedBy.push(communityName);
									docsToChange.push(surveyModel);
								}
							}
							$.couch.db("tempsurvey").bulkSave({"docs": docsToChange}, {
								success: function(data) {
									$.ajax({
										headers: {
											'Accept': 'application/json',
											'Content-Type': 'application/json; charset=utf-8'
										},
										type: 'POST',
										url: '/_replicate',
										dataType: 'json',
										data: JSON.stringify({
											"source": "tempsurvey",
											"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/survey',
											'doc_ids': idsOfDocsToChange
										}),
										async: false,
										success: function (response) {
											alert("Surveys replicated successfully");
											$.couch.allDbs({
												success: function (data) {
													if (data.indexOf('tempsurvey') != -1) {
														$.couch.db("tempsurvey").drop({
															success: function (data) {
																if (isActivityLogChecked == false) {
																	App.stopActivityIndicator();
																}
															}
														});
													}
												}
											});
										},
										error: function(status) {
											console.log(status);
											$.couch.allDbs({
												success: function (data) {
													if (data.indexOf('tempsurvey') != -1) {
														$.couch.db("tempsurvey").drop({
															success: function (data) {
															}
														});
													}
												}
											});
										}
									});
								},
								error: function(status) {
									console.log(status);
									$.couch.allDbs({
										success: function (data) {
											if (data.indexOf('tempsurvey') != -1) {
												$.couch.db("tempsurvey").drop({
													success: function (data) {
													}
												});
											}
										}
									});
								}
							});
						},
						error: function(status) {
							console.log(status);
							$.couch.allDbs({
								success: function (data) {
									if (data.indexOf('tempsurvey') != -1) {
										$.couch.db("tempsurvey").drop({
											success: function (data) {
											}
										});
									}
								}
							});
						}
					});
				},
				error: function(status) {
					console.log(status);
					$.couch.allDbs({
						success: function (data) {
							if (data.indexOf('tempsurvey') != -1) {
								$.couch.db("tempsurvey").drop({
									success: function (data) {
									}
								});
							}
						}
					});
				}
			});
		},

		//*************************************************************************************************************
		//following function compare version numbers.
		/*<li>0 if the versions are equal</li>
		 A negative integer iff v1 < v2
		 A positive integer iff v1 > v2
		 NaN if either version string is in the wrong format*/

		versionCompare: function(v1, v2, options) {
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
				} else if (v1parts[i] > v2parts[i]) {
					return 1;
				} else {
					return -1;
				}
			}

			if (v1parts.length != v2parts.length) {
				return -1;
			}

			return 0;
		},
		checkAvailableUpdates: function() {
			var context = this;
			var configuration;
			var configurationModel = new App.Collections.Configurations()
			configurationModel.fetch({
				success: function(res) {
					configuration = res.first()

				},
				async: false
			})
			var nationName = configuration.get("nationName")
			var nationURL = configuration.get("nationUrl")
			var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true'
			$.ajax({
				url: nationConfigURL,
				type: 'GET',
				dataType: "jsonp",
				success: function(json) {
					var nationConfig = json.rows[0].doc
					nationConfigJson = nationConfig
					if (typeof nationConfig.version === 'undefined') {
						/////No version found in nation
					} else if (nationConfig.version == configuration.get('version')) {
						///No updatea availabe
					} else {
						if (context.versionCompare(nationConfig.version, configuration.get('version')) < 0) {
							console.log("Nation is at low level")
						} else if (context.versionCompare(nationConfig.version, configuration.get('version')) > 0) {
							context.updateApp()
						} else {
							console.log("Nation is uptodate")
						}
					}
				}
			})
			return;
		},
		updateApp: function() {

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
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/apps',
					"target": "apps"
				}),
				success: function(response) {
				},
				async: false
			})

			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data'
				},
				type: 'PUT',
				url: App.Server + '/configurations/' + currentConfig._id + '?rev=' + currentConfig._rev,
				dataType: 'json',
				data: JSON.stringify(currentConfig),
				success: function(response) {
					alert(App.languageDict.attributes.Updated_NewVersion_Success)
				},
				async: false
			})

		}
	})

});

$(function() {
    //ce82280dc54a3e4beffd2d1efa00c4e6
    App.Views.MemberLoginForm = Backbone.View.extend({
        //This view is used to render "Login Page" and it uses "Credentials" model

        className: "form login-form",

        events: {
            "keypress .bbf-form": "listenToEnterForSubmit",
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButton2": "signup",
            "click #welcomeButton": "showWelcomeVideo"
        },
        listenToEnterForSubmit: function(event) {
            if (event.keyCode == 13) {
                this.setForm();
            }
        },

        render: function() {
            var languageDictValue=getSpecificLanguage("English");  //To successfully append welcome button
            var context = this;
            var welcomeResources = new App.Collections.Resources();
            welcomeResources.setUrl(App.Server + '/resources/_design/bell/_view/welcomeVideo');
            welcomeResources.fetch({
                success: function() {
                    if (welcomeResources.length > 0) {
                        var welcomeResourceId = welcomeResources.models[0].attributes.id;
                        // display "watch welcome video" button
                       // update=App.languageDict.attributes.Update_Welcome_Video;
                       // alert(update);
                        var hrefWelcomeVid = "/apps/_design/bell/bell-resource-router/index.html#openres/" + welcomeResourceId;
                        // #99: margin-left:0px     var $buttonWelcome = $('<a id="welcomeButton" class="login-form-button btn btn-block btn-lg btn-success" href="hmmm" target="_blank" style="margin-left: -4px;margin-top: -21px; font-size:27px;">Welcome</button>');
                        var $buttonWelcome = $('<a id="welcomeButtonOnLogin" class="login-form-button btn btn-block btn-lg btn-success" target="_blank" href="hmmm" style="background-color:#2ecc71; margin-left: 0px;margin-top: -33px; font-size:27px;">'+languageDictValue.attributes.Welcome+'</button>'); //Issue#99
                        context.$el.append($buttonWelcome);
                        context.$el.find("#welcomeButtonOnLogin").attr("href", hrefWelcomeVid); // <a href="dummy.mp4" class="html5lightbox" data-width="880" data-height="640" title="OLE | Welcome Video">Welcome Video</a>
                    }
                    else {
                        context.$el.addClass('withoutWelcomeVideo');
                    }
                },
                error: function() {
                    console.log("Error in fetching welcome video doc from db");
                },
                async: false
            });
            this.form = new Backbone.Form({
                model: this.model
            })

            this.$el.append(this.form.render().el);
            if($.cookie('languageFromCookie')==null) 
            {
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
                $.cookie('languageFromCookie',clanguage);
            }
            else
            {
                $.cookie('languageFromCookie',$('#onLoginLanguage :selected').val());
            }

            var value = $("input[name*='login']");
            // give the form a submit button
            // #99 margin-left:1px for "Sign In " and "Become a Member" buttons
            var $button = $('<a class="login-form-button btn btn-block btn-lg btn-success" style="background-color:#2ecc71; margin-left: 1px;margin-top: -21px; font-size:27px;" id="formButton">' + languageDictValue.attributes.Sign_In + '</button>')

            var $button2 = $('<div class="signup-div" ><a style="margin-left: 1px;margin-top: -21px; font-size:22px;" class="signup-form-button btn btn-block btn-lg btn-info" id="formButton2">' + languageDictValue.attributes.Become_a_member + '</button></div>')
            this.$el.append($button);
            this.$el.append($button2);

        },
        updateLabels: function(languageDict){

            $('.field-login').find('label').html(languageDict.attributes.Login);
            $('.field-password').find('label').html(languageDict.attributes.Password);
            $('#welcomeButtonOnLogin').html(languageDict.attributes.Welcome)
            $('#formButton').html(languageDict.attributes.Sign_In);
            $('#formButton2').html(languageDict.attributes.Become_a_member);
        },

        showWelcomeVideo: function() {

        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        signup: function() {
            Backbone.history.navigate('member/add', {
                trigger: true
            })
        },
        setForm: function() {
            var memberLoginForm = this
            this.form.commit()
            var credentials = this.form.model;
            //alert("login + "+this.form.get('login'));
            var members = new App.Collections.Members()
            var member;
            members.login = credentials.get('login');
            var config = new App.Collections.Configurations();
            var bellCode;
            config.fetch({
                async: false,
                success: function(){
                    bellCode = config.first().attributes.code;
                }
            })
            members.fetch({
                success: function() {
                    var i;
                    if (members.length > 0) {
                        var go_ahead_with_login = 0;
                        for(i=0; i <members.length ; i++)
                        {
                            member = members.models[i];
                            go_ahead_with_login = 0;


                            if (!member || (member.get('login') != credentials.get('login'))){
                                continue;
                            }

                            obj_credentials = member.get('credentials');
                            if (obj_credentials){
                                hash_str = hash_login(member.get('login'), credentials.get('password'));
                                if( hash_str == obj_credentials.value) {
                                    go_ahead_with_login = 1;
                                }
                            }
                            else if (member.get('password') == credentials.get('password'))   {
                                go_ahead_with_login = 1;
                            }

                            if (go_ahead_with_login == 1) {
                                if (!member.get('credentials')) {
                                    member.set("credentials", generate_credentials(member.get('login'), member.get('password')));
                                    member.set("password","");
                                }

                                if(member.get('community') == bellCode){
                                    memberLoginForm.processMemberLogin(member);  //Does the functionality of after-login
                                    break;
                                }
                                else {
                                    if(member.get('community')==undefined) {
                                        if(member.get('visits')==0) {
                                            App.member=member;
                                            var date = new Date()
                                            $.cookie('Member.login', member.get('login'), {
                                                path: "/apps/_design/bell"
                                            })
                                            $.cookie('Member._id', member.get('_id'), {
                                                path: "/apps/_design/bell"
                                            })
                                            $.cookie('Member.expTime', date, {
                                                path: "/apps/_design/bell"
                                            })
                                            $.cookie('Member.roles', member.get('roles'), {
                                                path: "/apps/_design/bell"
                                            })
                                            Backbone.history.navigate('configuration/add', {
                                                trigger: true
                                            });
                                        }
                                        else {
                                            member.set('community',bellCode);
                                            member.save();
                                            i--;
                                            memberLoginForm.processMemberLogin(member);
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        if(i==members.length)
                        {
                            alert(App.languageDict.attributes.Invalid_Credentials)
                        }
                    }
                    else {
                        alert(App.languageDict.attributes.Invalid_Credentials)
                    }
                }
            });
        },
        processMemberLogin: function(member){
            var memberLoginForm = this;
            if (member.get('status') == "active") {
                //UPDATING MEMBER VISITS
                App.member = member;
                var vis = parseInt(member.get("visits"));
                vis++;
                if (!(member.get('roles').indexOf("Manager") > -1) && member.get("FirstName")!='Default' &&
                    member.get('LastName')!='Admin')
                {
                    member.set("lastLoginDate",new Date());
                }
                member.set("visits", vis);
                if(member.get('bellLanguage')===undefined || member.get('bellLanguage')==="" || member.get('bellLanguage')===null)
                {
                    member.set("bellLanguage", App.configuration.get("currentLanguage"));
                }
                member.once('sync', function() {})

                member.save(null, {
                    success: function(doc, rev) {}
                });


                memberLoginForm.logActivity(member);

                var date = new Date()
                $.cookie('Member.login', member.get('login'), {
                    path: "/apps/_design/bell"
                })
                $.cookie('Member._id', member.get('_id'), {
                    path: "/apps/_design/bell"
                })
                $.cookie('Member.expTime', date, {
                    path: "/apps/_design/bell"
                })
                $.cookie('Member.roles', member.get('roles'), {
                    path: "/apps/_design/bell"
                })

                if (parseInt(member.get('visits')) == 1 && member.get('roles').indexOf('SuperManager') != -1) {
                    Backbone.history.navigate('configuration/add', {
                        trigger: true
                    });
                    return;
                }
                memberLoginForm.trigger('success:login');
                if(App.configuration.get('type')=='community' && member.get('roles').indexOf('SuperManager') != -1){
                    var configCollection = new App.Collections.Configurations();
                    configCollection.fetch({
                        async: false
                    });
                    var configDoc = configCollection.first().toJSON();
                    if(configDoc.name == undefined) {
                        window.location.href = '#configurationsForm'
                    }
                }

            } else {
                alert(App.languageDict.attributes.Account_DeActivated)
            }
        },
        logActivity: function(member) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate);
            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    that.UpdatejSONlog(member, logModel, logdb, logdate);
                } else {
                    that.createJsonlog(member, logdate, logdb);
                }
            });
        },
        UpdatejSONlog: function(member, logModel, logdb, logdate) {

            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            if (member.get('Gender') == 'Male') {
                var visits = parseInt(logModel.male_visits)
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.male_visits = visits
            } else {
                var visits = parseInt(logModel.female_visits)
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.female_visits = visits
            }
            logModel.community = App.configuration.get("code");

            logdb.put(logModel, logdate, logModel._rev, function(err, response) {
                if (!err) {
                    console.log("MemberLoginForm:: updated daily log from pouchdb for today..");
                } else {
                    console.log(err);
                }
            });
        },
        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },
        createJsonlog: function(member, logdate, logdb) {

            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [],
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {

                var visits = parseInt(docJson.male_visits)
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.male_visits = visits
            } else {

                var visits = parseInt(docJson.female_visits)
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.female_visits = visits
            }
            docJson.community = App.configuration.get('code'),
                logdb.put(docJson, logdate, function(err, response) {
                    if (!err) {
                        console.log("MemberLoginForm:: created activity log in pouchdb for today..");
                    } else {
                        console.log(err);
                    }
                });
        }
    })
})
;

$(function() {

    App.Views.navBarView = Backbone.View.extend({
        tagName: "ul",
        className: "nav",
        id: "itemsinnavbar",
        authorName: null,
        template1: _.template($('#template-nav-logged-in').html()),
        template0: _.template($('#template-nav-log-in').html()),
        initialize: function(option) {
            if (option.isLoggedIn == 0) {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
            var temp = Backbone.history.location.href
            temp = temp.split('#')

            var version = '';
            var currentLanguage;
            var currentLanguageValue;
            var languageDictOfApp;
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            con = config.first()
            App.configuration = con
            var clanguage;
            if($.cookie('isChange')=="true" && !($.cookie('Member._id')))
            {
                if(checkIfExistsInLangDb($.cookie('languageFromCookie')))
                {
                    clanguage= $.cookie('languageFromCookie');

                }
                else {
                    clanguage = App.configuration.get("currentLanguage");
                }
            }
            else if($.cookie('Member._id')){
                clanguage = getLanguage($.cookie('Member._id'));
            }
            else{
                clanguage = App.configuration.get("currentLanguage");
            }

            // fetch dict for the current/selected language from the languages db/table

            App.languageDict = getSpecificLanguage(clanguage);
            version = App.configuration.get('version');
            languageDictOfApp=App.languageDict;
            currentLanguageValue = App.languageDict.get('nameInNativeLang');
            this.data = {
                uRL: temp[1],
                versionNO: version,
                currentLanguageOfApp:clanguage,
                availableLanguagesOfApp:getAvailableLanguages(),
                languageDict:languageDictOfApp,
                currentLanguageValueOfApp:currentLanguageValue

            }
            this.$el.append(this.template(this.data))
            if (!App.member && $.cookie('Member._id')) {
                var member = new App.Models.Member()
                member.set('_id', $.cookie('Member._id'))
                member.fetch({
                    async: false, // by default it is true
                    success: function(model, response) {
                        App.member = model;
                    },
                    error: function() {
                        App.Router.expireSession();
                        Backbone.history.stop();
                        App.start();
                    }
                });

            }
        },
        render: function() {}

    })

});

$(function() {

    App.Views.MemberForm = Backbone.View.extend({

        className: "form",
        id: 'memberform',

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButtonCancel": function() {
                //Check whether form is being called for Edit purpose or Add..
                if(this.form.model.get('_id') ){
                    var isValid=true;
                    if($.cookie("forcedUpdateProfile")=='true'){
                        if(!this.validateMemberForm())
                        {
                            isValid=false;
                        }
                        if(!isValid){
                            alert(App.languageDict.attributes.Update_Profile_Reminder);
                        }
                        $('#nav').css('pointer-events','none');
                        $('#formButtonCancel').css('pointer-events','none');
                        return;
                    }
                    else{
                        if(!this.validateMemberForm())
                        {
                            isValid=false;
                        }
                        if(!isValid){
                            alert(App.languageDict.attributes.Update_Profile_Reminder);
                        }
                    }
                   // this.model.set("lastEditDate",new Date());
                    this.model.save({
                        lastEditDate: new Date()
                    }, {
                        success: function() {
                            Backbone.history.navigate('dashboard');
                            window.location.reload();
                        }
                    });

                }
                else{
                    window.history.back();
                }
            },
            "click #deactive": function(e) {
                e.preventDefault()
                var that = this;
                this.model.on('sync', function() {
                   // location.reload();
                })
                this.model.save({
                    status: "deactive"
                }, {
                    success: function() {
                        if ($.cookie('Member.login') != that.model.get('login') )
                        {
                            Backbone.history.navigate('dashboard', {
                                trigger: true
                            });
                        }
                        else
                        {
                            //Going to log-out from the system...
                            that.expireSession();
                            Backbone.history.navigate('login', {
                                trigger: true
                            });
                        }

                    }
                });
            },

            "click #ptManager": function(e) {


            },
            "click #active": function(e) {
                e.preventDefault()
                var that = this
                this.model.on('sync', function() {
                    location.reload();
                })
                this.model.save({
                    status: "active"
                }, {
                    success: function() { /*this.model.fetch({async:false})*/ }
                });
            }
        },
        expireSession: function() {

            $.removeCookie('Member.login', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member._id', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member.roles', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member.expTime', {
                path: "/apps/_design/bell"
            });
            $.removeCookie('forcedUpdateProfile');
        },
        getRoles: function(userId) {

            var user = (userId) ? new App.Models.Member({
                "_id": userId
            }) : new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            user.fetch({
                async: false
            })
            var roles = user.get("roles")

            return roles
        },


        render: function() {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            var buttonText = "";
            this.$el.append(this.form.render().el)
            this.form.fields['status'].$el.hide()
            this.form.fields['yearsOfTeaching'].$el.hide()
            this.form.fields['teachingCredentials'].$el.hide()
            this.form.fields['subjectSpecialization'].$el.hide()
            this.form.fields['forGrades'].$el.hide()
            this.form.fields['visits'].$el.hide();
            this.form.fields['lastLoginDate'].$el.hide();
            this.form.fields['lastEditDate'].$el.hide();

            this.form.setValue({
                community: App.configuration.get("name"),
                region: App.configuration.get("region"),
                nation: App.configuration.get("nationName"),
                firstName: App.configuration.get("firstName"),
                middleNames: App.configuration.get("middleNames"),
                lastName: App.configuration.get("lastName"),
                password: App.configuration.get("password"),
                phone: App.configuration.get("phone"),
                email: App.configuration.get("email"),
                language: App.configuration.get("language"),
                community: App.configuration.get("community"),
                region: App.configuration.get("region"),
                nation: App.configuration.get("nation"),
                date: App.configuration.get("date"),
                month: App.configuration.get("month"),
                year: App.configuration.get("year"),
                Gender: App.configuration.get("Gender"),
                levels: App.configuration.get("levels"),
                login: App.configuration.get("levels"),
            })
            var url_page = $.url().data.attr.fragment.split('/');

            if(url_page[1]=="view") {
                $("input[name='firstName']").attr("disabled", true);
                $("input[name='middleNames']").attr("disabled", true);
                $("input[name='lastName']").attr("disabled", true);
                $("input[name='password']").attr("disabled", true);
                $("input[name='phone']").attr("disabled", true);
                $("input[name='email']").attr("disabled", true);
                $("input[name='language']").attr("disabled", true);
                $("input[name='community']").attr("disabled", true);
                $("input[name='region']").attr("disabled", true);
                $("input[name='nation']").attr("disabled", true);
                $("input[name='login']").attr("disabled", true);
                $("select[data-type='date']").attr("disabled", true);
                $("select[data-type='month']").attr("disabled", true);
                $("select[data-type='year']").attr("disabled", true);
                $("select[name='Gender']").attr("disabled", true);
                $("select[name='levels']").attr("disabled", true);
            }
            else {
                $("input[name='community']").attr("disabled", true);
                $("input[name='region']").attr("disabled", true);
                $("input[name='nation']").attr("disabled", true);
            }
            if(url_page[1] != "view") {
                var $imgt = "<p id='imageText' style='margin-top: 15px;'></p>"
                if (this.model.id != undefined) {
                    buttonText = App.languageDict.attributes.Update

                    $("input[name='login']").attr("disabled", true);
                } else {
                    buttonText = App.languageDict.attributes.Register
                }
                // give the form a submit button
                //this.$el.append($button)
                var $upload = $('<form method="post" id="fileAttachment" ><input type="file" name="_attachments"  id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
                var $img = $('<div id="browseImage" >' + $imgt + '<img style="width:100px;height:100px;border-radius:50px" id="memberImage"></div>')
                this.$el.append($img)
                this.$el.append($upload)

                var $button = $('<div class="signup-submit"><a class="btn btn-success" id="formButton" style="margin-top: 10px;">' + buttonText + '</button><a class="btn btn-danger" id="formButtonCancel" style="margin-top: 10px;">'+App.languageDict.attributes.Cancel+'</button></div>')
            }
             else {
                var $button = $('<a class="btn btn-danger" id="formButtonCancel" style="margin-top: 10px;">' + App.languageDict.attributes.Cancel + '</button></div>')
            }

            this.$el.append($button)
            if(url_page[1] != "view"){
                if (this.model.id != undefined) {
                    if (this.model.get("status") == "active") {
                        $(".signup-submit").append('<a class="btn btn-danger" id="deactive" href="#" style="margin-top: 10px;">'+App.languageDict.attributes.Resign+'</a>')
                    } else {
                        $(".signup-submit").append('<a class="btn btn-success" id="active" style="margin-top: 10px;" href="#">'+App.languageDict.attributes.Reinstate+'</a>')
                    }
                    var logUserroles = this.getRoles(false)
                    if (logUserroles.indexOf("SuperManager") > -1) {
                        var thisUser = this.getRoles(this.model.id)
                        $('#memberform').append('<div id="PromoteToManager"><input id="ptManager" type="checkbox" ><label for="ptManager">'+App.languageDict.attributes.Promote_To_Manager+'</label></div>')
                        if (thisUser.indexOf("Manager") > -1) {
                            $('#ptManager').prop('checked', true);
                        }
                    }
                }


                var attchmentURL = '/members/' + this.model.id + '/'
                if (typeof this.model.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                    document.getElementById("memberImage").src = attchmentURL
                }
                if(this.form.model.get('_id')){
                    //Check whether form is being called for Edit purpose or Add..
                    var isValid=true;
                    if($.cookie("forcedUpdateProfile")=='true'){
                        if(!this.validateMemberForm())
                        {
                            isValid=false;
                        }
                        if(!isValid){
                            alert(App.languageDict.attributes.Update_Profile_Reminder);
                        }
                        $('#nav').css('pointer-events','none');   //buggy on page refresh
                        $('#formButtonCancel').css('pointer-events','none');
                        return;
                    }
                    else{
                        if(!this.validateMemberForm())
                        {
                            isValid=false;
                        }
                        if(!isValid){
                            alert(App.languageDict.attributes.Update_Profile_Reminder);
                        }
                    }
            }


           }
        },

        validImageTypeCheck: function(img) {
            if (img.val() == "") {
                //alert("ERROR: No image selected \n\nPlease Select an Image File")
                return 1
            }
            var extension = img.val().split('.')
            if (extension[(extension.length - 1)] == 'jpeg' || extension[(extension.length - 1)] == 'jpg' || extension[(extension.length - 1)] == 'png' || extension[(extension.length - 1)] == 'JPG') {
                return 1
            }
            alert(App.languageDict.attributes.Invalid_Image_File)
            return 0
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            $('#formButtonCancel').css('pointer-events','auto');
            $('#nav').css('pointer-events','auto');
            if ($('#ptManager').attr('checked')) { // if promote to manager checkbox is ticked
                // then add the 'Manager' role to his/her roles array only if this person is not a manager already. following check added
                // by Omer Yousaf on 16 Jan, 2015.
                var index = this.model.toJSON().roles.indexOf('Manager');
                if (index < 0) { // 'Manager' does not exist in his/her roles array
                    this.model.toJSON().roles.push("Manager");
                }
            } else {
                var index = this.model.toJSON().roles.indexOf('Manager')
                if (index > -1) {
                    this.model.toJSON().roles.splice(index, 1)
                }
            }
            var that = this;
            var isValid=true;
            if($.cookie("forcedUpdateProfile")=='true'){
                if(!this.validateMemberForm())
                {
                    isValid=false;
                }
                if(!isValid){
                 alert(App.languageDict.attributes.Update_Profile_Reminder);
                $('#nav').css('pointer-events','none');
                $('#formButtonCancel').css('pointer-events','none');
                return;
                }
                else{
                    $('#nav').css('pointer-events','auto');
                    $('#formButtonCancel').css('pointer-events','auto');
                }

            }
            else{
                if(!this.validateMemberForm())
                {
                    isValid=false;
                }
                if(!isValid){
                    alert(App.languageDict.attributes.Update_Profile_Reminder);
                    return;
                }
                else
                {
                    $('#nav').css('pointer-events','auto');
                    $('#formButtonCancel').css('pointer-events','auto');
                }
            }

            // Put the form's input into the model in memory
            if (this.validImageTypeCheck($('input[type="file"]'))) {
                // assign community, region and nation attribs in member model values from configuration doc
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                });
                var config = new configurations();
                config.fetch({
                    async: false
                });
                var configsDoc = config.first().toJSON().rows[0].doc;

                this.form.setValue({
                    status: "active",
                    community: configsDoc.code,
                    region: configsDoc.region,
                    nation: configsDoc.nationName,
                    lastEditDate:new Date()
                });
                this.form.commit();
                // Send the updated model to the server
                if ($.inArray("lead", this.model.get("roles")) == -1) {
                    that.model.set("yearsOfTeaching", null)
                    that.model.set("teachingCredentials", null)
                    that.model.set("subjectSpecialization", null)
                    that.model.set("forGrades", null);
                    this.model.set("lastEditDate",new Date());
                }

                if (this.model.get("password") != undefined && this.model.get("password") != '' && this.model.get("password") != null) { // HT: password optional not to regenerate on empty
                    credentials = generate_credentials(this.model.get("login"), this.model.get("password")); 
                    this.model.set("credentials", credentials);
                }

                this.removeSpaces();
                var addMem = true
                if (this.model.get("_id") == undefined) {
                    this.model.set("roles", ["Learner"])
                    this.model.set("visits", 0);

                    credentials = generate_credentials(this.model.get("login"), this.model.get("password")); 
                    this.model.set("credentials", credentials);
                    this.model.set("password", "");

                    if($.cookie('languageFromCookie')===null)
                    {
                        this.model.set("bellLanguage",App.configuration.attributes.currentLanguage);
                    }
                    else
                    {
                        this.model.set("bellLanguage", $.cookie('languageFromCookie'));
                    }

                    var existing = new App.Collections.Members()

                    existing.login = that.model.get("login")
                    existing.fetch({
                        async: false,
                        success: function() {
                            existing = existing.first()
                            if (existing != undefined) {
                                if (existing.toJSON().login != undefined) {
                                    alert(App.languageDict.attributes.Duplicate_login)
                                    addMem = false
                                }
                            }
                        }

                    });

                }
                if (addMem) {
                    var memberModel = this.model;
                    this.model.set("password", "");
                    this.model.save(null, {
                        success: function() {
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                            } else {
                                if (that.model.attributes._rev == undefined) {
                                    // if true then its a new member signup
                                    // so capture this in activity logging
                                    var pouchActivityLogDb = new PouchDB('activitylogs');
                                    var currentdate = new Date();
                                    var logdate = that.getFormattedDate(currentdate);
                                    pouchActivityLogDb.get(logdate, function(err, pouchActivityLogRec) {
                                        if (!err) {
                                            that.UpdatejSONlog(logdate, pouchActivityLogRec, memberModel, pouchActivityLogDb);
                                        } else {
                                            that.createJsonlog(logdate, configsDoc, memberModel, pouchActivityLogDb);
                                        }
                                    });
                                } else {

                                    alert(App.languageDict.attributes.Updated_Successfully);
                                    $.cookie("forcedUpdateProfile",'false');
                                    Backbone.history.navigate('dashboard'
                                    );
                                    window.location.reload();
                                }
                            }
                            that.model.on('savedAttachment', function() {
                                if (that.model.attributes._rev == undefined) { // if true then its a new member signup
                                    // so capture this in activity logging
                                    var pouchActivityLogDb = new PouchDB('activitylogs');
                                    var currentdate = new Date();
                                    var logdate = that.getFormattedDate(currentdate);
                                    pouchActivityLogDb.get(logdate, function(err, pouchActivityLogRec) {
                                        if (!err) {
                                            that.UpdatejSONlog(logdate, pouchActivityLogRec, memberModel, pouchActivityLogDb);
                                        } else {
                                            that.createJsonlog(logdate, configsDoc, memberModel, pouchActivityLogDb);
                                        }
                                    });
                                } else {

                                    $.cookie("forcedUpdateProfile",'false');
                                    alert(App.languageDict.attributes.Updated_Successfully);
                                    Backbone.history.navigate('dashboard');
                                    window.location.reload();
                                }
                            }, that.model)
                        }
                    })
                }
            }
        },

        removeSpaces: function()
        {
            var firstName = this.model.get("firstName");
            var lastName = this.model.get("lastName");
            var middleName = this.model.get("middleNames");
            var loginName = this.model.get("login");
            this.model.set("firstName", $.trim(firstName));
            this.model.set("lastName", $.trim(lastName));
            this.model.set("middleNames", $.trim(middleName));
            this.model.set("login", $.trim(loginName));
        },

        validateMemberForm : function(){
            var isCorrect=true;
            if ($.trim($('.bbf-form .field-firstName .bbf-editor input').val()) =='' || $('.bbf-form .field-firstName .bbf-editor input').val() ==null || $('.bbf-form .field-firstName .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-firstName label').css('color','red');
            }
            else{

                $('.bbf-form .field-firstName label').css('color','black');
            }
            if ($.trim($('.bbf-form .field-lastName .bbf-editor input').val()) =='' || $('.bbf-form .field-lastName .bbf-editor input').val() ==null || $('.bbf-form .field-lastName .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-lastName label').css('color','red');
            }
            else
            {

                $('.bbf-form .field-lastName label').css('color','black');
            }
            if ($.trim($('.bbf-form .field-login .bbf-editor input').val()) =='' || $('.bbf-form .field-login .bbf-editor input').val() ==null || $('.bbf-form .field-login .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-login label').css('color','red');
            }
            else{

                $('.bbf-form .field-login label').css('color','black');
            }
            if ((this.model.get('_id') == undefined) && ($('.bbf-form .field-password .bbf-editor input').val() =='' || $('.bbf-form .field-password .bbf-editor input').val() ==null || $('.bbf-form .field-password .bbf-editor input').val() ==undefined)) // HT: password optional in case of edit 
            {
                isCorrect=false;
                $('.bbf-form .field-password label').css('color','red');
            }
            else{

                $('.bbf-form .field-password label').css('color','black');
            }

        if ( $('.bbf-form .field-Gender .bbf-editor select').val() =='' || $('.bbf-form .field-Gender .bbf-editor select').val() ==null || $('.bbf-form .field-Gender .bbf-editor select').val() ==undefined  ) {
           // $('.bbf-form .field-Gender label').html(App.languageDict.attributes.Gender + '[ '+App.languageDict.attributes.Required_Text + ']');
            isCorrect=false;
            $('.bbf-form .field-Gender label').css('color','red');   //shows that Gender is not correct.
        }
        else{

            $('.bbf-form .field-Gender label').css('color','black');
        }
            if($('.bbf-form .field-levels .bbf-editor select').val() =='' || $('.bbf-form .field-levels .bbf-editor select').val() ==null || $('.bbf-form .field-levels .bbf-editor select').val() ==undefined) {
                //$('.bbf-form .field-levels .bbf-error').html(App.languageDict.attributes.Required_Text);
                isCorrect=false;
                $('.bbf-form .field-levels label').css('color','red');
            }
            else{

                $('.bbf-form .field-levels label').css('color','black');
            }
                if( //validations for date
                $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==''
                    || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==null ||
                $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==undefined ||
                        //validations for month
                    $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==''
                || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==null || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==undefined
                    //validations for year
                     ||$('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()=='' || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()==null ||
                    $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()==undefined ) {
                   // $('.bbf-form .field-BirthDate .bbf-error').html(App.languageDict.attributes.Required_Text);
                    isCorrect=false;
                    $('.bbf-form .field-BirthDate label').css('color','red');
                }
            else{
                    //Now, validate age range [5,100] (Inclusive)
                  if(this.getAgeOfUser()<5 || this.getAgeOfUser()>100) {
                      alert(App.languageDict.attributes.Birthday_Range);
                      isCorrect = false;
                      $('.bbf-form .field-BirthDate label').css('color','red');
                  }
                  else{

                      $('.bbf-form .field-BirthDate label').css('color','black');
                  }
                }
            return isCorrect;
        },

        getAgeOfUser: function()
        {
            var  birthDate=new Date($('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val(),
                $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val(),
                $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val());
            var todayDate = new Date();
            var age = todayDate.getFullYear() - birthDate.getFullYear();
            var m = todayDate.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },

        createJsonlog: function(logdate, configsDoc, member, pouchActivityLogDb) {
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                female_new_signups: 0,
                male_new_signups: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: configsDoc.code,
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {
                docJson.male_new_signups = 1;
            } else {
                docJson.female_new_signups = 1;
            }
            pouchActivityLogDb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log(response);
                } else {
                    console.log(err);
                }
                $.cookie("forcedUpdateProfile",'false');
                alert(App.languageDict.attributes.Successfully_Registered);
                Backbone.history.navigate('members', {
                    trigger: true
                });
            });
        },

        UpdatejSONlog: function(logdate, pouchActivityLogRec, member, pouchActivityLogDb) {
            if (member.get('Gender') == 'Male') {
                pouchActivityLogRec.male_new_signups = parseInt(((pouchActivityLogRec.male_new_signups) ? pouchActivityLogRec.male_new_signups : 0)) + 1;
            } else {
                pouchActivityLogRec.female_new_signups = parseInt(((pouchActivityLogRec.female_new_signups) ? pouchActivityLogRec.female_new_signups : 0)) + 1;
            }
            pouchActivityLogDb.put(pouchActivityLogRec, logdate, pouchActivityLogRec._rev, function(err, response) {
                if (!err) {
                    console.log(response);
                } else {
                    console.log(err);
                }
                $.cookie("forcedUpdateProfile",'false');
                alert(App.languageDict.attributes.Successfully_Registered);
                Backbone.history.navigate('members', {
                    trigger: true
                });
            });
        }
    })

})
;

$(function() {

    App.Views.siteFeedback = Backbone.View.extend({

        tagName: "div",
        id: "site-feedback",
        authorName: null,

        initialize: function() {},

        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function() {
            Backbone.history.navigate('siteFeedback', {
                trigger: true
            })
        },
        cancelform: function() {
            $('#site-feedback').animate({
                height: 'toggle'
            })
            this.unsetForm()
        },
        setForm: function() {
            if ($('#comment').val().length != 0 && $('input[name="category"]:checked').val()) {
                var temp = Backbone.history.location.href
                var now = new Date();
                now.getDate()
                temp = temp.split('#')
                var peri = '';
                if ($("#priority").is(':checked')) {
                    peri = 'urgent'
                }
                this.model.set({
                    comment: $('#comment').val(),
                    category: $('input[name="category"]:checked').val(),
                    priority: peri,
                    PageUrl: "Personal:" + temp[1],
                    Resolved: '0',
                    memberLogin: $.cookie('Member.login'),
                    time: now.toString(),
                    communityCode: App.configuration.get('code')
                })
                this.model.save()
                alert(App.languageDict.attributes.FeedBack_Sent_success)
                this.unsetForm()
            }

            $('#site-feedback').animate({
                height: 'toggle'
            })
        },
        unsetForm: function() {
            $('#comment', this.$el).val("")
            $('input[name="category"]').attr('checked', false)
            $("#priority").attr('checked', false)
        },

        render: function() {
            this.$el.append('<br/><br/><div class="form-field" ><input name="PageUrl" id="PageUrl" type="text"></div>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><input name="priority" value="urgent" id="priority" type="checkbox"><label for="priority">'+App.languageDict.attributes.Urgent+'</label></div>')
            this.$el.append('<div class="form-field" style="margin-top: -19px;margin-left: 115px;"> <input type="radio" name="category" value="Bug">&nbsp '+App.languageDict.attributes.Bug+' &nbsp&nbsp&nbsp<input type="radio" name="category" value="Question">&nbsp '+App.languageDict.attributes.Question+' &nbsp&nbsp&nbsp<input type="radio" name="category" value="Suggestion">&nbsp '+App.languageDict.attributes.Suggestion+' &nbsp&nbsp&nbsp</div><br/><br/>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><textarea †rows="7" type="text" name="comment" placeholder="" id="comment"></textarea></div>')
            this.$el.append('<div class="form-field"><input name="Resolved" id="Resolved" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="memberLogin" id="memberLogin" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="time" id="time" type="text"></div>')
            $('#PageUrl', this.$el).hide()
            $('#Resolved', this.$el).hide()
            $('#memberLogin', this.$el).hide()
            $('#time', this.$el).hide()
            var $button;
            if(App.languageDict.get("directionOfLang").toLowerCase() == "right")
            {
                $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">'+App.languageDict.attributes.Cancel+'</button><button class="btn btn-hg btn-info" id="ViewAllButton">'+App.languageDict.attributes.View+'</button><button class="btn btn-hg btn-primary" id="formButton">'+App.languageDict.attributes.Submit+'</button></div>');
            }
            else
            {
                $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-primary" id="formButton">'+App.languageDict.attributes.Submit+'</button><button class="btn btn-hg btn-info" id="ViewAllButton">'+App.languageDict.attributes.View+'</button><button class="btn btn-hg btn-danger" id="CancelButton">'+App.languageDict.attributes.Cancel+'</button></div>')
            }

            this.$el.append($button);

        }
    })
});

$(function() {

    App.Views.Dashboard = Backbone.View.extend({

        template: $('#template-Dashboard').html(),

        vars: {},
        nationConfiguration: null,
        latestVersion: null,
        nationConfigJson: null,
        events: {
            "click #onlineButton": function(e) {
                $('#popupDiv').fadeIn();
                $('#popupText').text($('#onlineButton').attr("title"));
                setTimeout(function(){ $('#popupDiv').fadeOut() }, 5000);
            },
            "click #updateButton": 'updateVersion',
            "click #showReleaseNotesDiv": function(e) {
                if ($('#releaseVersion').css('display') == 'none') {
                    $("#releaseVersion").slideDown("slow", function() {

                    });
                } else {
                    $("#releaseVersion").slideUp("slow", function() {
                        $('#appversion').val("")
                        $('#notes').val("")
                    });
                }
            },
            "click #cancelnotes": function(e) {
                $("#releaseVersion").slideUp("slow", function() {
                    $('#appversion').val("")
                    $('#notes').val("")
                });
            },
            "click #savenotes": function(e) {
                if ($('#appversion').val() == "") {
                    alert(App.languageDict.attributes.Prompt_Version_Number)
                    return
                }
                if ($('#notes').val() == "") {
                    alert(App.languageDict.attributes.Prompt_ReleaseNotes)
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
                    success: function(e) {
                        $("#releaseVersion").slideUp("slow", function() {
                            $('#appversion').val("")
                            $('#notes').val("")
                            alert(App.languageDict.attributes.Notes_Saved_Success)
                        })
                    }
                })


            },
            "click #viewReleaseNotes": function(e) {
                if ($('#showReleaseNotes').css('display') == 'none') {
                    $("#showReleaseNotes").slideDown("slow", function() {
                        $("textarea#shownotes").val(nationConfigJson.notes)

                    });
                } else {
                    $("#showReleaseNotes").slideUp("slow", function() {});
                }
                var languageDictValue;
                var lang = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(lang);
                var directionOfLang=languageDictValue.get('directionOfLang');
                applyCorrectStylingSheet(directionOfLang)
                //  applyStylingSheet();
            }
        },

        initialize: function() {
            var that = this;
            that.secondUpdateIteration();
        },
        secondUpdateIteration: function() {
            var that = this;
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false,
                success: function() {
                    var typeofBell = config.first().attributes.type;
                    var count = config.first().attributes.countDoubleUpdate;
                    var commVersion = config.first().attributes.version;
                    var isAppsDocAlright = false;
                    // if (typeofBell === "community" && flag === false && count > 1) {
                    if (typeofBell === "community") {
                        if (count != undefined && count != null) {
                            if (count === 1) {
                                //This code has been added for issue#177
                                if (that.versionCompare(commVersion, "0.11.92") > 0) {
                                    $.couch.allDbs({
                                        success: function (data) {
                                            if (data.indexOf('tempapps') != -1) {
                                                $.couch.db("tempapps").info({
                                                    success: function(tempAppsInfo) {
                                                        var docsCount = tempAppsInfo.doc_count;
                                                        if(docsCount >= 4) {
                                                            $.couch.db("tempapps").openDoc("_design/bell", {
                                                                success: function(tempappsDoc) {
                                                                    $.couch.db("apps").openDoc("_design/bell", {
                                                                        success: function(appsDoc) {
                                                                            //If the rev's of both the docs are not same or there is no tempapps db or tempappsDoc,
                                                                            // it means there were some disturbance during the update
                                                                            // e.g: force refresh or internet connection.
                                                                            if(tempappsDoc._rev == appsDoc._rev) {
                                                                                isAppsDocAlright = true;
                                                                            }
                                                                            if(isAppsDocAlright) {
                                                                                ////////////////////////////////
                                                                                App.startActivityIndicator();
                                                                                console.log('countDoubleUpdate is 1 so callingUpdateFunctions ....');
                                                                                that.callingUpdateFunctions();
                                                                                ////////////////////////////////
                                                                            } else {
                                                                                alert(App.languageDict.attributes.Poor_Internet_Error);
                                                                            }
                                                                        },
                                                                        error: function(status) {
                                                                            console.log(status);
                                                                            alert(App.languageDict.attributes.Poor_Internet_Error);
                                                                        }
                                                                    });
                                                                },
                                                                error: function(status) {
                                                                    console.log(status);
                                                                    alert(App.languageDict.attributes.Poor_Internet_Error);
                                                                }
                                                            });
                                                        } else {
                                                            alert(App.languageDict.attributes.Poor_Internet_Error);
                                                        }
                                                    }
                                                });
                                            } else {
                                                alert(App.languageDict.attributes.Poor_Internet_Error);
                                            }
                                        }
                                    });
                                } else {
                                    App.startActivityIndicator();
                                    console.log('countDoubleUpdate is 1 so callingUpdateFunctions ....');
                                    that.callingUpdateFunctions();
                                }
                            } else {
                                console.log("countDoubleUpdate is less than 1, No need to update the community")
                                //If count != 1 and tempapps db exists then we can remove the db
                                // because its of no use.It is only used in app update.
                                $.couch.allDbs({
                                    success: function (data) {
                                        if (data.indexOf('tempapps') != -1) {
                                            $.couch.db("tempapps").drop({
                                                success: function (res) {
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        } else {
                            console.log("Creating countDoubleUpdate in community configurations as it does not exist")
                            that.updateConfigsOfCommunity(0);
                            console.log('callingUpdateFunctions after creating countDoubleUpdate ....');
                            //If count != 1 and tempapps db exists then we can remove the db
                            // because its of no use.It is only used in app update.
                            $.couch.allDbs({
                                success: function (data) {
                                    if (data.indexOf('tempapps') != -1) {
                                        $.couch.db("tempapps").drop({
                                            success: function (res) {
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        //End
                        console.log('End of secondUpdateIteration ....');
                    }
                }
            })
        },

        remove: function() {
            $(window).off('resize.resizeview');
            Backbone.View.prototype.remove.call(this);
        },
        getNationInfo: function() {
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first().toJSON().rows[0].doc
            var nationName = currentConfig.nationName
            var nationURL = currentConfig.nationUrl
            var nationInfo = {};
            nationInfo["nationName"] = nationName;
            nationInfo["nationURL"] = nationURL;
            return nationInfo;
        },
        updateVersion: function(e) {
            var that = this;
            App.startActivityIndicator();
            var currCommConfig = that.getCommunityConfigs()
            if (currCommConfig.countDoubleUpdate) {
                that.updateConfigsOfCommunity(1)
            } else {
                that.updateConfigsOfCommunity(1)
            }
            var nationInfo = that.getNationInfo();
            var nationName = nationInfo["nationName"];
            var nationURL = nationInfo["nationURL"];
            var communitycode = App.configuration.get('code');
            //Checking whether the community is registered with any nation or not.
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true',
                type: 'GET',
                dataType: 'jsonp',
                success: function(result) {
                    if (result.rows.length > 0) {
                        var doc;
                        for(var i = 0 ; i < result.rows.length ; i++) {
                            var code;
                            if(result.rows[i].value.Code != undefined){
                                code = result.rows[i].value.Code;
                            } else {
                                code = result.rows[i].value.code;
                            }
                            if(communitycode == code) {
                                doc = result.rows[i].value;
                            }
                        }
                        if(doc != undefined) {
                            that.appsCreation();
                        } else {
                            alert(App.languageDict.attributes.UnAuthorized_Community);
                            window.location.reload(false);
                        }
                    } else {
                        alert(App.languageDict.attributes.UnAuthorized_Community);
                        window.location.reload(false);
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        },

        appsCreation: function() {
            var that = this;
            // Replicate Application Code from Nation to Community
            //Here we are replicating apps to tempApps first, so that we may avoid the deletion
            // and creation of apps db until unless the replication is successful
            $.couch.allDbs({
                success: function(data) {
                    if (data.indexOf('tempapps') != -1) {
                        $.couch.db("tempapps").drop({
                            success: function(data) {
                                $.couch.db("tempapps").create({
                                    success: function(data) {
                                        that.replicateAppsToTempDB();
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    }
                                });
                            },
                            error: function(status) {
                                console.log(status);
                            },
                            async: false
                        });
                    } else {
                        $.couch.db("tempapps").create({
                            success: function(data) {
                                that.replicateAppsToTempDB();
                            }
                        });
                    }
                }
            });
        },

        replicateAppsToTempDB: function() {
            var that = this;
            var nationInfo = that.getNationInfo();
            var nationName = nationInfo["nationName"];
            var nationURL = nationInfo["nationURL"];
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
                    "target": "tempapps"
                }),
                async: false,
                success: function(response) {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": 'http://' + nationName + ':oleoleole@' + nationURL + '/languages',
                            "target": "tempapps"
                        }),
                        async: false,
                        success: function (response) {
                            $.couch.allDbs({
                                success: function(data) {
                                    if (data.indexOf('apps') != -1) {
                                        $.couch.db("apps").drop({
                                            success: function(data) {
                                                $.couch.db("apps").create({
                                                    success: function(data) {
                                                        that.updateAppsAndDesignDocs();
                                                    },
                                                    error: function(status) {
                                                        alert(App.languageDict.attributes.Create_Apps_Error);
                                                    }
                                                });
                                            },
                                            error: function(status) {
                                                console.log(status);
                                            },
                                            async: false
                                        });
                                    } else {
                                        $.couch.db("apps").create({
                                            success: function(data) {
                                                that.updateAppsAndDesignDocs();
                                            }
                                        });
                                    }
                                }
                            });
                        },
                        error: function() {
                            console.log("languages replication failed")
                        }
                    });
                },
                error: function() {
                    alert(App.languageDict.attributes.TempApp_Replication_Error)
                }
            });
        },

        //callingUpdateFunctions
        callingUpdateFunctions: function() {
            App.startActivityIndicator();
            var that = this;
            var nationInfo = that.getNationInfo();
            var nationName = nationInfo["nationName"];
            var nationURL = nationInfo["nationURL"];

            dashboard_update_passwords();
            //
            //Updating configurations and other db's
            that.updateLanguageDocs();
            //Onward are the Ajax Request for all Updated Design Docs
            that.updateDesignDocs("activitylog");
            that.updateDesignDocs("members");
            that.updateDesignDocs("collectionlist");
            that.updateDesignDocs("community");
            that.updateDesignDocs("resources");
            that.updateDesignDocs("survey");
            that.updateDesignDocs("surveyresponse");
            that.updateDesignDocs("surveyquestions");
            that.updateDesignDocs("surveyanswers");
            that.updateDesignDocs("coursestep");
            /////////////////////////////////////////
            that.updateConfigsOfCommFromNation();
            ////////////////////////////////////////
            that.updateDesignDocs("groups");
            that.updateDesignDocs("publications");
            //Following are the list of db's on which design_docs are not updating,
            // whenever the design_docs will be changed in a db,that db's call will be un-commented.
            //that.updateDesignDocs("assignmentpaper");
            //that.updateDesignDocs("assignments");
            //that.updateDesignDocs("calendar");
            //that.updateDesignDocs("communityreports");
            //that.updateDesignDocs("courseschedule");
            //that.updateDesignDocs("feedback");
            //that.updateDesignDocs("invitations");
            //that.updateDesignDocs("mail");
            //that.updateDesignDocs("meetups");
            //that.updateDesignDocs("membercourseprogress");
            //that.updateDesignDocs("nationreports");
            //that.updateDesignDocs("publicationdistribution");
            //that.updateDesignDocs("report");
            //that.updateDesignDocs("requests");
            //that.updateDesignDocs("resourcefrequency");
            //that.updateDesignDocs("shelf");
            //that.updateDesignDocs("usermeetups");

            // Update LastAppUpdateDate at Nation's Community Records
            var communitycode = App.configuration.get('code');
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true',
                type: 'GET',
                dataType: 'jsonp',
                success: function(result) {
                    if (result.rows.length > 0) {
                        var doc;
                        for(var i = 0 ; i < result.rows.length ; i++) {
                            var code;
                            if(result.rows[i].value.Code != undefined){
                                code = result.rows[i].value.Code;
                            } else {
                                code = result.rows[i].value.code;
                            }
                            if(communitycode == code) {
                                doc = result.rows[i].value;
                            }
                        }
                        if(doc != undefined) {
                            that.lastAppUpdateAtNationLevel(doc);
                        }
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });


        },

        updateAppsAndDesignDocs: function() {
            var docsIds = [];
            docsIds.push("_design/bell");
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "tempapps",
                    "target": "apps",
                    'doc_ids': docsIds
                }),
                async: false,
                success: function (response) {
                    window.location.reload(false);
                },
                error: function(status) {
                    console.log(status);
                    alert(App.languageDict.attributes.UnableToReplicate);
                }
            });
        },

        updateDesignDocs: function(dbName) {
            console.log("updateDesignDocs(" + dbName + ") started");
            var that = this;
            var nationInfo = that.getNationInfo();
            var nationName = nationInfo["nationName"];
            var nationURL = nationInfo["nationURL"];
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": 'http://' + nationName + ':oleoleole@' + nationURL + '/' + dbName,
                    "target": dbName,
                    "doc_ids": ["_design/bell"],
                    "create_target": true
                }),
                success: function(response) {
                    console.log(dbName + " DesignDocs successfully updated.");
                },
                error: function(status) {
                    console.log(status);
                },
                async: false
            });
            console.log("updateDesignDocs(" + dbName + ") finished");
        },

        getCommunityConfigs: function() {
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first().toJSON().rows[0].doc
            return currentConfig;
        },
        updateConfigsOfCommunity: function(count) {
            var currentConfig = this.getCommunityConfigs();
            currentConfig.countDoubleUpdate = count;
            var doc = currentConfig;
            $.couch.db("configurations").saveDoc(doc, {
                success: function(data) {
                    console.log("Configurations updated for countDoubleupdate: " + data);
                },
                error: function(status) {
                    console.log(status);
                }
            });
            var flagValue = this.getCommunityConfigs();
            return flagValue;
        },
        updateConfigsOfCommFromNation: function() {
            var that = this;
            // Update version Number and availableLanguages in Configuration of Community
            var currentConfig = that.getCommunityConfigs();
            var nationInfo = that.getNationInfo();
            var nationName = nationInfo["nationName"];
            var nationURL = nationInfo["nationURL"];
            var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + '/configurations/_all_docs?include_docs=true'
            $.ajax({
                url: nationConfigURL,
                type: 'GET',
                dataType: "jsonp",
                success: function(json) {
                    var nationConfig = json.rows[0].doc
                    currentConfig.version = nationConfig.version;
                    currentConfig.register = nationConfig.register;
                    if(currentConfig.availableLanguages && currentConfig.availableLanguages!=undefined && currentConfig.availableLanguages!=null  )
                    {
                        delete currentConfig.availableLanguages;
                    }
                    var doc = currentConfig;
                    $.couch.db("configurations").saveDoc(doc, {
                        success: function(data) {
                            console.log("Configurations updated");
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });
                }
            });
        },

        updateLanguageDocs: function() {
            var that = this;
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false,
                success: function () {
                    var commVersion = config.first().attributes.version;
                    if (that.versionCompare(commVersion, "0.11.92") > 0) {
                        $.couch.db("tempapps").allDocs({
                            success: function(langDocsData) {
                                var langDocs = langDocsData.rows;
                                var langDocsIds = [];
                                for(var i = 0 ; i < langDocs.length ; i++) {
                                    if(langDocs[i].id != "_design/bell") {
                                        langDocsIds.push(langDocs[i].id);
                                    }
                                }
                                $.couch.allDbs({
                                    success: function(data) {
                                        if (data.indexOf('languages') != -1) {
                                            $.couch.db("languages").drop({
                                                success: function(data) {
                                                    $.couch.db("languages").create({
                                                        success: function(data) {
                                                            that.replicateLanguagesfromTempDB(langDocsIds);
                                                        },
                                                        error: function(status) {
                                                            alert(App.languageDict.attributes.LanguagesDb_Creation_Error);
                                                        }
                                                    });
                                                },
                                                error: function(status) {
                                                    console.log(status);
                                                },
                                                async: false
                                            });
                                        } else {
                                            $.couch.db("languages").create({
                                                success: function(data) {
                                                    that.replicateLanguagesfromTempDB(langDocsIds);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        var nationInfo = that.getNationInfo();
                        var nationName = nationInfo["nationName"];
                        var nationURL = nationInfo["nationURL"];
                        $.ajax({
                            url: '/languages/_all_docs?include_docs=true',
                            type: 'GET',
                            dataType: 'json',
                            success: function(langResult) {
                                var resultRows = langResult.rows;
                                var docs = [];
                                for (var i = 0; i < resultRows.length; i++) {
                                    docs.push(resultRows[i].doc);
                                }
                                $.couch.db("languages").bulkRemove({
                                    "docs": docs
                                }, {
                                    success: function(data) {
                                        var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + '/languages/_all_docs?include_docs=true'
                                        $.ajax({
                                            url: nationConfigURL,
                                            type: 'GET',
                                            dataType: "jsonp",
                                            success: function(json) {
                                                var nationLangRows = json.rows;
                                                var commLangDocs = [];
                                                for (var i = 0; i < nationLangRows.length; i++) {
                                                    var langDoc = nationLangRows[i].doc;
                                                    delete langDoc._id;
                                                    delete langDoc._rev;
                                                    commLangDocs.push(langDoc);
                                                }
                                                $.couch.db("languages").bulkSave({
                                                    "docs": commLangDocs
                                                }, {
                                                    success: function(data) {
                                                        console.log("Languages updated");
                                                    },
                                                    error: function(status) {
                                                        console.log(status);
                                                    }
                                                });
                                            }
                                        });
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        replicateLanguagesfromTempDB: function(langDocsIds) {
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "tempapps",
                    "target": "languages",
                    'doc_ids': langDocsIds
                }),
                async: false,
                success: function (response) {
                    console.log("languages updated");
                },
                error: function(status) {
                    console.log("Unable to replicate languages");
                }
            });
        },

        lastAppUpdateAtNationLevel: function(result) {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var that = this;
            var currentConfig = that.getCommunityConfigs();
            var communityModelId = result._id;
            var nationInfo = that.getNationInfo();
            var nationName = nationInfo["nationName"];
            var nationURL = nationInfo["nationURL"];
            //Replicate from Nation to Community
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": 'http://' + nationName + ':oleoleole@' + nationURL + '/community',
                    "target": "community",
                    "doc_ids": [communityModelId]
                }),
                success: function(response) {
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = (1 + date.getMonth()).toString();
                    month = month.length > 1 ? month : '0' + month;
                    var day = date.getDate().toString();
                    day = day.length > 1 ? day : '0' + day;
                    var formattedDate = month + '-' + day + '-' + year;
                    ////////////////////////////////////////////////////
                    var communitycode = App.configuration.get('code');
                    $.ajax({
                        url: '/community/_design/bell/_view/getCommunityByCode?_include_docs=true',
                        type: 'GET',
                        dataType: 'json',
                        success: function(result) {
                            if (result.rows.length > 0) {
                                var communityModel;
                                for(var i = 0 ; i < result.rows.length ; i++) {
                                    var code;
                                    if(result.rows[i].value.Code != undefined){
                                        code = result.rows[i].value.Code;
                                    } else {
                                        code = result.rows[i].value.code;
                                    }
                                    if(communitycode == code) {
                                        communityModel = result.rows[i].value;
                                    }
                                }
                                communityModel.lastAppUpdateDate = month + '/' + day + '/' + year;
                                communityModel.version = currentConfig.version;
                                //Update the record in Community db at Community Level
                                $.ajax({

                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'multipart/form-data'
                                    },
                                    type: 'PUT',
                                    url: App.Server + '/community/' + communityModelId + '?rev=' + communityModel._rev,
                                    dataType: 'json',
                                    data: JSON.stringify(communityModel),
                                    success: function(response) {
                                        communityModel._rev = response.rev;
                                        var currCommConfig = that.updateConfigsOfCommunity(2); //update countDoubleUpdate to 2
                                        //Replicate from Community to Nation
                                        $.ajax({
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json; charset=utf-8'
                                            },
                                            type: 'POST',
                                            url: '/_replicate',
                                            dataType: 'json',
                                            data: JSON.stringify({
                                                "source": "community",
                                                "target": 'http://' + nationName + ':oleoleole@' + nationURL + '/community',
                                                "doc_ids": [communityModelId]
                                            }),
                                            success: function(response) {
                                                var currConfigOfComm = that.getCommunityConfigs()
                                                if(!currConfigOfComm.hasOwnProperty('registrationRequest')) {
                                                    $.couch.db("community").removeDoc(communityModel, {
                                                        success: function(data) {
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                        }
                                                    });
                                                }
                                                if (currConfigOfComm.countDoubleUpdate > 1) {
                                                    //Deleting the temp db's
                                                    $.couch.allDbs({
                                                        success: function (data) {
                                                            if (data.indexOf('tempapps') != -1) {
                                                                $.couch.db("tempapps").drop({
                                                                    success: function (res) {
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                                alert(languageDictValue.attributes.Updated_Successfully);
                                                window.location.reload(false);
                                            },
                                            async: false
                                        });
                                    },

                                    async: false
                                });
                            }
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                    ////////////////////////////////////////////////////
                },
                async: false
            });
        },

        getSurveysCountForMember: function () {
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            });
            var config = new configurations();
            config.fetch({
                async: false
            });
            var jsonConfig = config.first().toJSON().rows[0].doc;
            var new_surveys_count = 0;
            var members = new App.Collections.Members()
            var member, memberId;
            members.login = $.cookie('Member.login');
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        for(var i = 0; i < members.length; i++)
                        {
                            if(members.models[i].get("community") == jsonConfig.code)
                            {
                                member = members.models[i];
                                memberId = member.get('login') + '_' + member.get('community');
                                $.ajax({
                                    url: '/survey/_design/bell/_view/surveyByreceiverIds?_include_docs=true&key="' + memberId + '"',
                                    type: 'GET',
                                    dataType: 'json',
                                    async:false,
                                    success: function(memberSurveyData) {
                                        var surveyDocs = [];
                                        _.each(memberSurveyData.rows, function(row) {
                                            surveyDocs.push(row);
                                        });
                                        $.ajax({
                                            url: '/surveyresponse/_design/bell/_view/surveyResBymemberId?_include_docs=true&key="' + memberId + '"',
                                            type: 'GET',
                                            dataType: 'json',
                                            async:false,
                                            success: function(memberSurveyResData) {
                                                var surveyResDocs = [];
                                                _.each(memberSurveyResData.rows, function(row) {
                                                    surveyResDocs.push(row);
                                                });
                                                _.each(surveyDocs,function(row){
                                                    var surveyDoc  = row.value;
                                                    var index = surveyResDocs.map(function(element) {
                                                        return element.value.SurveyNo;
                                                    }).indexOf(surveyDoc.SurveyNo);
                                                    if (index == -1) { // its a survey which is not submitted yet
                                                        new_surveys_count++;
                                                    }
                                                });
                                            },
                                            error: function(status) {
                                                console.log(status);
                                            }
                                        });
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    }
                                });
                            }
                        }
                    }
                },
                async:false
            });
            return new_surveys_count;
        },

        render: function() {
            var that = this;
            $('#nav').css('pointer-events', 'auto');
            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configDoc = configCollection.first().toJSON();
            var communityConfigDoc = that.getCommunityConfigs();
            //Check if it is a new community or an older one with registrationRequest attribute
            if(!communityConfigDoc.hasOwnProperty('registrationRequest') && communityConfigDoc.countDoubleUpdate != 1 && communityConfigDoc.type == 'community' && (App.Router.getRoles().indexOf('Manager')>-1 || App.Router.getRoles().indexOf('SuperManager')>-1 )) {
                alert(App.languageDict.get('fill_config_first'));
                window.location.href = '#configurationsForm'
            }
            var dashboard = this
            var newSurveysCountForMember = dashboard.getSurveysCountForMember();
            this.vars.mails = 0;
            this.vars.nation_version = 0;
            this.vars.new_publication_count = 0;
            this.vars.new_survey_count = 0;
            this.vars.survey_count_for_member = 0;
            this.vars.pending_request_count = 0;
            this.vars.pending_resource_count = 0;
            var pendingCount=0;
            var tempResourceCount = 0;
            if(configDoc.type == 'nation') {
                $.ajax({
                    url: '/communityregistrationrequests/_design/bell/_view/getDocById?_include_docs=true',
                    type: 'GET',
                    dataType: 'json',
                    async:false,
                    success: function(pendingData) {
                        for(var i = 0 ; i < pendingData.rows.length ; i++) {
                            if(pendingData.rows[i].value.registrationRequest == 'pending') {
                                pendingCount++;
                            }
                        }
                    },
                    error:function(error){
                        console.log(error);
                    }
                });
            }
            this.vars.pending_request_count=pendingCount;
            var resources = new App.Collections.Resources();
            resources.setUrl(App.Server + '/resources/_design/bell/_view/ResourcesWithPendingStatus?include_docs=true');
            resources.fetch({
                async:false,
                success: function() {
                    tempResourceCount = resources.length;
                }
            });
            this.vars.pending_resource_count = tempResourceCount;
            var members = new App.Collections.Members()
            var member;
            var lang;
            members.login = $.cookie('Member.login');
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            });
            var config = new configurations();
            config.fetch({
                async: false
            });
            var jsonConfig = config.first().toJSON().rows[0].doc;
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        for(var i = 0; i < members.length; i++)
                        {
                            if(members.models[i].get("community") == jsonConfig.code)
                            {
                                member = members.models[i];
                                break;
                            }
                        }
                    }
                },
                async:false

            });
            //lang=member.get('bellLanguage');
            var clanguage = getLanguage($.cookie('Member._id'));
            App.languageDict = getSpecificLanguage(clanguage);
            this.vars.currentLanguageOfApp=App.languageDict.get('nameInNativeLang');
            this.vars.availableLanguagesOfApp=getAvailableLanguages();

            var typeofBell = App.configuration.get("type")
            this.vars.languageDict = App.languageDict;

            this.vars.imgURL = "img/header_slice.png"
            var a = new App.Collections.MailUnopened({
                receiverId: $.cookie('Member._id')
            })
            a.fetch({
                async: false
            })
            this.vars.mails = a.length
            this.vars.survey_count_for_member = newSurveysCountForMember;
            this.vars.type = typeofBell;
            this.$el.html(_.template(this.template, this.vars))

            groups = new App.Collections.MemberGroups()
            groups.memberId = $.cookie('Member._id')
            groups.fetch({
                success: function(e) {
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
            /*var clanguage = App.configuration.get("currentLanguage");
             // fetch dict for the current/selected language from the languages db/table
             var languages = new App.Collections.Languages();
             languages.fetch({
             async: false
             //  data: $.param({ page: 1})
             });
             var languageDict;
             for (var i = 0; i < languages.length; i++) {
             if (languages.models[i].attributes.hasOwnProperty("nameOfLanguage")) {
             if (languages.models[i].attributes.nameOfLanguage == clanguage) {
             languageDict = languages.models[i];
             }
             }
             }
             App.languageDict = languageDict;*/
            var dayOfToday = moment().format('dddd');
            var todayMonth = moment().format('MMMM');
            var currentDay = this.lookup(App.languageDict, "Days." + dayOfToday);
            var currentMonth = this.lookup(App.languageDict, "Months." + todayMonth);
            var currentDate = moment().format('DD');
            var currentYear = moment().format('YYYY');
            $('.now').html(currentDay + ' | ' + currentDate + ' ' + currentMonth + ', ' + currentYear);
            // Member Name
            var member = App.member;
            var lastEditDate=member.get("lastEditDate");
            var isRemind=false;
            var roles=member.get('roles');
            var memberRoles = member.get('roles');
            if (!(roles.indexOf("Manager") > -1) && member.get("FirstName")!='Default' &&
                member.get('LastName')!='Admin')
            {
                //Member is not the default created "Admin", so check for Reminder for Profile.
                if(lastEditDate==undefined)
                {
                    //'This User was registered prior the addition of lastEdit Field was added in schema'
                    isRemind=true;
                }
                else
                {
                    var lastEdit=lastEditDate.split('-');
                    lastEditDate=parseInt(lastEdit[0]);
                    if(parseInt(new Date().getFullYear()) - lastEditDate  >=1)
                    {
                        //'An year has passed... since last changes made to configurations of member'
                        isRemind=true;
                    }
                    else
                    {
                        //'No Need to remind user.. He just reviewed his configurations this year....'
                        isRemind=false;
                    }
                }
                if(isRemind)
                {
                    alert(App.languageDict.attributes.UpdateProfile);
                    $.cookie("forcedUpdateProfile", 'true');
                    Backbone.history.navigate('member/edit/' + member.get('_id'), {trigger: true});

                }
                else
                {
                    $.cookie("forcedUpdateProfile", 'false');
                }

            }
            else
            {
                $.cookie("forcedUpdateProfile", 'false');
            }
            var attchmentURL = '/members/' + member.id + '/'
            if (typeof member.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(member.get('_attachments'))[0]
                document.getElementById("imgurl").src = attchmentURL
            }
            //////////////////////////////////////Issue No 73: Typo: Nation BeLL name (After) Getting Name from Configurations////////////////////////////////////
            var currentConfig;
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false,
                success: function() {
                    currentConfig = config.first().toJSON().rows[0].doc;
                }
            })
            var bell_Name;
            if(currentConfig.name != undefined) {
                bell_Name = currentConfig.name;
            } else {
                bell_Name = '';
            }
            var typeofBell = currentConfig.type;

            //////////////////////////////////////code for Issue No#73 (before) getting name from URL///////////////////////////////////////////////////////////
            /*var temp = $.url().data.attr.host.split(".")
             temp = temp[0];
             if (temp.substring(0, 3) == "127") {
             temp = "local"
             }
             temp = temp.charAt(0).toUpperCase() + temp.slice(1);
             if (typeofBell === "nation") {
             temp = temp + " Nation Bell"
             } else {
             temp = temp + " Community Bell"
             }*/
            //******************************************************************************************************************************************************
            bell_Name = bell_Name.charAt(0).toUpperCase() + bell_Name.slice(1); //capitalizing the first alphabet of the name.

            if (typeofBell === "nation") //checking that is it a nation or community
            {
                var nation = " " + App.languageDict.attributes.Nation + " " + App.languageDict.attributes.Bell;
                bell_Name = bell_Name + nation;
            } else {
                var community = " " + App.languageDict.attributes.Community + " " + App.languageDict.attributes.Bell;
                bell_Name = bell_Name + community;
            }
            $('.bellLocation').html(bell_Name); //rendering the name on page
            if (!member.get('visits')) {
                member.set('visits', 1)
                member.save()
            }
            if (parseInt(member.get('visits')) == 0) {
                temp = "Error!!"
            } else {
                //Getting Visits of any member**********************************************************/
                temp = member.get('visits') + ' ' + App.languageDict.attributes.Visits;
            }
            var roles = "&nbsp;-&nbsp;"
            var temp1 = 0
            //******************************-Getting Roles of Member**************************************/
            if (member.get("roles").indexOf("Learner") != -1) {

                roles = roles + App.languageDict.attributes.Learner; /******************Setting up Learner/Leader*****************/
                temp1 = 1
            }
            if (member.get("roles").indexOf("Leader") != -1) {
                if (temp1 == 1) {
                    roles = roles + ",&nbsp;"
                }
                roles = roles + App.languageDict.attributes.Leader;
                temp1 = 1
            }
            if (member.get("roles").indexOf("Manager") != -1) {

                var manager = App.languageDict.attributes.Manager;
                if (temp1 == 1) {
                    roles = roles + ",&nbsp;"
                }
                var managerId, test;
                if (typeofBell == 'nation') {
                    //  var natLink = '<a id= "NationManagerLink" href="../nation/index.html#dashboard" charset="UTF-8"></a>'
                    test = member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '<a id= "NationManagerLink" href="../nation/index.html#dashboard" charset="UTF-8">' + manager + '</a></span>' + '&nbsp;<a href="#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>';

                    managerId = "NationManagerLink";
                } else {

                    var config = new App.Collections.Configurations()
                    config.fetch({
                        async: false
                    })
                    var con = config.first()
                    App.configuration = con
                    var branch = App.configuration.get('subType')
                    if (branch == "branch") {
                        roles = roles + '<a href="#" style="pointer-events: none; color: #34495e">' + manager + '</a>'
                        con.set('nationName', 'random');
                        con.set('nationUrl', 'random');
                        con.save(null, { //Saving configurations
                            success: function(doc, rev) {

                                App.configuration = con;
                                alert(App.languageDict.attributes.Config_Changed_For_Branch);
                                Backbone.history.navigate('dashboard', {
                                    trigger: true
                                });
                            }
                        });
                    } else {
                        roles = roles + '<a href="#communityManage">' + manager + '</a>'
                    }

                    var commLink = '<a id= "CommunityManagerLink" href="#communityManage"></a>';
                    test = member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '<a id= "CommunityManagerLink" href="#communityManage" charset="UTF-8"></a></span>' + '&nbsp;<a id="gearIcon" href="#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>';
                    managerId = "CommunityManagerLink";
                }
                $('.name').html(test);
            }
            else{
                $('.name').html(member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '</span>' + '&nbsp;<a href="#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>')
            }

            $('.visits').html(temp);

            if (branch == "branch") {

                $('#gearIcon').hide();
            }
            if ($.cookie('Member.login') === "admin") {
                $('#welcomeButton').show();
            }
            $('#mailsDash').html(App.languageDict.attributes.Email + '(' + this.vars.mails + ')');
            if(this.vars.mails > 0)
            {
                $('#mailsDash').css({"color": "red"});
            }
            if(typeofBell == "nation" && memberRoles.indexOf("Manager") >= 0 && this.vars.pending_request_count > 0)
            {
                $('#pendingRequests').show();
            }
            if(typeofBell == "nation" && memberRoles.indexOf("Manager") >= 0 && this.vars.pending_resource_count > 0)
            {
                $('#pendingResources').show();
            }
            $('#surveysForMember').html(App.languageDict.attributes.Surveys + '(' + this.vars.survey_count_for_member + ')');
            if(this.vars.survey_count_for_member > 0)
            {
                $('#surveysForMember').css({"color": "red"});
                if(App.surveyAlert > 0)
                {
                    //You have a new survey, please submit your response
                    alert(App.languageDict.attributes.Survey_Alert);
                    App.surveyAlert = 0;
                }
            }
        },
        updateVariables: function(nation_version, new_publications_count, new_surveys_count) {
            var that = this;
            that.vars.mails = 0;
            this.vars.nation_version = 0;
            this.vars.new_publication_count = 0;
            var a = new App.Collections.MailUnopened({
                receiverId: $.cookie('Member._id')
            })
            a.fetch({
                async: false
            });
            that.vars.mails = a.length;
            var member = App.member;
            that.vars.nation_version = nation_version;
            that.vars.new_publication_count = new_publications_count;
            that.vars.new_survey_count = new_surveys_count;
            this.vars.type = App.configuration.get("type");
            that.$el.html(_.template(this.template, this.vars));
            this.checkAvailableUpdates(member.get('roles'), this, nation_version);
            $('#newPublication').html(App.languageDict.attributes.Publications + '(' + new_publications_count + ')');
            $('#updateButton').html(App.languageDict.attributes.Update_Available + '(' + nation_version + ')');
            $('#newSurvey').html(App.languageDict.attributes.Surveys + '(' + new_surveys_count + ')');
            return new_publications_count;

        },

        lookup: function(obj, key) {
            var type = typeof key;
            if (type == 'string' || type == "number") key = ("" + key).replace(/\[(.*?)\]/, function(m, key) { //handle case where [1] may occur
                return '.' + key;
            }).split('.');

            for (var i = 0, l = key.length; i < l; l--) {
                if (obj.attributes.hasOwnProperty(key[i])) {
                    obj = obj.attributes[key[i]];
                    i++;
                    if (obj[0].hasOwnProperty(key[i])) {
                        var myObj = obj[0];
                        var valueOfObj = myObj[key[i]];
                        return valueOfObj;
                    }

                } else {
                    return undefined;
                }
            }
            return obj;
        },

        checkAvailableUpdates: function(roles, dashboard, nation_version) {
            if ($.inArray('Manager', roles) == -1) {
                return
            }
            var configuration = App.configuration
            var nationName = configuration.get("nationName")
            var nationURL = configuration.get("nationUrl")
            var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + '/configurations/_all_docs?include_docs=true'

            nName = App.configuration.get('nationName')
            pass = App.password
            nUrl = App.configuration.get('nationUrl')
            currentBellName = App.configuration.get('name')
            var DbUrl = 'http://' + nName + ':' + pass + '@' + nUrl + '/publicationdistribution/_design/bell/_view/getPublications?include_docs=true&key=["' + currentBellName + '",' + false + ']'
            if (typeof nation_version === 'undefined') {
                /////No version found in nation
            } else if (nation_version == configuration.get('version')) {
                ///No updatea availabe
            } else {
                if (dashboard.versionCompare(nation_version, configuration.get('version')) < 0) {
                    console.log("Nation has lower application version than that of your community application")
                } else if (dashboard.versionCompare(nation_version, configuration.get('version')) > 0) {
                    dashboard.vars.nation_version = nation_version;
                    $('#updateButton').show();
                    $('#viewReleaseNotes').show();
                } else {
                    console.log("Nation is uptodate")
                }
            }
        },


        //following function compare version numbers.
        /*<li>0 if the versions are equal</li>
         A negative integer iff v1 < v2
         A positive integer iff v1 > v2
         NaN if either version string is in the wrong format*/

        versionCompare: function(v1, v2, options) {
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
                } else if (v1parts[i] > v2parts[i]) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (v1parts.length != v2parts.length) {
                return -1;
            }

            return 0;
        }

    });

});

$(function() {

    App.Views.GroupSpan = Backbone.View.extend({

        tagName: "td",

        className: 'course-box',

        template: $("#template-GroupSpan").html(),

        render: function() {
            if (this.model.keys().length < 5) {
                this.model.destroy()
                return
            }
            var vars = this.model.toJSON()
            var res = new App.Collections.membercourseprogresses()
            res.courseId = vars._id
            res.memberId = $.cookie('Member._id')
            res.fetch({
                async: false
            });
            var modl = ""
            var PassedSteps = 0
            var totalSteps = 0
            if (res.length != 0) {
                modl = res.first().toJSON()
                PassedSteps = 0
                temp = 0
                totalSteps = modl.stepsStatus.length
                while (temp < totalSteps) {
                    if (modl.stepsStatus[temp] == '1') {
                        PassedSteps++
                    }
                    temp++
                }
            }
            if (totalSteps != 0) {
                vars.yes = '<br>(' + PassedSteps + '/' + totalSteps + ')'
            } else {
                vars.yes = "<br>(No Steps)"
            }
            this.$el.append(_.template(this.template, vars))
        }

    })

});

$(function() {
    App.Views.GroupsSpans = Backbone.View.extend({

        tagName: "tr",

        addOne: function(model) {
            var modelView = new App.Views.GroupSpan({
                model: model
            })
            modelView.render()
            $('#cc').append(modelView.el)
        },

        addAll: function() {

            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {

                $('#cc').append("<td class='course-box'>"+App.languageDict.attributes.Empty_Courses+"</td>")
            }
        },

        render: function() {
            this.addAll()
        }

    })

});

$(function() {

  App.Views.ShelfSpan = Backbone.View.extend({

    tagName: "td",

    className: 'shelf-box',

    template: $("#template-ShelfSpan").html(),

    render: function() {

      var vars = this.model.toJSON()
      this.$el.append(_.template(this.template, vars))
    }

  })

});

$(function() {
    App.Views.ShelfSpans = Backbone.View.extend({

        tagName: "tr",

        render: function() {
            //Using the Existing Member Dictionary to Display the Records
            var that =this;
            var empty = true;
            var allhidden = true;
            for (var key in App.ShelfItems) {
                empty = false;
                break;
            }
            if (!empty) {
                $.each(App.ShelfItems, function(key, value) {

                    var arr = value.toString().split("+")
                    if (arr[0] != 'true') {
                        var resource = new App.Models.Resource({
                            _id: key
                        });
                        resource.fetch({
                            async: false
                        });
                        var vars = resource.toJSON();
                        var cancelButton = '';
                        if(App.languageDict.get('directionOfLang').toLowerCase() === "right")
                        {
                            cancelButton = '<tr style="height: 37%">' +
                                '<td align="left" valign="top"><a href="#" onclick="deleteResource(\'' + key + '\')"><img src="img/DeleteRed.png" ></a></td>' +
                                '</tr>';
                        }
                        else
                        {
                            cancelButton = '<tr style="height: 37%">' +
                                '<td align="right" valign="top"><a href="#" onclick="deleteResource(\'' + key + '\')"><img src="img/DeleteRed.png" ></a></td>' +
                                '</tr>';
                        }
                        var resourceUrlRow = '';
                        if (vars._attachments)
                        {
                            var hrefUrl = '/apps/_design/bell/bell-resource-router/index.html#open/' + vars._id + '/'+ vars.title;
                            resourceUrlRow = '<tr>' +
                                '<td colspan="2" style="text-align:center;vertical-align: text-bottom;" onclick="openResourceDetail(\'' + key + '\')"><a style="color:white;" target="_blank" href="' + hrefUrl + '">' + vars.title + '</a></td>' +
                                '</tr>';
                        }
                        else
                        {
                            resourceUrlRow = '<tr>' +
                                '<td colspan="2" style="text-align:center;vertical-align: text-bottom;"><a style="color:white;">' + vars.title + '</a></td>' +
                                '</tr>';
                        }
                        $('#ur').append('<td class="shelf-box">' +
                            '<table style="width: 100%;height: 100%">' +
                            cancelButton +
                            resourceUrlRow +
                            '</table>' +
                            '</td>');

                        //$('#ur').append('<td class="shelf-box"><a href="#resource/detail/' + key + '/' + arr[2] + '/' + arr[3] + '">' + arr[1] + '</a></td>')
                    }
                });
                $.each(App.ShelfItems, function(key, value) {

                    var arr = value.toString().split("+")
                    if (arr[0] != 'true')
                        allhidden = false
                });

            }
            if (allhidden) {
                $('.scrollable-shelf .inner .inner-table-shelf').attr('class', 'inner-table');
                $('#ur').append('<td class="shelf-box">'+App.languageDict.attributes.Empty_Shelf+'</td>')
            }
        }

    })

});

$(function() {

  App.Views.MeetupSpan = Backbone.View.extend({

    tagName: "td",

    className: 'meetup-box',

    template: $("#template-Meetup").html(),

    render: function() {

      var vars = this.model.toJSON()
      this.$el.append(_.template(this.template, vars))
    }

  })

});

$(function() {
    App.Views.MeetupSpans = Backbone.View.extend({

        tagName: "tr",

        addOne: function(model) {
            var modelView = new App.Views.MeetupSpan({
                model: model
            })
            modelView.render()
            $('#meetUpTable').append(modelView.el)
        },

        addAll: function() {

            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {

                $('#meetUpTable').append("<td class='course-box'>"+App.languageDict.attributes.No_Meetup+"</td>")
            }
        },

        render: function() {
            this.addAll()
        }

    })

});

$(function() {

	App.Views.TutorSpan = Backbone.View.extend({

		tagName: "td",

		className: 'tutor-box',

		template: $("#template-Tutor").html(),

		render: function() {
			///Temporary
			if ($.cookie('Member._id') == "821d357b8f3ba3c09836c91bebcb29d7") {
				var vars = {}
				vars.leaderEmail = this.model
				vars._id = "none"
			} else {
				var vars = this.model.toJSON()
				if (!vars.leaderEmail) {
					vars.leaderEmail = "Undefined"
				}
			}
			this.$el.append(_.template(this.template, vars))
		}

	})

});

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
			$('#tutorTable').append("<td class='course-box'>"+App.languageDict.attributes.Functionality_Under_Construction+"</td>")
		}

	})

});

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
                this.collection.skip = e.currentTarget.attributes[1].value
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
            var resourceRowView = new App.Views.ResourceRow({
                model: model,
                admin: this.isAdmin,
                isNationVisible: this.isNationVisible,
                pending: this.collection.pending
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

        addAll: function(funct) {
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
            var collection = this.collection;
            var that = this;
            App.Router.isNationLive(function(result) {
                this.isNationVisible = result;
                for(var i = 0; i < collection.models.length; i++) {
                    that.addOne(collection.models[i]);
                }
                funct();
            });
        },
        changeDirection : function (){
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
            var context = this

            if (this.displayCollec_Resources != true) {

                this.$el.html("")
                if (this.removeAlphabet == undefined) {
                    var viewText = "<tr></tr>"
                    viewText += "<tr><td colspan=8  style='cursor:default' >"
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
            this.$el.append("<tr id='actionAndTitle'><th style='width: 430px;'>"+App.languageDict.attributes.Title+"</th><th colspan='7'>"+App.languageDict.attributes.action+"</th></tr>")

            this.addAll(function() {

                var text = '<tr><td colspan=8>'

                if (context.collection.skip != 0) {
                    text += '<a class="btn btn-success" id="backButton" >'+App.languageDict.attributes.Back+'</a>&nbsp;&nbsp;'
                }

                if (context.collection.length >= 20)
                    text += '<a class="btn btn-success" id="nextButton">'+App.languageDict.attributes.Next+'</a>'

                text += '</td></tr>'
                context.$el.append(text)



                var resourceLength;
                if (context.removeAlphabet == undefined) {
                    var resourceCountUrl;
                    if(context.collection.pending == 0) {
                        resourceCountUrl = '/resources/_design/bell/_view/withoutPendingStatusCount';
                    } else if(context.collection.pending == 1) {
                        resourceCountUrl = '/resources/_design/bell/_view/withLocalStatusCount';
                    } else if(context.collection.pending == 3) {
                        resourceCountUrl = '/resources/_design/bell/_view/ResourcesWithPendingStatusAndOwnership?include_docs=true&startkey=["' + $.cookie('Member.login') + '"]&endkey=["' + $.cookie('Member.login') + '",{}]';
                    }
                    $.ajax({
                        url: resourceCountUrl,
                        type: 'GET',
                        dataType: "json",
                        success: function(json) {
                            if (json.rows[0]) {
                                resourceLength = json.rows[0].value;
                            }
                            if (context.displayCollec_Resources != true) {
                                var pageBottom = "<tr><td colspan=8><p style='width: 940px; word-wrap: break-word;'>"
                                var looplength = resourceLength / 20
                                for (var i = 0; i < looplength; i++) {
                                    if (i == 0)
                                        pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">'+App.languageDict.attributes.Home+'</a>&nbsp&nbsp'
                                    else
                                        pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
                                }
                                pageBottom += "</p></td></tr>"
                                context.$el.append(pageBottom)
                            }

                        }
                    })

                }
            });
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));

        }

    })

});

$(function() {

    App.Views.PendingResourcesTable = Backbone.View.extend({

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
                this.collection.skip = e.currentTarget.attributes[1].value
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
            var resourceRowView = new App.Views.PendingResourceRow({
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
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(lang);
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
                if (this.removeAlphabet == undefined) {
                    var viewText = "<tr></tr>"
                    viewText += "<tr><td colspan=8  style='cursor:default' >"
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
            this.$el.append("<tr id='actionAndTitle'><th style='width: 430px;'>"+App.languageDict.attributes.Title+"</th><th colspan='7'>"+App.languageDict.attributes.action+"</th></tr>")

            this.addAll()

            var text = '<tr><td colspan=8>'

            if (this.collection.skip != 0) {
                text += '<a class="btn btn-success" id="backButton" >'+App.languageDict.attributes.Back+'</a>&nbsp;&nbsp;'
            }

            if (this.collection.length >= 20)
                text += '<a class="btn btn-success" id="nextButton">'+App.languageDict.attributes.Next+'</a>'

            text += '</td></tr>'
            this.$el.append(text)



            var resourceLength;
            var context = this
            if (context.removeAlphabet == undefined) {
                var resouyrceCountUrl = '/resources/_design/bell/_view/withPendingStatusCount';
                $.ajax({
                    url: resouyrceCountUrl,
                    type: 'GET',
                    dataType: "json",
                    success: function(json) {
                        if (json.rows[0]) {
                            resourceLength = json.rows[0].value;
                        }
                        if (context.displayCollec_Resources != true) {
                            var pageBottom = "<tr><td colspan=8><p style='width: 940px; word-wrap: break-word;'>"
                            var looplength = resourceLength / 20
                            for (var i = 0; i < looplength; i++) {
                                if (i == 0)
                                    pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">'+App.languageDict.attributes.Home+'</a>&nbsp&nbsp'
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

});

$(function() {

	App.Views.ResourceRow = Backbone.View.extend({

		tagName: "tr",
		id: null,
		admn: null,
		events: {
			"click .destroy": function(event) {
				var languageDictValue;
				var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
				App.languageDict = languageDictValue;
				if (confirm(App.languageDict.attributes.Confirm_Resource)) {
					var that = this
					////Deleting from the resource
					var shelfResources = new App.Collections.shelfResource()
					shelfResources.deleteResource = 1
					shelfResources.resourceId = this.model.get("_id")
					shelfResources.fetch({
						async: false
					})
					var model;
					while (model = shelfResources.first()) {
						model.destroy();
					}
					//////Deleting resources feedback
					var resourcesFeedback = new App.Collections.ResourceFeedback()
					resourcesFeedback.resourceId = this.model.get("_id")
					resourcesFeedback.fetch({
						async: false
					})
					while (model = resourcesFeedback.first()) {
						model.destroy();
					}
					//////Deleting resources from course setp
					var courseSteps = new App.Collections.coursesteps()
					courseSteps.getAll = 1
					courseSteps.resourceId = this.model.get("_id")
					courseSteps.fetch({
						async: false
					})
					courseSteps.each(function(m) {

						if (!m.get("resourceId")) {
							m.set("resourceId", [])
						}
						var index = m.get("resourceId").indexOf(that.model.get("_id").toString())
						if (index != -1) {
							m.get("resourceId").splice(index, 1)
							m.get("resourceTitles").splice(index, 1)
							m.save()
						}

					})

					this.model.destroy()
					alert(App.languageDict.attributes.Resource_Deleted_success)
					event.preventDefault()
				}
			},
            "click #addToNation": function(event) {
                var that = this;
                App.Router.getAllResourceIdsFromNation(function(resourceIdsFromNation) {
                    if(resourceIdsFromNation.indexOf(that.model.get("_id")) >= 0) {
                        alert(App.languageDict.attributes.Resource_Already_At_Nation);
                    }
                    else
                    {
                        if (confirm(App.languageDict.attributes.delete_alert)) {
                            var arrayOfIds = [];
                            var resourceId = that.model.get("_id");
                            arrayOfIds.push(resourceId);
                            App.startActivityIndicator();
                            that.replicateCommunityResourcesWithGivenIds(arrayOfIds);
                            that.model.save(null, {
                                success: function(res) {
                                }
                            });
                        }
                    }
                });
            },
			"click .removeFromCollection": function(event) {

				var tagId = window.location.href.split('#')[1].split('/')[1]
				var resTags = this.model.get('Tag')
				var index = resTags.indexOf(tagId)
				if (index > -1)
					resTags.splice(index, 1)

				var that = this
				this.model.set('Tag', resTags)

				this.model.save(null, {
					success: function(response, revInfo) {

						that.remove()
						alert(App.languageDict.attributes.Removed_From_Collection)

					}
				})

			},

			"click .hides": function(event) {
				$(this.el).html("")
                var resourceModel = new App.Models.Resource({
                    "_id": this.model.get('_id')
                })
                resourceModel.fetch({
                    async: false
                });
                resourceModel.set({
                    "hidden": true
                })
                this.model = resourceModel;
                resourceModel.save();
				App.startActivityIndicator()
				var shelfResources = new App.Collections.shelfResource()
				shelfResources.deleteResource = 1
				shelfResources.resourceId = this.model.get("_id")
				shelfResources.fetch({
					async: false
				})
				shelfResources.each(function(item) {
					item.set({
						"hidden": true
					})
					item.save()
				});
				this.render();
                if (App.languageDict.get('directionOfLang').toLowerCase()==="right")
				{
					$('.resourcInfoFirstCol').attr('colspan','8');
					$('.resourcInfoCol').attr('colspan','3');
                    $('.table th').css('text-align','right');
                    $('.table td').css('text-align','right');
                    $('#actionAndTitle').find('th').eq(1).css('text-align','center');
				}
			},
			"click .unhide": function(event) {

				$(this.el).html("")
                var resourceModel = new App.Models.Resource({
                    "_id": this.model.get('_id')
                })
                resourceModel.fetch({
                    async: false
                });
                resourceModel.set({
                    "hidden": false
                })
                this.model = resourceModel;
                resourceModel.save();
				App.startActivityIndicator()
				var shelfResources = new App.Collections.shelfResource()
				shelfResources.deleteResource = 1
				shelfResources.resourceId = this.model.get("_id")
				shelfResources.fetch({
					async: false
				})
				shelfResources.each(function(item) {
					item.set({
						"hidden": false
					})
					item.save()
				});
				App.stopActivityIndicator()
				this.render();
                if (App.languageDict.get('directionOfLang').toLowerCase()==="right")
				{
					$('.resourcInfoFirstCol').attr('colspan','8');
					$('.resourcInfoCol').attr('colspan','3');
                    $('.table th').css('text-align','right');
                    $('.table td').css('text-align','right');
                    $('#actionAndTitle').find('th').eq(1).css('text-align','center');
				}

			},
			"click .trigger-modal": function() {
				$('#myModal').modal({

					show: true
				})
			},
			"click .resFeedBack": function(event) {
				var resourcefreq = new App.Collections.ResourcesFrequency()
				resourcefreq.memberID = $.cookie('Member._id')
				resourcefreq.fetch({
					async: false
				})

				if (resourcefreq.length == 0) {
					var freqmodel = new App.Models.ResourceFrequency()
					freqmodel.set("memberID", $.cookie('Member._id'))
					freqmodel.set("resourceID", [this.model.get("_id")])
					freqmodel.set("reviewed", [0])
					freqmodel.set("frequency", [1])
					freqmodel.save()
				} else {
					var freqmodel = resourcefreq.first()
					var index = freqmodel.get("resourceID").indexOf(this.model.get("_id").toString())
					if (index != -1) {
						var freq = freqmodel.get('frequency')
						freq[index] = freq[index] + 1
						freqmodel.save()
					} else {
						freqmodel.get("resourceID").push(this.model.get("_id"))
						freqmodel.get("frequency").push(1)
						if (!freqmodel.get("reviewed")) {
							freqmodel.set("reviewed", [0])
						} else {
							freqmodel.get("reviewed").push(0)
						}
						freqmodel.save()
					}
				}

				$('ul.nav').html($('#template-nav-logged-in').html()).hide()
				//                 var member = new App.Models.Member({
				//                 	_id: $.cookie('Member._id')
				//                 })
				//                 member.fetch({
				//                     async: false
				//                 })
				//                 var pending=[]
				//                pending= member.get("pendingReviews")
				//                pending.push(this.model.get("_id"))
				//     		   	member.set("pendingReviews",pending)
				//     		   	member.save()
				Backbone.history.navigate('resource/feedback/add/' + this.model.get("_id") + '/' + this.model.get("title"), {
					trigger: true
				})
			}
		},

		vars: {},

		template: _.template($("#template-ResourceRow").html()),

		initialize: function(e) {
			this.model.on('destroy', this.remove, this);
		},
        replicateCommunityResourcesWithGivenIds: function(arrayOfIds) {
            $.couch.db("tempresources").create({
                success: function (data) {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": 'resources',
                            "target": 'tempresources',
                            'doc_ids': arrayOfIds
                        }),
                        async: false,
                        success: function (response) {
                            //Resource Rating work here.
                            $.ajax({
                                url: '/tempresources/_all_docs?include_docs=true',
                                type:  'GET',
                                dataType: 'json',
                                success: function (resResult) {
                                    var result = resResult.rows;
                                    var tempResult = [];
                                    for (var i = 0; i<result.length; i++){
                                        result[i].doc.sum = 0;
                                        result[i].doc.timesRated = 0;
                                        result[i].doc.status = "pending";
                                        tempResult.push(result[i].doc);
                                    }
                                    $.couch.db('tempresources').bulkSave({
                                        "docs": tempResult
                                    }, {
                                        success: function(data) {

                                            $.ajax({
                                                headers: {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json; charset=utf-8'
                                                },
                                                type: 'POST',
                                                url: '/_replicate',
                                                dataType: 'json',
                                                data: JSON.stringify({
                                                    "source": "tempresources",
                                                    "target": 'http://' + App.configuration.get('nationUrl') + '/resources',
                                                    'doc_ids': arrayOfIds
                                                }),
                                                async: false,
                                                success: function (response) {
                                                    alert(App.languageDict.attributes.resource_replication_success);
                                                    App.stopActivityIndicator();
                                                    location.reload();
                                                    $.couch.db("tempresources").drop({
                                                        success: function(data) {
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                        }
                                                    });
                                                },
                                                error: function(status) {
                                                    alert(App.languageDict.attributes.resource_replication_error);
                                                    App.stopActivityIndicator();
                                                    $.couch.db("tempresources").drop({
                                                        success: function(data) {
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                        }
                                                    });
                                                }
                                            });
                                        },
                                        error: function(status) {
                                            alert(App.languageDict.attributes.resource_replication_error);
                                            App.stopActivityIndicator();
                                            $.couch.db("tempresources").drop({
                                                success: function(data) {
                                                },
                                                error: function(status) {
                                                    console.log(status);
                                                }
                                            });
                                        }
                                    });
                                },
                                error: function() {
                                    alert(App.languageDict.attributes.resource_replication_error);
                                    App.stopActivityIndicator();
                                    $.couch.db("tempresources").drop({
                                        success: function(data) {
                                        },
                                        error: function(status) {
                                            console.log(status);
                                        }
                                    });
                                },
                                async: false
                            });
                        },
                        error: function(jqXHR, status, errorThrown){
                            alert(App.languageDict.attributes.resource_replication_error);
                            App.stopActivityIndicator();
                            $.couch.db("tempresources").drop({
                                success: function(data) {
                                },
                                error: function(status) {
                                    console.log(status);
                                }
                            });
                        }
                    });
                }
            });
        },
		render: function() {
            var vars = this.model.toJSON()
			var Details = ""

			if (vars.author != undefined && vars.author != "") {
				Details = Details + "<b>"+App.languageDict.attributes.author+"</b>&nbsp;" + vars.author + ' , '
			}

			if (vars.Year != undefined && vars.Year != "") {
				Details = Details + "<b>"+App.languageDict.attributes.year+" </b>&nbsp;" + vars.Year + ' , '
			}

			if (vars.openWith != undefined) {
				Details = Details + "<b>"+App.languageDict.attributes.media+" </b>&nbsp;"
				Details = Details + vars.openWith + ' , '

			}

			if (vars.language != undefined) {
				if (vars.language.length > 0) {
					Details = Details + '<b>'+App.languageDict.attributes.language+'</b>&nbsp;' + vars.language + " , "
				}
			}

			if (vars.subject != undefined) {
				Details = Details + "<b>"+App.languageDict.attributes.subject+" </b>&nbsp;"
				if ($.isArray(vars.subject)) {
					for (var i = 0; i < vars.subject.length; i++) {
						Details = Details + vars.subject[i] + ' / '
					}

				} else {
					Details = Details + vars.subject + ' / '

				}
				Details = Details.substring(0, Details.length - 3)
				Details = Details + ' , '
			}

			if (vars.Level != undefined) {
				Details = Details + "<b>"+App.languageDict.attributes.level+" </b>&nbsp;"
				if ($.isArray(vars.Level)) {
					for (var i = 0; i < vars.Level.length; i++) {
						Details = Details + vars.Level[i] + ' / '
					}

				} else {
					Details = Details + vars.Level + ' / '

				}

				Details = Details.substring(0, Details.length - 3)
				Details = Details + ' , '

			}

			if (vars.Publisher != undefined && vars.Publisher != "") {
				Details = Details + "<b>"+App.languageDict.attributes.publisher_attribution+"</b>&nbsp;" + vars.Publisher + ' , '
			}

			if (vars.linkToLicense != undefined && vars.linkToLicense != "") {
				Details = Details + "<b>"+App.languageDict.attributes.link_to_license+" </b>&nbsp;" + vars.linkToLicense + ' , '
			}

			if (vars.resourceFor != undefined && vars.resourceFor != "") {
				Details = Details + "<b>"+App.languageDict.attributes.resource_for+"</b>&nbsp;" + vars.resourceFor + ' , '
			}
            ////////////////////////////////////////////////Code for Issue No 60 Adding a drop-down////////////////////////////////
            if (vars.resourceType != undefined && vars.resourceType != "") {
                Details = Details + "<b>"+App.languageDict.attributes.resource_type+"</b>&nbsp;" + vars.resourceType + ' , '
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

			if (vars.Tag != undefined) {
				if ($.isArray(vars.Tag)) {
					if (vars.Tag.length > 0)
						Details = Details + "<b>"+App.languageDict.attributes.Collection+"</b>&nbsp;"

					for (var i = 0; i < vars.Tag.length; i++) {
						if (this.collections.get(vars.Tag[i]) != undefined)
							Details = Details + this.collections.get(vars.Tag[i]).toJSON().CollectionName + " / "
					}
				} else {
					if (vars.Tag != 'Add New')
						Details = Details + "<b>"+App.languageDict.attributes.Collection+"</b>&nbsp;" + vars.Tag + ' / '
				}
			}
			Details = Details.substring(0, Details.length - 3)
			Details = Details + ' , '

			Details = Details.substring(0, Details.length - 3)

			vars.Details = Details;
			vars.open=App.languageDict.attributes.Open;
			vars.viewDetails=App.languageDict.attributes.View_Details;
			vars.addToMyLibrary=App.languageDict.attributes.Add_to_my_library;
			vars.feedback=App.languageDict.attributes.Feedback
			vars.deleteLabel=App.languageDict.attributes.DeleteLabel;
			vars.RemoveLabel=App.languageDict.attributes.Remove;
			vars.unhide=App.languageDict.attributes.UnHide;
            vars.addToNation=App.languageDict.attributes.AddToNation;
            vars.pending = this.options.pending;
            var that = this;
            vars.type = App.configuration.attributes.type;
            vars.hide=App.languageDict.attributes.Hide;
            if (vars.hidden == undefined) {
                vars.hidden = false
            }

            if (that.model.get("sum") != 0) {
                vars.totalRatings = that.model.get("timesRated")
                vars.averageRating = (parseInt(that.model.get("sum")) / parseInt(vars.totalRatings))
            } else {
                vars.averageRating = "Sum not found"
                vars.totalRatings = 0
            }

            if (that.isManager > -1) {
                vars.Manager = 1
            } else {
                vars.Manager = 0
            }
            if (that.displayCollec_Resources == true) {
                vars.removeFormCollection = 1
            } else {
                vars.removeFormCollection = 0
            }
            that.$el.append(that.template(vars))

		}


	})

});

$(function() {

    App.Views.PendingResourceRow = Backbone.View.extend({

        tagName: "tr",
        id: null,
        admn: null,
        events: {
            "click #acceptButton": function(event) {
                this.model.set("status", "accepted");
                this.model.save();
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                App.languageDict = languageDictValue;
                alert(App.languageDict.attributes.Resource_Success_Added);
                location.reload();

            },
            "click .destroy": function(event) {
                var languageDictValue;
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                App.languageDict = languageDictValue;
                if (confirm(App.languageDict.attributes.Confirm_Decline)) {
                    var that = this

                    this.model.destroy()
                    alert(App.languageDict.attributes.Resource_Deleted_success)
                    event.preventDefault()
                }
            },
            "click .trigger-modal": function() {
                $('#myModal').modal({

                    show: true
                })
            }
        },

        vars: {},

        template: _.template($("#template-PendingResourceRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this);
        },
        render: function() {
            var vars = this.model.toJSON()
            var Details = ""

            if (vars.author != undefined && vars.author != "") {
                Details = Details + "<b>"+App.languageDict.attributes.author+"</b>&nbsp;" + vars.author + ' , '
            }

            if (vars.Year != undefined && vars.Year != "") {
                Details = Details + "<b>"+App.languageDict.attributes.year+" </b>&nbsp;" + vars.Year + ' , '
            }

            if (vars.openWith != undefined) {
                Details = Details + "<b>"+App.languageDict.attributes.media+" </b>&nbsp;"
                Details = Details + vars.openWith + ' , '

            }

            if (vars.language != undefined) {
                if (vars.language.length > 0) {
                    Details = Details + '<b>'+App.languageDict.attributes.language+'</b>&nbsp;' + vars.language + " , "
                }
            }

            if (vars.subject != undefined) {
                Details = Details + "<b>"+App.languageDict.attributes.subject+" </b>&nbsp;"
                if ($.isArray(vars.subject)) {
                    for (var i = 0; i < vars.subject.length; i++) {
                        Details = Details + vars.subject[i] + ' / '
                    }

                } else {
                    Details = Details + vars.subject + ' / '

                }
                Details = Details.substring(0, Details.length - 3)
                Details = Details + ' , '
            }

            if (vars.Level != undefined) {
                Details = Details + "<b>"+App.languageDict.attributes.level+" </b>&nbsp;"
                if ($.isArray(vars.Level)) {
                    for (var i = 0; i < vars.Level.length; i++) {
                        Details = Details + vars.Level[i] + ' / '
                    }

                } else {
                    Details = Details + vars.Level + ' / '

                }

                Details = Details.substring(0, Details.length - 3)
                Details = Details + ' , '

            }

            if (vars.Publisher != undefined && vars.Publisher != "") {
                Details = Details + "<b>"+App.languageDict.attributes.publisher_attribution+"</b>&nbsp;" + vars.Publisher + ' , '
            }

            if (vars.linkToLicense != undefined && vars.linkToLicense != "") {
                Details = Details + "<b>"+App.languageDict.attributes.link_to_license+" </b>&nbsp;" + vars.linkToLicense + ' , '
            }

            if (vars.resourceFor != undefined && vars.resourceFor != "") {
                Details = Details + "<b>"+App.languageDict.attributes.resource_for+"</b>&nbsp;" + vars.resourceFor + ' , '
            }
            ////////////////////////////////////////////////Code for Issue No 60 Adding a drop-down////////////////////////////////
            if (vars.resourceType != undefined && vars.resourceType != "") {
                Details = Details + "<b>"+App.languageDict.attributes.resource_type+"</b>&nbsp;" + vars.resourceType + ' , '
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (vars.Tag != undefined) {
                if ($.isArray(vars.Tag)) {
                    if (vars.Tag.length > 0)
                        Details = Details + "<b>"+App.languageDict.attributes.Collection+"</b>&nbsp;"

                    for (var i = 0; i < vars.Tag.length; i++) {
                        if (this.collections.get(vars.Tag[i]) != undefined)
                            Details = Details + this.collections.get(vars.Tag[i]).toJSON().CollectionName + " / "
                    }
                } else {
                    if (vars.Tag != 'Add New')
                        Details = Details + "<b>"+App.languageDict.attributes.Collection+"</b>&nbsp;" + vars.Tag + ' / '
                }
            }
            Details = Details.substring(0, Details.length - 3)
            Details = Details + ' , '

            Details = Details.substring(0, Details.length - 3)

            vars.Details = Details;
            vars.open=App.languageDict.attributes.Open;
            vars.viewDetails=App.languageDict.attributes.View_Details;
            vars.accept=App.languageDict.attributes.Accept;
            vars.decline=App.languageDict.attributes.Decline;
            var that = this;

            if (that.model.get("sum") != 0) {
                vars.totalRatings = that.model.get("timesRated")
                vars.averageRating = (parseInt(that.model.get("sum")) / parseInt(vars.totalRatings))
            } else {
                vars.averageRating = "Sum not found"
                vars.totalRatings = 0
            }

            that.$el.append(that.template(vars))
        }


    })

});

$(function() {

    App.Views.ResourcesDetail = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "btable btable-striped resourceDetail",
        sid: null,
        rid: null,
        id: 'requestsTable',
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyShelfItem": function(e) {

                var vars = this.model.toJSON()
                var rId = vars._id
                var mId = $.cookie('Member._id')

                var memberShelfResource = new App.Collections.shelfResource()
                memberShelfResource.resourceId = rId
                memberShelfResource.memberId = mId
                memberShelfResource.fetch({
                    async: false
                })
                memberShelfResource.each(
                    function(e) {
                        e.destroy()
                    })
                alert(App.languageDict.attributes.Resource_RemovedFrom_Shelf_Success)
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })

            },
            "click .shelfResFeedBack": function(event) {
                var resourcefreq = new App.Collections.ResourcesFrequency()
                resourcefreq.memberID = $.cookie('Member._id')
                resourcefreq.fetch({
                    async: false
                })

                if (resourcefreq.length == 0) {
                    var freqmodel = new App.Models.ResourceFrequency()
                    freqmodel.set("memberID", $.cookie('Member._id'))
                    freqmodel.set("resourceID", [this.model.get("_id")])
                    freqmodel.set("reviewed", [0])
                    freqmodel.set("frequency", [1])
                    freqmodel.save()
                } else {
                    var freqmodel = resourcefreq.first()
                    var index = freqmodel.get("resourceID").indexOf(this.model.get("_id").toString())
                    if (index != -1) {
                        var freq = freqmodel.get('frequency')
                        freq[index] = freq[index] + 1
                        freqmodel.save()
                    } else {
                        freqmodel.get("resourceID").push(this.model.get("_id"))
                        freqmodel.get("frequency").push(1)
                        if (!freqmodel.get("reviewed")) {
                            freqmodel.set("reviewed", [0])
                        } else {
                            freqmodel.get("reviewed").push(0)
                        }
                        freqmodel.save()
                    }
                }

                $('ul.nav').html($('#template-nav-logged-in').html()).hide()
                //                 var member = new App.Models.Member({
                //                 	_id: $.cookie('Member._id')
                //                 })
                //                 member.fetch({
                //                     async: false
                //                 })
                //                 var pending=[]
                //                pending= member.get("pendingReviews")
                //                pending.push(this.model.get("_id"))
                //     		   	member.set("pendingReviews",pending)
                //     		   	member.save()
                Backbone.history.navigate('resource/feedback/add/' + this.model.get("_id") + '/' + this.model.get("title"), {
                    trigger: true
                })
            }

        },
        initialize: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            this.$el.append('<th colspan="2"><h6>'+App.languageDict.attributes.Resource_Detail+'</h6></th>')
        },
        SetShelfId: function(s, r) {
            this.sid = s
            this.rid = r
        },
        render: function() {
            var vars = this.model.toJSON();
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            this.$el.append("<tr><td>"+languageDictValue.attributes.Title+"</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>"+languageDictValue.attributes.Subject_single+"</td><td>" + vars.subject + "</td></tr>")
            this.$el.append("<tr><td>"+languageDictValue.attributes.Tag+"</td><td>" + vars.Tag + "</td></tr>")
            this.$el.append("<tr><td>"+languageDictValue.attributes.level_Single+"</td><td>" + vars.Level + "</td></tr>")
            if (vars.author) {
                this.$el.append("<tr><td>"+languageDictValue.attributes.author+"</td><td>" + vars.author + "</td></tr>")
            } else {
                this.$el.append("<tr><td>"+languageDictValue.attributes.author+"</td><td>"+languageDictValue.attributes.Undefined_Author+"</td></tr>")
            }
            /**********************************************************************/
            //Issue No: 54 (Update buttons on the My Library page on Dashboard)
            //Date: 18th Sept, 2015
            /**********************************************************************/
            //if the model has the Attachments
           // if (vars._attachments) {

          /*      this.$el.append("<tr><td>Attachment</td><td><a class='btn open'  target='_blank' style='background-color:#1ABC9C;position: absolute;display: inline-block; line-height: 25px;margin-top: 35px;margin-left:-620px;width: 65px;height:26px;font-size: large' href='/apps/_design/bell/bell-resource-router/index.html#open/" + vars._id + "'>View</a></td></tr>")

            } else {
                this.$el.append("<tr><td>Attachment</td><td>No Attachment</td></tr>")
            }
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyShelfItem">Remove</button></td></tr>') */
            if (vars._attachments) {
                this.$el.append("<tr><td>"+languageDictValue.attributes.Attachment+"</td><td></td></tr>")
                this.$el.append("<br><a class='btn open shelfResFeedBack' target='_blank' style='background-color:#1ABC9C;  width: 65px;height:26px;font-size: large' href='/apps/_design/bell/bell-resource-router/index.html#open/" + vars._id + "/"+ vars.title +"'>"+languageDictValue.attributes.View+"</a><button class='btn btn-danger marginsOnMeetUp' id='DestroyShelfItem'>"+languageDictValue.attributes.Remove+"</button></td></tr>")

            } else {
                this.$el.append("<tr><td>"+languageDictValue.attributes.Attachment+"</td><td>"+languageDictValue.attributes.No_Attachment+"</td></tr>")
                this.$el.append('<br><a class="btn open shelfResFeedBack" style="visibility: hidden">'+languageDictValue.attributes.View+'</a><button class="btn btn-danger marginsOnMeetUp" id="DestroyShelfItem">'+languageDictValue.attributes.Remove+'</button></td></tr>')
            }



        }

    })

});

$(function() {
    //This form/view is binded with Resource model
    App.Views.ResourceForm = Backbone.View.extend({

        className: "form",
        id: 'resourceform',
        hide: false,
        events: {
            /**********************************************************************/
            //Issue#43: Add A Resource: Change Order of tabindex
            /**********************************************************************/
            'keydown input[name="title"]':"getFocusForTitle",
            'keydown input[name="author"]':"getFocusForAuthor",
            'keydown input[name="Year"]':"getFocusForYear",
            'keydown select[name="language"]':"getFocusForLanguage",
            'keydown input[name="Publisher"]':"getFocusForPublisher",
            "keydown #_attachments":"getFocusForBrowse",
            "keydown  .save":"getFocusForSave",

            "click .save": "saveForm",
            "click #cancel": function() {
                window.history.back()
            },
            "click #add_newCoellection": function() {
                App.Router.AddNewSelect('Add New')
            },
            "click #saveUpdatedWelcomeVideoForm": "saveUpdatedWelcomeVideoForm"
        },
        getFocusForTitle : function(e){

            if(e.keyCode==9) //tab is pressed
            {
                e.preventDefault();

                $.trim($('[name="title"]').val());

                $('[name="author"]').focus();
            }
        },

        getFocusForAuthor : function(e){


            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $.trim($('[name="author"]').val());

                $('[name="Year"]').focus();
            }
        },
        /*******************************************************************/
        /*Issue No: 43 remove "Add New" button on Add New Resource page from the tabindex and instead have
         the "Save" button highlighted after the "Browse" button is highlighted. (route:resource/add)
         Date: 21 Sept, 2015*/
        /**********************************************************************/
        getFocusForBrowse : function(e){
            if(e.keyCode==9) //tab is pressed
            {
                // alert("Tab is pressed on uplaoad attachment button");
                e.preventDefault();
                var $focused = $(':focus');
                //	$('[name="save"]').focus();
                $(".save").attr("tabindex",0);
                //	$(".save").prop('autofocus', 'true');
                $('.save').addClass("myTabIndexClass");
                $('.myTabIndexClass').focus();
                $focused = $(':focus');
                //$focused.click()

            }
        },
        getFocusForSave : function(e){
            if(e.keyCode==9) //tab is pressed
            {
                //alert("Tab is pressed on Save button");
                e.preventDefault();
                var $focused = $(':focus');
                $("#cancel").attr("tabindex",0);
                $('#cancel').focus();
                $focused = $(':focus');
                //$focused.click()
                e.preventDefault();
            }
        },
        /**********************************************************************/
        getFocusForYear : function(e){


            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $.trim($('[name="Year"]').val());

                $('[name="language"]').focus();
            }
        },
        getFocusForLanguage : function(e){

            if(e.keyCode==9) //tab is pressed
            {
                //
                e.preventDefault();

                $('[name="Publisher"]').focus();
            }
        },
        getFocusForPublisher : function(e){

            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $('[name="linkToLicense"]').focus();
            }
        },
        getFocusForLinkToLicense : function (e)
        {

            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $.trim($('[name="Publisher"]').val());

                $('[name="resourceType"]').focus();
            }
        },
        getFocusForResourceType : function (e)
        {

            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $('[name="subject"]').focus();
            }
        },
        template: _.template($('#template-form-file').html()),

        render: function() {
            var vars = {}
            var clanguage = '';
            if (_.has(this.model, 'id')) {

                vars.header = App.languageDict.attributes.Details+' ' + '"'+' '+ this.model.get('title') +' '+ '"';
                var tempAttachments = this.model.get('_attachments');
                var fields = _.map(
                    _.pairs(tempAttachments),
                    function(pair) {
                        return {
                            key: pair[0],
                            value: pair[1]
                        };
                    }
                );
                vars.resourceAttachments = fields;
                vars.resourceTitle = this.model.get('title');
                vars.resourceUrl = this.model.get('url');
                vars.languageDict=App.languageDict;
                vars.cLang='addResource'
                clanguage = this.model.get('language');

            } else {

                vars.header = App.languageDict.attributes.New+' '+App.languageDict.attributes.Resources;
                vars.resourceAttachments = App.languageDict.attributes.No_File_Selected;
                vars.resourceUrl = "";
                vars.languageDict=App.languageDict;
                vars.cLang='addResource'
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                })
                var config = new configurations()
                config.fetch({
                    async: false
                })
                var con = config.first();
                var currentConfig = config.first().toJSON().rows[0].doc;
                clanguage= App.languageDict.get('nameInNativeLang');
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.form.render()
            this.form.fields['uploadDate'].$el.hide()
            if (this.edit == false) {
                this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
            }
            this.form.fields['addedBy'].$el.attr("disabled", true)
            this.form.fields['averageRating'].$el.hide()
            var that = this
            if (_.has(this.model, 'id')) {
                if (this.model.get("Level") == "All") {
                    that.hide = true
                }
            }
            // @todo Why won't this work?
            vars.form = "" //$(this.form.el).html()
            this.$el.html(this.template(vars))
            // @todo this is hackey, should be the following line or assigned to vars.form
            $('.fields').html(this.form.el)
            var availableLanguages=getAvailableLanguages();
            for(var key in availableLanguages){
                this.$el.find('.field-language .bbf-editor select').append($('<option>', {
                    value: key,
                    text:availableLanguages[key]
                }));
            }
            $('.field-language').find('.bbf-editor').find('select').val(clanguage);

            this.$el.append('<button class="btn btn-success" id="add_newCoellection" >'+App.languageDict.attributes.Add_New+'</button>')
            $('#progressImage').hide();
            //$this.$el.children('.fields').html(this.form.el) // also not working
            $('[name="title"]').focus();

            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
          //  applyStylingSheet();
            return this
        },
        saveUpdatedWelcomeVideoForm: function() {
            // mark this resource with welcome-video flag
            if (this.model.get("isWelcomeVideo") === undefined) {
                this.model.set("isWelcomeVideo", true);
            }
            this.form.commit();
            this.model.set("Level", null);
            this.model.set("subject", null);
            this.model.set("addedBy", $.cookie('Member.login'));
            var formContext = this;
            // id a new video file has been linked/uploaded, change the "addedBy" field to have the name of the current user
            // if no new file has been linked/uploaded, don't take any action
            var uploadedFileName = $('input[type="file"]').val();
            this.model.save(null, {
                success: function(res) {
                    if (uploadedFileName) {
                        formContext.model.unset('_attachments');
                        App.startActivityIndicator();
                        // set the handler for successful response on processing the video update form
                        formContext.model.on('savedAttachment', function() {
                            App.stopActivityIndicator();
                            this.trigger('processed');
                        }, formContext.model);
                        formContext.model.saveAttachment("#fileAttachment", "#_attachments", "#fileAttachment .rev");
                        alert($.cookie('Member.login'));
                        formContext.form.fields['addedBy'].setValue($.cookie('Member.login'));
                    } else {
                        return;
                    }
                }
            });
        },
        renderAddOrUploadWelcomeVideoForm: function() {
            var formHeader = $('<h3 class="form-heading-style"> '+App.languageDict.get('edit_welcomeVideo')+' </h3><br><br><br><br>');
            this.$el.append(formHeader);
            this.form = new Backbone.Form({
                model: this.model
            });
            this.$el.append(this.form.render().el);
            // hide the 'decision' and 'submitted by' subschemas from rendering when form has not been submitted
            for (var field in this.form.fields) {
                this.form.fields[field].$el.hide();
            }
            this.form.fields['addedBy'].$el.show();
            this.form.fields['resourceType'].$el.show();
            this.form.fields['addedBy'].editor.el.disabled = true;
            this.form.fields['uploadDate'].$el.show();
            this.form.fields['openWith'].$el.show();
            this.form.fields['resourceFor'].$el.show();
            // get attachments of welcome video doc
            var tempAttachments = this.model.get('_attachments');
            var fields = _.map(
                _.pairs(tempAttachments),
                function(pair) {
                    return {
                        key: pair[0],
                        value: pair[1]
                    };
                }
            );
            this.$el.append('<label class="form-label-style">'+ App.languageDict.get('uploaded_file')+'</label>');
            this.$el.append('<br>');
            for (var field in fields) { // field is index and fields is the array being traversed
                var label = $("<label class='form-label-style'>").text(fields[field].key); // fields[field].value has info like {content_type: "video/mp4", length: 16501239, etc}
                this.$el.append(label);
            }
            this.$el.append('<br><br>');
            // add a label followed by input box/button for allowing uploading of new welcome video, followed by label anming the
            // name of the video currently being used as welcome video
            this.$el.append('<form method="post" id="fileAttachment"></form>');
            this.$el.find("#fileAttachment").append('<label for="_attachments" class="form-label-style">'+App.languageDict.get('upload_welcomeVideo')+'</label>');
            this.$el.find("#fileAttachment").append('<input type="file" name="_attachments" id="_attachments" style="line-height: 28px;" multiple="multiple" label=" :" />');
            this.$el.find("#fileAttachment").append('<input class="rev" type="hidden" name="_rev">');
            this.$el.append('<button class="addNation-btn btn btn-success" id="saveUpdatedWelcomeVideoForm">'+App.languageDict.get('Submit')+'</button>');
            this.$el.append('<a class="btn btn-danger" id="cancel">'+App.languageDict.get('Cancel')+'</a>');
        },
        saveForm: function() {


            // @todo validate
            //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
            // Put the form's input into the model in memory
            var previousTitle = this.model.get("title")
            previousTitle = $.trim(previousTitle)
            var isEdit = this.model.get("_id")
            var formContext = this
            this.form.commit()
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            });

            if (this.model.get('openWith') == 'PDF.js') {
                this.model.set('need_optimization', true)
            }
            // Send the updated model to the server

            var title = this.model.get("title");
            var author = this.model.get("author");
            var year = this.model.get("Year");
            var publisher = this.model.get("Publisher");
            var linkToLicense = this.model.get("linkToLicense");
            var openUrl = this.model.get("openUrl");
            this.model.set("title", $.trim(title));
            this.model.set("author", $.trim(author));
            this.model.set("Year", $.trim(year));
            this.model.set("Publisher", $.trim(publisher));
            this.model.set("linkToLicense", $.trim(linkToLicense));
            this.model.set("openUrl", $.trim(openUrl));
            var newTitle = this.model.get("title")
            if (this.model.get("title").length == 0) {
                alert(App.languageDict.attributes.Missing_Resource_Title)
            } else if (this.model.get("subject") == null) {
                alert(App.languageDict.attributes.Resource_Subject_Missing)
            } else if (this.model.get("Level") == null) {
                alert(App.languageDict.attributes.Resource_Level_Missing)
            } else {
                var config = new configurations();
                config.fetch({
                    async: false
                });
                var jsonConfig = config.first().toJSON().rows[0].doc;
                if (isEdit) {
                    var addtoDb = true
                    if (previousTitle != newTitle) {
                        if (this.DuplicateTitle()) {
                            addtoDb = false
                        }
                    }
                    if (addtoDb) {
                        if(!this.model.get("status")) {
                            if(jsonConfig.type == "community") {
                                this.model.set("status", "local");
                            }
                            if(jsonConfig.type == "nation") {
                                this.model.set("status", "accepted");
                            }
                        }
                        this.model.save(null, {
                            success: function(res) {

                                if ($('input[type="file"]').val()) {
                                    formContext.model.unset('_attachments')
                                    App.startActivityIndicator()
                                    formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")

                                } else {
                                    window.history.back()
                                }
                            }
                        })
                    }
                } else {
                    if (!this.DuplicateTitle()) {
                        this.model.set("sum", 0)
                        this.model.set("timesRated", 0)
                        if(jsonConfig.type == "community") {
                            this.model.set("status", "local");
                        }
                        else if(jsonConfig.type == "nation") {
                            var roles = App.Router.getRoles();
                            if(roles.indexOf("Manager") > -1 || roles.indexOf("SuperManager") > -1) {
                                this.model.set("status", "accepted");
                            }
                            else {
                                this.model.set("status", "pending");
                            }
                        }
                        this.model.save(null, {
                            success: function(res) {
                                if ($('input[type="file"]').val()) {
                                    App.startActivityIndicator()
                                    formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")

                                } else {
                                    window.history.back()
                                }
                            }
                        })
                    }
                }
            }
            this.model.on('savedAttachment', function() {
                this.trigger('processed')
            }, formContext.model)



        },
        DuplicateTitle: function() {
            var checkTitle = new App.Collections.Resources()
            checkTitle.title = this.model.get("title")
            checkTitle.fetch({
                async: false
            })
            checkTitle = checkTitle.first()
            if (checkTitle != undefined)
                if (checkTitle.toJSON().title != undefined) {
                    alert(App.languageDict.attributes.Duplicate_Title)
                    return true
                }
            return false
        },
        statusLoading: function() {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

});

$(function() {

    App.Views.Search = Backbone.View.extend({

        events: {
            "keypress #searchText": "SearchByEnter",
            "click #searchR": "searchResult",
            "click #addRestoPub": "addResourceToPublication",
            "click #next_button": function(e) {
                App.startActivityIndicator()
                this.groupresult.skip = this.groupresult.skip + 20;
                this.groupresult.fetch({
                    async: false
                })
                App.stopActivityIndicator()
                var obj = this
                if (this.groupresult.length > 0) {
                    var SearchSpans = new App.Views.SearchSpans({
                        collection: this.groupresult
                    })
                    SearchSpans.resourceids = obj.resourceids
                    SearchSpans.render()
                    $('#srch').html(SearchSpans.el)
                    $("#previous_button").show()

                    if (this.groupresult.length < 20) {
                        $("#next_button").hide();
                    }
                } else {
                    this.groupresult.skip = this.groupresult.skip - 20;
                    $("#next_button").hide();
                }
            },
            "click #previous_button": function(e) {
                App.startActivityIndicator()
                this.groupresult.skip = this.groupresult.skip - 20;
                this.groupresult.fetch({
                    async: false
                })
                App.stopActivityIndicator()
                var obj = this
                if (this.groupresult.length > 0) {
                    var SearchSpans = new App.Views.SearchSpans({
                        collection: this.groupresult
                    })
                    SearchSpans.resourceids = obj.resourceids
                    SearchSpans.render()
                    $('#srch').html(SearchSpans.el)
                    $("#next_button").show()
                } else {
                    $("#previous_button").hide();
                }
                if (this.groupresult.skip <= 0) {
                    $("#previous_button").hide();
                }
            }
        },
        template: $('#template-Search').html(),

        vars: {},
        groupresult: null,
        resultArray: null,

        initialize: function() {
            this.groupresult = new App.Collections.Resources()
            this.resultArray = []
            enablenext = 0;
        },
        SearchByEnter: function(e) {
            if (e.keyCode == 13) {
                if(this.vars.addResource == true) {
                    this.searchResult();
                }
                else {
                    ResourceSearch();
                }
            }
        },
        render: function() {

            var obj = this
            var collections = App.collectionslist
            this.vars.tags = collections.toJSON();
            this.vars.languageDict=App.languageDict;
            this.vars.levelArray=App.languageDict.get('LevelArray');
            this.vars.mediaArray=App.languageDict.get('mediaList');
            this.vars.languages=getAvailableLanguages();
            this.vars.addResource = this.addResource
            if (typeof this.Publications != 'undefined') {

                this.vars.Publications = this.Publications
            } else {
                this.vars.Publications = false
            }
            this.$el.html(_.template(this.template, this.vars))
            if (searchText != "" || (this.collectionFilter) || (this.subjectFilter) || (this.levelFilter) || (this.languageFilter) || (this.mediumFilter) || (this.ratingFilter && this.ratingFilter.length > 0)) {
                App.startActivityIndicator()
                this.getSearchedRecords();

            }

        },
        getSearchedRecords: function() {

            var mapFilter = {};
            var filters = new Array()
            if (this.collectionFilter && searchText.replace(" ", "") == '' && !(this.subjectFilter)) {
                for (var i = 0; i < this.collectionFilter.length; i++) {
                    filters.push(this.collectionFilter[i])
                }
            } else {
                if (this.collectionFilter && (searchText.replace(" ", "") != '' || this.subjectFilter)) {
                    mapFilter["Tag"] = this.collectionFilter;
                }
            }
            if (this.subjectFilter && searchText.replace(" ", "") == '') {
                for (var i = 0; i < this.subjectFilter.length; i++) {
                    filters.push(this.subjectFilter[i].toLowerCase())
                }
            } else {
                if (this.subjectFilter && searchText.replace(" ", "") != '') {
                    mapFilter["subject"] = this.subjectFilter;
                }
            }
            if (this.levelFilter && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.levelFilter.length; i++) {
                    filters.push(this.levelFilter[i].toLowerCase())
                }
            } else {
                if (this.levelFilter && (this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["Level"] = this.levelFilter;
                }
            }
            if (this.mediumFilter && !(this.levelFilter) && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.mediumFilter.length; i++) {
                    filters.push(this.mediumFilter[i].toLowerCase())
                }
            } else {
                if (this.mediumFilter && (this.levelFilter || this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["Medium"] = this.mediumFilter;
                }
            }
            if (this.languageFilter && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.languageFilter.length; i++) {
                    filters.push(this.languageFilter[i])
                }
            } else {
                if (this.languageFilter && (searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["language"] = this.languageFilter;
                }
            }
            if(this.ratingFilter!=undefined){
                if (this.ratingFilter.length > 0 && !(this.mediumFilter) && !(this.levelFilter) && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                    for (var i = 0; i < this.ratingFilter.length; i++) {
                        filters.push(parseInt(this.ratingFilter[i]))
                    }
                } else {
                    if (this.ratingFilter.length > 0 && (this.mediumFilter || this.levelFilter || this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                        mapFilter["timesRated"] = this.ratingFilter;
                    }
                }
            }

            var prefix, prex, searchTxt, searchText_Coll_Id;
            var searchTextArray = [];
            if (searchText != '') {
                prefix = searchText.replace(/[!(.,'";):&]+/gi, "").toLowerCase()
                filters.push(prefix);
                /* Get Collection Id from collection list database by passing the name of collection*/
                $.ajax({
                    url: '/collectionlist/_design/bell/_view/collectionByName?_include_docs=true&key="' + prefix + '"',
                    type: 'GET',
                    dataType: 'json',
                    success: function(collResult) {
                        if (collResult.rows.length > 0) {
                            searchText_Coll_Id = collResult.rows[0].id;
                            filters.push(searchText_Coll_Id);
                        }
                    },
                    error: function() {
                        alert(App.languageDict.attributes.Fetch_Collections_Error);

                    },
                    async: false
                });
                /****************************************************************************************/
                /****************************************************************************************/
                searchTxt = searchText.replace(/[" "-]+/gi, "").toLowerCase()
                if (searchTxt != null) {
                    filters.push(searchTxt)
                }

                //prefix = searchText.replace(/[!(.,;):&]+/gi, "").toLowerCase().split(" ")
                prefix = searchText.replace(/[!(.,;'"):&]+/gi, "").toLowerCase()
                prex = prefix.replace(/[-]+/gi, " ");
                filters.push(prex);
                prefix = prefix.replace(/[-]+/gi, " ").split(" ")
                searchTextArray = prefix;
                for (var idx in prefix) {
                    if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a" && prefix[idx] != "and" && prefix[idx] != "&")
                        filters.push(prefix[idx])
                }
                /*****************************************************************************************************/
            }


            var fil = JSON.stringify(filters);
            this.groupresult.skip = 0
            this.groupresult.collectionName = fil;
            this.groupresult.fetch({
                async: false
            })
            //Checking the AND Conditions here
            var resultModels;
            if (this.groupresult.models.length > 0 && !this.isEmpty(mapFilter)) {
                var tempResultModels = this.groupresult.models;
                resultModels = this.checkANDConditions(mapFilter, tempResultModels);
            }
            if (this.groupresult.models.length > 0 && searchText != '' && this.isEmpty(mapFilter)) {
                if (searchText_Coll_Id != null || searchText_Coll_Id != undefined) {
                    var collection_id = searchText_Coll_Id;
                }
                var tempModels = this.groupresult.models;
                resultModels = this.checkSearchTextCompleteMatch(searchTextArray, collection_id, tempModels);
            }
            if (resultModels != null) {
                this.groupresult.models = resultModels;
                if (resultModels.length == 0) {
                    this.groupresult.length = 0;
                } else {
                    this.groupresult.length = resultModels.length;
                }
            }
            //End of the checking AND Conditions here
            App.stopActivityIndicator()
            var obj = this
            if (obj.addResource == true) {
                if (this.groupresult.length > 0) {
                    var SearchSpans = new App.Views.SearchSpans({
                        collection: this.groupresult
                    })

                    SearchSpans.resourceids = obj.resourceids
                    SearchSpans.render()
                    $('#srch').append(SearchSpans.el)

                }
            } else {
                var loggedIn = App.member
                var roles = loggedIn.get("roles")
                var SearchResult = new App.Views.ResourcesTable({
                    collection: this.groupresult
                })
                SearchResult.removeAlphabet = true
                SearchResult.isManager = roles.indexOf("Manager")
                SearchResult.resourceids = obj.resourceids
                SearchResult.collections = App.collectionslist
                SearchResult.render()
                $('#srch').html('<h4>'+App.languageDict.attributes.Search_Result+'<a class="backToSearchButton" class="btn btn-info" onclick="backtoSearchView()">'+App.languageDict.attributes.Back_to_Search+'</a></h4>')
                $('#srch').append(SearchResult.el)
            }

        },
        isEmpty: function(map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },
        checkANDConditions: function(map_filter, resultModels) {
            var matchedResults;
            var models = [];
            for (var i = 0; i < resultModels.length; i++) {
                matchedResults = [];
                var model = resultModels[i];
                for (var key in map_filter) {
                    var value = map_filter[key];
                    if (Array.isArray(model.attributes[key])) {
                        var arrayValCheck = false;
                        for (var j = 0; j < value.length; j++) {
                            var val = value[j];
                            if (model.attributes[key].indexOf(val) > -1) {
                                arrayValCheck = true;
                            }
                        }
                        matchedResults.push(arrayValCheck);
                    } else {
                        var stringValCheck = false;
                        if (key != "timesRated") {
                            for (var k = 0; k < value.length; k++) {
                                var val = value[k];
                                if (model.attributes[key] == val) {
                                    stringValCheck = true;
                                }
                            }
                        } else {
                            for (var k = 0; k < value.length; k++) {
                                var val = value[k];
                                var modelRating = Math.ceil(model.attributes.sum / model.attributes[key]);
                                if (modelRating == val) {
                                    stringValCheck = true;
                                }
                            }
                        }
                        matchedResults.push(stringValCheck);
                    }
                }
                if (matchedResults.indexOf(false) == -1) {
                    models.push(model);
                }
            }
            return models;
        },
        checkSearchTextCompleteMatch: function(search_text, coll_id, resultModels) {
            var matchedResults, matchingTitle, matchingPublisher, matchingAuthor;
            var models = [];
            for (var i = 0; i < resultModels.length; i++) {
                matchedResults = [];
                matchingTitle = [];
                matchingPublisher = [];
                matchingAuthor = [];
                var model = resultModels[i];
                for (var st = 0; st < search_text.length; st++) {
                    if(model.attributes.title) {
                        if (model.attributes.title.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.title.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.title.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                            matchingTitle.push(true);
                        } else {
                            matchingTitle.push(false);
                        }
                    }
                    if(model.attributes.Publisher) {
                        if (model.attributes.Publisher.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.Publisher.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.Publisher.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                            matchingPublisher.push(true);
                        } else {
                            matchingPublisher.push(false);
                        }
                    }
                    if(model.attributes.author) {
                        if (model.attributes.author.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.author.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.author.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                            matchingAuthor.push(true);
                        } else {
                            matchingAuthor.push(false);
                        }
                    }
                    if(model.attributes.subject) {
                        for (var j = 0; j < model.attributes.subject.length; j++) {
                            if (model.attributes.subject[j].toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.subject[j].replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.subject[j].replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                                matchedResults.push(true);
                            }
                        }
                    }
                    if (model.attributes.Tag) {
                        for (var k = 0; k < model.attributes.Tag.length; k++) {
                            if (model.attributes.Tag[k].indexOf(coll_id) > -1) {
                                matchedResults.push(true);
                            }
                        }
                    }
                }
                if (matchingTitle.indexOf(false) == -1 || matchingPublisher.indexOf(false) == -1 || matchingAuthor.indexOf(false) == -1) {
                    matchedResults.push(true);
                }
                if (matchedResults.indexOf(true) > -1) {
                    models.push(model);
                }
            }
            return models;
        },

        addResourceToStepView: function() {

            var obj = this
            var ResultCollection = new Backbone.Collection();
            if (obj.resultArray.length > 0) {
                ResultCollection.set(obj.resultArray)
                var SearchSpans = new App.Views.SearchSpans({
                    collection: ResultCollection
                })

                SearchSpans.resourceids = obj.resourceids
                SearchSpans.render()
                $('#srch').append(SearchSpans.el)

            }

        },
        searchResult: function() {
            searchText = $("#searchText").val()
            var collectionFilter = new Array()
            var subjectFilter = new Array()
            var levelFilter = new Array()
            ratingFilter.length = 0

            collectionFilter = $("#multiselect-collections-search").val()
            subjectFilter = $("#multiselect-subject-search").val()
            levelFilter = $("#multiselect-levels-search").val()
            mediumFilter = $('#multiselect-medium-search').val()

            $("input[name='star']").each(function() {
                if ($(this).is(":checked")) {
                    ratingFilter.push($(this).val());
                }
            })

            if (searchText != "" || (collectionFilter) || (subjectFilter) || (levelFilter) || (mediumFilter) || (ratingFilter && ratingFilter.length > 0)) {

                this.collectionFilter = collectionFilter
                this.levelFilter = levelFilter
                this.subjectFilter = subjectFilter
                this.ratingFilter = ratingFilter
                this.mediumFilter = mediumFilter
                this.addResource = true
                App.$el.children('.body').html(search.el)
                this.render()
                $("#searchText2").val(searchText)
                $("#srch").show()
                $(".row").hide()
                $(".search-bottom-nav").show()
                $(".search-result-header").show()
                $("#selectAllButton").show()
            }
            $('#previous_button').hide()
            $('#searchText').focus();
            $("#searchText").val(searchText)

        },
        addResourceToPublication: function() {
            if (typeof grpId === 'undefined') {
                document.location.href = '../nation/index.html#publication'
            }
            var rids = new Array()
            var publication = new App.Models.Publication({
                "_id": grpId
            })
            publication.fetch({
                async: false
            })
            $("input[name='result']").each(function() {
                if ($(this).is(":checked")) {
                    var rId = $(this).val();
                    if (publication.get("resources") != null) {
                        rids = publication.get("resources")
                        if (rids.indexOf(rId) < 0)
                            rids.push(rId)
                    } else {
                        rids.push(rId)
                    }

                }
            });
            if(rids.length > 0) {
                publication.set("resources", rids)
                publication.save()
                publication.on('sync', function() {
                    alert(App.languageDict.attributes.Resources_Added_Success)
                    window.location = '../nation/index.html#publicationdetail/' + publication.get('_id')
                })
            } else {
                alert(App.languageDict.attributes.Prompt_Reource_first);
            }


        }

    })

});

$(function() {

  App.Views.SearchSpan = Backbone.View.extend({

    tagName: "tr",

    className: 'search-box',

    template: $("#template-Search-box").html(),

    render: function() {


      var vars = this.model.toJSON()
      if (!vars.Tag)
        vars.Tag = ''
      // alert('testing purpose in search span')
      if (vars.name) {
        vars.title = "CourseSearchBox"
        vars.Tag = "CourseSearchBox"
      } else {
        vars.name = "ResourceSearchBox"
      }

      this.$el.append(_.template(this.template, vars))

    }
  })
});

$(function() {
    App.Views.SearchSpans = Backbone.View.extend({

        addOne: function(model) {
            if (this.resourceids) {
                if ($.inArray(model.get("id"), this.resourceids) == -1) {
                    this.renderView(model)
                }
            } else {
                this.renderView(model)
            }
        },
        renderView: function(model) {
            var modelView = new App.Views.SearchSpan({
                model: model
            })
            modelView.render()
            this.$el.append(modelView.el)
            //$('#srch').append(modelView.el)
        },
        addAll: function() {
            this.collection.each(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});

$(function() {

    App.Views.RequestView = Backbone.View.extend({

        tagName: "div",
        id: "site-request",
        type: null,
        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function() {
            document.getElementById('nav').style.visibility = "visible"
            Backbone.history.navigate('AllRequests', {
                trigger: true
            })
        },
        cancelform: function() {
            $('#site-request').animate({
                height: 'toggle'
            })
            this.form.setValue({
                request: ""
            })
            var that = this
            setTimeout(function() {
                that.remove()
            }, 1000)
            document.getElementById('nav').style.visibility = "visible"
        },
        setForm: function() {
            var configurations = Backbone.Collection.extend({

                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()
            var date1 = new Date()
            var datestring = ("0" + (date1.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + date1.getDate().toString()).substr(-2) + "/" + (date1.getFullYear().toString()).substr(2)
            if (this.form.getValue("request").length != 0) {
                this.form.setValue({
                    status: '0'
                })
                this.form.setValue({
                    senderId: ($.cookie('Member._id'))
                })
                this.form.setValue({
                    date: datestring
                })
                this.form.setValue({
                    sendFrom: cofigINJSON.rows[0].doc.type
                })
                this.form.setValue({
                    sendFromName: cofigINJSON.rows[0].doc.name
                })
                this.form.setValue({
                    response: ""
                })
                this.form.setValue({
                    type: this.type
                })
                this.form.commit()
                this.model.save()
                alert(App.languageDict.attributes.Request_Sent_Success)
                this.form.setValue({
                    request: ""
                })
            }
            $('#site-request').animate({
                height: 'toggle'
            })
            var that = this
            setTimeout(function() {
                that.remove()
            }, 1000)
            document.getElementById('nav').style.visibility = "visible"
        },

        render: function() {
            document.getElementById('nav').style.visibility = "hidden"
            var modl = new App.Models.request()
            this.model = modl
            this.form = new Backbone.Form({
                model: modl
            })
            if (this.type == "Course") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">'+App.languageDict.attributes.Request_Course_Title+'</span>')
            } else if (this.type == "Resource") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">'+App.languageDict.attributes.Request_Resource_Title+'</span>')
            } else if (this.type == "Meetup") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">'+App.languageDict.attributes.Request_Meetup_Title+'</span>')
            } else {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">'+App.languageDict.attributes.Error+'</span>')
            }
            this.$el.append(this.form.render().el)
            this.form.fields['senderId'].$el.hide()
            this.form.fields['status'].$el.hide()
            this.form.fields['response'].$el.hide()
            this.form.fields['type'].$el.hide()
            this.form.fields['sendFrom'].$el.hide()
            this.form.fields['sendFromName'].$el.hide()
            this.form.fields['date'].$el.hide()
            var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">'+App.languageDict.attributes.Cancel+'</button><button class="btn btn-hg btn-info" id="ViewAllButton">'+App.languageDict.attributes.View_All+'</button><button class="btn btn-hg btn-primary" id="formButton">'+App.languageDict.attributes.Submit+'</button></div>')
            this.$el.append($button);

        }


    })
});

$(function () {
    App.Views.FeedbackTable = Backbone.View.extend({

        tagName: "table",

        className: "btable btable-striped",

        addOne: function (model) {
            var feedbackRow = new App.Views.FeedbackRow({
                model: model
            })
            feedbackRow.render()
            this.$el.append(feedbackRow.el)
        },

        addAll: function () {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.$el.append('<tr><th>'+App.languageDict.attributes.Comment+'</th><th>'+App.languageDict.attributes.Rating+'</th></tr>')
            this.collection.each(this.addOne, this)
        },

        render: function () {
            this.addAll()
        }

    })

});

$(function () {

    App.Views.FeedbackRow = Backbone.View.extend({

        vars: {},

        tagName: "tr",

        events: {
            "click .destroy": function (e) {
                e.preventDefault()
                this.model.destroy()
                this.remove()
            },
            "click .browse": function (e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-FeedbackRow").html(),

        render: function () {
            var vars = this.model.toJSON()
            vars.memberName = "";
            this.$el.append(_.template(this.template, vars))
        }

    })

});

$(function() {

    App.Views.FeedbackForm = Backbone.View.extend({

        tagName: "form",
        user_rating: 'null',
        events: {
            "click #formButton": "setForm",
            //"click #AddToShelf": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function() {
            var that = this;
            this.user_rating = 0;
            this.form = new Backbone.Form({
                model: this.model
            });
            var model = this.model;
            this.$el.append(this.form.render().el);
            this.form.fields['rating'].$el.hide();
            this.form.fields['memberId'].$el.hide();
            this.form.fields['resourceId'].$el.hide();
            this.form.fields['communityCode'].$el.hide();
            var $button = $('<a class="btn btn-success" style="margin-left:10px" id="formButton">'+App.languageDict.attributes.Save+'</a>');
            $btnAddToShelf = $('<button class="btn btn-success" id="AddToShelf" style="margin-left:10px">'+App.languageDict.attributes.save_and_add_feedback+'</button>');
            this.$el.append($button);
            this.$el.append($btnAddToShelf);
            //Issue#61: Update buttons Add Feedback form when rating a resource
            $btnAddToShelf.click(function() {
                that.setForm();
                if (that.user_rating > 0) {
                    AddToShelfAndSaveFeedback(model.get('resourceId'), escape(that.rtitle));
                }
            });
            //////////////////////////////////////////////////////////////////////
        },
        setFormFromEnterKey: function(event) {
            event.preventDefault();
            this.setForm();
        },
        setUserRating: function(userRating) {
            this.user_rating = userRating;
        },
        setForm: function() {
            // Put the form's input into the model in memory
            if (this.user_rating == 0) {
                alert(App.languageDict.attributes.Rate_Resource_First);
            } else {
                // Put the form's input into the model in memory
                if (this.form.getValue('comment').length == 0) {
                    this.form.setValue('comment', 'No Comment');
                }
                this.form.setValue('rating', this.user_rating);
                this.form.setValue('communityCode', App.configuration.get('code'));

                this.form.commit();
                var that = this;

                var feedbackModel = that.model;
                var member = new App.Models.Member();
                member.set('_id', $.cookie('Member._id'));
                member.fetch({
                    success: function(upModel, upRev) {
                        that.logActivity(upModel, feedbackModel);
                    }
                })
                var FeedBackDb = new PouchDB('feedback');
                FeedBackDb.post(that.model.toJSON(), function(err, info) {
                    if (!err) {
                        var Resources = new PouchDB('resources');
                        var resId = that.model.get("resourceId");
                        Resources.get(resId, function(err, resdoc) {
                            console.log(err);
                            if (!err) {
                                var numRating = parseInt(resdoc.timesRated);
                                numRating++;
                                var sumRating = parseInt(resdoc.sum) + parseInt(that.user_rating);
                                Resources.put({
                                        sum: sumRating,
                                        timesRated: numRating
                                    },
                                    resdoc._id, resdoc._rev,
                                    function(error, info) {
                                        console.log(error);
                                        console.log(info);
                                    })
                            } else {
                                Resources.post({
                                        _id: resId,
                                        sum: parseInt(that.user_rating),
                                        timesRated: 1
                                    },
                                    function(error, info) {
                                        console.log(error);
                                        console.log(info);
                                    }
                                )
                            }
                            var temp = $.url().data.attr.fragment;
                            if(temp.indexOf('usercourse/details') != -1){
                                $('#externalDiv').fadeOut(1000)
                                setTimeout(function() {
                                    $('#externalDiv').hide()
                                }, 1000);
                                window.location.reload();

                            }
                            else{
                                window.history.back();
                            }

                          /*  Backbone.history.navigate('resources', {
                                trigger: true
                            });*/

                        });
                        console.log(info);
                    } else {
                        console.log(err);
                    }
                })
                $('#externalDiv').hide();
            }
        },

        logActivity: function(member, feedbackModel) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate);

            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    that.UpdatejSONlog(member, logModel, logdb, feedbackModel, logdate);
                } else {
                    that.createJsonlog(member, logdate, logdb, feedbackModel);
                }
            });
        },

        createJsonlog: function(member, logdate, logdb, feedbackModel) {
            var that = this;
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            };
            logdb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("FeedbackForm:: createJsonlog:: created activity log in pouchdb for today..");
                    logdb.get(logdate, function(err, logModel) {
                        if (!err) {
                            that.UpdatejSONlog(member, logModel, logdb, feedbackModel, logdate);
                        } else {
                            console.log("FeedbackForm:: createJsonlog:: Error fetching activitylog doc from Pouch after creating it");
                        }
                    });
                } else {
                    console.log("FeedbackForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                    console.log(err);
                }
            });
        },

        UpdatejSONlog: function(member, logModel, logdb, feedbackModel, logdate) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            console.log(feedbackModel);
            memRating = parseInt(feedbackModel.get('rating'));
            var resId = feedbackModel.get('resourceId');
            var index = logModel.resourcesIds.indexOf(resId);
            if (index == -1) {
                logModel.resourcesIds.push(resId);
                if (member.get('Gender') == 'Male') {
                    if (superMgrIndex == -1) {
                        logModel.male_rating.push(memRating);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(1);
                        logModel.female_timesRated.push(0);
                    } else {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(0);
                    }
                } else {
                    if (superMgrIndex == -1) {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(memRating);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(1);
                    } else {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(0);
                    }
                }
            } else {
                if (member.get('Gender') == 'Male') {
                    if (superMgrIndex == -1) {
                        logModel.male_rating[index] = parseInt(logModel.male_rating[index]) + memRating;
                        logModel.male_timesRated[index] = (parseInt(logModel.male_timesRated[index])) + 1;
                    }
                } else {
                    if (superMgrIndex == -1) {
                        logModel.female_rating[index] = parseInt(logModel.female_rating[index]) + memRating;
                        logModel.female_timesRated[index] = (parseInt(logModel.female_timesRated[index])) + 1;
                    }
                }
            }

            logdb.put(logModel, logdate, logModel._rev, function(err, response) {
                if (!err) {
                    console.log("FeedbackForm:: UpdatejSONlog:: updated daily log from pouchdb for today..");
                } else {
                    console.log("FeedbackForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
                }
            });
        },

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        }
    })
});

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
			var languageDictValue;
			var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
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
			var languageDictValue;
			var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
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
				//groupLength = json.rows[0].value //when empty data are fetched it will show undefined error
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

});

$(function () {

    App.Views.GroupRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {
            "click .destroy": function (e) {
                e.preventDefault()
                var cId = this.model.get("_id")
                var clevels = new App.Collections.CourseLevels()
                var model
                clevels.groupId = cId
                clevels.fetch({
                    success: function () {
                        while (model = clevels.first()) {
                            model.destroy();
                        }
                    }
                })
                var stepResults = new App.Collections.StepResultsbyCourse()
                var model
                stepResults.courseId = cId
                stepResults.fetch({
                    success: function () {
                        while (model = stepResults.first()) {
                            model.destroy();
                        }
                    }
                })

                var ei = new App.Collections.EntityInvitation()
                var model
                ei.entityId = cId
                ei.fetch({
                    success: function () {
                        while (model = ei.first()) {
                            model.destroy();
                        }
                    }
                })
                var cs = new App.Models.CourseSchedule()
                cs.courseId = cId
                cs.fetch({
                    success: function () {
                        cs.destroy()
                    }
                })
                this.model.destroy()
                this.remove()
            },
            "click .browse": function (e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-GroupRow").html(),

        initialize: function (e) {
            //this.model.on('destroy', this.remove, this)
            this.roles = e.roles
        },

        render: function () {
            var vars = this.model.toJSON();
            vars.manage=App.languageDict.attributes.Manage;
            vars.viewCourse=App.languageDict.attributes.View+' '+App.languageDict.attributes.Course;
            vars.progress=App.languageDict.attributes.Progress;
            vars.deleteLabel=App.languageDict.attributes.DeleteLabel;

            if(this.courseId==null)
            {


                vars.courseId=this.courseId
                if(vars._id=='_design/bell')
                    return

                if(!vars.members)
                {
                    vars.members = new Array()
                }
                /* if (vars.courseLeader != undefined && vars.courseLeader == $.cookie('Member._id')) {
                 vars.isLeader = 1
                 } else {
                 vars.isLeader = 0
                 }*/
                var check =0;
                if (vars.courseLeader != undefined){
                    for (var j=0 ; j< vars.courseLeader.length;j++) {
                        if (vars.courseLeader[j] == $.cookie('Member._id'))
                        {

                            vars.isLeader = 1
                            check = 1;

                        }

                    }
                    if (check == 0 ){
                        vars.isLeader = 0
                    }
                }
                else {
                    vars.isLeader = 0
                }
                var cLeader = 0;
                if (vars.courseLeader != undefined){
                    for (var j=0 ; j< vars.courseLeader.length;j++) {
                        if (vars.courseLeader[j] == $.cookie('Member._id')) {
                            cLeader = 1;
                            break;
                        }
                    }
                }
                else {
                    cLeader = 0
                }
                //vars.courseLeader == $.cookie('Member._id')
                if (this.roles.indexOf("Manager") != -1 || cLeader!=0 || vars.members.indexOf($.cookie('Member._id'))!=-1)
                {
                    vars.viewProgress = 1
                }
                else
                {
                    vars.viewProgress = 0
                }
                if (this.roles.indexOf("Manager") != -1) {
                    vars.isAdmin = 1
                } else {
                    vars.isAdmin = 0
                }
                this.$el.append(_.template(this.template, vars))

            }
            else{
                vars.viewProgress = 0
                vars.isAdmin = 0
                vars.isLeader = 0
                vars.courseId=this.courseId;
                this.$el.append(_.template(this.template, vars))
            }

        }

    })

});

$(function () {

    App.Views.GroupForm = Backbone.View.extend({
        //This view is used to render "Add a Course" page and its bound with "Group" model

        className: "form",
        id: 'groupform',
        prevmemlist: null,
        btnText: 'Continue',
        events: {
            "click #sformButton": "setForm",
            "click #uformButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #inviteMemberButton": "MemberInvite",
            "click #coursescheduleButton": "CourseSchedule",
            "click #cancel": function () {
                window.history.back()
            }


        },

        CourseSchedule: function () {
            var form = new App.Views.CourseScheduleForm()
            form.courseId = this.model.id
            var model
            var cs = new App.Collections.CourseScheduleByCourse()
            cs.courseId = this.model.id
            cs.fetch({
                async: false
            })
            if (cs.length > 0) {
                model = cs.first()
                form.edit = true
                form.sid = model.get("_id")
                form.srevid = model.get("_rev")
            }
            form.render()
            App.$el.children('.body').html('<a id="BackToCourse" onclick = "location.reload()" class="btn btn-info"><< Back To Course</a>')
            App.$el.children('.body').append('<p id="scheduletitle">' + this.model.get("name") + '|Schedule</p>')
            App.$el.children('.body').append(form.el)
            $('#startTime').timepicker()
            $('#endTime').timepicker()
            $('#startDate').datepicker()
            $('#endDate').datepicker()
            $('#typeView').hide()
            $('.days').hide()

            if (cs.length > 0) {
                model = cs.first()
                $('#startTime').val(model.get("startTime"))
                $('#endTime').val(model.get("endTime"))
                $('#startDate').val(model.get("startDate"))
                $('#endDate').val(model.get("endDate"))
                $('#location').val(model.get("location"))
                $('#type').val(model.get("type"))
                if (model.get("type") == "Weekly") {
                    $('#weekDays').val(model.get("weekDays"))
                }
            }
            $('#type').on('change', function () {
                if (this.value == "Monthly") {
                    $('#typeView').show()
                    $('.days').hide()
                    $("#typeView").multiDatesPicker();
                } else if (this.value == "Weekly") {
                    $('.days').show()
                    $('#typeView').hide()
                } else {
                    $('.days').hide()
                    $('#typeView').hide()
                }
            });
        },
        MemberInvite: function () {

            if ($("textarea[name='description']").val().length > 0) {
                $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
                var inviteModel = new App.Models.InviFormModel()
                inviteModel.resId = this.model.get("_id")
                inviteModel.senderId = $.cookie('Member._id')
                inviteModel.type = this.model.get("kind")
                inviteModel.title = this.model.get("name")
                var inviteForm = new App.Views.InvitationForm({
                    model: inviteModel
                })
                inviteForm.description = this.model.get("description")
                inviteForm.render();

                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el);


            } else {
                alert(App.languageDict.attributes.Prompt_Course_Desc)
            }
            var directionOfLang = App.languageDict.get('directionOfLang');

            if (directionOfLang.toLowerCase() === "right") {

                $('#invitationdiv').addClass('courseSearchResults_Bottom');
            }
            else {
                $('#invitationdiv').removeClass('courseSearchResults_Bottom');
            }



        },
        getRoles: function () {

            var member = new App.Models.Member()
            member.id = $.cookie('Member._id')
            member.fetch({
                async: false
            })
            return member.get('roles')

        },
        render: function () {

            $('#invitationdiv').hide()
            // members is required for the form's members field
            var groupForm = this
            if (this.model.get("_id") != undefined) {
                this.prevmemlist = this.model.get("members")
                this.model.on({
                    "change:statDate": this.sendMail,
                    "change:endDate": this.sendMail,
                    "change:startTime": this.sendMail,
                    "change:endTime": this.sendMail,
                    "change:location": this.sendMail
                });

            }
            if (!this.model.get("languageOfInstruction")) {
                this.model.set("languageOfInstruction", "")
            }
            this.model.schema.members.options = [];
            var memberList = new App.Collections.leadermembers();
            var config = new App.Collections.Configurations();
            var temp;
            config.fetch({
                async: false,
                success: function(){
                    temp = config.first().attributes.name;
                }
            })
            temp=temp.charAt(0).toUpperCase() + temp.slice(1);
            var typeofBell=config.first().attributes.type;
            if (typeofBell === "nation") {
                typeofBell=config.first().attributes.code;
            }
            else {
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                })
                var config = new configurations()
                config.fetch({
                    async: false
                })
                var con = config.first()
                con = (con.get('rows')[0]).doc;
                typeofBell=con.code;

            }
            memberList.fetch({
                success: function () {
                    //create the form
                    var optns = []
                    memberList.each(function (modl) {
                        if(typeofBell== modl.toJSON().community){
                            var temp = {
                                label: modl.toJSON().firstName + " " + modl.toJSON().lastName,
                                val: modl.toJSON()._id
                            }
                            optns.push(temp)
                        }

                    })


                    groupForm.model.schema.courseLeader.options = optns

                    groupForm.form = new Backbone.Form({
                        model: groupForm.model                  // groupForm.model is a 'Group' model instance. 'Group' is basically a course
                    })
                    groupForm.$el.append(groupForm.form.render().el)
                    $('.bbf-form').find('.field-courseLeader').find('.bbf-editor select').attr('multiple','multiple');
                    if(groupForm.model.get("courseLeader") == undefined)
                    {
                        $('.bbf-form').find('.field-courseLeader').find('.bbf-editor select').val("0000");
                    }
                    else
                    {
                        $('.bbf-form').find('.field-courseLeader').find('.bbf-editor select').val(groupForm.model.get("courseLeader"));
                    }


                    groupForm.form.fields['members'].$el.hide()
                    if (groupForm.model.get("_id") == undefined) {
                        groupForm.form.fields['Day'].$el.hide()
                    }

                    $('.field-backgroundColor input').spectrum({
                        clickoutFiresChange: true,
                        preferredFormat: 'hex',
                        chooseText:App.languageDict.attributes.Choose,
                        cancelText:App.languageDict.attributes.Cancel
                    })
                    $('.field-foregroundColor input').spectrum({
                        clickoutFiresChange: true,
                        preferredFormat: 'hex',
                        chooseText:App.languageDict.attributes.Choose,
                        cancelText:App.languageDict.attributes.Cancel
                    })
                    // give the form a submit button
                    var $sbutton = $('<a class="group btn btn-success" id="sformButton">'+App.languageDict.attributes.Continue+'</button>')
                    var $ubutton = $('<a class="group btn btn-success" style="" id="uformButton">'+App.languageDict.attributes.Update+'</button>')

                    var $button = $('<a style="margin-top: -100px;" role="button" id="ProgressButton" class="btn" href="#course/report/' + groupForm.model.get("_id") + '/' + groupForm.model.get("name") + '"> <i class="icon-signal"></i> '+App.languageDict.attributes.Progress+'</a><a style="margin-top: -100px;"class="btn btn-success" id="inviteMemberButton">'+App.languageDict.attributes.Invite_Member+'</button><a style="margin-top: -100px;"class="btn btn-success" id="" href="#course/members/' + groupForm.model.get("_id") + '">'+App.languageDict.attributes.Members+'</a>')
                    if (groupForm.model.get("_id") != undefined) {
                        groupForm.$el.prepend($button)
                        groupForm.$el.append($ubutton)
                    } else {
                        groupForm.$el.append($sbutton)
                    }

                    groupForm.$el.append("<a class='btn btn-danger' style='margin-left : 20px;' id='cancel'>"+App.languageDict.attributes.Cancel+"</a>")
                },
                async: false
            });

            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);

        },
        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },
        setForm: function () {
            var that = this

            var newEntery = 0

            this.model.once('sync', function () {
                Backbone.history.navigate('course/manage/' + that.model.get("id"), {
                    trigger: true
                })
            })
            // Put the form's input into the model in memory

            this.form.commit();
            var previousLeader = [];
            if(this.form.model.id) //if form's model has an "ID" attribute then we are editing existing course model.
            {
                var courseModel = new App.Models.Group({
                    _id: this.form.model.id
                });
                courseModel.fetch({
                    async: false
                });
                previousLeader = courseModel.get('courseLeader');
                if(previousLeader==undefined || previousLeader==null)
                {
                    previousLeader=[];
                }
            }

            this.model.set("name", this.model.get("CourseTitle"))
            // Send the updated model to the server
            if (this.model.get("_id") == undefined) {

                newEntery = 1;
                this.model.attributes.members.push($.cookie('Member._id'));
                //this.model.set("members", [$.cookie('Member._id')])
            }else {
                for(var i=0;i<this.prevmemlist.length;i++)
                {
                    this.model.attributes.members.push(this.prevmemlist[i]);
                }
                //this.model.set("members", this.prevmemlist)
            }
            if ($.trim(this.model.get('CourseTitle')).length == 0) {
                alert(App.languageDict.attributes.CourseTitle_Missing)
            }
            //            else if (this.model.get("courseLeader") == 0000) {
            //                alert("Select Course Leader")
            //            }
            else if (this.model.get("description").length == 0) {
                alert(App.languageDict.attributes.Course_Desc_Missing)
            }
            else {
                var member = new App.Models.Member()
                member.id = $.cookie('Member._id')
                member.fetch({
                    async: false
                })
                if (member.get('roles').indexOf("Leader") == -1) {
                    member.get('roles').push("Leader")
                    member.save()
                }

                //  var isNewLeaderAlreadyCourseMember = false;
                var leader = this.model.get('courseLeader');
                if (leader == null)
                {
                    leader=previousLeader;
                }
                /*  var falseLeader=this.model.get('courseLeader').indexOf('0000')
                 if(falseLeader!=-1){
                 this.model.attributes.courseLeader.splice(falseLeader,1);
                 }*/
                var courseMembers = this.model.get('members');
                if(leader && leader.length>0)
                {
                    for(var i=0;i<leader.length;i++)
                    {
                        if (courseMembers.indexOf(leader[i]) == -1) { // new leader is not a member of the course already
                            courseMembers.push(leader[i])
                        } else {
                            //  isNewLeaderAlreadyCourseMember = true;  //if its true then it shows that either of the leaders is already a member
                        }
                        /* var index = previousLeader.indexOf(leader[i]);
                         if (index == -1) {
                         previousLeader.push(leader[i]);
                         }*/
                    }
                }

                //var index = courseMembers.indexOf(previousLeader)
                this.model.set("members", courseMembers);
                var context = this
                var courseTitle = this.model.get('CourseTitle');
                var finalLeader=[];
                for(var i=0;i<previousLeader.length;i++){
                    finalLeader.push(previousLeader[i]);
                }
                for(var i=0;i<leader.length;i++){
                    if(finalLeader.indexOf(leader[i])==-1){
                        finalLeader.push(leader[i]);
                    }
                }
                this.model.set('courseLeader',finalLeader);
                this.model.set('CourseTitle', $.trim(courseTitle));
                this.model.save(null, {
                    success: function (e) {
                        console.log(context.model.get('courseLeader'))
                        var memprogress = new App.Models.membercourseprogress();
                        var stepsids = new Array();
                        var stepsres = new Array();
                        var stepsstatus = new Array();
                        if (newEntery == 1) {
                            memprogress.set("stepsIds", stepsids)
                            memprogress.set("memberId", $.cookie("Member._id"))
                            memprogress.set("stepsResult", stepsres)
                            memprogress.set("stepsStatus", stepsstatus)
                            memprogress.set("courseId", e.get("id"));
                            memprogress.save()
                            //0000 is value for --select--
                            //if (context.model.get('courseLeader') != $.cookie("Member._id")&&context.model.get('courseLeader')!='0000') {
                            if (context.model.get('courseLeader') && context.model.get('courseLeader').indexOf( $.cookie("Member._id"))==-1){  //&&context.model.get('courseLeader').indexOf('0000')==-1) {
                                for(var i=0;i<context.model.get('courseLeader').length;i++){
                                    memprogress.set("stepsIds", stepsids);
                                    memprogress.set("memberId",context.model.get('courseLeader')[i] )    //Needs some changes here
                                    memprogress.set("stepsResult", stepsres)
                                    memprogress.set("stepsStatus", stepsstatus)
                                    memprogress.set("courseId", e.get("id"))
                                    memprogress.save();
                                }
                                //
                            }

                            alert(App.languageDict.attributes.Course_Created_Success)
                        }
                        else { // the course already exists
                            //  {
                            // if the newly chosen leader is different from previous one and he/she is also from outside the course, i-e
                            // he/she was not a member of course before being selected as its leader, then two things should happen:
//                            // (i) previous-leader's membercourseprogress doc should be deleted
//                            var memberProgress = new App.Collections.membercourseprogresses();
//                            memberProgress.courseId = context.model.get("_id");
//                            memberProgress.memberId = previousLeader;
//                            memberProgress.fetch({
//                                async: false
//                            });
//                            memberProgress.each(function (m) {
//                                m.destroy();
//                            });
                            // (ii) new-leader's membercourseprogress doc should be created and initialised with default values
                            //COPIED CODE FROM HERE
                            //  }
                            // if ( (leader !== previousLeader) && (isNewLeaderAlreadyCourseMember === false) )  //Needs some changes here
                            if(leader && leader.length==0){
                                leader=previousLeader;
                            }
                            _.each(leader,function(leaderId){

                                var index = previousLeader.indexOf(leaderId);
                                if (index == -1) {
                                    var csteps = new App.Collections.coursesteps();
                                    csteps.courseId = context.model.get("_id"); // courseId
                                    csteps.fetch({
                                        success: function () {
                                            stepsids=[];
                                            stepsres=[];
                                            stepsstatus=[];
                                            csteps.each(function (m) {
                                                stepsids.push(m.get("_id"))
                                                stepsres.push("0")
                                                stepsstatus.push("0")
                                            })
                                            memprogress.set("stepsIds", stepsids)
                                            memprogress.set("memberId", leaderId)
                                            memprogress.set("stepsResult", stepsres)
                                            memprogress.set("stepsStatus", stepsstatus)
                                            memprogress.set("courseId", csteps.courseId)
                                            memprogress.save({
                                                success: function () {
                                                    alert(App.languageDict.attributes.Success_Saved_Msg)
                                                }
                                            })
                                        }
                                    });
                                }
                            });


                            //alert(that.model.get("_id"))
                            ///to get the latest rev.id
                            var groupModel = new App.Models.Group()
                            groupModel.id = that.model.get("_id")
                            groupModel.fetch({
                                async: false
                            })
                            //alert(groupModel.get("rev"))
                            that.model.set("_rev", groupModel.get("_rev"))
                            alert(App.languageDict.attributes.Course_Updated_Success)
                        }
                    }
                })
            }
        },
        sendMail: function (e) {

            memberList = e._previousAttributes.members

            for (var i = 0; i < memberList.length; i++) {
                var mem = new App.Models.Member({
                    _id: memberList[i]
                })
                mem.fetch({
                    async: false
                })

                var currentdate = new Date();
                var mail = new App.Models.Mail();
                mail.set("senderId", $.cookie('Member._id'));
                mail.set("receiverId", mem.get("_id"));
                mail.set("subject", "Change of Course Schedule | " + e.get("name"));
                var mailText = "<b>Schedule is changed </b><br><br>New Schedule is:<br> Duration:   " + e.get('startDate') + '  to  ' + e.get('endDate') + '<br>'
                mailText += "Timing:        " + e.get('startTime') + '  to  ' + e.get('endTime')
                mailText += "<br>Locatoin:      " + e.get('location')
                mail.set("body", mailText);
                mail.set("status", "0");
                mail.set("type", "mail");
                mail.set("sentDate", currentdate);
                mail.save()
            }

        }
    })

});

$(function() {
    App.Views.GroupView = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        roles: null,
        events: {
            "click #admissionButton": function(e) {}
        },
        render: function() {
            this.addCourseDetails()
        },
        addCourseDetails: function() {
            var that = this
            var courseInfo = this.model.toJSON()
            console.log("before");
            console.log(this.courseLeader.length);
            var leaderNames = "";
            var leaderEmails = "";
            var leaderPhones = "";


            for(var i = 0; i < this.courseLeader.length; i++)
            {
                leaderNames += this.courseLeader[i].get("firstName") + ' ' + this.courseLeader[i].get("lastName");
                if(this.courseLeader[i].get("email") == "" || this.courseLeader[i].get("email") == undefined)
                {
                    leaderEmails += "-";
                }
                else
                {
                    leaderEmails += this.courseLeader[i].get("email");
                }
                if(this.courseLeader[i].get("phone") == "" || this.courseLeader[i].get("phone") == undefined)
                {
                    leaderPhones += "-";
                }
                else
                {
                    leaderPhones += this.courseLeader[i].get("email");
                }
                if((i + 1) != this.courseLeader.length)
                {
                    leaderNames += ", ";
                    leaderEmails += ", ";
                    leaderPhones += ", ";
                }

            }
            console.log(courseInfo)
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Name+'</b></td><td>' + courseInfo.CourseTitle + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Subject_Level+' </b></td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Grade_Level+' </b></td><td>' + courseInfo.gradeLevel + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Description+'</b></td><td>' + courseInfo.description + '</td></tr>')

            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Name+'</b></td><td>' + leaderNames + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Email+'</b></td><td>' + leaderEmails + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Leader_Phone_Number+'</b></td><td>' + leaderPhones + '</td></tr>')

            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Schedule+'</b></td><td>'+App.languageDict.attributes.Date+' :  ' + courseInfo.startDate + '-' + courseInfo.endDate + '<br>'+App.languageDict.attributes.Time+' :  ' + courseInfo.startTime + '- ' + courseInfo.endTime + '</td></tr>')

            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Location+'</b></td><td>' + courseInfo.location + '</td></tr>')

            // $(document).on('Notification:submitButtonClicked', function (e) {});

        }
    })

});

$(function () {
    App.Views.CourseStepsView = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        roles: null,

        addOne: function (model) {

        },
        render: function () {
            this.collection.each(this.addStep, this)

        },
        addStep: function (model) {

            this.$el.append('<tr><td></td><td><b>' + model.get('title') + '</b></br></br>' + model.get('description') + '</td></tr>')

        }

    })

});

$(function () {

    App.Views.BecomeMemberForm = Backbone.View.extend({

        className: "form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function () {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['status'].$el.hide()
            this.form.fields['yearsOfTeaching'].$el.hide()
            this.form.fields['teachingCredentials'].$el.hide()
            this.form.fields['subjectSpecialization'].$el.hide()
            this.form.fields['forGrades'].$el.hide()
            this.form.fields['visits'].$el.hide()
            // this.form.fields['roles'].$el.hide()



            var that = this
            //      this.form.fields['roles'].$el.change(function(){
            //        var values = new Array()
            //         $('input[type="checkbox"]:checked').each(function() {
            //                values.push(this.value)
            //         })    
            //          if(values.indexOf("lead") > -1){
            //              that.form.fields['yearsOfTeaching'].$el.show()
            //              that.form.fields['teachingCredentials'].$el.show()
            //              that.form.fields['subjectSpecialization'].$el.show()
            //              that.form.fields['forGrades'].$el.show()
            //           }
            //            else{
            //              that.form.fields['yearsOfTeaching'].$el.hide()
            //              that.form.fields['teachingCredentials'].$el.hide()
            //              that.form.fields['subjectSpecialization'].$el.hide()
            //              that.form.fields['forGrades'].$el.hide()
            //              
            //            }
            //        
            //      })
            // give the form a submit button
            var $button = $('<a class="btn btn-success" id="formButton">Save</button>')
            this.$el.append($button)
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function () {
            if (this.form.validate() != null) {
                return
            }

            var that = this
            this.model.once('sync', function () {
                alert(App.languageDict.attributes.Thank_Member)

                $.cookie('Member.login', that.model.get("login"), {
                    path: "/apps/_design/bell/lms"
                })
                $.cookie('Member._id', that.model.get("id"), {
                    path: "/apps/_design/bell/lms"
                })
                $.cookie('Member.login', that.model.get("login"), {
                    path: "/apps/_design/bell/personal"
                })
                $.cookie('Member._id', that.model.get("id"), {
                    path: "/apps/_design/bell/personal"
                })

                that.trigger('BecomeMemberForm:done')
            })
            // Put the form's input into the model in memory
            this.form.setValue({
                status: "active"
            })
            this.form.commit()
            var addMem = true
            var existing = new App.Collections.Members()
            existing.fetch({
                async: false
            })
            existing.each(function (m) {
                if (m.get("login") == that.model.get("login")) {
                    alert(App.languageDict.attributes.Duplicate_login)
                    addMem = false
                }
            })


            // Send the updated model to the server
            if ($.inArray("lead", this.model.get("roles")) == -1) {
                that.model.set("yearsOfTeaching", null)
                that.model.set("teachingCredentials", null)
                that.model.set("subjectSpecialization", null)
                that.model.set("forGrades", null)
            }
            this.model.set("visits", 0)
            if (addMem) {
                this.model.save()
            }
        }


    })

});

$(function () {
    App.Views.CoursesStudentsProgress = Backbone.View.extend({

        tagName: "div",
        className: "Graphbutton",
        arrayOfData: new Array,
        grandpassed: null,
        grandremaining: null,
        totalRecords: null,
        startFrom: null,
        totalSpace: null,
        events: {
            "click #Donut": function () {
                $('#graph').html(' ')
                document.getElementById('horizontallabel').style.visibility = 'hidden'
                document.getElementById('veticallable').style.visibility = 'hidden'
                this.$el.html('<a class="btn btn-info" id="Bar">Detailed View</a>')
                Morris.Donut({
                    element: 'graph',
                    data: [{
                        label: "Passed Steps",
                        value: this.grandpassed
                    }, {
                        label: "Remaining Steps",
                        value: this.grandremaining
                    }],
                    colors: ['#0B62A4', '#7A92A3']

                });
            },
            "click #Bar": function () {
                $('#graph').html(' ')
                document.getElementById('horizontallabel').style.visibility = 'visible'
                document.getElementById('veticallable').style.visibility = 'visible'

                this.$el.html('<a class="btn btn-info" id="Donut">Birdeye View</a>')
                Morris.Bar({
                    element: 'graph',
                    data: this.arrayOfData,
                    xkey: 'subject',
                    ykeys: ['passed', 'remaining'],
                    labels: ['passed', 'remaining'],
                    gridTextWeight: 900,
                    gridTextSize: 16,
                    axes: true,
                    grid: true,
                    stacked: true
                });
            }


        },


        addOne: function (model) {
            var that = this
            temp = new Object

            data = model.toJSON().stepsStatus
            total = model.toJSON().stepsStatus.length
            passed = 0
            remaining = 0
            for (var i = 0; i < total; i++) {
                if (data[i] != "1") {
                    remaining++
                    this.grandremaining++
                } else {
                    passed++
                    this.grandpassed++
                }
            }
            student = new App.Models.Member({
                _id: model.toJSON().memberId
            })
            student.fetch({
                async: false
            })
            if (student.toJSON().firstName != undefined) {
                temp.name = student.toJSON().firstName
                temp.passed = passed
                temp.remaining = remaining
                temp.memberId = model.get("memberId");
                temp.courseId = model.get("courseId");
                this.arrayOfData.push(temp)

                if(this.totalRecords == 1)
                {
                    var assignmentpapers = new App.Collections.AssignmentPapers()
                    assignmentpapers.senderId = model.get("memberId")
                    assignmentpapers.courseId = model.get("courseId")
                    assignmentpapers.fetch({
                        async: false
                    })
                    var papers = '<table style="border-collapse: separate; height: 100%;" align="center"><tr>'

                    var count = 0;
                    assignmentpapers.each(function (m) {
                        var attchmentURL = '/assignmentpaper/' + m.get("_id") + '/'
                        var attachmentName = ''
                        if (typeof m.get('_attachments') !== 'undefined') {
                            attchmentURL = attchmentURL + _.keys(m.get('_attachments'))[0]
                            attachmentName = _.keys(m.get('_attachments'))[0]
                            if((count % 7) == 0)
                            {
                                papers = papers + '</tr><tr>';
                            }
                            papers = papers + '<td><a download="' + attachmentName + '" href="' + attchmentURL + '" target="_blank" ><button class="btn btn-primary">'+App.languageDict.attributes.PaperForStep+' ' + m.get("stepNo") + '</button></a></td>';
                            count++;
                        }
                    })
                    papers = papers + '</tr></table>'
                    this.$el.append(papers)
                }
                this.startFrom = this.startFrom + this.totalSpace
            }
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.startFrom = 4
                this.totalRecords = this.collection.length
                this.totalSpace = 93 / this.collection.length
                this.collection.each(this.addOne, this)
            } else {
                alert(App.languageDict.attributes.No_Data_Error)
            }
        },
        render: function () {
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.BuildString()

            var morris1 = Morris.Bar({
                element: 'graph',
                data: this.arrayOfData,
                xkey: 'name',
                ykeys: ['passed', 'remaining'],
                labels: [App.languageDict.attributes.Passed, App.languageDict.attributes.Remaining],
                gridTextWeight: 900,
                gridTextSize: 12,
                axes: true,
                grid: true,
                stacked: true,
                xLabelMargin: 5
            });
            if(this.totalRecords != 1)
            {
                morris1.on('click', function(i, row){
                    var data = morris1.options.data[i];
                    var assignmentpapers = new App.Collections.AssignmentPapers()
                    assignmentpapers.senderId = data.memberId;
                    assignmentpapers.courseId = data.courseId;
                    assignmentpapers.fetch({
                        async: false
                    })
                    var papers = '<table style="border-collapse: separate; height: 100%;" align="center"><tr>'

                    var count = 0;
                    assignmentpapers.each(function (m) {
                        var attchmentURL = '/assignmentpaper/' + m.get("_id") + '/'
                        var attachmentName = ''
                        if (typeof m.get('_attachments') !== 'undefined') {
                            attchmentURL = attchmentURL + _.keys(m.get('_attachments'))[0]
                            attachmentName = _.keys(m.get('_attachments'))[0]
                            if((count % 7) == 0)
                            {
                                papers = papers + '</tr><tr>';
                            }
                            papers = papers + '<td><a download="' + attachmentName + '" href="' + attchmentURL + '" target="_blank" ><button class="btn btn-primary">'+App.languageDict.attributes.PaperForStep+' ' + m.get("stepNo") + '</button></a></td>';
                            count++;
                        }
                    })
                    if(count == 0)
                    {
                        papers = papers + '<td>' + App.languageDict.get("No_Record_Found") + '</td>';
                    }
                    papers = papers + '</tr></table>';
                    $('.Graphbutton').html(papers);
                });
            }
        }

    })

});

$(function () {

    App.Views.CourseInfoView = Backbone.View.extend({


        authorName: null,
        tagName: "table",

        className: "courseInfo-table",
        initialize: function () {
            this.$el.html('<th colspan="20">'+App.languageDict.attributes.Course_Information+'</th>')
        },

        add: function (model) {
            //Single Author Should not be displayed multiple times on The Screen

        },


        render: function () {
            var courseInfo = this.model.toJSON();
            console.log(this.leader.length);
            var leaderNames = "";
            var leaderEmails = "";
            var leaderPhones = "";


            for(var i = 0; i < this.leader.length; i++)
            {
                leaderNames += this.leader[i].get("firstName") + ' ' + this.leader[i].get("lastName");
                if(this.leader[i].get("email") == "" || this.leader[i].get("email") == undefined)
                {
                    leaderEmails += "-";
                }
                else
                {
                    leaderEmails += this.leader[i].get("email");
                }
                if(this.leader[i].get("phone") == "" || this.leader[i].get("phone") == undefined)
                {
                    leaderPhones += "-";
                }
                else
                {
                    leaderPhones += this.leader[i].get("phone");
                }
                if((i + 1) != this.leader.length)
                {
                    leaderNames += ", ";
                    leaderEmails += ", ";
                    leaderPhones += ", ";
                }

            }
            console.log('Information of Leader');
            this.$el.append('<tr><td>'+App.languageDict.attributes.Name+' : </td><td>' + courseInfo.name + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Levels+' : </td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Description+' : </td><td>' + courseInfo.description + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Name+' : </td><td>' + leaderNames + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Email+' : </td><td>' + leaderEmails + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Phone_Number+': </td><td>' + leaderPhones + '</td></tr>')
            var bgcolor = ''
            var fgcolor = ''
            if (courseInfo.backgroundColor == '')
                bgcolor = App.languageDict.attributes.Not_Set;
            this.$el.append('<tr><td>'+App.languageDict.attributes.Background_Color+' : </td><td><div style="border:2px solid black;width:50px;height:20px;background-color:' + courseInfo.backgroundColor + '"></div>' + bgcolor + '</td></tr>')
            if (courseInfo.foregroundColor == '')
                fgcolor =App.languageDict.attributes.Not_Set;
            this.$el.append('<tr><td>'+App.languageDict.attributes.Foreground_Color+' :</td><td><div style="border:2px solid black;width:50px;height:20px;background-color:' + courseInfo.foregroundColor + '"></div>' + fgcolor + '</td></tr>')

        }

    })

});

$(function () {

    App.Views.GroupMembers = Backbone.View.extend({

        // tagName: "table",
        // className: "news-table",
        // authorName: null,
        vars: {},
        //template: $('#template-sendMail-CourseMember').html(),
        initialize: function () {},
        events: {
        // "click  .removeMember":"removeMember"
        },
        removeMember:function(e){
        
           var memberId=e.currentTarget.value
           var that=this
           var courseModel = new App.Models.Group({
                _id: this.courseId
            })
            courseModel.fetch({
             		success:function(result){
                            var members=result.get('members')
                            members.splice(members.indexOf(memberId),1)
                            
                            result.set('members',members)
                           
                            result.save()
                            memberCoursePro=new App.Collections.membercourseprogresses()
                            memberCoursePro.memberId=memberId
                            memberCoursePro.courseId=that.courseId
                            
                            memberCoursePro.fetch({async:false})
                            while (model = memberCoursePro.first()) {
  							    model.destroy();
			                }
                            that.render()
                            alert(App.languageDict.attributes.Member_Removed_From_Course)
             		}
            })
            
          
        },
        render: function () {
            var courseModel = new App.Models.Group({
                _id: this.courseId
            })
            courseModel.fetch({
                async: false
            })
            var memberList = courseModel.get('members')

            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first().toJSON()
            var code = currentConfig.rows[0].doc.code
            var na = currentConfig.rows[0].doc.nationName.substring(3,5);
            $('.courseEditStep').empty();
            $('.courseEditStep').append('<h3>'+App.languageDict.attributes.Course_Members+ ' | ' + courseModel.get('name') + '</h3>')
            var viewtext = '<table class="btable btable-striped"><th>'+App.languageDict.attributes.Photo+'</th><th>'+App.languageDict.attributes.Name+'</th><th>'+App.languageDict.attributes.Roles+'</th><th colspan=2>'+App.languageDict.attributes.Actions+'</th>'

            for (var i = 0; i < memberList.length; i++) {
                var mem = new App.Models.Member({
                    _id: memberList[i]
                })
                mem.fetch({
                    async: false
                })
                var roleOfMem;
                if(courseModel.get('courseLeader').indexOf(mem.get('_id')) > -1)
                {
                    roleOfMem=App.languageDict.attributes.Leader
                }
                else {
                    roleOfMem=App.languageDict.attributes.Learner
                }
                var mail = mem.get('login') + '.' + code +na+ '@olebell.org'

                var src = "img/default.jpg"
                var attchmentURL = '/members/' + mem.id + '/'
                if (typeof mem.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(mem.get('_attachments'))[0]
                    src = attchmentURL
                }
                viewtext += '<tr><td><img width="45px" height="45px" src="' + src + '"/></td><td>' + mem.get('firstName') + ' ' + mem.get('lastName') + '</td><td>'+roleOfMem+'</td><td><input type="checkbox" name="courseMember" value="' + mail + '">'+App.languageDict.attributes.Send_Email+'</td>'
    
                
                var loggedIn = new App.Models.Member({
                    "_id": $.cookie('Member._id')
                })
                loggedIn.fetch({
                    async: false
                })
                var roles = loggedIn.get("roles")

                if( courseModel.get('courseLeader') && courseModel.get('courseLeader').indexOf($.cookie('Member._id'))>-1 || roles.indexOf('Manager')>-1)
                {
                    var memId=mem.get('_id')+','+this.courseId;
                   viewtext+='<td><button class="btn btn-danger removeMember" value="' + mem.get('_id') + '" onclick=removeMemberFromCourse(\"' +  memId + '")>'+App.languageDict.attributes.Remove+'</button></td>'
                }
                
                viewtext+='</tr>'

            }
            viewtext += '<tr><td></td><td></td><td>' +
                '<button class="btn"  id="selectAllMembersOnMembers" onclick=selectAllMembers()>' +
                App.languageDict.attributes.Select_All+'</button>' +
                '<button style="" class="btn" ' +
                'onclick=showComposePopupMultiple("' + mail + '") id="sendMailButton">'
                +App.languageDict.attributes.Send_Email+'</button>' +
                '<button class="btn"   id="retrunBack" onclick=retrunBack()>'
                +App.languageDict.attributes.Back+'</button></td></tr>';
            viewtext += '</table>';
            $('.courseEditStep').append(viewtext)

        }

    })

});

$(function() {

    App.Views.InvitationForm = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv"

        },

        title: null,
        entityId: null,
        type: null,
        senderId: null,
        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
        },
        SetParams: function(ti, e, t, s) {
            this.title = ti
            this.entityId = e
            this.type = t
            this.senderId = s

        },
        render: function() {

            //members is required for the form's members field
            var members = new App.Collections.Members()
            var that = this
            var inviteForm = this
            inviteForm.on('InvitationForm:MembersReady', function() {
                this.model.schema.members.options = members
                // create the form
                this.form = new Backbone.Form({
                    model: inviteForm.model
                })
                this.$el.append(this.form.render().el)
                this.form.fields['members'].$el.hide()
                this.form.fields['levels'].$el.hide()
                this.form.fields['invitationType'].$el.find('label').html(App.languageDict.attributes.Invitation_Type);
                 var invitationType=App.languageDict.get("Invitation_Type_Array");
                    for(var i=0;i<invitationType.length;i++){
                        this.form.fields['invitationType'].$el.find('option').eq(i).html(invitationType[i]);
                  }
                this.form.fields['invitationType'].$el.change(function() {
                    var val = that.form.fields['invitationType'].$el.find('option:selected').text();
                    if (val == App.languageDict.attributes.Members) {
                        that.form.fields['members'].$el.show();
                        that.form.fields['levels'].$el.hide();
                        $('.bbf-form .field-members').find('label').eq(0).html(App.languageDict.attributes.Members);
                    } else if (val == App.languageDict.attributes.level_Single) {

                        that.form.fields['members'].$el.hide()
                        that.form.fields['levels'].$el.show();
                        var invitationType=App.languageDict.get("inviteForm_levels");
                        $('.bbf-form .field-levels').find('label').html(App.languageDict.attributes.Levels);
                        for(var i=0;i<invitationType.length;i++){
                            $('.bbf-form .field-levels .bbf-editor ul').find('li').eq(i).find('label').html(invitationType[i]);
                        }

                    } else {
                        that.form.fields['members'].$el.hide()
                        that.form.fields['levels'].$el.hide()
                    }
                });
                // give the form a submit button
                var $button = $('<a class="btn btn-success" id="formButton">'+App.languageDict.attributes.Invite+'</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="cancelButton">'+App.languageDict.attributes.Cancel+'</button>');

            })

            // Get the group ready to process the form
            members.once('sync', function() {
                inviteForm.trigger('InvitationForm:MembersReady')

            })

            members.fetch()

        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var member = new App.Models.Member({
                _id: $.cookie('Member._id')
            })
            member.fetch({
                async: false
            })
            // Put the form's input into the model in memory
            this.form.commit()
            var memberList = new App.Collections.Members()
            memberList.fetch({
                async: false
            })

            var temp
            var that = this
            var currentdate = new Date();
            if (this.model.get("invitationType") == "All") {
                memberList.each(function(m) {
                    temp = new App.Models.Mail()
                    temp.set("senderId", that.model.senderId)
                    temp.set("receiverId", m.get("_id"));
                    temp.set("status", "0")
                    temp.set("subject", "Course Invitation | " + that.model.title)
                    temp.set("type", "course-invitation")
                    temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                    temp.set("sendDate", currentdate)
                    temp.set("entityId", that.model.resId)
                    temp.save()
                    //            temp = new App.Models.Invitation()
                    //            temp.set("title",that.model.title)
                    //            temp.set("senderId",that.model.senderId)
                    //            temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                    //            temp.set("memberId",m.get("_id"))
                    //			temp.set("entityId",that.model.resId)
                    //            temp.set("type",that.model.type)
                    //            temp.save()
                })

            } else if (this.model.get("invitationType") == "Members") {
                memberList.each(function(m) {
                    var that2 = that;
                    if (that.model.get("members").indexOf(m.get("_id")) > -1) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Course Invitation | " + that.model.title)
                        temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                        temp.set("type", "course-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        //            temp = new App.Models.Invitation()
                        //            temp.set("title",that2.model.title)
                        //            temp.set("senderId",that2.model.senderId)
                        //            temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                        //            temp.set("memberId",m.get("_id"))
                        //            temp.set("entityId",that2.model.resId)
                        //            temp.set("type",that2.model.type)
                        temp.save()
                    }
                })
            } else {
                //Fetching The Members and then checking each levels whether they have the same level then incrementing the counnt and save
                memberList.each(function(m) {
                    if (m.attributes.hasOwnProperty("levels") && (that.model.get("levels").indexOf(m.get("levels")) > -1)) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Course Invitation | " + that.model.title)
                        temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                        temp.set("type", "course-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        //                  temp = new App.Models.Invitation()
                        //                  temp.set("title",that.title)
                        //                  temp.set("senderId",that.senderId)
                        //                  temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                        //                  temp.set("memberId",m.get("_id"))
                        //                  temp.set("entityId",that.resId)
                        //                  temp.set("type",that.type)
                        temp.save()
                    }
                });

            }

            $('#invitationdiv').fadeOut(1000)
            alert(App.languageDict.attributes.Invitation_Sent_Success)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

        }


    })

});

$(function () {

    App.Views.CourseSearch = Backbone.View.extend({


        template: $('#template-Search').html(),

        vars: {},
        groupresult: null,
        resultArray: null,

        initialize: function () {
            this.groupresult = new App.Collections.SearchCourses()
            this.resultArray = []
            enablenext = 0
        },
        render: function () {
            var obj = this
            //this.$el.html(_.template(this.template, this.vars))
            //this.searchText = $("#searchText").val()
            // alert(searchText)
            if (searchText != "") {
                this.fetchRecords()
            }
        },

        fetchRecords: function () {
            var obj = this
            this.groupresult.fetch({
                success: function () {
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.groupresult.models, searchText))


                    if (obj.resultArray.length != searchRecordsPerPage && obj.groupresult.models.length == limitofRecords) {
                        obj.fetchRecords()
                    } else if (obj.groupresult.models.length == 0) {
                        previousPageButtonPressed()

                    } else if (obj.groupresult.models.length < limitofRecords && obj.resultArray.length == 0 && skipStack.length == 1) {
                        $('#not-found').html(App.languageDict.attributes.No_data_found);
                        $("#selectAllButton").hide()


                    } else {
                        var ResultCollection = new Backbone.Collection();
                        if (obj.resultArray.length > 0) {
                            ResultCollection.set(obj.resultArray)
                            var SearchSpans = new App.Views.GroupsTable({
                                collection: ResultCollection
                            })
                            SearchSpans.resourceids = obj.resourceids
                            SearchSpans.render()
                            $('.body').append(SearchSpans.el)
                        }
                        else{
                            $('#not-found').html(App.languageDict.attributes.No_data_found);
                                $('#not-found').show()
                        }

                    }
                }
            })

        },
        changeDirection : function (){
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            if(directionOfLang.toLowerCase()==="right")
            {
                var library_page = $.url().data.attr.fragment;
                if(library_page=="courses")
                {
                    $('#parentLibrary').addClass('addResource');
                    $('.btable').addClass('addResource');
                }
            }
            else
            {
                $('#parentLibrary').removeClass('addResource');
                $('.btable').removeClass('addResource');
            }
        },
        searchInArray: function (resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount

            if (searchText != "") {
                _.each(resourceArray, function (result) {
                    if (result.get("name") != null) {
                        skip++
                        if (result.get("name").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
                            if (resultArray.length < searchRecordsPerPage) {
                                resultArray.push(result)
                            } else {
                                enablenext = 1
                                skip--
                            }
                        } else if (resultArray.length >= searchRecordsPerPage) {
                            skip--
                        }
                    }
                })

            }
            return resultArray
        }

    })

});

$(function() {

    App.Views.QuizView = Backbone.View.extend({

        template: $('#make-Quiz').html(),
        vars: {},
        quizQuestions: null,
        questionOptions: null,
        answers: null,
        currentQuestion: null,
        events: {
            "click .EditQuestiontoView": "EditQuestiontoView",
            'click #delete-quiz-question': "deleteQuestion",
            "click #cancel-edit-question": function(e) {
                this.render()
                this.displayQuestionsInView()
            },
            "click #cancel-quiz": function() {
                Backbone.history.navigate('level/view/' + this.levelId + '/' + this.revId, {
                    trigger: true
                })
            },
            "click #cancel-new-question": function() {
                $('textarea#quizQuestion').val("")
                $('#option1').val("")
                $('#option2').val("")
                $('#option3').val("")
                $('#option4').val("")
                $('#option5').val("")
                $('input[name=options]:checked').each(function() {
                    this.checked = false;
                });
            },
            "click #save-new-question": function(e) {
                this.savequestion()
            },
            "click #save-edit-question": function(e) {
                this.savequestion()
                this.render()
                this.displayQuestionsInView()
            },
            "click #save-quiz": function(e) {
                var cstep = new App.Models.CourseStep({
                    "_id": this.levelId,
                    "_rev": this.revId
                })
                cstep.fetch({
                    async: false
                })
                cstep.set("questions", this.quizQuestions)
                cstep.set("qoptions", this.questionOptions)
                cstep.set("answers", this.answers)
                var that = this
                cstep.save(null, {
                    success: function(cstepModel, modelRev) {
                        alert(App.languageDict.attributes.Quiz_Saved_Success)
                        Backbone.history.navigate('level/view/' + modelRev.id + '/' + modelRev.rev, {
                            trigger: true
                        })
                    }
                })
            }
        },
        savequestion: function(e) {
            if (!this.validQuestionAndOptions()) {
                alert(App.languageDict.attributes.Invalid_Inputs)
            } else {
                this.saveQuestionAndOptions()
                $("#question-no").html("Question :")
                $('textarea#quizQuestion').val("")
                $('#option1').val("")
                $('#option2').val("")
                $('#option3').val("")
                $('#option4').val("")
                $('#option5').val("")
                $('input[name=options]:checked').each(function() {
                    this.checked = false;
                });
            }
        },
        displayQuestionInView: function(questionNo) {
            var number = questionNo
            number++
            $("#question-no").html("Question " + number + ':')
            $('textarea#quizQuestion').val(this.quizQuestions[questionNo])
            $('#option1').val(this.questionOptions[questionNo * 5])
            $('#option2').val(this.questionOptions[questionNo * 5 + 1])
            $('#option3').val(this.questionOptions[questionNo * 5 + 2])
            $('#option4').val(this.questionOptions[questionNo * 5 + 3])
            $('#option5').val(this.questionOptions[questionNo * 5 + 4])
            $('input[name=options]:checked').each(function() {
                this.checked = false;
            });
            var answer = this.questionOptions.indexOf(this.answers[questionNo])
            if (answer >= 0) {
                var rem = answer % 5;
                var radios = document.getElementsByName('options')
                radios[rem].checked = true
            }
        },
        saveQuestionAndOptions: function() {
            this.quizQuestions[this.currentQuestion] = $('textarea#quizQuestion').val()
            this.questionOptions[this.currentQuestion * 5] = $('#option1').val()
            this.questionOptions[this.currentQuestion * 5 + 1] = $('#option2').val()
            this.questionOptions[this.currentQuestion * 5 + 2] = $('#option3').val()
            this.questionOptions[this.currentQuestion * 5 + 3] = $('#option4').val()
            this.questionOptions[this.currentQuestion * 5 + 4] = $('#option5').val()
            this.answers[this.currentQuestion] = $('#' + $('input[name=options]:checked').val()).val()
            this.displayQuestionsInView()
        },
        displayQuestionsInView: function() {
            $('#listofquestions').html('')
            for (var questionNumber = 0; questionNumber < this.quizQuestions.length; questionNumber++) {
                this.AddQuestiontoView(questionNumber)
            }
            this.currentQuestion = this.quizQuestions.length
        },
        AddQuestiontoView: function(questionNumber) {
            var html = '<tr><td colspan="6"><h6>'+App.languageDict.attributes.Question+' ' + (questionNumber + 1) + '&nbsp&nbsp' +
                '<a name=' + questionNumber + ' class="EditQuestiontoView btn btn-info">'+App.languageDict.attributes.EditLabel+'</a>&nbsp&nbsp' +
                '<button value="' + questionNumber + '" class="btn btn-danger" id="delete-quiz-question" >'+App.languageDict.attributes.DeleteLabel+'</button>' +
                '</h6>' + this.quizQuestions[questionNumber] + '</td></tr>'
            html += '<tr>'
            html += '<td><b>'+App.languageDict.attributes.Options+'</b></td>'
            html += '<td>' + this.questionOptions[questionNumber * 5] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 1] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 2] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 3] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 4] + '</td>'
            html += '<td><b>' + this.answers[questionNumber] + '<b></td>'
            html += '</tr>'
            html += '<tr><td colspan="7"><div id="' + questionNumber + '"></div></td></tr>'
            $('#listofquestions').append(html)

        },
        EditQuestiontoView: function(e) {
            this.currentQuestion = e.currentTarget.name
            this.displayQuestionInView(this.currentQuestion)
            $('#question-div').appendTo("#" + this.currentQuestion);
            $('#save-edit-question').show()
            $('#cancel-edit-question').show()

            $('#save-new-question').hide()
            $('#cancel-new-question').hide()
        },
        deleteQuestion: function(e) {
            this.currentQuestion = e.currentTarget.value
            this.quizQuestions.splice(this.currentQuestion, 1);
            this.questionOptions.splice(this.currentQuestion * 5, 5)
            this.answers.splice(this.currentQuestion, 1)
            this.render()
            this.displayQuestionsInView()
        },
        validQuestionAndOptions: function() {
            var check = 0
            if (typeof $('textarea#quizQuestion').val() === 'undefined' || $('textarea#quizQuestion').val() == '') {
                return false
            } else if (typeof $('#option1').val() === 'undefined' || $('#option1').val() == '') {
                return false
            } else if (typeof $('#option2').val() === 'undefined' || $('#option2').val() == '') {
                return false
            } else if (typeof $('#option3').val() === 'undefined' || $('#option3').val() == '') {
                return false
            } else if (typeof $('#option4').val() === 'undefined' || $('#option4').val() == '') {
                return false
            } else if (typeof $('#option5').val() === 'undefined' || $('#option5').val() == '') {
                return false
            } else if (typeof $('input[name=options]:checked').val() === 'undefined' || $('input[name=options]:checked').val() == '') {
                return false
            } else {
                return true
            }
        },
        initialize: function() {
            this.quizQuestions = new Array()
            this.questionOptions = new Array()
            this.answers = new Array()
            this.currentQuestion = 0
        },
        render: function() {
            var obj = this
            this.vars.courseTitle = this.ltitle;
            this.vars.languageDict=App.languageDict;
            this.$el.html(_.template(this.template, this.vars))
            $('#save-edit-question').hide()
            $('#cancel-edit-question').hide()

        }
    })

});

$(function() {

    App.Views.takeQuizView = Backbone.View.extend({
        Questions: {},
        Optns: {},
        Score: 0,
        Correctanswers: {},
        Givenanswers: new Array(),
        index: -1,
        TotalCount: 0,
        tagName: 'form',
        id: 'questionForm',
        mymodel: null,
        events: {
            "click #exitPressed": function(e) {
                $('div.takeQuizDiv').hide()
                document.getElementById('cont').style.opacity = "1";
                document.getElementById('nav').style.opacity = "1";
            },
            "click #finishPressed": function(e) {
                $('div.takeQuizDiv').hide()
                location.reload()
                document.getElementById('cont').style.opacity = "1";
                document.getElementById('nav').style.opacity = "1";

            },

            "click #nextPressed": function(e) {
                if ($("input:radio[name='optn']:checked").val() != undefined) {
                    this.Givenanswers.push(decodeURI($("input:radio[name='optn']:checked").val()))
                    if (this.Givenanswers[this.index] == this.Correctanswers[this.index]) {
                        this.Score++
                    }
                    this.renderQuestion()
                } else {
                    alert(App.languageDict.attributes.No_Option_Selected)
                }
            }
        },


        initialize: function() {
            this.Correctanswers = this.options.answers
            this.Questions = this.options.questions
            this.Optns = this.options.options
            this.stepId = this.options.stepId
            this.TotalCount = this.Questions.length
            this.pp = parseInt(this.options.passP)
            this.myModel = this.options.resultModel
            this.stepindex = this.options.stepIndex
            this.Givenanswers = []
        },

        renderQuestion: function() {
            if ((this.index + 1) != this.TotalCount) {
                this.index++
                var temp = this.index * 5
                this.$el.html('&nbsp')
                this.$el.append('<div class="Progress"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                this.$el.append('<div class="quizText"><textarea disabled>' + this.Questions[this.index] + '</textarea> </div>')
                o0 = encodeURI(this.Optns[temp])
                o1 = encodeURI(this.Optns[temp + 1])
                o2 = encodeURI(this.Optns[temp + 2])
                o3 = encodeURI(this.Optns[temp + 3])
                o4 = encodeURI(this.Optns[temp + 4])
                this.$el.append('<div class="quizOptions"><input type="radio" name="optn" value=' + o0 + '>' + this.Optns[temp] + '<br><input type="radio" name="optn" value=' + o1 + '>' + this.Optns[temp + 1] + '<br>' + '<input type="radio" name="optn" value=' + o2 + '>' + this.Optns[temp + 2] + '<br>' + '<input type="radio" name="optn" value=' + o3 + '>' + this.Optns[temp + 3] + '<br>' + '<input type="radio" name="optn" value=' + o4 + '>' + this.Optns[temp + 4] + '</div>');
                this.$el.append('<div class="quizActions" ><button class="btn btn-danger" id="exitPressed">'+App.languageDict.attributes.Exit+'</button><button class="btn btn-primary" id="nextPressed">'+App.languageDict.attributes.Next+'</button></div>')
            } else {
                this.$el.html('&nbsp')
                var quizScore = (Math.round((this.Score / this.TotalCount) * 100))
                this.$el.append('<div class="quizText"><h4>'+App.languageDict.attributes.You_Scored +' '+ Math.round((this.Score / this.TotalCount) * 100) + '%<h4></div>')
                this.$el.append('<div class="quizActions" ><button class="btn btn-info" id="finishPressed">'+App.languageDict.attributes.Finish+'</button></div>')
                var sstatus = this.myModel.get('stepsStatus')
                var sp = this.myModel.get('stepsResult')
                if (this.pp <= quizScore) {
                    sstatus[this.stepindex] = "1"
                    this.myModel.set('stepsStatus', sstatus)
                }
                sp[this.stepindex] = quizScore.toString()
                this.myModel.set('stepsResult', sp)

                this.myModel.save(null, {
                    success: function(res, revInfo) {
                    },
                    error: function() {
                        console.log("Not Saved")
                    }

                });

                if (this.pp <= quizScore) {
                    this.$el.append('</BR><p>'+App.languageDict.attributes.Course_Pass_Msg+'</p>')
                } else {
                    this.$el.append('</BR><p>'+App.languageDict.attributes.Course_Failure_Msg+'</p>')
                }

            }
        },

        start: function() {
            $('div.takeQuizDiv').show()
            // this.animateIn()
            this.renderQuestion()
        },

        render: function() {
            document.getElementById('cont').style.opacity = "0.1";
            document.getElementById('nav').style.opacity = "0.1";
            this.start()
        }


    })

});

$(function() {

    App.Views.LevelForm = Backbone.View.extend({

        className: "form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",

            "click #retrunBack": function(e) {
                history.back()
            },
            "click #addresources": function(e) {
                this.addResource = true
                this.setForm()
            }
        },

        render: function() {

            // members is required for the form's members field
            var levelForm = this
            // create the form
            this.form = new Backbone.Form({
                model: levelForm.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['courseId'].$el.hide()
            this.form.fields['questions'].$el.hide()
            this.form.fields['qoptions'].$el.hide()
            this.form.fields['answers'].$el.hide()
            this.form.fields['resourceId'].$el.hide()
            this.form.fields['resourceTitles'].$el.hide()
            // give the form a submit button
            var button = ('<a class="btn btn-success" id="retrunBack"> '+App.languageDict.attributes.Back+' </button>')
            button += ('<a class="btn btn-success" id="formButton">'+App.languageDict.attributes.Save+'</button>')
            button += ('<a class="btn btn-success" id="addresources">'+App.languageDict.attributes.Add_Resource+'</button>')
            this.$el.append(button)

        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var that = this
            this.model.once('sync', function() {
                var id = that.model.get("id")
                var rid = that.model.get("rev")
                var title = that.model.get("title")
                // Adding a Step to all the member progress course
                if (that.edit != true) {
                    var allcrs = new App.Collections.StepResultsbyCourse()
                    allcrs.courseId = that.model.get("courseId")
                    allcrs.fetch({
                        success: function() {
                            allcrs.each(function(m) {
                                var sids = m.get("stepsIds")
                                var sresults = m.get("stepsResult")
                                var sstatus = m.get("stepsStatus")
                                sids.push(that.model.get("id"))
                                sresults.push("0")
                                sstatus.push("0")
                                m.set("stepsIds", sids)
                                m.set("stepsResult", sresults)
                                m.set("stepsStatus", sstatus)
                                m.save()
                            })
                        }
                    })
                    if (that.addResource) {
                        window.location.href = '#search-bell/' + id + '/' + rid
                    } else {
                        Backbone.history.navigate('course/manage/' + that.model.get("courseId"), {
                            trigger: true
                        })
                    }
                } else {
                    Backbone.history.navigate('level/view/' + id + '/' + rid, {
                        trigger: true
                    })
                }
            })
            // Put the form's input into the model in memory
            this.form.commit()
            // Send the updated model to the server
            if(this.model.get("title") == undefined || $.trim(this.model.get("title"))  == "") {
                alert(App.languageDict.attributes.Title_Error)
            }
            else if (this.model.get("description") == undefined || $.trim(this.model.get("description"))  == "") {
                alert(App.languageDict.attributes.Description_Error)
            }
           /* else if (this.model.get("allowedErrors") == undefined || $.trim(this.model.get("allowedErrors"))  == "" || isNaN(this.model.get("allowedErrors"))) {
                alert(App.languageDict.attributes.Invalid_AllowedErrors)}*/
             else if (isNaN(this.model.get("step"))) {
                alert(App.languageDict.attributes.InvalidStepNumber)
            } else {
                if (!this.edit) {
                    this.model.set("questions", null)
                    this.model.set("answers", null)
                    this.model.set("qoptions", null)
                    this.model.set("resourceId", [])
                    this.model.set("resourceTitles", [])
                    //Checking that level added to the user may not already exist in the data base
                } else {
                    this.model.set("questions", this.ques)
                    this.model.set("answers", this.ans)
                    this.model.set("qoptions", this.opt)
                    this.model.set("resourceId", this.res)
                    this.model.set("resourceTitles", this.rest)
                }
                levels = new App.Collections.CourseLevels()
                levels.groupId = this.model.get("courseId")
                levels.fetch({
                    success: function() {
                        levels.sort()
                        var done = true

                        if (that.edit) {
                            if (that.previousStep != that.model.get("step")) {
                                levels.each(function(step) {
                                    if (step.get("step") == that.model.get("step"))
                                        done = false
                                })
                            }
                        } else {
                            levels.each(function(step) {
                                if (step.get("step") == that.model.get("step")) {
                                    done = false
                                }
                            })
                        }

                        if (done)
                        {
                            that.model.set("title", $.trim(that.model.get("title")));
                            that.model.set("description", $.trim(that.model.get("description")));
                            that.model.save()
                        }
                        else
                            alert(App.languageDict.attributes.DuplicateSteps)

                    }
                })
            }

        }


    })

});

$(function() {

    App.Views.LevelDetail = Backbone.View.extend({


        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click .remover": function(e) {
                var that = this
                var rid = e.currentTarget.value
                var rtitle = this.model.get("resourceTitles")
                var rids = this.model.get("resourceId")
                var index = rids.indexOf(rid)
                rids.splice(index, 1)
                rtitle.splice(index, 1)
                this.model.set("resourceId", rids)
                this.model.set("resourceTitles", rtitle)
                this.model.save(null, {
                    success: function(responseModel, responseRev) {
                        that.model.set("_rev", responseRev.rev)
                        $('#' + rid.replace("\.", "\\.")).remove();

                    }
                })
            },
            "click .removeAttachment": function(e) {
                var that = this
                var attachmentNo = e.currentTarget.value
                $.ajax({
                    url: '/coursestep/' + this.model.get('_id') + '/' + _.keys(this.model.get('_attachments'))[attachmentNo] + '?rev=' + this.model.get("_rev"),
                    type: 'DELETE',
                    success: function(response, status, jqXHR) {
                        alert(App.languageDict.attributes.Successfully_Deleted)
                        App.Router.ViewLevel(that.model.get('_id'), that.model.get("_rev"))
                    }
                })

            },
            "click .levelResView": function(e) {
                var rid = e.currentTarget.attributes[0].value
                var levelId = this.model.get("_id")
                var revid = this.model.get("_rev")
                Backbone.history.navigate('resource/atlevel/feedback/' + rid + '/' + levelId + '/' + revid, {
                    trigger: true
                })

            },
            "click #addInstructions": function(e) {
                var fileinput = document.forms["fileAttachment"]["_attachments"]
                fileinput.click();
            },
            "change #_attachments": function(e) {
                var that = this
                var img = $('input[type="file"]')
                var extension = img.val().split('.')
                if (img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt' && extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' && extension[(extension.length - 1)] != 'png' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'mov' && extension[(extension.length - 1)] != 'mp3') {
                    alert(App.languageDict.attributes.Invalid_Attachment)
                    return
                }
                //this.model.unset('_attachments')
                if ($('input[type="file"]').val()) {
                    this.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                } else {
                    ////no attachment
                    alert(App.languageDict.attributes.No_Attachment)
                }
                this.model.on('savedAttachment', function() {
                    /////Attatchment successfully saved
                    alert(App.languageDict.attributes.Assignment_Submit_Success)
                    App.Router.ViewLevel(that.model.get('_id'), that.model.get("_rev"))
                    //                	this.$el.html('')
                    //                	this.model.fetch({async:false})
                    //                	this.render()
                }, this.model)

            }
        },
        render: function() {
            var i = 0
            var rtitle = this.model.get("resourceTitles")
            var rid = this.model.get("resourceId")
            var stepResources = '</BR><table class="table table-striped">'
            if (this.model.get("resourceTitles")) {
                for (i = 0; i < this.model.get("resourceTitles").length; i++) {
                    var r = new App.Models.Resource({
                        "_id": rid[i]
                    })
                    r.fetch({
                        async: false
                    })
                    if (!(r.get("hidden"))) {
                        if (r.get("_attachments")) {
                            stepResources = stepResources + ("<tr id='" + rid[i] + "'><td>" + rtitle[i] + "</td><td><a class='levelResView btn btn-info' href='/apps/_design/bell/bell-resource-router/index.html#open/" + rid[i] + "/"+rtitle[i]+"'  target='_blank' value='" + rid[i] + "'><i class='icon-eye-open'></i>"+App.languageDict.attributes.View+"</a></td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>"+App.languageDict.attributes.Remove+" </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                        } else {
                            stepResources = stepResources + ("<tr id='" + rid[i] + "'><td>" + rtitle[i] + "</td><td>"+App.languageDict.attributes.No_Attachment+"</td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>"+App.languageDict.attributes.Remove+" </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                        }
                    }
                }
                stepResources = stepResources + '</table>'
                this.$el.append(stepResources)
                this.$el.append('<br/><br/><B>'+App.languageDict.attributes.Instructions+'</B>&nbsp;&nbsp;<a class="btn btn-success"  style="" id="addInstructions">'+App.languageDict.attributes.Add+'</a><br/><br/>')
                var uploadString = '<form method="post" id="fileAttachment">'
                uploadString = uploadString + '<input type="file" name="_attachments" id="_attachments" multiple="multiple" style="display: none" /> '
                uploadString = uploadString + '<input class="rev" type="hidden" name="_rev"></form>'
                this.$el.append(uploadString)
                if (!this.model.get('_attachments')) {
                    return
                }
                var tableString = '<table class="table table-striped">'
                for (i = 0; i < _.keys(this.model.get('_attachments')).length; i++) {

                    var attachmentURL = '/coursestep/' + this.model.get('_id') + '/'
                    var attachmentName = ''
                    if (typeof this.model.get('_attachments') !== 'undefined') {
                        attachmentURL = attachmentURL + _.keys(this.model.get('_attachments'))[i]
                        attachmentName = _.keys(this.model.get('_attachments'))[i]
                    }

                    tableString = tableString + ("<tr><td>" + attachmentName + "</td><td><a class='btn btn-info' href='" + attachmentURL + "'  target='_blank' ><i class='icon-eye-open'></i>"+App.languageDict.attributes.View+"</a></td><td><button class='removeAttachment btn btn-danger' value='" + i + "'>"+App.languageDict.attributes.Remove+" </button><input type='hidden'/>")
                }
                tableString = tableString + '</table>'
                this.$el.append(tableString)

            }
        }

    })

});

$(function() {
    App.Views.LevelsTable = Backbone.View.extend({

        tagName: "table",

        changedSteps: null,

        className: "btable btable-striped",

        events: {
            "click #Rearrange": function(e) {
                if ($("input[type='radio']").is(":visible")) {
                    $("#Rearrange").text(App.languageDict.attributes.Rearrange);
                    for (var i = 0; i < this.changedSteps.length; i++) {
                        this.collection.models[this.changedSteps[i]].save()
                    }
                    this.changedSteps.remove
                    $("input[type='radio']").hide()
                    $("#moveup").hide()
                    $("#movedown").hide()
                } else {
                    $("#Rearrange").text(App.languageDict.attributes.Save);
                    $("input[type='radio']").show()
                    $("#moveup").show()
                    $("#movedown").show()
                }
            },
            "click #moveup": function(e) {
                var radio;
                var i = 0;
                var radioLevels = document.getElementsByName('stepRow');
                for (var j = 0; j < radioLevels.length; j++) {
                    if (radioLevels[j].checked) {
                        radio = radioLevels[j].parentNode.parentNode;
                        if (j > 0) {
                            this.collection.models[j].set('step', j)
                            this.collection.models[j - 1].set('step', j + 1)
                            this.changeColumnHtml(this.collection.models[j].get('step'), this.collection.models[j].get('title'), radioLevels[j].parentNode, true)
                            this.changeColumnHtml(this.collection.models[j - 1].get('step'), this.collection.models[j - 1].get('title'), radioLevels[j - 1].parentNode, false)
                            var tempModel = this.collection.models[j]
                            this.collection.models[j] = this.collection.models[j - 1]
                            this.collection.models[j - 1] = tempModel
                            if (this.changedSteps.indexOf(j) == -1) {
                                this.changedSteps.push(j)
                            }
                            if (this.changedSteps.indexOf(j - 1) == -1) {
                                this.changedSteps.push(j - 1)
                            }
                        }
                        break;
                    }
                }

                var prev = radio.previousSibling;
                var par = radio.parentNode;
                if (prev) {

                    par.removeChild(radio);
                    par.insertBefore(radio, prev);
                }
            },
            "click #movedown": function(e) {
                var radio;
                var i = 0;
                var radioLevels = document.getElementsByName('stepRow');
                for (var j = 0; j < radioLevels.length; j++) {
                    if (radioLevels[j].checked) {
                        radio = radioLevels[j].parentNode.parentNode;
                        if (j < radioLevels.length - 1) {
                            this.collection.models[j].set('step', j + 2)
                            this.collection.models[j + 1].set('step', j + 1)
                            this.changeColumnHtml(this.collection.models[j].get('step'), this.collection.models[j].get('title'), radioLevels[j].parentNode, true)
                            this.changeColumnHtml(this.collection.models[j + 1].get('step'), this.collection.models[j + 1].get('title'), radioLevels[j + 1].parentNode, false)
                            var tempModel = this.collection.models[j]
                            this.collection.models[j] = this.collection.models[j + 1]
                            this.collection.models[j + 1] = tempModel
                            if (this.changedSteps.indexOf(j) == -1) {
                                this.changedSteps.push(j)
                            }
                            if (this.changedSteps.indexOf(j + 1) == -1) {
                                this.changedSteps.push(j + 1)
                            }
                        }
                        break;
                    }
                }

                var next = radio.nextSibling;
                var par = radio.parentNode;
                if (next.nextSibling) {
                    par.removeChild(radio);
                    par.insertBefore(radio, next.nextSibling);
                } else {
                    par.removeChild(radio);
                    par.appendChild(radio);
                }
            }
        },
        changeColumnHtml: function(stepNo, title, td, check) {

            if (check) {
                $(td).html('<input type="radio" name="stepRow" checked="checked" />&nbsp;&nbsp;'+App.languageDict.attributes.Step+' ' + stepNo + ' : ' + title)
            } else {
                $(td).html('<input type="radio" name="stepRow" />&nbsp;&nbsp;'+App.languageDict.attributes.Step+' ' + stepNo + ' : ' + title)
            }
        },
        addOne: function(model) {
            var that = this
            var lrow = new App.Views.LevelRow({
                model: model
            })
            lrow.on('levelDeleted', function() {
                var stepNo = lrow.model.get("step")
                for (var i = stepNo; i < that.collection.models.length; i++) {
                    that.collection.models[i].set('step', i)
                    that.updateModel(that.collection.models[i])
                }
                alert(App.languageDict.attributes.Step_deleted_Success)
                that.collection.models.splice(stepNo - 1, 1)
                if (that.collection.models.length == 0) {
                    $('#moveup').hide()
                    $('#movedown').hide()
                    $('#Rearrange').hide()
                }
                $("#addstep").attr("onClick", "document.location.href=\'#level/add/" + that.groupId + "/nolevel/" + that.collection.models.length + "\' ");
                location.reload()
            })
            lrow.render()
            this.$el.append(lrow.el)
        },
        updateModel: function(model) {
            model.save({
                success: function() {}
            })
        },
        addAll: function() {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this)
        },
        initialize: function() {
            this.changedSteps = new Array()
        },
        render: function() {
            this.$el.append('<br/><button class="btn btn-success" id="addstep"  onclick = "document.location.href=\'#level/add/' + this.groupId + '/nolevel/' + this.collection.models.length + '\' ">'+App.languageDict.attributes.Add_Step+'</button>')
            if (this.collection.models.length > 0) {
                this.$el.append('&nbsp;&nbsp;&nbsp;<button class="btn btn-success" id="Rearrange" >'+App.languageDict.attributes.Rearrange+'</button><br/><br/>')
            }
            this.$el.append('<button class="btn btn-success" id="moveup" >'+App.languageDict.attributes.Up+'</button>&nbsp;&nbsp;&nbsp;')
            this.$el.append('<button class="btn btn-success" id="movedown" >'+App.languageDict.attributes.Down+'</button>')
            this.addAll()
        }

    })

});

$(function() {

    App.Views.LevelRow = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click .destroyStep": function(e) {
                this.trigger('levelDeleted')
                e.preventDefault()
                var that = this
                var courses = new App.Collections.StepResultsbyCourse()
                courses.courseId = this.model.get("courseId")
                courses.fetch({
                    success: function() {
                        courses.each(function(m) {
                            var stepids = m.get("stepsIds")
                            var stepres = m.get("stepsResult")
                            var stepstatus = m.get("stepsStatus")
                            var index = stepids.indexOf(that.model.get("_id"))
                            stepids.splice(index, 1)
                            stepres.splice(index, 1)
                            stepstatus.splice(index, 1)
                            m.set("stepsIds", stepids)
                            m.set("stepsResult", stepres)
                            m.set("stepsStatus", stepstatus)

                            m.save({
                                success: function() {
                                    
                                }
                            })
                        })
                    }
                })
                this.model.destroy()
                this.remove()

            },
            "click .browse": function(e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-LevelRow").html(),

        initialize: function() {
            //this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON();
            vars.languageDict=App.languageDict;
            this.$el.append(_.template(this.template, vars))
        }

    })

});

$(function() {
    App.Views.MeetUpTable = Backbone.View.extend({

        tagName: "table",

        className: "btable btable-striped",
        roles: null,
        addOne: function(model) {
            var meetupRow = new App.Views.MeetUpRow({
                model: model,
                roles: this.roles
            })
            meetupRow.render()
            this.$el.append(meetupRow.el)
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
        changeDirection : function (){
            if (App.languageDict.get('directionOfLang').toLowerCase()==="right")
            {
                var library_page = $.url().data.attr.fragment;
                if(library_page=="meetups")
                {
                    $('#parentLibrary').addClass('addResource');
                }
            }
            else
            {
                $('#parentLibrary').removeClass('addResource');
            }
        },
        addAll: function() {
            
            this.$el.html("<tr><th>"+languageDict.attributes.Topic+"</th><th colspan='4'>"+languageDict.attributes.action+"</th></tr>")
            var manager = new App.Models.Member({
                _id: $.cookie('Member._id')
            })
            manager.fetch({
                async: false
            })
            this.roles = manager.get("roles")
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this)
            var meetupLength; 
            var context = this
            $.ajax({
                url: '/meetups/_design/bell/_view/count?group=false',
                type: 'GET',
                dataType: "json",
                success: function(json) {
                    //meetupLength = json.rows[0].value //when empty data are fetched it will show undefined error
                    if (context.displayCollec_Resources != true) {
                        var pageBottom = "<tr><td colspan=7>"
                        var looplength = meetupLength / 20

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
            this.addAll();
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        }

    })

});

$(function() {

    App.Views.meetupView = Backbone.View.extend({


        authorName: null,
        tagName: "table",

        className: "btable btable-striped courseSearchResults_Bottom",
        initialize: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            this.$el.html('<h3 colspan="20">'+App.languageDict.attributes.MeetUp+' | ' + this.model.get('title') + '</h3>')
        },
        events: {

            'click  #joinMeetUp': 'joinMeetUp',
            'click #meetupsInvitation': 'MemberInvite'

        },

        MemberInvite: function() {

            $('#invitationdiv').fadeIn(1000)
            document.getElementById('cont').style.opacity = 0.1
            document.getElementById('nav').style.opacity = 0.1
            $('#invitationdiv').show()
            var inviteModel = new App.Models.InviMeetup()
            inviteModel.resId = this.model.get("_id")
            inviteModel.senderId = $.cookie('Member._id')
            inviteModel.type = this.model.get("kind")
            inviteModel.title = this.model.get("title")
            inviteModel.description = this.model.get("description")
            var inviteForm = new App.Views.MeetupInvitation({
                model: inviteModel
            })
            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)

        },
        add: function(model) {
            //Single Author Should not be displayed multiple times on The Screen

        },
        joinMeetUp: function() {

            var UMeetup = new App.Collections.UserMeetups()
            UMeetup.memberId = $.cookie('Member._id')
            UMeetup.meetupId = this.model.get('_id')

            UMeetup.fetch({
                async: false
            })
            if (UMeetup.length > 0) {
                alert(App.languageDict.attributes.Already_Joined_MeetUp)
                return
            }


            var UserMeetUp = new App.Models.UserMeetup()
            UserMeetUp.set('memberId', $.cookie('Member._id'))
            UserMeetUp.set('meetupId', this.model.get('_id'))
            UserMeetUp.set('meetupTitle', this.model.get('title'))
            UserMeetUp.save()
            alert(App.languageDict.attributes.meetUp_Added)
            Backbone.history.navigate('dashboard', {
                trigger: true
            })
        },


        render: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            $('#invitationdiv').hide()
            var meetupInfo = this.model.toJSON()
            var date = new Date(meetupInfo.schedule)
            meetupInfo.schedule = date.toUTCString()

            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Title+'  </b></td><td>' + meetupInfo.title + ' | ' + meetupInfo.category + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Category+' </b></td><td>' + meetupInfo.category + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Description+' </b></td><td>' + meetupInfo.description + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Location+' </b></td><td>' + meetupInfo.meetupLocation + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Date+' </b></td><td>' + meetupInfo.startDate + ' --- ' + meetupInfo.endDate + '</td></tr>')
            this.$el.append('<tr><td><b>'+App.languageDict.attributes.Time+' </b></td><td>' + meetupInfo.startTime + ' --- ' + meetupInfo.endTime + '</td></tr>')
            this.$el.append('<tr><td><a class="btn btn-success" id="joinMeetUp">'+App.languageDict.attributes.Join_meetUp+'</a><a  class="btn btn-info marginsOnMeetUp" id="meetupsInvitation">'+App.languageDict.attributes.Invite_Member+'</a><a  class="btn btn-info marginsOnMeetUp" href="#meetups">'+App.languageDict.attributes.Back+'</a></td><td></td></tr>')
        }

    })

});

$(function() {

    App.Views.MeetupDetails = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "table table-striped resourceDetail meetUp_direction",
        sid: null,
        rid: null,
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyMeetupItem": function(e) {

                var vars = this.model.toJSON()
                var mId = $.cookie('Member._id')

                var userMeetups = new App.Collections.UserMeetups()
                userMeetups.memberId = mId
                userMeetups.meetupId = vars._id

                userMeetups.fetch({
                    async: false
                })


                var model;
                while (model = userMeetups.first()) {
                    model.destroy();
                }

                alert(App.languageDict.attributes.MyMeetUps_Removed_Success)
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })


            }

        },
        initialize: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            this.$el.append('<th colspan="2"><h6>'+App.languageDict.attributes.MeetUp_Detail+'</h6></th>')
        },
        render: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var vars = this.model.toJSON()
            var date = new Date(vars.schedule)
            vars.schedule = date.toUTCString()
            

            this.$el.append('<tr><td><b>'+languageDictValue.attributes.Title+'  </b></td><td>' + vars.title + ' | ' + vars.category + '</td></tr>')
            this.$el.append('<tr><td><b>'+languageDictValue.attributes.Category+'  </b></td><td>' + vars.category + '</td></tr>')
            this.$el.append('<tr><td><b>'+languageDictValue.attributes.Description+' </b></td><td>' + vars.description + '</td></tr>')
            this.$el.append('<tr><td><b>'+languageDictValue.attributes.Location+' </b></td><td>' + vars.meetupLocation + '</td></tr>')
            this.$el.append('<tr><td><b>'+languageDictValue.attributes.Date+' </b></td><td>' + vars.startDate + ' --- ' + vars.endDate + '</td></tr>')
            this.$el.append('<tr><td><b>'+languageDictValue.attributes.Time+' </b></td><td>' + vars.startTime + ' --- ' + vars.endTime + '</td></tr>')

            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyMeetupItem">'+languageDictValue.attributes.Unjoin+'</button></td></tr>')

        }

    })

});

$(function() {

    App.Views.MeetUpRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {},

        template: $("#template-MeetUpRow").html(),

        initialize: function(e) {
            //this.model.on('destroy', this.remove, this)
            this.roles = e.roles
        },

        render: function() {

            var vars = this.model.toJSON();

            if (this.roles.indexOf("Manager") != -1) {
                vars.isAdmin = 1;
                vars.languageDict=App.languageDict;

            } else {
                vars.isAdmin = 0;
                vars.languageDict=App.languageDict;
            }


            if (vars.creator && vars.creator == $.cookie('Member._id')) {
                vars.creator = 1
                vars.languageDict=App.languageDict;
            } else {
                vars.creator = 0
                vars.languageDict=App.languageDict;
            }

            if (vars._id != '_design/bell')
                this.$el.append(_.template(this.template, vars))
        }

    })

});

$(function() {

    App.Views.MeetUpForm = Backbone.View.extend({

        className: "form",
        id: 'meetUpForm',
        prevmemlist: null,
        saved: null,
        btnText: 'Save',
        events: {
            "click #MeetUpformButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #InviteMembers": "MemberInvite",
            "click #MeetUpcancel": function() {
                window.history.back()
            }

        },
        MemberInvite: function() {

            var model = this.model

            if (!model.get('id')) {
                this.setForm()
                return
            }
            if ($("textarea[name='description']").val().length > 0) {

                $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
                var inviteModel = new App.Models.InviMeetup()
                inviteModel.resId = model.get("id")
                inviteModel.senderId = $.cookie('Member._id')
                inviteModel.type = model.get("kind")
                inviteModel.title = model.get("title")
                inviteModel.description = model.get("description")
                var inviteForm = new App.Views.MeetupInvitation({
                    model: inviteModel
                })
                inviteForm.render()
                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el);


            } else {
                alert(App.languageDict.attributes.Prompt_MeetUp_Location_First)
            }
        },
        render: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            $('#invitationdiv').hide()
            // members is required for the form's members field

            if (!this.model.get('_id'))
                this.$el.append('<h3>'+languageDictValue.attributes.start_new_meetUp+'</h3>')
            else {
                this.$el.append('<h3>'+languageDictValue.attributes.Edit_MeetUp+' | ' + this.model.get('title') + '</h3>')
                this.btnText = languageDictValue.attributes.Update
            }


            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            if (this.btnText != languageDictValue.attributes.Update)
                this.form.fields['Day'].$el.hide();

            var $sbutton = $('<a class="btn btn-success" id="MeetUpformButton">' + this.btnText + '</a>')

            var $ubutton = $('<a class="btn btn-success" id="formButton">'+languageDictValue.attributes.Cancel+'</a>')
            // var $button = $('<a class="btn btn-success" id="meetInvitation">Invite Member</button><a role="button" id="ProgressButton" class="btn" href="#course/report/' + this.model.get("_id") + '/' +this.model.get("name") + '"> <i class="icon-signal"></i> Progress</a>')
            this.$el.append($sbutton)
            if (this.btnText != languageDictValue.attributes.Update)
                this.$el.append('<a class="btn btn-info" id="InviteMembers">'+languageDictValue.attributes.Invite_Member+'</a>')

            this.$el.append("<a class='btn btn-danger' id='MeetUpcancel'>"+languageDictValue.attributes.Cancel+"</a>")
            

            applyCorrectStylingSheet(directionOfLang);

            /*  var picker = new Backbone.UI.TimePicker({
             model: this.model,
             content: 'Time',
             })
             */
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },
        setForm: function() {

            if (this.model.get('id')) {
                alert(App.languageDict.attributes.Duplicate_Save)
                return
            }

            var that = this
            // Put the form's input into the model in memory
            this.form.commit()

            if ($.trim(this.model.get("title")).length == 0) {
                alert(App.languageDict.attributes.MeetUp_Title_Missing)
            } else if (this.model.get("description").length == 0) {
                alert(App.languageDict.attributes.MeetUp_Desc_Missing)
            } else if (this.model.get("meetupLocation").length == 0) {
                alert(App.languageDict.attributes.Missing_MeetUp_Location)
            } else {

                this.model.set('creator', $.cookie('Member._id'))
                var titleOfMeetup = this.model.get("title");
                this.model.set("title", $.trim(titleOfMeetup))
                this.model.save(null, {
                    success: function(responce) {


                        if (that.btnText == 'Save') {
                            var userMeetup = new App.Models.UserMeetup()
                            userMeetup.set({
                                memberId: $.cookie('Member._id'),
                                meetupId: responce.get('id'),
                                meetupTitle: responce.get('title')

                            })
                            userMeetup.save()
                            that.MemberInvite(responce)
                        } else {
                            var userMeetup = new App.Collections.UserMeetups()
                            userMeetup.meetupId = responce.get('id')
                            userMeetup.memberId = $.cookie('Member._id')
                            userMeetup.fetch({
                                async: false
                            })
                            if (res = userMeetup.first()) {
                                res.set('meetupTitle', responce.get('title'))
                                res.save()
                                alert(App.languageDict.attributes.Updated_Successfully)

                            }
                            Backbone.history.navigate('meetups', {
                                trigger: true
                            })
                        }

                    }
                })



            }
        }


    })

});

$(function() {
	App.Views.MembersTable = Backbone.View.extend({

		tagName: "table",

		className: "btable btable-striped",

		addOne: function(model) {
			var memberRow = new App.Views.MemberRow({
				model: model
			})
			memberRow.isadmin = this.isadmin
			memberRow.community_code = this.community_code;
			memberRow.render()
			this.$el.append(memberRow.el)
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
			this.$el.html("<tr><th>"+App.languageDict.attributes.Photo+"</th><th>"+App.languageDict.attributes.Last_Name+"</th><th>"+App.languageDict.attributes.First_Name+"</th><th>"+App.languageDict.attributes.Visits+"</th><th>"+App.languageDict.attributes.Email+"</th><th>"+App.languageDict.attributes.Bell_Email+"</th><th>"+App.languageDict.attributes.action+"</th></tr>")
			// @todo this does not work as expected, either of the lines
			// _.each(this.collection.models, this.addOne())
			this.collection.each(this.addOne, this)
			var groupLength;
			var context = this
			$.ajax({
				url: '/members/_design/bell/_view/count?group=false',
				type: 'GET',
				dataType: "json",
				success: function(json) {
					memberLength = json.rows[0].value
					if (context.displayCollec_Resources != true) {
						var pageBottom = "<tr><td colspan=7>"
						var looplength = memberLength / 20

						for (var i = 0; i < looplength; i++) {
							if (i == 0)
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">'+App.languageDict.attributes.Home+'</a>&nbsp&nbsp'
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
			this.addAll()
		}

	})

});

$(function() {
    App.Views.MembersView = Backbone.View.extend({

        //     tagName: "",
        //     className: "",
        searchText: "",
        searchCommunity: "",
        
        events: {
            "click .Search": function(e) {
            	if($('#selectCommunity').length) this.renderTable($('#selectCommunity').val(), $('#searchText').val().toLowerCase())
                else this.renderTable('', $('#searchText').val().toLowerCase())
            },
		    "change #selectCommunity": function(e) {
		    	this.renderTable($('#selectCommunity').val(), '')
		    }
        },

        render: function() {
            this.$el.append('<div id="parentMembers"><h3 id="membersSearchHeading"><input id="searchText" type="Text" placeholder=""><button id="searchButtonOnMembers" class="Search btn btn-info">'+App.languageDict.attributes.Search+'</button></h3><h3>'+App.languageDict.attributes.Members+'<a id="AddNewMember" style="margin-left:20px" class="btn btn-success" href="#member/add">'+App.languageDict.attributes.Add+' '+App.languageDict.attributes.New+' '+App.languageDict.attributes.Member+'</a></h3></div>');
            this.$el.append('<div id="memberTable"></div>');
            this.renderTable(searchCommunity, searchText);
        },
        renderTable: function(searchCommunity, searchText) {
            App.startActivityIndicator()
            var that = this
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()


            code = cofigINJSON.code
            nationName = cofigINJSON.nationName
            var roles = App.Router.getRoles()
            var members = new App.Collections.Members()
            members.searchText = searchText
            if(searchCommunity == '') searchCommunity = code;
            members.searchCommunity = searchCommunity
            members.fetch({
                success: function(response) {
                    membersTable = new App.Views.MembersTable({
                        collection: response
                    })
                  //  membersTable.community_code = code + nationName.substring(3, 5)
                    membersTable.community_code = code;

                    if (roles.indexOf("Manager") > -1) {
                        membersTable.isadmin = true
                    } else {
                        membersTable.isadmin = false
                    }
                    membersTable.render();
                    $('#memberTable').html(membersTable.el)
                    App.stopActivityIndicator()
                },
                error: function() {
                    App.stopActivityIndicator()
                }
            })

        },

        changeDirection : function () {

            var library_page = $.url().data.attr.fragment;
            if (library_page == "members") {
                if(App.languageDict.get('directionOfLang').toLowerCase()==="right") {
                    $('#parentMembers').addClass('addResource');
                    $('#memberTable').addClass('addResource');
                }

            else
                {
                    $('#parentMembers').removeClass('addResource');
                    $('#memberTable').removeClass('addResource');
                }
            }
        }

    })

});

$(function() {

    App.Views.MemberRow = Backbone.View.extend({

        tagName: "tr",

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },

        createJsonlog: function(logdb, logdate, gender) {
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (gender == 'Male') {
                docJson.male_deleted_count = parseInt(((docJson.male_deleted_count) ? docJson.male_deleted_count : 0)) + 1;
                docJson.female_deleted_count = parseInt(((docJson.female_deleted_count) ? docJson.female_deleted_count : 0)) + 0;
            } else {
                docJson.female_deleted_count = parseInt(((docJson.female_deleted_count) ? docJson.female_deleted_count : 0)) + 1;
                docJson.male_deleted_count = parseInt(((docJson.male_deleted_count) ? docJson.male_deleted_count : 0)) + 0;
            }
            docJson.community = App.configuration.get('code'),
                logdb.put(docJson, logdate, function(err, response) {
                    if (!err) {
                    } else {
                        console.log(err);
                    }
                });
        },

        UpdatejSONlog: function(logdb, logdate, logModel, gender) {
            if (gender == 'Male') {
                logModel.male_deleted_count = parseInt(((logModel.male_deleted_count) ? logModel.male_deleted_count : 0)) + 1;
                logModel.female_deleted_count = parseInt(((logModel.female_deleted_count) ? logModel.female_deleted_count : 0)) + 0;
            } else {
                logModel.female_deleted_count = parseInt(((logModel.female_deleted_count) ? logModel.female_deleted_count : 0)) + 1;
                logModel.male_deleted_count = parseInt(((logModel.male_deleted_count) ? logModel.male_deleted_count : 0)) + 0;
            }
            logModel.community = App.configuration.get("code");

            logdb.put(logModel, logdate, logModel._rev, function(err, response) { // _id: logdate, _rev: logModel._rev
                if (!err) {
                } else {
                    console.log(err);
                }
            });
        },

        events: {
            "click .destroy": function(e) {
                var languageDictValue;
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                App.languageDict = languageDictValue;
                if(confirm(App.languageDict.attributes.member_delete_confirm)){
                    var that = this;
                    var logdb = new PouchDB('activitylogs');
                    var currentdate = new Date();
                    var logdate = that.getFormattedDate(currentdate);
                    var gender = this.model.get("Gender");
                    logdb.get(logdate, function(err, logModel) {
                        if (!err) {
                            that.UpdatejSONlog(logdb, logdate, logModel, gender);
                        } else {
                            that.createJsonlog(logdb, logdate, gender);
                        }
                    });
                    e.preventDefault()
                    this.model.destroy()
                    this.remove();
                    alert(App.languageDict.attributes.member_Delete_success)
                }
                else
                {
                    Backbone.history.navigate('members')
                }

            },

            "click #deactive": function(e) {

                e.preventDefault()

                var that = this
                this.model.on('sync', function() {
                    // rerender this view

                    //that.render()
                    location.reload();
                })

                this.model.save({
                    status: "deactive"
                }, {
                    success: function() {}
                });

                //  this.model.fetch({async:false})
            },
            "click #active": function(e) {

                e.preventDefault()
                var that = this
                this.model.on('sync', function() {
                    // rerender this view

                    //that.render()
                    location.reload();
                })
                this.model.save({
                    status: "active"
                }, {
                    success: function() { /*this.model.fetch({async:false})*/ }
                });

            },
            "click .browse": function(e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-MemberRow").html(),

        initialize: function() {
            //this.model.on('destroy', this.remove, this)
        },

        render: function() {
            if (!this.model.get("visits")) {
                this.model.set("visits")
            }
            var vars = this.model.toJSON()
            vars.community_code = this.community_code

            if ((this.model.get("_id") == $.cookie('Member._id')) && !this.isadmin) {
                vars.languageDict=App.languageDict;
                vars.showdelete = false
                vars.showedit = true
                vars.showview = true
            } else if (!this.isadmin) {
                vars.languageDict=App.languageDict;
                vars.showdelete = false
                vars.showedit = false
                vars.showview = true
            } else {
                vars.languageDict=App.languageDict;
                vars.showdelete = true
                vars.showedit = true
                vars.showview = true
            }
            vars.src = "img/default.jpg"
            var attchmentURL = '/members/' + this.model.id + '/'
            if (typeof this.model.get('_attachments') !== 'undefined') {
                vars.languageDict=App.languageDict;
                attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                vars.src = attchmentURL
            }
            vars.languageDict=App.languageDict;
            this.$el.html(_.template(this.template, vars))
        }


    })

});

$(function() {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var languageDictValue;
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                if (confirm(languageDictValue.attributes.Confirm_Report)) {
                this.model.destroy()
                event.preventDefault();
                alert(languageDictValue.attributes.Reports_Deleted_Success);
                }
            },
            "click #open": function(event) {
                if (this.model.get("views") == undefined) {
                    this.model.set('views', 1)
                    this.model.save()
                } else {
                    this.model.set('views', this.model.get("views") + 1)
                    this.model.save()
                }

            },
            "click #commentButton": function(e) {
                var languageDictValue;
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                App.languageDict = languageDictValue;
                var directionOfLang = App.languageDict.get('directionOfLang');
                var languageDictValue=languageDictValue;
                var coll = new App.Collections.CommunityReportComments()
                coll.CommunityReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
                var viw = new App.Views.CommunityReportCommentView({
                    collection: coll,
                    CommunityReportId: e.target.attributes[0].nodeValue
                })
                viw.render();
                $('#debug').append(viw.el);
                $('#comment-feedback .bbf-form .field-comment label').html(App.languageDict.get('Comment'));

                if(languageDictValue.get('directionOfLang').toLowerCase()==="right")
                {
                    $('#comments').css('direction','rtl')
                    $('#comment-feedback').css('direction','rtl')
                    $('#r-formButton #submitFormButton').addClass('marginsOnMeetUp')
                    $('#r-formButton #cancelFormButton').addClass('marginsOnMeetUp')
                }
                else
                {
                    $('#comments').css('direction','ltr')
                    $('#comment-feedback').css('direction','ltr')
                    $('#r-formButton #submitFormButton').removeClass('marginsOnMeetUp');
                    $('#r-formButton #cancelFormButton').removeClass('marginsOnMeetUp')
                }
            }

        },

        vars: {},

        template: _.template($("#template-ReportRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()
            vars.languageDict=App.languageDict;
            if (vars.views == undefined) {
                vars.views = 0
            }

            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()

            this.$el.append(this.template(vars))


        }


    })

});

$(function() {

    App.Views.ReportsTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "btable btable-striped",

        //template: $('#template-ResourcesTable').html(),

        initialize: function() {
            //this.$el.append(_.template(this.template))
        },
        addOne: function(model) {
            var reportRowView = new App.Views.ReportsRow({
                model: model
            })
            reportRowView.isManager = this.isManager
            reportRowView.render()
            this.$el.append(reportRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr id="firstRowOfReports"><th>'+App.languageDict.attributes.Time+'</th><th>'+App.languageDict.attributes.Title+'</th><th>'+App.languageDict.attributes.author+'</th><th>'+App.languageDict.attributes.View_s+'</th><th colspan="5">'+App.languageDict.attributes.action+'</th></tr>')

            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});

$(function() {

    App.Views.ReportForm = Backbone.View.extend({

        className: "form courseSearchResults_Bottom",
        hide: false,
        events: {
            "click .save": "saveForm",
            "click #cancel": function() {
                window.history.back()
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function() {

            var vars = {}

            // prepare the header

            if (_.has(this.model, 'id')) {
                var languageDictValue;
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                App.languageDict = languageDictValue;
                var directionOfLang = App.languageDict.get('directionOfLang');
                vars.languageDict=App.languageDict;
                vars.header = App.languageDict.attributes.Title + this.model.get('title') + '"';
                vars.hidesave = true
                var tempAttachments = this.model.get('_attachments');
                var fields = _.map(
                    _.pairs(tempAttachments),
                    function(pair) {
                        return {
                            key: pair[0],
                            value: pair[1]
                        };
                    }
                );
                vars.resourceAttachments = fields;

            } else {
                vars.header = ''
                vars.hidesave = false
                var languageDictValue;
                var clanguage = getLanguage($.cookie('Member._id'));
                languageDictValue = getSpecificLanguage(clanguage);
                App.languageDict = languageDictValue;
                var directionOfLang = App.languageDict.get('directionOfLang');
                vars.resourceAttachments = App.languageDict.attributes.No_File_Selected;;
                vars.languageDict=App.languageDict;
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.form.render()
            //this.form.fields['uploadDate'].$el.hide()
            if (this.edit == false) {
                //this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
            }
            //this.form.fields['addedBy'].$el.attr("disabled",true)
            //this.form.fields['averageRating'].$el.hide()
            var that = this
            if (_.has(this.model, 'id')) {
                //if(this.model.get("Level") == "All"){
                // that.form.fields['toLevel'].$el.hide();
                //that.form.fields['fromLevel'].$el.hide();
                //that.hide = true
            }


            // @todo Why won't this work?
            vars.form = "" //$(this.form.el).html()

            // render the template
            this.$el.html(this.template(vars))
            // @todo this is hackey, should be the following line or assigned to vars.form
            $('.fields').html(this.form.el)
            $('#progressImage').hide();
            //$this.$el.children('.fields').html(this.form.el) // also not working

            applyCorrectStylingSheet(directionOfLang);
            return this
        },

        saveForm: function() {
            // @todo validate 
            //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
            // Put the form's input into the model in memory


            var addtoDb = true
            var previousTitle = this.model.get("title")
            previousTitle = $.trim(previousTitle)
            var newTitle
            var isEdit = this.model.get("_id")
            this.form.commit()
            // Send the updated model to the server
            newTitle = this.model.get("title")
            newTitle = $.trim(newTitle);
            var that = this
            var savemodel = false
            if ($.trim(this.model.get("title")).length == 0) {
                alert(App.languageDict.attributes.Missing_Report_Title)
            } else if ((this.model.get("Tag") == "News") && !this.model.get("author")) {
                alert(App.languageDict.attributes.Missing_Author)
            } else {
                $('#gressImage').show();
                this.model.set(' uploadDate', new Date().getTime())
                if (this.model.get("Level") == "All") {
                    this.model.set('toLevel', 0)
                    this.model.set('fromLevel', 0)
                } else {
                    if (parseInt(this.model.get("fromLevel")) > parseInt(this.model.get("toLevel"))) {
                        alert(App.languageDict.attributes.Invalid_Range)
                        addtoDb = false
                    }
                }
                if (isEdit == undefined) {
                    var that = this
                    var allres = new App.Collections.Reports()
                    allres.fetch({
                        async: false
                    })
                    allres.each(function(m) {
                        if ($.trim(that.model.get("title")) == $.trim(m.get("title"))) {
                            alert(App.languageDict.attributes.Duplicate_Title)
                            addtoDb = false
                        }
                    })
                }
                if (addtoDb) {
                    if (isEdit == undefined) {
                        this.model.set("sum", 0)
                    } else {
                        this.model.set("title", previousTitle)
                    }
                    this.model.save(null, {
                        success: function() {
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                if (isEdit != undefined) {
                                    if (previousTitle != newTitle) {
                                        var titleMatch = false
                                        var allres = new App.Collections.Resources()
                                        allres.fetch({
                                            async: false
                                        })
                                        allres.each(function(m) {
                                            if (newTitle == m.get("title")) {
                                                titleMatch = true
                                            }
                                        })
                                        if (!titleMatch) {
                                            var new_res = new App.Models.Resource()
                                            new_res.set("title", newTitle)
                                            new_res.set("description", that.model.get("description"))
                                            new_res.set("articleDate", that.model.get("articleDate"))
                                            new_res.set("addedBy", that.model.get("addedBy"))
                                            new_res.set("openWith", that.model.get("openWith"))
                                            new_res.set("openWhichFile", that.model.get("openWhichFile"))
                                            new_res.set("uploadDate", that.model.get("uploadDate"))
                                            new_res.set("openUrl", that.model.get("openUrl"))
                                            new_res.save()
                                            new_res.on('sync', function() {
                                                new_res.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                                new_res.on('savedAttachment', function() {
                                                    alert(App.languageDict.attributes.Resource_Updated)
                                                    Backbone.history.navigate("#resources", {
                                                        trigger: true
                                                    })
                                                    that.trigger('processed')
                                                    $('#progressImage').hide();
                                                }, new_res)
                                            })
                                        } else {
                                            alert(App.languageDict.attributes.Duplicate_Title)
                                        }
                                    } else {
                                        alert(App.languageDict.attributes.Resource_failure_update)
                                    }
                                } else {
                                    that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                }
                            } else {
                                that.model.trigger('processed')
                            }

                            that.model.on('savedAttachment', function() {
                                this.trigger('processed')
                                $('#progressImage').hide();
                            }, that.model)
                        }
                    })
                }
            }

        },

        statusLoading: function() {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

});

$(function () {

    App.Views.CommunityReportCommentView = Backbone.View.extend({

        tagName: "div",
        id: "comment-feedback",
        cId: null,
        initialize: function (e) {
            this.cId = e.CommunityReportId
            this.model = new App.Models.CommunityReportComment

        },

        events: {
            'click #submitFormButton': 'submit',
            'click #cancelFormButton': 'cancel'
        },
        cancel: function () {
            $('#debug').hide()
            this.remove()
        },
        submit: function () {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            var languageDictValue = languageDictValue;
            if (this.form.getValue("comment").length != 0) {
                var now = moment();
                //now.getDate();
                this.form.setValue({
                    CommunityReportId: this.cId
                })
                this.form.setValue({
                    commentNumber: (this.collection.length + 1)
                })
                this.form.setValue({
                    memberLogin: $.cookie('Member.login')
                })
                var day=moment().format('D');
                var monthToday=lookup(languageDictValue, "Months." + moment().format('MMMM'));
                var year=moment().format('YYYY');
                var time=moment().format('HH:mm:ss');
                this.form.setValue({
                    time:  day+' '+monthToday+' '+year+' '+time
                    //(new Date()).toString().split(' ').splice(1,4).join(' ')
                        //now.toLocaleString()
                })
                this.form.commit()
                this.model.save()
                this.form.setValue({
                    comment: ""
                })
                this.collection.fetch({
                    async: false
                })
                this.model.set({
                    "comment": ""
                })
                this.render()
            }
        },

        addOne: function (modl) {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            $('#comments').append('<div id=tile><b>'+languageDictValue.attributes.Login+':</b>' + modl.toJSON().memberLogin + '<br/><b>'+languageDictValue.attributes.Time+':</b>' + modl.toJSON().time + '<br/><b>'+languageDictValue.attributes.Comment+':</b>' + modl.toJSON().comment + '</div>')
        },

        render: function () {
            var languageDictValue;
            var clanguage = '';
            clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            $('#debug').show()
            this.$el.html('&nbsp;')
            $('#comments').html('&nbsp;')
            this.collection.forEach(this.addOne, this)
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['CommunityReportId'].$el.hide()
            this.form.fields['commentNumber'].$el.hide()
            this.form.fields['memberLogin'].$el.hide()
            this.form.fields['time'].$el.hide()
            var $button = $('<div id="r-formButton"><button class="btn btn-primary" id="submitFormButton">'+languageDictValue.attributes.Add_Comment+'</button><button class="btn btn-info" id="cancelFormButton">'+languageDictValue.attributes.Close+'</button></div>')
            this.$el.append($button);
            applyCorrectStylingSheet(directionOfLang);

            // $("#comments").animate({ scrollTop: $('#comments')[0].scrollHeight}, 3000);
        }

    })

});

$(function () {

    App.Views.CourseLevelsTable = Backbone.View.extend({
        id: "accordion",
        vars: {},
        modl: null,
        template: _.template($("#template-courseLevelsTable").html()),
        events: {
            "click #takequiz": "quiz",
            "click #resourseOpened": function (e) {
                resid = e.target.attributes.rid.nodeValue
                var member = new App.Models.Member({
                    _id: $.cookie('Member._id')
                })
                member.fetch({
                    async: false
                })
                var pending = []
                if(member.get("pendingReviews")){
                    pending = member.get("pendingReviews")
                }
                pending.push(resid)
                member.set("pendingReviews", pending)
                member.save()
                ratingModel = new App.Models.Feedback()
                ratingModel.set('resourceId', resid)
                ratingModel.set('memberId', $.cookie('Member._id'))
                ratingView = new App.Views.FeedbackForm({
                    model: ratingModel,
                    resId: resid
                })
                $('#externalDiv').html('<div id="star"></div>')
                $('#star').append(App.languageDict.attributes.Rating+"<br/>")
                $('#star').raty()
                $("#star > img").click(function () {
                    ratingView.setUserRating($(this).attr("alt"))
                });
                ratingView.render()
                $('#externalDiv').append(ratingView.el)
                $('#externalDiv').show()

            }
        },

        quiz: function (e) {
            var context=this
            var id = e.currentTarget.value
            step = new App.Models.CourseStep({
                _id: id
            })
            step.fetch({
                async: false
            })
            var JSONsteps=null;
            JSONsteps=step.toJSON()

            var ssids = context.modl.get('stepsIds')
            var index = ssids.indexOf(id)
            var temp = new App.Views.takeQuizView({
                questions: JSONsteps.questions,
                answers: JSONsteps.answers,
                options: JSONsteps.qoptions,
                passP: JSONsteps.passingPercentage,
                resultModel: context.modl,
                stepIndex: index
            })
            temp.render()
            $('div.takeQuizDiv').html(temp.el)
        },

        initialize: function () {
            $('div.takeQuizDiv').hide()
        },
        addAll: function () {

            this.collection.each(this.addOne, this)
        },

        addOne: function (model) {
            this.vars = model.toJSON();
            this.vars.languageDict=App.languageDict;
            if (!this.vars.outComes || this.vars.outComes.length==0) {
                this.vars.outComes = ''
                if (this.vars.questions && this.vars.questions.length >0){
                    this.vars.outComes = ['Quiz'];
                }

            }
            else if(this.vars.outComes instanceof Array){
                for ( var i =0;i< this.vars.outComes.length; i++)
                {
                    var textOfOutcomes = 'Take_' + this.vars.outComes[i];
                    this.vars.outComesText = textOfOutcomes;

                }

            }
            else{
                var temp=this.vars.outComes
                this.vars.outComes=new Array()
                this.vars.outComes[0]=temp;

            }

           // var textOfOutcomes='Take_'+this.vars.outComes[0];
           // this.vars.outComesText=App.languageDict.get(textOfOutcomes);
           // this.vars.outComes[0]=App.languageDict.get(this.vars.outComes[0]);

         //   this.vars.outComesText = textOfOutcomes;
          //  this.vars.outComes[0] =this.vars.outComes[0];
            var index = 0
            var sstatus = this.modl.get('stepsStatus')
            var ssids = this.modl.get('stepsIds')
            var sr = this.modl.get('stepsResult')

            while (index < sstatus.length && ssids[index] != this.vars._id) {
                index++
            }

            if (index == sstatus.length) {
                this.vars.status = App.languageDict.attributes.Error
                this.vars.marks =  App.languageDict.attributes.Error
            } else {
                this.vars.status = sstatus[index]
                this.vars.marks = sr[index]
                this.vars.index = index
            }
            var attachmentNames = new Array()
            var attachmentURLs = new Array()
            if(model.get('_attachments'))
            {
                for (i = 0; i < _.keys(model.get('_attachments')).length; i++) {

                    var attachmentURL = '/coursestep/' + model.get('_id') + '/'
                    var attachmentName = ''
                    if (typeof model.get('_attachments') !== 'undefined') {
                        attachmentURL = attachmentURL + _.keys(model.get('_attachments'))[i]
                        attachmentName = _.keys(model.get('_attachments'))[i]
                        attachmentNames.push(attachmentName)
                        attachmentURLs.push(attachmentURL)
                    }
                }
            }
            this.vars.attachmentNames = attachmentNames
            this.vars.attachmentURLs = attachmentURLs
            this.$el.append(this.template(this.vars))

        },

        setAllResults: function () {
            var context=this
            var memId=$.cookie('Member._id')
            var couId=this.collection.first().get("courseId")

        	var MemberCourseProgress=new PouchDB('membercourseprogress');
   	   		MemberCourseProgress.query({map:function(doc){
            	 if(doc.memberId && doc.courseId){
               		emit([doc.memberId,doc.courseId],doc)
         		 }
   			}
   			},{key:[memId,couId]},function(err,res){

                    var memberProgress=new App.Collections.membercourseprogresses()
                    memberProgress.memberId=memId
                    memberProgress.courseId=couId
                    memberProgress.fetch({async:false,
                        success:function(){
                            context.renderaccordian(memberProgress.first())
                        }

                    })
		   });
        },
        renderaccordian:function(model){

            var context=this
            context.modl=model

            var PassedSteps = 0
            var sstatus = context.modl.get('stepsStatus')
            var totalSteps = sstatus.length
            while (PassedSteps < totalSteps && sstatus[PassedSteps] != '0') {
                PassedSteps++
            }

            context.addAll()
            $("#accordion").accordion({
                header: "h3",
                heightStyle: "content"
            }).sortable({
                axis: "y",
                handle: "h3",
                stop: function (event, ui) {
                    // IE doesn't register the blur when sorting
                    // so trigger focusout handlers to remove .ui-state-focus
                    ui.item.children("h3").triggerHandler("focusout");
                }
            });



        },
        render: function () {

            if (this.collection.length < 1) {
                this.$el.append('<p style="font-weight:900;">'+App.languageDict.attributes.Error_UserCourse_Details+'</p>')
            } else {
                this.setAllResults();
            }

        }

    })

});

$(function() {

    App.Views.MeetupInvitation = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv"

        },

        title: null,
        entityId: null,
        type: null,
        senderId: null,

        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

            Backbone.history.navigate('meetups', {
                trigger: true
            })

        },
        SetParams: function(ti, e, t, s) {
            this.title = ti
            this.entityId = e
            this.type = t
            this.senderId = s

        },
        render: function() {

            //members is required for the form's members field
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            var members = new App.Collections.Members()
            var that = this
            var inviteForm = this
            inviteForm.on('InvitationForm:MembersReady', function() {
                
                this.model.schema.members.options = members
                // create the form
                this.form = new Backbone.Form({
                    model: inviteForm.model
                })
                this.$el.append(this.form.render().el)
                this.form.fields['members'].$el.hide()

                this.form.fields['invitationType'].$el.change(function() {
                    var val = that.form.fields['invitationType'].$el.find('option:selected').text()
                    if (val == App.languageDict.get('Members')) {
                        that.form.fields['members'].$el.show()
                    } else {
                        that.form.fields['members'].$el.hide()
                    }
                })
                // give the form a submit button
                var $button = $('<a class="btn btn-success" id="formButton">'+languageDictValue.attributes.Invite+'</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="cancelButton">'+languageDictValue.attributes.Cancel+'</button>');
                that.form.fields['invitationType'].$el.find('label').html(languageDictValue.attributes.Invitation_Type);
                var gradeLevelArray=App.languageDict.get('inviteMemberArray');
                for(var i=0;i<gradeLevelArray.length;i++)
                {
                    that.form.fields['invitationType'].$el.find('option').eq(i).html(gradeLevelArray[i]);

                }
            })

            // Get the group ready to process the form
            members.once('sync', function() {
                inviteForm.trigger('InvitationForm:MembersReady')

            })
            members.fetch();
            applyCorrectStylingSheet(directionOfLang)
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var member = new App.Models.Member({
                _id: $.cookie('Member._id')
            })
            member.fetch({
                async: false
            })
            // Put the form's input into the model in memory
            this.form.commit()
            var memberList = new App.Collections.Members()
            memberList.fetch({
                async: false
            })

            var temp
            var that = this
            var currentdate = new Date();
            if (this.model.get("invitationType") == "All") {
                memberList.each(function(m) {
                    temp = new App.Models.Mail()
                    temp.set("senderId", that.model.senderId)
                    temp.set("receiverId", m.get("_id"))
                    temp.set("status", "0")
                    temp.set("subject", "Meetup Invitation | " + that.model.title)
                    temp.set("type", "Meetup-invitation")
                    temp.set("body", that.model.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >'+languageDictValue.attributes.Accept+'</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >'+languageDictValue.attributes.Reject+'</button>')
                    temp.set("sendDate", currentdate)
                    temp.set("entityId", that.model.resId)
                    temp.save()

                })

            } else if (this.model.get("invitationType") == "Members") {
                memberList.each(function(m) {
                    var that2 = that;
                    if (that.model.get("members").indexOf(m.get("_id")) > -1) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Meetup Invitation | " + that.model.title)
                        temp.set("body", that.model.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >'+languageDictValue.attributes.Accept+'</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >'+languageDictValue.attributes.Reject+'</button>')
                        temp.set("type", "Meetup-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        temp.save()
                    }
                })
            }
            $('#invitationdiv').fadeOut(1000)
            alert(App.languageDict.attributes.Invitation_Sent_Success)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

            Backbone.history.navigate('meetups', {
                trigger: true
            })

        }


    })

});

$(function() {

    App.Views.MailView = Backbone.View.extend({
        code: null,
        vars: {},
        recordsPerPage: null,
        modelNo: null,
        nextButton: null,
        unopen: null,
        searchText: null,
        resultArray: null,
        inViewModel: null,
        showNextButton: null,
        template: _.template($("#template-mail").html()),
        templateMailView: _.template($("#template-view-mail").html()),

        events: {
            "click #replyMailButton": function(e) {
                $("#recipients").val(this.vars.login)
                $("#subject").val("Re : " + this.vars.subject)
                $("#mailbodytexarea").val("")
            },
            "click #mailComposeButton": function(e) {
                $("#subject").val("")
                $("#recipients").val("")
                $("#mailbodytexarea").val("")
            },
            "click #nextButton": function(e) {
                this.modelNo = 0
                this.resultArray = []
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #all-mails": function(e) {
                this.modelNo = 0
                skip = 0
                this.searchText = ""
                $("#search-text").val("")
                this.resultArray = []
                this.unopen = false
                this.fetchRecords()
                $("#nextButton").show()
                $("#previousButton").hide()
            },

            "click #unread-mails": "unReadMails",
            "click #backpage": function(e) {

                this.render()
                this.unReadMails()

            },
            "click .deleteBtn": function(e) {
                var modelNo = e.currentTarget.value
                alert(modelNo)
                var selectedModel = this.collection.at(modelNo)
                var model = new App.Models.Mail()
                model.id = selectedModel.get("id")
                model.fetch({
                    async: false
                })
                model.destroy()

                this.render()
                this.unReadMails()
            },
            "click #previousButton": function(e) {
                if (skipStack.length > 1) {
                    skipStack.pop()
                    skip = skipStack.pop()
                    skipStack.push(skip)
                    this.resultArray = []
                    this.modelNo = 0
                    this.showNextButton = 1
                    this.fetchRecords()
                } else {
                    $("#previousButton").hide()
                }

            },
            "click #invite-accept": function(e) {
                if (mailView.inViewModel.get('type') == "admissionRequest") {
                    mailView.admissionRequestAccepted(e.currentTarget.value)
                    return
                }
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                var vacancyFull = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>"+App.languageDict.get('courseFull_msg')+"</div>"
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>"+App.languageDict.get('invite_Accepted')+"</div>"

                if (mailView.inViewModel.get('type') == "Meetup-invitation") {
                    mailView.meetupRequestAccepted(e.currentTarget.value)
                    mailView.updateMailBody(body)
                    return
                }

                var gmodel = new App.Models.Group({
                    _id: e.currentTarget.value
                })
                gmodel.fetch({
                    async: false
                })

                var that = this

                //*************check Vacancies for the Course**************

                var num = gmodel.get("members").length
                if (gmodel.get("memberLimit"))
                    if (gmodel.get("memberLimit") < num) {
                        alert(App.languageDict.attributes.Course_Full)
                        mailView.updateMailBody(vacancyFull)
                        return
                    }
                mailView.updateMailBody(body)
                if (gmodel.get("_id")) {
                    var memberlist = []
                    if (gmodel.get("members") != null) {
                        memberlist = gmodel.get("members")
                    }


                    if (memberlist.indexOf($.cookie('Member._id')) == -1) {
                        memberlist.push($.cookie('Member._id'))
                        gmodel.set("members", memberlist)

                        gmodel.save({}, {
                            success: function() {
                                var memprogress = new App.Models.membercourseprogress()
                                var csteps = new App.Collections.coursesteps();
                                var stepsids = new Array()
                                var stepsres = new Array()
                                var stepsstatus = new Array()
                                csteps.courseId = gmodel.get("_id")
                                csteps.fetch({
                                    success: function() {
                                        csteps.each(function(m) {
                                            stepsids.push(m.get("_id"))
                                            stepsres.push("0")
                                            stepsstatus.push("0")
                                        })
                                        memprogress.set("stepsIds", stepsids)
                                        memprogress.set("memberId", $.cookie("Member._id"))
                                        memprogress.set("stepsResult", stepsres)
                                        memprogress.set("stepsStatus", stepsstatus)
                                        memprogress.set("courseId", csteps.courseId)
                                        memprogress.save({
                                            success: function() {}
                                        })

                                    }
                                })
                                alert(App.languageDict.attributes.Course_Added_Dashboard)
                                Backbone.history.navigate('dashboard', {
                                    trigger: true
                                })
                            }
                        })

                    } else {
                        alert(App.languageDict.attributes.Course_Existing_Dashboard)
                        Backbone.history.navigate('dashboard', {
                            trigger: true
                        })
                    }
                }
            },


            "click #invite-reject": function(e) {
                if (mailView.inViewModel.get('type') == "admissionRequest") {
                    mailView.admissoinRequestRejected(e.currentTarget.value)
                    return
                }
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>"+App.languageDict.get('invite_rejected')+"</div>"

                mailView.updateMailBody(body)
            },
            "click #search-mail": function(e) {
                skip = 0
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                this.searchText = $("#search-text").val()
                this.resultArray = []
                skipStack.push(skip)
                this.modelNo = 0
                this.fetchRecords()
            },
            "click #back": function(e) {
                skip = 0
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                this.resultArray = []
                skipStack.push(skip)
                this.modelNo = 0
                this.render()
                this.fetchRecords()
            }
        },
        unReadMails: function(e) {
            this.modelNo = 0
            skip = 0
            this.searchText = ""
            $("#search-text").val("")
            this.resultArray = []
            this.unopen = true
            this.fetchRecords()
            $("#nextButton").show()
            $("#previousButton").hide()
        },
        renderAllMails: function(e) {

            mailView.modelNo = 0
            skip = 0
            this.searchText = ""
            mailView.resultArray = []
            mailView.unopen = false
            mailView.fetchRecords()

            $("#nextButton").show()
            $("#previousButton").hide()

        },
        viewButton: function(e) {
            var modelNo = e.currentTarget.value
            var model = mailView.collection.at(modelNo)
            var attchmentURL = '/mail/' + model.get("_id") + '/'
            var attachmentName = ''
            if (typeof model.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(model.get('_attachments'))[0]
                attachmentName = _.keys(model.get('_attachments'))[0]
            }
            mailView.inViewModel = model
            model.set("status", "1")
            model.save()
            mailView.vars = model.toJSON()

            var member = new App.Models.Member()
            member.id = model.get('senderId')
            member.fetch({
                async: false
            })
            mailView.vars.firstName = member.get('firstName')
            mailView.vars.lastName = member.get('lastName')
            mailView.vars.email = member.get('login') + '.' + mailView.code + mailView.nationName.substring(3, 5) + '@olebell.org'
            mailView.vars.modelNo = modelNo
            mailView.vars.login = mailView.vars.email
            if (attachmentName != "") {
                mailView.vars.isAttachment = 1
                mailView.vars.attchmentURL = attchmentURL
            } else {
                mailView.vars.isAttachment = 0
            }
            mailView.$el.html('')
            mailView.$el.append(mailView.templateMailView(mailView.vars))
        },
        deleteButton: function(e) {
            var modelNo = e.currentTarget.value
            var selectedModel = mailView.collection.at(modelNo)
            selectedModel.destroy()
            mailView.renderAllMails()
        },
        initialize: function(args) {
            this.code = args.community_code
            this.nationName = args.nationName
            this.modelNo = 0
            skip = 0
            this.unopen = true
            this.recordsPerPage = 5
            this.nextButton = 1
            this.searchText = ""
            this.delegateEvents()
            this.resultArray = []
            this.showNextButton = 0
        },
        addOne: function(model) {
            vars = model.toJSON()
            var member = new App.Models.Member()
            member.set("id", model.get('senderId'))
            member.id = model.get('senderId')
            member.fetch({
                async: false
            })
            if (member.id == undefined) {
                var name = App.languageDict.get('Error');
            } else {
                var name = member.get('firstName') + ' ' + member.get('lastName')
            }
            if (vars.subject) {
                var row = ""
                if (vars.status == 0) {

                    row = '<tr bgcolor="B4D3EC" style="color:black">'
                } else {
                    row = '<tr bgcolor="E7E7E7" style="color:#2D2D34">'
                }
                var deleteId = "delete" + this.modelNo
                var viewId = "view" + this.modelNo

                row = row + '<td>' + vars.subject + '</td><td align="center">' + name + '</td><td id="viewDelCol"><button value="' + this.modelNo + '" id ="' + deleteId + '" class="btn btn-danger">'+App.languageDict.get("DeleteLabel")+'</button>&nbsp;&nbsp;<button value="' + this.modelNo + '" id="' + viewId + '" class="btn btn-primary" >'+App.languageDict.get("View")+'</button></td></tr>'
                $('#inbox_mails').append(row)
                this.modelNo++
                $("#" + deleteId).click(this.deleteButton)
                $("#" + viewId).click(this.viewButton)
                mailView = this;
                if(App.languageDict.get('directionOfLang').toLowerCase()==="right"){
                    $('#viewDelCol').find('td').eq(2).attr("align","left")
                }
                else {
                    $('#viewDelCol').find('td').eq(2).attr("align","right")
                }
            }
        },

        addAll: function() {

            $('#inbox_mails').html('')
            if (skipStack.length <= 1) {
                $('#previousButton').hide()
            } else {
                $('#previousButton').show()
            }
            this.collection.forEach(this.addOne, this)
        },
        render: function() {
            var lang = getLanguage($.cookie('Member._id'));
            App.languageDict = getSpecificLanguage(lang);
            this.vars.languageDict=App.languageDict;
            this.$el.html(this.template(this.vars))
            this.$el.append('<div class="mail-table"><span style="float:right; margin-left:10px;"><button id="nextButton" class="btn btn-primary fui-arrow-right"></button></span> <span style="float:right;"><button id="previousButton" class="btn btn-primary fui-arrow-left"></button></span></div>')
            $('#searchOnMail').find('input').eq(0).attr("placeholder",App.languageDict.get('searchMessages'))
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right")
            {
                $('#mailHeading').css({"color":"black","font-size":"25px","margin-right": "10%"})
                $('#searchOnMail').css("float","left");
                $('#errorMessage').css({"direction":"rtl"});
                $('#errorMessage').find('p').css({"color":"red","margin-right":"10%"});
            }
            else {
                $('#mailHeading').css({"color":"black","font-size":"25px"});
                $('#searchOnMail').css("float","right");
                $('#errorMessage').find('p').css({"color":"red","margin-left":"10%"});
            }
        },

        fetchRecords: function() {
            var obj = this
            var newCollection = new App.Collections.Mails({
                receiverId: $.cookie('Member._id'),
                unread: obj.unopen
            })

            newCollection.fetch({
                success: function() {
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(newCollection.models, obj.searchText))
                    if (obj.resultArray.length != limitofRecords && newCollection.models.length == limitofRecords) {
                        obj.fetchRecords()

                        return;
                    } else if (obj.resultArray.length == 0 && skipStack.length > 1) {
                        $("#nextButton").hide()
                        skipStack.pop()
                        return;
                    }

                    if (obj.resultArray.length == 0 && skipStack.length == 1) {
                        {

                            $("#errorMessage").show();
                            return
                        }
                    }

                    var ResultCollection = new App.Collections.Mails()
                    if (obj.resultArray.length > 0) {
                        $("#errorMessage").hide();
                        ResultCollection.set(obj.resultArray)
                        obj.collection = ResultCollection
                        obj.addAll()
                        if (obj.showNextButton == 1) {
                            $("#nextButton").show()
                            obj.showNextButton = 0
                        }
                    }
                }
            })

        },
        searchInArray: function(resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount

            {
                _.each(resourceArray, function(result) {
                    if (result.get("subject") != null && result.get("body") != null) {
                        skip++
                        if (result.get("subject").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 || result.get("body").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {

                            if (resultArray.length < limitofRecords) {
                                resultArray.push(result)
                            } else {
                                skip--
                            }
                        } else if (resultArray.length >= limitofRecords) {
                            skip--
                        }
                    }
                })

            }
            return resultArray
        },
        admissionRequestAccepted: function(courseId) {
            var memebersEnrolled = [];
            var course = new App.Models.Group();
            course.id = courseId
            course.fetch({
                async: false
            })
////////////////////////////////////////
            memebersEnrolled = course.attributes.members
            var isAlreadyEnrolled = false;
            console.log(memebersEnrolled)
            var receiverId = mailView.inViewModel.get('senderId');
            var member = new App.Models.Member()
            member.id = receiverId
            member.fetch({
                async: false
            })
            //mailView.vars.firstName = member.get('firstName')
           // mailView.vars.lastName = member.get('lastName')
           var firstName = member.get('firstName')
           var lastName = member.get('lastName')
            for (var i=0; i<memebersEnrolled.length;i++){
                // alert(memebersEnrolled[i])
                if (receiverId == memebersEnrolled[i]){
                    console.log("reciever id"+receiverId)
                    isAlreadyEnrolled = true;
                }
            }
            console.log("flag:" + isAlreadyEnrolled)
            if (isAlreadyEnrolled){
                alert("Member is already enrolled in this course");
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = firstName + ' ' +'is already enrolled in '+' ' + course.attributes.CourseTitle;
                ///////

            }
            else {
                /////////////////////////////////////////////

                var memId = mailView.inViewModel.get('senderId')
                course.get('members').push(memId)
                course.save(null, {
                    success: function (model, idRev) {

                        var memprogress = new App.Models.membercourseprogress()
                        var csteps = new App.Collections.coursesteps();
                        var stepsids = new Array()
                        var stepsres = new Array()
                        var stepsstatus = new Array()
                        csteps.courseId = idRev.id
                        csteps.fetch({
                            success: function () {
                                csteps.each(function (m) {
                                    stepsids.push(m.get("_id"))
                                    stepsres.push("0")
                                    stepsstatus.push("0")
                                })
                                memprogress.set("stepsIds", stepsids)
                                memprogress.set("memberId", memId)
                                memprogress.set("stepsResult", stepsres)
                                memprogress.set("stepsStatus", stepsstatus)
                                memprogress.set("courseId", csteps.courseId)
                                memprogress.save({
                                    success: function () {
                                        alert(App.languageDict.attributes.Success_Saved_Msg)
                                    }
                                })

                            }
                        })

                    }
                })
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                //body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
             //   accepted_email_text
              //  body = 'Admission request received from user "a" has been Accepted<br>'
               body = App.languageDict.get('accepted_email_text')+' '+firstName+' '+lastName+'<br>'
              //  body = 'Admission request received from user '+firstName+' '+lastName+ ' '+ 'has been Accepted<br>'
               body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>" + App.languageDict.get('request_Accepted_already') + "</div>"

                mailView.inViewModel.save()

                var currentdate = new Date();
                var mail = new App.Models.Mail();
                mail.set("senderId", $.cookie('Member._id'));
                mail.set("receiverId", mailView.inViewModel.get('senderId'));
                mail.set("subject", App.languageDict.attributes.Adm_req_accepted + " | " + course.get('name'));
                mail.set("body", App.languageDict.attributes.adm_req_For_rejected + " \"" + course.get('name') + "\" ");
                mail.set("status", "0");
                mail.set("type", "mail");
                mail.set("sentDate", currentdate);
                mail.save()
////////
            }
                ////////
            mailView.updateMailBody(body)
        },
        admissoinRequestRejected: function(courseId) {
            var courseTitle;
            var memebersEnrolled = [];
            var course = new App.Models.Group();
            course.id = courseId
            course.fetch({
                success: function () {
                    if (course.length > 0) {
                        console.log(course.attributes.CourseTitle)
                    }
                },
                async: false
            })
            courseTitle = course.attributes.CourseTitle;
            memebersEnrolled = course.attributes.members
            var isAlreadyEnrolled = false;
            console.log(memebersEnrolled)
            var receiverId = mailView.inViewModel.get('senderId');
            for (var i=0; i<memebersEnrolled.length;i++){
                // alert(memebersEnrolled[i])
                if (receiverId == memebersEnrolled[i]){
                    console.log("reciever id"+receiverId)
                    isAlreadyEnrolled = true;
                }
            }
            console.log("flag:" + isAlreadyEnrolled)
            console.log(courseTitle)
            if (isAlreadyEnrolled){
                alert("Member is already enrolled in this course");
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = $.cookie('Member.login') + ' ' +'is already enrolled in '+' ' + course.attributes.CourseTitle;
                ///////

            }
            else{

                /////////////////////////////////////////
               /* alert("Member is already enrolled in this course");
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = $.cookie('Member.login') + ' ' +'is already enrolled in'+' ' + course.attributes.CourseTitle*/
                ////////////////////////////////////////
                  var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                 //body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                 body = 'Admission request received from user "a" has been Rejected<br>'
                 body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>"+App.languageDict.attributes.request_Rejected_already+"</div>"
                 // alert(courseTitle)
                 var currentdate = new Date();
                 var mail = new App.Models.Mail();
                 mail.set("senderId", $.cookie('Member._id'));
                 mail.set("receiverId", mailView.inViewModel.get('senderId'));
                 // mail.set("subject", " | " + courseId.get('CourseTitle'));
                 alert(App.languageDict.attributes.Adm_req_rejected);
                 mail.set("subject", App.languageDict.attributes.Adm_req_rejected+ " | " + course.attributes.CourseTitle)
                 //  mail.set("body", App.languageDict.attributes.adm_req_For_rejected+" \"" + courseId.get('name') + "\" ");
                 mail.set("body", App.languageDict.attributes.adm_req_For_rejected+" \"" + course.attributes.CourseTitle + "\" ");
                 mail.set("status", "0");
                 mail.set("type", "mail");
                 mail.set("sentDate", currentdate);
                 mail.save()
            }
            mailView.updateMailBody(body)
        },
        meetupRequestAccepted: function(meetupId) {
            var UMeetup = new App.Collections.UserMeetups()
            UMeetup.memberId = $.cookie('Member._id')
            UMeetup.meetupId = meetupId

            UMeetup.fetch({
                async: false
            })
            if (UMeetup.length > 0) {
                alert(App.languageDict.attributes.Already_Joined_MeetUp)
                return
            }

            var meetup = new App.Models.MeetUp()
            meetup.id = meetupId
            meetup.fetch({
                async: false
            })

            if (!meetup.get('title')) {
                alert(App.languageDict.attributes.MeetUp_not_Existing)
                return
            }
            var userMeetup = new App.Models.UserMeetup()

            userMeetup.set({
                memberId: $.cookie('Member._id'),
                meetupId: meetupId,
                meetupTitle: meetup.get('title')

            })
            userMeetup.save()

            alert(App.languageDict.attributes.Joined_Success)

        },
        updateMailBody: function(body) {
            var model = new App.Models.Mail()
            model.id = mailView.inViewModel.get("id")
            model.fetch({
                async: false
            })
            model.set('body', body)
            model.save()
            $('#mail-body').html('<br/>' + body)
        }

    })


});

$(function () {
    App.Views.CoursesChartProgress = Backbone.View.extend({

        tagName: "div",
        className: "Graphbutton",
        arrayOfData: new Array,
        grandpassed: null,
        grandremaining: null,
        events: {
            "click #Donut": function () {
                $('#graph').html(' ')
                //document.getElementById('horizontallabel').style.visibility = 'hidden'
               // document.getElementById('veticallable').style.visibility = 'hidden';
                document.getElementById('infoAboutGraph').style.visibility = 'hidden';
                this.$el.html('<a class="btn btn-info" id="Bar">'+App.languageDict.attributes.Detailed_View+'</a>')
                Morris.Donut({
                    element: 'graph',
                    data: [{
                        label: App.languageDict.attributes.Passed+' '+App.languageDict.attributes.Steps,
                        value: this.grandpassed
                    }, {
                        label:App.languageDict.attributes.Remaining+' '+App.languageDict.attributes.Steps,
                        value: this.grandremaining
                    }],
                    colors: ['#0B62A4', '#7A92A3']

                });
            },
            "click #Bar": function () {
                $('#graph').html(' ')
               // document.getElementById('horizontallabel').style.visibility = 'visible'
               // document.getElementById('veticallable').style.visibility = 'visible'
                document.getElementById('infoAboutGraph').style.visibility = 'visible';
                this.$el.html('<a class="btn btn-info" id="Donut">'+App.languageDict.attributes.Birdeye_View+'</a>')
                Morris.Bar({
                    element: 'graph',
                    data: this.arrayOfData,
                    xkey: 'subject',
                    ykeys: ['passed', 'remaining'],
                    labels: [App.languageDict.attributes.Passed, App.languageDict.attributes.Remaining],
                    gridTextWeight: 900,
                    gridTextSize: 16,
                    axes: true,
                    grid: true,
                    stacked: true
                });
            }


        },


        addOne: function (model) {
            temp = new Object
            data = model.toJSON().stepsStatus
            total = model.toJSON().stepsStatus.length
            passed = 0
            remaining = 0
            for (var i = 0; i < total; i++) {
                if (data[i] != "1") {
                    remaining++
                    this.grandremaining++
                } else {
                    passed++
                    this.grandpassed++
                }
            }
            course = new App.Models.Group({
                _id: model.toJSON().courseId
            })
            course.fetch({
                async: false
            })
            if (total == 0) {
                temp.subject = (course.toJSON().name +' ' +App.languageDict.attributes.No_Steps)
            } else {
                temp.subject = (course.toJSON().name)
            }

            temp.passed = passed
            temp.remaining = remaining
            this.arrayOfData.push(temp)
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {
                alert(App.languageDict.attributes.No_Data_Error)
            }
        },

        render: function () {
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.BuildString()

            Morris.Bar({
                element: 'graph',
                data: this.arrayOfData,
                xkey: 'subject',
                ykeys: ['passed', 'remaining'],
                labels: [App.languageDict.attributes.Passed, App.languageDict.attributes.Remaining],
                gridTextWeight: 900,
                gridTextSize: 12,
                axes: true,
                grid: true,
                stacked: true,
                xLabelMargin: 5


            });
            this.$el.append('<a class="btn btn-info" id="Donut">'+App.languageDict.attributes.Birdeye_View+'</a>')
        }

    })

});

$(function () {

    App.Views.CalendarForm = Backbone.View.extend({
        className: "signup-form",
        events: {
            "click #formButton": "setForm"
        },

        render: function () {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)

            // give the form a submit button
            var $button
            if (this.update) {
                $button = $('<div class="signup-submit"><a class="addEvent-btn btn btn-success" style="width:" id="formButton">'+App.languageDict.get("Update_Event")+'</button></div>')
            } else {
                $button = $('<div class="signup-submit"><a class="addEvent-btn btn btn-success" id="formButton">'+App.languageDict.get("Add_Event")+'</button></div>')
            }
            this.$el.append($button)
        },
        setForm: function () {
            var that = this
            this.model.once('sync', function () {
                that.trigger('CalendarForm:done')
            })
            this.form.setValue('userId', $.cookie('Member._id'))
            if (this.form.validate() == null) {
                this.form.commit()
                this.model.save()
                if (this.update) {
                    alert(App.languageDict.attributes.Event_Updated_Success)
                } else {
                    alert(App.languageDict.attributes.Event_Created_Success)
                }
                Backbone.history.navigate('calendar', {
                    trigger: true
                })
            }

        }
    })

});

$(function () {

    App.Views.EventInfo = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "btable btable-striped resourceDetail",
        sid: null,
        rid: null,
        id:"eventDetail-table",
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyEvent": function (e) {
            
             var vars = this.model.toJSON()
             var mId=$.cookie('Member._id')
             
             this.model.destroy()
             
             alert(App.languageDict.attributes.Event_Deleted_Success)
                    Backbone.history.navigate('calendar', {
                        trigger: true
                    })
      
        }
        },
        initialize: function () {
            this.$el.append('<th colspan="2"><h6>'+App.languageDict.get("Event_Detail")+'</h6></th>')
        },
        render: function () {
            var vars = this.model.toJSON()
            var date=new Date(vars.schedule)
                vars.schedule=date.toUTCString()
            this.$el.append("<tr><td>"+App.languageDict.get('Title')+"</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>"+App.languageDict.get('Description')+"</td><td>" + vars.description + "</td></tr>")
            this.$el.append("<tr><td>"+App.languageDict.get('Start_date')+"</td><td>" + vars.startDate + "</td></tr>")
            this.$el.append("<tr><td>"+App.languageDict.get('End_date')+"</td><td>" + vars.endDate+ "</td></tr>")
            this.$el.append("<tr><td>"+App.languageDict.get('Timing')+"</td><td>" + vars.startTime + "-"+vars.endTime+"</td></tr>")
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyEvent">'+App.languageDict.get('Destroy')+'</button><a href="#calendar" style="margin-left:10px" class="btn btn-info">'+App.languageDict.get('Calender')+'</a></td></tr>')

        }

    })

});

$(function() {
  App.Views.CollectionTable = Backbone.View.extend({

    tagName: "table",
	id:"collectionTable",
	display:false,
    className: "table table-striped",
    initialize:function(options){
    	
    //consoe.log(options)
    ///alert('here in collection table')
    },
	addOne: function(model){


      	 var collectionRow = new App.Views.CollectionRow({model: model})
      		 collectionRow.display=this.display
      		 collectionRow.render()  ;

      	this.$el.append(collectionRow.el)
    },
    events : {
		"click .clickonalphabets" : function(e)
		{
			this.collection.skip = 0
			var val = $(e.target).text()
			this.collection.startkey = val
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}	
		},
		"click #allresources" : function(e)
		{
			this.collection.startkey = ""
			this.collection.skip = 0
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		},
		"click #mergeCollection" :function(e){
		    this.displayMergeForm()
		},
		"click #nextButton" :function(e){
		    this.collection.skip += 20
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		},
		"click #preButton" :function(e){
		    this.collection.skip -= 20
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		}
		
	},
	displayMergeForm:function(){
	
	          $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show();
				$('#invitationdiv').html('<div id="mainMergeDiv"></div>');
                $('#mainMergeDiv').append('<h5 style="margin-top:40px">'+App.languageDict.attributes.Select_Collections_Merge+'<h5>')

                var viewText='<p style=""><label style="margin-left:20px"><b>'+App.languageDict.attributes.Collection_s+'</b></label><select multiple="true" style="width:400px;" id="selectCollections">'
                    this.collection.each(function(coll){
                         viewText+='<option value="'+coll.get('_id')+'">'+coll.get('CollectionName')+'</option>'
                    
                    })
                viewText+='</select></p>'
                
                $('#mainMergeDiv').append(viewText)
                
                $('#mainMergeDiv').append('<br><div id="mergeCollectionDiv"><label style=""><b>'+App.languageDict.attributes.Name+'</b></label><input id="collectionName" type="text"></input></div>')
                $('#invitationdiv select').multiselect().multiselectfilter();
				$('#invitationdiv select').multiselect({
					checkAllText: App.languageDict.attributes.checkAll,
					uncheckAllText: App.languageDict.attributes.unCheckAll,
					selectedText: '# '+App.languageDict.attributes.Selected
				});
		$('#invitationdiv select').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
		$('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                $('#invitationdiv select').multiselect('uncheckAll');
				$('#invitationdiv select').multiselect({
					header: App.languageDict.attributes.Select_An_option,
					noneSelectedText: App.languageDict.attributes.Select_An_option
				});

               
                $('#mainMergeDiv').append('<br><br>')
                $('#mainMergeDiv').append('<button class="btn btn-success" style="margin-left:40px" id="continueMerging" onClick="continueMerging()">'+App.languageDict.attributes.Continue+'</button>')
                $('#mainMergeDiv').append('<button class="btn btn-danger" style="margin-left:20px"  id="cancelMerging" onClick="cancelMerging()">'+App.languageDict.attributes.Cancel+'</button>')
				if(App.configuration.attributes.currentLanguage=="Urdu" || App.configuration.attributes.currentLanguage=="Arabic" )
				{
					$('#mainMergeDiv').find('h5').eq(0).css('margin-right','2%');  //40px
					$('#mainMergeDiv').find('label').css('margin-left','20px'); //60px
					$('#mainMergeDiv').find('p').css('margin-right','2%');    //20px
					$('#mergeCollectionDiv').css('margin-right','2%');
					$('#continueMerging').css('margin-right','40px');
					$('#cancelMerging').css('margin-right','20px');
				}
			else {
					$('#mainMergeDiv').find('h5').eq(0).css('margin-left','40px');
					$('#mainMergeDiv').find('p').css('margin-left','20px');
					$('#mainMergeDiv').find('label').css('margin-left','40px');
					$('#mergeCollectionDiv').css('margin-left','2%');
					$('#continueMerging').css('margin-left','40px');
					$('#cancelMerging').css('margin-left','20px');
				}

	},
    addAll: function(){

    
    	var header="<tr><th colspan='6'><span id='firstLabelOnCollections'>"+App.languageDict.attributes.Collection_s+"</span>"
            if(this.display==true)
              header+="<a id='mergeCollection' class='btn btn-info small'>"+App.languageDict.attributes.Merge+"</a>"
    	      header+="</th></tr>"
    	this.$el.html(header)
				var viewText="<tr></tr>"
			
				viewText+="<tr><td id='alphabetsOnCollections' colspan=7>"
				viewText+='<a  id="allresources" >#</a>&nbsp;&nbsp;'
		var str = [] ;
		str = App.languageDict.get("alphabets");
		for (var i = 0; i < str.length; i++) {
			var nextChar = str[i];
			viewText += '<a class="clickonalphabets"  value="' + nextChar + '">' + nextChar + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		}
				viewText+="</td></tr>"
				this.$el.append(viewText)
    	
    	
    	  
  		this.collection.forEach(this.addOne, this)
  		
  		var nextPre='<tr><td>'
  		if(this.collection.length >= 20)
  		{
  		  if(this.collection.skip>=20)
  		   nextPre+='<button class="btn btn-success" id="preButton">'+App.languageDict.attributes.Back+'</buttton>'
  		  
  		  nextPre+='<button class="btn btn-success" id="nextButton">'+App.languageDict.attributes.Next+'</buttton>'
  		
  		}
  		nextPre+='</td></tr>'
  		this.$el.append(nextPre)
  		
    },

    render: function() {


	   
    	var roles=this.getRoles()
    	if(roles.indexOf('Manager')>=0)
    	{
    		this.display=true
    	}
    	else{
    		this.display=false
    	}
      this.addAll()
    },
     getRoles:function(){
        
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            
            return roles
        }

  })

})


;

$(function () {

    App.Views.CollectionRow = Backbone.View.extend({

        tagName: "tr",
       
        template: $("#template-CollectionRow").html(),

        initialize: function (e) {
         
        },

        render: function () {
            var vars = this.model.toJSON()
            vars.display=this.display
           	if(!vars.CollectionName)
           	vars.CollectionName="XYZ"
           	this.$el.append(_.template(this.template, vars))
        }

    })

});

$(function() {

    App.Views.ListCollectionView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv",
            "click #deleteButton": "deleteRecord",
            "click #invitationForm .bbf-form .field-IsMajor input": "nesttedHideShow"

        },
        nesttedHideShow: function(e) {
            if ($("#invitationForm .bbf-form .field-IsMajor input").is(':checked')) {
                $("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'hidden')
            } else {
                $("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'visible')
            }
        },
        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
        },
        deleteCollectionNameFromResources: function(idOfCollection) {
            $.ajax({
                url: '/resources/_design/bell/_view/resourceOnTag?_include_docs=true&key="' + idOfCollection + '"',

                type: 'GET',
                dataType: 'json',
                success: function(resResult) {
                    var result = resResult.rows;
                    var tempResult = [];
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].value.Tag.length > 0) {
                            var index = result[i].value.Tag.indexOf(idOfCollection);
                            if (index > -1) {
                                result[i].value.Tag.splice(index, 1);
                            }
                        }
                        //  result[i].doc.sum = 0;
                        //result[i].doc.timesRated = 0;
                        tempResult.push(result[i].value);

                    }
                    $.couch.db('resources').bulkSave({
                        "docs": tempResult
                    }, {
                        success: function(data) {
                            location.reload();
                        },
                        async:false
                    });
                },
                async : false
            });

        },
        deleteRecord: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            if (confirm(App.languageDict.attributes.Confirm_Collection)) {
                $('.form .field-Tag select option[value=' + this.model.get("_id") + "]").remove();
                $('#' + this.model.get("_id")).parent('tr').remove();
                this.deleteCollectionNameFromResources(this.model.get("_id"));
                //Call from here method deleteCollectionNameFromResources/////////////////////////////////////
                this.model.set({
                    'show': false
                })
                this.model.save({
                    success: function (data) {
                        this.deleteCollectionNameFromResources(this.model.get("_id"));
                        // location.reload()
                    },
                    async: false

                })
            }
        },
        render: function() {
            var inviteForm = this

            this.form = new Backbone.Form({
                model: inviteForm.model
            })
            this.$el.append(this.form.render().el)
            var $button = $('<a class="btn btn-success" id="formButton">'+App.languageDict.attributes.Save+'</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">'+App.languageDict.attributes.Cancel+'</button>')
            if (this.model.get('_id') != undefined) {
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="deleteButton">'+App.languageDict.attributes.DeleteLabel+'</button>')
            }
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },
        setForm: function() {

            // Put the form's input into the model in memory
            this.form.commit()
            var newTitle = this.model.get("CollectionName")
            newTitle = $.trim(newTitle);
            var titleMatch = false
            var allres = new App.Collections.listRCollection()
            allres.fetch({
                async: false
            })
            allres.each(function(m) {

                if (m.get("show") == true && newTitle == m.get("CollectionName")) {
                    titleMatch = true
                }
            })
            if (titleMatch) {
                alert(App.languageDict.attributes.Duplicate_CollectionName)
                $('#invitationdiv').fadeOut(1000)

                document.getElementById('cont').style.opacity = 1.0
                document.getElementById('nav').style.opacity = 1.0
            } else {
                if (this.model.get('NesttedUnder') != '--Select--') {
                    this.model.set({
                        'IsMajor': false
                    })
                } else {
                    this.model.set({
                        'IsMajor': true
                    })
                }
                if ($.trim(this.model.get('CollectionName')).length > 0) {

                    var that = this

                    var collectionName = this.model.get('CollectionName');
                    this.model.set('CollectionName', collectionName);
                    this.model.save(null, {
                        success: function(m) {
                            alert(App.languageDict.attributes.Collection_Saved_success)
                            location.reload()
                            if (that.model.get('_id') == undefined) {
                                if (that.model.get('NesttedUnder') == '--Select--') {
                                    if (that.model.get('IsMajor') == true) {
                                        $('.form .field-Tag select').append('<option class="MajorCategory" value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>')
                                    } else
                                        $('.form .field-Tag select').append('<option value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>')


                                } else {
                                    if ($('.form .field-Tag select option[value=' + that.model.get("NesttedUnder") + "]") != null) {
                                        $('.form .field-Tag select option[value=' + that.model.get("NesttedUnder") + "]").after('<option  value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>');
                                    }
                                }
                                $('#invitationdiv').fadeOut(1000)

                                document.getElementById('cont').style.opacity = 1.0
                                document.getElementById('nav').style.opacity = 1.0
                                setTimeout(function() {
                                    $('#invitationdiv').hide()
                                }, 1000);

                                $('.form .field-Tag select').multiselect('refresh')
                            } else {
                                location.reload()
                            }
                        }
                    })

                } else {
                    alert(App.languageDict.attributes.Prompt_CollectionName)
                }

            }


        }

    })

});

$(function() {

    App.Views.siteFeedbackPage = Backbone.View.extend({

        tagName: "table",
        className: " table-feedback notification-table table-striped",
        authorName: null,
        searchText: null,
        Resolved: null,
        stack: null,
        category: null,
        urgent: null,
        applyFilters: null,
        resultArray: null,
        events: {
            "click #see-all": function(e) {
                this.applyFilters = "0"
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                searchText = ""
                this.resultArray = []
                skip = 0
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #switch": function(e) {
                this.applyFilters = "1"
                this.category = $('#select_category').val()
                this.urgent = $('#select_urgent').val()
                if ($('#select_status').val() == "Resolved") {
                    this.Resolved = "1"
                } else {
                    this.Resolved = "0"
                }
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                searchText = ""
                this.resultArray = []
                skip = 0
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #search_feedback": function(e) {
                this.applyFilters = "0"
                searchText = $("#searchText").val()
                if (searchText != "") {
                    while (skipStack.length > 0) {
                        skipStack.pop();
                    }
                    this.resultArray = []
                    skip = 0
                    skipStack.push(skip)
                    this.fetchRecords()
                }
            },
            "click #previousButton": function(e) {
                if (skipStack.length > 1) {
                    skipStack.pop()
                    skip = skipStack.pop()
                    skipStack.push(skip)
                    this.resultArray = []
                    this.fetchRecords()
                } else {
                    $("#previousButton").hide()
                }
            },
            "click #next_button": function(e) {

                skipStack.push(skip)
                this.resultArray = []
                this.fetchRecords()
            }
        },

        initialize: function() {
            this.resultArray = []
            this.category = "Bug"
            this.Resolved = "1"
            this.applyFilters = "0"
            this.searchText = ""
            if (url == "unknown") {
                url = "siteFeedback"
            }
            if ($("#comments") != null) {
                $('#debug').append('<div id="comments"></div>')
            }
        },

        addAll: function() {
            this.$el.html('<h4>Keyword:&nbsp;<input class="form-control" type="text" placeholder="Search in comment" value="" size="30" id="searchText" style="height:24px;margin-top:1%;"></input>&nbsp;<span><button class="btn btn-info" id="search_feedback">Search</button>&nbsp;<button class="btn btn-info" id="see-all">See All</button></span>&nbsp;<img id="progress_img" src="vendor/progress.gif" width="3%"></h4><br/>')
            this.$el.append('<Select id="select_category"><option>Bug</option><option>Question</option><option>Suggestion</option></select>&nbsp;&nbsp<select id="select_status"><option>Unresolve</option><option>Resolved</option></select>&nbsp;&nbsp<select id="select_urgent"><option>Normal</option><option>Urgent</option></select>&nbsp;&nbsp<button class="btn btn-info" id="switch">Apply Filters</button><br/><br/>')
            this.$el.append('<th ><h4>Feedback</h4></th><th ><h4>Status</h4></th>')
            $("#progress_img").hide()
            this.collection.forEach(this.addOne, this)
            this.$el.append('<br/><br/><input type="button" class="btn btn-hg btn-primary" id="previousButton" value="< Previous"> &nbsp;&nbsp;&nbsp;<button class="btn btn-hg btn-primary" id="next_button" >Next  ></button>')
        },

        addOne: function(model) {
            if (!model.get("category")) {
                model.set("category", "Bug")
            }
            if (!model.get("priority")) {

                model.set("priority", [])
            }
            if (model.toJSON()._id != "_design/bell") {
                var revRow = new App.Views.siteFeedbackPageRow({
                    model: model
                })
                revRow.render()
                this.$el.append(revRow.el)
            }

        },
        render: function() {
            this.addAll()
            //alert('in render')
            if (skipStack.length <= 1) {
                $("#previousButton").hide()
            }
            if (this.collection.length < 5) {
                $("#next_button").hide()
            }
        },
        fetchRecords: function() {
            $("#progress_img").show()
            var obj = this
            this.collection.fetch({
                success: function() {
                    //alert(obj.resultArray.length + ' skip : ' + skip)
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.collection.models, searchText))
                    //alert(obj.resultArray.length + ' skip : ' + skip)

                    if (obj.resultArray.length != limitofRecords && obj.collection.models.length == limitofRecords) {
                        obj.fetchRecords()
                        return;
                    } else if (obj.resultArray.length == 0 && obj.collection.models.length == 0 && skipStack.length > 1) {

                        $("#next_button").hide()
                        skipStack.pop()
                        return;
                    }

                    if (obj.resultArray.length == 0 && skipStack.length == 1) {
                        if (searchText != "") {
                            alert(App.languageDict.attributes.No_Result)
                        }
                        //obj.render()
                        // $('#not-found').html("No Such Record Exist");
                        //  $("#selectAllButton").hide() 
                    }
                    var ResultCollection = new App.Collections.siteFeedbacks()
                    //if(obj.resultArray.length > 0)
                    {
                        ResultCollection.set(obj.resultArray)
                        obj.collection = ResultCollection
                        obj.$el.html('')
                        obj.render()
                    }
                }
            })

        },

        filterResult: function(model) {

            var temp = model.get("PageUrl")
            if (!temp) {
                temp = ''
            }
            var temp2 = temp.split('/')
            var ul = temp2[0]
            for (var i = 1; i < temp2.length; i++) {
                if (temp2[i].length != 32) {
                    ul = ul + "/" + temp2[i]
                } else {
                    i = temp.length
                }
            }
            if (ul == url) {
                return true
            } else {
                return false
            }
        },

        checkFilters: function(result) {
            if (this.filterResult(result)) {
                if (this.applyFilters == "0") {
                    return true
                } else if (this.Resolved == result.get("Resolved") && this.category == result.get("category")) {
                    if (this.urgent == "Normal" && result.get("priority").length == 0) {
                        return true
                    } else if (this.urgent == "Urgent" && result.get("priority").length > 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        searchInArray: function(resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount
            _.each(resourceArray, function(result) {
                if (result.get("comment") != null) {
                    skip++

                    //alert(that.Resolved+' '+result.get("Resolved") + ' ' + that.category + ' ' +  result.get("category"))
                    if (!result.get("category")) {
                        result.set("category", "Bug")
                    }
                    if (!result.get("priority")) {
                        result.set("priority", [])
                    }
                    if (result.get("comment").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 && that.checkFilters(result)) {
                        if (resultArray.length < limitofRecords) {
                            resultArray.push(result)
                        } else {
                            enablenext = 1
                            skip--
                        }
                    } else if (resultArray.length >= limitofRecords) {
                        skip--
                    }


                }
            })

            return resultArray
        }

    })

});

$(function() {

    App.Views.siteFeedbackPageRow = Backbone.View.extend({
        template0: $("#template-siteReviewRowAdmin").html(),
        template1: $("#template-siteReviewRownoAdmin").html(),
        tagName: "tr",
        authorName: null,
        events: {
            "click #resolveButton": "resolve",
            "click #commentButton": "comment"
        },
        comment: function(e) {
            var coll = new App.Collections.reportsComment()
            coll.feedbackId = e.target.attributes[0].nodeValue
            coll.fetch({
                async: false
            })
            var viw = new App.Views.addComment({
                collection: coll,
                commentId: e.target.attributes[0].nodeValue
            })
            viw.render()
            $('#debug').append(viw.el)
        },
        resolve: function(e) {
            e.preventDefault()
            this.model.on('sync', function() {
                location.reload();
            })
            this.model.save({
                Resolved: "1"
            }, {
                success: function() {}
            });
        },

        initialize: function() {
            if ($.cookie('Member.login') == 'admin') {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
        },

        render: function() {

            var vars = this.model.toJSON()
            if (this.model.get("priority").length == 0) {
                vars.urgent = "Normal"
            } else {
                vars.urgent = "Urgent"
            }
            this.$el.html(_.template(this.template, vars))
        }

    })

})

$(function() {

    App.Views.siteFeedbackPageRow = Backbone.View.extend({
        template0: $("#template-siteReviewRowAdmin").html(),
        template1: $("#template-siteReviewRownoAdmin").html(),
        tagName: "tr",
        authorName: null,
        events: {
            "click #resolveButton": "resolve",
            "click #commentButton": "comment"
        },
        comment: function(e) {
            var coll = new App.Collections.reportsComment()
            coll.feedbackId = e.target.attributes[0].nodeValue
            coll.fetch({
                async: false
            })
            var viw = new App.Views.addComment({
                collection: coll,
                commentId: e.target.attributes[0].nodeValue
            })
            viw.render()
            $('#debug').append(viw.el)
        },
        resolve: function(e) {
            e.preventDefault()
            this.model.on('sync', function() {
                location.reload();
            })
            this.model.save({
                Resolved: "1"
            }, {
                success: function() {}
            });
        },

        initialize: function() {
            if ($.cookie('Member.login') == 'admin') {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
        },

        render: function() {

            var vars = this.model.toJSON()
            if (this.model.get("priority").length == 0) {
                vars.urgent = "Normal"
            } else {
                vars.urgent = "Urgent"
            }
            this.$el.html(_.template(this.template, vars))
        }

    })

});

$(function() {
	App.Views.RequestTable = Backbone.View.extend({

		tagName: "table",
		className: "table table-striped",
		id: "requestsTable",
		addOne: function(model) {
			if (model.toJSON()._id != "_design/bell") {
				var modelView = new App.Views.RequestRow({
					model: model
				})
				modelView.render()
				this.$el.append(modelView.el)
			}
		},

		addAll: function() {

			if (this.collection.length != 0) {
				this.$el.append("<tr><th>"+App.languageDict.attributes.User+"</th><th>"+App.languageDict.attributes.Category+"</th><th>"+App.languageDict.attributes.Reques_t+"</th></tr>")
				this.collection.each(this.addOne, this);

			} else {

				this.$el.append("<th>"+App.languageDict.attributes.No_Requests+"</th>")
			}
		},

		render: function() {
			this.addAll()
		}

	})

});

$(function() {

  App.Views.RequestRow = Backbone.View.extend({

    tagName: "tr",
    template: $("#template-RequestRow").html(),

    render: function() {
      var vars = this.model.toJSON()
      var user = new App.Models.Member({
        _id: vars.senderId
      })
      user.fetch({
        async: false
      })
      user = user.toJSON()
      vars.name = user.firstName + " " + user.lastName
      this.$el.html(_.template(this.template, vars))
    }

  })

});

$(function () {

    App.Views.Configurations = Backbone.View.extend({
        //This view is used to render "Se Configurations" form and its bound with "Configurations" schema

        initialize: function () {
            this.$el.html('<h3>' + App.languageDict.get("Set_Configurations") + '</h3>')
        },
        events: {
            "click #formButton": "setForm"
        },

        render: function () {
            this.form = new Backbone.Form({
                model: this.model
            })

            this.$el.append(this.form.render().el);
            var availableLanguages=getAvailableLanguages();
            for(var key in availableLanguages){
                this.$el.find('.field-selectLanguage .bbf-editor select').append($('<option>', {
                    value: key,
                    text:availableLanguages[key]
                }));
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
            this.$el.find('.field-selectLanguage .bbf-editor select').prepend('<option id="defaultLang" disabled="true" selected style="display:none"></option>');
            clanguage= getNativeNameOfLang(clanguage);
            $('.field-selectLanguage').find('.bbf-editor').find('select').val(clanguage);
            this.$el.find('#defaultLang').text(clanguage);
            this.$el.find('.field-name label').text(App.languageDict.get("Name"));
            this.$el.find('.field-code label').text(App.languageDict.get("Code"));
            this.$el.find('.field-type label').text(App.languageDict.get("Type"));
            this.$el.find( ".field-type .bbf-editor select option" ).each(function( index ) {
                var temp = $(this).text();
                $(this).text(App.languageDict.get(temp));
            });
            this.$el.find('.field-region label').text(App.languageDict.get("Region"));
            this.$el.find('.field-nationName label').text(App.languageDict.get("Nation_Name"));
            this.$el.find('.field-nationUrl label').text(App.languageDict.get("Nation_Url"));
            this.$el.find('.field-version label').text(App.languageDict.get("Version"));
            this.$el.find('.field-notes label').text(App.languageDict.get("Notes"));
            this.$el.find('.field-selectLanguage label').text(App.languageDict.get("Select_Language"));
            this.$el.append('<a style="margin-left:31px;" class="btn btn-success" id="formButton">' + App.languageDict.get("Submit_Configurations") + '</a>');
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));

        },
        setForm:function() {
            var memberLoginForm = this;
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config = this.form.model;
            var config = new App.Collections.Configurations();
            var members = new App.Collections.Members();
            var member;
            config.fetch({async: false});
            var con = config.first();
            con.set('name', Config.get('name'));
            con.set('nationName', Config.get('nationName'));
            con.set('nationUrl', Config.get('nationUrl'));
            var membersDoc=[];
            if (con.get('code') != Config.get('code'))
            {
                members.fetch({
                    async:false,
                        success:function () {
                            if(members.length>0)
                            {
                                for(var i=0; i <members.length ; i++) {
                                    member = members.models[i];
                                    if(con.get('code')== member.get('community'))
                                    {
                                        member.set('community',Config.get('code'));
                                        membersDoc.push(member);
                                    }
                                }
                                $.couch.db("members").bulkSave({"docs": membersDoc}, {
                                    success: function(data) {
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    }
                                });
                            }
                        }
                });
            }
            con.set('code', Config.get('code'));
            //con.set('type',Config.get('type'));
            con.set('notes',Config.get('notes'));
            //con.set('region', Config.get('region'));
            if(Config.get('version') != "") {
                con.set('version', Config.get('version'));
            }
            con.set('subType', 'dummyy');
            con.set('countDoubleUpdate'  , 0   );
            if(Config.get('selectLanguage') != "Select an Option") {
                con.set('currentLanguage', Config.get('selectLanguage'));
            }
            if(parseInt(App.member.get('visits')) ==0)
            {
                members.fetch({
                    id:App.member.get('_id'),
                    async:false,
                    success:function(){
                        var member=members.first();
                        member.set('community',con.get('code'));
                        var vis = parseInt(member.get("visits"));
                        vis++;
                        member.set('visits',vis);
                        if (!(member.get('roles').indexOf("Manager") > -1) && member.get("FirstName")!='Default' &&
                            member.get('LastName')!='Admin')
                        {
                            member.set("lastLoginDate",new Date());
                        }
                        if(member.get('bellLanguage')===undefined || member.get('bellLanguage')==="" || member.get('bellLanguage')===null)
                        {
                            member.set("bellLanguage", App.configuration.get("currentLanguage"));
                        }
                        member.once('sync', function() {})

                        member.save(null, {
                            success: function(doc, rev) {}
                        });
                        //call log activity function here...
                        memberLoginForm.logActivity(member);
                        var date = new Date()
                        $.cookie('Member.login', member.get('login'), {
                            path: "/apps/_design/bell"
                        })
                        $.cookie('Member._id', member.get('_id'), {
                            path: "/apps/_design/bell"
                        })
                        $.cookie('Member.expTime', date, {
                            path: "/apps/_design/bell"
                        })
                        $.cookie('Member.roles', member.get('roles'), {
                            path: "/apps/_design/bell"
                        })
                        memberLoginForm.trigger('success:login');
                    }
                });
            }
            delete con.attributes.registrationRequest;
            delete con.attributes.lastAppUpdateDate;
            delete con.attributes.lastActivitiesSyncDate;
            delete con.attributes.lastPublicationsSyncDate;
            delete con.attributes.authName;
            delete con.attributes.authDate;
            con.save(null,{ success: function(doc,rev){

                App.configuration = con;

                // Get Current Date
                var currentdate = new Date();
                var year = currentdate.getFullYear();
                var month = (1 + currentdate.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day = currentdate.getDate().toString();
                day = day.length > 1 ? day : '0' + day;
                var logcurrentdate = year + '/' + month + '/' + day;

                $.ajax({
                    type: 'GET',
                    url: '/activitylog/_design/bell/_view/getDocumentByDate?key="'+ logcurrentdate +'"',
                    dataType: 'json',
                    success: function (response) {
                        var logModel = response.rows[0].value;
                        logModel.community = App.configuration.get("code");

                        //Now Posting the Updated Activitylog Model
                        $.ajax({
                            type: 'PUT',
                            url: '/activitylog/'+ logModel._id +'/?rev=' + logModel._rev,
                            data: JSON.stringify(logModel),
                            async: false,
                            dataType: 'json',
                            success: function (response) {
                            }
                        });
                    }
                });
                alert(App.languageDict.attributes.Config_Added_Success);
                Backbone.history.navigate('dashboard');
                window.location.reload();
            }});
        },
        logActivity: function(member) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate);
            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    that.UpdatejSONlog(member, logModel, logdb, logdate);
                } else {
                    that.createJsonlog(member, logdate, logdb);
                }
            });
        },
        createJsonlog: function(member, logdate, logdb) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            // alert(superMgrIndex);
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {

                var visits = parseInt(docJson.male_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.male_visits = visits
            } else {

                var visits = parseInt(docJson.female_visits)
                //    if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.female_visits = visits
            }
            docJson.community = App.configuration.get('code'),
                logdb.put(docJson, logdate, function(err, response) {
                    if (!err) {
                        console.log("MemberLoginForm:: created activity log in pouchdb for today..");
                    } else {
                        console.log("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                        console.log(err);
                        //                    alert("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                    }
                });
        },
        UpdatejSONlog: function(member, logModel, logdb, logdate) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            if (member.get('Gender') == 'Male') {
                var visits = parseInt(logModel.male_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.male_visits = visits
            } else {
                var visits = parseInt(logModel.female_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.female_visits = visits
            }
            logModel.community = App.configuration.get("code");

            logdb.put(logModel, logdate, logModel._rev, function(err, response) { // _id: logdate, _rev: logModel._rev
                if (!err) {
                    console.log("MemberLoginForm:: updated daily log from pouchdb for today..");
                } else {
                    console.log("MemberLoginForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
                    //                    alert("err making update to record");
                }
            });
        },
        getFormattedDate: function(date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return month + '/' + day + '/' + year;
    }

    })

});

$(function() {

    App.Views.LogQuery = Backbone.View.extend({

        events: {
            "click #report_button": function(e) {
                var communityName = "Open BeLL"
                if ($("#community-select").val()) {
                    communityName = $("#community-select").val()
                }
                if ($("#start-date").val() && $("#end-date").val()) {
                    console.log("community: " + $("#community-select").val() + "\t" +
                        "Start-Date: " + $("#start-date").val() + "    " +
                        "End-Date: " + $("#end-date").val());
                    App.Router.LogActivity(communityName, $("#start-date").val(), $("#end-date").val())
                } else {
                    console.log("At least one of the criteria for report is missing");
                }
            }
        },
        template: $('#template-LogQuery').html(),
        vars: {},
        initialize: function() {

        },
        render: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            this.vars.languageDict = App.languageDict;
            this.$el.html(_.template(this.template, this.vars))
           // this.$el.html(_.template(this.template));

        }
    })

});

$(function() {

    App.Views.ActivityReport = Backbone.View.extend({
        vars: {},
        events: {
            /* Sync moved to nation
             "click #syncReport" : function(e){
             App.Router.syncLogActivitiy()
             }*/
        },
        template: $('#template-ActivityReport').html(),
        initialize: function() {

        },
        render: function() {
            var context = this;


            $.ajax({
                url: '/members/_design/bell/_view/MaleCount?group=false',
                type: 'GET',
                dataType: "json",
                success: function(json) {
                    context.vars = context.data
                    if (json.rows[0]) {
                        context.vars.MaleMembers = json.rows[0].value
                    } else {
                        context.vars.MaleMembers = 0;
                    }
                    $.ajax({
                        url: '/members/_design/bell/_view/FemaleCount?group=false',
                        type: 'GET',
                        dataType: "json",
                        success: function(json) {
                            if (json.rows[0]) {
                                context.vars.FemaleMembers = json.rows[0].value
                            } else {
                                context.vars.FemaleMembers = 0;
                            }
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

});

$(function() {

    App.Views.ManageCommunity = Backbone.View.extend({

        events: {
            "click .SyncDbSelect": 'SyncDbSelect',
            //"click #configuration": 'Configuration',
            "click .back": function(e) {
                alert(App.languageDict.attributes.Back)
            }

        },
        initialize: function() {
            this.$el.append('<th colspan="2"><h6>Meetup Detail</h6></th>')

        },

        processJsonp: function() {
        },
        render: function() {

            // here we willn check the any new updated 
            this.$el.html('')
            nName = App.configuration.get('nationName')
            pass = App.password
            nUrl = App.configuration.get('nationUrl')
            currentBellName = App.configuration.get('name')
            var htmlreferance = this.$el

            this.$el.append('<div style="padding: 20px 20px 0px 20px; float: left;"> <a id="configuration" href="#configurationsForm"><button class="btn btn-primary" id="configbutton">' + App.languageDict.get('Configurations') + '</button></a> </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <button id="sync" class="SyncDbSelect btn btn-primary">' + App.languageDict.get('Sync_With_Nation') + '</button>  </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <a id="publication" class="btn btn-primary" href="#publications/for-' + App.configuration.get('name') + '">' + App.languageDict.get('Publications') + '</a>  </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <a id="survey" class="btn btn-primary" href="#surveys/for-' + App.configuration.get('name') + '">' + App.languageDict.get('Surveys') + '</a>  </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <a id="welcomeButton" class="btn btn-primary" href ="#updatewelcomevideo">' + App.languageDict.attributes.Welcome_Video + '</a></div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left; display:none;"> <a id="syncStatus" class="btn btn-primary" href ="#checksum">' + App.languageDict.attributes.Check_Updated + '</a></div>')
            
            // /****************************************************************************************************************************************************
            //   this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <button class="SyncMembersDb btn btn-primary" id="syncmembers">Sync Members Db With Nation</button>  </div>')
            //  ****************************************************************************************************************************************************/
            var directionOfLang = App.languageDict.get('directionOfLang');
            if(directionOfLang.toLowerCase()==="right") {
                this.$el.find('#configuration').parent().css({"float":"right", "padding":"20px 20px 0px 20px"});
                this.$el.find('#sync').parent().css({"float":"right", "padding":"20px 0px 0px 20px"});
                this.$el.find('#publication').parent().css({"float":"right", "padding":"20px 0px 0px 20px"});
                this.$el.find('#survey').parent().css({"float":"right", "padding":"20px 0px 0px 20px"});
                this.$el.find('#welcomeButton').parent().css({"float":"right", "padding":"20px 0px 0px 20px"});
            }
            else
            {
                this.$el.find('#configuration').parent().css({"float":"left", "padding":"20px 20px 0px 20px"});
                this.$el.find('#sync').parent().css({"float":"left", "padding":"20px 20px 0px 0px"});
                this.$el.find('#publication').parent().css({"float":"left", "padding":"20px 20px 0px 0px"});
                this.$el.find('#survey').parent().css({"float":"left", "padding":"20px 20px 0px 0px"});
                this.$el.find('#welcomeButton').parent().css({"float":"left", "padding":"20px 20px 0px 0px"});
            }
            applyCorrectStylingSheet(directionOfLang);
        },

        syncDbs: function(e) {
        },
        SyncDbSelect: function() {
            $('#invitationdiv').fadeIn(1000)
            var inviteForm = new App.Views.listSyncDbView()

            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)
        },
        Configuration: function() {
            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configModel = configCollection.first();
            var configForm = new App.Views.Configurations({
                model: configModel
            })
            configForm.render();

            this.$el.html(configForm.el);
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right"){
                $('#configTable div div h3').css('margin-right','0%');
            }
        }

    })

});

    $(function () {

        App.Views.PublicationTable = Backbone.View.extend({
            authorName: null,
            tagName: "table",
            className: "table table-striped",
            collectionInfo:[],
            add: function (publicationDistribID, model, isAlreadySynced) {
                // carry the publication in a variable global to this (PublicationTable) view for use in event handling
                this.collectionInfo[model._id]= model; //[model.resources,model.courses,model.IssueNo]
                if (isAlreadySynced) {
                    this.$el.append('<tr id="' + publicationDistribID + '"><td>' + model.IssueNo+ '</td><td><a name="' +model._id +
                        '" class="synPublication btn btn-info">'+App.languageDict.attributes.Sync_Publication+'</a></td></tr>');
                } else {
                    this.$el.append('<tr id="' + publicationDistribID + '"><td>' + model.IssueNo+ '</td><td><a name="' +model._id +
                        '" class="synPublication btn btn-info">'+App.languageDict.attributes.Sync_Publication+'</a><label>&nbsp&nbsp'+App.languageDict.attributes.Not_Synced+'</label></td></tr>');
                }
            },
            events:{
              "click .synPublication": 'synPublication'
            },
            render: function () {
                this.$el.html('<tr><th>'+App.languageDict.attributes.IssueNumber+'</th><th>'+App.languageDict.get("action")+'</th></tr>');
                var that=this;
            var nationName = App.configuration.get('nationName'),
                nationPassword = App.password;
            var nationUrl = App.configuration.get('nationUrl'),
                currentBellName = App.configuration.get('name');
                var DbUrl = 'http://' + nationName + ':' + nationPassword + '@' + nationUrl +
                            '/publicationdistribution/_design/bell/_view/getPublications?include_docs=true&descending=true&key=["'+currentBellName+'",'+false+']'; //#113 reverse pubs order
                // make sure the couchdb that is being requested in this ajax call has its 'allow_jsonp' property set to true in the
                // 'httpd' section of couchdb configurations. Otherwise, the server couchdb will not respond as required by jsonp format
                // to send publication-distribution records from nation whose 'viewed' property is false
                $.ajax({
                url: DbUrl,
                type: 'GET',
                dataType: 'jsonp',
                    success: function (json) {
                        var keys='';
                        var publicationToPubDistributionMap = {};
                        _.each(json.rows,function(row){
                            publicationToPubDistributionMap[row.doc.publicationId] = row.doc._id;
                            keys += '"' + row.doc.publicationId + '",';
                        });
                        if (keys != '') {
                            keys = keys.substring(0, keys.length - 1);
                            var pubsForCommunityUrl = 'http://' + nationName + ':' + nationPassword + '@' + nationUrl +
                                '/publications/_all_docs?include_docs=true&keys=[' + keys + ']';
                            $.ajax({
                            url: pubsForCommunityUrl,
                            type: 'GET',
                            dataType: 'jsonp',
                                success: function (jsonNationPublications) {
                                    // fetch all publications from local/community server to see how many of the publications from nation are new ones
                                    var publicationCollection = new App.Collections.Publication();
                                    var tempUrl = App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true';
                                    publicationCollection.setUrl(tempUrl);
                                    publicationCollection.fetch({
                                        success: function () {
                                            var syncedPublication = [];
                                            var newPublication = [];
                                            _.each(jsonNationPublications.rows,function(row){
                                                var publicationFromNation = row.doc;
                                                var alreadySyncedPublications = publicationCollection.models;
                                                var index = alreadySyncedPublications.map(function(element) {
                                                    return element.get('_id');
                                                }).indexOf(publicationFromNation._id);
                                                var nationPublicationDistributionDocId = publicationToPubDistributionMap[publicationFromNation._id];
                                                var isAlreadySynced = false;
                                                if (index > -1) { // its a new or yet-to-be-synced publication from nation, so display it as new
                                                    isAlreadySynced = true;
                                                    var temp = { "pubDistId":nationPublicationDistributionDocId, "pubDoc":publicationFromNation, "isAlreadySynced":isAlreadySynced, "IssueNo":publicationFromNation.IssueNo };
                                                    syncedPublication.push(temp);
                                                   // that.add(nationPublicationDistributionDocId, publicationFromNation, isAlreadySynced);
                                                } else { // its an already synced publication. display it without the new/unsynced mark
                                                    var temp = { "pubDistId":nationPublicationDistributionDocId, "pubDoc":publicationFromNation, "isAlreadySynced":isAlreadySynced, "IssueNo":publicationFromNation.IssueNo };
                                                    newPublication.push(temp);
                                                   // that.add(nationPublicationDistributionDocId, publicationFromNation, isAlreadySynced);
                                                }
                                            });
                                            //


                                            newPublication.sort(that.sortByProperty('IssueNo'));
                                            syncedPublication.sort(that.sortByPropertyInDecreasingOrder('IssueNo'));
                                            //
                                            for (var i = 0; i<newPublication.length ; i++){
                                                var temp = newPublication[i];
                                                that.add(temp.pubDistId, temp.pubDoc, temp.isAlreadySynced);
                                            }
                                            for (var i = 0; i<syncedPublication.length ; i++){
                                                var temp = syncedPublication[i];
                                                that.add(temp.pubDistId, temp.pubDoc, temp.isAlreadySynced);
                                            }

                                        }
                                    });
                                },
                                error: function(jqXHR, status, errorThrown){
                                    console.log(status);
                                }
                            });
                        }
                    },
                    error: function(jqXHR, status, errorThrown){
                        console.log(status);
                    }
                });

                applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
            },

            sortByProperty: function(property) {
            'use strict';
            return function (a, b) {
                var sortStatus = 0;
                if (a[property] < b[property]) {
                    sortStatus = -1;
                } else if (a[property] > b[property]) {
                    sortStatus = 1;
                }

                return sortStatus;
            };
        },
            sortByPropertyInDecreasingOrder: function(property) {
                'use strict';
                return function (a, b) {
                    var sortStatus = 0;
                    if (a[property] < b[property]) {
                        sortStatus = 1;
                    } else if (a[property] > b[property]) {
                        sortStatus = -1;
                    }

                    return sortStatus;
                };
            },

            synPublication:function(e){
                var that = this;
                var pubId = e.currentTarget.name;
                var pubDistributionID = $(e.currentTarget).closest('tr').attr('id');
                var publicationToSync = this.collectionInfo[pubId];
                $.couch.allDbs({
                    success: function(data) {
                        if(data.indexOf('tempresources') != -1 ){
                            $.couch.db("tempresources").drop({
                                success: function(data) {
                                    that.syncCourses(pubDistributionID, publicationToSync);
                                },
                                error: function(status) {
                                    console.log(status);
                                }
                            });
                        }
                        else {
                            that.syncCourses(pubDistributionID, publicationToSync);
                        }
                    },
                    async: false
                });
                //this.syncCourses(pubDistributionID, publicationToSync);
            },
            syncCourses:function(pubDistributionID, publicationToSync){
            var resourcesIdes = publicationToSync.resources,
                courses = publicationToSync.courses,
                IssueNo = publicationToSync.IssueNo;
            var nationUrl = App.configuration.get('nationUrl'),
                nationName = App.configuration.get('nationName');
                // courses contains courseID and stepIDs(which contains stepID and resouceIDs(which contains ids of resources in the step))
            var cumulativeCourseIDs = [],
                cumulativeCourseStepIDs = [],
                cumulativeResourceIDs = [];
                for (var indexOfCourse in courses){
                    var courseInfo = courses[indexOfCourse];
                    cumulativeCourseIDs.push(courseInfo['courseID']);
                    var courseSteps = courseInfo['stepIDs'];
                    for (var indexOfCourseStep in courseSteps) {
                        var courseStepInfo = courseSteps[indexOfCourseStep];
                        cumulativeCourseStepIDs.push(courseStepInfo['stepID']);
                        var resourceIDs = courseStepInfo['resourceIDs'];
                        for (var indexOfResourceID in resourceIDs) {
                            cumulativeResourceIDs.push(resourceIDs[indexOfResourceID]);
                        }
                    }
                }
                for (var indexOfNonCourseResourceID in resourcesIdes) {
                    cumulativeResourceIDs.push(resourcesIdes[indexOfNonCourseResourceID]);
                }
                App.startActivityIndicator();
                var that=this;
                $.couch.db("tempresources").create({
                    success: function(data) {
                        $.ajax({
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            type: 'POST',
                            url: '/_replicate',
                            dataType: 'json',
                            data: JSON.stringify({
                                "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/resources',
                                "target": 'tempresources',
                                'doc_ids': cumulativeResourceIDs
                            }),
                            async: false,
                            success: function (response) {
                                //Resource Rating work here.
                                $.ajax({
                                    url: '/tempresources/_all_docs?include_docs=true',
                                    type:  'GET',
                                    dataType: 'json',
                                    success: function (resResult) {
                                        var result = resResult.rows;
                                        var tempResult = [];
                                        for (var i = 0; i<result.length; i++){
                                            result[i].doc.sum = 0;
                                            result[i].doc.timesRated = 0;
                                            tempResult.push(result[i].doc);
                                        }
                                    $.couch.db('tempresources').bulkSave({
                                        "docs": tempResult
                                    }, {
                                                success: function(data) {
                                                    $.couch.replicate("tempresources", "resources", {
                                                        success: function(data) {
                                                            alert(App.languageDict.attributes.Resources_Synced_Success);
                                                            $.couch.db("tempresources").drop({
                                                                success: function(data) {
                                                                },
                                                                error: function(status) {
                                                                    console.log(status);
                                                                }
                                                            });
                                                            alert(App.languageDict.attributes.Publication+' ' +IssueNo+' '+ App.languageDict.attributes.Resources_Synced_Success);
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                            alert(App.languageDict.attributes.Resources_Synced_Error);
                                                            $.couch.db("tempresources").drop({
                                                                success: function(data) {
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                        }
                                                            });
                                                        }
                                                    }, {
                                                        create_target: true
                                                    });
                                                },
                                                error: function(status) {
                                                    $.couch.db("tempresources").drop({
                                                        success: function(data) {
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                        }
                                                    });
                                                    alert(App.languageDict.attributes.Error);
                                                }
                                    });
                                    },
                                    error: function() {
                                        alert(App.languageDict.attributes.Fetch_Resources_Error);
                                        $.couch.db("tempresources").drop({
                                            success: function(data) {
                                            },
                                            error: function(status) {
                                                console.log(status);
                                            }
                                        });
                                    },
                                    async: false
                                });
                                //End of Resource Rating work.
                                //alert('Publication "'+IssueNo+'" Resources successfully synced');
                                $.ajax({
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json; charset=utf-8'
                                    },
                                    type: 'POST',
                                    url: '/_replicate',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/groups',
                                        "target": 'groups',
                                        'doc_ids': cumulativeCourseIDs
                                    }),
                                    success: function (response) {
                                        //Issue#355: Courses | Nation>>Community Undefined user created
                                        that.removeLeaderAndMemberDetails(cumulativeCourseIDs);
                                        $.ajax({
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json; charset=utf-8'
                                            },
                                            type: 'POST',
                                            url: '/_replicate',
                                            dataType: 'json',
                                            data: JSON.stringify({
                                                "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/coursestep',
                                                "target": 'coursestep',
                                                'doc_ids': cumulativeCourseStepIDs
                                            }),
                                            success: function (response) {
                                                var nationUrl = 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') +
                                                    '/publications/' + publicationToSync._id;

                                                $.ajax({
                                                    url: nationUrl,
                                                    type: 'GET',
                                                    dataType: 'jsonp',
                                                    success: function (publicationDoc) {
                                                        //put here
                                                        // mark this publication as synced at community couchdb.We are informing the nation about it as well
                                                        // so that nations can see which communities have successfully downladed the publication.
                                                        //If the publication is already synced then no need to save it again in the db's, that's why assigning
                                                        // appropriate value to the isAlreadyExist variable.
                                                        var isAlreadyExist = true;
                                                        if(publicationDoc.downloadedByCommunities && publicationDoc.downloadedByCommunities != undefined) {
                                                            if(publicationDoc.downloadedByCommunities.indexOf(App.configuration.get('name')) == -1) {
                                                                publicationDoc.downloadedByCommunities.push(App.configuration.get('name'));
                                                                isAlreadyExist = false;
                                                            }
                                                        }
                                                        //If a publication doc does not contain the downloadedByCommunities field then it means that this
                                                        // publication was before Issue#48 implementation, so saving it in the db to maintain the value
                                                        // of "synced/not synced" for the older publications too.
                                                        if(isAlreadyExist == false || publicationDoc.downloadedByCommunities == undefined) {
                                                            $.couch.db("publications").saveDoc(publicationDoc, {
                                                                success: function (response) {
                                                                    console.log("adding publication# " + publicationDoc.IssueNo + " doc at community for bookkeeping");
                                                                    $.ajax({
                                                                        headers: {
                                                                            'Accept': 'application/json',
                                                                            'Content-Type': 'application/json; charset=utf-8'
                                                                        },
                                                                        type: 'POST',
                                                                        url: '/_replicate',
                                                                        dataType: 'json',
                                                                        data: JSON.stringify({
                                                                            "source": "publications",
                                                                            "target": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/publications',
                                                                            "doc_ids": [publicationDoc._id]
                                                                        }),
                                                                        success: function (response) {
                                                                        },
                                                                        error: function (res) {
                                                                            console.log(res);
                                                                        }
                                                                    });
                                                                },
                                                                error: function (jqXHR, textStatus, errorThrown) {
                                                                    console.log(errorThrown);
                                                                }
                                                            });
                                                        }
                                                        //My code for lastPublicationsSyncDate
                                                        // Update lastPublicationsSyncDate at Nation's Community Records
                                                        var communitycode = App.configuration.get('code');
                                                        $.ajax({
                                                            url:'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true',
                                                            type: 'GET',
                                                            dataType: 'jsonp',
                                                            success: function(result){
                                                                var doc, communityModelId;
                                                                for(var i = 0 ; i < result.rows.length ; i++) {
                                                                    var code;
                                                                    if(result.rows[i].value.Code != undefined){
                                                                        code = result.rows[i].value.Code;
                                                                    } else {
                                                                        code = result.rows[i].value.code;
                                                                    }
                                                                    if(communitycode == code) {
                                                                        doc = result.rows[i].value;
                                                                    }
                                                                }
                                                                if(doc != undefined) {
                                                                    communityModelId = doc._id;
                                                                }
                                                                //Replicate from Nation to Community
                                                                $.ajax({
                                                                    headers: {
                                                                        'Accept': 'application/json',
                                                                        'Content-Type': 'application/json; charset=utf-8'
                                                                    },
                                                                    type: 'POST',
                                                                    url: '/_replicate',
                                                                    dataType: 'json',
                                                                    data: JSON.stringify({
                                                                        "source": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
                                                                        "target": "community",
                                                                        "doc_ids": [communityModelId]
                                                                    }),
                                                                    success: function(response){
                                                                        var date = new Date();
                                                                        var year = date.getFullYear();
                                                                        var month = (1 + date.getMonth()).toString();
                                                                        month = month.length > 1 ? month : '0' + month;
                                                                        var day = date.getDate().toString();
                                                                        day = day.length > 1 ? day : '0' + day;
                                                                        var formattedDate = month + '-' + day + '-' + year;
                                                                        $.ajax({
                                                                            url: '/community/_design/bell/_view/getCommunityByCode?_include_docs=true',
                                                                            type: 'GET',
                                                                            dataType: 'json',
                                                                            success: function (res) {
                                                                                if (res.rows.length > 0) {
                                                                                    var communityModel;
                                                                                    for(var i = 0 ; i < result.rows.length ; i++) {
                                                                                        var code;
                                                                                        if(result.rows[i].value.Code != undefined){
                                                                                            code = result.rows[i].value.Code;
                                                                                        } else {
                                                                                            code = result.rows[i].value.code;
                                                                                        }
                                                                                        if(communitycode == code) {
                                                                                            communityModel = result.rows[i].value;
                                                                                        }
                                                                                    }
                                                                                    if(communityModel != undefined) {
                                                                                        communityModel.lastPublicationsSyncDate = month + '/' + day + '/' + year;
                                                                                    }
                                                                                    //Update the record in Community db at Community Level
                                                                                    $.ajax({

                                                                                        headers: {
                                                                                            'Accept': 'application/json',
                                                                                            'Content-Type': 'multipart/form-data'
                                                                                        },
                                                                                        type: 'PUT',
                                                                                        url: App.Server + '/community/' + communityModelId + '?rev=' + communityModel._rev,
                                                                                        dataType: 'json',
                                                                                        data: JSON.stringify(communityModel),
                                                                                        success: function (response) {
                                                                                            //Replicate from Community to Nation
                                                                                            $.ajax({
                                                                                                headers: {
                                                                                                    'Accept': 'application/json',
                                                                                                    'Content-Type': 'application/json; charset=utf-8'
                                                                                                },
                                                                                                type: 'POST',
                                                                                                url: '/_replicate',
                                                                                                dataType: 'json',
                                                                                                data: JSON.stringify({
                                                                                                    "source": "community",
                                                                                                    "target": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
                                                                                                    "doc_ids": [communityModelId]
                                                                                                }),
                                                                                                success: function(response){
                                                                                                    alert(App.languageDict.attributes.Pubs_Replicated_Success)
                                                                                                    App.stopActivityIndicator();
                                                                                                },
                                                                                                async: false
                                                                                            });
                                                                                        },

                                                                                        async: false
                                                                                    });
                                                                                }
                                                                            }
                                                                        });
                                                                    },
                                                                    async: false
                                                                });
                                                            },
                                                            error: function(err){
                                                                console.log(err);
                                                            }
                                                        });
                                                        //End of my code.

                                                    },
                                                    error: function(jqXHR, status, errorThrown){
                                                        console.log(status);
                                                    }
                                                });
                                            },
                                            error: function(jqXHR, status, errorThrown){
                                            console.log(status);
                                            App.stopActivityIndicator();
                                            alert(App.languageDict.attributes.CourseSteps_Synced_Error);
                                            }
                                        });
                                    },
                                    error: function(jqXHR, status, errorThrown){
                                    console.log(status);
                                    App.stopActivityIndicator();
                                    alert(App.languageDict.attributes.Courses_Synced_Error);
                                    }
                                })
                            },
                            error: function(jqXHR, status, errorThrown){
                                console.log(status);
                                $.couch.db("tempresources").drop({
                                    success: function(data) {
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    }
                                });
                                App.stopActivityIndicator();
                                alert(App.languageDict.attributes.Resources_Synced_Error);
                            }
                        });
                    }
                });
            },
            removeLeaderAndMemberDetails: function(cumulativeCourseIDs){
                var courseInPubIdes = '', courseData=[];
                _.each(cumulativeCourseIDs, function(item) {
                    courseInPubIdes +=  '"' + item + '",'
                })
                if (courseInPubIdes != ''){
                    courseInPubIdes = courseInPubIdes.substring(0, courseInPubIdes.length - 1);
                }
                var groupColl = new App.Collections.Groups();
                groupColl.keys = encodeURI(courseInPubIdes)
                groupColl.fetch({
                    async: false
                });
               for(var i=0;i<groupColl.length;i++) {
                   var courseModel = groupColl.models[i];
                   courseModel.set('courseLeader',[]);
                   courseModel.set('members',[]);
                   courseData.push(courseModel);
               }
                $.couch.db("groups").bulkSave({"docs": courseData}, {
                    success: function(data) {
                        console.log(data);
                    },
                    error: function(status) {
                        console.log(status);
                    }
                });
            },
            synResources:function(nationUrl,nationName,resourcesIdes,IssueNo){
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    type: 'POST',
                    url: '/_replicate',
                    dataType: 'json',
                    data: JSON.stringify({
                        "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/resources',
                        "target": 'resources',
                        'doc_ids': resourcesIdes
                    }),
                    success: function (response) {
                        alert(App.languageDict.attributes.Publication+' ' +IssueNo+' '+ App.languageDict.attributes.Resources_Synced_Success);
                    },
                    error: function(jqXHR, status, errorThrown){
                        console.log(status);
                    }
                })
            }
        })
    });

$(function () {

    App.Views.SurveyTable = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        surveyInfo:[],
        add: function (model, isAlreadyDownloaded, isSubmitted, memberId) {
            this.surveyInfo[model._id]= model;
            if (isAlreadyDownloaded == false) {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                '" class="downloadSurvey btn btn-info">' + App.languageDict.get('Download') + '</a><label>&nbsp&nbsp' + App.languageDict.get('New') + '</label></td></tr>');
            } else {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                    '" class="openSurvey btn btn-info" href="#openSurvey/' + model._id + '/' + isSubmitted + '/' + memberId +
                    '">' + App.languageDict.get('Open') + '</a></td></tr>');
            }
        },
        events:{
            "click .downloadSurvey": 'downloadSurvey'
        },
        render: function () {
            var that = this;
            var members = new App.Collections.Members()
            var member, memberId;
            members.login = $.cookie('Member.login');
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            });
            var config = new configurations();
            config.fetch({
                async: false
            });
            var jsonConfig = config.first().toJSON().rows[0].doc;
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        for(var i = 0; i < members.length; i++)
                        {
                            if(members.models[i].get("community") == jsonConfig.code)
                            {
                                member = members.models[i];
                                memberId = member.get('login') + '_' + member.get('community');
                                break;
                            }
                        }
                    }
                }
            });
            this.$el.html('<tr><th>' + App.languageDict.get('Survey_Number') + '</th><th>' + App.languageDict.get('Title') + '</th><th>' + App.languageDict.get('Actions') + '</th></tr>');
            var nationName = App.configuration.get('nationName');
            var nationUrl = App.configuration.get('nationUrl');
            var SurveyDocsFromComm=[];
            $.ajax({
                url: '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                type: 'GET',
                dataType: 'json',
                async:false,
                success: function(commSurdata) {
                    _.each(commSurdata.rows, function(row) {
                        SurveyDocsFromComm.push(row);
                    });
                },
                error: function(status) {
                    console.log(status);
                }
            });
            that.getSurveys(SurveyDocsFromComm);
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },
        renderSurveys: function (surveyArray,localSurvey) {
            surveyArray.sort(this.sortByProperty('SurveyNo'));
            localSurvey.sort(this.sortByPropertyInDecreasingOrder('SurveyNo'));

            for(var i=0;i<surveyArray.length;i++)
            {
                this.add(surveyArray[i],false,false,null);
            }
            for(var i=0;i<localSurvey.length;i++)
            {
                this.add(localSurvey[i],true,false,null);
            }

        },

        sortByProperty: function(property) {
            'use strict';
            return function (a, b) {
                var sortStatus = 0;
                if (a[property] < b[property]) {
                    sortStatus = -1;
                } else if (a[property] > b[property]) {
                    sortStatus = 1;
                }

                return sortStatus;
            };
        },
        sortByPropertyInDecreasingOrder: function(property) {
            'use strict';
            return function (a, b) {
                var sortStatus = 0;
                if (a[property] < b[property]) {
                    sortStatus = 1;
                } else if (a[property] > b[property]) {
                    sortStatus = -1;
                }

                return sortStatus;
            };
        },

        getSurveys: function(SurveyDocsFromComm){
            var nationName = App.configuration.get('nationName');
            var nationUrl = App.configuration.get('nationUrl');
            var surveyArray=[];
            var that=this;
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                type: 'GET',
                dataType: 'jsonp',
                success: function (json) {
                    var SurveyDocsFromNation = [];
                    _.each(json.rows, function(row) {
                        if(row.value.submittedBy.indexOf(App.configuration.get('name')) == -1) {
                            SurveyDocsFromNation.push(row);
                        }
                    });
                    _.each(SurveyDocsFromNation,function(row){
                        var surveyFromNation = row.value;
                        var index = SurveyDocsFromComm.map(function(element) {
                            return element.value._id;
                        }).indexOf(surveyFromNation._id);
                        if (index == -1) { // its a new or yet-to-be-download survey from nation, so display it as new
                            surveyArray.push( surveyFromNation);
                        }
                    });
                    var localSurvey = [];
                    for(var i = 0 ; i < SurveyDocsFromComm.length ; i++) {
                        var surveyDoc = SurveyDocsFromComm[i].value;
                        localSurvey.push( surveyDoc);
                    }
                    that.renderSurveys(surveyArray,localSurvey);
                },
                async: false
            });
        },
        downloadSurvey: function(e) {
            App.startActivityIndicator();
            var surveyId = [];
            surveyId.push(e.currentTarget.name);
            var surveyToDownload = this.surveyInfo[surveyId];
            var surveyQuestionIds = surveyToDownload.questions;
            var nationName = App.configuration.get('nationName');
            var nationUrl = App.configuration.get('nationUrl');
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": 'http://'+ nationName + ':oleoleole@' + nationUrl + '/survey',
                    "target": "survey",
                    'doc_ids': surveyId
                }),
                async: false,
                success: function (response) {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": 'http://'+ nationName + ':oleoleole@' + nationUrl + '/surveyquestions',
                            "target": "surveyquestions",
                            'doc_ids': surveyQuestionIds
                        }),
                        async: false,
                        success: function (response) {
                            alert(App.languageDict.get('Survey_Download_Success_Msg'));
                            window.location.reload(false);
                        },
                        error: function(status) {
                            console.log(App.languageDict.get('Survey_Download_Error_Ques'));
                        }
                    });
                },
                error: function(status) {
                    console.log(App.languageDict.get('Survey_Download_Error_Msg'));
                }
            });
        }
    })
});

$(function() {

    App.Views.SurveyQuestionTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",
        id: "survey-questions-table",

        initialize: function() {
        },
        addOne: function(model) {
            var surveyQuestionRowView = new App.Views.SurveyQuestionRow({
                model: model
            })
            surveyQuestionRowView.Id = this.Id
            surveyQuestionRowView.render()
            this.$el.append(surveyQuestionRowView.el)
        },

        addAll: function() {
            if (this.collection.length == 0)
                this.$el.append('<tr><td colspan="2"> '+App.languageDict.get('empty_Survey')+'<td></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});

$(function() {

    App.Views.SurveyQuestionRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
        },

        vars: {},

        template: _.template($("#template-surveyQuestionRow").html()),

        initialize: function(e) {
        },

        render: function() {
            var vars = this.model.toJSON()
            vars.Statement = vars.Statement.replace(/\s+/g, " ");
            this.$el.append(this.template(vars))
        }


    })

});

$(function() {

    App.Views.SurveyAnswerTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        initialize: function() {
        },
        addOne: function(model) {
            var surveyAnswerRowView = new App.Views.SurveyAnswerRow({
                model: model
            })
            surveyAnswerRowView.Id = this.Id
            surveyAnswerRowView.render()
            this.$el.append(surveyAnswerRowView.el)
        },

        addAll: function() {
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});

$(function() {

    App.Views.SurveyAnswerRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
        },

        vars: {},

        template: _.template($("#template-surveyAnswerRow").html()),

        initialize: function(e) {
        },

        render: function() {
            var vars = this.model.toJSON()
            this.$el.append(this.template(vars))
        }


    })

});

$(function () {

    App.Views.SurveyTableForMembers = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",

        events:{

        },

        add: function (model, isSubmitted, memberId) {
            if (isSubmitted) {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                    '" class="openSurvey btn btn-info" href="#openSurvey/' + model._id + '/' + isSubmitted + '/' + memberId +
                    '">' + App.languageDict.get('Open') + '</a><label>&nbsp&nbsp' + App.languageDict.get('Submitted') + '</label></td></tr>');
            } else {
                this.$el.append('<tr id="' + model._id + '"><td>' + model.SurveyNo+ '</td><td>' + model.SurveyTitle+ '</td><td><a name="' +model._id +
                    '" class="openSurvey btn btn-info" href="#openSurvey/' + model._id + '/' + isSubmitted + '/' + memberId +
                    '">' + App.languageDict.get('Open') + '</a><label>&nbsp&nbsp' + App.languageDict.get('Un_Submitted') + '</label></td></tr>');
            }
        },

        render: function () {
            var that = this;
            this.$el.html('<tr><th>' + App.languageDict.get('Survey_Number') + '</th><th>' + App.languageDict.get('Title') + '</th><th>' + App.languageDict.get('Actions') + '</th></tr>');
            var members = new App.Collections.Members()
            var member, memberId;
            members.login = $.cookie('Member.login');
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            });
            var config = new configurations();
            config.fetch({
                async: false
            });
            var jsonConfig = config.first().toJSON().rows[0].doc;
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        for(var i = 0; i < members.length; i++)
                        {
                            if(members.models[i].get("community") == jsonConfig.code)
                            {
                                member = members.models[i];
                                memberId = member.get('login') + '_' + member.get('community');
                                $.ajax({
                                    url: '/survey/_design/bell/_view/surveyByreceiverIds?_include_docs=true&key="' + memberId + '"',
                                    type: 'GET',
                                    dataType: 'json',
                                    async:false,
                                    success: function(memberSurveyData) {
                                        var surveyDocs = [];
                                        _.each(memberSurveyData.rows, function(row) {
                                            surveyDocs.push(row);
                                        });
                                        $.ajax({
                                            url: '/surveyresponse/_design/bell/_view/surveyResBymemberId?_include_docs=true&key="' + memberId + '"',
                                            type: 'GET',
                                            dataType: 'json',
                                            async:false,
                                            success: function(memberSurveyResData) {
                                                var surveyResDocs = [];
                                                _.each(memberSurveyResData.rows, function(row) {
                                                    surveyResDocs.push(row);
                                                });
                                                var submitted = [];
                                                var unSubmitted = [];
                                                _.each(surveyDocs,function(row){
                                                    var surveyDoc  = row.value;
                                                    var index = surveyResDocs.map(function(element) {
                                                        return element.value.SurveyNo;
                                                    }).indexOf(surveyDoc.SurveyNo);
                                                    if (index == -1) { // its a survey which is not submitted yet
                                                        unSubmitted.push(surveyDoc);
                                                    } else { // its an already submitted survey.
                                                        submitted.push(surveyDoc);
                                                    }
                                                });
                                                unSubmitted.sort(that.sortByProperty('SurveyNo'));
                                                submitted.sort(that.sortByPropertyInDecreasingOrder('SurveyNo'));
                                                var isSubmitted = false;
                                                for(var i = 0 ; i < unSubmitted.length ; i++) {
                                                    var surDoc = unSubmitted[i];
                                                    that.add(surDoc, isSubmitted, memberId);
                                                }
                                                for(var i = 0 ; i < submitted.length ; i++) {
                                                    var surDoc = submitted[i];
                                                    isSubmitted = true;
                                                    that.add(surDoc, isSubmitted, memberId);
                                                }
                                            },
                                            error: function(status) {
                                                console.log(status);
                                            }
                                        });
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    }
                                });
                            }
                        }
                    }
                },
                async:false

            });
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        sortByProperty: function(property) {
            'use strict';
            return function (a, b) {
                var sortStatus = 0;
                if (a[property] < b[property]) {
                    sortStatus = -1;
                } else if (a[property] > b[property]) {
                    sortStatus = 1;
                }

                return sortStatus;
            };
        },

        sortByPropertyInDecreasingOrder: function(property) {
            'use strict';
            return function (a, b) {
                var sortStatus = 0;
                if (a[property] < b[property]) {
                    sortStatus = 1;
                } else if (a[property] > b[property]) {
                    sortStatus = -1;
                }

                return sortStatus;
            };
        },

    })
});

$(function() {
    //This form/view is binded with Configuration model
    App.Views.CommunityConfigurationsForm = Backbone.View.extend({

        className: "addNation-form",

        vars: {},

        events: {
            "click #commConfigFormButton":"validateForm"
        },

        template: $('#template-addCommunity').html(),

        render: function() {
            var configDoc = getCommunityConfigs();
            var centralNationUrl = getCentralNationUrl();
            var that = this;
            var vars = {};
            //Check if it is a new community or an older one with registrationRequest attribute
            if(!configDoc.hasOwnProperty('registrationRequest')) {
                $('#nav').css('pointer-events', 'none');
            }
            vars["nations"] = [];
            vars["languages"] = [];
            vars.languages = getAvailableLanguages();
            vars.languageDict=App.languageDict;
            if(navigator.onLine){ //Check if there is a stable internet connection
                $.ajax({
                    url: 'http://' + centralNationUrl + '/nations/_design/bell/_view/getAllNations?_include_docs=true',
                    type: 'GET',
                    dataType: 'jsonp',
                    async: false,
                    success: function (json) {
                        for(var i = 0 ; i < json.rows.length ; i++) {
                         vars.nations.push(json.rows[i].value);
                        }
                        that.$el.append(_.template(that.template, vars));
                        that.makeFormMultiLingual();
                        if(that.model.get('_id') != undefined) {
                            that.setFormValues()
                        }
                    },
                    error: function (status) {
                        console.log(status);
                    }
                });
            } else {
                alert(App.languageDict.get('offline_Status_warning'));
                that.$el.append(_.template(that.template, vars));
                if(that.model.get('_id') != undefined) {
                    that.setFormValues()
                }
            }
        },
        makeFormMultiLingual: function () {
            $('#community-name').attr('title',App.languageDict.get('title_msg_required'));
            $('#community-name').attr('placeholder',App.languageDict.get('Name'));
            $('#community-code').attr('title',App.languageDict.get('title_msg_required'));
            $('#community-code').attr('placeholder',App.languageDict.get('Code'));
            $('#community-region').attr('placeholder',App.languageDict.get('Region'));
            $('#org-name').attr('placeholder',App.languageDict.get('Name'));
            $('#org-address').attr('placeholder',App.languageDict.get('Address'));
            $('#org-url').attr('placeholder',App.languageDict.get('Url'));
            $('#org-firstname').attr('placeholder',App.languageDict.get('First_Name'));
            $('#org-middlename').attr('placeholder',App.languageDict.get('Middle_Names'));
            $('#org-lastname').attr('placeholder',App.languageDict.get('Last_Name'));
            $('#org-phone').attr('placeholder',App.languageDict.get('Phone'));
            $('#org-email').attr('placeholder',App.languageDict.get('Email'));
            $('#leader-firstname').attr('placeholder',App.languageDict.get('First_Name'));
            $('#leader-middlename').attr('placeholder',App.languageDict.get('Middle_Names'));
            $('#leader-lastname').attr('placeholder',App.languageDict.get('Last_Name'));
            $('#leader-phone').attr('placeholder',App.languageDict.get('Phone'));
            $('#leader-email').attr('placeholder',App.languageDict.get('Email'));
        },
        setFormValues: function () {
            var that = this;
            $('#community-name').val(that.model.get('name'));
            if(that.model.get('name') != undefined) {
                $('#community-code').val(that.model.get('code'));
            }
            $('#nation-selector').val(that.model.get('nationName') + ',' + that.model.get('nationUrl'));
            $('#language-selector').val(that.model.get('currentLanguage'));
            $('#community-region').val(that.model.get('region'));
            $('#org-name').val(that.model.get('sponsorName'));
            $('#org-address').val(that.model.get('sponsorAddress'));
            $('#org-url').val(that.model.get('sponsorUrl'));
            $('#org-firstname').val(that.model.get('contactFirstName'));
            $('#org-middlename').val(that.model.get('contactMiddleName'));
            $('#org-lastname').val(that.model.get('contactLastName'));
            $('#org-phone').val(that.model.get('contactPhone'));
            $('#org-email').val(that.model.get('contactEmail'));
            $('#leader-firstname').val(that.model.get('superManagerFirstName'));
            $('#leader-middlename').val(that.model.get('superManagerMiddleName'));
            $('#leader-lastname').val(that.model.get('superManagerLastName'));
            $('#leader-phone').val(that.model.get('superManagerPhone'));
            $('#leader-email').val(that.model.get('superManagerEmail'));
        },

        validateForm: function () {
            var isAllAttributesValid = [];
            var alertMessage = '';
            var formElements = document.getElementById("communityFrom").elements;
            for (var i = 0, element; element = formElements[i++];) {
                if(element.type == "text" || element.type == "email") {
                    if (element.value.trim() != '') {
                        isAllAttributesValid.push(true);
                    } else {
                        if(element.placeholder != App.languageDict.get('Middle_Names')) {
                            isAllAttributesValid.push(false);
                            alertMessage = App.languageDict.get('fill_all_fields');
                        }
                    }
                } else {
                    if (element.value != App.languageDict.get('Select_Language') && element.value != App.languageDict.get('select_nation')) {
                        isAllAttributesValid.push(true);
                    } else {
                        isAllAttributesValid.push(false);
                        if(alertMessage == '') {
                            alertMessage = App.languageDict.get('pls_select_' + element.name.split('-').pop());
                        }
                    }
                }
            }

            //Check for Duplicate name of Community on Cetral Nation i.e., nbs.ole.org:5997
            var that = this;
            var selectedNation = $('#nation-selector').val();
            var nationName = selectedNation.split(',')[0];
            var nationUrl = selectedNation.split(',')[1];
            var communityName = $.trim($('#community-name').val());
            communityName = communityName.toLowerCase();

            var communityCode=  $.trim($('#community-code').val());
            communityCode = communityCode.toLowerCase();
            var configDoc = getCommunityConfigs();
            var comId = this.model.get('_id');

                var centralNationUrl = getCentralNationUrl();
                var nationName  = centralNationUrl.split('.')[0];
                var alertDuplicatename = "Already used, Please change red marked field";
                $.ajax({
                    url: 'http://' + centralNationUrl + '/communityregistrationrequests/_design/bell/_view/getDoc?_include_docs=true&key="'+nationUrl+'"',
                    //   url: 'http://' + nationName + ':' + nationPassword + '@' + centralNationUrl + '/communityregistrationrequests/_design/bell/_view/getDoc?_include_docs=true&key="'+communityName+'"',
                    type: 'GET',
                    dataType: 'jsonp',
                    async: false,
                    success: function(json) {

                        var jsonModels = json.rows;
                        //check for matched results if it is on the same nation and have same community name and code. If matched prompt user to enter another name
                        if (jsonModels.length > 0 && jsonModels!=[]){

                            var duplicateName = 0;
                            var duplicateCode = 0;

                            for (var i = 0; i < jsonModels.length; i++) {
                                var community = jsonModels[i].value;
                                var cName = community.Name.toLowerCase()
                                var cCode = community.Code.toLowerCase()

                                if (cName == communityName && cCode == communityCode && community._id != comId) {
                                    duplicateName = 1;
                                    duplicateCode = 1;
                                }
                                else if(cName == communityName && cCode != communityCode && community._id != comId ){
                                    duplicateName = 1;
                                }
                                else if(cName != communityName && cCode == communityCode && community._id != comId){
                                    duplicateCode = 1;
                                }
                            }
                            if(duplicateName == 1 && duplicateCode == 1) {
                                $("#community-name").css("border", "1px solid red");
                                $("#community-code").css("border", "1px solid red");
                                alert(alertDuplicatename);
                            }
                            else if(duplicateName == 1) {
                                $("#community-name").css("border", "1px solid red");
                                $("#community-code").css("border", "");
                                alert(alertDuplicatename);
                            }
                            else if(duplicateCode == 1) {
                                $("#community-code").css("border", "1px solid red");
                                $("#community-name").css("border", "");
                                alert(alertDuplicatename);
                            }
                            else {
                                if (isAllAttributesValid.indexOf(false) == -1) {
                                    $("#community-name").css("border", "");
                                    $("#community-code").css("border", "");

                                    that.setForm();
                                } else {
                                    $("#community-name").css("border", "");
                                    $("#community-code").css("border", "");
                                    alert(alertMessage);
                                    return;
                                }
                            }
                        }
                        //If Community name does not already exist on the Nation nbs then check if all the fields are filled or not
                        else{
                            if (isAllAttributesValid.indexOf(false) == -1) {
                                that.setForm();
                            } else {
                                alert(alertMessage);
                                return;
                            }
                        }
                    },
                    error: function(error) {
                        console.log(error);
                        alert("Unable to contact Central database");
                        App.stopActivityIndicator();
                    }
                });
        },
        isChanged: function(model , config ){
           if(model.get('name')==config.name &&
                model.get('code')== config.code &&
            model.get('nationName')== config.nationName &&
            model.get('nationUrl')==config.nationUrl &&
            model.get('currentLanguage')== config.currentLanguage&&
            model.get('region')==config.region &&
            model.get('sponsorName')==config.sponsorName &&
            model.get('sponsorAddress')==config.sponsorAddress&&
            model.get('sponsorUrl')== config.sponsorUrl &&
            model.get('contactFirstName')== config.contactFirstName &&
            model.get('contactMiddleName')== config.contactMiddleName&&
            model.get('contactLastName')== config.contactLastName &&
            model.get('contactPhone')==config.contactPhone &&
            model.get('contactEmail')== config.contactEmail &&
            model.get('superManagerFirstName')== config.superManagerFirstName &&
            model.get('superManagerMiddleName')==config.superManagerMiddleName &&
            model.get('superManagerLastName')==config.superManagerLastName &&
            model.get('superManagerPhone')==config.superManagerPhone &&
            model.get('superManagerEmail')== config.superManagerEmail
           ) {

               return false;

           }
            else{

               return true;
           }

        },

        setForm: function() {
            App.startActivityIndicator();
            var centralNationUrl = getCentralNationUrl();
            var configDoc = getCommunityConfigs();
            var oldCode = this.model.get('code');
            var newCode = $.trim($('#community-code').val());
            if(oldCode != newCode) {
                this.changeMembersCommunity(oldCode, newCode);
                this.changeCodeInActivityLogs(newCode);
            }
            var prevNation = this.model.get('nationName') + ',' + this.model.get('nationUrl');
            var that = this;
            var selectedNation = $('#nation-selector').val();
            var nationName = selectedNation.split(',')[0];
            var nationUrl = selectedNation.split(',')[1];
            this.model.set({
                name: $.trim($('#community-name').val()),
                code: $.trim($('#community-code').val()),
                nationName: nationName,
                nationUrl: nationUrl,
                currentLanguage: $('#language-selector').val(),
                region: $.trim($('#community-region').val()),
                sponsorName: $('#org-name').val(),
                sponsorAddress: $('#org-address').val(),
                sponsorUrl: $('#org-url').val(),
                contactFirstName: $('#org-firstname').val(),
                contactMiddleName: $('#org-middlename').val(),
                contactLastName: $('#org-lastname').val(),
                contactPhone: $('#org-phone').val(),
                contactEmail: $('#org-email').val(),
                superManagerFirstName: $('#leader-firstname').val(),
                superManagerMiddleName: $('#leader-middlename').val(),
                superManagerLastName: $('#leader-lastname').val(),
                superManagerPhone: $('#leader-phone').val(),
                superManagerEmail: $('#leader-email').val(),
                countDoubleUpdate: 0,
                subType:'dummyy',
                type: 'community',
                kind: 'Community',
                //Temporarily adding these attributes
                Name: $.trim($('#community-name').val()),
                Code: $.trim($('#community-code').val())
            });
            if(configDoc.registrationRequest == 'rejected' || prevNation != selectedNation) {
                this.model.set('registrationRequest', 'pending');
            }

            if(this.model.get('registrationRequest') == 'pending' || this.isChanged(this.model ,configDoc )){

                this.model.set('registrationRequest', 'pending');
                App.stopActivityIndicator();

            that.model.save(null, {
                success: function (model, response) {
                    var docIds = [];
                    var id = that.model.get('id');
                    docIds.push(id);
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": "configurations",
                            "target": 'http://' + centralNationUrl + '/communityregistrationrequests',
                            'doc_ids': docIds
                        }),
                        async: false,
                        success: function (response) {
                            App.stopActivityIndicator();
                            alert(App.languageDict.get('Successfully_Registered'));
                            window.location.href = '#dashboard';
                        },
                        error: function(status) {
                            console.log(status);
                            alert(App.languageDict.attributes.UnableToReplicate);
                            App.stopActivityIndicator();
                        }
                    });
                }
            });
            } else{
                alert("you have not made any changes");
                App.stopActivityIndicator();
            }

        },
        changeCodeInActivityLogs: function(newCode){
            var currentdate = new Date();
            var year = currentdate.getFullYear();
            var month = (1 + currentdate.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = currentdate.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            var logcurrentdate = year + '/' + month + '/' + day;
            $.ajax({
                type: 'GET',
                url: '/activitylog/_design/bell/_view/getDocumentByDate?key="'+ logcurrentdate +'"',
                dataType: 'json',
                success: function (response) {
                    var logModel = response.rows[0].value;
                    logModel.community = newCode;

                    //Now Posting the Updated Activitylog Model
                    $.ajax({
                        type: 'PUT',
                        url: '/activitylog/'+ logModel._id +'/?rev=' + logModel._rev,
                        data: JSON.stringify(logModel),
                        async: false,
                        dataType: 'json',
                        success: function (response) {
                        }
                    });
                }
            });
        },

        changeMembersCommunity: function (oldCode, newCode) {
            var members = new App.Collections.Members();
            var member;
            var membersDoc=[];
            members.fetch({
                async:false,
                success:function () {
                    if(members.length > 0) {
                        for(var i = 0 ; i < members.length ; i++) {
                            member = members.models[i];
                            if(oldCode == member.get('community')) {
                                member.set('community',newCode);
                                membersDoc.push(member);
                            }
                        }
                        $.couch.db("members").bulkSave({"docs": membersDoc}, {
                            success: function(data) {
                            },
                            error: function(status) {
                                console.log(status);
                            }
                        });
                    }
                }
            });
        }
    })

});

/**
 * Created by omer.yousaf on 1/27/2015.
 */
$(function() {

    App.Views.TrendActivityReport = Backbone.View.extend({
        vars: {},
        events: {
            /* Sync moved to nation
             "click #syncReport" : function(e){
             App.Router.syncLogActivitiy()
             }*/
        },
        template: $('#template-TrendActivityReport').html(),

        initialize: function() {

        },
        render: function() {
            var context = this;
            context.vars = context.data
            context.vars.startDate = context.startDate
            context.vars.endDate = context.endDate
            context.vars.CommunityName = context.CommunityName;
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            context.vars.languageDict = languageDictValue;
            context.$el.html(_.template(context.template, context.vars));
        }
    })

});

/**
 * Created by saba.baig on 6/6/2016.
 */
$(function() {

    App.Views.AdminForm = Backbone.View.extend({   //This form is used to display the "Become an Administrator" form and
        //this view is bound to 'AdminMember' model

        className: "form",
        id: 'memberform',

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function() {
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            App.configuration = config.first()

            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            var buttonText = "";
            this.$el.append(this.form.render().el)
            this.form.fields['status'].$el.hide()
            this.form.fields['yearsOfTeaching'].$el.hide()
            this.form.fields['teachingCredentials'].$el.hide()
            this.form.fields['subjectSpecialization'].$el.hide()
            this.form.fields['forGrades'].$el.hide()
            this.form.fields['visits'].$el.hide();
            this.form.fields['lastLoginDate'].$el.hide();
            this.form.fields['lastEditDate'].$el.hide();
            this.form.fields['community'].$el.hide();
            this.form.fields['nation'].$el.hide();
            this.form.fields['region'].$el.hide();

            this.form.setValue({
                community: App.configuration.get("name"),
                region: App.configuration.get("region"),
                nation: App.configuration.get("nationName")
            })

            $("input[name='community']").attr("disabled", true);
            $("input[name='region']").attr("disabled", true);
            $("input[name='nation']").attr("disabled", true);


            var $imgt = "<p id='imageText' style='margin-top: 15px;'></p>"
            buttonText = App.languageDict.attributes.Save;
            // give the form a submit button
            var $button = $('<div class="signup-submit"><a class="btn btn-success" id="formButton" style="margin-top: 10px;">' + buttonText+'</button></div>')
            var $upload = $('<form method="post" id="fileAttachment" ><input type="file" name="_attachments"  id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
            var $img = $('<div id="browseImage" >' + $imgt + '<img style="width:100px;height:100px;border-radius:50px" id="memberImage"></div>')
            this.$el.append($img)
            this.$el.append($upload)
            this.$el.append($button)
            if (this.model.id != undefined) {
                if (this.model.get("status") == "active") {
                    $(".signup-submit").append('<a class="btn btn-danger" id="deactive" href="#" style="margin-top: 10px;">'+App.languageDict.attributes.Resign+'</a>')
                } else {
                    $(".signup-submit").append('<a class="btn btn-success" id="active" style="margin-top: 10px;" href="#">'+App.languageDict.attributes.Reinstate+'</a>')
                }
            }
            var attchmentURL = '/members/' + this.model.id + '/'
            if (typeof this.model.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                document.getElementById("memberImage").src = attchmentURL
            }
            
        },

        validImageTypeCheck: function(img) {
            if (img.val() == "") {
                //alert("ERROR: No image selected \n\nPlease Select an Image File")
                return 1
            }
            var extension = img.val().split('.')
            console.log(extension[(extension.length - 1)])
            if (extension[(extension.length - 1)] == 'jpeg' || extension[(extension.length - 1)] == 'jpg' || extension[(extension.length - 1)] == 'png' || extension[(extension.length - 1)] == 'JPG') {
                return 1
            }
            alert(App.languageDict.attributes.Invalid_Image_File)
            return 0
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var that = this;
            var isValid=true;
            if(!this.validateMemberForm())
            {
                isValid=false;
            }
            if(!isValid){
                alert(App.languageDict.attributes.Update_Profile_Reminder);
                return;
            }

            // Put the form's input into the model in memory
            if (this.validImageTypeCheck($('input[type="file"]'))) {
                // assign community, region and nation attribs in member model values from configuration doc
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                });
                var config = new configurations();
                config.fetch({
                    async: false
                });
                console.log('---***********---');
                console.log(config);
                console.log(config.first().toJSON());
                var configsDoc = config.first().toJSON().rows[0].doc;

                this.form.setValue({
                    status: "active",
                    community: configsDoc.code,
                    region: configsDoc.region,
                    nation: configsDoc.nationName,
                    lastEditDate:new Date()
                });
                this.form.commit();
                // Send the updated model to the server
                if ($.inArray("lead", this.model.get("roles")) == -1) {
                    that.model.set("yearsOfTeaching", null)
                    that.model.set("teachingCredentials", null)
                    that.model.set("subjectSpecialization", null)
                    that.model.set("forGrades", null);
                    this.model.set("lastEditDate",new Date());
                    this.model.set("lastLoginDate",new Date());
                }
                this.removeSpaces();
                var addMem = true
                if (this.model.get("_id") == undefined) {
                    this.model.set("visits", 1);
                    if($.cookie('languageFromCookie')===null)
                    {
                        this.model.set("bellLanguage",App.configuration.attributes.currentLanguage);
                    }
                    else
                    {
                        this.model.set("bellLanguage", $.cookie('languageFromCookie'));
                    }
                }
                if (addMem) {
                    var memberModel = this.model;
                    this.model.save(null, {
                        success: function() {
                            ///////////Apni Chezen
                            var date = new Date()
                            $.cookie('Member.login', that.model.get('login'), {
                                path: "/apps/_design/bell"
                            })
                            $.cookie('Member._id', that.model.get('id'), {
                                path: "/apps/_design/bell"
                            })
                            $.cookie('Member.expTime', date, {
                                path: "/apps/_design/bell"
                            })
                            $.cookie('Member.roles', that.model.get('roles'), {
                                path: "/apps/_design/bell"
                            })
                            ////////////////////////////////////
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                            } else {
                                if (that.model.attributes._rev == undefined) {
                                    // if true then its a new member signup
                                    // so capture this in activity logging
                                    var pouchActivityLogDb = new PouchDB('activitylogs');
                                    var currentdate = new Date();
                                    var logdate = that.getFormattedDate(currentdate);
                                    pouchActivityLogDb.get(logdate, function(err, pouchActivityLogRec) {
                                        if (!err) {
                                            that.UpdatejSONlog(logdate, pouchActivityLogRec, memberModel, pouchActivityLogDb);
                                        } else {
                                            that.createJsonlog(logdate, configsDoc, memberModel, pouchActivityLogDb);
                                        }
                                    });
                                }
                            }
                            that.model.on('savedAttachment', function() {
                                if (that.model.attributes._rev == undefined) { // if true then its a new member signup
                                    // so capture this in activity logging
                                    // so capture this in activity logging
                                    var pouchActivityLogDb = new PouchDB('activitylogs');
                                    var currentdate = new Date();
                                    var logdate = that.getFormattedDate(currentdate);
                                    pouchActivityLogDb.get(logdate, function(err, pouchActivityLogRec) {
                                        if (!err) {
                                            that.UpdatejSONlog(logdate, pouchActivityLogRec, memberModel, pouchActivityLogDb);
                                        } else {
                                            that.createJsonlog(logdate, configsDoc, memberModel, pouchActivityLogDb);
                                        }
                                    });
                                } else {
                                    Backbone.history.navigate('dashboard');
                                    window.location.reload();
                                }
                            }, that.model)
                        }
                    })
                }
            }
        },

        removeSpaces: function()
        {
            var firstName = this.model.get("firstName");
            var lastName = this.model.get("lastName");
            var middleName = this.model.get("middleNames");
            var loginName = this.model.get("login");
            this.model.set("firstName", $.trim(firstName));
            this.model.set("lastName", $.trim(lastName));
            this.model.set("middleNames", $.trim(middleName));
            this.model.set("login", $.trim(loginName));
        },

        validateMemberForm : function(){
            var isCorrect=true;
            if ($.trim($('.bbf-form .field-firstName .bbf-editor input').val()) =='' || $('.bbf-form .field-firstName .bbf-editor input').val() ==null || $('.bbf-form .field-firstName .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-firstName label').css('color','red');
            }
            else{

                $('.bbf-form .field-firstName label').css('color','black');
            }
            if ($.trim($('.bbf-form .field-lastName .bbf-editor input').val()) =='' || $('.bbf-form .field-lastName .bbf-editor input').val() ==null || $('.bbf-form .field-lastName .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-lastName label').css('color','red');
            }
            else
            {

                $('.bbf-form .field-lastName label').css('color','black');
            }
            if ($.trim($('.bbf-form .field-login .bbf-editor input').val()) =='' || $('.bbf-form .field-login .bbf-editor input').val() ==null || $('.bbf-form .field-login .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-login label').css('color','red');
            }
            else{

                $('.bbf-form .field-login label').css('color','black');
            }
            if ( $('.bbf-form .field-password .bbf-editor input').val() =='' || $('.bbf-form .field-password .bbf-editor input').val() ==null || $('.bbf-form .field-password .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-password label').css('color','red');
            }
            else{

                $('.bbf-form .field-password label').css('color','black');
            }
            if ( $('.bbf-form .field-phone .bbf-editor input').val() =='' || $('.bbf-form .field-phone .bbf-editor input').val() ==null || $('.bbf-form .field-phone .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-phone label').css('color','red');
            }
            else{

                $('.bbf-form .field-phone label').css('color','black');
            }
            if ( $('.bbf-form .field-email .bbf-editor input').val() =='' || $('.bbf-form .field-email .bbf-editor input').val() ==null || $('.bbf-form .field-email .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-email label').css('color','red');
            }
            else{

                $('.bbf-form .field-email label').css('color','black');
            }

            if ( $('.bbf-form .field-Gender .bbf-editor select').val() =='' || $('.bbf-form .field-Gender .bbf-editor select').val() ==null || $('.bbf-form .field-Gender .bbf-editor select').val() ==undefined  ) {
                // $('.bbf-form .field-Gender label').html(App.languageDict.attributes.Gender + '[ '+App.languageDict.attributes.Required_Text + ']');
                isCorrect=false;
                $('.bbf-form .field-Gender label').css('color','red');   //shows that Gender is not correct.
            }
            else{

                $('.bbf-form .field-Gender label').css('color','black');
            }
            if($('.bbf-form .field-levels .bbf-editor select').val() =='' || $('.bbf-form .field-levels .bbf-editor select').val() ==null || $('.bbf-form .field-levels .bbf-editor select').val() ==undefined) {
                //$('.bbf-form .field-levels .bbf-error').html(App.languageDict.attributes.Required_Text);
                isCorrect=false;
                $('.bbf-form .field-levels label').css('color','red');
            }
            else{

                $('.bbf-form .field-levels label').css('color','black');
            }
            if( //validations for date
            $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==''
            || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==null ||
            $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==undefined ||
            //validations for month
            $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==''
            || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==null || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==undefined
            //validations for year
            ||$('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()=='' || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()==null ||
            $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()==undefined ) {
                // $('.bbf-form .field-BirthDate .bbf-error').html(App.languageDict.attributes.Required_Text);
                isCorrect=false;
                $('.bbf-form .field-BirthDate label').css('color','red');
            }
            else{
                //Now, validate age range [5,100] (Inclusive)
                if(this.getAgeOfUser()<5 || this.getAgeOfUser()>100) {
                    alert(App.languageDict.attributes.Birthday_Range);
                    isCorrect = false;
                    $('.bbf-form .field-BirthDate label').css('color','red');
                }
                else{

                    $('.bbf-form .field-BirthDate label').css('color','black');
                }
            }
            return isCorrect;
        },

        getAgeOfUser: function()
        {
            var  birthDate=new Date($('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val(),
                $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val(),
                $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val());
            var todayDate = new Date();
            var age = todayDate.getFullYear() - birthDate.getFullYear();
            var m = todayDate.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },

        createJsonlog: function(logdate, configsDoc, member, pouchActivityLogDb) {
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                female_new_signups: 0,
                male_new_signups: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: configsDoc.code,
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {
                docJson.male_new_signups = 1;
            } else {
                docJson.female_new_signups = 1;
            }
            pouchActivityLogDb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("created activity log in pouchdb for today.. i-e " + logdate);
                    console.log(response);
                } else {
                    console.log("MyApp::MemberForm.js (view):: createJsonlog: error creating activity log doc in pouchdb..");
                    console.log(err);
                }
                alert(App.languageDict.attributes.Success_Saved_Msg);
                /*Backbone.history.navigate('dash', {
                    trigger: true
                });*/
                window.location.href="#configurationsForm";
            });
        },

        UpdatejSONlog: function(logdate, pouchActivityLogRec, member, pouchActivityLogDb) {
            if (member.get('Gender') == 'Male') {
                pouchActivityLogRec.male_new_signups = parseInt(((pouchActivityLogRec.male_new_signups) ? pouchActivityLogRec.male_new_signups : 0)) + 1;
            } else {
                pouchActivityLogRec.female_new_signups = parseInt(((pouchActivityLogRec.female_new_signups) ? pouchActivityLogRec.female_new_signups : 0)) + 1;
            }
            pouchActivityLogDb.put(pouchActivityLogRec, logdate, pouchActivityLogRec._rev, function(err, response) {
                if (!err) {
                    console.log("updated activity log in pouchdb for today.. i-e " + logdate);
                    console.log(response);
                } else {
                    console.log("MyApp::MemberForm.js (view):: UpdatejSONlog: err making update to record");
                    console.log(err);
                }
                $.cookie("forcedUpdateProfile",'false');
                alert(App.languageDict.attributes.Success_Saved_Msg);
                Backbone.history.navigate('members', {
                    trigger: true
                });
            });
        }
    })

})