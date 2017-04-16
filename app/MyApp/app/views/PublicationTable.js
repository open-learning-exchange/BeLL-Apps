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
                                                } else { // its an already synced publication. display it without the new/unsynced mark
                                                    var temp = { "pubDistId":nationPublicationDistributionDocId, "pubDoc":publicationFromNation, "isAlreadySynced":isAlreadySynced, "IssueNo":publicationFromNation.IssueNo };
                                                    newPublication.push(temp);
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
                        if(data.indexOf('tempresources') != -1 ) {
                            $.couch.db("tempresources").drop({
                                success: function(data) {
                                    that.syncCourses(pubDistributionID, publicationToSync);
                                },
                                error: function(status) {
                                    console.log(status);
                                }
                            });
                        } else {
                            that.syncCourses(pubDistributionID, publicationToSync);
                        }
                    },
                    async: false
                });
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
                cumulativeQuestionIDs = [];
                for (var indexOfCourse in courses) {
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
                        var questionIDs = courseStepInfo['questionIDs'];
                        for (var indexOfQuestionID in questionIDs) {
                            cumulativeQuestionIDs.push(questionIDs[indexOfQuestionID]);
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
                                        "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/courses',
                                        "target": 'courses',
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
                                                $.ajax({
                                                        headers: {
                                                            'Accept': 'application/json',
                                                            'Content-Type': 'application/json; charset=utf-8'
                                                        },
                                                        type: 'POST',
                                                        url: '/_replicate',
                                                        dataType: 'json',
                                                        data: JSON.stringify({
                                                            "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/coursequestion',
                                                            "target": 'coursequestion',
                                                            'doc_ids': cumulativeQuestionIDs
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
                var courseColl = new App.Collections.Courses();
                courseColl.keys = encodeURI(courseInPubIdes)
                courseColl.fetch({
                    async: false
                });
               for(var i = 0 ; i<courseColl.length ; i++) {
                   var courseModel = courseColl.models[i];
                   courseModel.set('courseLeader',[]);
                   courseModel.set('members',[]);
                   courseData.push(courseModel);
               }
                $.couch.db("courses").bulkSave({"docs": courseData}, {
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
    })