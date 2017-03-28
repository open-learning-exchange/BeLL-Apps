$(function() {
    App.Router = new(Backbone.Router.extend({

        routes: {
            'listCommunitiesRequest':'ListCommunitiesRequest',
            'addCommunity': 'CommunityForm',
            'addCommunity/:CommunityId': 'CommunityForm',
            'login': 'MemberLogin',
            'logout': 'MemberLogout',
            'listCommunity(/:date)': 'ListCommunitiesRequest',
            'listCommunityPage(/:secretId)(/:date)': 'ListCommunity',
            'siteFeedback': 'viewAllFeedback',
            'dashboard': 'Dashboard',
            'request': 'commRequest',
            'earthrequest': 'earthRequest',
            'reports': 'Reports',
            'reports/edit/:resportId': 'ReportForm',
            'reports/add': 'ReportForm',
            'publication': 'Publicat',
            'publication/add': 'PublicationForm',
            'configuration': 'Configuration',
            'publication/add/:publicationId': 'PublicationForm',
            'publicationdetail/:publicationId': 'PublicationDetails',
            'courses/:publicationId': "addCourses",
            'survey': 'Survey',
            'survey/add': 'AddSurveyForm',
            'surveydetail/:surveyId': 'SurveyDetails',
            'openSurvey/:surveyNo/:communityName': 'OpenSurvey',
            'openCommunitySurvey/:surveyId': 'openCommunitySurvey',
            'communitiesList/:surveyId': 'communitiesList',
            'criteriaList/:surveyId': 'criteriaList',
            'trendreport': "TrendReport",
            'communityDetails/:commDocId/:requestStatus': "communityDetails",
            "communityreport/:syncDate/:name/:code(/:endDate)": "communityReport", // //issue#50:Add Last Activities Sync Date to Activity Report On Nation For Individual Communities
            //Issue#80:Add Report button on the Communities page at nation
            'viplink': "VipLinks"
        },

        initialize: function() {
            this.bind("all", this.checkLoggedIn)
            this.bind("all", this.routeStartupTasks)
            this.bind("all", this.renderNav)

        },

        loadLanguageDocs : function(language) {
            var clanguage, languageDict;

            //fetching nations configurations
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false,
                success: function(){
                    clanguage = config.first().attributes.currentLanguage;
                }
            })
            var jsonConfig = config.first().toJSON();
            var languages = new App.Collections.Languages();
            languages.fetch({
                async: false
            });
            var docExists=false;
            for(var i=0;i<languages.length;i++) {
                if (languages.models[i].attributes.hasOwnProperty("nameOfLanguage")) {
                    if (languages.models[i].attributes.nameOfLanguage == language) {
                        languageDict = languages.models[i];
                        docExists = true;
                        break;
                    }
                }
            }
            if(docExists==false)
            {
                for(var i=0;i<languages.length;i++) {
                    if (languages.models[i].attributes.hasOwnProperty("nameOfLanguage")) {
                        if (languages.models[i].attributes.nameOfLanguage == clanguage) {
                            languageDict = languages.models[i];
                            docExists = true;
                            break;
                        }
                    }
                }
                //needs to be corrected for saving member's lang at nation side....
                var member;
                var members = new App.Collections.Members()
                members.login = $.cookie('Member.login');
                //   clanguage=currentConfig.currentLanguage;
                members.fetch({
                    success: function () {
                        if (members.length > 0) {
                            for(var i = 0; i < members.length; i++)
                            {
                                if(members.models[i].get("community") == jsonConfig.code)
                                {
                                    member = members.models[i];
                                    member.set("bellLanguage",clanguage);
                                    member.once('sync', function() {})

                                    member.save(null, {
                                        success: function(doc, rev) {
                                        },
                                        async:false
                                    });
                                }
                            }
                        }
                    },
                    async:false

                });

            }
            return languageDict;
        },
        getAvailableLanguages : function (){
            var allLanguages={};
            var languages = new App.Collections.Languages();
            languages.fetch({
                async: false
            });
            for(var i=0;i<languages.length;i++) {
                if (languages.models[i].attributes.hasOwnProperty("nameOfLanguage")) {
                    var languageName =languages.models[i].attributes.nameOfLanguage;
                    allLanguages[languageName]=languages.models[i].get('nameInNativeLang');
                }
            }
            return allLanguages;
        },
        applyCorrectStylingSheet: function(directionOfLang) {
            if (directionOfLang.toLowerCase() === "right") {

                $('link[rel=stylesheet][href~="app/Home.css"]').attr('disabled', 'false');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').removeAttr('disabled');

            } else if (directionOfLang.toLowerCase() === "left") {
                $('link[rel=stylesheet][href~="app/Home.css"]').removeAttr('disabled');
                $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').attr('disabled', 'false');
            }
            else {
                alert(App.languageDictValue.attributes.error_direction);
            }
        },

        routeStartupTasks: function() {
            $('#invitationdiv').hide()
            $('#debug').hide()

        },
        findIndicesOfMax: function(inp, count) {
            var outp = [];
            for (var i = 0; i < inp.length; i++) {
                outp.push(i); // add index to output array
                if (outp.length > count) {
                    outp.sort(function(a, b) {
                        return inp[b] - inp[a];
                    }); // descending sort the output array
                    outp.pop(); // remove the last index (index of smallest element in output array)
                }
            }
            if (inp.length <= count) {
                outp.sort(function(a, b) {
                    return inp[b] - inp[a];
                });
            }
            return outp;
        },
        findIndicesOfMin: function(inp, count) {
            var outp = [];
            for (var i = 0; i < inp.length; i++) {
                outp.push(i); // add index to output array
                if (outp.length > count) {
                    outp.sort(function(a, b) {
                        return inp[a] - inp[b];
                    }); // descending sort the output array
                    outp.pop(); // remove the last index (index of smallest element in output array)
                }
            }
            if (inp.length <= count) {
                outp.sort(function(a, b) {
                    return inp[a] - inp[b];
                });
            }
            return outp;
        },
        aggregateDataForTrendReport: function(CommunityName, logData) {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            // now we will assign values from first of the activitylog records, returned for the period from startDate to
            // endDate, to local variables  so that we can keep aggregating values from all the just fetched activitylog
            // records into these variables and then just display them in the output
            //  var superMgrIndex =  member.get('roles').indexOf('SuperManager');
            //*********************************************************************
            /*var roles =this.getRoles();
             var SuperMgrIndex = roles.indexOf("SuperManager");

             if( -1){*/
            //*********************************************************************
            if (logData.length < 1) {
                var staticData = {
                    "Visits": {
                        "male": 0,
                        "female": 0
                    },
                    "New_Signups": {
                        "male": 0,
                        "female": 0
                    },
                    "Deleted": {
                        "male": 0,
                        "female": 0
                    },
                    "Most_Freq_Open": [],
                    "Highest_Rated": [],
                    "Lowest_Rated": [],
                    "ResourceViews": {
                        "male": 0,
                        "female": 0
                    }
                };
                return staticData;
            }
            var logReport = logData[0];
            if (logReport == undefined) {
                alert(languageDictValue.attributes.No_Activity_Logged)
            }
            var report_resRated = [],
                report_resOpened = [],
                report_resNames = [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                report_male_visits = 0,
                report_female_visits = 0,
                report_male_new_signups = 0,
                report_female_new_signups = 0,
                report_male_rating = [],
                report_female_rating = [],
                report_male_timesRated = [],
                report_female_timesRated = [],
                report_male_opened = [],
                report_female_opened = [];
            var report_female_deleted = 0,
                report_male_deleted = 0;
            if (logReport.resourcesIds) {
                report_resRated = logReport.resourcesIds;
            }
            //********************************************************************************************
            //Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
            //********************************************************************************************
            if (logReport.resources_names) {
                report_resNames = logReport.resources_names
            }
            //********************************************************************************************
            if (logReport.resources_opened) {
                report_resOpened = logReport.resources_opened
            }
            if (logReport.male_visits) {
                report_male_visits = logReport.male_visits
            }
            if (logReport.female_visits) {
                report_female_visits = logReport.female_visits
            }

            if (logReport.male_new_signups) {
                report_male_new_signups = logReport.male_new_signups
            }
            if (logReport.female_new_signups) {
                report_female_new_signups = logReport.female_new_signups
            }

            if (logReport.male_rating) {
                report_male_rating = logReport.male_rating
            }
            if (logReport.female_rating) {
                report_female_rating = logReport.female_rating
            }
            if (logReport.male_timesRated) {
                report_male_timesRated = logReport.male_timesRated
            }
            if (logReport.female_timesRated) {
                report_female_timesRated = logReport.female_timesRated
            }
            if (logReport.male_opened) {
                report_male_opened = logReport.male_opened
            }
            if (logReport.female_opened) {
                report_female_opened = logReport.female_opened
            }
            if (logReport.male_deleted_count) {
                report_male_deleted = logReport.male_deleted_count
            }
            if (logReport.female_deleted_count) {
                report_female_deleted = logReport.female_deleted_count
            }
            for (var index = 0; index < logData.length; index++) {
                if (index > 0) {
                    var logDoc = logData[index];
                    // add visits to prev total
                    report_male_visits += logDoc.male_visits;
                    report_female_visits += logDoc.female_visits;

                    // add new member signups count to prev total
                    report_male_new_signups += ((logDoc.male_new_signups) ? logDoc.male_new_signups : 0);
                    report_female_new_signups += ((logDoc.female_new_signups) ? logDoc.female_new_signups : 0);
                    report_female_deleted += (logDoc.female_deleted_count ? logDoc.female_deleted_count : 0);
                    report_male_deleted += (logDoc.male_deleted_count ? logDoc.male_deleted_count : 0);

                    var resourcesIds = logDoc.resourcesIds;
                    //Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                    var resourcesNames = logDoc.resources_names;
                    //******************************************************************************************
                    var resourcesOpened = logDoc.resources_opened;
                    for (var i = 0; i < resourcesIds.length; i++) {
                        var resId = resourcesIds[i]
                        var resourceIndex = report_resRated.indexOf(resId)
                        if (resourceIndex == -1) {
                            report_resRated.push(resId);
                            report_male_rating.push(logDoc.male_rating[i])
                            report_female_rating.push(logDoc.female_rating[i]);
                            report_male_timesRated.push(logDoc.male_timesRated[i]);
                            report_female_timesRated.push(logDoc.female_timesRated[i]);
                        } else {
                            report_male_rating[resourceIndex] = report_male_rating[resourceIndex] + logDoc.male_rating[i];
                            report_female_rating[resourceIndex] = report_female_rating[resourceIndex] + logDoc.female_rating[i];
                            report_male_timesRated[resourceIndex] = report_male_timesRated[resourceIndex] + logDoc.male_timesRated[i];
                            report_female_timesRated[resourceIndex] = report_female_timesRated[resourceIndex] + logDoc.female_timesRated[i];
                        }
                    }
                    if (resourcesOpened) {
                        for (var i = 0; i < resourcesOpened.length; i++) {
                            var resId = resourcesOpened[i]
                            var resourceIndex = report_resOpened.indexOf(resId)
                            if (resourceIndex == -1) {
                                report_resOpened.push(resId)
                                //*******************************************************************************************
                                //Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                                //*******************************************************************************************
                                if (resourcesNames != undefined && resourcesNames != null) {
                                    if (resourcesNames.length > 0) {
                                        // alert(resourcesNames[i])
                                        report_resNames.push(resourcesNames[i])
                                    }
                                }

                                //*******************************************************************************************
                                report_male_opened.push(logDoc.male_opened[i])
                                report_female_opened.push(logDoc.female_opened[i])
                            } else {
                                report_male_opened[resourceIndex] = report_male_opened[resourceIndex] + logDoc.male_opened[i]
                                report_female_opened[resourceIndex] = report_female_opened[resourceIndex] + logDoc.female_opened[i]
                            }
                        }
                    }
                }
            }
            var femaleOpenedCount = 0;
            for (var i = 0; i < report_female_opened.length; i++) {
                femaleOpenedCount += report_female_opened[i];

            }
            var maleOpenedCount = 0;
            for (var i = 0; i < report_male_opened.length; i++) {
                maleOpenedCount += report_male_opened[i];

            }
            // find most frequently opened resources
            var times_opened_cumulative = [],
                Most_Freq_Opened = [];
            for (var i = 0; i < report_resOpened.length; i++) {
                times_opened_cumulative.push(report_male_opened[i] + report_female_opened[i]);
            }
            var indices = [];
            var topCount = 5;
            if (times_opened_cumulative.length >= topCount) {
                indices = this.findIndicesOfMax(times_opened_cumulative, topCount);
            } else {
                indices = this.findIndicesOfMax(times_opened_cumulative, times_opened_cumulative.length);
            }
            // fill up most_freq_opened array
            var timesRatedTotalForThisResource, sumOfRatingsForThisResource;
            if (times_opened_cumulative.length > 0) {
                var most_freq_res_entry, indexFound;
                for (var i = 0; i < indices.length; i++) {
                    var res = new App.Models.Resource({
                        _id: report_resOpened[indices[i]]
                    });
                    res.fetch({
                        async: false
                    });
                    var test = report_resOpened[indices[i]]
                    var name = res.get('title');
                    // var name = 'ffghgghfghfh';
                    //*******************************************************************************************
                    //Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                    //*******************************************************************************************
                    //typeof variable_here === 'undefined'
                    if (!name) {
                        var indexofres = report_resOpened.indexOf(test);
                        name = report_resNames[indices[i]];
                    }
                    //*******************************************************************************************
                    // create most freq opened resource entry and push it into Most_Freq_Opened array
                    most_freq_res_entry = {
                        "resourceName": name,
                        "timesOpenedCumulative": times_opened_cumulative[indices[i]],
                        "timesOpenedByMales": report_male_opened[indices[i]],
                        "timesOpenedByFemales": report_female_opened[indices[i]]
                    };
                    if ((indexFound = report_resRated.indexOf(report_resOpened[indices[i]])) === -1) { // resource not rated
                        most_freq_res_entry["avgRatingCumulative"] = App.languageDictValue.get('Not_Applicable');
                        most_freq_res_entry["avgRatingByMales"] = App.languageDictValue.get('Not_Applicable');
                        most_freq_res_entry["avgRatingByFemales"] = App.languageDictValue.get('Not_Applicable');
                        most_freq_res_entry["timesRatedByMales"] = App.languageDictValue.get('Not_Applicable');
                        most_freq_res_entry["timesRatedByFemales"] = App.languageDictValue.get('Not_Applicable');
                        most_freq_res_entry["timesRatedCumulative"] = App.languageDictValue.get('Not_Applicable');
                    } else {
                        var mostFreqAvg=Math.round((sumOfRatingsForThisResource / timesRatedTotalForThisResource) * 100) / 100;
                        if(isNaN(mostFreqAvg))
                        {
                            mostFreqAvg=0;
                        }
                        else {
                            mostFreqAvg=Math.round((sumOfRatingsForThisResource / timesRatedTotalForThisResource) * 100) / 100;;
                        }
                        timesRatedTotalForThisResource = report_male_timesRated[indexFound] + report_female_timesRated[indexFound];
                        sumOfRatingsForThisResource = report_male_rating[indexFound] + report_female_rating[indexFound];

                        most_freq_res_entry["avgRatingCumulative"] =mostFreqAvg;
                        most_freq_res_entry["avgRatingByMales"] = report_male_rating[indexFound];
                        most_freq_res_entry["avgRatingByFemales"] = report_female_rating[indexFound];
                        most_freq_res_entry["timesRatedByMales"] = report_male_timesRated[indexFound];
                        most_freq_res_entry["timesRatedByFemales"] = report_female_timesRated[indexFound];
                        most_freq_res_entry["timesRatedCumulative"] = timesRatedTotalForThisResource;
                    }
                    Most_Freq_Opened.push(most_freq_res_entry);
                }
            }

            // find highest rated resources
            var resources_rated_cumulative = [],
                Highest_Rated_Resources = [],
                Lowest_Rated_Resources = [];
            var lowestHowMany = 5;
            for (var i = 0; i < report_resRated.length; i++) {
                timesRatedTotalForThisResource = report_male_timesRated[i] + report_female_timesRated[i];
                sumOfRatingsForThisResource = report_male_rating[i] + report_female_rating[i];
                resources_rated_cumulative.push(sumOfRatingsForThisResource / timesRatedTotalForThisResource);
            }
            var indicesHighestRated = [],
                indicesLowestRated = [];
            if (resources_rated_cumulative.length >= topCount) {
                indicesHighestRated = this.findIndicesOfMax(resources_rated_cumulative, topCount);
                indicesLowestRated = this.findIndicesOfMin(resources_rated_cumulative, lowestHowMany);
            } else {
                indicesHighestRated = this.findIndicesOfMax(resources_rated_cumulative, resources_rated_cumulative.length);
                indicesLowestRated = this.findIndicesOfMin(resources_rated_cumulative, resources_rated_cumulative.length);
            }
            if (resources_rated_cumulative.length > 0) {
                var entry_rated_highest, entry_rated_lowest;
                // fill up Highest_Rated_resources list
                for (var i = 0; i < indicesHighestRated.length; i++) {
                    var res = new App.Models.Resource({
                        _id: report_resRated[indicesHighestRated[i]]
                    });
                    res.fetch({
                        async: false
                    });
                    var name = res.get('title');
                    //***********************************************#84
                    if (!name) {
                        var indexofres = report_resOpened.indexOf(test);
                        name = report_resNames[indices[i]];
                    }
                    //*****************************************
                    timesRatedTotalForThisResource = report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]];
                    // create highest rated resource entry and push it into Highest_Rated_Resources array
                    var highRateAvg=Math.round(resources_rated_cumulative[indicesHighestRated[i]] * 100) / 100;
                    if(isNaN(highRateAvg))
                    {
                        highRateAvg=0;
                    }
                    else {
                        highRateAvg=Math.round(resources_rated_cumulative[indicesHighestRated[i]] * 100) / 100;
                    }
                    entry_rated_highest = {
                        "resourceName": name,
                        "avgRatingCumulative":highRateAvg ,
                        "avgRatingByMales": report_male_rating[indicesHighestRated[i]],
                        "avgRatingByFemales": report_female_rating[indicesHighestRated[i]],
                        "timesRatedByMales": report_male_timesRated[indicesHighestRated[i]],
                        "timesRatedByFemales": report_female_timesRated[indicesHighestRated[i]],
                        "timesRatedCumulative": report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]]
                    };
                    if ((indexFound = report_resOpened.indexOf(report_resRated[indicesHighestRated[i]])) === -1) { // resource not rated
                        entry_rated_highest["timesOpenedByMales"] = App.languageDictValue.get('Not_Applicable');
                        entry_rated_highest["timesOpenedByFemales"] = App.languageDictValue.get('Not_Applicable');
                        entry_rated_highest["timesOpenedCumulative"] = App.languageDictValue.get('Not_Applicable');
                    } else {
                        entry_rated_highest["timesOpenedByMales"] = report_male_opened[indexFound];
                        entry_rated_highest["timesOpenedByFemales"] = report_female_opened[indexFound];
                        entry_rated_highest["timesOpenedCumulative"] = times_opened_cumulative[indexFound];
                    }
                    Highest_Rated_Resources.push(entry_rated_highest);
                }
                // fill up Lowest_Rated_resources list
                for (var i = 0; i < indicesLowestRated.length; i++) {
                    timesRatedTotalForThisResource = report_male_timesRated[indicesLowestRated[i]] + report_female_timesRated[indicesLowestRated[i]];
                    // create lowest rated resource entry and push it into Lowest_Rated_Resources array
                    var res = new App.Models.Resource({
                        _id: report_resRated[indicesLowestRated[i]]
                    })
                    res.fetch({
                        async: false
                    })
                    var name = res.get('title')
                    //***********************************************#84
                    if (!name) {
                        var indexofres = report_resOpened.indexOf(test);
                        name = report_resNames[indices[i]];
                    }
                    //*****************************************
                    var lowestRated=Math.round(resources_rated_cumulative[indicesLowestRated[i]] * 100) / 100;
                    if(isNaN(lowestRated))
                    {
                        lowestRated=0;
                    }
                    else {
                        lowestRated=Math.round(resources_rated_cumulative[indicesLowestRated[i]] * 100) / 100;
                    }
                    entry_rated_lowest = {
                        "resourceName": name,
                        "avgRatingCumulative": lowestRated,
                        "avgRatingByMales": report_male_rating[indicesLowestRated[i]],
                        "avgRatingByFemales": report_female_rating[indicesLowestRated[i]],
                        "timesRatedByMales": report_male_timesRated[indicesLowestRated[i]],
                        "timesRatedByFemales": report_female_timesRated[indicesLowestRated[i]],
                        "timesRatedCumulative": report_male_timesRated[indicesLowestRated[i]] + report_female_timesRated[indicesLowestRated[i]]
                    };
                    if ((indexFound = report_resOpened.indexOf(report_resRated[indicesLowestRated[i]])) === -1) { // resource not rated
                        entry_rated_lowest["timesOpenedByMales"] = App.languageDictValue.get('Not_Applicable');
                        entry_rated_lowest["timesOpenedByFemales"] = App.languageDictValue.get('Not_Applicable');
                        entry_rated_lowest["timesOpenedCumulative"] = App.languageDictValue.get('Not_Applicable');
                    } else {
                        entry_rated_lowest["timesOpenedByMales"] = report_male_opened[indexFound];
                        entry_rated_lowest["timesOpenedByFemales"] = report_female_opened[indexFound];
                        entry_rated_lowest["timesOpenedCumulative"] = times_opened_cumulative[indexFound];
                    }
                    Lowest_Rated_Resources.push(entry_rated_lowest);
                }
            }
            var staticData = {
                "Visits": {
                    "male": report_male_visits,
                    "female": report_female_visits
                },
                "New_Signups": {
                    "male": report_male_new_signups,
                    "female": report_female_new_signups
                },
                "Deleted": {
                    "male": report_male_deleted,
                    "female": report_female_deleted
                },
                "Most_Freq_Open": Most_Freq_Opened,
                "Highest_Rated": Highest_Rated_Resources,
                "Lowest_Rated": Lowest_Rated_Resources,
                "ResourceViews": {
                    "male": maleOpenedCount,
                    "female": femaleOpenedCount
                }
            };
            return staticData;
        },
        turnDateFromMMDDYYYYToYYYYMMDDFormat: function(date) {
            var datePart = date.match(/\d+/g),
                month = datePart[0],
                day = datePart[1],
                year = datePart[2];
            return year + '/' + month + '/' + day;
        },
        turnDateToYYYYMMDDFormat: function(date) {
            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            // CONVERT mm AND dd INTO chars
            var mmChars = mm.split('');
            var ddChars = dd.split('');
            // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
            var dateString = yyyy + '/' + (mmChars.length === 2 ? mm : "0" + mmChars[0]) + '/' + (ddChars.length === 2 ? dd : "0" + ddChars[0]);
            return dateString;
        },
        changeDateFormat: function(date) {
            var datePart = date.match(/\d+/g),
                year = datePart[0],
                month = datePart[1],
                day = datePart[2];
            return year + '/' + month + '/' + day;
        },
        Configuration: function() {

            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configModel = configCollection.first();
            var configForm = new App.Views.Configurations({
                model: configModel
            });
            App.$el.children('.body').html('<div id="configTable"></div>');
            configForm.render();
            $('#configTable').append(configForm.el);
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            if(languageDictValue.get('directionOfLang').toLowerCase()==="right"){
                $('#configTable').css({"direction":"rtl",
                    "margin-right": "2%"});
                $('#configTable div div h3').css('margin-right','0%');
            }

        },
        getRegisteredMembersCount: function(communityChosen, callback) {
            var maleMembers = 0,
                femaleMembers = 0;
            $.ajax({
                url: '/activitylog/_design/bell/_view/GetMaleCountByCommunity?key="' + communityChosen + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(json) {
                    if (json.rows[0]) {
                        maleMembers = json.rows[0].value
                    }
                    $.ajax({
                        url: '/activitylog/_design/bell/_view/GetFemaleCountByCommunity?key="' + communityChosen + '"',
                        type: 'GET',
                        dataType: "json",
                        async: false,
                        success: function(json) {
                            if (json.rows[0]) {
                                femaleMembers = json.rows[0].value;
                            }
                            callback(maleMembers, femaleMembers);
                        }
                    })
                }
            })
        },
        getRegisteredMembersCountFromMembersDB: function(communityChosen, callback) {
            var maleMembers = 0,
                femaleMembers = 0;
            $.ajax({
                url: '/members/_design/bell/_view/MaleCountByCommunity?key="' + communityChosen + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(json) {
                    if (json.rows[0]) {
                        maleMembers = json.rows[0].value
                    }
                    $.ajax({
                        url: '/members/_design/bell/_view/FemaleCountByCommunity?key="' + communityChosen + '"',
                        type: 'GET',
                        dataType: "json",
                        async: false,
                        success: function(json) {
                            if (json.rows[0]) {
                                femaleMembers = json.rows[0].value;
                            }
                            callback(maleMembers, femaleMembers);
                        }
                    })
                }
            })
        },
        ////////////Total Member Visits///////
        getTotalMemberVisits: function(communityChosen, callback) {
            var maleVisits = 0,
                femaleVisits = 0;
            $.ajax({
                url: '/activitylog/_design/bell/_view/GetMaleVisitsByCommunity?key="' + communityChosen + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(json) {
                    if (json.rows[0]) {
                        maleVisits = json.rows[0].value
                    }
                    $.ajax({
                        url: '/activitylog/_design/bell/_view/GetFemaleVisitsByCommunity?key="' + communityChosen + '"',
                        type: 'GET',
                        dataType: "json",
                        async: false,
                        success: function(json) {
                            if (json.rows[0]) {
                                femaleVisits = json.rows[0].value;
                            }
                            callback(maleVisits, femaleVisits);
                        }
                    })
                }
            })
        },
        //*************************************************************************************************************
        //Trend Report for Communities page on nation (Start)
        //issue#50:Add Last Activities Sync Date to Activity Report On Nation For Individual Communities
        //Issue#80:Add Report button on the Communities page at nation
        //*************************************************************************************************************
        communityReport: function(communityLastSyncDate, communityName, communityCode, endDate) {
            var lang;
            if($.cookie('Member.login'))
            {
                lang = App.Router.getLanguage($.cookie('Member.login'));
            }
            else
            {
                $('#nav').hide();
                lang = "English";
            }
            App.languageDictValue = App.Router.loadLanguageDocs(lang);
            App.startActivityIndicator();
            var context = this;
            // alert("Code"+communityCode+ " Name" +communityName+ "Date" +communityLastSyncDate );
            var communityChosen = communityCode;
            var communityName = communityName;
            var communityLastActivitySyncDate = communityLastSyncDate;

            if(endDate != undefined && endDate != ""){
                var endDt = endDate.split("-");
                var Year = endDt[0];
                var Mnth = parseInt(endDt[1]);
                var endDateForTrendReport = new Date(Year, Mnth, 00, 23, 59, 59); // selected date turned into javascript 'Date' format
            } else {
                var endDateForTrendReport = new Date(); // selected date turned into javascript 'Date' format
            }  
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            var lastMonthStartDate = new Date(endDateForTrendReport.getFullYear(), endDateForTrendReport.getMonth(), 1);
            var secondLastMonthEndDate = new Date(lastMonthStartDate.getFullYear(), lastMonthStartDate.getMonth(), (lastMonthStartDate.getDate() - 1));
            var secondLastMonthStartDate = new Date(secondLastMonthEndDate.getFullYear(), secondLastMonthEndDate.getMonth(), 1);
            var thirdLastMonthEndDate = new Date(secondLastMonthStartDate.getFullYear(), secondLastMonthStartDate.getMonth(), (secondLastMonthStartDate.getDate() - 1));
            var thirdLastMonthStartDate = new Date(thirdLastMonthEndDate.getFullYear(), thirdLastMonthEndDate.getMonth(), 1);
            var fourthLastMonthEndDate = new Date(thirdLastMonthStartDate.getFullYear(), thirdLastMonthStartDate.getMonth(), (thirdLastMonthStartDate.getDate() - 1));
            var fourthLastMonthStartDate = new Date(fourthLastMonthEndDate.getFullYear(), fourthLastMonthEndDate.getMonth(), 1);
            var fifthLastMonthEndDate = new Date(fourthLastMonthStartDate.getFullYear(), fourthLastMonthStartDate.getMonth(), (fourthLastMonthStartDate.getDate() - 1));
            var fifthLastMonthStartDate = new Date(fifthLastMonthEndDate.getFullYear(), fifthLastMonthEndDate.getMonth(), 1);
            var sixthLastMonthEndDate = new Date(fifthLastMonthStartDate.getFullYear(), fifthLastMonthStartDate.getMonth(), (fifthLastMonthStartDate.getDate() - 1));
            var sixthLastMonthStartDate = new Date(sixthLastMonthEndDate.getFullYear(), sixthLastMonthEndDate.getMonth(), 1);
            var seventhLastMonthEndDate = new Date(sixthLastMonthStartDate.getFullYear(), sixthLastMonthStartDate.getMonth(), (sixthLastMonthStartDate.getDate() - 1));
            var seventhLastMonthStartDate = new Date(seventhLastMonthEndDate.getFullYear(), seventhLastMonthEndDate.getMonth(), 1);
            var eighthLastMonthEndDate = new Date(seventhLastMonthStartDate.getFullYear(), seventhLastMonthStartDate.getMonth(), (seventhLastMonthStartDate.getDate() - 1));
            var eighthLastMonthStartDate = new Date(eighthLastMonthEndDate.getFullYear(), eighthLastMonthEndDate.getMonth(), 1);
            var ninthLastMonthEndDate = new Date(eighthLastMonthStartDate.getFullYear(), eighthLastMonthStartDate.getMonth(), (eighthLastMonthStartDate.getDate() - 1));
            var ninthLastMonthStartDate = new Date(ninthLastMonthEndDate.getFullYear(), ninthLastMonthEndDate.getMonth(), 1);
            var tenthLastMonthEndDate = new Date(ninthLastMonthStartDate.getFullYear(), ninthLastMonthStartDate.getMonth(), (ninthLastMonthStartDate.getDate() - 1));
            var tenthLastMonthStartDate = new Date(tenthLastMonthEndDate.getFullYear(), tenthLastMonthEndDate.getMonth(), 1);
            var eleventhLastMonthEndDate = new Date(tenthLastMonthStartDate.getFullYear(), tenthLastMonthStartDate.getMonth(), (fifthLastMonthStartDate.getDate() - 1));
            var eleventhLastMonthStartDate = new Date(eleventhLastMonthEndDate.getFullYear(), eleventhLastMonthEndDate.getMonth(), 1);
            var twelfthLastMonthEndDate = new Date(eleventhLastMonthStartDate.getFullYear(), eleventhLastMonthStartDate.getMonth(), (eleventhLastMonthStartDate.getDate() - 1));
            var twelfthLastMonthStartDate = new Date(twelfthLastMonthEndDate.getFullYear(), twelfthLastMonthEndDate.getMonth(), 1);

            var startDate = context.changeDateFormat(context.turnDateToYYYYMMDDFormat(twelfthLastMonthStartDate));
            var endDate = context.changeDateFormat(context.turnDateToYYYYMMDDFormat(endDateForTrendReport));
            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            var activityDataColl = new App.Collections.ActivityLog();
            var urlTemp = App.Server + '/activitylog/_design/bell/_view/getDocByCommunityCode?include_docs=true&startkey=["' + communityChosen + '","' + startDate + '"]&endkey=["' +
                communityChosen + '","' + endDate + '"]';
            activityDataColl.setUrl(urlTemp);
            activityDataColl.fetch({ // logData.logDate is not assigned any value so the view called will be one that uses start and
                // end keys rather than logdate to fetch activitylog docs from the db
                async: false
            });
            activityDataColl.toJSON();
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            // iterate over activitylog models inside the activityDataColl collection and assign each to the month range in which they lie
            // ********************************************************************************************************
            var endingMonthActivityData = [],
                secondLastMonthActivityData = [],
                thirdLastMonthActivityData = [],
                fourthLastMonthActivityData = [],
                fifthLastMonthActivityData = [],
                sixthLastMonthActivityData = [],
                seventhLastMonthActivityData = [],
                eighthLastMonthActivityData = [],
                ninthLastMonthActivityData = [],
                tenthLastMonthActivityData = [],
                eleventhLastMonthActivityData = [],
                twelfthLastMonthActivityData = [];
            //  ********************************************************************************************************
            for (var i in activityDataColl.models) {
                var modelKey = context.turnDateFromMMDDYYYYToYYYYMMDDFormat(activityDataColl.models[i].get('logDate'));

                if ((modelKey >= context.turnDateToYYYYMMDDFormat(lastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(endDateForTrendReport))) {
                    endingMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(secondLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(secondLastMonthEndDate))) {
                    secondLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(thirdLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(thirdLastMonthEndDate))) {
                    thirdLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(fourthLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(fourthLastMonthEndDate))) {
                    fourthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(fifthLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(fifthLastMonthEndDate))) {
                    fifthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(sixthLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(sixthLastMonthEndDate))) {
                    sixthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(seventhLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(seventhLastMonthEndDate))) {
                    seventhLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(eighthLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(eighthLastMonthEndDate))) {
                    eighthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(ninthLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(ninthLastMonthEndDate))) {
                    ninthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(tenthLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(tenthLastMonthEndDate))) {
                    tenthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(eleventhLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(eleventhLastMonthEndDate))) {
                    eleventhLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(twelfthLastMonthStartDate)) &&
                    (modelKey <= context.turnDateToYYYYMMDDFormat(twelfthLastMonthEndDate))) {
                    twelfthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                }
            }
            //  ********************************************************************************************************
            var lastMonthDataset = context.aggregateDataForTrendReport('communityX', endingMonthActivityData);
            var secondLastMonthDataset = context.aggregateDataForTrendReport('communityX', secondLastMonthActivityData);
            var thirdLastMonthDataset = context.aggregateDataForTrendReport('communityX', thirdLastMonthActivityData);
            var fourthLastMonthDataset = context.aggregateDataForTrendReport('communityX', fourthLastMonthActivityData);
            var fifthLastMonthDataset = context.aggregateDataForTrendReport('communityX', fifthLastMonthActivityData);
            var sixthLastMonthDataset = context.aggregateDataForTrendReport('communityX', sixthLastMonthActivityData);
            var seventhLastMonthDataset = context.aggregateDataForTrendReport('communityX', seventhLastMonthActivityData);
            var eighthLastMonthDataset = context.aggregateDataForTrendReport('communityX', eighthLastMonthActivityData);
            var ninthLastMonthDataset = context.aggregateDataForTrendReport('communityX', ninthLastMonthActivityData);
            var tenthLastMonthDataset = context.aggregateDataForTrendReport('communityX', tenthLastMonthActivityData);
            var eleventhLastMonthDataset = context.aggregateDataForTrendReport('communityX', eleventhLastMonthActivityData);
            var twelfthLastMonthDataset = context.aggregateDataForTrendReport('communityX', twelfthLastMonthActivityData);

            var aggregateDataset = context.aggregateDataForTrendReport('communityX', JSON.parse(JSON.stringify(activityDataColl.models)));
            //  ********************************************************************************************************
            var monthNames = [App.Router.lookup(App.languageDictValue, "Months." + "January"), App.Router.lookup(App.languageDictValue, "Months." + "February"), App.Router.lookup(App.languageDictValue, "Months." + "March"), App.Router.lookup(App.languageDictValue, "Months." + "April"), App.Router.lookup(App.languageDictValue, "Months." + "May"), App.Router.lookup(App.languageDictValue, "Months." + "June"), App.Router.lookup(App.languageDictValue, "Months." + "July"), App.Router.lookup(App.languageDictValue, "Months." + "August"), App.Router.lookup(App.languageDictValue, "Months." + "September"), App.Router.lookup(App.languageDictValue, "Months." + "October"), App.Router.lookup(App.languageDictValue, "Months." + "November"),App.Router.lookup(App.languageDictValue, "Months." + "December")];
            //  ********************************************************************************************************
            // show registered members at end of each month falling in duration of this report
            var totalRegisteredMembers = {
                male: 0,
                female: 0
            };
            context.getRegisteredMembersCount(communityChosen, function(param1, param2) {
                totalRegisteredMembers['male'] = param1;
                totalRegisteredMembers['female'] = param2;
            });
            //  ********************************************************************************************************
            //////////////////////////////////Registered Members from Members db 11 may 2015 ///////////////////////
            var totalRegisteredMembersFromMembersDb = {
                male: 0,
                female: 0
            };
            context.getRegisteredMembersCountFromMembersDB(communityChosen, function(param1, param2) {
                totalRegisteredMembersFromMembersDb['male'] = param1;
                totalRegisteredMembersFromMembersDb['female'] = param2;
            });
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  ********************************************************************************************************
            ///////////////////////////////////////////////Total Visits/////////////////////////////////////////////
            var totalMemberVisits = {
                male: 0,
                female: 0
            };
            context.getTotalMemberVisits(communityChosen, function(param1, param2) {
                totalMemberVisits['male'] = param1;
                totalMemberVisits['female'] = param2;
            });
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  ********************************************************************************************************
            var registeredMembersTillNow = {
                male: totalRegisteredMembers['male'],
                female: totalRegisteredMembers['female'],
                total: 0
            };
            var registeredMembersTillSecondLastMonthEnd = {
                male: totalRegisteredMembers['male'] - lastMonthDataset.New_Signups['male'],
                female: totalRegisteredMembers['female'] - lastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillThirdLastMonthEnd = {
                male: registeredMembersTillSecondLastMonthEnd['male'] - secondLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillSecondLastMonthEnd['female'] - secondLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillFourthLastMonthEnd = {
                male: registeredMembersTillThirdLastMonthEnd['male'] - thirdLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillThirdLastMonthEnd['female'] - thirdLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillFifthLastMonthEnd = {
                male: registeredMembersTillFourthLastMonthEnd['male'] - fourthLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillFourthLastMonthEnd['female'] - fourthLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillSixthLastMonthEnd = {
                male: registeredMembersTillFifthLastMonthEnd['male'] - fifthLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillFifthLastMonthEnd['female'] - fifthLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillSeventhLastMonthEnd = {
                male: registeredMembersTillSixthLastMonthEnd['male'] - sixthLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillSixthLastMonthEnd['female'] - sixthLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillEighthLastMonthEnd = {
                male: registeredMembersTillSeventhLastMonthEnd['male'] - seventhLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillSeventhLastMonthEnd['female'] - seventhLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillNinthLastMonthEnd = {
                male: registeredMembersTillEighthLastMonthEnd['male'] - eighthLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillEighthLastMonthEnd['female'] - eighthLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillTenthLastMonthEnd = {
                male: registeredMembersTillNinthLastMonthEnd['male'] - ninthLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillNinthLastMonthEnd['female'] - ninthLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillEleventhLastMonthEnd = {
                male: registeredMembersTillTenthLastMonthEnd['male'] - tenthLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillTenthLastMonthEnd['female'] - tenthLastMonthDataset.New_Signups['female'],
                total: 0
            };
            var registeredMembersTillTwelfthLastMonthEnd = {
                male: registeredMembersTillEleventhLastMonthEnd['male'] - eleventhLastMonthDataset.New_Signups['male'],
                female: registeredMembersTillEleventhLastMonthEnd['female'] - eleventhLastMonthDataset.New_Signups['female'],
                total: 0
            };
            //  ********************************************************************************************************
            registeredMembersTillNow['total'] = registeredMembersTillNow['male'] + registeredMembersTillNow['female'];
            registeredMembersTillSecondLastMonthEnd['total'] = registeredMembersTillSecondLastMonthEnd['male'] + registeredMembersTillSecondLastMonthEnd['female'];
            registeredMembersTillThirdLastMonthEnd['total'] = registeredMembersTillThirdLastMonthEnd['male'] + registeredMembersTillThirdLastMonthEnd['female'];
            registeredMembersTillFourthLastMonthEnd['total'] = registeredMembersTillFourthLastMonthEnd['male'] + registeredMembersTillFourthLastMonthEnd['female'];
            registeredMembersTillFifthLastMonthEnd['total'] = registeredMembersTillFifthLastMonthEnd['male'] + registeredMembersTillFifthLastMonthEnd['female'];
            registeredMembersTillSixthLastMonthEnd['total'] = registeredMembersTillSixthLastMonthEnd['male'] + registeredMembersTillSixthLastMonthEnd['female'];
            registeredMembersTillSeventhLastMonthEnd['total'] = registeredMembersTillSeventhLastMonthEnd['male'] + registeredMembersTillSeventhLastMonthEnd['female'];
            registeredMembersTillEighthLastMonthEnd['total'] = registeredMembersTillEighthLastMonthEnd['male'] + registeredMembersTillEighthLastMonthEnd['female'];
            registeredMembersTillNinthLastMonthEnd['total'] = registeredMembersTillNinthLastMonthEnd['male'] + registeredMembersTillNinthLastMonthEnd['female'];
            registeredMembersTillTenthLastMonthEnd['total'] = registeredMembersTillTenthLastMonthEnd['male'] + registeredMembersTillTenthLastMonthEnd['female'];
            registeredMembersTillEleventhLastMonthEnd['total'] = registeredMembersTillEleventhLastMonthEnd['male'] + registeredMembersTillEleventhLastMonthEnd['female'];
            registeredMembersTillTwelfthLastMonthEnd['total'] = registeredMembersTillTwelfthLastMonthEnd['male'] + registeredMembersTillTwelfthLastMonthEnd['female'];
            //  ********************************************************************************************************
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  ********************************************************************************************************
            ///////////////////////////////////////////Total Members//////////////////////////////////////////////////
            var registeredMembersFromMembersDbTillNow = {
                male: totalRegisteredMembersFromMembersDb['male'],
                female: totalRegisteredMembersFromMembersDb['female'],
                total: 0
            };
            var registeredMembersFromMembersDbTillSecondLastMonthEnd = {
                male: totalRegisteredMembersFromMembersDb['male'] - (lastMonthDataset.New_Signups['male'] - lastMonthDataset.Deleted['male']),
                female: totalRegisteredMembersFromMembersDb['female'] - (lastMonthDataset.New_Signups['female'] - lastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillThirdLastMonthEnd = {
                male: registeredMembersFromMembersDbTillSecondLastMonthEnd['male'] - (secondLastMonthDataset.New_Signups['male'] - secondLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillSecondLastMonthEnd['female'] - (secondLastMonthDataset.New_Signups['female'] - secondLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillFourthLastMonthEnd = {
                male: registeredMembersFromMembersDbTillThirdLastMonthEnd['male'] - (thirdLastMonthDataset.New_Signups['male'] - thirdLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillThirdLastMonthEnd['female'] - (thirdLastMonthDataset.New_Signups['female'] - thirdLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillFifthLastMonthEnd = {
                male: registeredMembersFromMembersDbTillFourthLastMonthEnd['male'] - (fourthLastMonthDataset.New_Signups['male'] - fourthLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillFourthLastMonthEnd['female'] - (fourthLastMonthDataset.New_Signups['female'] - fourthLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillSixthLastMonthEnd = {
                male: registeredMembersFromMembersDbTillFifthLastMonthEnd['male'] - (fifthLastMonthDataset.New_Signups['male'] - fifthLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillFifthLastMonthEnd['female'] - (fifthLastMonthDataset.New_Signups['female'] - fifthLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillSeventhLastMonthEnd = {
                male: registeredMembersFromMembersDbTillSixthLastMonthEnd['male'] - (sixthLastMonthDataset.New_Signups['male'] - sixthLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillSixthLastMonthEnd['female'] - (sixthLastMonthDataset.New_Signups['female'] - sixthLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillEighthLastMonthEnd = {
                male: registeredMembersFromMembersDbTillSeventhLastMonthEnd['male'] - (seventhLastMonthDataset.New_Signups['male'] - seventhLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillSeventhLastMonthEnd['female'] - (seventhLastMonthDataset.New_Signups['female'] - seventhLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillNinthLastMonthEnd = {
                male: registeredMembersFromMembersDbTillEighthLastMonthEnd['male'] - (eighthLastMonthDataset.New_Signups['male'] - eighthLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillEighthLastMonthEnd['female'] - (eighthLastMonthDataset.New_Signups['female'] - eighthLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillTenthLastMonthEnd = {
                male: registeredMembersFromMembersDbTillNinthLastMonthEnd['male'] - (ninthLastMonthDataset.New_Signups['male'] - ninthLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillNinthLastMonthEnd['female'] - (ninthLastMonthDataset.New_Signups['female'] - ninthLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillEleventhLastMonthEnd = {
                male: registeredMembersFromMembersDbTillTenthLastMonthEnd['male'] - (tenthLastMonthDataset.New_Signups['male'] - tenthLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillTenthLastMonthEnd['female'] - (tenthLastMonthDataset.New_Signups['female'] - tenthLastMonthDataset.Deleted['female']),
                total: 0
            };
            var registeredMembersFromMembersDbTillTwelfthLastMonthEnd = {
                male: registeredMembersFromMembersDbTillEleventhLastMonthEnd['male'] - (eleventhLastMonthDataset.New_Signups['male'] - eleventhLastMonthDataset.Deleted['male']),
                female: registeredMembersFromMembersDbTillEleventhLastMonthEnd['female'] - (eleventhLastMonthDataset.New_Signups['female'] - eleventhLastMonthDataset.Deleted['female']),
                total: 0
            };
            //  ********************************************************************************************************
            //  ********************************************************************************************************
            registeredMembersFromMembersDbTillNow['total'] = registeredMembersFromMembersDbTillNow['male'] + registeredMembersFromMembersDbTillNow['female'];
            registeredMembersFromMembersDbTillSecondLastMonthEnd['total'] = registeredMembersFromMembersDbTillSecondLastMonthEnd['male'] + registeredMembersFromMembersDbTillSecondLastMonthEnd['female'];
            registeredMembersFromMembersDbTillThirdLastMonthEnd['total'] = registeredMembersFromMembersDbTillThirdLastMonthEnd['male'] + registeredMembersFromMembersDbTillThirdLastMonthEnd['female'];
            registeredMembersFromMembersDbTillFourthLastMonthEnd['total'] = registeredMembersFromMembersDbTillFourthLastMonthEnd['male'] + registeredMembersFromMembersDbTillFourthLastMonthEnd['female'];
            registeredMembersFromMembersDbTillFifthLastMonthEnd['total'] = registeredMembersFromMembersDbTillFifthLastMonthEnd['male'] + registeredMembersFromMembersDbTillFifthLastMonthEnd['female'];
            registeredMembersFromMembersDbTillSixthLastMonthEnd['total'] = registeredMembersFromMembersDbTillSixthLastMonthEnd['male'] + registeredMembersFromMembersDbTillSixthLastMonthEnd['female'];
            registeredMembersFromMembersDbTillSeventhLastMonthEnd['total'] = registeredMembersFromMembersDbTillSeventhLastMonthEnd['male'] + registeredMembersFromMembersDbTillSeventhLastMonthEnd['female'];
            registeredMembersFromMembersDbTillEighthLastMonthEnd['total'] = registeredMembersFromMembersDbTillEighthLastMonthEnd['male'] + registeredMembersFromMembersDbTillEighthLastMonthEnd['female'];
            registeredMembersFromMembersDbTillNinthLastMonthEnd['total'] = registeredMembersFromMembersDbTillNinthLastMonthEnd['male'] + registeredMembersFromMembersDbTillNinthLastMonthEnd['female'];
            registeredMembersFromMembersDbTillTenthLastMonthEnd['total'] = registeredMembersFromMembersDbTillTenthLastMonthEnd['male'] + registeredMembersFromMembersDbTillTenthLastMonthEnd['female'];
            registeredMembersFromMembersDbTillEleventhLastMonthEnd['total'] = registeredMembersFromMembersDbTillEleventhLastMonthEnd['male'] + registeredMembersFromMembersDbTillEleventhLastMonthEnd['female'];
            registeredMembersFromMembersDbTillTwelfthLastMonthEnd['total'] = registeredMembersFromMembersDbTillTwelfthLastMonthEnd['male'] + registeredMembersFromMembersDbTillTwelfthLastMonthEnd['female'];
            //   ********************************************************************************************************
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////Total Member Visits/////////////////////////////////////////
            var membersVisitsTillNow = {
                male: totalMemberVisits['male'],
                female: totalMemberVisits['female'],
                total: 0
            };
            var membersVisitsTillSecondLastMonthEnd = {
                male: totalMemberVisits['male'] - lastMonthDataset.Visits['male'],
                female: totalMemberVisits['female'] - lastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillThirdLastMonthEnd = {
                male: membersVisitsTillSecondLastMonthEnd['male'] - secondLastMonthDataset.Visits['male'],
                female: membersVisitsTillSecondLastMonthEnd['female'] - secondLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillFourthLastMonthEnd = {
                male: membersVisitsTillThirdLastMonthEnd['male'] - thirdLastMonthDataset.Visits['male'],
                female: membersVisitsTillThirdLastMonthEnd['female'] - thirdLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillFifthLastMonthEnd = {
                male: membersVisitsTillFourthLastMonthEnd['male'] - fourthLastMonthDataset.Visits['male'],
                female: membersVisitsTillFourthLastMonthEnd['female'] - fourthLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillSixthLastMonthEnd = {
                male: membersVisitsTillFifthLastMonthEnd['male'] - fifthLastMonthDataset.Visits['male'],
                female: membersVisitsTillFifthLastMonthEnd['female'] - fifthLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillSeventhLastMonthEnd = {
                male: membersVisitsTillSixthLastMonthEnd['male'] - sixthLastMonthDataset.Visits['male'],
                female: membersVisitsTillSixthLastMonthEnd['female'] - sixthLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillEighthLastMonthEnd = {
                male: membersVisitsTillSeventhLastMonthEnd['male'] - seventhLastMonthDataset.Visits['male'],
                female: membersVisitsTillSeventhLastMonthEnd['female'] - seventhLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillNinthLastMonthEnd = {
                male: membersVisitsTillEighthLastMonthEnd['male'] - eighthLastMonthDataset.Visits['male'],
                female: membersVisitsTillEighthLastMonthEnd['female'] - eighthLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillTenthLastMonthEnd = {
                male: membersVisitsTillNinthLastMonthEnd['male'] - ninthLastMonthDataset.Visits['male'],
                female: membersVisitsTillNinthLastMonthEnd['female'] - ninthLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillEleventhLastMonthEnd = {
                male: membersVisitsTillTenthLastMonthEnd['male'] - tenthLastMonthDataset.Visits['male'],
                female: membersVisitsTillTenthLastMonthEnd['female'] - tenthLastMonthDataset.Visits['female'],
                total: 0
            };
            var membersVisitsTillTwelfthLastMonthEnd = {
                male: membersVisitsTillEleventhLastMonthEnd['male'] - eleventhLastMonthDataset.Visits['male'],
                female: membersVisitsTillEleventhLastMonthEnd['female'] - eleventhLastMonthDataset.Visits['female'],
                total: 0
            };
            //  ********************************************************************************************************
            membersVisitsTillNow['total'] = membersVisitsTillNow['male'] + membersVisitsTillNow['female'];
            membersVisitsTillSecondLastMonthEnd['total'] = membersVisitsTillSecondLastMonthEnd['male'] + membersVisitsTillSecondLastMonthEnd['female'];
            membersVisitsTillThirdLastMonthEnd['total'] = membersVisitsTillThirdLastMonthEnd['male'] + membersVisitsTillThirdLastMonthEnd['female'];
            membersVisitsTillFourthLastMonthEnd['total'] = membersVisitsTillFourthLastMonthEnd['male'] + membersVisitsTillFourthLastMonthEnd['female'];
            membersVisitsTillFifthLastMonthEnd['total'] = membersVisitsTillFifthLastMonthEnd['male'] + membersVisitsTillFifthLastMonthEnd['female'];
            membersVisitsTillSixthLastMonthEnd['total'] = membersVisitsTillSixthLastMonthEnd['male'] + membersVisitsTillSixthLastMonthEnd['female'];
            membersVisitsTillSeventhLastMonthEnd['total'] = membersVisitsTillSeventhLastMonthEnd['male'] + membersVisitsTillSeventhLastMonthEnd['female'];
            membersVisitsTillEighthLastMonthEnd['total'] = membersVisitsTillEighthLastMonthEnd['male'] + membersVisitsTillEighthLastMonthEnd['female'];
            membersVisitsTillNinthLastMonthEnd['total'] = membersVisitsTillNinthLastMonthEnd['male'] + membersVisitsTillNinthLastMonthEnd['female'];
            membersVisitsTillTenthLastMonthEnd['total'] = membersVisitsTillTenthLastMonthEnd['male'] + membersVisitsTillTenthLastMonthEnd['female'];
            membersVisitsTillEleventhLastMonthEnd['total'] = membersVisitsTillEleventhLastMonthEnd['male'] + membersVisitsTillEleventhLastMonthEnd['female'];
            membersVisitsTillTwelfthLastMonthEnd['total'] = membersVisitsTillTwelfthLastMonthEnd['male'] + membersVisitsTillTwelfthLastMonthEnd['female'];
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  ********************************************************************************************************
            //   TrendActivityReport View : TrendActivityReport.js
            //  ********************************************************************************************************
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////
            // ********************************************************************************************************
            //last activity sync date
            //**********************************************************************************************************
            /*  context.lastSyncDateForCommunity(communityCode, function(param1) {
             communityLastActivitySyncDate = param1;
             alert("called")
             });*/
            //////////////////////////////////////////////////////////////////////////////////////////////////////////// */

            var trendActivityReportView = new App.Views.TrendActivityReport();
            trendActivityReportView.data = aggregateDataset;
            trendActivityReportView.startDate = activityDataColl.startkey;
            trendActivityReportView.endDate = activityDataColl.endkey;
            trendActivityReportView.CommunityName = communityName;
            trendActivityReportView.lastActivitySyncDate = communityLastActivitySyncDate;
            trendActivityReportView.render();
            //App.$el.children('.body').html(trendActivityReportView.el);
            App.$el.children('.body').html('<input class="date-picker"/><style>.ui-datepicker-calendar{display: none;}.date-picker{width:300px;float:right;}</style><div id="parentDiv"></div>');
            $('#parentDiv').append(trendActivityReportView.el);
            var nationUrl = $.url().data.attr.authority;
            var temp = $.url().data.attr.host.split(".")
            var nationName = temp[0];
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/activitylog/_design/bell/_view/getDocumentByDate?sorted=true&limit=1',
                type: 'GET',
                dataType: 'jsonp',
                async: false,
                success: function (result) {
                    urlFrag = $.url().data.attr.fragment.split('/');
                    if (urlFrag[4]) {
                        selDate = urlFrag[4].split('-');
                        setDt = new Date(selDate[0], selDate[1] - 1, 01, 00, 00, 00);
                    } else {
                        setDt = new Date();
                    }
                    firstDt = result.rows[0].key.split('/');
                    firstYear = firstDt[0];
                    firstMonth = parseInt(firstDt[1]);
                    firstDt = new Date(firstYear, firstMonth - 1, 01, 00, 00, 00);
                    today = new Date();
                    $('input.date-picker').datepicker({
                        minDate: firstDt,
                        maxDate: new Date(),
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: 'MM yy',
                        onClose: function (dateText, inst) {
                            var month = $(".ui-datepicker-month :selected").val();
                            var year = $(".ui-datepicker-year :selected").val();
                            var newDt = new Date(year, month, 1);
                            $('input.date-picker').datepicker('setDate', newDt);
                            month = parseInt(newDt.getMonth());
                            Backbone.history.navigate('communityreport/' + communityLastSyncDate + '/' + communityName + '/' + communityCode + '/' + newDt.getFullYear() + '-' + (month + 1), {
                                trigger: true
                            });
                        }
                    });
                    $('input.date-picker').datepicker('setDate', endDateForTrendReport);
                }
            });
            //***************************************************************************************************************
            //Trend Report Graphs Started
            //  ********************************************************************************************************
            //  ********************************************************************************************************
            //Total Members
            //  ********************************************************************************************************
            $('#trend-report-div-total-members').highcharts({
                chart: {
                    type: 'column',
                    borderColor: '#999999',
                    borderWidth: 2,
                    borderRadius: 10
                },
                title: {
                    text: App.languageDictValue.attributes.registered_past_twelve_months //Total Members
                },
                xAxis: {
                    categories: [
                            monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                            monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                            monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                            monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                            monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                            monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                            monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                            monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                            monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                            monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                            monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                            monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: App.languageDictValue.attributes.Members_Count
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: App.languageDictValue.attributes.Males,
                    data: [
                        registeredMembersFromMembersDbTillTwelfthLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillEleventhLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillTenthLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillNinthLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillEighthLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillSeventhLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillSixthLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillFifthLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillFourthLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillThirdLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillSecondLastMonthEnd['male'],
                        registeredMembersFromMembersDbTillNow['male']
                    ],
                    color: '#33ccff'
                }, {
                    name: App.languageDictValue.attributes.Females,
                    data: [
                        registeredMembersFromMembersDbTillTwelfthLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillEleventhLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillTenthLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillNinthLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillEighthLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillSeventhLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillSixthLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillFifthLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillFourthLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillThirdLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillSecondLastMonthEnd['female'],
                        registeredMembersFromMembersDbTillNow['female']
                    ],
                    color: '#66ff66'
                }, {
                    name: App.languageDictValue.attributes.Total,
                    data: [
                        registeredMembersFromMembersDbTillTwelfthLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillEleventhLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillTenthLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillNinthLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillEighthLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillSeventhLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillSixthLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillFifthLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillFourthLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillThirdLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillSecondLastMonthEnd['total'],
                        registeredMembersFromMembersDbTillNow['total']
                    ],
                    color: '#ff9900'
                }]
            });
            //  ********************************************************************************************************
            //  ********************************************************************************************************
            //Total Member Visits
            //  ********************************************************************************************************
            $('#trend-report-div-total-member-visits').highcharts({
                chart: {
                    type: 'column',
                    borderColor: '#999999',
                    borderWidth: 2,
                    borderRadius: 10
                },
                title: {
                    text: App.languageDictValue.attributes.visits_past_twelve_months //total Visits
                },
                xAxis: {
                    categories: [

                            monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                            monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                            monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                            monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                            monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                            monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                            monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                            monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                            monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                            monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                            monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                            monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text:  App.languageDictValue.attributes.Visits_Count
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name:  App.languageDictValue.attributes.Males,
                    data: [

                        membersVisitsTillTwelfthLastMonthEnd['male'],
                        membersVisitsTillEleventhLastMonthEnd['male'],
                        membersVisitsTillTenthLastMonthEnd['male'],
                        membersVisitsTillNinthLastMonthEnd['male'],
                        membersVisitsTillEighthLastMonthEnd['male'],
                        membersVisitsTillSeventhLastMonthEnd['male'],
                        membersVisitsTillSixthLastMonthEnd['male'],
                        membersVisitsTillFifthLastMonthEnd['male'],
                        membersVisitsTillFourthLastMonthEnd['male'],
                        membersVisitsTillThirdLastMonthEnd['male'],
                        membersVisitsTillSecondLastMonthEnd['male'],
                        membersVisitsTillNow['male']
                    ],
                    color: '#33ccff'
                }, {
                    name: App.languageDictValue.attributes.Females,
                    data: [
                        membersVisitsTillTwelfthLastMonthEnd['female'],
                        membersVisitsTillEleventhLastMonthEnd['female'],
                        membersVisitsTillTenthLastMonthEnd['female'],
                        membersVisitsTillNinthLastMonthEnd['female'],
                        membersVisitsTillEighthLastMonthEnd['female'],
                        membersVisitsTillSeventhLastMonthEnd['female'],
                        membersVisitsTillSixthLastMonthEnd['female'],
                        membersVisitsTillFifthLastMonthEnd['female'],
                        membersVisitsTillFourthLastMonthEnd['female'],
                        membersVisitsTillThirdLastMonthEnd['female'],
                        membersVisitsTillSecondLastMonthEnd['female'],
                        membersVisitsTillNow['female']
                    ],
                    color: '#66ff66'
                }, {
                    name: App.languageDictValue.attributes.Total,
                    data: [
                        membersVisitsTillTwelfthLastMonthEnd['total'],
                        membersVisitsTillEleventhLastMonthEnd['total'],
                        membersVisitsTillTenthLastMonthEnd['total'],
                        membersVisitsTillNinthLastMonthEnd['total'],
                        membersVisitsTillEighthLastMonthEnd['total'],
                        membersVisitsTillSeventhLastMonthEnd['total'],
                        membersVisitsTillSixthLastMonthEnd['total'],
                        membersVisitsTillFifthLastMonthEnd['total'],
                        membersVisitsTillFourthLastMonthEnd['total'],
                        membersVisitsTillThirdLastMonthEnd['total'],
                        membersVisitsTillSecondLastMonthEnd['total'],
                        membersVisitsTillNow['total']
                    ],
                    color: '#ff9900'
                }]
            });
            //  ********************************************************************************************************
            //  ********************************************************************************************************
            //Active Members This Month
            //  ********************************************************************************************************
            $('#trend-report-div-new-memberships').highcharts({
                chart: {
                    type: 'column',
                    borderColor: '#999999',
                    borderWidth: 2,
                    borderRadius: 10
                },
                title: {
                    text: App.languageDictValue.attributes.active_members_this_month
                },
                xAxis: {
                    categories: [
                            monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                            monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                            monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                            monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                            monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                            monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                            monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                            monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                            monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                            monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                            monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                            monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: App.languageDictValue.attributes.Members_Count
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: App.languageDictValue.attributes.Males,
                    data: [
                        registeredMembersTillTwelfthLastMonthEnd['male'],
                            registeredMembersTillEleventhLastMonthEnd['male'] - registeredMembersTillTwelfthLastMonthEnd['male'],
                            registeredMembersTillTenthLastMonthEnd['male'] - registeredMembersTillEleventhLastMonthEnd['male'],
                            registeredMembersTillNinthLastMonthEnd['male'] - registeredMembersTillTenthLastMonthEnd['male'],
                            registeredMembersTillEighthLastMonthEnd['male'] - registeredMembersTillNinthLastMonthEnd['male'],
                            registeredMembersTillSeventhLastMonthEnd['male'] - registeredMembersTillEighthLastMonthEnd['male'],
                            registeredMembersTillSixthLastMonthEnd['male'] - registeredMembersTillSeventhLastMonthEnd['male'],
                            registeredMembersTillFifthLastMonthEnd['male'] - registeredMembersTillSixthLastMonthEnd['male'],
                            registeredMembersTillFourthLastMonthEnd['male'] - registeredMembersTillFifthLastMonthEnd['male'],
                            registeredMembersTillThirdLastMonthEnd['male'] - registeredMembersTillFourthLastMonthEnd['male'],
                            registeredMembersTillSecondLastMonthEnd['male'] - registeredMembersTillThirdLastMonthEnd['male'],
                            totalRegisteredMembers['male'] - registeredMembersTillSecondLastMonthEnd['male']
                    ],
                    color: '#33ccff'
                }, {
                    name: App.languageDictValue.attributes.Females,
                    data: [
                        registeredMembersTillTwelfthLastMonthEnd['female'],
                            registeredMembersTillEleventhLastMonthEnd['female'] - registeredMembersTillTwelfthLastMonthEnd['female'],
                            registeredMembersTillTenthLastMonthEnd['female'] - registeredMembersTillEleventhLastMonthEnd['female'],
                            registeredMembersTillNinthLastMonthEnd['female'] - registeredMembersTillTenthLastMonthEnd['female'],
                            registeredMembersTillEighthLastMonthEnd['female'] - registeredMembersTillNinthLastMonthEnd['female'],
                            registeredMembersTillSeventhLastMonthEnd['female'] - registeredMembersTillEighthLastMonthEnd['female'],
                            registeredMembersTillSixthLastMonthEnd['female'] - registeredMembersTillSeventhLastMonthEnd['female'],
                            registeredMembersTillFifthLastMonthEnd['female'] - registeredMembersTillSixthLastMonthEnd['female'],
                            registeredMembersTillFourthLastMonthEnd['female'] - registeredMembersTillFifthLastMonthEnd['female'],
                            registeredMembersTillThirdLastMonthEnd['female'] - registeredMembersTillFourthLastMonthEnd['female'],
                            registeredMembersTillSecondLastMonthEnd['female'] - registeredMembersTillThirdLastMonthEnd['female'],
                            totalRegisteredMembers['female'] - registeredMembersTillSecondLastMonthEnd['female']
                    ],
                    color: '#66ff66'
                }, {
                    name:  App.languageDictValue.attributes.Total,
                    data: [
                        registeredMembersTillTwelfthLastMonthEnd['total'],
                            registeredMembersTillEleventhLastMonthEnd['total'] - registeredMembersTillTwelfthLastMonthEnd['total'],
                            registeredMembersTillTenthLastMonthEnd['total'] - registeredMembersTillEleventhLastMonthEnd['total'],
                            registeredMembersTillNinthLastMonthEnd['total'] - registeredMembersTillTenthLastMonthEnd['total'],
                            registeredMembersTillEighthLastMonthEnd['total'] - registeredMembersTillNinthLastMonthEnd['total'],
                            registeredMembersTillSeventhLastMonthEnd['total'] - registeredMembersTillEighthLastMonthEnd['total'],
                            registeredMembersTillSixthLastMonthEnd['total'] - registeredMembersTillSeventhLastMonthEnd['total'],
                            registeredMembersTillFifthLastMonthEnd['total'] - registeredMembersTillSixthLastMonthEnd['total'],
                            registeredMembersTillFourthLastMonthEnd['total'] - registeredMembersTillFifthLastMonthEnd['total'],
                            registeredMembersTillThirdLastMonthEnd['total'] - registeredMembersTillFourthLastMonthEnd['total'],
                            registeredMembersTillSecondLastMonthEnd['total'] - registeredMembersTillThirdLastMonthEnd['total'],
                            registeredMembersTillNow['total'] - registeredMembersTillSecondLastMonthEnd['total']
                    ],
                    color: '#ff9900'
                }]
            });
            //  ********************************************************************************************************
            //  ********************************************************************************************************
            //Total Member Visits This Month
            //  ********************************************************************************************************
            $('#trend-report-div-visits').highcharts({
                chart: {
                    type: 'column',
                    borderColor: '#999999',
                    borderWidth: 2,
                    borderRadius: 10
                },
                title: {
                    text: App.languageDictValue.attributes.members_visits_this_month
                },
                xAxis: {
                    categories: [

                            monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                            monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                            monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                            monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                            monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                            monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                            monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                            monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                            monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                            monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                            monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                            monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: App.languageDictValue.attributes.Visits_Count
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: App.languageDictValue.attributes.Males,
                    data: [
                        twelfthLastMonthDataset.Visits['male'],
                        eleventhLastMonthDataset.Visits['male'],
                        tenthLastMonthDataset.Visits['male'],
                        ninthLastMonthDataset.Visits['male'],
                        eighthLastMonthDataset.Visits['male'],
                        seventhLastMonthDataset.Visits['male'],
                        sixthLastMonthDataset.Visits['male'],
                        fifthLastMonthDataset.Visits['male'],
                        fourthLastMonthDataset.Visits['male'],
                        thirdLastMonthDataset.Visits['male'],
                        secondLastMonthDataset.Visits['male'],
                        lastMonthDataset.Visits['male']
                    ],
                    color: '#33ccff'
                }, {
                    name: App.languageDictValue.attributes.Females,
                    data: [
                        twelfthLastMonthDataset.Visits['female'],
                        eleventhLastMonthDataset.Visits['female'],
                        tenthLastMonthDataset.Visits['female'],
                        ninthLastMonthDataset.Visits['female'],
                        eighthLastMonthDataset.Visits['female'],
                        seventhLastMonthDataset.Visits['female'],
                        sixthLastMonthDataset.Visits['female'],
                        fifthLastMonthDataset.Visits['female'],
                        fourthLastMonthDataset.Visits['female'],
                        thirdLastMonthDataset.Visits['female'],
                        secondLastMonthDataset.Visits['female'],
                        lastMonthDataset.Visits['female']
                    ],
                    color: '#66ff66'
                }, {
                    name: App.languageDictValue.attributes.Total,
                    data: [
                            twelfthLastMonthDataset.Visits['male'] + twelfthLastMonthDataset.Visits['female'],
                            eleventhLastMonthDataset.Visits['male'] + eleventhLastMonthDataset.Visits['female'],
                            tenthLastMonthDataset.Visits['male'] + tenthLastMonthDataset.Visits['female'],
                            ninthLastMonthDataset.Visits['male'] + ninthLastMonthDataset.Visits['female'],
                            eighthLastMonthDataset.Visits['male'] + eighthLastMonthDataset.Visits['female'],
                            seventhLastMonthDataset.Visits['male'] + seventhLastMonthDataset.Visits['female'],
                            sixthLastMonthDataset.Visits['male'] + sixthLastMonthDataset.Visits['female'],
                            fifthLastMonthDataset.Visits['male'] + fifthLastMonthDataset.Visits['female'],
                            fourthLastMonthDataset.Visits['male'] + fourthLastMonthDataset.Visits['female'],
                            thirdLastMonthDataset.Visits['male'] + thirdLastMonthDataset.Visits['female'],
                            secondLastMonthDataset.Visits['male'] + secondLastMonthDataset.Visits['female'],
                            lastMonthDataset.Visits['male'] + lastMonthDataset.Visits['female']
                    ],
                    color: '#ff9900'
                }]
            });
            //  ******************************************************************************************************
            // /////////////////////////////////////////////New Members This Month?////////////////////////////////////
            //  ********************************************************************************************************
            //   Total Resource Views This Month
            //  ********************************************************************************************************
            $('#trend-report-div-total-resource-views-this-month').highcharts({
                chart: {
                    type: 'column',
                    borderColor: '#999999',
                    borderWidth: 2,
                    borderRadius: 10
                },
                title: {
                    text:  App.languageDictValue.attributes.resource_views_this_month
                },
                xAxis: {
                    categories: [

                            monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                            monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                            monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                            monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                            monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                            monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                            monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                            monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                            monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                            monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                            monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                            monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: App.languageDictValue.attributes.Resource_Count
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: App.languageDictValue.attributes.Males,
                    data: [
                        twelfthLastMonthDataset.ResourceViews['male'],
                        eleventhLastMonthDataset.ResourceViews['male'],
                        tenthLastMonthDataset.ResourceViews['male'],
                        ninthLastMonthDataset.ResourceViews['male'],
                        eighthLastMonthDataset.ResourceViews['male'],
                        seventhLastMonthDataset.ResourceViews['male'],
                        sixthLastMonthDataset.ResourceViews['male'],
                        fifthLastMonthDataset.ResourceViews['male'],
                        fourthLastMonthDataset.ResourceViews['male'],
                        thirdLastMonthDataset.ResourceViews['male'],
                        secondLastMonthDataset.ResourceViews['male'],
                        lastMonthDataset.ResourceViews['male']
                    ],
                    color: '#33ccff'
                }, {
                    name: App.languageDictValue.attributes.Females,
                    data: [
                        twelfthLastMonthDataset.ResourceViews['female'],
                        eleventhLastMonthDataset.ResourceViews['female'],
                        tenthLastMonthDataset.ResourceViews['female'],
                        ninthLastMonthDataset.ResourceViews['female'],
                        eighthLastMonthDataset.ResourceViews['female'],
                        seventhLastMonthDataset.ResourceViews['female'],
                        sixthLastMonthDataset.ResourceViews['female'],
                        fifthLastMonthDataset.ResourceViews['female'],
                        fourthLastMonthDataset.ResourceViews['female'],
                        thirdLastMonthDataset.ResourceViews['female'],
                        secondLastMonthDataset.ResourceViews['female'],
                        lastMonthDataset.ResourceViews['female']
                    ],
                    color: '#66ff66'
                }, {
                    name: App.languageDictValue.attributes.Total,
                    data: [
                            twelfthLastMonthDataset.ResourceViews['male'] + twelfthLastMonthDataset.ResourceViews['female'],
                            eleventhLastMonthDataset.ResourceViews['male'] + eleventhLastMonthDataset.ResourceViews['female'],
                            tenthLastMonthDataset.ResourceViews['male'] + tenthLastMonthDataset.ResourceViews['female'],
                            ninthLastMonthDataset.ResourceViews['male'] + ninthLastMonthDataset.ResourceViews['female'],
                            eighthLastMonthDataset.ResourceViews['male'] + eighthLastMonthDataset.ResourceViews['female'],
                            seventhLastMonthDataset.ResourceViews['male'] + seventhLastMonthDataset.ResourceViews['female'],
                            sixthLastMonthDataset.ResourceViews['male'] + sixthLastMonthDataset.ResourceViews['female'],
                            fifthLastMonthDataset.ResourceViews['male'] + fifthLastMonthDataset.ResourceViews['female'],
                            fourthLastMonthDataset.ResourceViews['male'] + fourthLastMonthDataset.ResourceViews['female'],
                            thirdLastMonthDataset.ResourceViews['male'] + thirdLastMonthDataset.ResourceViews['female'],
                            secondLastMonthDataset.ResourceViews['male'] + secondLastMonthDataset.ResourceViews['female'],
                            lastMonthDataset.ResourceViews['male'] + lastMonthDataset.ResourceViews['female']
                    ],
                    color: '#ff9900'
                }]
            });
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
            App.stopActivityIndicator()
        },
        //*************************************************************************************************************
        //Trend Report for Communities page on nation Ended
        //*************************************************************************************************************
        TrendReport: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var context = this;
            App.$el.children('.body').html('');
            $('<div id="trend-report-form" style="height: auto"></div>').appendTo(App.$el.children('.body'));

            var select = $("<select id='communitySelector'>");

            var label = $("<label>").text(App.languageDictValue.get('Select_Comm')+': ');
            $('#trend-report-form').append(label);
            /////////////
            var Communities = new App.Collections.Community()
            Communities.fetch({
                async: false
            })
            Communities.each(
                function(log) {
                    var code, name;
                    if(log.get('Name') != undefined) {
                        name = log.get('Name');
                        code = log.get('Code');
                    } else {
                        name = log.get('name');
                        code = log.get('code');
                    }
                    if(name && code){
                        select.append("<option value=" + code + ">" + name + "</option>");
                    }
                });
            $('#trend-report-form').append(select);
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('#trend-report-form').css({"direction":"rtl"});
            }

            var button = $('<input type="button" style="height: 100%">').attr({
                id: 'submit',
                name: 'submit',
                class: 'btn btn-success',
                value: App.languageDictValue.get('Generate_Report')
            });
            $('#trend-report-form').append(button);

            var communityName = "";

            button.click(function() {
                var communityChosen = $('#communitySelector').val();
                communityName = $('#communitySelector option:selected').text();

                var endDateForTrendReport = new Date(); // selected date turned into javascript 'Date' format
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                var lastMonthStartDate = new Date(endDateForTrendReport.getFullYear(), endDateForTrendReport.getMonth(), 1);
                var secondLastMonthEndDate = new Date(lastMonthStartDate.getFullYear(), lastMonthStartDate.getMonth(), (lastMonthStartDate.getDate() - 1));
                var secondLastMonthStartDate = new Date(secondLastMonthEndDate.getFullYear(), secondLastMonthEndDate.getMonth(), 1);
                var thirdLastMonthEndDate = new Date(secondLastMonthStartDate.getFullYear(), secondLastMonthStartDate.getMonth(), (secondLastMonthStartDate.getDate() - 1));
                var thirdLastMonthStartDate = new Date(thirdLastMonthEndDate.getFullYear(), thirdLastMonthEndDate.getMonth(), 1);
                var fourthLastMonthEndDate = new Date(thirdLastMonthStartDate.getFullYear(), thirdLastMonthStartDate.getMonth(), (thirdLastMonthStartDate.getDate() - 1));
                var fourthLastMonthStartDate = new Date(fourthLastMonthEndDate.getFullYear(), fourthLastMonthEndDate.getMonth(), 1);
                var fifthLastMonthEndDate = new Date(fourthLastMonthStartDate.getFullYear(), fourthLastMonthStartDate.getMonth(), (fourthLastMonthStartDate.getDate() - 1));
                var fifthLastMonthStartDate = new Date(fifthLastMonthEndDate.getFullYear(), fifthLastMonthEndDate.getMonth(), 1);
                var sixthLastMonthEndDate = new Date(fifthLastMonthStartDate.getFullYear(), fifthLastMonthStartDate.getMonth(), (fifthLastMonthStartDate.getDate() - 1));
                var sixthLastMonthStartDate = new Date(sixthLastMonthEndDate.getFullYear(), sixthLastMonthEndDate.getMonth(), 1);
                var seventhLastMonthEndDate = new Date(sixthLastMonthStartDate.getFullYear(), sixthLastMonthStartDate.getMonth(), (sixthLastMonthStartDate.getDate() - 1));
                var seventhLastMonthStartDate = new Date(seventhLastMonthEndDate.getFullYear(), seventhLastMonthEndDate.getMonth(), 1);
                var eighthLastMonthEndDate = new Date(seventhLastMonthStartDate.getFullYear(), seventhLastMonthStartDate.getMonth(), (seventhLastMonthStartDate.getDate() - 1));
                var eighthLastMonthStartDate = new Date(eighthLastMonthEndDate.getFullYear(), eighthLastMonthEndDate.getMonth(), 1);
                var ninthLastMonthEndDate = new Date(eighthLastMonthStartDate.getFullYear(), eighthLastMonthStartDate.getMonth(), (eighthLastMonthStartDate.getDate() - 1));
                var ninthLastMonthStartDate = new Date(ninthLastMonthEndDate.getFullYear(), ninthLastMonthEndDate.getMonth(), 1);
                var tenthLastMonthEndDate = new Date(ninthLastMonthStartDate.getFullYear(), ninthLastMonthStartDate.getMonth(), (ninthLastMonthStartDate.getDate() - 1));
                var tenthLastMonthStartDate = new Date(tenthLastMonthEndDate.getFullYear(), tenthLastMonthEndDate.getMonth(), 1);
                var eleventhLastMonthEndDate = new Date(tenthLastMonthStartDate.getFullYear(), tenthLastMonthStartDate.getMonth(), (fifthLastMonthStartDate.getDate() - 1));
                var eleventhLastMonthStartDate = new Date(eleventhLastMonthEndDate.getFullYear(), eleventhLastMonthEndDate.getMonth(), 1);
                var twelfthLastMonthEndDate = new Date(eleventhLastMonthStartDate.getFullYear(), eleventhLastMonthStartDate.getMonth(), (eleventhLastMonthStartDate.getDate() - 1));
                var twelfthLastMonthStartDate = new Date(twelfthLastMonthEndDate.getFullYear(), twelfthLastMonthEndDate.getMonth(), 1);

                var startDate = context.changeDateFormat(context.turnDateToYYYYMMDDFormat(twelfthLastMonthStartDate));
                var endDate = context.changeDateFormat(context.turnDateToYYYYMMDDFormat(endDateForTrendReport));
                ////////////////////////////////////////////////////////////////////////////////////////////////////////

                var activityDataColl = new App.Collections.ActivityLog();
                var urlTemp = App.Server + '/activitylog/_design/bell/_view/getDocByCommunityCode?include_docs=true&startkey=["' + communityChosen + '","' + startDate + '"]&endkey=["' +
                    communityChosen + '","' + endDate + '"]';
                activityDataColl.setUrl(urlTemp);
                activityDataColl.fetch({ // logData.logDate is not assigned any value so the view called will be one that uses start and
                    // end keys rather than logdate to fetch activitylog docs from the db
                    async: false
                });
                activityDataColl.toJSON();
                ////////////////////////////////////////////////////////////////////////////////////////////////////////
                // iterate over activitylog models inside the activityDataColl collection and assign each to the month range in which they lie
                // ********************************************************************************************************
                var endingMonthActivityData = [],
                    secondLastMonthActivityData = [],
                    thirdLastMonthActivityData = [],
                    fourthLastMonthActivityData = [],
                    fifthLastMonthActivityData = [],
                    sixthLastMonthActivityData = [],
                    seventhLastMonthActivityData = [],
                    eighthLastMonthActivityData = [],
                    ninthLastMonthActivityData = [],
                    tenthLastMonthActivityData = [],
                    eleventhLastMonthActivityData = [],
                    twelfthLastMonthActivityData = [];
                //  ********************************************************************************************************
                for (var i in activityDataColl.models) {
                    var modelKey = context.turnDateFromMMDDYYYYToYYYYMMDDFormat(activityDataColl.models[i].get('logDate'));

                    if ((modelKey >= context.turnDateToYYYYMMDDFormat(lastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(endDateForTrendReport))) {
                        endingMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(secondLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(secondLastMonthEndDate))) {
                        secondLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(thirdLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(thirdLastMonthEndDate))) {
                        thirdLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(fourthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(fourthLastMonthEndDate))) {
                        fourthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(fifthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(fifthLastMonthEndDate))) {
                        fifthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(sixthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(sixthLastMonthEndDate))) {
                        sixthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(seventhLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(seventhLastMonthEndDate))) {
                        seventhLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(eighthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(eighthLastMonthEndDate))) {
                        eighthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(ninthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(ninthLastMonthEndDate))) {
                        ninthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(tenthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(tenthLastMonthEndDate))) {
                        tenthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(eleventhLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(eleventhLastMonthEndDate))) {
                        eleventhLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ((modelKey >= context.turnDateToYYYYMMDDFormat(twelfthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(twelfthLastMonthEndDate))) {
                        twelfthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    }
                }
                //  ********************************************************************************************************
                var lastMonthDataset = context.aggregateDataForTrendReport('communityX', endingMonthActivityData);
                var secondLastMonthDataset = context.aggregateDataForTrendReport('communityX', secondLastMonthActivityData);
                var thirdLastMonthDataset = context.aggregateDataForTrendReport('communityX', thirdLastMonthActivityData);
                var fourthLastMonthDataset = context.aggregateDataForTrendReport('communityX', fourthLastMonthActivityData);
                var fifthLastMonthDataset = context.aggregateDataForTrendReport('communityX', fifthLastMonthActivityData);
                var sixthLastMonthDataset = context.aggregateDataForTrendReport('communityX', sixthLastMonthActivityData);
                var seventhLastMonthDataset = context.aggregateDataForTrendReport('communityX', seventhLastMonthActivityData);
                var eighthLastMonthDataset = context.aggregateDataForTrendReport('communityX', eighthLastMonthActivityData);
                var ninthLastMonthDataset = context.aggregateDataForTrendReport('communityX', ninthLastMonthActivityData);
                var tenthLastMonthDataset = context.aggregateDataForTrendReport('communityX', tenthLastMonthActivityData);
                var eleventhLastMonthDataset = context.aggregateDataForTrendReport('communityX', eleventhLastMonthActivityData);
                var twelfthLastMonthDataset = context.aggregateDataForTrendReport('communityX', twelfthLastMonthActivityData);

                var aggregateDataset = context.aggregateDataForTrendReport('communityX', JSON.parse(JSON.stringify(activityDataColl.models)));
                //  ********************************************************************************************************
                var monthNames = [App.Router.lookup(App.languageDictValue, "Months." + "January"), App.Router.lookup(App.languageDictValue, "Months." + "February"), App.Router.lookup(App.languageDictValue, "Months." + "March"), App.Router.lookup(App.languageDictValue, "Months." + "April"), App.Router.lookup(App.languageDictValue, "Months." + "May"), App.Router.lookup(App.languageDictValue, "Months." + "June"), App.Router.lookup(App.languageDictValue, "Months." + "July"), App.Router.lookup(App.languageDictValue, "Months." + "August"), App.Router.lookup(App.languageDictValue, "Months." + "September"), App.Router.lookup(App.languageDictValue, "Months." + "October"), App.Router.lookup(App.languageDictValue, "Months." + "November"),App.Router.lookup(App.languageDictValue, "Months." + "December")];

                //  ********************************************************************************************************
                // show registered members at end of each month falling in duration of this report
                var totalRegisteredMembers = {
                    male: 0,
                    female: 0
                };
                context.getRegisteredMembersCount(communityChosen, function(param1, param2) {
                    totalRegisteredMembers['male'] = param1;
                    totalRegisteredMembers['female'] = param2;
                });
                //  ********************************************************************************************************
                //////////////////////////////////Registered Members from Members db 11 may 2015 ///////////////////////
                var totalRegisteredMembersFromMembersDb = {
                    male: 0,
                    female: 0
                };
                context.getRegisteredMembersCountFromMembersDB(communityChosen, function(param1, param2) {
                    totalRegisteredMembersFromMembersDb['male'] = param1;
                    totalRegisteredMembersFromMembersDb['female'] = param2;
                });
                ////////////////////////////////////////////////////////////////////////////////////////////////////////
                //  ********************************************************************************************************
                ///////////////////////////////////////////////Total Visits/////////////////////////////////////////////
                var totalMemberVisits = {
                    male: 0,
                    female: 0
                };
                context.getTotalMemberVisits(communityChosen, function(param1, param2) {
                    totalMemberVisits['male'] = param1;
                    totalMemberVisits['female'] = param2;
                });
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                //  ********************************************************************************************************
                var registeredMembersTillNow = {
                    male: totalRegisteredMembers['male'],
                    female: totalRegisteredMembers['female'],
                    total: 0
                };
                var registeredMembersTillSecondLastMonthEnd = {
                    male: totalRegisteredMembers['male'] - lastMonthDataset.New_Signups['male'],
                    female: totalRegisteredMembers['female'] - lastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillThirdLastMonthEnd = {
                    male: registeredMembersTillSecondLastMonthEnd['male'] - secondLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillSecondLastMonthEnd['female'] - secondLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillFourthLastMonthEnd = {
                    male: registeredMembersTillThirdLastMonthEnd['male'] - thirdLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillThirdLastMonthEnd['female'] - thirdLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillFifthLastMonthEnd = {
                    male: registeredMembersTillFourthLastMonthEnd['male'] - fourthLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillFourthLastMonthEnd['female'] - fourthLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillSixthLastMonthEnd = {
                    male: registeredMembersTillFifthLastMonthEnd['male'] - fifthLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillFifthLastMonthEnd['female'] - fifthLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillSeventhLastMonthEnd = {
                    male: registeredMembersTillSixthLastMonthEnd['male'] - sixthLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillSixthLastMonthEnd['female'] - sixthLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillEighthLastMonthEnd = {
                    male: registeredMembersTillSeventhLastMonthEnd['male'] - seventhLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillSeventhLastMonthEnd['female'] - seventhLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillNinthLastMonthEnd = {
                    male: registeredMembersTillEighthLastMonthEnd['male'] - eighthLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillEighthLastMonthEnd['female'] - eighthLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillTenthLastMonthEnd = {
                    male: registeredMembersTillNinthLastMonthEnd['male'] - ninthLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillNinthLastMonthEnd['female'] - ninthLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillEleventhLastMonthEnd = {
                    male: registeredMembersTillTenthLastMonthEnd['male'] - tenthLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillTenthLastMonthEnd['female'] - tenthLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                var registeredMembersTillTwelfthLastMonthEnd = {
                    male: registeredMembersTillEleventhLastMonthEnd['male'] - eleventhLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillEleventhLastMonthEnd['female'] - eleventhLastMonthDataset.New_Signups['female'],
                    total: 0
                };
                //  ********************************************************************************************************
                registeredMembersTillNow['total'] = registeredMembersTillNow['male'] + registeredMembersTillNow['female'];
                registeredMembersTillSecondLastMonthEnd['total'] = registeredMembersTillSecondLastMonthEnd['male'] + registeredMembersTillSecondLastMonthEnd['female'];
                registeredMembersTillThirdLastMonthEnd['total'] = registeredMembersTillThirdLastMonthEnd['male'] + registeredMembersTillThirdLastMonthEnd['female'];
                registeredMembersTillFourthLastMonthEnd['total'] = registeredMembersTillFourthLastMonthEnd['male'] + registeredMembersTillFourthLastMonthEnd['female'];
                registeredMembersTillFifthLastMonthEnd['total'] = registeredMembersTillFifthLastMonthEnd['male'] + registeredMembersTillFifthLastMonthEnd['female'];
                registeredMembersTillSixthLastMonthEnd['total'] = registeredMembersTillSixthLastMonthEnd['male'] + registeredMembersTillSixthLastMonthEnd['female'];
                registeredMembersTillSeventhLastMonthEnd['total'] = registeredMembersTillSeventhLastMonthEnd['male'] + registeredMembersTillSeventhLastMonthEnd['female'];
                registeredMembersTillEighthLastMonthEnd['total'] = registeredMembersTillEighthLastMonthEnd['male'] + registeredMembersTillEighthLastMonthEnd['female'];
                registeredMembersTillNinthLastMonthEnd['total'] = registeredMembersTillNinthLastMonthEnd['male'] + registeredMembersTillNinthLastMonthEnd['female'];
                registeredMembersTillTenthLastMonthEnd['total'] = registeredMembersTillTenthLastMonthEnd['male'] + registeredMembersTillTenthLastMonthEnd['female'];
                registeredMembersTillEleventhLastMonthEnd['total'] = registeredMembersTillEleventhLastMonthEnd['male'] + registeredMembersTillEleventhLastMonthEnd['female'];
                registeredMembersTillTwelfthLastMonthEnd['total'] = registeredMembersTillTwelfthLastMonthEnd['male'] + registeredMembersTillTwelfthLastMonthEnd['female'];
                //  ********************************************************************************************************
                ////////////////////////////////////////////////////////////////////////////////////////////////////////
                //  ********************************************************************************************************
                ///////////////////////////////////////////Total Members//////////////////////////////////////////////////
                var registeredMembersFromMembersDbTillNow = {
                    male: totalRegisteredMembersFromMembersDb['male'],
                    female: totalRegisteredMembersFromMembersDb['female'],
                    total: 0
                };
                var registeredMembersFromMembersDbTillSecondLastMonthEnd = {
                    male: totalRegisteredMembersFromMembersDb['male'] - (lastMonthDataset.New_Signups['male'] - lastMonthDataset.Deleted['male']),
                    female: totalRegisteredMembersFromMembersDb['female'] - (lastMonthDataset.New_Signups['female'] - lastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillThirdLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillSecondLastMonthEnd['male'] - (secondLastMonthDataset.New_Signups['male'] - secondLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillSecondLastMonthEnd['female'] - (secondLastMonthDataset.New_Signups['female'] - secondLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillFourthLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillThirdLastMonthEnd['male'] - (thirdLastMonthDataset.New_Signups['male'] - thirdLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillThirdLastMonthEnd['female'] - (thirdLastMonthDataset.New_Signups['female'] - thirdLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillFifthLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillFourthLastMonthEnd['male'] - (fourthLastMonthDataset.New_Signups['male'] - fourthLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillFourthLastMonthEnd['female'] - (fourthLastMonthDataset.New_Signups['female'] - fourthLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillSixthLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillFifthLastMonthEnd['male'] - (fifthLastMonthDataset.New_Signups['male'] - fifthLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillFifthLastMonthEnd['female'] - (fifthLastMonthDataset.New_Signups['female'] - fifthLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillSeventhLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillSixthLastMonthEnd['male'] - (sixthLastMonthDataset.New_Signups['male'] - sixthLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillSixthLastMonthEnd['female'] - (sixthLastMonthDataset.New_Signups['female'] - sixthLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillEighthLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillSeventhLastMonthEnd['male'] - (seventhLastMonthDataset.New_Signups['male'] - seventhLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillSeventhLastMonthEnd['female'] - (seventhLastMonthDataset.New_Signups['female'] - seventhLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillNinthLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillEighthLastMonthEnd['male'] - (eighthLastMonthDataset.New_Signups['male'] - eighthLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillEighthLastMonthEnd['female'] - (eighthLastMonthDataset.New_Signups['female'] - eighthLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillTenthLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillNinthLastMonthEnd['male'] - (ninthLastMonthDataset.New_Signups['male'] - ninthLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillNinthLastMonthEnd['female'] - (ninthLastMonthDataset.New_Signups['female'] - ninthLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillEleventhLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillTenthLastMonthEnd['male'] - (tenthLastMonthDataset.New_Signups['male'] - tenthLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillTenthLastMonthEnd['female'] - (tenthLastMonthDataset.New_Signups['female'] - tenthLastMonthDataset.Deleted['female']),
                    total: 0
                };
                var registeredMembersFromMembersDbTillTwelfthLastMonthEnd = {
                    male: registeredMembersFromMembersDbTillEleventhLastMonthEnd['male'] - (eleventhLastMonthDataset.New_Signups['male'] - eleventhLastMonthDataset.Deleted['male']),
                    female: registeredMembersFromMembersDbTillEleventhLastMonthEnd['female'] - (eleventhLastMonthDataset.New_Signups['female'] - eleventhLastMonthDataset.Deleted['female']),
                    total: 0
                };
                //  ********************************************************************************************************
                //  ********************************************************************************************************
                registeredMembersFromMembersDbTillNow['total'] = registeredMembersFromMembersDbTillNow['male'] + registeredMembersFromMembersDbTillNow['female'];
                registeredMembersFromMembersDbTillSecondLastMonthEnd['total'] = registeredMembersFromMembersDbTillSecondLastMonthEnd['male'] + registeredMembersFromMembersDbTillSecondLastMonthEnd['female'];
                registeredMembersFromMembersDbTillThirdLastMonthEnd['total'] = registeredMembersFromMembersDbTillThirdLastMonthEnd['male'] + registeredMembersFromMembersDbTillThirdLastMonthEnd['female'];
                registeredMembersFromMembersDbTillFourthLastMonthEnd['total'] = registeredMembersFromMembersDbTillFourthLastMonthEnd['male'] + registeredMembersFromMembersDbTillFourthLastMonthEnd['female'];
                registeredMembersFromMembersDbTillFifthLastMonthEnd['total'] = registeredMembersFromMembersDbTillFifthLastMonthEnd['male'] + registeredMembersFromMembersDbTillFifthLastMonthEnd['female'];
                registeredMembersFromMembersDbTillSixthLastMonthEnd['total'] = registeredMembersFromMembersDbTillSixthLastMonthEnd['male'] + registeredMembersFromMembersDbTillSixthLastMonthEnd['female'];
                registeredMembersFromMembersDbTillSeventhLastMonthEnd['total'] = registeredMembersFromMembersDbTillSeventhLastMonthEnd['male'] + registeredMembersFromMembersDbTillSeventhLastMonthEnd['female'];
                registeredMembersFromMembersDbTillEighthLastMonthEnd['total'] = registeredMembersFromMembersDbTillEighthLastMonthEnd['male'] + registeredMembersFromMembersDbTillEighthLastMonthEnd['female'];
                registeredMembersFromMembersDbTillNinthLastMonthEnd['total'] = registeredMembersFromMembersDbTillNinthLastMonthEnd['male'] + registeredMembersFromMembersDbTillNinthLastMonthEnd['female'];
                registeredMembersFromMembersDbTillTenthLastMonthEnd['total'] = registeredMembersFromMembersDbTillTenthLastMonthEnd['male'] + registeredMembersFromMembersDbTillTenthLastMonthEnd['female'];
                registeredMembersFromMembersDbTillEleventhLastMonthEnd['total'] = registeredMembersFromMembersDbTillEleventhLastMonthEnd['male'] + registeredMembersFromMembersDbTillEleventhLastMonthEnd['female'];
                registeredMembersFromMembersDbTillTwelfthLastMonthEnd['total'] = registeredMembersFromMembersDbTillTwelfthLastMonthEnd['male'] + registeredMembersFromMembersDbTillTwelfthLastMonthEnd['female'];
                //   ********************************************************************************************************
                ////////////////////////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////Total Member Visits/////////////////////////////////////////
                var membersVisitsTillNow = {
                    male: totalMemberVisits['male'],
                    female: totalMemberVisits['female'],
                    total: 0
                };
                var membersVisitsTillSecondLastMonthEnd = {
                    male: totalMemberVisits['male'] - lastMonthDataset.Visits['male'],
                    female: totalMemberVisits['female'] - lastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillThirdLastMonthEnd = {
                    male: membersVisitsTillSecondLastMonthEnd['male'] - secondLastMonthDataset.Visits['male'],
                    female: membersVisitsTillSecondLastMonthEnd['female'] - secondLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillFourthLastMonthEnd = {
                    male: membersVisitsTillThirdLastMonthEnd['male'] - thirdLastMonthDataset.Visits['male'],
                    female: membersVisitsTillThirdLastMonthEnd['female'] - thirdLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillFifthLastMonthEnd = {
                    male: membersVisitsTillFourthLastMonthEnd['male'] - fourthLastMonthDataset.Visits['male'],
                    female: membersVisitsTillFourthLastMonthEnd['female'] - fourthLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillSixthLastMonthEnd = {
                    male: membersVisitsTillFifthLastMonthEnd['male'] - fifthLastMonthDataset.Visits['male'],
                    female: membersVisitsTillFifthLastMonthEnd['female'] - fifthLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillSeventhLastMonthEnd = {
                    male: membersVisitsTillSixthLastMonthEnd['male'] - sixthLastMonthDataset.Visits['male'],
                    female: membersVisitsTillSixthLastMonthEnd['female'] - sixthLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillEighthLastMonthEnd = {
                    male: membersVisitsTillSeventhLastMonthEnd['male'] - seventhLastMonthDataset.Visits['male'],
                    female: membersVisitsTillSeventhLastMonthEnd['female'] - seventhLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillNinthLastMonthEnd = {
                    male: membersVisitsTillEighthLastMonthEnd['male'] - eighthLastMonthDataset.Visits['male'],
                    female: membersVisitsTillEighthLastMonthEnd['female'] - eighthLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillTenthLastMonthEnd = {
                    male: membersVisitsTillNinthLastMonthEnd['male'] - ninthLastMonthDataset.Visits['male'],
                    female: membersVisitsTillNinthLastMonthEnd['female'] - ninthLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillEleventhLastMonthEnd = {
                    male: membersVisitsTillTenthLastMonthEnd['male'] - tenthLastMonthDataset.Visits['male'],
                    female: membersVisitsTillTenthLastMonthEnd['female'] - tenthLastMonthDataset.Visits['female'],
                    total: 0
                };
                var membersVisitsTillTwelfthLastMonthEnd = {
                    male: membersVisitsTillEleventhLastMonthEnd['male'] - eleventhLastMonthDataset.Visits['male'],
                    female: membersVisitsTillEleventhLastMonthEnd['female'] - eleventhLastMonthDataset.Visits['female'],
                    total: 0
                };
                //  ********************************************************************************************************
                membersVisitsTillNow['total'] = membersVisitsTillNow['male'] + membersVisitsTillNow['female'];
                membersVisitsTillSecondLastMonthEnd['total'] = membersVisitsTillSecondLastMonthEnd['male'] + membersVisitsTillSecondLastMonthEnd['female'];
                membersVisitsTillThirdLastMonthEnd['total'] = membersVisitsTillThirdLastMonthEnd['male'] + membersVisitsTillThirdLastMonthEnd['female'];
                membersVisitsTillFourthLastMonthEnd['total'] = membersVisitsTillFourthLastMonthEnd['male'] + membersVisitsTillFourthLastMonthEnd['female'];
                membersVisitsTillFifthLastMonthEnd['total'] = membersVisitsTillFifthLastMonthEnd['male'] + membersVisitsTillFifthLastMonthEnd['female'];
                membersVisitsTillSixthLastMonthEnd['total'] = membersVisitsTillSixthLastMonthEnd['male'] + membersVisitsTillSixthLastMonthEnd['female'];
                membersVisitsTillSeventhLastMonthEnd['total'] = membersVisitsTillSeventhLastMonthEnd['male'] + membersVisitsTillSeventhLastMonthEnd['female'];
                membersVisitsTillEighthLastMonthEnd['total'] = membersVisitsTillEighthLastMonthEnd['male'] + membersVisitsTillEighthLastMonthEnd['female'];
                membersVisitsTillNinthLastMonthEnd['total'] = membersVisitsTillNinthLastMonthEnd['male'] + membersVisitsTillNinthLastMonthEnd['female'];
                membersVisitsTillTenthLastMonthEnd['total'] = membersVisitsTillTenthLastMonthEnd['male'] + membersVisitsTillTenthLastMonthEnd['female'];
                membersVisitsTillEleventhLastMonthEnd['total'] = membersVisitsTillEleventhLastMonthEnd['male'] + membersVisitsTillEleventhLastMonthEnd['female'];
                membersVisitsTillTwelfthLastMonthEnd['total'] = membersVisitsTillTwelfthLastMonthEnd['male'] + membersVisitsTillTwelfthLastMonthEnd['female'];
                //////////////////////////////////////////////////////////////////////////////////////////////
                //  ********************************************************************************************************
                //   TrendActivityReport View : TrendActivityReport.js
                //  ********************************************************************************************************
                var trendActivityReportView = new App.Views.TrendActivityReport();
                trendActivityReportView.data = aggregateDataset;
                trendActivityReportView.startDate = activityDataColl.startkey;
                trendActivityReportView.endDate = activityDataColl.endkey;
                trendActivityReportView.CommunityName = communityName;
                trendActivityReportView.render();
                App.$el.children('.body').html(trendActivityReportView.el);
                // ********************************************************************************************************
                //  ********************************************************************************************************
                //Trend Report Graphs Started
                //  ********************************************************************************************************
                //  ********************************************************************************************************
                //Total Members
                //  ********************************************************************************************************
                $('#trend-report-div-total-members').highcharts({
                    chart: {
                        type: 'column',
                        borderColor: '#999999',
                        borderWidth: 2,
                        borderRadius: 10
                    },
                    title: {
                        text: App.languageDictValue.attributes.registered_past_twelve_months //Total Members
                    },
                    xAxis: {
                        categories: [
                                monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                                monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                                monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                                monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                                monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                                monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                                monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                                monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                                monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                                monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                                monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                                monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: App.languageDictValue.attributes.Members_Count
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: App.languageDictValue.attributes.Males,
                        data: [
                            registeredMembersFromMembersDbTillTwelfthLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillEleventhLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillTenthLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillNinthLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillEighthLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillSeventhLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillSixthLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillFifthLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillFourthLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillThirdLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillSecondLastMonthEnd['male'],
                            registeredMembersFromMembersDbTillNow['male']
                        ],
                        color: '#33ccff'
                    }, {
                        name: App.languageDictValue.attributes.Females,
                        data: [
                            registeredMembersFromMembersDbTillTwelfthLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillEleventhLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillTenthLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillNinthLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillEighthLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillSeventhLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillSixthLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillFifthLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillFourthLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillThirdLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillSecondLastMonthEnd['female'],
                            registeredMembersFromMembersDbTillNow['female']
                        ],
                        color: '#66ff66'
                    }, {
                        name: App.languageDictValue.attributes.Total,
                        data: [
                            registeredMembersFromMembersDbTillTwelfthLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillEleventhLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillTenthLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillNinthLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillEighthLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillSeventhLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillSixthLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillFifthLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillFourthLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillThirdLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillSecondLastMonthEnd['total'],
                            registeredMembersFromMembersDbTillNow['total']
                        ],
                        color: '#ff9900'
                    }]
                });
                //  ********************************************************************************************************
                //  ********************************************************************************************************
                //Total Member Visits
                //  ********************************************************************************************************
                $('#trend-report-div-total-member-visits').highcharts({
                    chart: {
                        type: 'column',
                        borderColor: '#999999',
                        borderWidth: 2,
                        borderRadius: 10
                    },
                    title: {
                        text: App.languageDictValue.attributes.visits_past_twelve_months //total Visits
                    },
                    xAxis: {
                        categories: [

                                monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                                monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                                monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                                monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                                monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                                monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                                monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                                monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                                monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                                monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                                monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                                monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text:  App.languageDictValue.attributes.Visits_Count
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: App.languageDictValue.attributes.Males,
                        data: [

                            membersVisitsTillTwelfthLastMonthEnd['male'],
                            membersVisitsTillEleventhLastMonthEnd['male'],
                            membersVisitsTillTenthLastMonthEnd['male'],
                            membersVisitsTillNinthLastMonthEnd['male'],
                            membersVisitsTillEighthLastMonthEnd['male'],
                            membersVisitsTillSeventhLastMonthEnd['male'],
                            membersVisitsTillSixthLastMonthEnd['male'],
                            membersVisitsTillFifthLastMonthEnd['male'],
                            membersVisitsTillFourthLastMonthEnd['male'],
                            membersVisitsTillThirdLastMonthEnd['male'],
                            membersVisitsTillSecondLastMonthEnd['male'],
                            membersVisitsTillNow['male']
                        ],
                        color: '#33ccff'
                    }, {
                        name: App.languageDictValue.attributes.Females,
                        data: [
                            membersVisitsTillTwelfthLastMonthEnd['female'],
                            membersVisitsTillEleventhLastMonthEnd['female'],
                            membersVisitsTillTenthLastMonthEnd['female'],
                            membersVisitsTillNinthLastMonthEnd['female'],
                            membersVisitsTillEighthLastMonthEnd['female'],
                            membersVisitsTillSeventhLastMonthEnd['female'],
                            membersVisitsTillSixthLastMonthEnd['female'],
                            membersVisitsTillFifthLastMonthEnd['female'],
                            membersVisitsTillFourthLastMonthEnd['female'],
                            membersVisitsTillThirdLastMonthEnd['female'],
                            membersVisitsTillSecondLastMonthEnd['female'],
                            membersVisitsTillNow['female']
                        ],
                        color: '#66ff66'
                    }, {
                        name: App.languageDictValue.attributes.Total,
                        data: [
                            membersVisitsTillTwelfthLastMonthEnd['total'],
                            membersVisitsTillEleventhLastMonthEnd['total'],
                            membersVisitsTillTenthLastMonthEnd['total'],
                            membersVisitsTillNinthLastMonthEnd['total'],
                            membersVisitsTillEighthLastMonthEnd['total'],
                            membersVisitsTillSeventhLastMonthEnd['total'],
                            membersVisitsTillSixthLastMonthEnd['total'],
                            membersVisitsTillFifthLastMonthEnd['total'],
                            membersVisitsTillFourthLastMonthEnd['total'],
                            membersVisitsTillThirdLastMonthEnd['total'],
                            membersVisitsTillSecondLastMonthEnd['total'],
                            membersVisitsTillNow['total']
                        ],
                        color: '#ff9900'
                    }]
                });
                //  ********************************************************************************************************
                //  ********************************************************************************************************
                //Active Members This Month
                //  ********************************************************************************************************
                $('#trend-report-div-new-memberships').highcharts({
                    chart: {
                        type: 'column',
                        borderColor: '#999999',
                        borderWidth: 2,
                        borderRadius: 10
                    },
                    title: {
                        text: App.languageDictValue.attributes.active_members_this_month
                    },
                    xAxis: {
                        categories: [
                                monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                                monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                                monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                                monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                                monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                                monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                                monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                                monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                                monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                                monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                                monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                                monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: App.languageDictValue.attributes.Members_Count
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: App.languageDictValue.attributes.Males,
                        data: [
                            registeredMembersTillTwelfthLastMonthEnd['male'],
                                registeredMembersTillEleventhLastMonthEnd['male'] - registeredMembersTillTwelfthLastMonthEnd['male'],
                                registeredMembersTillTenthLastMonthEnd['male'] - registeredMembersTillEleventhLastMonthEnd['male'],
                                registeredMembersTillNinthLastMonthEnd['male'] - registeredMembersTillTenthLastMonthEnd['male'],
                                registeredMembersTillEighthLastMonthEnd['male'] - registeredMembersTillNinthLastMonthEnd['male'],
                                registeredMembersTillSeventhLastMonthEnd['male'] - registeredMembersTillEighthLastMonthEnd['male'],
                                registeredMembersTillSixthLastMonthEnd['male'] - registeredMembersTillSeventhLastMonthEnd['male'],
                                registeredMembersTillFifthLastMonthEnd['male'] - registeredMembersTillSixthLastMonthEnd['male'],
                                registeredMembersTillFourthLastMonthEnd['male'] - registeredMembersTillFifthLastMonthEnd['male'],
                                registeredMembersTillThirdLastMonthEnd['male'] - registeredMembersTillFourthLastMonthEnd['male'],
                                registeredMembersTillSecondLastMonthEnd['male'] - registeredMembersTillThirdLastMonthEnd['male'],
                                totalRegisteredMembers['male'] - registeredMembersTillSecondLastMonthEnd['male']
                        ],
                        color: '#33ccff'
                    }, {
                        name: App.languageDictValue.attributes.Females,
                        data: [
                            registeredMembersTillTwelfthLastMonthEnd['female'],
                                registeredMembersTillEleventhLastMonthEnd['female'] - registeredMembersTillTwelfthLastMonthEnd['female'],
                                registeredMembersTillTenthLastMonthEnd['female'] - registeredMembersTillEleventhLastMonthEnd['female'],
                                registeredMembersTillNinthLastMonthEnd['female'] - registeredMembersTillTenthLastMonthEnd['female'],
                                registeredMembersTillEighthLastMonthEnd['female'] - registeredMembersTillNinthLastMonthEnd['female'],
                                registeredMembersTillSeventhLastMonthEnd['female'] - registeredMembersTillEighthLastMonthEnd['female'],
                                registeredMembersTillSixthLastMonthEnd['female'] - registeredMembersTillSeventhLastMonthEnd['female'],
                                registeredMembersTillFifthLastMonthEnd['female'] - registeredMembersTillSixthLastMonthEnd['female'],
                                registeredMembersTillFourthLastMonthEnd['female'] - registeredMembersTillFifthLastMonthEnd['female'],
                                registeredMembersTillThirdLastMonthEnd['female'] - registeredMembersTillFourthLastMonthEnd['female'],
                                registeredMembersTillSecondLastMonthEnd['female'] - registeredMembersTillThirdLastMonthEnd['female'],
                                totalRegisteredMembers['female'] - registeredMembersTillSecondLastMonthEnd['female']
                        ],
                        color: '#66ff66'
                    }, {
                        name: App.languageDictValue.attributes.Total,
                        data: [
                            registeredMembersTillTwelfthLastMonthEnd['total'],
                                registeredMembersTillEleventhLastMonthEnd['total'] - registeredMembersTillTwelfthLastMonthEnd['total'],
                                registeredMembersTillTenthLastMonthEnd['total'] - registeredMembersTillEleventhLastMonthEnd['total'],
                                registeredMembersTillNinthLastMonthEnd['total'] - registeredMembersTillTenthLastMonthEnd['total'],
                                registeredMembersTillEighthLastMonthEnd['total'] - registeredMembersTillNinthLastMonthEnd['total'],
                                registeredMembersTillSeventhLastMonthEnd['total'] - registeredMembersTillEighthLastMonthEnd['total'],
                                registeredMembersTillSixthLastMonthEnd['total'] - registeredMembersTillSeventhLastMonthEnd['total'],
                                registeredMembersTillFifthLastMonthEnd['total'] - registeredMembersTillSixthLastMonthEnd['total'],
                                registeredMembersTillFourthLastMonthEnd['total'] - registeredMembersTillFifthLastMonthEnd['total'],
                                registeredMembersTillThirdLastMonthEnd['total'] - registeredMembersTillFourthLastMonthEnd['total'],
                                registeredMembersTillSecondLastMonthEnd['total'] - registeredMembersTillThirdLastMonthEnd['total'],
                                registeredMembersTillNow['total'] - registeredMembersTillSecondLastMonthEnd['total']
                        ],
                        color: '#ff9900'
                    }]
                });
                //  ********************************************************************************************************
                //  ********************************************************************************************************
                //Total Member Visits This Month
                //  ********************************************************************************************************
                $('#trend-report-div-visits').highcharts({
                    chart: {
                        type: 'column',
                        borderColor: '#999999',
                        borderWidth: 2,
                        borderRadius: 10
                    },
                    title: {
                        text: App.languageDictValue.attributes.members_visits_this_month
                    },
                    xAxis: {
                        categories: [

                                monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                                monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                                monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                                monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                                monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                                monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                                monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                                monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                                monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                                monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                                monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                                monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: App.languageDictValue.attributes.Visits_Count
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: App.languageDictValue.attributes.Males,
                        data: [
                            twelfthLastMonthDataset.Visits['male'],
                            eleventhLastMonthDataset.Visits['male'],
                            tenthLastMonthDataset.Visits['male'],
                            ninthLastMonthDataset.Visits['male'],
                            eighthLastMonthDataset.Visits['male'],
                            seventhLastMonthDataset.Visits['male'],
                            sixthLastMonthDataset.Visits['male'],
                            fifthLastMonthDataset.Visits['male'],
                            fourthLastMonthDataset.Visits['male'],
                            thirdLastMonthDataset.Visits['male'],
                            secondLastMonthDataset.Visits['male'],
                            lastMonthDataset.Visits['male']
                        ],
                        color: '#33ccff'
                    }, {
                        name: App.languageDictValue.attributes.Females,
                        data: [
                            twelfthLastMonthDataset.Visits['female'],
                            eleventhLastMonthDataset.Visits['female'],
                            tenthLastMonthDataset.Visits['female'],
                            ninthLastMonthDataset.Visits['female'],
                            eighthLastMonthDataset.Visits['female'],
                            seventhLastMonthDataset.Visits['female'],
                            sixthLastMonthDataset.Visits['female'],
                            fifthLastMonthDataset.Visits['female'],
                            fourthLastMonthDataset.Visits['female'],
                            thirdLastMonthDataset.Visits['female'],
                            secondLastMonthDataset.Visits['female'],
                            lastMonthDataset.Visits['female']
                        ],
                        color: '#66ff66'
                    }, {
                        name: App.languageDictValue.attributes.Total,
                        data: [
                                twelfthLastMonthDataset.Visits['male'] + twelfthLastMonthDataset.Visits['female'],
                                eleventhLastMonthDataset.Visits['male'] + eleventhLastMonthDataset.Visits['female'],
                                tenthLastMonthDataset.Visits['male'] + tenthLastMonthDataset.Visits['female'],
                                ninthLastMonthDataset.Visits['male'] + ninthLastMonthDataset.Visits['female'],
                                eighthLastMonthDataset.Visits['male'] + eighthLastMonthDataset.Visits['female'],
                                seventhLastMonthDataset.Visits['male'] + seventhLastMonthDataset.Visits['female'],
                                sixthLastMonthDataset.Visits['male'] + sixthLastMonthDataset.Visits['female'],
                                fifthLastMonthDataset.Visits['male'] + fifthLastMonthDataset.Visits['female'],
                                fourthLastMonthDataset.Visits['male'] + fourthLastMonthDataset.Visits['female'],
                                thirdLastMonthDataset.Visits['male'] + thirdLastMonthDataset.Visits['female'],
                                secondLastMonthDataset.Visits['male'] + secondLastMonthDataset.Visits['female'],
                                lastMonthDataset.Visits['male'] + lastMonthDataset.Visits['female']
                        ],
                        color: '#ff9900'
                    }]
                });
                //  ******************************************************************************************************
                // /////////////////////////////////////////////New Members This Month?////////////////////////////////////
                //  ********************************************************************************************************
                //   Total Resource Views This Month
                //  ********************************************************************************************************
                $('#trend-report-div-total-resource-views-this-month').highcharts({
                    chart: {
                        type: 'column',
                        borderColor: '#999999',
                        borderWidth: 2,
                        borderRadius: 10
                    },
                    title: {
                        text: App.languageDictValue.attributes.resource_views_this_month
                    },
                    xAxis: {
                        categories: [

                                monthNames[twelfthLastMonthStartDate.getMonth()] + ' ' + twelfthLastMonthStartDate.getFullYear(),
                                monthNames[eleventhLastMonthStartDate.getMonth()] + ' ' + eleventhLastMonthStartDate.getFullYear(),
                                monthNames[tenthLastMonthStartDate.getMonth()] + ' ' + tenthLastMonthStartDate.getFullYear(),
                                monthNames[ninthLastMonthStartDate.getMonth()] + ' ' + ninthLastMonthStartDate.getFullYear(),
                                monthNames[eighthLastMonthStartDate.getMonth()] + ' ' + eighthLastMonthStartDate.getFullYear(),
                                monthNames[seventhLastMonthStartDate.getMonth()] + ' ' + seventhLastMonthStartDate.getFullYear(),
                                monthNames[sixthLastMonthStartDate.getMonth()] + ' ' + sixthLastMonthStartDate.getFullYear(),
                                monthNames[fifthLastMonthStartDate.getMonth()] + ' ' + fifthLastMonthStartDate.getFullYear(),
                                monthNames[fourthLastMonthStartDate.getMonth()] + ' ' + fourthLastMonthStartDate.getFullYear(),
                                monthNames[thirdLastMonthStartDate.getMonth()] + ' ' + thirdLastMonthStartDate.getFullYear(),
                                monthNames[secondLastMonthStartDate.getMonth()] + ' ' + secondLastMonthStartDate.getFullYear(),
                                monthNames[lastMonthStartDate.getMonth()] + ' ' + lastMonthStartDate.getFullYear()
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: App.languageDictValue.attributes.Resource_Count
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: App.languageDictValue.attributes.Males,
                        data: [
                            twelfthLastMonthDataset.ResourceViews['male'],
                            eleventhLastMonthDataset.ResourceViews['male'],
                            tenthLastMonthDataset.ResourceViews['male'],
                            ninthLastMonthDataset.ResourceViews['male'],
                            eighthLastMonthDataset.ResourceViews['male'],
                            seventhLastMonthDataset.ResourceViews['male'],
                            sixthLastMonthDataset.ResourceViews['male'],
                            fifthLastMonthDataset.ResourceViews['male'],
                            fourthLastMonthDataset.ResourceViews['male'],
                            thirdLastMonthDataset.ResourceViews['male'],
                            secondLastMonthDataset.ResourceViews['male'],
                            lastMonthDataset.ResourceViews['male']
                        ],
                        color: '#33ccff'
                    }, {
                        name: App.languageDictValue.attributes.Females,
                        data: [
                            twelfthLastMonthDataset.ResourceViews['female'],
                            eleventhLastMonthDataset.ResourceViews['female'],
                            tenthLastMonthDataset.ResourceViews['female'],
                            ninthLastMonthDataset.ResourceViews['female'],
                            eighthLastMonthDataset.ResourceViews['female'],
                            seventhLastMonthDataset.ResourceViews['female'],
                            sixthLastMonthDataset.ResourceViews['female'],
                            fifthLastMonthDataset.ResourceViews['female'],
                            fourthLastMonthDataset.ResourceViews['female'],
                            thirdLastMonthDataset.ResourceViews['female'],
                            secondLastMonthDataset.ResourceViews['female'],
                            lastMonthDataset.ResourceViews['female']
                        ],
                        color: '#66ff66'
                    }, {
                        name: App.languageDictValue.attributes.Total,
                        data: [
                                twelfthLastMonthDataset.ResourceViews['male'] + twelfthLastMonthDataset.ResourceViews['female'],
                                eleventhLastMonthDataset.ResourceViews['male'] + eleventhLastMonthDataset.ResourceViews['female'],
                                tenthLastMonthDataset.ResourceViews['male'] + tenthLastMonthDataset.ResourceViews['female'],
                                ninthLastMonthDataset.ResourceViews['male'] + ninthLastMonthDataset.ResourceViews['female'],
                                eighthLastMonthDataset.ResourceViews['male'] + eighthLastMonthDataset.ResourceViews['female'],
                                seventhLastMonthDataset.ResourceViews['male'] + seventhLastMonthDataset.ResourceViews['female'],
                                sixthLastMonthDataset.ResourceViews['male'] + sixthLastMonthDataset.ResourceViews['female'],
                                fifthLastMonthDataset.ResourceViews['male'] + fifthLastMonthDataset.ResourceViews['female'],
                                fourthLastMonthDataset.ResourceViews['male'] + fourthLastMonthDataset.ResourceViews['female'],
                                thirdLastMonthDataset.ResourceViews['male'] + thirdLastMonthDataset.ResourceViews['female'],
                                secondLastMonthDataset.ResourceViews['male'] + secondLastMonthDataset.ResourceViews['female'],
                                lastMonthDataset.ResourceViews['male'] + lastMonthDataset.ResourceViews['female']
                        ],
                        color: '#ff9900'
                    }]
                });
                //  ********************************************************************************************************
                //  ********************************************************************************************************
            });
        },
        renderNav: function() {
            var con = this.getConfigurations()
            if ($.cookie('Member._id')) {
                var na = new App.Views.navBarView({
                    isLoggedIn: '1',
                    type: con.get('type')
                })
            } else {
                var na = new App.Views.navBarView({
                    isLoggedIn: '0'
                })
            }
            $('div#nav .container').html(na.el)
            // App.badge()
        },
        checkLoggedIn: function() {
            if (!$.cookie('Member._id')) {

                if ($.url().attr('fragment') != 'login' && $.url().attr('fragment') != '' && $.url().attr('fragment') != 'landingPage' && $.url().attr('fragment') != 'becomemember' && !(/^listCommunityPage/.test($.url().attr('fragment'))) && !(/^communityreport/.test($.url().attr('fragment')))) {
                    Backbone.history.stop()
                    App.start()
                }
            } else {
                var expTime = $.cookie('Member.expTime')
                var d = new Date(Date.parse(expTime))
                var diff = Math.abs(new Date() - d)
                //alert(diff)
                var expirationTime = 7200000
                if (diff < expirationTime) {
                    var date = new Date()
                    $.cookie('Member.expTime', date, {
                        path: "/apps/_design/bell"
                    })
                    $.cookie('Member.expTime', date, {
                        path: "/apps/_design/bell"
                    })
                } else {
                    this.expireSession()
                    Backbone.history.stop()
                    App.start()

                }
            }
        },
        getConfigurations: function() {
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            var configuration = config.first()
            return configuration
        },

        Survey: function() {
            App.startActivityIndicator()
            var surveyCollection = new App.Collections.Surveys();
            surveyCollection.fetch({
                async: false
            });
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var survey = new App.Views.Survey();
            survey.render();
            App.$el.children('.body').html('<div id="parentDiv"></div>');
            $('#parentDiv').append(survey.el)
            var surveyTable = new App.Views.SurveyTable({
                collection: surveyCollection
            });
            surveyTable.render()
            $('#parentDiv').append(surveyTable.el);
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
            App.stopActivityIndicator()
        },

        AddSurveyForm: function() {
            //get surveys by maximum issue number
            var maxSurveyNo = 0;
            var pubUrl = '/survey/_design/bell/_view/maxSurveyNo?include_docs=true&descending=true'
            $.ajax({
                url: pubUrl,
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (result) {
                    if(result.rows.length > 0) {
                        maxSurveyNo=result.rows[0].doc.SurveyNo;
                    }
                },
                error: function (status) {
                    console.log(status);
                }
            });
            ///////////////////////////////////////////////////////////
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var survey = new App.Models.Survey();
            survey.on('processed', function() {
                Backbone.history.navigate('survey', {
                    trigger: true
                })
            })
            var surveyFormView = new App.Views.SurveyForm({
                model: survey
            })
            surveyFormView.render();
            App.$el.children('.body').html('<div id="parentDiv"></div>');
            $('#parentDiv').append(surveyFormView.el);
            $('.bbf-form .field-Date label').text(App.languageDictValue.get('Date'));
            $('.bbf-form .field-SurveyNo label').text(App.languageDictValue.get('Survey_Number'));
            $('.bbf-form .field-SurveyTitle label').text(App.languageDictValue.get('Survey_Title'));
            $('.bbf-form .field-Date input').attr("disabled", true)
            var currentDate = new Date();
            $('.bbf-form .field-Date input').datepicker({
                todayHighlight: true
            });
            $('.bbf-form .field-Date input', this.el).datepicker("setDate", currentDate);
            $('.bbf-form .field-Date input').datepicker({
                todayHighlight: true
            });
            $('.bbf-form .field-SurveyNo input').attr("disabled", true)

            $('.bbf-form .field-SurveyNo input').val(maxSurveyNo+1);
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('.fields form').css({"direction":"rtl","float":"right"});
            }
        },

        OpenSurvey: function(surveyNo, communityName) {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            App.$el.children('.body').html('<div id="parentDiv"></div>');
            $('#parentDiv').append('<h4>' + App.languageDictValue.get('nameOfCommunity')+' ' + communityName + '</h4>');
            $('#parentDiv').append('<h4>' + App.languageDictValue.get('Survey_Number')+' ' + surveyNo + '</h4>');
            $.ajax({
                url:'/surveyresponse/_design/bell/_view/surveyResBySurveyNo?_include_docs=true',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (json) {
                    var jsonRows = json.rows;
                    var surveyResModels = [];
                    for(var i = 0 ; i < jsonRows.length ; i++) {
                        if(jsonRows[i].value.SurveyNo == surveyNo && jsonRows[i].value.communityName == communityName) {
                            surveyResModels.push(jsonRows[i].value);
                        }
                    }
                    var communitySurveysView = new App.Views.CommunitySurveysTable();
                    communitySurveysView.communitySurveysCollection = surveyResModels;
                    communitySurveysView.render();
                    $('#parentDiv').append(communitySurveysView.el);
                },
                error: function(err) {
                    console.log(err);
                }
            });
        },

        openCommunitySurvey: function(surveyId) {
            var that = this;
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var surveyResModel;
            $.ajax({
                url: '/surveyresponse/_design/bell/_view/surveyResById?key="' + surveyId + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(json) {
                    if (json.rows[0]) {
                        surveyResModel = json.rows[0].value;
                    }
                    if(surveyResModel) {
                        var surAnswers = surveyResModel.answersToQuestions;
                        var surAnswersIdes = ''
                        _.each(surAnswers, function(item) {
                            surAnswersIdes += '"' + item + '",'
                        })
                        if (surAnswersIdes != ''){
                            surAnswersIdes = surAnswersIdes.substring(0, surAnswersIdes.length - 1);
                        }
                        var answersColl = new App.Collections.SurveyAnswers();
                        answersColl.keys = encodeURI(surAnswersIdes)
                        answersColl.fetch({
                            async: false
                        });
                        //Issue#258 Survey | sort questions///////////////////////////////////////
                        var sortedModels = that.sortQuestions(surAnswers, answersColl.models);
                        answersColl.models = sortedModels;
                        //////////////////////////////////////////////////
                        var surAnswersTable = new App.Views.SurveyAnswerTable({
                            collection: answersColl
                        })
                        surAnswersTable.Id = surveyId;
                        surAnswersTable.render();
                        App.$el.children('.body').html('<div id="parentDiv"></div>');
                        $('#parentDiv').append('<div style="margin-top:10px"><h6>' + surveyResModel.SurveyTitle + '</h6></div>');
                        $('#parentDiv').append(surAnswersTable.el);

                    }
                }
            });
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right"){
                $('#parentDiv div').css({"float":"right"})
                $('#parentDiv div h6').css({"float":"right"})
            }
            else{
                $('#parentDiv div h6').css({"float":"left"})
            }
        },

        SurveyDetails: function(surveyId) {
            var that = this;
            var surveyModel = new App.Models.Survey({
                _id: surveyId
            })
            surveyModel.fetch({
                async: false
            });
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            App.$el.children('.body').html('<div class="directionsAndFloat" style="margin-top:10px"><h6 style="float:left;">'+App.languageDictValue.get('Survey_Number') + ' '+ surveyModel.get('SurveyNo') + '</h6> <button id = "addQuestion" class="btn btn-success" style="float:left;margin-left:20px;margin-bottom:10px;">Add Question</button><button class="btn btn-info" style="float:left;margin-left:20px" onclick="selectCriteria(\'' + surveyId + '\')">Send by criteria</button><button class="btn btn-info" style="float:left;margin-left:20px" onclick="communitiesList(\'' + surveyId + '\')">Send to bell members</button></div> <div id="dialog" style="display: none"> <span class="subtitle">Select a Question</span> <br /> <select id="add_new_question" class="surTextArea"> <option value="1" selected="selected">Multiple Choice (Single Answer)</option> <option value="5">Rating Scale</option> <option value="6">Single Textbox</option> <option value="8">Comment/Essay Box</option> </select><div id="1"> <span class="subtitle2">Question Text</span> <br /> <textarea cols="50" rows="6" id="question_text" name="question_text" class="surTextArea"></textarea> <br /> <span class="subtitle2">Answer Choices (each choice on a separate line)</span> <br /> <textarea cols="50" rows="5" id="answer_choices" name="answer_choices" class="surTextArea"></textarea> <br /> <span class="subtitle2">&nbsp;</span> <br /> <input type="checkbox" value="1" name="required" id="required_question"> <label id="require-surCheckBox" >Require Answer to Question.</label> <br /> <div align="center"> <br /> <input type="submit" value="Save Question" class="default_btn saveQuestionButton saveSurQuestion"> </div> </div><div id="6"> <span class="subtitle2">Question Text</span> <br /> <textarea cols="50" rows="6" id="question_text" name="question_text" class="surTextArea"></textarea> <br /> <input type="checkbox" value="1" name="required" id="required_question"> <label id="require-surCheckBox" >Require Answer to Question.</label><br /> <div align="center"> <br /> <input type="submit" value="Save Question" class="default_btn saveQuestionButton saveSurQuestion"> </div> </div><div id="8"> <span class="subtitle2">Question Text</span> <br /> <textarea cols="50" rows="6" id="question_text" name="question_text" class="surTextArea"></textarea> <br /> <input type="checkbox" value="1" name="required" id="required_question"> <label id="require-surCheckBox" >Require Answer to Question.</label><br /> <div align="center"> <br /> <input type="submit" value="Save Question" class="default_btn saveQuestionButton saveSurQuestion"> </div> </div><div id="5"> <span class="subtitle2">Question Text</span> <br /> <textarea cols="50" rows="6" id="question_text" name="question_text" class="surTextArea"></textarea> <br /> <span class="subtitle2">Answer Choices (each choice on a separate line)</span> <br /> <textarea cols="50" rows="5" id="answer_choices" name="answer_choices" class="surTextArea"></textarea> <br /> <span class="subtitle2">Column Choices</span> <br /><label id="select-ratings" >Select the number of ratings:</label> <br><select onchange="display(this.value);" name="rating_count" class="surTextArea" id="select_rating"><option value="2">2 ratings</option><option value="3">3 ratings</option><option value="4" selected="">4 ratings</option><option value="5">5 ratings</option><option value="6">6 ratings</option><option value="7">7 ratings</option><option value="8">8 ratings</option><option value="9">9 ratings</option></select><br><span id="rating1" name="rating1"><b>Label:</b> <input type="text" name="rating1_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="1" size="3" name="rating1_weight" class="textBoxesOnSurvey" disabled="true"><br></span><span id="rating2" name="rating2"><b>Label:</b> <input type="text" name="rating2_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="2" size="3" name="rating2_weight" class="textBoxesOnSurvey" disabled="true"><br></span><span id="rating3" name="rating3"><b>Label:</b> <input type="text" name="rating3_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="3" size="3" name="rating3_weight" class="textBoxesOnSurvey" disabled="true"><br></span><span id="rating4" name="rating4"><b>Label:</b> <input type="text" name="rating4_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="4" size="3" name="rating4_weight" class="textBoxesOnSurvey" disabled="true"><br></span><span style="display:none;" id="rating5" name="rating5"><b>Label:</b> <input type="text" name="rating5_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="5" size="3" name="rating5_weight" class="textBoxesOnSurvey" disabled="true"><br></span><span style="display:none;" id="rating6" name="rating6"><b>Label:</b> <input type="text" name="rating6_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="6" size="3" name="rating6_weight" class="textBoxesOnSurvey" disabled="true"><br></span> <span style="display:none;" id="rating7" name="rating7"><b>Label:</b> <input type="text" name="rating7_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="7" size="3" name="rating7_weight" class="textBoxesOnSurvey" disabled="true"><br></span> <span style="display:none;" id="rating8" name="rating8"><b>Label:</b> <input type="text" name="rating8_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="8" size="3" name="rating8_weight" class="textBoxesOnSurvey" disabled="true"><br></span> <span style="display:none;" id="rating9" name="rating9"><b>Label:</b> <input type="text" name="rating9_label" class="textBoxesOnSurvey ratingLabels"> <b>Weight:</b> <input type="text" value="9" size="3" name="rating9_weight" class="textBoxesOnSurvey" disabled="true"><br></span><script> function display(val) { if (val == "2") { document.getElementById("rating1").style.display = ""; document.getElementById("rating2").style.display = ""; document.getElementById("rating3").style.display = "none"; document.getElementById("rating4").style.display = "none"; document.getElementById("rating5").style.display = "none"; document.getElementById("rating6").style.display = "none"; document.getElementById("rating7").style.display = "none"; document.getElementById("rating8").style.display = "none"; document.getElementById("rating9").style.display = "none"; } else if (val == "3") { document.getElementById("rating1").style.display = ""; document.getElementById("rating2").style.display = ""; document.getElementById("rating3").style.display = ""; document.getElementById("rating4").style.display = "none"; document.getElementById("rating5").style.display = "none"; document.getElementById("rating6").style.display = "none"; document.getElementById("rating7").style.display = "none"; document.getElementById("rating8").style.display = "none"; document.getElementById("rating9").style.display = "none"; } else if (val == "4") { document.getElementById("rating1").style.display = ""; document.getElementById("rating2").style.display = ""; document.getElementById("rating3").style.display = ""; document.getElementById("rating4").style.display = ""; document.getElementById("rating5").style.display = "none"; document.getElementById("rating6").style.display = "none"; document.getElementById("rating7").style.display = "none"; document.getElementById("rating8").style.display = "none"; document.getElementById("rating9").style.display = "none"; } else if (val == "5") { document.getElementById("rating1").style.display = ""; document.getElementById("rating2").style.display = ""; document.getElementById("rating3").style.display = ""; document.getElementById("rating4").style.display = ""; document.getElementById("rating5").style.display = ""; document.getElementById("rating6").style.display = "none"; document.getElementById("rating7").style.display = "none"; document.getElementById("rating8").style.display = "none"; document.getElementById("rating9").style.display = "none"; } else if (val == "6") { document.getElementById("rating1").style.display = ""; document.getElementById("rating2").style.display = ""; document.getElementById("rating3").style.display = ""; document.getElementById("rating4").style.display = ""; document.getElementById("rating5").style.display = ""; document.getElementById("rating6").style.display = ""; document.getElementById("rating7").style.display = "none"; document.getElementById("rating8").style.display = "none"; document.getElementById("rating9").style.display = "none"; } else if (val == "7") { document.getElementById("rating1").style.display = ""; document.getElementById("rating2").style.display = ""; document.getElementById("rating3").style.display = ""; document.getElementById("rating4").style.display = ""; document.getElementById("rating5").style.display = ""; document.getElementById("rating6").style.display = ""; document.getElementById("rating7").style.display = ""; document.getElementById("rating8").style.display = "none"; document.getElementById("rating9").style.display = "none"; } else if (val == "8") { document.getElementById("rating1").style.display = ""; document.getElementById("rating2").style.display = ""; document.getElementById("rating3").style.display = ""; document.getElementById("rating4").style.display = ""; document.getElementById("rating5").style.display = ""; document.getElementById("rating6").style.display = ""; document.getElementById("rating7").style.display = ""; document.getElementById("rating8").style.display = ""; document.getElementById("rating9").style.display = "none"; } else if (val == "9") { document.getElementById("rating1").style.display = ""; document.getElementById("rating2").style.display = ""; document.getElementById("rating3").style.display = ""; document.getElementById("rating4").style.display = ""; document.getElementById("rating5").style.display = ""; document.getElementById("rating6").style.display = ""; document.getElementById("rating7").style.display = ""; document.getElementById("rating8").style.display = ""; document.getElementById("rating9").style.display = ""; } } </script> <span class="subtitle2">&nbsp;</span> <br /><span class="subtitle2">&nbsp;</span> <br /> <input type="checkbox" value="1" name="required" id="required_question"><label id="require-surCheckBox" >Require Answer to Question.</label> <br /> <div align="center"> <br /> <input type="submit" value="Save Question" class="default_btn saveQuestionButton saveSurQuestion"> </div></div></div>')
            $('#addQuestion').text(App.languageDictValue.get('Add_Question'));
            $('#sendSurveyBtn').text(App.languageDictValue.get('Send_to_communities'));
            $(function () {
                var originalContent;
                $("#dialog").dialog({
                    modal: true,
                    autoOpen: false,
                    title: App.languageDictValue.get('Add_new_Question'),
                    width: 800,
                    height: 400,
                    open : function(event, ui) {
                        originalContent = $("#dialog").html();
                    },
                    close : function(event, ui) {
                        $("#dialog").html(originalContent);
                    }
                });

            });
            $('#dialog .subtitle').text(App.languageDictValue.get('Select_a_Question'));
            var qArray=App.languageDictValue.get('Question_types');
            for(var i=0;i<qArray.length;i++){
                $('#add_new_question option').eq(i).text(qArray[i]);
            }
            $("#addQuestion").click(function () {
                that.openSurveyQuestionDialogBox(surveyId, false, null);
            });
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right"){
                $('#dialog').css({"direction":"rtl"})
            }
            var surQuestions = surveyModel.get('questions');
            var surQuestionsIdes = ''
            _.each(surQuestions, function(item) {
                surQuestionsIdes += '"' + item + '",'
            })
            if (surQuestionsIdes != ''){
                surQuestionsIdes = surQuestionsIdes.substring(0, surQuestionsIdes.length - 1);
            }
            var questionsColl = new App.Collections.SurveyQuestions();
            questionsColl.keys = encodeURI(surQuestionsIdes)
            questionsColl.fetch({
                async: false
            });
            //Issue#258 Survey | sort questions///////////////////////////////////////
            var sortedModels = that.sortQuestions(surQuestions, questionsColl.models);
            questionsColl.models = sortedModels;
            //////////////////////////////////////////////////
            var surQuestionsTable = new App.Views.SurveyQuestionTable({
                collection: questionsColl
            })
            surQuestionsTable.Id = surveyId;
            surQuestionsTable.render()
            App.$el.children('.body').append(surQuestionsTable.el);

            $("#moveup").hide();
            $("#movedown").hide();
            $("input[name='questionRow']").hide();

            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('.directionsAndFloat h6').css({"float":"right"});
                $('.directionsAndFloat button').eq(0).css({"float":"right"});
            }
        },

        sortQuestions: function(idsArrayForSortingOrder, modelsToSort) {
            var sortedModels = [];
            for(var i = 0 ; i < idsArrayForSortingOrder.length ; i++) {
                var modelId = idsArrayForSortingOrder[i];
                for(var j = 0 ; j < modelsToSort.length ; j++) {
                    var model = modelsToSort[j];
                    if(model.attributes._id == modelId) {
                        sortedModels.push(model);
                    }
                }
            }
            return sortedModels;
        },

        openSurveyQuestionDialogBox: function(surveyId, isEdit, questionModel) {
            var that = this;
            $("#dialog").dialog({
                title: App.languageDictValue.get('Add_new_Question'),
            });
            $('#dialog').dialog('open');
            $("#add_new_question").change(handleNewSelection);
            // Run the event handler once now to ensure everything is as it should be
            handleNewSelection.apply($("#add_new_question"));
            if(isEdit) {
                $("#dialog").dialog({
                    title: App.languageDictValue.get('Edit_Question')
                });
                var questionType = questionModel.get('Type');
                if(questionType == 'Multiple Choice (Single Answer)') {
                    that.editMultipleChoiceQuestion(questionModel);
                } else if(questionType == 'Rating Scale') {
                    that.editRatingScaleQuestion(questionModel);
                } else if(questionType == 'Single Textbox') {
                    that.editSingleTextBoxQuestion(questionModel);
                } else if(questionType == 'Comment/Essay Box') {
                    that.editCommentBoxQuestion(questionModel);
                }
            }
            $(".saveSurQuestion").click(function () {
                var selectedVal = $('#add_new_question option:selected').val();
                if(selectedVal){
                    switch (selectedVal) {
                        case '1':  //Multiple Choice Question
                            that.saveMultipleChoiceQuestion(surveyId, selectedVal, isEdit, questionModel);
                            break;
                        case '5':    //Rating Scale
                            that.saveRatingScaleQuestion(surveyId, selectedVal, isEdit, questionModel);
                            break;
                        case '6':    //Single Textbox
                            that.saveSingleTextBoxQuestion(surveyId, selectedVal, isEdit, questionModel);
                            break;
                        case '8':    //Comment/Essay box
                            that.saveCommentBoxQuestion(surveyId, selectedVal, isEdit, questionModel);
                            break;
                    }
                }
            });
        },

        editMultipleChoiceQuestion: function(questionModel) {
            $("#add_new_question").val("1").trigger('change');
            $('#1').find('#question_text').val(questionModel.get('Statement'));
            var question_answer_choices = questionModel.get('Options');
            var options = "";
            for(var i = 0 ; i < question_answer_choices.length ; i++) {
                options = options + question_answer_choices[i] + '\n'
            }
            $('#1').find('#answer_choices').val(options.trim());
            if(questionModel.get('RequireAnswer') == true) {
                $('#1').find('#required_question').attr('checked', true);
            }
        },

        editRatingScaleQuestion: function(questionModel) {
            $("#add_new_question").val("5").trigger('change');
            $('#5').find('#question_text').val(questionModel.get('Statement'));
            var question_answer_choicesRS = questionModel.get('Options');
            var optionsRS = "";
            var ratingLabelsVal = [];
            for(var i = 0 ; i < question_answer_choicesRS.length ; i++) {
                optionsRS = optionsRS + question_answer_choicesRS[i] + '\n'
            }
            $('#5').find('#answer_choices').val(optionsRS.trim());
            ratingLabelsVal = questionModel.get('Ratings');
            $('#5').find('#select_rating').val(ratingLabelsVal.length).trigger('change');
            for(var j = 0 ; j < ratingLabelsVal.length ; j++) {
                $('#5').find('.ratingLabels').eq(j).val(ratingLabelsVal[j]);
            }
            if(questionModel.get('RequireAnswer') == true) {
                $('#5').find('#required_question').attr('checked', true);
            }
        },

        editSingleTextBoxQuestion: function(questionModel) {
            $("#add_new_question").val("6").trigger('change');
            $('#6').find('#question_text').val(questionModel.get('Statement'));
            if(questionModel.get('RequireAnswer') == true) {
                $('#6').find('#required_question').attr('checked', true);
            }
        },

        editCommentBoxQuestion: function(questionModel) {
            $("#add_new_question").val("8").trigger('change');
            $('#8').find('#question_text').val(questionModel.get('Statement'));
            if(questionModel.get('RequireAnswer') == true) {
                $('#8').find('#required_question').attr('checked', true);
            }
        },

        saveSingleTextBoxQuestion: function(surveyId, selectedVal, isEdit, questionModel) {
            var that = this;
            var qStatement = $('#6').find('#question_text').val();
            if(qStatement.toString().trim() != '') {
                var questionObject = new App.Models.Question({
                    Type: 'Single Textbox',
                    Statement: qStatement.toString().trim(),
                    surveyId: surveyId
                });
                if($('#6').find('#required_question').prop("checked") == true) {
                    questionObject.set('RequireAnswer', true);
                } else {
                    questionObject.set('RequireAnswer', false);
                }
                if(isEdit) {
                    questionObject.set('_id', questionModel.get('_id'));
                    questionObject.set('_rev', questionModel.get('_rev'));
                }
                that.saveQuestion(questionObject, surveyId, isEdit);
            } else {
                alert(App.languageDictValue.get('question_stat_missing'));
            }
        },

        saveCommentBoxQuestion: function(surveyId, selectedVal, isEdit, questionModel) {
            var that = this;
            var qStatement = $('#8').find('#question_text').val();
            if(qStatement.toString().trim() != '') {
                var questionObjectForEB = new App.Models.Question({
                    Type: 'Comment/Essay Box',
                    Statement: qStatement.toString().trim(),
                    surveyId: surveyId
                });
                if($('#8').find('#required_question').prop("checked") == true) {
                    questionObjectForEB.set('RequireAnswer', true);
                } else {
                    questionObjectForEB.set('RequireAnswer', false);
                }
                if(isEdit) {
                    questionObjectForEB.set('_id', questionModel.get('_id'));
                    questionObjectForEB.set('_rev', questionModel.get('_rev'));
                }
                that.saveQuestion(questionObjectForEB, surveyId, isEdit);
            } else {
                alert(App.languageDictValue.get('question_stat_missing'));
            }
        },
        saveMultipleChoiceQuestion: function(surveyId, selectedVal, isEdit, questionModel) {
            var that = this;
            var qStatement = $('#1').find('#question_text').val();
            var answer_choices = $('#1').find('#answer_choices').val();
            answer_choices = answer_choices.split('\n');
            if(qStatement.toString().trim() != '') {
                var validOptionValues = [];
                for(var i = 0 ; i < answer_choices.length ; i++) {
                    if(answer_choices[i].trim() != '') {
                        validOptionValues.push(answer_choices[i].trim());
                    }
                }
                if(validOptionValues != [] && validOptionValues.length > 1) {
                    var questionObjectMC = new App.Models.Question({
                        Type: 'Multiple Choice (Single Answer)',
                        Statement: qStatement.toString().trim(),
                        surveyId: surveyId,
                        Options: validOptionValues
                    });
                    if($('#1').find('#required_question').prop("checked") == true) {
                        questionObjectMC.set('RequireAnswer', true);
                    } else {
                        questionObjectMC.set('RequireAnswer', false);
                    }
                    if(isEdit) {
                        questionObjectMC.set('_id', questionModel.get('_id'));
                        questionObjectMC.set('_rev', questionModel.get('_rev'));
                    }
                    that.saveQuestion(questionObjectMC, surveyId, isEdit);
                } else {
                    alert(App.languageDictValue.get('atleast_two_options'));
                }
            } else {
                alert(App.languageDictValue.get('question_stat_missing'));
            }
        },

        saveRatingScaleQuestion: function(surveyId, selectedVal, isEdit, questionModel) {
            var that = this;
            var qStatement = $('#5').find('#question_text').val();
            var answer_choicesRS = $('#5').find('#answer_choices').val();
            answer_choicesRS = answer_choicesRS.split('\n');
            var ratingVal = $('#5').find('#select_rating').val();
            if(qStatement.toString().trim() != '') {
                var validOptionValuesRS = [];
                for(var j = 0 ; j < answer_choicesRS.length ; j++) {
                    if(answer_choicesRS[j].trim() != '') {
                        validOptionValuesRS.push(answer_choicesRS[j].trim());
                    }
                }
                if(validOptionValuesRS != [] && validOptionValuesRS.length > 0) {
                    var labelsVal = [];
                    var rating = [];
                    for(var k = 0 ; k < ratingVal ; k++) {
                        var labelVal = $('#5').find('.ratingLabels').eq(k).val();
                        if(labelVal.trim() != '') {
                            labelsVal.push(labelVal);
                        }
                    }
                    if(labelsVal.length == ratingVal) {
                        rating = labelsVal;
                        var questionObjectRS = new App.Models.Question({
                            Type: 'Rating Scale',
                            Statement: qStatement.toString().trim(),
                            surveyId: surveyId,
                            Options: validOptionValuesRS,
                            Ratings: rating
                        });
                        if($('#5').find('#required_question').prop("checked") == true) {
                            questionObjectRS.set('RequireAnswer', true);
                        } else {
                            questionObjectRS.set('RequireAnswer', false);
                        }
                        if(isEdit) {
                            questionObjectRS.set('_id', questionModel.get('_id'));
                            questionObjectRS.set('_rev', questionModel.get('_rev'));
                        }
                        that.saveQuestion(questionObjectRS, surveyId, isEdit);
                    } else {
                        alert(App.languageDictValue.get('less_labels'));
                    }
                } else {
                    alert(App.languageDictValue.get('less_options'));
                }
            } else {
                alert(App.languageDictValue.get('question_stat_missing'));
            }
        },

        saveQuestion: function(questionObject, surveyId, isEdit) {
            questionObject.save(null, {
                success: function (model, response) {
                    if(!isEdit) {
                        var surModel = new App.Models.Survey({
                            _id: surveyId
                        })
                        surModel.fetch({
                            async: false
                        })
                        var surQuestions = surModel.get('questions');
                        surQuestions.push(response.id);
                        surModel.set('questions', surQuestions);
                        surModel.save(null, {
                            success: function (model, res) {
                                alert(App.languageDictValue.get('question_Saved'));
                                window.location.reload();
                            },
                            error: function (model, err) {
                                console.log(err);
                            },
                            async: false
                        });
                    } else {
                        alert(App.languageDictValue.get('question_Edit'));
                        window.location.reload();
                    }
                },
                error: function (model, err) {
                    console.log(err);
                },
                async: false
            });
        },

        downloadCommunitySurveys: function (surveyNo, surTitle) {
            var that = this;
            $.ajax({
                url:'/surveyresponse/_design/bell/_view/surveyResBySurveyNo?include_docs=true',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (json) {
                    var jsonRows = json.rows;
                    var surveyResModels = [];
                    for(var i = 0 ; i < jsonRows.length ; i++) {
                        if(jsonRows[i].value.SurveyNo == surveyNo && jsonRows[i].value.SurveyTitle == surTitle) {
                            surveyResModels.push(jsonRows[i].value);
                        }
                    }
                    if(surveyResModels.length > 0) {
                        var jsonObjectsData = [];
                        var surveyTitle;
                        for(var j = 0 ; j < surveyResModels.length ; j++) {
                            surveyTitle = surveyResModels[j].SurveyTitle;
                            var commName = surveyResModels[j].communityName;
                            var gender = surveyResModels[j].genderOfMember;
                            var birthYear = surveyResModels[j].birthYearOfMember;
                            var memberLanguage = surveyResModels[j].memberLanguage;
                            var surAnswers = surveyResModels[j].answersToQuestions;
                            var surAnswersIdes = ''
                            _.each(surAnswers, function(item) {
                                surAnswersIdes += '"' + item + '",'
                            })
                            if (surAnswersIdes != ''){
                                surAnswersIdes = surAnswersIdes.substring(0, surAnswersIdes.length - 1);
                            }
                            var answersColl = new App.Collections.SurveyAnswers();
                            answersColl.keys = encodeURI(surAnswersIdes)
                            answersColl.fetch({
                                async: false
                            });
                            var answerModels = answersColl.models;
                            var answersArray = [];
                            for(var k = 0 ; k < answerModels.length ; k++) {
                                answersArray.push(answerModels[k].attributes);
                            }
                            for(var x = 0 ; x < answersArray.length ; x++) {
                                if(answersArray[x].Answer.length > 0) {
                                    if(answersArray[x].Type == 'Rating Scale') {
                                        for(var y = 0 ; y < answersArray[x].Options.length ; y++) {
                                            var JSONObj = {"Community":"", "Gender":"", "BirthYear":"", "Language":"", "QType":"", "QStatement":"", "Options":[], "Answer":[]};
                                            JSONObj.Community = commName;
                                            JSONObj.Gender = gender;
                                            JSONObj.BirthYear = birthYear;
                                            JSONObj.Language = memberLanguage;
                                            JSONObj.QType = answersArray[x].Type;
                                            JSONObj.QStatement = answersArray[x].Statement + '--' + answersArray[x].Options[y];
                                            JSONObj.Options = answersArray[x].Ratings;
                                            if(answersArray[x].Answer[y] != undefined) {
                                                JSONObj.Answer = answersArray[x].Answer[y];
                                            }
                                            jsonObjectsData.push(JSONObj)
                                        }
                                    } else {
                                        var JSONObj = {"Community":"", "Gender":"", "BirthYear":"", "Language":"", "QType":"", "QStatement":"", "Options":[], "Answer":[]};
                                        JSONObj.Community = commName;
                                        JSONObj.Gender = gender;
                                        JSONObj.BirthYear = birthYear;
                                        JSONObj.Language = memberLanguage;
                                        JSONObj.QType = answersArray[x].Type;
                                        JSONObj.QStatement = answersArray[x].Statement;
                                        if(answersArray[x].Options){
                                            JSONObj.Options = answersArray[x].Options;
                                        }
                                        JSONObj.Answer = answersArray[x].Answer;
                                        jsonObjectsData.push(JSONObj)
                                    }
                                }
                            }
                        }
                        if(jsonObjectsData.length > 0) {
                            jsonObjectsData.sort(that.sortByProperty('QStatement'));
                            jsonObjectsData.sort(that.sortByProperty('QType'));
                            that.JSONToCSVConvertor(jsonObjectsData, surveyTitle+ '/' + surveyNo);
                        } else {
                            alert("All the questions are un-answered, so unable to download data");
                        }
                    } else {
                        alert("There is no data available to download against this survey");
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
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

        JSONToCSVConvertor: function (JSONData, ReportTitle) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';
            //Set Report title in first row or line
            //CSV += label + '\r\n\n';
            //This will generate the Label/Header
            var row = "";
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }
            row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);
                //add a line break after each row
                CSV += row + '\r\n';
            }
            if (CSV == '') {
                alert("Invalid data");
                return;
            }
            //Generate a file name
            var fileName = "";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.toString().replace(/ /g,"_");
            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + CSV;
            uri = encodeURI(uri);
            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension
            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            //this part will append the anchor tag and remove it after automatic click
            App.$el.append(link);
            link.click();
        },

        communityDetails: function (commDocId, requestStatus) {
            var commConfigModel;
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            App.languageDictValue=languageDictValue;
            if(requestStatus == 'registered') {
                commConfigModel = new App.Models.Community({
                    _id: commDocId
                })
                commConfigModel.fetch({
                    async: false
                });
            } else if(requestStatus == 'pending') {
                $.ajax({
                    url: '/communityregistrationrequests/_design/bell/_view/getDocById?_include_docs=true&key="' + commDocId + '"',
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        commConfigModel = json.rows[0].value;
                    },
                    error: function (status) {
                        console.log(status);
                    }
                });
            }
            var commConfigForm = new App.Views.CommunityDetailsView({
                model: commConfigModel
            })
            commConfigForm.status = requestStatus;
            commConfigForm.render();
            App.$el.children('.body').html(commConfigForm.el);
            if(requestStatus == 'registered'){
                $('#acceptRegistration').css('display','none');
                $('#rejectRegistration').css('display','none');
            }
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('.addNation-form').css('direction','rtl');
            }
            else{
                $('.addNation-form').css('direction','ltr');
            }
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'))
        },

        underConstruction: function() {
            App.$el.children('.body').html('<div  id="underConstruction" style="margin:0 auto"><h4>This Functionality is under construction.</h4></div>')
        },

        addCourses: function(publicationId) {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var seachForm = new App.Views.courseSeach()
            seachForm.publicationId = publicationId
            seachForm.render();
            App.$el.children('.body').html('<div id="parentDiv"></div>');
            $('#parentDiv').append(seachForm.el);
            $('#SeachCourseText').attr('placeholder',App.languageDictValue.attributes.KeyWord_s);
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('.form h6').css({"float":"left"});
                $('.form h6 input').css({"margin-left":"20px","margin-right":"0px"});
            }
        },
        Dashboard: function() {
            var con = this.getConfigurations()
            if (con.get('type') == 'community') {
                this.cummunityManage()
                return
            }
            var dashboard = new App.Views.Dashboard()
            App.$el.children('.body').html(dashboard.el)
            dashboard.render()
            var communityNames = [];
            $.ajax({
                type: 'GET',
                url: '/community/_design/bell/_view/getCommunityByCode?include_docs=true&limit=5',
                dataType: 'json',
                success: function(response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        communityNames[i] = response.rows[i].value;
                    }
                },
                async: false
            });
            for(var i=0;i<communityNames.length;i++){
                var doc = communityNames[i];
                var code, name;
                if(doc.Code != undefined) {
                    code = doc.Code;
                    name = doc.Name;
                } else {
                    code = doc.code;
                    name = doc.name;
                }
                $('#communities tbody').append('<tr class="success"><td><a style="color:#345474" href="#communityDetails/'+doc._id+'/registered">'+name+'</a>' + '</td></tr>');
            }
            for(var i=0;i<5-communityNames.length;i++)
            {
                $('#communities tbody').append('<tr class="success"><td><a style="color:#345474">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>' + '</td></tr>');
            }
            var pubIssues = [];
            $.ajax({
                type: 'GET',
                url:'/publications/_design/bell/_view/publicationIssue?include_docs=true&descending=true&limit=5',
                //url: '/publications/_design/bell/_view/publicationIssue?include_docs=true',
                dataType: 'json',
                success: function(response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        pubIssues[i] = response.rows[i].value;
                    }
                },
                async: false
            });
            for(var i=0;i<pubIssues.length;i++){
                $('#publications tbody').append('<tr class="success"><td><a style="color:#345474" href="#publicationdetail/'+pubIssues[i]._id+'">'+'Issue No '+pubIssues[i].IssueNo+'</a>' + '</td></tr>');
            }

            for(var i=0;i<5-pubIssues.length;i++)
            {
                $('#publications tbody').append('<tr class="success"><td><a style="color:#345474">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>' + '</td></tr>');
            }
            var surveyTitles = [];
            $.ajax({
                type: 'GET',
                url:'/survey/_design/bell/_view/surveyBySurveyNo?include_docs=true&descending=true&limit=5',
                dataType: 'json',
                success: function(response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        surveyTitles[i] = response.rows[i].value;
                    }
                },
                async: false
            });
            for(var i=0;i<surveyTitles.length;i++){
                $('#surveys tbody').append('<tr class="success"><td><a style="color:#345474" href="#surveydetail/'+surveyTitles[i]._id+'">'+surveyTitles[i].SurveyTitle+'</a>' + '</td></tr>');
            }
            for(var i=0;i<5-surveyTitles.length;i++)
            {
                $('#surveys tbody').append('<tr class="success"><td><a style="color:#345474">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>' + '</td></tr>');
            }
            var reportsTitle = [];
            $.ajax({
                type: 'GET',
                url:'/nationreports/_design/bell/_view/allNationReports?include_docs=true&limit=5',
                //url: '/publications/_design/bell/_view/publicationIssue?include_docs=true',
                dataType: 'json',
                success: function(response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        reportsTitle[i] = response.rows[i].value;
                    }
                },
                async: false
            });
            for(var i=0;i<reportsTitle.length;i++){
                $('#reports tbody').append('<tr class="success"><td><a style="color:#345474" href="#reports/edit/'+reportsTitle[i]._id+'">'+reportsTitle[i].title+'</a>' + '</td></tr>');
            }
            for(var i=0;i<5-reportsTitle.length;i++)
            {
                $('#reports tbody').append('<tr class="success"><td><a style="color:#345474">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>' + '</td></tr>');
            }
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang').toLowerCase())
            /*  var Publications = new App.Collections.Publication()
             Publications.getlast = true
             Publications.fetch({
             success: function(collection, response) {
             _.each(response.results, function(model) {
             if (model.doc.IssueNo != undefined) {
             $('#publications tbody').append('<tr class="info"><td>Issue :' + model.doc.IssueNo + '</td></tr>');
             } else {
             $('#publications tbody').append('<tr class="info"><td>Issue Deleted</td></tr>');
             }
             })

             },
             async: false
             })
             $('#publications').append('<tr ><td><a class="btn btn-default" href="#publication" id="clickmore">Click for more</a></td></tr>');*/


        },
        cummunityManage: function() {

            App.$el.children('.body').html('')
            App.$el.children('.body').append('<a href="#configuration"><button class="btn btn-hg btn-primary" id="configbutton">Configurations</button></a>')
            App.$el.children('.body').append('<button class="btn btn-hg btn-primary" onclick=SyncDbSelect() id="sync">Sync With Nation</button>')
        },
        CommunityForm: function(CommunityId) {
            this.modelForm('Community', CommunityId, 'login')
        },
        viewAllFeedback: function() {
            var fed = new App.Collections.siteFeedbacks()
            fed.fetch({
                async: false
            })

            feedul = new App.Views.siteFeedbackPage({
                collection: fed
            })
            feedul.render()
            $('#see-all', feedul.$el).trigger("click");
            App.$el.children('.body').html('&nbsp')
            App.$el.children('.body').append(feedul.el)
            $("#previousButton").hide()
            $("#progress_img").hide()
        },
        modelForm: function(className, modelId, reroute) {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);

            // Set up
            var model = new App.Models[className]()
            var modelForm = new App.Views['CommunityForm']({
                model: model
            })


            App.$el.children('.body').html('<div class="directionsAndFloat"></div>')
            // Bind form to the DOM


            $('.directionsAndFloat').append(modelForm.el)

            //	.append($button)
            // modelForm.render()
            // Bind form events for when Course is ready

            model.once('Model:ready', function() {


                modelForm.on(className + 'Form:done', function() {
                    Backbone.history.navigate(reroute, {
                        trigger: true
                    })
                })
                // Set up the form
                modelForm.render()
            })

            // Set up the model for the form
            if (modelId) {
                model.id = modelId
                model.once('sync', function() {
                    model.trigger('Model:ready')
                })
                model.fetch({
                    async: false
                })
            } else {
                model.trigger('Model:ready')
            }
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },
        MemberLogin: function() {
            // Prevent this Route from completing if Member is logged in.
            if ($.cookie('Member._id')) {
                Backbone.history.navigate('listCommunity', {
                    trigger: true
                })
                return
            }
            var credentials = new App.Models.Credentials()
            var memberLoginForm = new App.Views.MemberLoginForm({
                model: credentials
            })
            memberLoginForm.once('success:login', function() {
                window.location.href = "../MyApp/index.html#dashboard";
                //Backbone.history.navigate('listCommunity', {trigger: true})
            })
            memberLoginForm.render()
            App.$el.children('.body').html(memberLoginForm.el)
            $('ul.nav').html($('#template-nav-log-in').html()).hide()
        },
        MemberLogout: function() {

            this.expireSession()

            Backbone.history.navigate('login', {
                trigger: true
            })
        },
        expireSession: function() {

            $.removeCookie('Member.login', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member._id', {
                path: "/apps/_design/bell"
            })

            $.removeCookie('Member.expTime', {
                path: "/apps/_design/bell"
            })
        },
        VipLinks: function(){
            var lang;
            lang = App.Router.getLanguage($.cookie('Member.login'));
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var viplink = new App.Collections.VipLinks()
            viplink.fetch({
                async: false
            })
            var vplink = new App.Views.VipLinksView({
                collection: viplink
            });
            vplink.render();
            App.$el.children('.body').html('<div id="communityDiv"></div>');
            $('#communityDiv').append(vplink.el);
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },
        ListCommunity: function (secretId, startDate) {
            App.startActivityIndicator();
            var isCorrectSecretId = true;
            var lang;
            if($.cookie('Member.login'))
            {
                lang = App.Router.getLanguage($.cookie('Member.login'));
            }
            else
            {
                $('#nav').hide();
                lang = "English";
                if($.cookie('languageFromCookie'))
                {
                    lang = $.cookie('languageFromCookie')
                }
            }
            var viplinkModel = null;
            if(secretId)
            {
                viplinkModel = new App.Models.VipLink({
                    _id : secretId
                });

                viplinkModel.fetch({
                    async: false
                });

                viplinkModel.fetch({
                    success: function(model, response, options) {
                    },

                    error: function(model, xhr, options) {
                        isCorrectSecretId = false;
                    },
                    async: false
                });
                if(isCorrectSecretId)
                {
                    viplinkModel.set("visits", (viplinkModel.attributes.visits) + 1);
                    viplinkModel.set("lastVisit", new Date());
                    viplinkModel.save();
                }
            }
            if(isCorrectSecretId)
            {
                App.languageDictValue=App.Router.loadLanguageDocs(lang);
                var Communities = new App.Collections.Community();
                Communities.fetch({
                        async: false
                    }
                );
                CommunityTable = new App.Views.CommunityRequestsTable({
                    collection: Communities,
                    startDate: startDate,
                    name : "VipLink"
                });
                CommunityTable.vipLinkModel = viplinkModel;
                CommunityTable.render();
                var nationUrl = $.url().data.attr.authority;
                var temp = $.url().data.attr.host.split(".")
                var nationName = temp[0];
               
                $.ajax({
                    url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/activitylog/_design/bell/_view/getDocumentByDate?sorted=true&limit=1',
                    type: 'GET',
                    dataType: 'jsonp',
                    async: false,
                    success: function (result) {
                        urlFrag = $.url().data.attr.fragment.split('/');
                        if (urlFrag[2]) {
                            selDate = urlFrag[2].split('-');
                            setDt = new Date(selDate[0], selDate[1] - 1, 01, 00, 00, 00);
                        } else {
                            setDt = new Date();
                        }
                        firstDt = result.rows[0].key.split('/');
                        firstYear = firstDt[0];
                        firstMonth = parseInt(firstDt[1]);
                        firstDt = new Date(firstYear, firstMonth - 1, 01, 00, 00, 00);
                        today = new Date();
                        var listCommunity;
                        if (secretId && firstDt) {
                            var nationConfig = new App.Collections.Configurations();
                            nationConfig.fetch({
                                async: false
                            });
                            nationConfig = nationConfig.first();
                            listCommunity = "<img src='img/logo.png' width='108px' height='108px' style='z-index:1; border:2px solid white;border-radius:60px;'/>";
                        if (!$.cookie('Member.login')) {
                            var options = [];
                            var allLanguages = {};
                            var languages = new App.Collections.Languages();
                            languages.fetch({
                                async: false
                            });
                            for (var i=0;i<languages.length;i++) {
                                if (languages.models[i].attributes.hasOwnProperty("nameOfLanguage")) {
                                    var languageName = languages.models[i].attributes.nameOfLanguage;
                                    allLanguages[languageName] = languages.models[i].get('nameInNativeLang');
                                    options += '<option value="' + languageName + '">' + allLanguages[languageName] + '</option>';
                                }
                            }
                            listCommunity = "<img src='img/logo.png' width='108px' height='108px' style='z-index:1; border:2px solid white;border-radius:60px;'/>" + '<div id = "loginLang" st><select id="onLoginLanguage">'+options+'</select>'+"&nbsp;&nbsp;"+"<a class='btn btn-success' href='../MyApp/index.html#login'>" + App.languageDictValue.attributes.Sign_In + "</a>"+'</div>';
                        }
                            listCommunity = listCommunity + "<h3> " + App.languageDictValue.attributes.Hi + "&nbsp;" + viplinkModel.attributes.name + "</h3>" + "<h3>" + App.languageDictValue.attributes.welcome_to + "&nbsp;" + nationConfig.get("name") + "&nbsp" + App.languageDictValue.attributes.Communities + "</h3>";
                        } else {//if logged in and token is not correct
                            listCommunity = "<h3> " + App.languageDictValue.get("Communities") + "  |  <a  class='btn btn-success' id='addComm' href='#addCommunity'>" + App.languageDictValue.get("Add_Community") + "</a>  </h3><p>" + App.languageDictValue.get("Member_Resources_Count") + "</p>";
                        }

                        if (firstDt.getFullYear() != today.getFullYear() || firstDt.getMonth() != today.getMonth()) {
                            listCommunity += '<input class="date-picker"/><style>.ui-datepicker-calendar{display: none;}.date-picker{width:300px;}</style>';
                        }
                        listCommunity += "<div id='list-of-Communities'></div>"
                        App.$el.children('.body').html('<div id="communityDiv"></div>');
                        $('#communityDiv').append(listCommunity);
                        $('#onLoginLanguage').change(function()
                        {
                            $.cookie('languageFromCookie',$(this).val());
                            location.reload();
                        });
                        $("select option[value='"+lang+"']").attr("selected","selected");

                        if(firstDt.getFullYear() != today.getFullYear() || firstDt.getMonth() != today.getMonth()) {
                            $('input.date-picker').datepicker({
                                minDate: firstDt, 
                                maxDate: today,
                                changeMonth: true,
                                changeYear: true,
                                dateFormat: 'MM yy',
                                onClose: function(dateText, inst) {
                                    var month = $(".ui-datepicker-month :selected").val();
                                    var year = $(".ui-datepicker-year :selected").val();
                                    var newDt = new Date(year, month, 1);
                                    $('input.date-picker').datepicker('setDate', newDt);
                                    month = parseInt(newDt.getMonth());
                                    Backbone.history.navigate('listCommunityPage/'+secretId +'/'+ newDt.getFullYear() + '-' + (month + 1), {
                                        trigger: true
                                    });
                                }
                            });
                            $('input.date-picker').datepicker('setDate', setDt);
                        }
                        $('#list-of-Communities', App.$el).append(CommunityTable.el);
                        App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
                        App.stopActivityIndicator();
                    }
                });
            }
            App.stopActivityIndicator()
            if(!isCorrectSecretId)
            {
                window.location.href = "../MyApp/index.html#login";
            }
        },

        getPendingRequests: function() {
            var jsonModels = [];
            $.ajax({
                url: '/communityregistrationrequests/_design/bell/_view/getAllCommunities?_include_docs=true',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (json) {
                    for(var i = 0 ; i < json.rows.length ; i++) {
                        if(json.rows[i].value.registrationRequest == "pending") {
                            jsonModels.push(json.rows[i].value);
                        }
                    }
                },
                error: function (status) {
                    console.log(status);
                }
            });
            return jsonModels;
        },

        ListCommunitiesRequest: function(startDate){
            var that = this;
            that.getAllPendingRequests();
            var pendingRequests = that.getPendingRequests();
            App.startActivityIndicator();
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var Communities = new App.Collections.Community();
            Communities.fetch({
                    async: false
                }
            );
            CommunityTable = new App.Views.CommunityRequestsTable({
                collection: Communities,
                startDate: startDate,
                name : "CommunityRequest"
            });
            CommunityTable.pendingCollections = pendingRequests;
            CommunityTable.render();
            var nationUrl = $.url().data.attr.authority;
            var temp = $.url().data.attr.host.split(".")
            var nationName = temp[0];
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/activitylog/_design/bell/_view/getDocumentByDate?sorted=true&limit=1',
                type: 'GET',
                dataType: 'jsonp',
                async: false,
                success: function(result) {
		    urlFrag = $.url().data.attr.fragment.split('/');
		    if(urlFrag[1]) {
		    	selDate = urlFrag[1].split('-');
			setDt = new Date(selDate[0], selDate[1]-1, 01, 00, 00, 00);
		    } else {
		    	setDt = new Date();
		    }
                    firstDt = result.rows[0].key.split('/');
                    firstYear = firstDt[0];
                    firstMonth = parseInt(firstDt[1]);
		    firstDt = new Date(firstYear, firstMonth-1, 01, 00, 00, 00);
		    today = new Date();
                    var listCommunity ="<h3>"+App.languageDictValue.get('Communities_request')+"</h3>";
		    if(firstDt.getFullYear() != today.getFullYear() || firstDt.getMonth() != today.getMonth()) {
                    listCommunity += '<input class="date-picker"/><style>.ui-datepicker-calendar{display: none;}.date-picker{width:300px;float:right;}</style>';
		    }
                    listCommunity += "<div id='list-of-Communities'></div>"

                    App.$el.children('.body').html('<div id="communityDiv"></div>');
                    $('#communityDiv').append(listCommunity);
                    
		    if(firstDt.getFullYear() != today.getFullYear() || firstDt.getMonth() != today.getMonth()) {
		    $('input.date-picker').datepicker({
                        minDate: firstDt, 
                        maxDate: today,
			changeMonth: true,
			changeYear: true,
			dateFormat: 'MM yy',
			onClose: function(dateText, inst) {
                           var month = $(".ui-datepicker-month :selected").val();
                           var year = $(".ui-datepicker-year :selected").val();
			   var newDt = new Date(year, month, 1);
			   $('input.date-picker').datepicker('setDate', newDt);
			   month = parseInt(newDt.getMonth());
                           Backbone.history.navigate('listCommunity/'+newDt.getFullYear()+'-'+(month+1), {
                              trigger: true
                           });
                        }
                    });
		    $('input.date-picker').datepicker('setDate', setDt);
		    }
                    $('#list-of-Communities', App.$el).append(CommunityTable.el);
                    App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
                    App.stopActivityIndicator()

                }
            });
        },

        earthRequest: function() {
            var listReq = "<div id='listRequest-head'> <p class='heading'> <a href='#' style='color:#1ABC9C'>Earth Request</a>  |   <a href='#request'>Communities Request</a> </p> </div>"

            listReq += "<div style='width:940px;margin:0 auto' id='listReq'></div>"

            App.$el.children('.body').html(listReq)
        },
        commRequest: function() {



            var listReq = "<div id='listRequest-head'> <p class='heading'> <a href='#earthrequest' >Earth Request</a>  |   <a href='#request' style='color:#1ABC9C'>Communities Request</a> </p> </div>"

            listReq += "<div style='width:940px;margin:0 auto' id='listReq'></div>"

            App.$el.children('.body').html(listReq)

            App.startActivityIndicator()

            var request = new App.Collections.CourseRequest()
            request.fetch({
                async: false
            })
            var requestResource = new App.Collections.ResourceRequest()
            requestResource.fetch({
                async: false
            })
            request.add(requestResource.toJSON(), {
                silent: true
            });
            var requestTableView = new App.Views.RequestsTable({
                collection: request
            })
            requestTableView.render()
            App.$el.children('.body').append(requestTableView.el)
            App.stopActivityIndicator()

        },
        Reports: function(database) {
            App.startActivityIndicator()
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            $('ul.nav').html($("#template-nav-logged-in").html()).show()
            $('#itemsinnavbar').html($("#template-nav-logged-in").html())

            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var reports = new App.Collections.Reports()
            reports.fetch({
                async: false
            })
            var resourcesTableView = new App.Views.ReportsTable({
                collection: reports
            })
            resourcesTableView.isManager = roles.indexOf("Manager")
            resourcesTableView.render()
            App.$el.children('.body').html('');
            App.$el.children('.body').html('<div id="parentDiv"></div>')
            if (roles.indexOf("Manager") > -1) {
                $('#parentDiv').append('<p><a class="btn btn-success" href="#reports/add">'+App.languageDictValue.get('Add_a_New_Report')+'</a>' +
                    '<a style="margin-left:20px" class="btn btn-success" href="#trendreport">'+App.languageDictValue.attributes.Trend+" " +App.languageDictValue.attributes.Activity_Report+'</a></p>')
            }
            var temp = $.url().attr("host").split(".")
            //  temp = temp[0].substring(3)
            temp = temp[0]
            if (temp.length == 0) {
                temp = temp + "Nation"
            }
            $('#parentDiv').append('<h4><span style="color:gray;">' + temp + '</span> | '+App.languageDictValue.attributes.Reports+'</h4>')
            $('#parentDiv').append(resourcesTableView.el);
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('#parentDiv p').find('a').eq(1).css({"margin-left":"0px","margin-right":"20px"})
            }

            App.stopActivityIndicator()
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },
        ReportForm: function(reportId) {
            var report = (reportId) ? new App.Models.NationReport({
                _id: reportId
            }) : new App.Models.NationReport()
            report.on('processed', function() {
                Backbone.history.navigate('report', {
                    trigger: true
                })
            })
            var reportFormView = new App.Views.ReportForm({
                model: report
            })
            App.$el.children('.body').html(reportFormView.el)

            if (report.id) {
                App.listenToOnce(report, 'sync', function() {
                    reportFormView.render()
                })
                report.fetch()
            } else {
                reportFormView.render()

            }
            $('.field-title label').text(App.languageDictValue.get('Title'));
            $('.field-author label').text(App.languageDictValue.get('author'));
            $('.field-Date label').text(App.languageDictValue.get('Date'));
            var DaysObj=App.languageDictValue.get("Months");
            for(var i=0;i<12;i++)
            {
                $('.bbf-month option').eq(i).html(App.Router.lookup(App.languageDictValue, "Months." + $('.bbf-month option').eq(i).text().toString() ));

            }
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                // $('.fields .bbf-form').css({"direction":"rtl","float":"right"});
                $('.form .bbf-field').css({"float":"right"});
            }
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },
        //************************************************************************************************************
        //****************************************************************************************************************
        Publicat: function() {
            App.startActivityIndicator();
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            App.languageDictValue=languageDictValue;
            var publicationCollection = new App.Collections.Publication()
            publicationCollection.fetch({
                async: false
            })
            var arrayPub = publicationCollection;
            arrayPub = arrayPub.models
            //************************************************************************
            $.ajax({
                url: '/publicationdistribution/_design/bell/_view/pubdistributionByPubId?include_docs=true',
                type: 'GET',
                dataType: "json",
                async: false,
                //**********************************
                success: function(data) {
                    _.each(data.rows, function(row) {
                        var pubDistModel = row.value;
                        var pubId = pubDistModel.publicationId;
                        var resultArray = [];
                        _.each(arrayPub, function(model) {
                            if (model.id == pubId) {
                                resultArray.push(true)
                            }
                        })
                        if (resultArray.indexOf(true) == -1) {
                            var doc = {
                                _id: pubDistModel._id,
                                _rev: pubDistModel._rev
                            };
                            $.couch.db("publicationdistribution").removeDoc(doc, {
                                success: function(data) {
                                    alert(languageDictValue.attributes.Extra_Docs_Deleted)
                                },
                                error: function(status) {
                                    console.log(status);
                                },
                                async: false
                            });
                        }
                    })

                },
                error: function(status) {
                    console.log(status);
                },
            })
            App.stopActivityIndicator()
            this.Publication();
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },
        //*********************************************************************************************
        Publication: function() {
            App.startActivityIndicator()
            var publicationCollection = new App.Collections.Publication()
            publicationCollection.fetch({
                async: false
            })
            var publication = new App.Views.Publication()
            App.$el.children('.body').html('<div id="parentDiv"></div>');
            publication.render();
            $('#parentDiv').append(publication.el)
            var publicationtable = new App.Views.PublicationTable({
                collection: publicationCollection
            })
            publicationtable.render()
            $('#parentDiv').append(publicationtable.el)
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
            App.stopActivityIndicator()

        },
        PublicationDetails: function(publicationId) {

            var publicationObject = new App.Models.Publication({
                _id: publicationId
            })
            publicationObject.fetch({
                async: false
            })
            var resources = publicationObject.get('resources')
            var courses = publicationObject.get('courses')
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            App.$el.children('.body').html('<div id="parentDiv"></div>');
            $('#parentDiv').append('<div style="margin-top:10px"><h6 style="float:left;">'+App.languageDictValue.get('IssueNumber')+ ' '+ publicationObject.get('IssueNo') + '</h6> <a class="btn btn-success" style="margin-left:20px" href="#courses/' + publicationId + '">'+App.languageDictValue.get('Add_Course')+'</a> <a class="btn btn-success" href = "../MyApp/index.html#search-bell/' + publicationId + '" style="float:left;margin-left:20px;margin-bottom:10px;">'+App.languageDictValue.get('Add_Resource')+'</a><button class="btn btn-info" style="float:left;margin-left:20px" onclick="SelectCommunity(\'' + publicationId + '\')">'+App.languageDictValue.get('Send_Publication')+'</button></div>')
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('#parentDiv div').find('h6').css({"float":"right"});
                $('#parentDiv div').find('a').eq(0).css({"float":"right","margin-right":"20px","margin-left":"0px"});
                $('#parentDiv div').find('a').eq(1).css({"float":"right","margin-right":"20px","margin-left":"0px"});
                $('#parentDiv div').find('button').css({"float":"right","margin-right":"20px","margin-left":"0px"});
            }
            var resIdes = ''
            _.each(resources, function(item) {
                resIdes += '"' + item + '",'
            })
            if (resIdes != '')
                resIdes = resIdes.substring(0, resIdes.length - 1);

            var resourcesColl = new App.Collections.Resources()
            resourcesColl.keys = encodeURI(resIdes)
            resourcesColl.fetch({
                async: false
            });
            var publicationresTable = new App.Views.PublicationResourceTable({
                collection: resourcesColl
            })
            publicationresTable.Id = publicationId
            publicationresTable.render()
            $('#parentDiv').append(publicationresTable.el)

            var coursesIdes = ''
            _.each(courses, function(item) {
                coursesIdes += '"' + item['courseID'] + '",'
            })
            if (coursesIdes != '')
                coursesIdes = coursesIdes.substring(0, coursesIdes.length - 1);

            var coursesColl = new App.Collections.Courses()
            coursesColl.keys = encodeURI(coursesIdes)
            coursesColl.fetch({
                async: false
            });

            var publicationcourseTable = new App.Views.PublicationCoursesTable({
                collection: coursesColl
            })
            publicationcourseTable.Id = publicationId
            publicationcourseTable.render()
            $('#parentDiv').append(publicationcourseTable.el)
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },

        PublicationForm: function(publicationId) {
            var publication = (publicationId) ? new App.Models.Publication({
                _id: publicationId
            }) : new App.Models.Publication()
            publication.on('processed', function() {
                Backbone.history.navigate('publication', {
                    trigger: true
                })
            })
            var publicationFormView = new App.Views.PublicationForm({
                model: publication
            })
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            //get publication by maximum issue number
            var maxPubIssue = 0;
            var pubUrl = '/publications/_design/bell/_view/maxPublicationIssue?include_docs=true&descending=true'
            $.ajax({
                url: pubUrl,
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (result) {
                    if(result.rows.length > 0) {
                        maxPubIssue = result.rows[0].doc.IssueNo;
                    }
                },
                error: function (status) {
                    console.log(status);
                }
            });
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            App.$el.children('.body').html(publicationFormView.el)

            if (publication.id) {
                publication.fetch({
                    success: function(response) {
                        if (publication.get('kind') == 'CoursePublication') {
                            publicationFormView.rlength = publication.get('courses').length
                        } else {
                            if (publication.get('resources') != null)
                                publicationFormView.rlength = publication.get('resources').length

                        }

                    },
                    async: false
                })
                publicationFormView.render()

            } else {
                publicationFormView.rlength = 0
                publicationFormView.render()


            }
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('.fields form').css({"direction":"rtl","float":"right"});
            }
            $('.field-Date label').html(App.languageDictValue.get('Date'));
            $('.field-IssueNo label').html(App.languageDictValue.get('IssueNumber'));
            $('.field-editorName label').html(App.languageDictValue.get('Editor_Name'));
            $('.field-editorEmail label').html(App.languageDictValue.get('Editor_Email'));
            $('.field-editorPhone label').html(App.languageDictValue.get('Editor_Phone'));
            //hjghk
            $('.bbf-form .field-IssueNo input').attr("disabled", true)
            $('.bbf-form .field-Date input').attr("disabled", true)

            if (!publication.id) {

                $('.bbf-form .field-IssueNo input').val(maxPubIssue+1)
            }
            var currentDate = new Date();
            $('.bbf-form .field-Date input').datepicker({
                todayHighlight: true
            });
            $('.bbf-form .field-Date input', this.el).datepicker("setDate", currentDate);
            $('.bbf-form .field-Date input').datepicker({
                todayHighlight: true
            });
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },
        getNativeNameOfLang: function(language){
            var languages = new App.Collections.Languages();
            languages.fetch({
                async: false
            });
            for(var i=0;i<languages.length;i++) {
                if (languages.models[i].attributes.hasOwnProperty("nameOfLanguage")) {
                    if (languages.models[i].attributes.nameOfLanguage == language) {
                        return languages.models[i].get('nameInNativeLang');
                    }
                }
            }
        },
        SelectCommunities: function(pId) {
            $('#invitationdiv').fadeIn(1000)
            var inviteForm = new App.Views.listCommunityView()
            inviteForm.pId = pId
            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)
            var Communities = new App.Collections.Community()
            Communities.fetch({
                async: false
            })
            Communities.each(
                function(log) {
                    var name;
                    if(log.get('Name') != undefined) {
                        name = log.get('Name');
                    } else {
                        name = log.get('name');
                    }
                    if(name){
                        $('#comselect').append("<option value='" + name + "'>" + name + "</option>")
                    }
                });
            $('#addQuestion').css('pointer-events','none');
            if(App.languageDictValue.get('directionOfLang').toLowerCase()==="right")
            {
                $('#invitationdiv').css({"direction":"rtl"});
            }
        },

        criteriaList: function(surveyId) {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var criteriaListView = new App.Views.CriteriaListView();
            criteriaListView.surveyId =surveyId;
            criteriaListView.render();
            App.$el.children('.body').html('<div id="sendByCriteriaDiv"></div>');
            $('#sendByCriteriaDiv').append(criteriaListView.el);
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));        },

        MembersList: function (surveyId, selectedBellCodes, selectedBellNames) {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var membersListView = new App.Views.MembersListView();
            membersListView.surveyId = surveyId;
            membersListView.selectedBellCodes = selectedBellCodes;
            membersListView.selectedBellNames = selectedBellNames;
            membersListView.render();
            App.$el.children('.body').html('<div id="memberList"></div>');
            $('#memberList').append(membersListView.el);
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },

        communitiesList: function (surveyId) {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue=App.Router.loadLanguageDocs(lang);
            var communitiesList = new App.Views.CommunitiesList();
            communitiesList.surveyId = surveyId;
            communitiesList.render();
            App.$el.children('.body').html('<div id="sendToBellDiv"></div>');
            $('#sendToBellDiv').append(communitiesList.el);
            App.Router.applyCorrectStylingSheet(App.languageDictValue.get('directionOfLang'));
        },

        SyncDbSelect: function() {
            $('#invitationdiv').fadeIn(1000)
            var inviteForm = new App.Views.listSyncDbView()

            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)
        },
        lookup:function (obj, key) {
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
        getLanguage: function(loginOfMem) {
            var lang;
            $.ajax({
                url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                type: 'GET',
                dataType: 'jsonp',
                async:false,
                success: function (surResult) {
                    var nationConfig = new App.Collections.Configurations();
                    nationConfig.fetch({
                        async: false
                    });
                    nationConfig = nationConfig.first();
                    var id = null;
                    for(var i = 0; i < surResult.rows.length; i++)
                    {
                        var id = surResult.rows[i].id;
                        $.ajax({
                            url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                            type: 'GET',
                            dataType: 'jsonp',
                            async:false,
                            success: function (resultByDoc) {
                                if(resultByDoc.rows[0].value.community == nationConfig.attributes.code)
                                {
                                    lang = resultByDoc.rows[0].value.bellLanguage;
                                }
                            },
                            error:function(err){
                                console.log(err);
                            }
                        });
                    }
                },
                error:function(err){
                    console.log(err);
                }
            });
            return lang;
        },

        getCentralNationUrl: function() {
            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configDoc = configCollection.first().toJSON();
            return configDoc.register;
        },

        getAllPendingRequests: function () {
            var centralNationUrl = App.Router.getCentralNationUrl();
            var nationUrl = $.url().data.attr.authority;
            var nationPort = nationUrl.split(':')[1];
            var docIDs=[];
            $.ajax({
                url: 'http://' + centralNationUrl + '/communityregistrationrequests/_design/bell/_view/getCommunityByNationUrl?_include_docs=true&key="' + nationPort + '"',
                type: 'GET',
                dataType: 'jsonp',
                async: false,
                success: function (json) {
                    var jsonModels = json.rows;
                    for(var i = 0 ; i < jsonModels.length ; i++) {
                        var community = jsonModels[i].value;
                        if(community.registrationRequest=="pending"){
                            docIDs.push(community._id);
                        }
                    }
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": 'http://' + centralNationUrl + '/communityregistrationrequests',
                            "target": 'communityregistrationrequests',
                            'doc_ids': docIDs
                        }),
                        async: false,
                        success: function (response) {
                            console.log('Successfully replicated all pending requests.')
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });
                },
                error: function (status) {
                    console.log(status);
                }
            });
        }
    }))
})
