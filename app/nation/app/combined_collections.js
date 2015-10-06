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

    App.Collections.Community = Backbone.Collection.extend({

        initialize: function(e) {
            if (e) {
                this.url = App.Server + '/community/_all_docs?include_docs=true' + '&limit=' + e.limit
            } else {
                this.url = App.Server + '/community/_all_docs?include_docs=true'
            }
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



        comparator: function(model) {
            var Name = model.get('Name')
            if (Name) return Name.toLowerCase()
        },
        model: App.Models.Community

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
        },


        comparator: function(model) {
            var Name = model.get('Name')
            if (Name) return Name.toLowerCase()
        },
        model: App.Models.Configuration
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

    // We're getting _all_docs instead of a Resources view because we're not putting
    // views in Collection databases. We'll mapreduce client side.
    App.Collections.CourseRequest = Backbone.Collection.extend({

        model: App.Models.request,

        url: function() {
            return App.Server + '/requests/_design/bell/_view/CoursesRequest?include_docs=true'
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

    App.Collections.Courses = Backbone.Collection.extend({

        model: App.Models.Group,
        url: function() {
            if (this.seachText)
                return App.Server + '/groups/_design/bell/_view/courseSearch?include_docs=true&key=' + this.seachText
            else if (this.keys != undefined)
                return App.Server + '/groups/_all_docs?include_docs=true&keys=[' + this.keys + ']'
            else
                return App.Server + '/groups/_all_docs?include_docs=true&limit=20'

        },
        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                if (row.error !== "not_found") {
                    models.push(row.doc)
                }
            });
            return models
        },

        comparator: function(model) {
            var title = model.get('CourseTitle')
            if (title) return title.toLowerCase()
        }

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

    App.Collections.NationReportComments = Backbone.Collection.extend({

        url: function() {
            return App.Server + '/nationreports/_design/bell/_view/NationReportComment?key="' + this.NationReportId + '"&include_docs=true'
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },
        model: App.Models.NationReportComment,

    })

});$(function() {

    // We're getting _all_docs instead of a Resources view because we're not putting
    // views in Collection databases. We'll mapreduce client side.
    App.Collections.Publication = Backbone.Collection.extend({

        model: App.Models.Publication,

        url: function() {
            if (this.getlast == true) {
                return App.Server + '/publications/_changes?include_docs=true&descending=true&limit=3'
            } else if (this.issue) {
                return App.Server + '/publications/_design/bell/_view/publicationIssue?include_docs=true&key=' + this.issue


            } else {
                return App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true'
            }

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

        model: App.Models.NationReport,

        url: function() {
            return App.Server + '/nationreports/_design/bell/_view/allNationReports?include_docs=true'
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
    App.Collections.ResourceRequest = Backbone.Collection.extend({

        //model: App.Models.Request,
        model: App.Models.request,
        url: function() {
            return App.Server + '/requests/_design/bell/_view/ResourcesRequest?include_docs=true'
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

    App.Collections.Resources = Backbone.Collection.extend({

        model: App.Models.Resource,
        url: function() {
            if (this.keys != 'undefined')
                return App.Server + '/resources/_all_docs?include_docs=true&keys=[' + this.keys + ']'
            else
                return App.Server + '/resources/_all_docs?include_docs=true'

        },
        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        },

        comparator: function(model) {
            var title = model.get('title')
            if (title) return title.toLowerCase()
        }

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