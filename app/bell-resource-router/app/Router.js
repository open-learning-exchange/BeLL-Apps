$(function() {
    App.Router = new(Backbone.Router.extend({

        routes: {
            'open/:resourceId/:resourceTitle': 'LogactivityAndOpen',
            'openreport/:level/:reportId': 'openReport',
            'download/:resourceId': 'download',
            'openres/:id': 'open'
        },
        LogactivityAndOpen: function(resourceId,resourceTitle) {
            var memId = $.cookie('Member._id')
            var memUrl = '/members/' + memId
            var Member = Backbone.Model.extend({
                url: memUrl
            });
            var member = new Member()
            member.fetch({
                async: false
            })

            //        alert("openin resource");

            var that = this
            var logdb = new PouchDB('activitylogs')
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate)


            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    //            console.log("logModel: ");
                    //            console.log(logModel);
                    //            alert("yeeyyyyyy");
                    that.UpdatejSONlog(member, logModel, logdb, resourceId, logdate, resourceTitle);
                } else {
                    that.createJsonlog(member, logdate, logdb, resourceId,  resourceTitle);
                }
            });

            //        logdb.query({map:function(doc){
            //					 if(doc.logDate){
            //						emit(doc.logDate,doc)
            //					 }
            //				}
            //   			},{key:logdate},function(err,res){
            //
            //                alert("ahemm..");
            //
            //				if(!err){
            ////                    alert("stop and debug");
            //				     if(res.total_rows!=0){
            //				          logModel=res.rows[0].value
            //				          that.UpdatejSONlog(member, logModel, logdb, resourceId, logdate);
            //				     }else{
            //				          that.createJsonlog(member, logdate, logdb, resourceId);
            //				     }
            //                }
            //
            //		   });
        },
        createJsonlog: function(member, logdate, logdb, resourceId,resourceTitle) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            console.log(config)
            var currentConfig = config.first().toJSON().rows[0].doc

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
                community: currentConfig.code,
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            //***************************************************************************************
            // issue #84
            //**************************************************************************************
            docJson.resources_names.push(resourceTitle)
            // **************************************************************************************
            docJson.resources_opened.push(resourceId)

            if (member.get('Gender') == 'Male') {
                if (superMgrIndex == -1) {
                    docJson.male_opened.push(1)
                    docJson.female_opened.push(0)
                } else {
                    docJson.male_opened.push(0)
                    docJson.female_opened.push(0)
                }
            } else {
                if (superMgrIndex == -1) {
                    docJson.male_opened.push(0)
                    docJson.female_opened.push(1)
                } else {
                    docJson.male_opened.push(0)
                    docJson.female_opened.push(0)
                }
            }

            //            this.open(resourceId);
            var context = this;
            //            var x = 12;

            logdb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("Resource-Router: created activity log in pouchdb for today..");
                    //                    alert("created activity log in pouchdb for today..");
                    context.open(resourceId);
                } else {
                    console.log("ResourceRouter:: UpdatejSONlog:: error creating/pushing activity log doc in pouchdb..");
                    console.log(err);
                    //                    alert("ResourceRouter:: UpdatejSONlog:: error creating/pushing activity log doc in pouchdb..");
                }
            });

            //			logdb.post(docJson, function (err, response) {
            //                if (err) {
            //                    console.log(err);
            //                } else {
            ////                    console.log(response);
            //                    console.log("created activity log in pouchdb for today..");
            ////                    alert("created activity log in pouchdb for today..");
            //                    context.open(resourceId);
            //                }
            //                x = 12;
            //		    });
        },
        UpdatejSONlog: function(member, logModel, logdb, resourceId, logdate,resourceTitle) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            var resId = resourceId;
            //            alert("buuuurrrrrrrr");
            var index = logModel.resources_opened.indexOf(resId);
            if (index == -1) {
                //***************************************************************************************
                // issue #84
                //**************************************************************************************
                logModel.resources_names.push(resourceTitle)
                // **************************************************************************************
                logModel.resources_opened.push(resId)
                if (member.get('Gender') == 'Male') {
                    if (superMgrIndex == -1) {
                        logModel.male_opened.push(1)
                        logModel.female_opened.push(0)
                    } else {
                        logModel.male_opened.push(0)
                        logModel.female_opened.push(0)
                    }
                } else {

                    if (superMgrIndex == -1) {
                        logModel.male_opened.push(0)
                        logModel.female_opened.push(1)
                    } else {
                        logModel.male_opened.push(0)
                        logModel.female_opened.push(0)
                    }
                }
            } else {
                if (member.get('Gender') == 'Male') {
                    if (superMgrIndex == -1) {
                        logModel.male_opened[index] = (parseInt(logModel.male_opened[index])) + 1
                    }
                } else {
                    if (superMgrIndex == -1) {
                        logModel.female_opened[index] = (parseInt(logModel.female_opened[index])) + 1
                    }
                }
            }

            var context = this;
            logdb.put(logModel, logdate, logModel._rev, function(err, response) {
                if (!err) {
                    //                    console.log("ResourceRouter:: UpdatejSONlog:: updated daily log from pouchdb for today..");
                    context.open(resourceId);
                } else {
                    console.log("ResourceRouter:: UpdatejSONlog:: err making update to record");
                    console.log(err);
                    //                    alert("err making update to record");
                }
            });


            //            logdb.get(logdate, function(err, otherDoc) {
            //                if (err) {
            //                    console.log("err in fetching activity log before updating it");
            //                    console.log(err);
            //                    alert("err in fetching activity log before updating it");
            //                } else {
            //                    logdb.put( logModel, resourceId, otherDoc._rev, function(err, response) {
            //                        if (!err) {
            //                            console.log("updated daily log from pouchdb for today..");
            //                            context.open(resourceId);
            //                        } else {
            //                            console.log("err making update to record");
            //                            console.log(err);
            ////                            alert("err making update to record");
            //                        }
            //                    });
            //                }
            //            });

            //			logdb.put(logModel,function(err, response){
            //                if (err) {
            //                    console.log(err);
            //                    alert("stop and debug");
            //                } else {
            ////                    console.log(response);
            //                    console.log("updated daily log from pouchdb for today..");
            ////                    alert("updated daily log from pouchdb for today..");
            //                    this.open(resourceId);
            //                }
            //		   });

        },
        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },
        open: function(resourceId) {

            var openUrl
            var resource = new App.Models.Resource({
                _id: resourceId
            })
            //var secondAttch = ':';
            //     alert("inside open method..");
            resource.on('sync', function() {
                // If there is a openURL, that overrides what we use to open, else we build the URL according to openWith
                if (resource.get('openUrl') && resource.get('openUrl').length > 0) {
                    openUrl = resource.get('openUrl')[0];
                } else if (resource.get('openWhichFile') && resource.get('openWhichFile').length > 0) {
                    openUrl = resource.__proto__.openWithMap[resource.get('openWith')] + '/resources/' + resource.id + '/' + resource.get('openWhichFile')
                } else {
                    //We want to open only one attachment which is the latest one, so no need for secondAttachment logic
                    /*if (_.keys(resource.get('_attachments'))[1] && resource.get('openWith') != 'Bell-Reader') {
                        secondAttch += '/resources/' + resource.id + '/' + _.keys(resource.get('_attachments'))[1]
                    } else
                        secondAttch = ''*/

                    openUrl = resource.__proto__.openWithMap[resource.get('openWith')] + '/resources/' + resource.id + '/' + _.keys(resource.get('_attachments'))[0]
                }
                //window.location = openUrl + secondAttch
                window.location = openUrl;
            })
            resource.fetch()

        },

        openReport: function(level, reportId) {
            var openUrl
            if (level == 'community') {
                var resource = new App.Models.CommunityReports({
                    _id: reportId
                })
            } else if (level == 'nation') {
                var resource = new App.Models.NationReports({
                    _id: reportId
                })
            }
            resource.on('sync', function() {
                // If there is a openURL, that overrides what we use to open, else we build the URL according to openWith
                if (resource.get('openUrl') && resource.get('openUrl').length > 0) {
                    openUrl = resource.get('openUrl')
                } else if (resource.get('openWhichFile') && resource.get('openWhichFile').length > 0) {
                    openUrl = resource.__proto__.openWithMap['Just download'] + '/' + level + 'reports/' + resource.id + '/' + resource.get('openWhichFile')
                } else {
                    openUrl = resource.__proto__.openWithMap['Just download'] + '/' + level + 'reports/' + resource.id + '/' + _.keys(resource.get('_attachments'))[0]
                }
                window.location = openUrl
                //console.log(openUrl)
            })
            resource.fetch()
        }

    }))

})