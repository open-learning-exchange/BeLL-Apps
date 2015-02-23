$(function() {
    App.Router = new(Backbone.Router.extend({

        routes: {
            'addCommunity': 'CommunityForm',
            'addCommunity/:CommunityId': 'CommunityForm',
            'login': 'MemberLogin',
            'logout': 'MemberLogout',
            'listCommunity': 'ListCommunity',
            'siteFeedback': 'viewAllFeedback',
            'dashboard': 'Dashboard',
            'request': 'commRequest',
            'earthrequest': 'earthRequest',
            'reports': 'Reports',
            'reports/edit/:resportId': 'ReportForm',
            'reports/add': 'ReportForm',
            'publication': 'Publication',
            'publication/add': 'PublicationForm',
            'configuration': 'Configuration',
            'publication/add/:publicationId': 'PublicationForm',
            'publicationdetail/:publicationId': 'PublicationDetails',
            'courses/:publicationId': "addCourses",
            'trendreport':"TrendReport"
        },

        initialize: function() {
            this.bind("all", this.checkLoggedIn)
            this.bind("all", this.routeStartupTasks)
            this.bind("all", this.renderNav)

        },
        routeStartupTasks: function() {
            $('#invitationdiv').hide()
            $('#debug').hide()

        },
        findIndicesOfMax: function (inp, count) {
            var outp = [];
            for (var i = 0; i < inp.length; i++) {
                outp.push(i); // add index to output array
                if (outp.length > count) {
                    outp.sort(function(a, b) { return inp[b] - inp[a]; }); // descending sort the output array
                    outp.pop(); // remove the last index (index of smallest element in output array)
                }
            }
            if (inp.length <= count) {
                outp.sort(function(a, b) { return inp[b] - inp[a]; });
            }
            return outp;
        },
        findIndicesOfMin: function (inp, count) {
            var outp = [];
            for (var i = 0; i < inp.length; i++) {
                outp.push(i); // add index to output array
                if (outp.length > count) {
                    outp.sort(function(a, b) { return inp[a] - inp[b]; }); // descending sort the output array
                    outp.pop(); // remove the last index (index of smallest element in output array)
                }
            }
            if (inp.length <= count) {
                outp.sort(function(a, b) { return inp[a] - inp[b]; });
            }
            return outp;
        },
        aggregateDataForTrendReport: function (CommunityName, logData) {
        //            var type="community"
        //            var configurations=Backbone.Collection.extend({
        //                url: App.Server + '/configurations/_all_docs?include_docs=true'
        //            })
        //            var config=new configurations()
        //            config.fetch({async:false})
        //            var currentConfig=config.first()
        //            var cofigINJSON=currentConfig.toJSON()
        //            if( cofigINJSON.rows[0].doc.type){
        //                type=cofigINJSON.rows[0].doc.type
        //            }
        //            var logData=new App.Collections.ActivityLog()
        //            logData.startkey = this.changeDateFormat(startDate)
        //            logData.endkey = this.changeDateFormat(endDate)
        //            if(CommunityName!='all') {
        //                logData.name=CommunityName
        //            }
        //            logData.fetch({ // logData.logDate is not assigned any value so the view called will be one that uses start and
        //                // end keys rather than logdate to fetch activitylog docs from the db
        //                async:false
        //            })
            // now we will assign values from first of the activitylog records, returned for the period from startDate to
            // endDate, to local variables  so that we can keep aggregating values from all the just fetched activitylog
            // records into these variables and then just display them in the output
            if (logData.length < 1) {
                var staticData={
                    "Visits":{"male": 0, "female": 0},
                    "New_Signups": {"male": 0, "female": 0},
                    "Most_Freq_Open": [],
                    "Highest_Rated": [],
                    "Lowest_Rated": []
                };
                return staticData;
            }
            var logReport=logData[0];
            if(logReport==undefined){
                alert("No Activity Logged for this period")
            }
            var report_resRated = [], report_resOpened = [], report_male_visits = 0, report_female_visits = 0, report_male_new_signups = 0,
                report_female_new_signups = 0, report_male_rating = [], report_female_rating =[], report_male_timesRated = [],
                report_female_timesRated = [], report_male_opened = [], report_female_opened = [];
            if(logReport.resourcesIds) {
                report_resRated = logReport.resourcesIds;
            }
            if(logReport.resources_opened){
                report_resOpened = logReport.resources_opened
            }
            if(logReport.male_visits){
                report_male_visits=logReport.male_visits
            }
            if(logReport.female_visits){
                report_female_visits=logReport.female_visits
            }

            if(logReport.male_new_signups){
                report_male_new_signups = logReport.male_new_signups
            }
            if(logReport.female_new_signups){
                report_female_new_signups = logReport.female_new_signups
            }

            if(logReport.male_rating){
                report_male_rating = logReport.male_rating
            }
            if(logReport.female_rating){
                report_female_rating = logReport.female_rating
            }
            if(logReport.male_timesRated){
                report_male_timesRated = logReport.male_timesRated
            }
            if(logReport.female_timesRated){
                report_female_timesRated = logReport.female_timesRated
            }
            if(logReport.male_opened){
                report_male_opened = logReport.male_opened
            }
            if(logReport.female_opened){
                report_female_opened = logReport.female_opened
            }
            for (var index = 0; index < logData.length; index++) {
        //            logData.each(function (logDoc,index){
                if(index>0){
                    var logDoc = logData[index];
                    // add visits to prev total
                    report_male_visits += logDoc.male_visits;
                    report_female_visits += logDoc.female_visits;

                    // add new member signups count to prev total
                    report_male_new_signups += ( (logDoc.male_new_signups) ? logDoc.male_new_signups : 0 );
                    report_female_new_signups += ( (logDoc.female_new_signups) ? logDoc.female_new_signups : 0 );

                    var resourcesIds=logDoc.resourcesIds;
                    var resourcesOpened=logDoc.resources_opened;
                    for(var i = 0; i < resourcesIds.length ; i++){
                        var resId = resourcesIds[i]
                        var resourceIndex = report_resRated.indexOf(resId)
                        if(resourceIndex == -1){
                            report_resRated.push(resId);
                            report_male_rating.push(logDoc.male_rating[i])
                            report_female_rating.push(logDoc.female_rating[i]);
                            report_male_timesRated.push(logDoc.male_timesRated[i]);
                            report_female_timesRated.push(logDoc.female_timesRated[i]);
                        }else{
                            report_male_rating[resourceIndex] = report_male_rating[resourceIndex] + logDoc.male_rating[i];
                            report_female_rating[resourceIndex] = report_female_rating[resourceIndex] + logDoc.female_rating[i];
                            report_male_timesRated[resourceIndex] = report_male_timesRated[resourceIndex] + logDoc.male_timesRated[i];
                            report_female_timesRated[resourceIndex] = report_female_timesRated[resourceIndex] + logDoc.female_timesRated[i];
                        }
                    }
                    if(resourcesOpened)
                        for(var i=0 ; i < resourcesOpened.length ; i++){
                            var resId = resourcesOpened[i]
                            var resourceIndex = report_resOpened.indexOf(resId)
                            if(resourceIndex == -1){
                                report_resOpened.push(resId)
                                report_male_opened.push(logDoc.male_opened[i])
                                report_female_opened.push(logDoc.female_opened[i])
                            }else{
                                report_male_opened[resourceIndex] = report_male_opened[resourceIndex] + logDoc.male_opened[i]
                                report_female_opened[resourceIndex] = report_female_opened[resourceIndex] + logDoc.female_opened[i]
                            }
                        }
                }
            }
            // find most frequently opened resources
            var times_opened_cumulative = [], Most_Freq_Opened = [];
            for (var i = 0; i < report_resOpened.length; i++) {
                times_opened_cumulative.push(report_male_opened[i] + report_female_opened[i]);
            }
            var indices = [];
            var topCount = 5;
            if (times_opened_cumulative.length >= topCount) {
                indices = this.findIndicesOfMax(times_opened_cumulative, topCount);
            }
            else {
                indices = this.findIndicesOfMax(times_opened_cumulative, times_opened_cumulative.length);
            }
            // fill up most_freq_opened array
            var timesRatedTotalForThisResource, sumOfRatingsForThisResource;
            if (times_opened_cumulative.length > 0) {
                var most_freq_res_entry, indexFound;
                for (var i = 0; i < indices.length; i++) {
                    var res=new App.Models.Resource({_id:report_resOpened[indices[i]]});
                    res.fetch({
                        async:false
                    });
                    var name=res.get('title');
                    // create most freq opened resource entry and push it into Most_Freq_Opened array
                    most_freq_res_entry = {
                        "resourceName":	name ,
                        "timesOpenedCumulative": times_opened_cumulative[indices[i]],
                        "timesOpenedByMales": report_male_opened[indices[i]],
                        "timesOpenedByFemales": report_female_opened[indices[i]]
                    };
                    if ((indexFound = report_resRated.indexOf(report_resOpened[indices[i]])) === -1) { // resource not rated
                        most_freq_res_entry["avgRatingCumulative"] = "N/A";
                        most_freq_res_entry["avgRatingByMales"] = "N/A";
                        most_freq_res_entry["avgRatingByFemales"] = "N/A";
                        most_freq_res_entry["timesRatedByMales"] = "N/A";
                        most_freq_res_entry["timesRatedByFemales"] = "N/A";
                        most_freq_res_entry["timesRatedCumulative"] = "N/A";
                    }
                    else {
                        timesRatedTotalForThisResource = report_male_timesRated[indexFound] + report_female_timesRated[indexFound];
                        sumOfRatingsForThisResource = report_male_rating[indexFound] + report_female_rating[indexFound];
                        most_freq_res_entry["avgRatingCumulative"] = Math.round((sumOfRatingsForThisResource / timesRatedTotalForThisResource) * 100)/100;
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
            var resources_rated_cumulative = [], Highest_Rated_Resources = [], Lowest_Rated_Resources = [];
            var lowestHowMany = 5;
            for (var i = 0; i < report_resRated.length; i++) {
                timesRatedTotalForThisResource = report_male_timesRated[i] + report_female_timesRated[i];
                sumOfRatingsForThisResource = report_male_rating[i] + report_female_rating[i];
                resources_rated_cumulative.push(sumOfRatingsForThisResource / timesRatedTotalForThisResource);
            }
            var indicesHighestRated = [], indicesLowestRated = [];
            if (resources_rated_cumulative.length >= topCount) {
                indicesHighestRated = this.findIndicesOfMax(resources_rated_cumulative, topCount);
                indicesLowestRated = this.findIndicesOfMin(resources_rated_cumulative, lowestHowMany);
            }
            else {
                indicesHighestRated = this.findIndicesOfMax(resources_rated_cumulative, resources_rated_cumulative.length);
                indicesLowestRated = this.findIndicesOfMin(resources_rated_cumulative, resources_rated_cumulative.length);
            }
            if (resources_rated_cumulative.length > 0) {
                var entry_rated_highest, entry_rated_lowest;
                // fill up Highest_Rated_resources list
                for (var i = 0; i < indicesHighestRated.length; i++) {
                    var res=new App.Models.Resource({_id:report_resRated[indicesHighestRated[i]]});
                    res.fetch({
                        async:false
                    });
                    var name=res.get('title');
                    timesRatedTotalForThisResource = report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]];
                    // create highest rated resource entry and push it into Highest_Rated_Resources array
                    entry_rated_highest = {
                        "resourceName": name,
                        "avgRatingCumulative": Math.round(resources_rated_cumulative[indicesHighestRated[i]] * 100)/100,
                        "avgRatingByMales": report_male_rating[indicesHighestRated[i]],
                        "avgRatingByFemales": report_female_rating[indicesHighestRated[i]],
                        "timesRatedByMales": report_male_timesRated[indicesHighestRated[i]],
                        "timesRatedByFemales": report_female_timesRated[indicesHighestRated[i]],
                        "timesRatedCumulative": report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]]
                    };
                    if ((indexFound = report_resOpened.indexOf(report_resRated[indicesHighestRated[i]])) === -1) { // resource not rated
                        entry_rated_highest["timesOpenedByMales"] = "N/A";
                        entry_rated_highest["timesOpenedByFemales"] = "N/A";
                        entry_rated_highest["timesOpenedCumulative"] = "N/A";
                    }
                    else {
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
                    var res=new App.Models.Resource({_id:report_resRated[indicesLowestRated[i]]})
                    res.fetch({
                        async:false
                    })
                    var name=res.get('title')

                    entry_rated_lowest = {
                        "resourceName": name,
                        "avgRatingCumulative": Math.round(resources_rated_cumulative[indicesLowestRated[i]] * 100)/100,
                        "avgRatingByMales": report_male_rating[indicesLowestRated[i]],
                        "avgRatingByFemales": report_female_rating[indicesLowestRated[i]],
                        "timesRatedByMales": report_male_timesRated[indicesLowestRated[i]],
                        "timesRatedByFemales": report_female_timesRated[indicesLowestRated[i]],
                        "timesRatedCumulative": report_male_timesRated[indicesLowestRated[i]] + report_female_timesRated[indicesLowestRated[i]]
                    };
                    if ((indexFound = report_resOpened.indexOf(report_resRated[indicesLowestRated[i]])) === -1) { // resource not rated
                        entry_rated_lowest["timesOpenedByMales"] = "N/A";
                        entry_rated_lowest["timesOpenedByFemales"] = "N/A";
                        entry_rated_lowest["timesOpenedCumulative"] = "N/A";
                    }
                    else {
                        entry_rated_lowest["timesOpenedByMales"] = report_male_opened[indexFound];
                        entry_rated_lowest["timesOpenedByFemales"] = report_female_opened[indexFound];
                        entry_rated_lowest["timesOpenedCumulative"] = times_opened_cumulative[indexFound];
                    }
                    Lowest_Rated_Resources.push(entry_rated_lowest);
                }
            }
            var staticData={
                "Visits":{"male": report_male_visits, "female": report_female_visits},
                "New_Signups": {"male": report_male_new_signups, "female": report_female_new_signups},
                "Most_Freq_Open": Most_Freq_Opened,
                "Highest_Rated": Highest_Rated_Resources,
                "Lowest_Rated": Lowest_Rated_Resources
            };
            return staticData;
        },
        turnDateFromMMDDYYYYToYYYYMMDDFormat: function (date) {
            var datePart = date.match(/\d+/g), month = datePart[0], day = datePart[1], year = datePart[2];
            return year+'/'+month+'/'+day;
        },
        turnDateToYYYYMMDDFormat: function (date) {
            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();
            // CONVERT mm AND dd INTO chars
            var mmChars = mm.split('');
            var ddChars = dd.split('');
            // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
            var dateString = yyyy + '/' + ( mmChars.length===2 ? mm : "0" + mmChars[0] ) + '/' + ( ddChars.length===2 ? dd : "0" + ddChars[0] );
            return dateString;
        },
        changeDateFormat:function(date){
            var datePart = date.match(/\d+/g), year = datePart[0], month = datePart[1], day = datePart[2];
            return year+'/'+month+'/'+day;
        },
        Configuration: function() {
//            var config = new App.Collections.Configurations()
//            config.fetch({
//                async: false
//            })
//            var configuration = config.first()
//            var configView = new App.Views.ConfigurationView()
//            configView.model = configuration
//            configView.render()

            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configModel = configCollection.first();
            var configForm = new App.Views.Configurations({
                model: configModel
            })
            configForm.render();

            App.$el.children('.body').html(configForm.el)

        },
        getRegisteredMembersCount: function (callback) {
            var maleMembers = 0, femaleMembers = 0;
            $.ajax({
                url: '/members/_design/bell/_view/MaleCount?group=false',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function (json) {
                    if (json.rows[0]) {
                        maleMembers = json.rows[0].value
                    }
                    $.ajax({
                        url: '/members/_design/bell/_view/FemaleCount?group=false',
                        type: 'GET',
                        dataType: "json",
                        async: false,
                        success: function (json) {
                            if(json.rows[0]){
                                femaleMembers = json.rows[0].value;
                            }
                            callback(maleMembers, femaleMembers);
                        }
                    })
                }
            })
        },
        TrendReport: function(){
            var context = this;
            App.$el.children('.body').html('');
            $( '<div id="trend-report-form" style="height: auto"></div>' ).appendTo( App.$el.children('.body') );

            var select = $("<select id='communitySelector'>");

            var label = $("<label>").text('Select Community: ');
            $( '#trend-report-form').append(label);

            var communityNames = [];
            $.ajax({
                type: 'GET',
                url: '/community/_design/bell/_view/getAllCommunityNames',
                dataType: 'json',
                success: function (response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        communityNames[i]= response.rows[i].value;
                        select.append("<option value=" + communityNames[i] + ">" +  response.rows[i].key + "</option>");
                    }
                },
                data: {},
                async: false
            });

            $( '#trend-report-form').append(select);

            var button = $('<input type="button" style="height: 100%">').attr({id: 'submit', name: 'submit', class:'btn btn-success' , value: 'Generate Report'});
            $( '#trend-report-form').append(button);

            var communityName= "";

            button.click(function() {
                var communityChosen = $('#communitySelector').val();
                communityName = $('#communitySelector option:selected').text();

                var endDateForTrendReport = new Date(); // selected date turned into javascript 'Date' format
                var lastMonthStartDate = new Date( endDateForTrendReport.getFullYear(), endDateForTrendReport.getMonth(), 1 );
                var secondLastMonthEndDate = new Date( lastMonthStartDate.getFullYear(), lastMonthStartDate.getMonth(),
                    ( lastMonthStartDate.getDate() - 1 ) );
                var secondLastMonthStartDate = new Date( secondLastMonthEndDate.getFullYear(), secondLastMonthEndDate.getMonth(), 1 );
                var thirdLastMonthEndDate = new Date( secondLastMonthStartDate.getFullYear(), secondLastMonthStartDate.getMonth(),
                    ( secondLastMonthStartDate.getDate() - 1 ) );
                var thirdLastMonthStartDate = new Date( thirdLastMonthEndDate.getFullYear(), thirdLastMonthEndDate.getMonth(), 1 );
                var fourthLastMonthEndDate = new Date( thirdLastMonthStartDate.getFullYear(), thirdLastMonthStartDate.getMonth(),
                    ( thirdLastMonthStartDate.getDate() - 1 ) );
                var fourthLastMonthStartDate = new Date( fourthLastMonthEndDate.getFullYear(), fourthLastMonthEndDate.getMonth(), 1 );
                var fifthLastMonthEndDate = new Date( fourthLastMonthStartDate.getFullYear(), fourthLastMonthStartDate.getMonth(),
                    ( fourthLastMonthStartDate.getDate() - 1 ) );
                var fifthLastMonthStartDate = new Date( fifthLastMonthEndDate.getFullYear(), fifthLastMonthEndDate.getMonth(), 1 );
                var sixthLastMonthEndDate = new Date( fifthLastMonthStartDate.getFullYear(), fifthLastMonthStartDate.getMonth(),
                    ( fifthLastMonthStartDate.getDate() - 1 ) );
                var sixthLastMonthStartDate = new Date( sixthLastMonthEndDate.getFullYear(), sixthLastMonthEndDate.getMonth(), 1 );
                var startDate = context.changeDateFormat( context.turnDateToYYYYMMDDFormat(sixthLastMonthStartDate) );
                var endDate = context.changeDateFormat( context.turnDateToYYYYMMDDFormat(endDateForTrendReport) );

                var activityDataColl = new App.Collections.ActivityLog();
                var urlTemp = 'http://127.0.0.1:5984/activitylog/_design/bell/_view/getDocByCommunityCode?include_docs=true&startkey=["'+communityChosen+'","'+startDate+'"]&endkey=["'+
                                                                                                                            communityChosen+'","'+endDate+'"]';
                activityDataColl.setUrl(urlTemp);
                activityDataColl.fetch({ // logData.logDate is not assigned any value so the view called will be one that uses start and
                    // end keys rather than logdate to fetch activitylog docs from the db
                    async:false
                });
                activityDataColl.toJSON();

                // iterate over activitylog models inside the activityDataColl collection and assign each to the month range in which they lie
                var endingMonthActivityData = [], secondLastMonthActivityData = [], thirdLastMonthActivityData = [],
                    fourthLastMonthActivityData = [], fifthLastMonthActivityData = [], sixthLastMonthActivityData = [];
                for (var i in activityDataColl.models) {
                    var modelKey = context.turnDateFromMMDDYYYYToYYYYMMDDFormat(activityDataColl.models[i].get('logDate'));

                    if ( (modelKey >= context.turnDateToYYYYMMDDFormat(lastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(endDateForTrendReport)) ) {
                        endingMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ( (modelKey >= context.turnDateToYYYYMMDDFormat(secondLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(secondLastMonthEndDate)) ) {
                        secondLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ( (modelKey >= context.turnDateToYYYYMMDDFormat(thirdLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(thirdLastMonthEndDate)) ) {
                        thirdLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ( (modelKey >= context.turnDateToYYYYMMDDFormat(fourthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(fourthLastMonthEndDate)) ) {
                        fourthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ( (modelKey >= context.turnDateToYYYYMMDDFormat(fifthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(fifthLastMonthEndDate)) ) {
                        fifthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    } else if ( (modelKey >= context.turnDateToYYYYMMDDFormat(sixthLastMonthStartDate)) &&
                        (modelKey <= context.turnDateToYYYYMMDDFormat(sixthLastMonthEndDate)) ) {
                        sixthLastMonthActivityData.push(JSON.parse(JSON.stringify(activityDataColl.models[i])));
                    }
                }
                var lastMonthDataset = context.aggregateDataForTrendReport('communityX', endingMonthActivityData);
                var secondLastMonthDataset = context.aggregateDataForTrendReport('communityX', secondLastMonthActivityData);
                var thirdLastMonthDataset = context.aggregateDataForTrendReport('communityX', thirdLastMonthActivityData);
                var fourthLastMonthDataset = context.aggregateDataForTrendReport('communityX', fourthLastMonthActivityData);
                var fifthLastMonthDataset = context.aggregateDataForTrendReport('communityX', fifthLastMonthActivityData);
                var sixthLastMonthDataset = context.aggregateDataForTrendReport('communityX', sixthLastMonthActivityData);
                var aggregateDataset = context.aggregateDataForTrendReport('communityX', JSON.parse(JSON.stringify(activityDataColl.models)));

                var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

                // show registered members at end of each month falling in duration of this report
                var totalRegisteredMembers = {male: 0, female: 0};
                context.getRegisteredMembersCount(function(param1, param2) {
                    totalRegisteredMembers['male'] = param1;
                    totalRegisteredMembers['female'] = param2;
                });
                
                var registeredMembersTillNow = {male: totalRegisteredMembers['male'], female: totalRegisteredMembers['female'], total: 0};
                var registeredMembersTillSecondLastMonthEnd = {male: totalRegisteredMembers['male'] - lastMonthDataset.New_Signups['male'],
                    female: totalRegisteredMembers['female'] - lastMonthDataset.New_Signups['female'], total: 0};
                var registeredMembersTillThirdLastMonthEnd = {male: registeredMembersTillSecondLastMonthEnd['male'] - secondLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillSecondLastMonthEnd['female'] - secondLastMonthDataset.New_Signups['female'], total: 0};
                var registeredMembersTillFourthLastMonthEnd = {male: registeredMembersTillThirdLastMonthEnd['male'] - thirdLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillThirdLastMonthEnd['female'] - thirdLastMonthDataset.New_Signups['female'], total: 0};
                var registeredMembersTillFifthLastMonthEnd = {male: registeredMembersTillFourthLastMonthEnd['male'] - fourthLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillFourthLastMonthEnd['female'] - fourthLastMonthDataset.New_Signups['female'], total: 0};
                var registeredMembersTillSixthLastMonthEnd = {male: registeredMembersTillFifthLastMonthEnd['male'] - fifthLastMonthDataset.New_Signups['male'],
                    female: registeredMembersTillFifthLastMonthEnd['female'] - fifthLastMonthDataset.New_Signups['female'], total: 0};

                registeredMembersTillNow['total'] = registeredMembersTillNow['male'] + registeredMembersTillNow['female'];
                registeredMembersTillSecondLastMonthEnd['total'] = registeredMembersTillSecondLastMonthEnd['male'] + registeredMembersTillSecondLastMonthEnd['female'];
                registeredMembersTillThirdLastMonthEnd['total'] = registeredMembersTillThirdLastMonthEnd['male'] + registeredMembersTillThirdLastMonthEnd['female'];
                registeredMembersTillFourthLastMonthEnd['total'] = registeredMembersTillFourthLastMonthEnd['male'] + registeredMembersTillFourthLastMonthEnd['female'];
                registeredMembersTillFifthLastMonthEnd['total'] = registeredMembersTillFifthLastMonthEnd['male'] + registeredMembersTillFifthLastMonthEnd['female'];
                registeredMembersTillSixthLastMonthEnd['total'] = registeredMembersTillSixthLastMonthEnd['male'] + registeredMembersTillSixthLastMonthEnd['female'];

                var trendActivityReportView = new App.Views.TrendActivityReport();
                trendActivityReportView.data = aggregateDataset;
                trendActivityReportView.startDate = activityDataColl.startkey;
                trendActivityReportView.endDate = activityDataColl.endkey;
                trendActivityReportView.CommunityName = communityName;
                trendActivityReportView.render();
                App.$el.children('.body').html(trendActivityReportView.el);

                $('#trend-report-div-new-memberships').highcharts({
                    chart: {
                        type: 'column',
                        borderColor: '#999999',
                        borderWidth: 2,
                        borderRadius: 10
                    },
                    title: {
                        text: 'Cumulative Registered Members'
                    },
                    xAxis: {
                        categories: [
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
                            text: "Members Count"
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
                        name: 'Males',
                        data: [
                            registeredMembersTillSixthLastMonthEnd['male'],
                            registeredMembersTillFifthLastMonthEnd['male'],
                            registeredMembersTillFourthLastMonthEnd['male'],
                            registeredMembersTillThirdLastMonthEnd['male'],
                            registeredMembersTillSecondLastMonthEnd['male'],
                            totalRegisteredMembers['male']]
                    }, {
                        name: 'Females',
                        data: [
                            registeredMembersTillSixthLastMonthEnd['female'],
                            registeredMembersTillFifthLastMonthEnd['female'],
                            registeredMembersTillFourthLastMonthEnd['female'],
                            registeredMembersTillThirdLastMonthEnd['female'],
                            registeredMembersTillSecondLastMonthEnd['female'],
                            totalRegisteredMembers['female']]
                    }, {
                        name: 'Total',
                        data: [
                            registeredMembersTillSixthLastMonthEnd['total'],
                            registeredMembersTillFifthLastMonthEnd['total'],
                            registeredMembersTillFourthLastMonthEnd['total'],
                            registeredMembersTillThirdLastMonthEnd['total'],
                            registeredMembersTillSecondLastMonthEnd['total'],
                            registeredMembersTillNow['total']]
                    }]
                });

                $('#trend-report-div-visits').highcharts({
                    chart: {
                        type: 'column',
                        borderColor: '#999999',
                        borderWidth: 2,
                        borderRadius: 10
                    },
                    title: {
                        text: 'Member Visits'
                    },
                    xAxis: {
                        categories: [
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
                            text: "Visits Count"
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
                        name: 'Males',
                        data: [
                            sixthLastMonthDataset.Visits['male'],
                            fifthLastMonthDataset.Visits['male'],
                            fourthLastMonthDataset.Visits['male'],
                            thirdLastMonthDataset.Visits['male'],
                            secondLastMonthDataset.Visits['male'],
                            lastMonthDataset.Visits['male']]
                    }, {
                        name: 'Females',
                        data: [
                            sixthLastMonthDataset.Visits['female'],
                            fifthLastMonthDataset.Visits['female'],
                            fourthLastMonthDataset.Visits['female'],
                            thirdLastMonthDataset.Visits['female'],
                            secondLastMonthDataset.Visits['female'],
                            lastMonthDataset.Visits['female']]
                    }, {
                        name: 'Total',
                        data: [
                                sixthLastMonthDataset.Visits['male'] + sixthLastMonthDataset.Visits['female'],
                                fifthLastMonthDataset.Visits['male'] + fifthLastMonthDataset.Visits['female'],
                                fourthLastMonthDataset.Visits['male'] + fourthLastMonthDataset.Visits['female'],
                                thirdLastMonthDataset.Visits['male'] + thirdLastMonthDataset.Visits['female'],
                                secondLastMonthDataset.Visits['male'] + secondLastMonthDataset.Visits['female'],
                                lastMonthDataset.Visits['male'] + lastMonthDataset.Visits['female']]
                    }]
                });

            });
        }
        ,
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
            $('div.navbar-collapse').html(na.el)
                // App.badge()
        },
        checkLoggedIn: function() {
            if (!$.cookie('Member._id')) {

                if ($.url().attr('fragment') != 'login' && $.url().attr('fragment') != '' && $.url().attr('fragment') != 'landingPage' && $.url().attr('fragment') != 'becomemember') {
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
        addCourses: function(publicationId) {
            var seachForm = new App.Views.courseSeach()
            seachForm.publicationId=publicationId
            seachForm.render()  
            App.$el.children('.body').html(seachForm.el)

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

            var Communities = new App.Collections.Community({
                limit: 3
            })
            Communities.fetch({
                async: false
            })
            console.log(Communities)
            Communities.each(function(m) {
                $('#communities tbody').append('<tr class="success"><td>' + m.toJSON().Name + '</td></tr>');
            })
            $('#communities').append('<tr ><td><a class="btn btn-default" href="#listCommunity" id="clickmore">Click for more</a></td></tr>');

            var Publications = new App.Collections.Publication()
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
            $('#publications').append('<tr ><td><a class="btn btn-default" href="#publication" id="clickmore">Click for more</a></td></tr>');


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

            // Set up
            var model = new App.Models[className]()
            var modelForm = new App.Views['CommunityForm']({
                model: model
            })


            App.$el.children('.body').html('')
                // Bind form to the DOM 


            App.$el.children('.body').append(modelForm.el)

            //	.append($button) 
            // modelForm.render()
            // Bind form events for when Group is ready

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
        ListCommunity: function() {
            App.startActivityIndicator()
            var Communities = new App.Collections.Community()
            Communities.fetch({
                success: function() {
                    CommunityTable = new App.Views.CommunitiesTable({
                        collection: Communities
                    })
                    CommunityTable.render()
                    var listCommunity = "<h3> Communities  |  <a  class='btn btn-success' id='addComm' href='#addCommunity'>Add Community</a>  </h3>"

                    listCommunity += "<div id='list-of-Communities'></div>"

                    App.$el.children('.body').html(listCommunity)
                    $('#list-of-Communities', App.$el).append(CommunityTable.el)

                }
            })

            App.stopActivityIndicator()

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
            var reports = new App.Collections.Reports()
            reports.fetch({
                async: false
            })
            var resourcesTableView = new App.Views.ReportsTable({
                collection: reports
            })
            resourcesTableView.isManager = roles.indexOf("Manager")
            resourcesTableView.render()
            App.$el.children('.body').html('')
            if (roles.indexOf("Manager") > -1) {
                App.$el.children('.body').append('<p><a class="btn btn-success" href="#reports/add">Add a new Report</a>' +
                '<a style="margin-left:20px" class="btn btn-success" href="#trendreport">Trend Activity Report</a></p>')
            }
            var temp = $.url().attr("host").split(".")
            temp = temp[0].substring(3)
            if (temp.length == 0) {
                temp = temp + "Nation"
            }
            App.$el.children('.body').append('<h4><span style="color:gray;">' + temp + '</span> | Reports</h4>')
            App.$el.children('.body').append(resourcesTableView.el)
            App.stopActivityIndicator()

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
        },
        Publication: function() {
            App.startActivityIndicator()
            var publicationCollection = new App.Collections.Publication()
            publicationCollection.fetch({
                async: false
            })
            var publication = new App.Views.Publication()
            publication.render()
            App.$el.children('.body').html(publication.el)
            var publicationtable = new App.Views.PublicationTable({
                collection: publicationCollection
            })
            publicationtable.render()
            App.$el.children('.body').append(publicationtable.el)

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
                            
                App.$el.children('.body').html('<div style="margin-top:10px"><h6 style="float:left;">Issue No.' + publicationObject.get('IssueNo') + '</h6> <a class="btn btn-success" style="margin-left:20px" href="#courses/'+publicationId+'">Add Course</a> <a class="btn btn-success" href = "../MyApp/index.html#search-bell/' + publicationId + '" style="float:left;margin-left:20px;margin-bottom:10px;">Add Resource</a><button class="btn btn-info" style="float:left;margin-left:20px" onclick=SelectCommunity("' + publicationId + '")>Send Publication</button></div>')
                
                var resIdes=''
                 _.each(resources, function(item) {
                    resIdes +='"' + item + '",'
                 })
                 if(resIdes!='')
                  resIdes = resIdes.substring(0, resIdes.length - 1);
                  
            var resourcesColl = new App.Collections.Resources()
                resourcesColl.keys= encodeURI(resIdes)
                resourcesColl.fetch({async:false });
                var publicationresTable = new App.Views.PublicationResourceTable({
                    collection: resourcesColl
                })
                publicationresTable.Id = publicationId
                publicationresTable.render()
                App.$el.children('.body').append(publicationresTable.el)
                
                 var coursesIdes=''
                 _.each(courses, function(item) {
                    coursesIdes +='"' + item['courseID'] + '",'
                 })
                 if(coursesIdes!='')
                  coursesIdes = coursesIdes.substring(0, coursesIdes.length - 1);
                  
           var coursesColl = new App.Collections.Courses()
                coursesColl.keys= encodeURI(coursesIdes)
                coursesColl.fetch({
                 async:false
                });
                var publicationcourseTable = new App.Views.PublicationCoursesTable({
                    collection: coursesColl
                })
                publicationcourseTable.Id = publicationId
                publicationcourseTable.render()
                App.$el.children('.body').append(publicationcourseTable.el)

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
            $('.bbf-form .field-Date input').attr("disabled", true)
            if (!publication.id) {
                $('.bbf-form .field-IssueNo input').val('')
            }
            var currentDate = new Date();
            $('.bbf-form .field-Date input').datepicker({
                todayHighlight: true
            });
            $('.bbf-form .field-Date input', this.el).datepicker("setDate", currentDate);
            $('.bbf-form .field-Date input').datepicker({
                todayHighlight: true
            });




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
                    $('#comselect').append("<option value='" + log.get('Name') + "'>" + log.get('Name') + "</option>")
                })

        },
        SyncDbSelect: function() {
            $('#invitationdiv').fadeIn(1000)
            var inviteForm = new App.Views.listSyncDbView()

            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)
        }
    }))

})