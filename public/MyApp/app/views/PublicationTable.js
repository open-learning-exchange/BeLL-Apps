$(function () {

    App.Views.PublicationTable = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        collectionInfo:[],
        add: function (publicationDistribID, model, isAlreadySynced) {
            // carry the publication in a variable global to this (PublicationTable) view for use in event handling
            this.collectionInfo[model._id]= model; //[model.resources,model.courses,model.IssueNo]
//           console.log(this.collectionInfo);
            if (isAlreadySynced) {
                this.$el.append('<tr id="' + publicationDistribID + '"><td>' + model.IssueNo+ '</td><td><a name="' +model._id +
                    '" class="synPublication btn btn-info">Sync publication</a></td></tr>');
            } else {
                this.$el.append('<tr id="' + publicationDistribID + '"><td>' + model.IssueNo+ '</td><td><a name="' +model._id +
                    '" class="synPublication btn btn-info">Sync publication</a><label>&nbsp&nbspNot Synced</label></td></tr>');
            }
        },
        events:{
          "click .synPublication": 'synPublication'
        },
        render: function () {
            this.$el.html('<tr><th>Issue Number</th><th>Actions</th></tr>');
            var that=this;
            var nationName = App.configuration.get('nationName'), nationPassword = App.password;
            var nationUrl = App.configuration.get('nationUrl'), currentBellName = App.configuration.get('name');
            var DbUrl = 'http://' + nationName + ':' + nationPassword + '@' + nationUrl +
                        '/publicationdistribution/_design/bell/_view/getPublications?include_docs=true&key=["'+currentBellName+'",'+false+']';
            // make sure the couchdb that is being requested in this ajax call has its 'allow_jsonp' property set to true in the
            // 'httpd' section of couchdb configurations. Otherwise, the server couchdb will not respond as required by jsonp format
            // fetch publication-distribution records from nation whose 'viewed' property is false
            $.ajax({
                url: DbUrl,  type: 'GET',   dataType: 'jsonp',
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
                            url: pubsForCommunityUrl, type: 'GET',   dataType: 'jsonp',
                            success: function (jsonNationPublications) {
                                // fetch all publications from local/community server to see how many of the publications from nation are new ones
                                var publicationCollection = new App.Collections.Publication();
                                var tempUrl = App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true';
                                publicationCollection.setUrl(tempUrl);
                                publicationCollection.fetch({
                                    success: function () {
                                        _.each(jsonNationPublications.rows,function(row){
                                            var publicationFromNation = row.doc;
                                            var alreadySyncedPublications = publicationCollection.models;
                                            var index = alreadySyncedPublications.map(function(element) {
                                                return element.get('_id');
                                            }).indexOf(publicationFromNation._id);
//                                            if (publicationToPubDistributionMap[publicationFromNation.get('_id')]) {
                                            var nationPublicationDistributionDocId = publicationToPubDistributionMap[publicationFromNation._id];
                                            var isAlreadySynced = false;
                                            if (index > -1) { // its a new or yet-to-be-synced publication from nation, so display it as new
                                                isAlreadySynced = true;
                                                that.add(nationPublicationDistributionDocId, publicationFromNation, isAlreadySynced);
                                            } else { // its an already synced publication. display it without the new/unsynced mark
                                                that.add(nationPublicationDistributionDocId, publicationFromNation, isAlreadySynced);
                                            }
//                                            }
                                        });
                                    }
                                });
                            },
                            error: function(jqXHR, status, errorThrown){
                                console.log(jqXHR);   console.log(status);   console.log(errorThrown);
                            }
                        });
                    }
                },
                error: function(jqXHR, status, errorThrown){
                    console.log(jqXHR);   console.log(status);   console.log(errorThrown);
                }
            });
        },
        synPublication:function(e){
            var pubId = e.currentTarget.name;
            var pubDistributionID = $(e.currentTarget).closest('tr').attr('id');
            var publicationToSync = this.collectionInfo[pubId];
            this.syncCourses(pubDistributionID, publicationToSync);
//            this.synResources(nationUrl,nationName,resourcesIdes,IssueNo);
        },
        syncCourses:function(pubDistributionID, publicationToSync){
            var resourcesIdes = publicationToSync.resources, courses = publicationToSync.courses, IssueNo = publicationToSync.IssueNo;
            var nationUrl = App.configuration.get('nationUrl'), nationName = App.configuration.get('nationName');
            // courses contains courseID and stepIDs(which contains stepID and resouceIDs(which contains ids of resources in the step))
            var cumulativeCourseIDs = [], cumulativeCourseStepIDs = [], cumulativeResourceIDs = [];
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
            console.log("Syncing Resources and Courses..");
            console.log('http://'+ nationName +':'+App.password+'@'+ nationUrl + '/resources');
            console.log(cumulativeResourceIDs);
            App.startActivityIndicator();
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
                    'doc_ids': cumulativeResourceIDs
                }),
                success: function (response) {
                    console.log(response);
                    alert('Publication "'+IssueNo+'" Resources successfully synced');
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
//						 console.log(response);
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
                                    // mark this publication as synced at community couchdb. ideally, we should inform the nation about it as well
                                    // but currently we are only able to make get requests cross-domain (from community application to nation couchdb
                                    // in our case) and informing the nation couchdb will probably require a cross-domain put or post request to work.
                                    $.couch.db("publications").saveDoc(publicationToSync, {
                                        success: function (response) {
                                            console.log("adding publication# " + publicationToSync.IssueNo + " doc at community for bookkeeping");
                                            console.log(response);
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            console.log(errorThrown);
                                        }
                                    });
                                    App.stopActivityIndicator();
                                    alert('Publication "'+IssueNo+'" Courses successfully synced');
                                },
                                error: function(jqXHR, status, errorThrown){
                                    console.log('Error syncing/replicating Publication "'+IssueNo+'" course-steps');
                                    console.log(status);      console.log(errorThrown);
                                    App.stopActivityIndicator();     alert('Failed to sync course-steps');
                                }
                            });
                        },
                        error: function(jqXHR, status, errorThrown){
                            console.log('Error syncing/replicating Publication "'+IssueNo+'" courses');
                            console.log(status);   console.log(errorThrown);
                            App.stopActivityIndicator();      alert('Failed to sync courses');
                        }
                    })
                },
                error: function(jqXHR, status, errorThrown){
                    console.log('Error syncing/replicating Publication "'+IssueNo+'" resources');
                    console.log(status);    console.log(errorThrown);
                    App.stopActivityIndicator();      alert('Failed to sync resources');
                }
            });
        },
        synResources:function(nationUrl,nationName,resourcesIdes,IssueNo){
            console.log("Syncing Resources..");
            console.log('http://'+ nationName +':'+App.password+'@'+ nationUrl + '/resources');
            console.log(resourcesIdes);
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
                    console.log(response);
                    alert('Publication "'+IssueNo+'" Resources successfully Synced');
                },
                error: function(jqXHR, status, errorThrown){
                    console.log('Error syncing/replicating Publication "'+IssueNo+'" resources');
                    console.log(status);
                    console.log(errorThrown);
                }
            })
        }
    })
})