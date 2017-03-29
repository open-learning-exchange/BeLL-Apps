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
		                    tagFlag = false;
					for (var i = 0; i < vars.Tag.length; i++) {
                                            if (this.collections.get(vars.Tag[i]) != undefined) {
                                                if (!tagFlag) {
						    Details = Details + "<b>" + App.languageDict.attributes.Collection + "</b>&nbsp;"
						    tagFlag = true;
                                                }
                                                Details = Details + this.collections.get(vars.Tag[i]).toJSON().CollectionName + " / "
                                            }
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

})
