$(function () {

    App.Views.PublicationTable = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        collectionInfo:[],
        add: function (publicationDistribID, model) {
           this.collectionInfo[model._id]=[model.resources,model.courses,model.IssueNo]
           console.log(this.collectionInfo);
           this.$el.append('<tr id="' + publicationDistribID + '"><td>' + model.IssueNo+ '</td><td><a name="' +model._id +
                           '" class="synPublication btn btn-info">Sync publication</a></td></tr>');
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
                            success: function (json) {
                                _.each(json.rows,function(row){
                                    var publication = row.doc;
                                    if (publicationToPubDistributionMap[publication._id]) {
                                        var publicationDistributionDocId = publicationToPubDistributionMap[publication._id];
                                        that.add(publicationDistributionDocId, row.doc);
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
            var resourcesIdes = this.collectionInfo[pubId][0];
            var courses = this.collectionInfo[pubId][1];
            var IssueNo = this.collectionInfo[pubId][2];
            var nationUrl = App.configuration.get('nationUrl');
            var nationName = App.configuration.get('nationName');
            this.syncCourses(pubDistributionID, pubId, nationUrl,nationName,courses,IssueNo, resourcesIdes);
//            this.synResources(nationUrl,nationName,resourcesIdes,IssueNo);
        },
        syncCourses:function(pubDistributionID, pubId, nationUrl,nationName,courses,IssueNo, resourcesIdes){
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
                                    // mar
                                    App.stopActivityIndicator();
                                    // fetch publication-distribution document corresponding to the publication just synced/downloaded
                                    // and set the 'viewed' attrib to true, and then get it saved
//                                    var nationName = App.configuration.get('nationName'), nationPassword = App.password;
//                                    var nationUrl = App.configuration.get('nationUrl');
//                                    var pubDistribDocUrl = 'http://' + nationName + ':' + nationPassword + '@' + nationUrl +
//                                                            '/publicationdistribution/' + pubDistributionID;
//                                    $.ajax({
//                                        url: pubDistribDocUrl, type: 'GET',   dataType: 'jsonp',
//                                        success: function (json) {
//                                            _.each(json.rows,function(row){
//                                                var publicationDistribution = row.doc;
//                                                publicationDistribution.Viewed = true;
//                                                // get this doc saved at the nation now
//
//                                            });
//                                        },
//                                        error: function(jqXHR, status, errorThrown){
//                                            console.log(jqXHR);   console.log(status);   console.log(errorThrown);
//                                        }
//                                    });
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