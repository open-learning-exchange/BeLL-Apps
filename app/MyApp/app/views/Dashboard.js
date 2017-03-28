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
                                                                                App.startActivityIndicator();
                                                                                console.log('countDoubleUpdate is 1 so callingUpdateFunctions ....');
                                                                                that.callingUpdateFunctions();
                                                                            } else {
                                                                                alert(App.languageDict.attributes.Poor_Internet_Error);
                                                                            }
                                                                        },
                                                                        error: function(status) {
                                                                            alert(App.languageDict.attributes.Poor_Internet_Error);
                                                                        }
                                                                    });
                                                                },
                                                                error: function(status) {
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
            that.updateDesignDocs("courses");
            that.updateDesignDocs("publications");
            //Following are the list of db's on which design_docs are not updating,
            // whenever the design_docs will be changed in a db,that db's call will be un-commented.
            that.updateDesignDocs("assignmentpaper");
            that.updateDesignDocs("assignments");
            that.updateDesignDocs("calendar");
            that.updateDesignDocs("communityreports");
            that.updateDesignDocs("courseanswer");
            that.updateDesignDocs("coursequestion");
            that.updateDesignDocs("courseschedule");
            that.updateDesignDocs("feedback");
            that.updateDesignDocs("invitations");
            that.updateDesignDocs("mail");
            that.updateDesignDocs("meetups");
            that.updateDesignDocs("membercourseprogress");
            that.updateDesignDocs("nations");
            that.updateDesignDocs("nationreports");
            that.updateDesignDocs("publicationdistribution");
            that.updateDesignDocs("report");
            that.updateDesignDocs("requests");
            that.updateDesignDocs("resourcefrequency");
            that.updateDesignDocs("shelf");
            that.updateDesignDocs("usermeetups");
            that.updateDesignDocs("viplinks");

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
                                    if(result.rows[i].value.Code != undefined) {
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

        getCountOfLearners: function () {
            console.log('ok');
            var learners = [], stepsStatuses = [], countOfLearners = 0;
            var courses = new App.Collections.Courses();
            var MemberCourseProgress = new App.Collections.membercourseprogresses();
            courses.fetch({
                async:false,
                success: function (courseDocs) {
                    if(courseDocs.length>0) {
                        for (var i = 0; i < courseDocs.length; i++) {
                            var doc = courseDocs.models[i];
                            learners=[], stepsStatuses=[];
                            if (doc.get('courseLeader') != undefined && doc.get('courseLeader').indexOf($.cookie('Member._id')) > -1) {
                                for (var j = 0; j < doc.get('members').length; j++) {
                                    if (doc.get('members')[j] != $.cookie('Member._id') && doc.get('courseLeader').indexOf(doc.get('members')[j]) < 0) {
                                        learners.push(doc.get('members')[j]);
                                    }
                                }
                                for (var k = 0; k < learners.length; k++) {
                                    MemberCourseProgress.courseId = doc.get('_id');
                                    MemberCourseProgress.memberId = learners[k];
                                    MemberCourseProgress.fetch({
                                        success: function (progressDoc) {
                                            if (progressDoc.models.length > 0) {
                                                stepsStatuses = progressDoc.models[0].get('stepsStatus');
                                                stepsAttempt = progressDoc.models[0].get('pqAttempts');
                                                var isCreditable = true;
                                                for (var m = 0; m < stepsStatuses.length; m++) {
                                                    if (stepsStatuses[m] instanceof Array) {
                                                        if (stepsStatuses[m][stepsAttempt[m]] == 'undefined') {
                                                            isCreditable = false;
                                                        }
                                                    } else {
                                                        isCreditable = false;
                                                    }
                                                }
                                                console.log(isCreditable);
                                                if (isCreditable) {
                                                    countOfLearners++;
                                                }
                                            }
                                        },
                                        async:false
                                    });
                                }
                            }
                        }
                    }
                },
                async:false
            });
            return countOfLearners;
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
            var courses = new App.Collections.Courses();
            var countOfLearnersToMarkCredits=0;
            courses.fetch({
                async: false,
                success: function (courseDocs) {
                    if (courseDocs.length > 0) {
                        for (var i = 0; i < courseDocs.length; i++) {
                            var doc = courseDocs.models[i];
                            countOfLearnersToMarkCredits+=getCountOfLearners(doc.get('_id'), false);
                        }
                    }
                }
            });

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
            this.vars.new_learners_count=0;
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
            this.vars.new_learners_count=countOfLearnersToMarkCredits;
            this.$el.html(_.template(this.template, this.vars))

            courses = new App.Collections.MemberCourses()
            courses.memberId = $.cookie('Member._id')
            courses.fetch({
                success: function(e) {
                    coursesSpans = new App.Views.CoursesSpans({
                        collection: courses
                    })
                    coursesSpans.render()

                    $('#cc').append(coursesSpans.el)


                    TutorsSpans = new App.Views.TutorsSpans({
                        collection: courses
                    })
    
                    
                    $.each( $('.inner'), function( key, value ) {
        
                     var height =  $(this).find(".inner-table").height();   
                     var scrollPosition = height/2 ;
                     $(this).scrollTop(scrollPosition - 40);                      

                    });

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
            if(this.vars.new_learners_count > 0)
            {
                $('#creditsDash').css({"color": "red"});
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

})
