$(function() {

    App.Collections.ActivityLog = Backbone.Collection.extend({

        url: function() {
            if (this.logDate)
                return App.Server + '/activitylog/_design/bell/_view/getdocBylogdate?include_docs=true&key="' + this.logDate + '"'

            return App.Server + '/activitylog/_design/bell/_view/getDocumentByDate?include_docs=true&startkey="' + this.startkey + '"&endkey="' + this.endkey + '"'
        },
        setUrl: function(url) {
            this.url = url;
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.DailyLog

    })

});$(function() {

    App.Collections.AllInviteMember = Backbone.Collection.extend({


        url: function() {
            var url = App.Server + '/invitations/_design/bell/_view/AllInvitesAgainstId?key=["' + this.memberId + '","' + this.entityId + '"]&include_docs=true'
            return url
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Invitation,
    })

});$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.Apps = Backbone.Collection.extend({

    model: App.Models.App,

    url: function() {
      return App.Server + '/apps/_all_docs?include_docs=true'
    },

    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    }

  })

});$(function() {

    App.Collections.AssignmentPapers = Backbone.Collection.extend({


        url: function() {
            return App.Server + '/assignmentpaper/_design/bell/_view/CourseAssignmentPaperByMember?key=["' + this.senderId + '","' + this.courseId + '"]&include_docs=true'
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.Shelf,


    })

});/*
 * Takes groupId, startDate, and endDate parameters
 */
$(function() {

  App.Collections.AssignmentsByDate = Backbone.Collection.extend({

    url: function() {
      // There is some way to have nicer range queries in CouchDB as hinted here -> http://stackoverflow.com/questions/3216868/querying-couchdb-documents-between-a-start-date-and-an-end-date
      // var url = App.Server + '/assignments/_design/bell/_view/GroupAssignmentsByDate?startkey=["' + this.groupId + '","' + this.startDate + '",""]&endkey=["' + this.groupId + '","\ufff0","' + this.endDate + '"]&include_docs=true'
      // Since we know the startDate and endDate days we can expect Assignments, we don't actually have to do a range for now.
      var url = App.Server + '/assignments/_design/bell/_view/AssignmentsByDate?key=["' + this.startDate + '","' + this.endDate + '"]&include_docs=true'
      return url
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },

    model: App.Models.Assignment

  })

});$(function() {

    App.Collections.Calendars = Backbone.Collection.extend({

        url: App.Server + '/calendar/_design/bell/_view/EventById?key="' + $.cookie('Member._id') + '"&include_docs=true',

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Calendar,

        comparator: function(model) {
            var title = model.get('title')
            if (title) return title.toLowerCase()
        },


    })

});$(function() {

    App.Collections.Communities = Backbone.Collection.extend({

        url: App.Server + '/community/_all_docs?include_docs=true',

        /*	url : function(){
         return 'http://olesomalia:oleoleole@olesomalia.cloudant.com/community/_all_docs?include_docs=true'
         //return App.Server + '/community/_all_docs?include_docs=true'
         },

         */
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.Community
    })

});$(function() {

    App.Collections.CommunityReportComments = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/communityreports/_design/bell/_view/CommunityReportComment?key="' + this.CommunityReportId + '"&include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.CommunityReportComment,

    })

});$(function() {

    App.Collections.Configurations = Backbone.Collection.extend({

        url: function() {
            if (this.u) {
                alert(this.u)
                return this.u
            } else {
                var url = App.Server + '/configurations/_all_docs?include_docs=true'
                return url
            }
        },
        parse: function(response) {

            var models = []
            _.each(response.rows, function(row) {
                if (row.doc._id != '_design/bell') {
                    models.push(row.doc);
                }
            });
            return models;
            //      var docs = _.map(response.rows, function(row) {
            //        return row.doc
            //      })
            //      return docs
        },
        comparator: function(model) {
            var Name = model.get('Name')
            if (Name) return Name.toLowerCase()
        },

        model: App.Models.Configuration

    })

});$(function() {

    App.Collections.CourseInvitations = Backbone.Collection.extend({

        model: App.Models.CourseInvitation,

        url: function() {
            var url = App.Server + '/courseinvitations/_design/bell/_view/getCourseInvi?key="' + this.courseId + '"&include_docs=true'
            return url
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

    })

});$(function() {

    App.Collections.CourseLevels = Backbone.Collection.extend({

        model: App.Models.CourseStep,

        url: function() {
            var url = App.Server + '/coursestep/_design/bell/_view/StepsData?key="' + this.groupId + '"&include_docs=true'
            return url
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        comparator: function(model) {
            return model.get("step")
        },

    })

});$(function() {

    App.Collections.CourseScheduleByCourse = Backbone.Collection.extend({

        url: function() {
            var url = App.Server + '/courseschedule/_design/bell/_view/ScheduleByCourseId?key="' + this.courseId + '"&include_docs=true'
            return url
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.CourseSchedule,

    })

});$(function() {

  App.Collections.EntityInvitation = Backbone.Collection.extend({


    url: function() {
      var url = App.Server + '/invitations/_design/bell/_view/GetIniviteByEntityId?key="' + this.entityId + '"&include_docs=true'
      return url
    },
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },

    model: App.Models.Invitation,
  })

});$(function() {

    App.Collections.GroupAssignments = Backbone.Collection.extend({

        url: function() {
            var url = App.Server + '/assignments/_design/bell/_view/GroupAssignments?key="' + this.groupId + '"&include_docs=true'
            return url
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Assignment,

    })

});/*
 * Takes groupId, startDate, and endDate parameters
 */
$(function() {

  App.Collections.GroupAssignmentsByDate = Backbone.Collection.extend({

    url: function() {
      // There is some way to have nicer range queries in CouchDB as hinted here -> http://stackoverflow.com/questions/3216868/querying-couchdb-documents-between-a-start-date-and-an-end-date
      // var url = App.Server + '/assignments/_design/bell/_view/GroupAssignmentsByDate?startkey=["' + this.groupId + '","' + this.startDate + '",""]&endkey=["' + this.groupId + '","\ufff0","' + this.endDate + '"]&include_docs=true'
      // Since we know the startDate and endDate days we can expect Assignments, we don't actually have to do a range for now.
      var url = App.Server + '/assignments/_design/bell/_view/GroupAssignmentsByDate?key=["' + this.groupId + '","' + this.startDate + '","' + this.endDate + '"]&include_docs=true'
      return url
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },

    model: App.Models.Assignment,

  })

});$(function() {

    App.Collections.Groups = Backbone.Collection.extend({

        url: function() {

            if (this.skip != undefined)
                return App.Server + '/groups/_all_docs?include_docs=true&limit=20&skip=' + this.skip
            else
                return App.Server + '/groups/_all_docs?include_docs=true'
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Group,

        comparator: function(model) {
            if (model.get('CourseTitle') == undefined) {
                var title = model.get('name')
                model.set('CourseTitle', title)
                model.save()
            } else if (model.get('name') == undefined) {
                var title = model.get('CourseTitle')
                model.set('name', title)
                model.save()
            } else {
                var title = model.get('CourseTitle')
            }
            if (title) return title.toLowerCase()
        },


    })

});$(function() {

	App.Collections.Languages = Backbone.Collection.extend({

		url: function() {
			if (this.u) {
				return this.u
			} else {
				var url = App.Server + '/languages/_all_docs?include_docs=true'
				return url
			}
		},
		parse: function(response) {

			var models = []
			_.each(response.rows, function(row) {
				if (row.doc._id != '_design/bell') {
					models.push(row.doc);
				}
			});
			return models;

			//      var docs = _.map(response.rows, function(row) {
			//        if (row.doc._id != '_design/bell') {
			//            return row.doc
			//        }
			//      })
			//      return docs
		},
		model: App.Models.Language

	})

});$(function() {

	App.Collections.MailUnopened = Backbone.Collection.extend({

		initialize: function(e) {
			if (e) {
				if (e.receiverId) {
					this.url = App.Server + '/mail/_design/bell/_view/unopened?key="' + e.receiverId + '"'
				} else {
					console.log(e)
					console.log("unable to find receiverId in MailUnopened Collection")
				}
			}

		},

		parse: function(response) {
			var docs = _.map(response.rows, function(row) {
				return row.doc
			})
			return docs
		},



	})

});$(function() {

    App.Collections.Mails = Backbone.Collection.extend({

        initialize: function(e) {
            if (e) {

                if (e.senderId) {

                    this.url = App.Server + '/mail/_design/bell/_view/sentbox?include_docs=true&key="' + e.senderId + '"&limit=5&skip=' + e.skip
                } else if (e.receiverId && e.unread) {
                    this.url = App.Server + '/mail/_design/bell/_view/unopen?include_docs=true&key="' + e.receiverId + '"&limit=5&skip=' + skip
                } else if (e.receiverId && !e.unread) {
                    this.url = App.Server + '/mail/_design/bell/_view/inbox?include_docs=true&key="' + e.receiverId + '"&limit=5&skip=' + skip
                } else {
                    this.url = App.Server + '/mail/_all_docs?include_docs=true&limit=5&skip=' + skip
                }
            } else {
                this.url = App.Server + '/mail/_all_docs?include_docs=true&limit=5&skip=' + skip
            }
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Mail


    })

});$(function() {

    App.Collections.Meetups = Backbone.Collection.extend({

        url: function() {
            if (this.skip)
                return App.Server + '/meetups/_all_docs?include_docs=true&limit=20&skip=' + this.skip
            else
                return App.Server + '/meetups/_all_docs?include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Group,

        comparator: function(model) {
            var title = model.get('title')
            if (title) return title.toLowerCase()
        },


    })

});$(function() {

    App.Collections.MemberGroups = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/groups/_design/bell/_view/GetCourses?key="' + $.cookie('Member._id') + '"&include_docs=true'
        },

        parse: function(results) {
            var m = []
            var memberId = this.memberId
            var i
            for (i = 0; i < results.rows.length; i++) {
                m.push(results.rows[i].doc)
            }
            return m
        },

        model: App.Models.Group,
        comparator: function(model) {
            var title = model.get('name')
            if (title) return title.toLowerCase()
        }
    })

});$(function() {

	App.Collections.Members = Backbone.Collection.extend({

		url: function() {
			if (this.login) {
				return App.Server + '/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + this.login + '"'
			} else if (this.skip) {
				return App.Server + '/members/_design/bell/_view/Members?include_docs=true&limit=20&skip=' + this.skip
			} else if (this.searchText && this.searchText != "") {
				return App.Server + '/members/_design/bell/_view/search?include_docs=true&limit=20&key="' + this.searchText + '"'
			} else {
				return App.Server + '/members/_design/bell/_view/Members?include_docs=true'
			}
		},

		parse: function(response) {
			var docs = _.map(response.rows, function(row) {
				return row.doc
			})
			return docs
		},

		initialize: function() {
			this.sort_key = 'lastName';
		},
		comparator: function(a, b) {
			// Assuming that the sort_key values can be compared with '>' and '<',
			// modifying this to account for extra processing on the sort_key model
			// attributes is fairly straight forward.
			a = a.get(this.sort_key);
			b = b.get(this.sort_key);
			if (a > b)
				console.log("before")
			return a > b ? 1 : a < b ? -1 : 0;
		},

		model: App.Models.Member,

		//   comparator: function (model) {
		//             var title = model.get('login')
		//             if (title) return title.toLowerCase()
		//         }


	})

});$(function() {

    // We're getting _all_docs instead of a Resources view because we're not putting
    // views in Collection databases. We'll mapreduce client side.
    App.Collections.NewsResources = Backbone.Collection.extend({

        model: App.Models.Resource,

        url: function() {
            return App.Server + '/resources/_design/bell/_view/NewsResources?include_docs=true&key="News"'
        },

        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        },
        comparator: function(model) {
            var d = new Date(model.get('date'))
            return -d.getTime()
        }

    })
});$(function() {

  App.Collections.Publication = Backbone.Collection.extend({

    model: App.Models.Publication,

    url: function() {
      var Url = App.Server + '/publications/_all_docs?include_docs=true&keys=[' + this.keys + ']'
      return Url
    },
    setUrl: function(newUrl) {
      this.url = newUrl;
    },
    setKeys: function(newKeys) {
      this.keys = newKeys;
    },
    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    },
    comparator: function(model) {
      var issueNo = model.get('IssueNo')
      if (issueNo) return issueNo
    }

  })

});$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.Reports = Backbone.Collection.extend({

    model: App.Models.CommunityReport,

    url: function() {
      return App.Server + '/communityreports/_design/bell/_view/allCommunityReports?include_docs=true'
    },

    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    },


  })

});$(function() {

  App.Collections.Requests = Backbone.Collection.extend({



    initialize: function(e) {
      if (e) {
        this.url = App.Server + '/requests/_design/bell/_view/myRequests?key="' + e.memberId + '"&include_docs=true'
      } else {
        this.url = App.Server + '/requests/_all_docs?include_docs=true'
      }
    },
    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },

    model: App.Models.request


  })

});$(function() {

  App.Collections.ResourceFeedback = Backbone.Collection.extend({

    url: function() {
      var url = App.Server + '/feedback/_design/bell/_view/FeedbackByResourceId?key="' + this.resourceId + '"&include_docs=true'
      return url
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },

    model: App.Models.Feedback,


  })

});$(function() {

    // We're getting _all_docs instead of a Resources view because we're not putting
    // views in Collection databases. We'll mapreduce client side.
    App.Collections.Resources = Backbone.Collection.extend({

        model: App.Models.Resource,
        url: function() {
            if (this.collectionName) {
                //return App.Server + '/resources/_design/bell/_view/listCollection?include_docs=true&key="' + this.collectionName + '"'
                if (this.skip >= 0) {
                    return App.Server + '/resources/_design/bell/_view/searchView?include_docs=true&limit=25&skip=' + this.skip + '&keys=' + this.collectionName
                } else {
                    return App.Server + '/resources/_design/bell/_view/searchView?include_docs=true&keys=' + this.collectionName
                }
            } else if (this.skip >= 0) {
                //return App.Server + '/resources/_all_docs?include_docs=true&limit=20&skip='+this.skip
                if (this.startkey && this.startkey != "") {
                    return App.Server + '/resources/_design/bell/_view/sortresources?include_docs=true&startkey="' + this.startkey + '"&limit=20&skip=' + this.skip
                } else {
                    return App.Server + '/resources/_design/bell/_view/sortresources?include_docs=true&limit=20&skip=' + this.skip
                }
            } else if (this.title) {
                return App.Server + '/resources/_design/bell/_view/resourceOnTtile?include_docs=true&key="' + this.title + '"'
                //return App.Server + '/shelf/_design/bell/_view/getShelfItemWithResourceId?key="' +this.resourceId+ '"&include_docs=true'
            } else if (this.ides) {
                return App.Server + '/resources/_design/bell/_view/resourceName?include_docs=true&keys=' + this.resIds
            } else {
                return App.Server + '/resources/_all_docs?include_docs=true'
            }
        },
        initialize: function(a) {

            if (a && a.collectionName) {
                this.collectionName = a.collectionName
            } else if (a && a.skip >= 0) {
                this.skip = a.skip
            }
        },
        setUrl: function(newUrl) {
            this.url = newUrl;
        },

        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                if (row.doc) {
                    models.push(row.doc);
                } else {
                    models.push(row);
                }

            });
            return models
        },

        comparator: function(model) {
            var title = model.get('title')
            if (title) return title.toLowerCase()
        }

    })

});$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.ResourcesFrequency = Backbone.Collection.extend({

    model: App.Models.ResourceFrequency,

    url: function() {
      return App.Server + '/resourcefrequency/_design/bell/_view/memberfrequency?key="' + this.memberID + '"&include_docs=true'
    },

    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    },


  })

});$(function() {

    // We're getting _all_docs instead of a Resources view because we're not putting
    // views in Collection databases. We'll mapreduce client side.
    App.Collections.SearchCourses = Backbone.Collection.extend({
        url: function() {
            return App.Server + '/groups/_all_docs?include_docs=true&limit=' + limitofRecords + '&skip=' + skip
        },
        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        },


    })
});$(function() {

    // We're getting _all_docs instead of a Resources view because we're not putting
    // views in Collection databases. We'll mapreduce client side.
    App.Collections.SearchResource = Backbone.Collection.extend({

        model: App.Models.Resource,

        url: function() {
            return App.Server + '/resources/_all_docs?include_docs=true&limit=' + limitofRecords + '&skip=' + skip
        },

        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        },


    })
});$(function() {

	App.Collections.StepResultsbyCourse = Backbone.Collection.extend({


		url: function() {
			var url
			if (this.memberId) {
				url = App.Server + '/membercourseprogress/_design/bell/_view/GetMemberCourseResult?key=["' + this.memberId + '","' + this.courseId + '"]&include_docs=true'
			} else {
				url = App.Server + '/membercourseprogress/_design/bell/_view/AllCourses?key="' + this.courseId + '"&include_docs=true'
			}

			return url
		},


		parse: function(response) {
			var docs = _.map(response.rows, function(row) {
				return row.doc
			})
			return docs
		},

		model: App.Models.membercourseprogress,
	})

});$(function() {

    App.Collections.UserMeetups = Backbone.Collection.extend({

        url: function() {
            if (this.memberId && this.meetupId)
                return App.Server + '/usermeetups/_design/bell/_view/getUserMeetup?key=["' + this.memberId + '","' + this.meetupId + '"]&include_docs=true'
            else if (this.memberId)
                return App.Server + '/usermeetups/_design/bell/_view/getUsermeetups?key="' + this.memberId + '"&include_docs=true'
            else
                return App.Server + '/usermeetups/_design/bell/_view/getMeetupUsers?key="' + this.meetupId + '"&include_docs=true'
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.UserMeetup,


    })

});$(function() {

    App.Collections.courseprogressallmembers = Backbone.Collection.extend({


        url: function() {
            var url = App.Server + '/membercourseprogress/_design/bell/_view/GetMemberAllCourseResult?key="' + this.memberId + '"&include_docs=true'
            return url
        },


        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.membercourseprogress,
    })

});$(function() {

  App.Collections.coursesteps = Backbone.Collection.extend({

    url: function() {
      if (this.getAll) {
        return App.Server + '/coursestep/_all_docs?include_docs=true'
      } else {
        return App.Server + '/coursestep/_design/bell/_view/StepsData?key="' + this.courseId + '"&include_docs=true'
      }
    },

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
    comparator: function(m) {
      return m.get('step')
    },
    model: App.Models.CourseStep,

  })

});$(function() {

    App.Collections.leadermembers = Backbone.Collection.extend({

        url: App.Server + '/members/_design/bell/_view/Members?include_docs=true',

        parse: function(response) {
            var m = []
            var docs = _.map(response.rows, function(row) {

                if (row.doc.roles.length > 1 || row.doc.roles.indexOf("student") == -1) {
                    m.push(row.doc)
                }

            })
            return m
        },

        model: App.Models.Member,

        comparator: function(model) {
            var title = model.get('login')
            if (title) return title.toLowerCase()
        }

    })

});$(function() {

    App.Collections.listRCollection = Backbone.Collection.extend({


        url: function() {

            if (this.skip >= 0 && this.startkey != "")
                return App.Server + '/collectionlist/_design/bell/_view/sortCollection?include_docs=true&startkey="' + this.startkey + '"&limit=20&skip=' + this.skip
            else if (this.skip == 0 && this.startkey == "")
                return App.Server + '/collectionlist/_design/bell/_view/allrecords?include_docs=true'


            else if (this.major == true)
                return App.Server + '/collectionlist/_design/bell/_view/majorcatagory?include_docs=true'

            else if (this.major == false)
                return App.Server + '/collectionlist/_design/bell/_view/subcategory?include_docs=true'
            else
                return App.Server + '/collectionlist/_design/bell/_view/allrecords?include_docs=true'
        },
        parse: function(response) {

            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        comparator: function(item) {
            var name = item.get("CollectionName");
            if (name) return (name.toLowerCase())
        },
        model: App.Models.CollectionList,

    })

});$(function() {

    App.Collections.membercourseprogresses = Backbone.Collection.extend({


        url: function() {
            var url = App.Server + '/membercourseprogress/_design/bell/_view/GetMemberCourseResult?key=["' + this.memberId + '","' + this.courseId + '"]&include_docs=true'
            return url
        },


        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.membercourseprogress,
    })

});$(function() {

    App.Collections.memberprogressallcourses = Backbone.Collection.extend({


        url: function() {
            var url = App.Server + '/membercourseprogress/_design/bell/_view/GetMemberAllCourseResult?key="' + this.memberId + '"&include_docs=true'
            return url
        },


        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.membercourseprogress,
    })

});$(function() {

    App.Collections.reportsComment = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/report/_design/bell/_view/reportsComment?key="' + this.feedbackId + '"&include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.value
            })

            return docs
        },
        model: App.Models.reportComment,

    })

});$(function() {

    App.Collections.shelfResource = Backbone.Collection.extend({


        url: function() {
            if (this.deleteResource == 1) {
                return App.Server + '/shelf/_design/bell/_view/getShelfItemWithResourceId?key="' + this.resourceId + '"&include_docs=true'
            } else if (this.compile) {
                return App.Server + '/shelf/_design/bell/_view/DuplicateDetection?include_docs=true&key="' + $.cookie('Member._id') + '"'
            } else {
                return App.Server + '/shelf/_design/bell/_view/getResource?key=["' + this.memberId + '","' + this.resourceId + '"]&include_docs=true'
            }
        },
        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.Shelf,


    })

});$(function() {

    App.Collections.siteFeedbacks = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/report/_design/bell/_view/reportsOnly?limit=' + limitofRecords + '&skip=' + skip + '&include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        comparator: function(m) {
            return -new Date(m.get('time')).getTime()
        },
        model: App.Models.report,

    })

})