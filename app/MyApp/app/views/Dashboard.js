$(function() {

    App.Views.Dashboard = Backbone.View.extend({

        template: $('#template-Dashboard').html(),

        vars: {},
        nationConfiguration: null,
        latestVersion: null,
        nationConfigJson: null,
        events: {
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
                    success: function(e) {
                        $("#releaseVersion").slideUp("slow", function() {
                            $('#appversion').val("")
                            $('#notes').val("")
                            alert('Notes successfully saved.')
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
            }
        },
        initialize: function() {
            // $(window).on('resize.resizeview', this.onResize.bind(this));
        },

        remove: function() {
            $(window).off('resize.resizeview');
            Backbone.View.prototype.remove.call(this);
        },
        updateVersion: function(e) {
            var that = this;
            App.startActivityIndicator();

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

            //Checking whether the community is registered with any nation or not.
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true&key="' + App.configuration.get('code') + '"',
                type: 'GET',
                dataType: 'jsonp',
                success: function(result) {
                    if (result.rows.length > 0) {

                        // Replicate Application Code from Nation to Community
                        $.couch.allDbs({
                            success: function (data) {
                                if (data.indexOf('apps') != -1) {
                                    console.log("apps existed.We are going to drop and create.");
                                    $.couch.db("apps").drop({
                                        success: function(data) {
                                            console.log(data);
                                            $.couch.db("apps").create({
                                                success: function(data) {
                                                    console.log(data);
                                                    that.updateAppsAndDesignDocs(result);
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
                                    console.log("apps doesn't exist, so no need to drop.");
                                    $.couch.db("apps").create({
                                        success: function (data) {
                                            console.log(data);
                                            that.updateAppsAndDesignDocs(result);
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        alert(" The community is not authorized to update until it is properly configured with a nation");
                        window.location.reload(false);
                    }
                },
                error: function() {
                    console.log('http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?key="' + App.configuration.get('code') + '"');
                }
            });
        },

        updateAppsAndDesignDocs: function (result) {
            var that = this;
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
                async: false,
                success: function(response) {
                    console.log(response);
                    that.updateConfigsOfCommFromNation();
                    that.updateLanguages();
                    //////////////////    Onward are the Ajax Request for all Updated Design Docs //////////////////
                    that.updateDesignDocs("activitylog");
                    that.updateDesignDocs("members");
                    that.updateDesignDocs("collectionlist");
                    that.updateDesignDocs("community");
                    that.updateDesignDocs("resources");
                    that.updateDesignDocs("coursestep");
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
                    var communityModel = result.rows[0].value;
                    var communityModelId = result.rows[0].id;
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
                            console.log("Successfully Replicated.");
                            var date = new Date();
                            var year = date.getFullYear();
                            var month = (1 + date.getMonth()).toString();
                            month = month.length > 1 ? month : '0' + month;
                            var day = date.getDate().toString();
                            day = day.length > 1 ? day : '0' + day;
                            var formattedDate = month + '-' + day + '-' + year;

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
                                            //console.log("Successfully Replicated.");
                                            alert("Updated Successfully");
                                            window.location.reload(false);
                                        },
                                        async: false
                                    });
                                },

                                async: false
                            });
                        },
                        async: false
                    });
                },
                error: function() {
                    App.stopActivityIndicator()
                    alert("Not Replicated!")
                }
            });
        },

        updateDesignDocs: function(dbName) {
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
                    "doc_ids": ["_design/bell"]
                }),
                success: function(response) {
                    console.log(dbName + " DesignDocs successfully updated.");
                },
                async: false
            });
        },

        updateConfigsOfCommFromNation: function() {
            var that = this;
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            // Update version Number and availableLanguages in Configuration of Community
            var currentConfig = config.first().toJSON().rows[0].doc
            var nationName = currentConfig.nationName
            var nationURL = currentConfig.nationUrl
            var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + '/configurations/_all_docs?include_docs=true'
            $.ajax({
                url: nationConfigURL,
                type: 'GET',
                dataType: "jsonp",
                success: function (json) {
                    var nationConfig = json.rows[0].doc
                    currentConfig.availableLanguages = nationConfig.availableLanguages;
                    currentConfig.version = nationConfig.version;
                    var doc = currentConfig;
                    $.couch.db("configurations").saveDoc(doc, {
                        success: function(data) {
                            console.log("Configurations updated");
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });
                    console.log(currentConfig);
                    console.log(nationConfig);
                }
            });
        },

        updateLanguages: function() {
            var that = this;
            $.couch.allDbs({
                success: function (data) {
                    if (data.indexOf('languages') != -1) {
                        console.log("languages existed.We are going to drop and create.");
                        $.couch.db("languages").drop({
                            success: function(data) {
                                console.log(data);
                                $.couch.db("languages").create({
                                    success: function(data) {
                                        console.log(data);
                                        that.updateLanguageDocs();
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
                        console.log("languages doesn't exist, so no need to drop.");
                        $.couch.db("languages").create({
                            success: function (data) {
                                console.log(data);
                                that.updateLanguageDocs();
                            }
                        });
                    }
                }
            });
        },

        updateLanguageDocs: function() {
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
                    "target": "languages"
                }),
                async: false,
                success: function (response) {
                    console.log("Languages updated");
                }
            });
        },

        render: function(nation_version,new_publication_count) {
            var dashboard = this;
            var currentContext=this;
            this.vars.mails = 0;
            this.vars.nation_version=0;
            this.vars.new_publication_count=0;
            var that = this;
            // var nation_version = 12;
            /*   that.getNationVersion(function(para1){
             alert("before"+nation_version)
             nation_version = para1;
             alert("after"+nation_version)
             //  that.vars.nation_version = nation_version;
             // that.$el.html(_.template(that.template, that.vars))
             alert("after after"+nation_version)
             alert("inside" + nation_version)
             });*/
            console.log('Hello');
            var clanguage = App.configuration.get("currentLanguage");
            if (clanguage == "العربية" || clanguage == "اردو") {
                $('link[rel=stylesheet][href~="app/Home.css"]').attr('disabled', 'false');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').removeAttr('disabled');
            } else {
                $('link[rel=stylesheet][href~="app/Home.css"]').removeAttr('disabled');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').attr('disabled', 'false');

            }

            var typeofBell = App.configuration.get("type")
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
            var clanguage = App.configuration.get("currentLanguage");
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
                        languageDict=languages.models[i];
                    }
                }
            }
            App.languageDict = languageDict;
            var dayOfToday=moment().format('dddd');
            var todayMonth=moment().format('MMMM');
            var currentDay=this.lookup(languageDict, "Days."+dayOfToday);
            var currentMonth=this.lookup(languageDict,"Months."+todayMonth);
            var currentDate=moment().format('DD');
            var currentYear=moment().format('YYYY');
            $('.now').html(currentDay+' | '+currentDate+' '+currentMonth+', '+currentYear);
            // Member Name
            var member = App.member
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
            var bell_Name = currentConfig.name;
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
                var nation=" "+languageDict.attributes.Nation+" "+languageDict.attributes.Bell;
                bell_Name = bell_Name + nation;
            } else {
                var community=" "+languageDict.attributes.Community+" "+languageDict.attributes.Bell;
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
                temp = member.get('visits') +' '+languageDict.attributes.Visits;
            }
            var roles = "&nbsp;-&nbsp;"
            var temp1 = 0
            //******************************-Getting Roles of Member**************************************/
            if (member.get("roles").indexOf("Learner") != -1) {

                roles = roles + languageDict.attributes.Learner;   /******************Setting up Learner/Leader*****************/
                temp1 = 1
            }
            if (member.get("roles").indexOf("Leader") != -1) {
                if (temp1 == 1) {
                    roles = roles + ",&nbsp;"
                }
                roles = roles + languageDict.attributes.Leader;
                temp1 = 1
            }
            if (member.get("roles").indexOf("Manager") != -1) {

                var manager=languageDict.attributes.Manager;
                if (temp1 == 1) {
                    roles = roles + ",&nbsp;"
                }
                var gandaId,test;
                if (typeofBell == 'nation') {
                    var natLink = '<a id= "NationManagerLink" href="../nation/index.html#dashboard" charset="UTF-8"></a>'
                    test=member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '<a id= "NationManagerLink" href="../nation/index.html#dashboard" charset="UTF-8">'+manager+'</a></span>' + '&nbsp;<a href="#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>';

                    gandaId="NationManagerLink";
                    console.log(roles);
                } else {

                    var config = new App.Collections.Configurations()
                    config.fetch({
                        async: false
                    })
                    var con = config.first()
                    App.configuration = con
                    var branch = App.configuration.get('subType')
                    if (branch == "branch") {
                        roles = roles + '<a href="#" style="pointer-events: none; color: #34495e">'+manager+'</a>'
                        con.set('nationName','random');
                        con.set('nationUrl','random');
                        con.save(null, {
                            success: function(doc, rev) {

                                App.configuration = con;
                                alert('Configurations are Successfully changed for Branch Library');
                                console.log('Configurations are Successfully changed for Branch Library');
                                Backbone.history.navigate('dashboard', {
                                    trigger: true
                                });
                            }
                        });
                    } else {
                        roles = roles + '<a href="#communityManage">'+manager+'</a>'
                    }

                    var commLink  = '<a id= "CommunityManagerLink" href="#communityManage"></a>';
                    test=member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '<a id= "CommunityManagerLink" href="#communityManage" charset="UTF-8"></a></span>' + '&nbsp;<a id="gearIcon" href="#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>';
                    gandaId="CommunityManagerLink";
                    console.log(roles);
                }
            }

            $('.visits').html(temp)

            $('.name').html(test)

            if (branch == "branch") {

                $('#gearIcon').hide();
            }

            // var update = languageDict.attributes.Update_Welcome_Video;

            if ($.cookie('Member.login') === "admin") {
                /*  var $buttonWelcome = $('<button id="welcomeButton" class="btn btn-hg btn-primary" onclick="document.location.href=\'#updatewelcomevideo\'"></button>');

                 document.getElementById("welcomeButton").innerHTML = "My new text!";â€‹
                 dashboard.$el.append($buttonWelcome);
                 $("#welcomeButton").html(update);*/
                $('#welcomeButton').show();
            }

            // $(itemsinnavbar).addClass('navbar-right');
            console.log('vars outside'+nation_version);
            //   alert("outside callback" + nation_version);
            console.log("pubs"+new_publication_count)
            this.vars.nation_version=nation_version;

            this.vars.new_publication_count=new_publication_count;
            console.log("publicationsss"+new_publication_count)
            console.log('before call '+this.vars.nation_version);
            dashboard.checkAvailableUpdates(member.get('roles'), dashboard,nation_version);
            console.log('after call '+this.vars.nation_version);

            return this;
        },

        lookup :  function(obj, key) {
            var type = typeof key;
            if (type == 'string' || type == "number") key = ("" + key).replace(/\[(.*?)\]/, function(m, key){//handle case where [1] may occur
                return '.' + key;
            }).split('.');

            for (var i = 0, l = key.length; i < l;l--) {
                if (obj.attributes.hasOwnProperty(key[i])) {

                    obj = obj.attributes[key[i]];
                    i++;
                    if (obj[0].hasOwnProperty(key[i])) {
                        var myObj=obj[0];
                        var valueOfObj=myObj[key[i]];

                        return valueOfObj;
                    }

                } else {
                    return undefined;
                }
            }
            return obj;
        },

        checkAvailableUpdates: function(roles, dashboard,nation_version) {
            // var nationVersion = 0;
            console.log('CheckAvailableUpdates is called..');
            if (App.configuration.attributes.currentLanguage == "اردو" || App.configuration.attributes.currentLanguage == "العربية") {

                $('link[rel=stylesheet][href~="app/Home.css"]').attr('disabled', 'false');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').removeAttr('disabled');
            } else {
                $('link[rel=stylesheet][href~="app/Home.css"]').removeAttr('disabled');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').attr('disabled', 'false');

            }


            //var context = this
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
            //  var htmlreferance = this.$el

            var DbUrl = 'http://' + nName + ':' + pass + '@' + nUrl + '/publicationdistribution/_design/bell/_view/getPublications?include_docs=true&key=["' + currentBellName + '",' + false + ']'
//var that=this;
            if (typeof nation_version === 'undefined') {
                /////No version found in nation
            } else if (nation_version == configuration.get('version')) {
                ///No updatea availabe
            } else {
                if (dashboard.versionCompare(nation_version, configuration.get('version')) < 0) {
                    console.log("Nation has lower application version than that of your community application")
                } else if (dashboard.versionCompare(nation_version, configuration.get('version')) > 0) {
                    // dashboard.latestVersion = nationConfig.version;
                    //  nationVersion = nationConfig.version;
                    dashboard.vars.nation_version = nation_version;


                    //  alert('within ' + dashboard.latestVersion);
                    $('#updateButton').show();
                    $('#viewReleaseNotes').show();

                    //  dashboard.$el.append('<button class="btn systemUpdate" id="updateButton">' + App.languageDict.attributes.Update_Available + ' (' + nationConfig.version + ') </button>')
                    //dashboard.$el.append('<button class="btn systemUpdate" id="viewReleaseNotes">' + App.languageDict.attributes.View + ' ' + App.languageDict.attributes.Release_Notes + ' </button>')
                } else {
                    console.log("Nation is uptodate")
                }
            }

            /* $.ajax({
             url: nationConfigURL,
             type: 'GET',
             dataType: "jsonp",
             async:false,
             success: function(json) {
             var nationConfig = json.rows[0].doc;
             nationConfigJson = nationConfig
             if (typeof nationConfig.version === 'undefined') {
             /////No version found in nation
             } else if (nationConfig.version == configuration.get('version')) {
             ///No updatea availabe
             } else {
             if (context.versionCompare(nationConfig.version, configuration.get('version')) < 0) {
             console.log("Nation has lower application version than that of your community application")
             } else if (context.versionCompare(nationConfig.version, configuration.get('version')) > 0) {
             dashboard.latestVersion = nationConfig.version;
             nationVersion = nationConfig.version;
             dashboard.vars.nation_version=dashboard.latestVersion;



             alert('within '+dashboard.latestVersion);
             $('#updateButton').show();
             //  dashboard.$el.append('<button class="btn systemUpdate" id="updateButton">' + App.languageDict.attributes.Update_Available + ' (' + nationConfig.version + ') </button>')
             //dashboard.$el.append('<button class="btn systemUpdate" id="viewReleaseNotes">' + App.languageDict.attributes.View + ' ' + App.languageDict.attributes.Release_Notes + ' </button>')
             } else {
             console.log("Nation is uptodate")
             }
             }
             },
             error: function(jqXHR, status, errorThrown) {
             console.log('Error fetching application version from nation "' + configuration.nationName + '"');
             console.log(status);
             console.log(errorThrown);
             }
             });*/


            // make sure the couchdb that is being requested in this ajax call has its 'allow_jsonp' property set to true in the
            // 'httpd' section of couchdb configurations. Otherwise, the server couchdb will not respond as required by jsonp format
            /*   $.ajax({
             url: DbUrl,
             type: 'GET',
             dataType: 'jsonp',
             async:false,
             success: function(json) {
             var publicationDistribDocsFromNation = [],
             tempKeys = [];
             _.each(json.rows, function(row) {
             publicationDistribDocsFromNation.push(row.doc);
             tempKeys.push(row.doc.publicationId);
             });
             // fetch all publications from local/community server to see how many of the publications from nation are new ones
             var newPublicationsCount = 0;
             var publicationCollection = new App.Collections.Publication();
             var tempUrl = App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true';
             publicationCollection.setUrl(tempUrl);
             publicationCollection.fetch({
             success: function() {
             var alreadySyncedPublications = publicationCollection.models;
             for (var i in publicationDistribDocsFromNation) {
             // if this publication doc exists in the list of docs fetched from nation then ignore it from new publications
             // count
             var index = alreadySyncedPublications.map(function(element) {
             return element.get('_id');
             }).indexOf(publicationDistribDocsFromNation[i].publicationId);
             if (index > -1) {
             // don't increment newPublicationsCount cuz this publicationId already exists in the already synced publications at
             // local server
             } else {
             newPublicationsCount++;
             }
             }
             if (newPublicationsCount > 0)
             console.log('testing');
             dashboard.$el.append('<a class="btn systemUpdate" id="newPublication" href="#publications/for-' + currentBellName + '">'+App.languageDict.attributes.Publications+ ' ( '+ App.languageDict.attributes.New + ' '+ newPublicationsCount + ')'+' </a>')
             }
             });
             },
             error: function(jqXHR, status, errorThrown) {
             console.log(jqXHR);
             console.log(status);
             console.log(errorThrown);
             }
             }); */

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

    })

})