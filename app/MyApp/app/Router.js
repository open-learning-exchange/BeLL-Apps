$(function() {

    App.Router = new(Backbone.Router.extend({


        routes: {
            'admin/add':'AdminForm',
            'updatewelcomevideo': 'addOrUpdateWelcomeVideoDoc',
            '': 'MemberLogin',
            'dashboard': 'Dashboard',
            'login': 'MemberLogin',
            'logout': 'MemberLogout',
            'member/add': 'MemberForm',
            'member/edit/:mid': 'MemberForm',
            'member/view/:mid': 'MemberForm',
            'resources(/community)(/byownership)': 'Resources',
            'resources/pending': 'pendingResources',
            'resource/add': 'ResourceForm',
            'resource/edit/:resourceId': 'ResourceForm',
            'resource/detail/:rsrcid/:shelfid/:revid': 'Resource_Detail',
            'resource/feedback/:resourceId': 'ResourceFeedback',
            'resource/feedback/add/:resourceId/:title': 'FeedbackForm',
            'resource/search': 'bellResourceSearch',
            'search-bell/:levelId/:rId': 'SearchBell',
            'assign-to-level': 'AssignResourcetoLevel',
            'courses': 'Courses',
            'course/manage/:courseId': 'ManageCourse',
            'course/details/:courseId/:courseName': 'courseDetails',
            'usercourse/details/:courseId/:courseName': 'UserCourseDetails',
            'course/report/:courseId/:courseName': 'CourseReport',
            'course/assignments/week-of/:courseId/:weekOf': 'CourseWeekOfAssignments',
            'course/assignments/:courseId': 'CourseAssignments',
            'course/add': 'CourseForm',
            'CourseInfo/:courseId': 'CourseInfo',
            'course/resign/:courseId': 'ResignCourse',
            'course/members/:courseId': 'CourseMembers',
            'course/answerreview/:memberid/:stepid/:attempts': 'answerReview',
            'level/add/:courseId/:levelId/:totalLevels': 'AddLevel',
            'level/view/:levelId/:rid': 'ViewLevel',
            'savedesc/:lid': 'saveDescprition',
            'create-test/:lid/:rid/:title': 'CreateTest',
            'collection': 'Collection',
            'listCollection/:collectionId': 'ListCollection',
            'listCollection/:collectionId/:collectionName': 'ListCollection',
            'meetups': 'ListMeetups',
            'meetup/add': 'Meetup',
            'meetup/delete/:MeetupId': 'deleteMeetUp',
            'usermeetup/detail/:meetupId/:title': 'Meetup_Detail',
            'meetup/details/:meetupId/:title': 'usermeetupDetails',
            'meetup/manage/:meetUpId': 'Meetup',
            'configuration/add': 'Configure',
            'search-bell/:publicationId': 'SearchPresources',
            'members': 'Members',
            'reports': 'Reports',
            'trendreport': 'trendReport',
            // added to new page   'reports/sync' : 'syncReports',
            'reports/edit/:resportId': 'ReportForm',
            'reports/add': 'ReportForm',
            'mail': 'email',

            'newsfeed': 'NewsFeed',
            'badges': 'Badges',
            'badgesDetails/:cid':'badgesDetails',
            'credits':'Credits',
            'creditsDetails/:cid(/:memberId)':'creditsDetails',
            'courses/barchart': 'CoursesBarChart',
            'calendar': 'CalendarFunction',
            'addEvent': 'addEvent',
            'calendar/event/:eid': 'calendaar',
            'calendar-event/edit/:eid': 'EditEvent',
            'siteFeedback': 'viewAllFeedback',
            'myRequests': 'myRequests',
            'AllRequests': 'AllRequests',
            'replicateResources': 'Replicate',
            'savingPochDB': 'PochDB',
            'deletePouchDB': 'deletePouchDB',
            'course/invitations/add': 'addCourseInvi',
            'compile': 'CompileManifest',
            'dbInfo': 'dbinfo',
            'weeklyreports': 'WeeklyReports',
            'removecache': 'UpdateManifest',
            'logreports': 'LogQuery',
            // Not required 'syncLog':'syncLogActivitiy',
            'reportsActivity': 'LogActivity',
            'setbit': 'setNeedOptimizedBit',
            'CompileAppManifest': 'CompileAppManifest',
            'communityManage': 'communityManage',
            'publications/:community': 'Publications',
            'surveys/:community': 'Surveys',
            'openSurvey/:surveyId/:isSubmitted/:memberId': 'OpenSurvey',
            'memberSurveys': 'SurveysForMembers',
            'configurationsForm': 'configurationsForm',
            'checksum': 'checkSum',
            'listLearnersCredits/:cid': 'showLearnersListForCredits'
        },
        addOrUpdateWelcomeVideoDoc: function() {
            // fetch existing welcome video doc if there is any
            var welcomeVideoResources = new App.Collections.Resources();
            welcomeVideoResources.setUrl(App.Server + '/resources/_design/bell/_view/welcomeVideo?include_docs=true');
            welcomeVideoResources.fetch({
                success: function() {},
                error: function() {
                    alert("router:: addOrUpdateWelcomeVideoDoc:: "+App.languageDict.attributes.Error_Welcome_Resource);
                },
                async: false
            });
            var welcomeVidResource;
            if (welcomeVideoResources.length > 0) {
                welcomeVidResource = welcomeVideoResources.models[0];
            }
            var resource = (welcomeVidResource) ? welcomeVidResource : new App.Models.Resource();
            resource.on('processed', function() {
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
            });
            var resourceFormView = new App.Views.ResourceForm({
                model: resource
            });

            resourceFormView.renderAddOrUploadWelcomeVideoForm();
            App.$el.children('.body').html(resourceFormView.el);
            $('.field-resourceType').hide();
            $('.bbf-form .field-openWith label').html(App.languageDict.get('Open'));
            var openWithArray=App.languageDict.get('openWithList');
            for(var i=0;i<openWithArray.length;i++)
            {

                $('.field-openWith').find('.bbf-editor').find('select').find('option').eq(i).html(openWithArray[i]);

            }
            $('.bbf-form .field-resourceFor label').html(App.languageDict.get('resource_for'));
            var resourceForArray=App.languageDict.get('resourceForList');
            for(var i=0;i<resourceForArray.length;i++)
            {

                $('.field-resourceFor').find('.bbf-editor').find('select').find('option').eq(i).html(resourceForArray[i]);

            }
            $('.bbf-form .field-addedBy label').html(App.languageDict.get('added_by'));
            $('.bbf-form .field-uploadDate label').html(App.languageDict.get('upload_Date'));

            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },
        Publications: function(publicationIdes) {
            var PublicationsView = new App.Views.PublicationTable();
            PublicationsView.render();
            App.$el.children('.body').html('<div id="requestsTable"></div>');
            $('#requestsTable').append('<h3>'+App.languageDict.get('Publications')+'</h3>');
            $('#requestsTable').append(PublicationsView.el);
        },

        Surveys: function() {
            var SurveysView = new App.Views.SurveyTable();
            SurveysView.render();
            App.$el.children('.body').html('<div id="surveyTable"></div>');
            $('#surveyTable').append('<h3>' + App.languageDict.get('Surveys') + '</h3>');
            $('#surveyTable').append(SurveysView.el);
        },

        OpenSurvey: function(surveyId, isSubmitted, memberId) {
            var surveyModel = new App.Models.Survey({
                _id: surveyId
            });
            surveyModel.fetch({
                async: false
            });
            App.$el.children('.body').html('<div id="surveyBody"></div>');
            $('#surveyBody').append('<div style="margin-top:10px"><h6>' + surveyModel.get('SurveyTitle') + '</h6></div>');
            if(isSubmitted == "false") {
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
                var sortedModels = sortQuestions(surQuestions, questionsColl.models);
                questionsColl.models = sortedModels;
                //////////////////////////////////////////////////
                var surQuestionsTable = new App.Views.SurveyQuestionTable({
                    collection: questionsColl
                })
                surQuestionsTable.Id = surveyId;
                surQuestionsTable.render();
                if(questionsColl.length > 0 && memberId == "null") {
                    $('#surveyBody').append('<p style="font-size: small; color: red">' + App.languageDict.get('Survey_Note') + '</p>');
                }
                $('#surveyBody').append(surQuestionsTable.el);
                if(questionsColl.length > 0 && memberId != "null") {
                    $('#surveyBody').append('<div style="margin-top:10px"><button class="btn btn-success submitSurveyBtn" onclick="submitSurvey(\'' + surveyId + '\')">' + App.languageDict.get('Submit') + '</button></div>');
                }
            } else {
                var surveyNo = surveyModel.get('SurveyNo');
                var surveyResModel;
                $.ajax({
                    url:'/surveyresponse/_design/bell/_view/surveyResBymemberId?_include_docs=true&key="' + memberId + '"',
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        var jsonRows = json.rows;
                        for(var i = 0 ; i < jsonRows.length ; i++) {
                            if(jsonRows[i].value.SurveyNo == surveyNo) {
                                surveyResModel = jsonRows[i].value;
                            }
                        }
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
                        var sortedModels = sortQuestions(surAnswers, answersColl.models);
                        answersColl.models = sortedModels;
                        //////////////////////////////////////////////////
                        var surAnswersTable = new App.Views.SurveyAnswerTable({
                            collection: answersColl
                        })
                        surAnswersTable.Id = surveyId;
                        surAnswersTable.render();
                        $('#surveyBody').append(surAnswersTable.el);
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right") {
                $('#surveyBody').addClass('addResource');
                $('#surveyTable').addClass('addResource');
            }
            else
            {
                $('#surveyBody').removeClass('addResource');
                $('#surveyTable').removeClass('addResource');
            }
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        SurveysForMembers: function() {
            var SurveysView = new App.Views.SurveyTableForMembers();
            SurveysView.render();
            App.$el.children('.body').html('<div id="surveyTable"></div>');
            $('#surveyTable').append('<h3>' + App.languageDict.get('Surveys') + '</h3>');
            $('#surveyTable').append(SurveysView.el);
        },

        configurationsForm: function () {
            var commConfigModel;
            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            if(configCollection.length > 0) {
                commConfigModel = configCollection.first();
            } else {
                commConfigModel = new App.Models.Configuration();
            }
            var commConfigForm = new App.Views.CommunityConfigurationsForm({
                model: commConfigModel
            })
            commConfigForm.render();
            App.$el.children('.body').html(commConfigForm.el);
            if(App.languageDict.get('directionOfLang').toLowerCase()=='right')
            {
                $('.addNation-form').css('direction','rtl');
            }
            else{
                $('.addNation-form').css('direction','ltr');
            }
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'))
        },

        communityManage: function() {
            var manageCommunity = new App.Views.ManageCommunity();
            App.$el.children('.body').html('<div id="configTable"></div>');
            manageCommunity.render()
            $('#configTable').append(manageCommunity.el);
            $.ajax({
                url: 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                type: 'GET',
                dataType: 'jsonp',
                async: false,
                success: function (json) {
                	$('#syncStatus').closest('div').show();
                },
                error: function (status) {
                	$('#syncStatus').closest('div').hide();
                }
            });
            //  manageCommunity.updateDropDownValue();
        },
        addCourseInvi: function() {

            var test = new App.Models.CourseInvitation()
            test.set('courseId', 'test')
            test.set('userId', 'test')
            test.save(null, {
                success: function(error, response) {
                    alert(App.languageDict.attributes.Success_Msg)
                }

            })

            var collection = new App.Collections.CourseInvitations()
            collection.courseId = 'test'
            collection.fetch({
                async: false
            }, {
                success: function(res) {
                }
            })

        },
        initialize: function() {

            this.bind("all", this.startUpStuff)
            this.bind("all", this.checkLoggedIn)
            this.bind("all", this.renderNav)
            //this.bind("all",this.checkForUpdates)
        },
        eReader: function() {
            // alert('match with ereader')
            this.underConstruction()
        },
        Badges: function() {
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'))
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict = languageDictValue;
            //Check if the user who has logged in is a Leader or a Learner in any course.
            var stepsStatuses=[];
            var courses = new App.Collections.Courses()
            var MemberCourseProgress = new App.Collections.membercourseprogresses();
            var creditsView = new App.Views.BadgesMainPage();
            var learnerCourses=[];
            App.$el.children('.body').html('<div id="creditsMainTable"></div>');
            $('#creditsMainTable').append('<h3>' + 'Course Credits' + '</h3>');
            creditsView.addHeading();
            courses.fetch({
                success: function (courseDocs) {
                    if(courseDocs.length>0){
                        var isLearner=false;
                        var isCreditable=true;
                        for(var i=0;i<courseDocs.length;i++) {
                            var doc=courseDocs.models[i];
                            if(doc.get('members')!=undefined && doc.get('courseLeader')!=undefined && doc.get('members').indexOf($.cookie('Member._id'))>-1 && doc.get('courseLeader').indexOf($.cookie('Member._id'))==-1){
                                isLearner=true;
                                //---------------------------------------
                                MemberCourseProgress.courseId = doc.get('_id');
                                MemberCourseProgress.memberId = $.cookie('Member._id');
                                MemberCourseProgress.fetch({
                                    success: function (progressDoc) {
                                        stepsStatuses=progressDoc.models[0].get('stepsStatus');

                                        for(var m=0;m<stepsStatuses.length;m++)
                                        {
                                            if(stepsStatuses[m].length==2)
                                            {
                                                if(parseInt(stepsStatuses[m][0])<= 2 && parseInt(stepsStatuses[m][1])< 1 ){
                                                    isCreditable=false;
                                                }

                                            }
                                            else {
                                                if(stepsStatuses[m]=='0'){
                                                    isCreditable=false;
                                                }
                                            }
                                        }
                                        console.log(isCreditable);
                                        if(isCreditable){
                                            creditsView.courseId=doc.get('_id');
                                            creditsView.render();
                                        }
                                    },
                                    async:false
                                });
                            }

                        }
                        if(isLearner) {
                            $('#creditsMainTable').append(creditsView.el);
                        }
                        else{
                            alert('You are not enrolled as Learner in any course.');
                        }
                    }
                },
                async:false
            });
            applyCorrectStylingSheet(languageDictValue.get('directionOfLang'));
        },

        Credits: function() {
            //Check if the user who has logged in is a Leader or a Learner in any course.
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'))
            languageDictValue = getSpecificLanguage(lang);
            var creditsView = new App.Views.CreditsLeaderView();
            App.$el.children('.body').html('<div id="creditsMainTable"></div>');
            $('#creditsMainTable').append('<h3>' + 'Course Credits' + '</h3>');
            creditsView.addHeading();
            var count=0;
            var courses = new App.Collections.Courses();
            courses.fetch({
                async:false,
                success: function (courseDocs) {
                    if(courseDocs.length>0){
                        for(var i=0;i<courseDocs.length;i++) {
                            if(courseDocs.models[i].get('_id') != '_design/bell') {
                                var doc = courseDocs.models[i];
                                var learnerIds = getCountOfLearners(doc.get('_id'), true);
                                console.log(learnerIds);
                                if(learnerIds.length>0){
                                    creditsView.courseId=doc.get('_id');
                                    creditsView.learnerIds = learnerIds;
                                    creditsView.render();
                                }
                            }
                        }
                    }
                }
            });
            $('#creditsMainTable').append(creditsView.el);
            applyCorrectStylingSheet(languageDictValue.get('directionOfLang'));
        },
        badgesDetails: function(courseId){
            var lang = getLanguage($.cookie('Member._id'))
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict = languageDictValue;
            var courseProgress = new App.Collections.membercourseprogresses()
            courseProgress.memberId = $.cookie('Member._id');
            courseProgress.courseId = courseId;
            courseProgress.fetch({
                async:false
            });
            var resLength = [];
            var stepLength = [];
            for (var i =0; i< courseProgress.models[0].get('stepsResult').length ; i++){
                stepLength = courseProgress.models[0].get('stepsResult')[i];
                if($.isArray(stepLength)){
                    if(isNaN(parseInt(courseProgress.models[0].get('stepsResult')[i][0]))) {
                        resLength.push(0);
                    }
                    else {
                        resLength.push(parseInt(courseProgress.models[0].get('stepsResult')[i][0]))
                    }
                    if(isNaN(parseInt(courseProgress.models[0].get('stepsResult')[i][1]))) {
                        resLength.push(0);
                    }
                    else {
                        resLength.push(parseInt(courseProgress.models[0].get('stepsResult')[i][1]))
                    }
                }
                else {
                    if(isNaN(parseInt(courseProgress.models[0].get('stepsResult')[i]))) {
                        resLength.push(0);
                    }
                    else {
                        resLength.push(parseInt(courseProgress.models[0].get('stepsResult')[i]))
                    }
                }
            }
            var marks = 0; var totalMarks = 100*resLength.length ;
            for (var i =0; i< resLength.length ; i++){
                if(resLength[i] != NaN) {
                    marks = marks+resLength[i]
                }

            }

            var courseSteps = new App.Collections.coursesteps()
            courseSteps.courseId=courseId;
            courseSteps.fetch({
                async: false
            })
            var badgesTableView = new App.Views.BadgesTable({
                collection :courseSteps
            });
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var name = loggedIn.get('firstName')+ " " +loggedIn.get('lastName')
            badgesTableView.courseId=courseId;
            badgesTableView.memberId= $.cookie('Member._id');
            badgesTableView.render();

            App.$el.children('.body').html('<div id="badgesTable"></div>');
            $('#badgesTable').append('<h3>' + name + '\'s Badges' + '</h3>');
            $('#badgesTable').append(badgesTableView.el);
            $('#badges-details').append('<tr><td>' + languageDictValue.get('Total')  + '</td><td></td><td></td><td>' + marks + "/" + totalMarks + '</td><td>' + marks + "%" + '</td><td></td></tr>');
            $('#badgesTable').append(' <hr   style= "border-width: 5px;">' );
            applyCorrectStylingSheet(languageDictValue.get('directionOfLang'));
        },

        creditsDetails:function(courseId, memberId) {
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'))
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict = languageDictValue;
            var that = this;
            var learnerCollection = this.getLearnersList(courseId);
            if(!memberId)
            {
                if(learnerCollection.length > 0)
                {
                    memberId = learnerCollection.models[0].get("_id");
                }
            }
            if(!memberId)
            {
                alert("No member in this course");
                window.history.go(-1);
            }
            else
            {
                var courseSteps = new App.Collections.coursesteps()
                courseSteps.courseId=courseId;
                courseSteps.fetch({
                    async: false
                })
                var creditsTableView = new App.Views.CreditsTable({
                    collection :courseSteps
                });
                creditsTableView.courseId=courseId;
                creditsTableView.memberId=memberId;
                creditsTableView.render();
                App.$el.children('.body').html('<div id="creditsTable"></div>');
                var select = $("<select id='learnerSelector' onchange='getName($(this).val())'>");
                var name, id;
                learnerCollection.each(
                    function(member) {
                        var learnerName;
                        if(member.get('firstName') ) {
                            name = member.get('firstName')+ " " +member.get('lastName')
                            id = member.get('_id')

                        }
                        if(name ){
                            select.append("<option value="+id +"/"+courseId+">" +name+"</option>");
                        }

                    });
                if(courseId && memberId){
                    select.val(memberId + '/' + courseId)
                }
                ///
                // select.append("<option value='memberId'>Sadia</option>");
                // select.append("<option value='memberId'>Saba</option>");
                // select.append("<option value='memberId'>Stefan</option>");

                //creditsTableView.memberId=id;
                // creditsTableView.render();


                App.$el.children('.body').html('<div id="creditsTable"></div>');
                var course = new App.Models.Course({
                    _id: courseId
                });
                course.fetch({
                    async:false
                });
                $('#creditsTable').append('<h3>' + ' Credits Details | '+ course.get('CourseTitle')+ '</h3>');
                $('#creditsTable').append(select);
                $('#creditsTable').append(creditsTableView.el);
            }
            applyCorrectStylingSheet(languageDictValue.get('directionOfLang'));
        },

        submitCredits: function(courseId , memberId) {
            var isValid = [];
            var readOnly = [];
            $("input[name='paperCredits']").each(function () {
                console.log ($(this).val().trim());
                if(!$(this).is('[readonly]')){
                    readOnly.push(false);
                    if ( $(this).val().trim() != '' && $(this).val().trim() != '0' && $(this).val().trim() != 0) {
                        isValid.push(true);
                    }
                    else{
                        isValid.push(false);
                    }
                }
                else {
                    readOnly.push(true)
                }
            });
            if (readOnly.length > 0 && readOnly.indexOf(false)== -1 ) {
                alert('Learner has not submitted any paper');
            }
            else if (isValid.length > 0 && isValid.indexOf(false)== -1 ) {
                $("input[name='paperCredits']").each(function () {
                    if ($(this).val().trim() != '' ) {
                        var idstep = $(this).attr('id');
                        var arr = idstep.split("/");
                       // alert("step id and percentage" + idstep)
                        var stepId =arr[0];
                        var percentage = parseInt(arr[1]);
                       // alert("stepId " + stepId);
                       // alert("passing percentage " + percentage);
                        console.log("stepId : " + stepId)
                        var paperMarks = $(this).val().trim();
                        console.log("paperMarks : " + paperMarks)
                      //  alert("paper marks : " + paperMarks )
                        var memberProgress = new App.Collections.membercourseprogresses()
                        memberProgress.memberId = memberId
                        memberProgress.courseId = courseId
                        memberProgress.fetch({
                            async: false,
                            success: function () {
                                memberProgress = memberProgress.first();
                                var memberStepIndex = memberProgress.get('stepsIds').indexOf(stepId);
                                var marks = memberProgress.attributes.stepsResult[memberStepIndex];
                                var intMarks = [];
                                if($.isArray(marks)){
                                    for (var i=0; i < marks.length ; i++){
                                        intMarks.push(parseInt(marks[i]));
                                    }
                                }
                                else{
                                        intMarks.push(parseInt(marks));
                                }
                               console.log("intMarks : " + intMarks)
                                if (intMarks.length > 1) {
                                   if(memberProgress.attributes.stepsResult[memberStepIndex][0] != paperMarks) {
                                       memberProgress.attributes.stepsResult[memberStepIndex][0] = paperMarks;
                                       if( paperMarks >= percentage  ) {
                                           if(memberProgress.attributes.stepsStatus[memberStepIndex][0] == "2") {
                                               if (memberProgress.attributes.pqAttempts != undefined) {
                                                   memberProgress.attributes.pqAttempts[memberStepIndex][0]++;
                                               }
                                           }
                                           memberProgress.attributes.stepsStatus[memberStepIndex][0] = '1';
                                       }
                                       else{
                                           if(memberProgress.attributes.stepsStatus[memberStepIndex][0] == "2") {
                                               memberProgress.attributes.stepsStatus[memberStepIndex][0] = '0';
                                               if(memberProgress.attributes.pqAttempts != undefined){
                                                   memberProgress.attributes.pqAttempts[memberStepIndex][0]++ ;
                                               }
                                           }
                                       }
                                   }
                                }
                                else {
                                    if(memberProgress.attributes.stepsResult[memberStepIndex] != paperMarks) {
                                        memberProgress.attributes.stepsResult[memberStepIndex] = paperMarks;
                                        if (paperMarks >= percentage) {
                                            if(memberProgress.attributes.stepsStatus[memberStepIndex][0] == "2") {
                                                if (memberProgress.attributes.pqAttempts != undefined) {
                                                    memberProgress.attributes.pqAttempts[memberStepIndex]++;
                                                }
                                            }
                                            memberProgress.attributes.stepsStatus[memberStepIndex] = '1';
                                        }
                                        else {
                                            if (memberProgress.attributes.stepsStatus[memberStepIndex] == "2") {
                                                memberProgress.attributes.stepsStatus[memberStepIndex] = '0';
                                                if (memberProgress.attributes.pqAttempts != undefined) {
                                                    memberProgress.attributes.pqAttempts[memberStepIndex]++;
                                                }
                                            }
                                        }
                                    }
                                }
                                memberProgress.save(null, {
                                    async: false,
                                    success: function (response) {
                                    },
                                    async: false,
                                });
                            }

                        })

                    }

                });
                alert('Paper credits have been submitted');
            } else {
                alert('Please enter marks against each paper');
               return false;
            }
            location.reload();
        },

        getLearnersList: function(courseId) {
            var learnerIds = getCountOfAllLearnersOrIds(courseId, true);
            var learnerModelIdes = ''
            _.each(learnerIds, function(item) {
                learnerModelIdes += '"' + item + '",';
            })
            if (learnerModelIdes != ''){
                learnerModelIdes = learnerModelIdes.substring(0, learnerModelIdes.length - 1);
            }
            var membersColl = new App.Collections.Members();
            membersColl.keys = encodeURI(learnerModelIdes)
            membersColl.fetch({
                async: false
            });
            return membersColl;
        },

        showLearnersListForCredits: function (courseId) {
            var course = new App.Models.Course({
                _id: courseId
            });
            course.fetch({
                async: false,
            });
            var learnerIds = getCountOfLearners(courseId, true);
            var learnerModelIdes = ''
            _.each(learnerIds, function(item) {
                learnerModelIdes += '"' + item + '",'
            })
            if (learnerModelIdes != ''){
                learnerModelIdes = learnerModelIdes.substring(0, learnerModelIdes.length - 1);
            }
            var membersColl = new App.Collections.Members();
            membersColl.keys = encodeURI(learnerModelIdes)
            membersColl.fetch({
                async: false
            });
            var courseLearnersTable = new App.Views.CourseLearnersList({
                collection: membersColl
            })
            courseLearnersTable.Id = courseId;
            courseLearnersTable.render();
            App.$el.children('.body').html('<div id="courseLearnersTable"></div>');
            $('#courseLearnersTable').append('<h3>' + course.get('CourseTitle') + '</h3>');
            $('#courseLearnersTable').append(courseLearnersTable.el);
        },

        underConstruction: function() {

            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'))
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict = languageDictValue;
            App.$el.children('.body').html('<div  id="underConstruction" style="margin:0 auto"><h4>'+languageDictValue.attributes.Functionality_Under_Construction+'</h4></div>')
            applyCorrectStylingSheet(languageDictValue.get('directionOfLang'));
        },

        startUpStuff: function() {
            if (App.idss.length == 0) {}
            $('div.takeQuizDiv').hide()
            $('#externalDiv').hide()
            $('#invitationdiv').hide()
            $('#debug').hide()
        },

        renderNav: function() {
            if ($.cookie('Member._id')) {
                var na = new App.Views.navBarView({
                    isLoggedIn: '1'
                })
            } else {
                var na = new App.Views.navBarView({
                    isLoggedIn: '0'
                })
            }
            $('div#nav .container').html(na.el);
            if($.url().attr('fragment') == 'admin/add'){
                $('#linkOnMyHome').css('pointer-events','none');
            }

        },

        checkLoggedIn: function() {
            if (!$.cookie('Member._id')) {
                if ($.url().attr('fragment') != 'login' && $.url().attr('fragment') != '' && $.url().attr('fragment') != 'member/add' && $.url().attr('fragment') != 'admin/add') {
                    Backbone.history.stop()
                    App.start()
                }
            } else {
                var expTime = $.cookie('Member.expTime')
                var d = new Date(Date.parse(expTime))
                var diff = Math.abs(new Date() - d)
                var expirationTime = 7200000
                if (diff < expirationTime) {
                    var date = new Date()
                    $.cookie('Member.expTime', date, {
                        path: "/apps/_design/bell"
                    })
                } else {
                    this.expireSession();
                    Backbone.history.stop();
                    App.start();
                }
            }
        },

        expireSession: function() {
            $.removeCookie('Member.login', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member._id', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member.roles', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member.expTime', {
                path: "/apps/_design/bell"
            });
            $.removeCookie('forcedUpdateProfile');
        },

        Configure: function() {
            var conModel = new App.Models.Configuration();
            var conForm = new App.Views.Configurations({
                model: conModel
            })
            conForm.render();
            App.$el.children('.body').html(conForm.el);
            for(var i=8;i<$('.bbf-form').find('ul li').length;i++)
            {
                $('.bbf-form').find('ul').find('li').eq(i).hide();
            }
        },

        MemberLogin: function() {
            // Prevent this Route from completing if Member is logged in.
            if ($.cookie('Member._id')) {
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
                return
            }
            var credentials = new App.Models.Credentials();
            var memberLoginForm = new App.Views.MemberLoginForm({
                model: credentials
            })
            memberLoginForm.once('success:login', function() {
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })
            })

            memberLoginForm.render();
            var languageDictValue=getSpecificLanguage($.cookie('languageFromCookie'));
            App.$el.children('.body').html('<h1 class="login-heading">'+languageDictValue.attributes.Member_Login+'</h1>');
            App.$el.children('.body').append(memberLoginForm.el);
            memberLoginForm.updateLabels(languageDictValue);
            var direction=languageDictValue.get('directionOfLang');
            if (direction.toLowerCase()==="right")
            {
                $('.field-login').find('label').addClass('labelsOnLogin');
                $('.field-password').find('label').addClass('labelsOnLogin');
            }
            App.surveyAlert = 1;
            applyCorrectStylingSheet(direction);
        },

        MemberLogout: function() {
            App.ShelfItems = null
            this.expireSession();
            Backbone.history.navigate('login', {
                trigger: true
            });
        },

        getRoles: function() {
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            return roles
        },

        getAllResourceIdsFromNation: function(callback) {
            var configuration = App.configuration
            var nationName = configuration.get("nationName")
            var nationURL = configuration.get("nationUrl")
            var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + '/resources/_all_docs?include_docs=true';
            var resourceIds = [];
            $.ajax({
                url: nationConfigURL,
                type: 'GET',
                dataType: "jsonp",
                success: function (resourcesFromNation) {
                    for(var i = 0; i < resourcesFromNation.total_rows; i++)
                    {
                        if(resourcesFromNation.rows[i].id != "_design/bell")
                        {
                            resourceIds.push(resourcesFromNation.rows[i].id);
                        }
                    }
                    callback(resourceIds);
                },
                error: function (status) {
                    console.log(status);
                    callback(resourceIds);
                }
            });
        },

        getNationVersion: function (dashboard) {
            var that = this;
            var configuration = App.configuration
            var nationName = configuration.get("nationName")
            var nationURL = configuration.get("nationUrl")
            var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + '/configurations/_all_docs?include_docs=true';
            nName = configuration.get('nationName')
            pass = App.password
            nUrl = configuration.get('nationUrl')
            currentBellName = configuration.get('name')
            var DbUrl = 'http://' + nName + ':' + pass + '@' + nUrl + '/publicationdistribution/_design/bell/_view/getPublications?include_docs=true&key=["' + currentBellName + '",' + false + ']'
            var nationConfig;
            var newPublicationsCount = 0;
            var newSurveysCount = 0;
            var roles = App.member.get('roles');
            $.ajax({
                url: nationConfigURL,
                type: 'GET',
                dataType: "jsonp",
                success: function (json) {
                    if (json.rows[0]) {
                        nationConfig = json.rows[0].doc;
                        nation_version = nationConfig.version;
                        //********************************************************************************************************************************
                        $.ajax({
                            url: DbUrl,
                            type: 'GET',
                            dataType: 'jsonp',
                            async: false,
                            success: function (json) {
                                var publicationDistribDocsFromNation = [],
                                    tempKeys = [];
                                _.each(json.rows, function (row) {
                                    publicationDistribDocsFromNation.push(row.doc);
                                    tempKeys.push(row.doc.publicationId);
                                });
                                // fetch all publications from local/community server to see how many of the publications from nation are new ones
                                var publicationCollection = new App.Collections.Publication();
                                var tempUrl = App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true';
                                publicationCollection.setUrl(tempUrl);
                                publicationCollection.fetch({
                                    success: function () {
                                        var alreadySyncedPublications = publicationCollection.models;
                                        for (var i in publicationDistribDocsFromNation) {
                                            // if this publication doc exists in the list of docs fetched from nation then ignore it from new publications
                                            // count
                                            var index = alreadySyncedPublications.map(function (element) {
                                                return element.get('_id');
                                            }).indexOf(publicationDistribDocsFromNation[i].publicationId);
                                            if (index > -1) {//code here
                                                var pubId = publicationDistribDocsFromNation[i].publicationId;
                                                var nationUrl = 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') +
                                                    '/publications/' + pubId;
                                                $.ajax({
                                                    url: nationUrl,
                                                    type: 'GET',
                                                    dataType: 'jsonp',
                                                    success: function (publicationDoc) {
                                                        if(publicationDoc.downloadedByCommunities && publicationDoc.downloadedByCommunities != undefined) {
                                                            if(publicationDoc.downloadedByCommunities.indexOf(App.configuration.get('name')) == -1) {
                                                                publicationDoc.downloadedByCommunities.push(App.configuration.get('name'));
                                                                var courseModel = new App.Models.Publication({
                                                                    _id: publicationDoc._id
                                                                })
                                                                courseModel.fetch({
                                                                    success: function (model) {
                                                                        model.destroy();
                                                                        $.couch.db("temppublication").create({
                                                                            success: function (data) {
                                                                                $.couch.db("temppublication").saveDoc(publicationDoc, {
                                                                                    success: function (response) {
                                                                                        $.couch.replicate("temppublication", "publications");
                                                                                        $.ajax({
                                                                                            headers: {
                                                                                                'Accept': 'application/json',
                                                                                                'Content-Type': 'application/json; charset=utf-8'
                                                                                            },
                                                                                            type: 'POST',
                                                                                            url: '/_replicate',
                                                                                            dataType: 'json',
                                                                                            data: JSON.stringify({
                                                                                                "source": "temppublication",
                                                                                                "target": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/publications',
                                                                                                "doc_ids": [publicationDoc._id]
                                                                                            }),
                                                                                            success: function (response) {
                                                                                                $.couch.db("temppublication").drop({
                                                                                                    success: function(data) {
                                                                                                    },
                                                                                                    error: function(status) {
                                                                                                        console.log(status);
                                                                                                    }
                                                                                                });
                                                                                            },
                                                                                            error: function (res) {
                                                                                                console.log(res);
                                                                                            }
                                                                                        });
                                                                                    },
                                                                                    error: function (jqXHR, textStatus, errorThrown) {
                                                                                        console.log(errorThrown);
                                                                                        $.couch.db("temppublication").drop({
                                                                                            success: function(data) {
                                                                                            },
                                                                                            error: function(status) {
                                                                                                console.log(status);
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });

                                                                    },
                                                                    async: false
                                                                });
                                                            }
                                                        }

                                                    },
                                                    error: function(jqXHR, status, errorThrown){
                                                        console.log(status);
                                                    }
                                                });
                                                // don't increment newPublicationsCount cuz this publicationId already exists in the already synced publications at
                                                // local server
                                            } else {
                                                newPublicationsCount++;
                                            }
                                        }
                                        ////////////////////////////////////////////////////
                                        $.ajax({
                                            url: 'http://' + nationName + ':oleoleole@' + nationURL + '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                                            type: 'GET',
                                            dataType: 'jsonp',
                                            async: false,
                                            success: function (json) {
                                                $('#onlineButton').css({"background-color": "#35ac19"});
                                                $('#onlineButton').attr("title", App.languageDict.get("Nation_Visible"));
                                                var SurveyDocsFromNation = [];
                                                _.each(json.rows, function (row) {
                                                    if (row.value.submittedBy.indexOf(App.configuration.get('name')) == -1) {
                                                        SurveyDocsFromNation.push(row);
                                                    }
                                                });
                                                if (SurveyDocsFromNation != [] && SurveyDocsFromNation.length > 0) {
                                                    // fetch all surveys from local/community server to see how many of the surveys from nation are new ones
                                                    $.ajax({
                                                        url: '/survey/_design/bell/_view/surveyBySentToCommunities?_include_docs=true&key="' + App.configuration.get('name') + '"',
                                                        type: 'GET',
                                                        dataType: 'json',
                                                        async: false,
                                                        success: function (commSurdata) {
                                                            var SurveyDocsFromComm = [];
                                                            _.each(commSurdata.rows, function (row) {
                                                                SurveyDocsFromComm.push(row);
                                                            });
                                                            for (var j in SurveyDocsFromNation) {
                                                                // if this survey doc exists in the list of docs fetched from nation then ignore it from new surveys
                                                                // count
                                                                var surIndex;
                                                                if (SurveyDocsFromComm.length > 0) {
                                                                    surIndex = SurveyDocsFromComm.map(function (element) {
                                                                        return element.id;
                                                                    }).indexOf(SurveyDocsFromNation[j].id);
                                                                } else {
                                                                    surIndex = -1;
                                                                }
                                                                if (surIndex != undefined) {
                                                                    if (surIndex > -1) {
                                                                        // don't increment newSurveysCount cuz this surveyId already exists in the already synced surveys at
                                                                        // local server
                                                                    } else {
                                                                        newSurveysCount++;
                                                                    }
                                                                }
                                                            }
                                                            if (newPublicationsCount > 0 && ($.inArray('Manager', roles) != -1)) {
                                                                new_publications_count = newPublicationsCount;
                                                                if (newSurveysCount > 0) {
                                                                    new_surveys_count = newSurveysCount;
                                                                    dashboard.updateVariables(nation_version, new_publications_count, new_surveys_count);
                                                                    $("#newSurvey").click(function () {
                                                                        document.location.href = "#surveys/for-" + currentBellName;
                                                                    });
                                                                    $('#newSurvey').show();
                                                                } else {
                                                                    dashboard.updateVariables(nation_version, new_publications_count, 0);
                                                                }
                                                                $("#newPublication").click(function () {
                                                                    document.location.href = "#publications/for-" + currentBellName;
                                                                });
                                                                //  $('#newPublication').attr("onclick",document.location.href+"#publications/for-"+currentBellName);
                                                                $('#newPublication').show();
                                                            } else {
                                                                if (newSurveysCount > 0 && ($.inArray('Manager', roles) != -1)) {
                                                                    new_surveys_count = newSurveysCount;
                                                                    dashboard.updateVariables(nation_version, 0, new_surveys_count);
                                                                    $("#newSurvey").click(function () {
                                                                        document.location.href = "#surveys/for-" + currentBellName;
                                                                    });
                                                                    $('#newSurvey').show();
                                                                } else {
                                                                    dashboard.updateVariables(nation_version, 0, 0);
                                                                }
                                                            }
                                                        },
                                                        error: function (status) {
                                                            console.log(status);
                                                        }
                                                    });
                                                } else {
                                                    if (newPublicationsCount > 0 && ($.inArray('Manager', roles) != -1)) {
                                                        new_publications_count = newPublicationsCount;
                                                        dashboard.updateVariables(nation_version, new_publications_count, 0);
                                                        $("#newPublication").click(function () {
                                                            document.location.href = "#publications/for-" + currentBellName;
                                                        });
                                                        $('#newPublication').show();
                                                    }
                                                    else {
                                                        dashboard.updateVariables(nation_version, 0, 0);
                                                    }
                                                }
                                            },
                                            error: function (status) {
                                                $('#onlineButton').css({"background-color": "#ff0000"});
                                                $('#onlineButton').attr("title", App.languageDict.get("Nation_InVisible"));
                                                console.log(status);
                                            }
                                        });
                                     }
                                });
                            },
                            error: function (jqXHR, status, errorThrown) {
                                $('#onlineButton').css({"background-color": "#ff0000"});
                                $('#onlineButton').attr("title", App.languageDict.get("Nation_InVisible"));
                            }
                        });
                    }
                }
            });
        },
        isNationLive: function (callback) {
            var configuration = App.configuration
            $.ajax({
                url: 'http://' + configuration.get('nationName') + ':' + App.password + '@' + configuration.get('nationUrl') + '/_all_dbs',
                type: 'GET',
                dataType: "jsonp",
                timeout: 4000,
                success: function (json) {
                    nationVisible = true;
                    callback(true);
                },
                error: function (jqXHR, status, errorThrown) {
                    nationVisible = false;
                    callback(false);
                },
                timeout: 4000
            });
        },

        Dashboard: function() {
            if(App.configuration.get('type')=='nation'){
                getAllPendingRequests();
            }
            //At community side: Fetch request status from central db
            if(App.configuration.get('type')=='community' && App.Router.getRoles().indexOf('Manager') > -1 || App.Router.getRoles().indexOf('SuperManager') > -1) {
                getRequestStatus();
            }
            var that=this;
            {
                App.ShelfItems = {}
                $.ajax({
                    type: 'GET',
                    url: '/shelf/_design/bell/_view/DuplicateDetection?include_docs=true&key="' + $.cookie('Member._id') + '"',
                    dataType: 'json',
                    success: function(response) {
                        for (var i = 0; i < response.rows.length; i++) {
                            App.ShelfItems[response.rows[i].doc.resourceId] = [response.rows[i].doc.hidden + "+" + response.rows[i].doc.resourceTitle + "+" + response.rows[i].doc._id]
                        }
                    },
                    data: {},
                    async: false
                });
            }
            App.languageDict = getSpecificLanguage(getLanguage($.cookie('Member._id')));
            var dashboard = new App.Views.Dashboard()
            App.$el.children('.body').html(dashboard.el)
            dashboard.render();
            var wordsOfLibraryTable=new Array();
            wordsOfLibraryTable.push(App.languageDict.attributes.My_Library);
            wordsOfLibraryTable.push(App.languageDict.attributes.My_Courses_Progress);
            wordsOfLibraryTable.push(App.languageDict.attributes.My_Meetups);
            wordsOfLibraryTable.push(App.languageDict.attributes.My_Tutors);
            var classToAppend=new Array();
            classToAppend.push('shelf');
            classToAppend.push('badges');
            classToAppend.push('tuter');
            var directionOfLang=App.languageDict.get('directionOfLang');
            if(directionOfLang.toLowerCase()==="right")
            {
                $('#headerTableOnDashBoard').css('direction','rtl');
                $('#bottomButtonsOnDashboard').css('direction','rtl');
                for(var i= 0,j=0;i<4;i++)
                {
                    if(i==1){
                        $('#first' + i).addClass('stu-nav-option-empty');
                        $('#first' + i).removeClass('stu-nav-title');
                        $('#first' + i).empty();
                        $('#last' + i).removeClass('stu-nav-option-empty');
                        $('#last' + i).addClass('stu-nav-title');
                        var htmlToAppend='<a id="linkOnSecond" href="#courses/barchart"></a>';
                        $('#last' + i).append(htmlToAppend);
                        $('#linkOnSecond').html(wordsOfLibraryTable[1]);

                    }
                    else {
                        $('#first' + i).removeClass('stu-nav-title-'+classToAppend[j]);
                        $('#first' + i).removeClass('stu-nav-title');
                        $('#first' + i).addClass('stu-nav-option-empty');
                        $('#last' + i).addClass('stu-nav-title-'+classToAppend[j]);
                        $('#last' + i).addClass('stu-nav-title');
                        $('#last' + i).removeClass('stu-nav-option-empty');
                        $('#last' + i).html(wordsOfLibraryTable[i]);
                        j++;
                    }
                }
            }
            else {
                for(var i= 0,j=0;i<4;i++)
                {
                    if(i==1){
                        $('#first' + i).removeClass('stu-nav-option-empty');
                        $('#first' + i).addClass('stu-nav-title');
                        $('#first' + i).empty();
                        $('#last' + i).addClass('stu-nav-option-empty');
                        $('#last' + i).removeClass('stu-nav-title');
                        var htmlToAppend='<a id="linkOnSecond" href="#courses/barchart"></a>';
                        $('#first' + i).append(htmlToAppend);
                        $('#linkOnSecond').html(wordsOfLibraryTable[1]);
                    }
                    else{
                        $('#first'+i).removeClass('stu-nav-option-empty');
                        $('#first'+i).addClass('stu-nav-title-'+classToAppend[j]);
                        $('#first'+i).addClass('stu-nav-title');
                        $('#first'+i).html(wordsOfLibraryTable[i]);
                        $('#last'+i).removeClass('stu-nav-title-'+classToAppend[j]);
                        $('#last'+i).removeClass('stu-nav-title');
                        $('#last'+i).addClass('stu-nav-option-empty');
                        j++;
                    }
                }
            }
            dashboard.$el.length=0;
            that.getNationVersion(dashboard);
            $('#olelogo').remove();
            applyCorrectStylingSheet(directionOfLang);
        },

        MemberForm: function(memberId) {
            this.modelForm('Member', 'Member', memberId, 'login')
        },

        AdminForm: function(){
            var languageDictValue;
            var  clanguage;
            if($.cookie('languageFromCookie'))
            {
                clanguage= $.cookie('languageFromCookie');
            }
            else
            {
                clanguage = 'English'
                $.cookie('languageFromCookie',clanguage);
            }
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = languageDictValue.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);
            var context = this;
            var model = new App.Models.AdminMember();
            var modelForm = new App.Views.AdminForm({
                model: model
            })
            App.$el.children('.body').html('<div id="AddCourseMainDiv"></div>');
            $('#AddCourseMainDiv').append('<h3>'+App.languageDict.get('Become_an_administrator')+'</h3>')
            $('#AddCourseMainDiv').append(modelForm.el)
            // Bind form events for when Course is ready
            model.once('Model:ready', function() {
                modelForm.render();
                $('.form .field-firstName input').attr('maxlength', '25');
                $('.form .field-lastName input').attr('maxlength', '25');
                $('.form .field-middleNames input').attr('maxlength', '25');
                $('.form .field-login input').attr('maxlength', '25');
            });
            model.trigger('Model:ready')
            //Setting up the default error Message
            Backbone.Form.validators.errMessages.required=languageDictValue.attributes.Required_Text;
            $('.bbf-form .field-Gender .bbf-editor select').append($('<option>', {
                class:"placeHolderForSelect",
                selected: 'true',
                disabled:'true',
                value:"",
                text:languageDictValue.attributes.Gender
            }));
            $('.bbf-form .field-Gender .bbf-editor select').find('option').eq(2).css('display','none');
            $(".bbf-form .field-levels .bbf-editor select").append($('<option>', {
                class:"placeHolderForSelect",
                selected: 'true',
                disabled:'true',
                value:"",
                text:languageDictValue.attributes.School_Year
            }));
            $(".bbf-form .field-levels .bbf-editor select").find('option').eq(13).css('display','none')
            $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(0).append($('<option>', {
                class:"placeHolderForSelect",
                selected: 'true',
                disabled:'true',
                value:"",
                text:languageDictValue.attributes.Date_format
            }));
            $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(0).find('option').eq(31).css('display','none')
            $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(1).append($('<option>', {
                class:"placeHolderForSelect",
                selected: 'true',
                disabled:'true',
                value:"",
                text:languageDictValue.attributes.Month
            }));
            $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(1).find('option').eq(12).css('display','none')
            $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(2).append($('<option>', {
                class:"placeHolderForSelect",
                selected: 'true',
                disabled:'true',
                value:"",
                text:languageDictValue.attributes.Year_format
            }));
            $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(2).find('option').eq(101).css('display','none')
            //Modifying the labels as per MUI
            $('.bbf-form .field-firstName label').html(languageDictValue.attributes.First_Name);
            $('.bbf-form .field-lastName label').html(languageDictValue.attributes.Last_Name);
            $('.bbf-form .field-middleNames label').html(languageDictValue.attributes.Middle_Names);
            $('.bbf-form .field-login label').html(languageDictValue.attributes.Login);
            $('.bbf-form .field-password label').html(languageDictValue.attributes.Password);
            $('.bbf-form .field-phone label').html(languageDictValue.attributes.Phone);
            $('.bbf-form .field-email label').html(languageDictValue.attributes.Email);
            $('.bbf-form .field-language label').html(languageDictValue.attributes.language);
            $('.bbf-form .field-BirthDate label').html(languageDictValue.attributes.Birth_Date);
            $('.bbf-form .field-Gender label').html(languageDictValue.attributes.Gender)
            $('.bbf-form .field-levels label').html(languageDictValue.attributes.Levels)
            $('.bbf-form .field-community label').html(App.languageDict.attributes.Community)
            $('.bbf-form .field-region label').html(App.languageDict.attributes.Region)
            $('.bbf-form .field-nation label').html(App.languageDict.attributes.Nation)
            var invitationType=App.languageDict.get("inviteForm_levels");
            for(var i=0;i<invitationType.length;i++){
                $('.bbf-form .field-levels .bbf-editor select').find('option').eq(i).html(invitationType[i]);
            }
            $('.bbf-form .field-Gender .bbf-editor select').find('option').eq(0).html(App.languageDict.get('Male'))
            $('.bbf-form .field-Gender .bbf-editor select').find('option').eq(1).html(App.languageDict.get('Female'))
            for(var i=0;i<12;i++)
            {
                $('.field-BirthDate .bbf-editor .bbf-month').find('option').eq(i).html(lookup(App.languageDict, "Months." + $('.field-BirthDate .bbf-editor .bbf-month').find('option').eq(i).text().toString() ));
            }
            if (directionOfLang.toLowerCase() === "right") {
                $('#_attachments').css('margin-right','170px');
            }
            else {
                $('#_attachments').css('margin-left','170px');
            }
        },

        modelForm: function(className, label, modelId, reroute) { // 'Course', 'Course', courseId, 'courses'
            var url_page = $.url().data.attr.fragment;
            var url_split = url_page.split('/');
            var languageDictValue;
            var  clanguage;
            if(url_page=="member/add"){
                if($.cookie('Member._id'))
                {
                    clanguage = getLanguage($.cookie('Member._id'));
                }
                else if($.cookie('isChange')=="true" && $.cookie('Member._id')==null)
                {
                    clanguage= $.cookie('languageFromCookie');
                }
                else
                {
                    clanguage = App.configuration.get("currentLanguage");
                }
            }
            else {
                clanguage = getLanguage($.cookie('Member._id'));
            }
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = languageDictValue.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);
            var nameOfLabel="";
            var context = this;
            var model = new App.Models[className]()
            var modelForm = new App.Views[className + 'Form']({
                model: model
            })
            App.$el.children('.body').html('<div id="AddCourseMainDiv"></div>');
            // Bind form to the DOM
            if (modelId && url_split[1]=="view") {
                model.id = modelId
                model.fetch({
                    async: false
                })
                nameOfLabel=label;
                App.$el.children('.body').html('<div id="AddCourseMainDiv"></div>');
                $('#AddCourseMainDiv').append('<h3>'+languageDictValue.get(nameOfLabel) + ' | ' + model.get('firstName') + '  ' + model.get('lastName') + '</h3>')
            }
            else if (modelId) {
                model.id = modelId
                model.fetch({
                    async: false
                })
                nameOfLabel="Edit_"+label;
                App.$el.children('.body').html('<div id="AddCourseMainDiv"></div>');
                $('#AddCourseMainDiv').append('<h3>'+languageDictValue.get(nameOfLabel) + ' | ' + model.get('firstName') + '  ' + model.get('lastName') + '</h3>')


            } else {
                nameOfLabel="Add_"+label;
                $('#AddCourseMainDiv').append('<h3>'+languageDictValue.get(nameOfLabel)+'</h3>')
            }
            $('#AddCourseMainDiv').append(modelForm.el)
            // Bind form events for when Course is ready
            model.once('Model:ready', function() {
                // when the users submits the form, the course will be processed
                modelForm.on(className + 'Form:done', function() {
                    Backbone.history.navigate(reroute, {
                        trigger: true
                    })
                })
                // Set up the form
                modelForm.render();
                $('.bbf-form .field-courseLeader .bbf-editor select').attr('multiple','multiple');
                $('.form .field-startDate input').datepicker({
                    todayHighlight: true
                });
                $('.form .field-firstName input').attr('maxlength', '25');
                $('.form .field-lastName input').attr('maxlength', '25');
                $('.form .field-middleNames input').attr('maxlength', '25');
                $('.form .field-login input').attr('maxlength', '25');
                $('.form .field-endDate input').datepicker({
                    todayHighlight: true
                });
                $('.form .field-startTime input').timepicker({
                    'minTime': '8:00am',
                    'maxTime': '12:30am'
                });
                $('.form .field-endTime input').timepicker({
                    'minTime': '8:00am',
                    'maxTime': '12:30am'
                });
                $('.form .field-frequency input').click(function() {
                    if (this.value == 'Weekly') {
                        $('.form .field-Day').show()
                    } else {
                        $('.form .field-Day').hide()
                    }
                });
            })
            // Set up the model for the form
            if (modelId) {
                model.once('sync', function() {
                    model.trigger('Model:ready')
                })
                model.fetch({
                    async: false
                })
            } else {
                model.trigger('Model:ready')
            }
            //Setting up the default error Message
            Backbone.Form.validators.errMessages.required=languageDictValue.attributes.Required_Text;
            if(!modelId){
                //Setting up the default selected customized text
                $('.bbf-form .field-Gender .bbf-editor select').append($('<option>', {
                    class:"placeHolderForSelect",
                    selected: 'true',
                    disabled:'true',
                    value:"",
                    text:languageDictValue.attributes.Gender
                }));
                $('.bbf-form .field-Gender .bbf-editor select').find('option').eq(2).css('display','none');
                $(".bbf-form .field-levels .bbf-editor select").append($('<option>', {
                    class:"placeHolderForSelect",
                    selected: 'true',
                    disabled:'true',
                    value:"",
                    text:languageDictValue.attributes.School_Year
                }));
                $(".bbf-form .field-levels .bbf-editor select").find('option').eq(13).css('display','none')
                $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(0).append($('<option>', {
                    class:"placeHolderForSelect",
                    selected: 'true',
                    disabled:'true',
                    value:"",
                    text:languageDictValue.attributes.Date_format
                }));
                $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(0).find('option').eq(31).css('display','none')
                $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(1).append($('<option>', {
                    class:"placeHolderForSelect",
                    selected: 'true',
                    disabled:'true',
                    value:"",
                    text:languageDictValue.attributes.Month
                }));
                $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(1).find('option').eq(12).css('display','none')
                $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(2).append($('<option>', {
                    class:"placeHolderForSelect",
                    selected: 'true',
                    disabled:'true',
                    value:"",
                    text:languageDictValue.attributes.Year_format
                }));
                $(".bbf-form .field-BirthDate .bbf-editor .bbf-date select").eq(2).find('option').eq(101).css('display','none')   
            }
            //Modifying the labels as per MUI
            $('.bbf-form .field-firstName label').html(languageDictValue.attributes.First_Name);
            $('.bbf-form .field-lastName label').html(languageDictValue.attributes.Last_Name);
            $('.bbf-form .field-middleNames label').html(languageDictValue.attributes.Middle_Names);
            $('.bbf-form .field-login label').html(languageDictValue.attributes.Login);
            $('.bbf-form .field-password label').html(languageDictValue.attributes.Password);
            $('.bbf-form .field-phone label').html(languageDictValue.attributes.Phone);
            $('.bbf-form .field-email label').html(languageDictValue.attributes.Email);
            $('.bbf-form .field-language label').html(languageDictValue.attributes.language);
            $('.bbf-form .field-BirthDate label').html(languageDictValue.attributes.Birth_Date);
            $('.bbf-form .field-Gender label').html(languageDictValue.attributes.Gender)
            $('.bbf-form .field-levels label').html(languageDictValue.attributes.Levels)
            $('.bbf-form .field-community label').html(App.languageDict.attributes.Community)
            $('.bbf-form .field-region label').html(App.languageDict.attributes.Region)
            $('.bbf-form .field-nation label').html(App.languageDict.attributes.Nation)

            $('.bbf-form').find('.field-CourseTitle').find('label').html(App.languageDict.attributes.Course_Title);
            $('.bbf-form').find('.field-languageOfInstruction').find('label').html(App.languageDict.attributes.Language_Of_Instruction);
            $('.bbf-form').find('.field-memberLimit').find('label').html(App.languageDict.attributes.Member_Limit);
            $('.bbf-form').find('.field-courseLeader').find('label').html(App.languageDict.attributes.Course_Leader);
            $('.bbf-form').find('.field-description').find('label').html(App.languageDict.attributes.Description);
            $('.bbf-form').find('.field-method').find('label').html(App.languageDict.attributes.Method);
            $('.bbf-form').find('.field-gradeLevel').find('label').html(App.languageDict.attributes.Grade_Level);
            $('.bbf-form').find('.field-subjectLevel').find('label').html(App.languageDict.attributes.Subject_Level);
            $('.bbf-form').find('.field-startDate').find('label').html(App.languageDict.attributes.Start_date);
            $('.bbf-form').find('.field-startTime').find('label').html(App.languageDict.attributes.Start_Time);
            $('.bbf-form').find('.field-endTime').find('label').html(App.languageDict.attributes.End_Time);
            $('.bbf-form').find('.field-endDate').find('label').html(App.languageDict.attributes.End_date);
            $('.bbf-form').find('.field-frequency').find('label').html(App.languageDict.attributes.Frequency);
            $('.bbf-form').find('.field-frequency').find('li').eq(0).find('label').html(App.languageDict.attributes.Daily);
            $('.bbf-form').find('.field-frequency').find('li').eq(1).find('label').html(App.languageDict.attributes.Weekly);
            $('.bbf-form').find('.field-location').find('label').html(App.languageDict.attributes.Location);
            $('.bbf-form').find('.field-backgroundColor').find('label').html(App.languageDict.attributes.Foreground_Color);
            $('.bbf-form').find('.field-foregroundColor').find('label').html(App.languageDict.attributes.Background_Color);

            var invitationType=App.languageDict.get("inviteForm_levels");
            for(var i=0;i<invitationType.length;i++){
                $('.bbf-form .field-levels .bbf-editor select').find('option').eq(i).html(invitationType[i]);
            }
            $('.bbf-form .field-Gender .bbf-editor select').find('option').eq(0).html(App.languageDict.get('Male'))
            $('.bbf-form .field-Gender .bbf-editor select').find('option').eq(1).html(App.languageDict.get('Female'))

            for(var i=0;i<12;i++)
            {
                $('.field-BirthDate .bbf-editor .bbf-month').find('option').eq(i).html(lookup(App.languageDict, "Months." + $('.field-BirthDate .bbf-editor .bbf-month').find('option').eq(i).text().toString() ));
            }
            var gradeLevelArray=App.languageDict.get('GradeLevelList');
            for(var i=0;i<gradeLevelArray.length;i++)
            {
                $('.form .field-gradeLevel select').find('option').eq(i).html(gradeLevelArray[i]);
            }
            var subjectLevelArray=App.languageDict.get('SubjectLevelList');
            for(var i=0;i<subjectLevelArray.length;i++)
            {
                $('.form .field-subjectLevel select').find('option').eq(i).html(subjectLevelArray[i]);
            }
            if (directionOfLang.toLowerCase() === "right") {
                $('#_attachments').css('margin-right','170px');
            }
            else {
                $('#_attachments').css('margin-left','170px');
            }
        },

        Resources: function() {
            var jsonConfig = App.configuration.toJSON();
            if(jsonConfig.type == "nation" && $.url().attr('fragment') == "resources/community") {
                Backbone.history.navigate('resources', {
                    trigger: true
                })
            }
            else {
                App.startActivityIndicator()
                var resourcesTableView
                var temp = $.url().data.attr.host.split(".") // get name of community
                temp = temp[0].substring(3)
                if (temp == "")
                    temp = 'local'
                var roles = this.getRoles();
                var resources = new App.Collections.Resources({
                    skip: 0
                });
                if($.url().attr('fragment') == "resources/community") {
                    resources.pending = 1;
                }
                else if($.url().attr('fragment') == "resources/byownership") {
                    resources.pending = 3;
                    resources.loggedInName = $.cookie('Member.login');
                }
                else {
                    resources.pending = 0;
                }
                resources.fetch({
                    async:false,
                    success: function() {
                        resourcesTableView = new App.Views.ResourcesTable({
                            collection: resources
                        })
                        resourcesTableView.isManager = roles.indexOf("Manager");
                        App.$el.children('.body').empty();
                        App.$el.children('.body').html('<div id="parentLibrary"></div>');
                        App.$el.children('#parentLibrary').empty();
                        var btnText = '<p id="resourcePage" style="margin-top:20px"><a  id="addNewResource"class="btn btn-success" href="#resource/add">'+languageDict.attributes.Add_new_Resource+'</a>';

                        btnText += '<a id="requestResource" style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>'+languageDict.attributes.Request_Resource+'</a>';
                        btnText += '<button id="searchOfResource" style="margin-left:10px;"  class="btn btn-info" onclick="document.location.href=\'#resource/search\'">'+languageDict.attributes.Search+'<img width="25" height="0" style="margin-left: 10px;" alt="Search" src="img/mag_glass4.png"></button>'
                        $('#parentLibrary').append( btnText);
                        if(jsonConfig.type == "community") {
                            if($.url().attr('fragment') == "resources/community") {
                                $('#parentLibrary').append('<p id="labelOnResource" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;">'+languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">'+languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/community"style="font-size:30px;color:#0088CC;text-decoration: underline;">'+languageDict.attributes.Local_Resources+'</a></p>')
                            }
                            else {
                                $('#parentLibrary').append('<p id="labelOnResource" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;color:#0088CC;text-decoration: underline;">'+languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">'+languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/community"style="font-size:30px;">'+languageDict.attributes.Local_Resources+'</a></p>')
                            }
                        }
                        else {
                            if($.url().attr('fragment') == "resources/byownership") {
                                $('#parentLibrary').append('<p id="labelOnResource" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;">'+languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">'+languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/byownership"style="font-size:30px;color:#0088CC;text-decoration: underline;">'+languageDict.attributes.Local_Resources+'</a></p>')
                            }
                            else {
                                if(roles.indexOf("Manager") >= 0 || roles.indexOf("SuperManager") >= 0 ) {
                                    $('#parentLibrary').append('<p id="labelOnResource" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;color:#0088CC;text-decoration: underline;">'+languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">'+languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/pending"style="font-size:30px;">'+languageDict.attributes.Pending_Resources+'</a></p>')
                                }
                                else {
                                    $('#parentLibrary').append('<p id="labelOnResource" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;color:#0088CC;text-decoration: underline;">'+languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">'+languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/byownership"style="font-size:30px;">'+languageDict.attributes.Local_Resources+'</a></p>')
                                }
                            }
                        }
                        resourcesTableView.collections = App.collectionslist
                        resourcesTableView.render();
                        $('#parentLibrary').append(resourcesTableView.el);
                        if (App.languageDict.get('directionOfLang').toLowerCase()==="right")
                        {
                            $('#requestResource').css({"margin-right" : "10px"});
                            $('#searchOfResource').addClass({"margin-right" : "10px"});
                        }
                        resourcesTableView.changeDirection();
                    }
                });
                App.stopActivityIndicator()
            }
        },

        pendingResources: function() {
            var jsonConfig = App.configuration.toJSON();
            var roles = this.getRoles();
            if(jsonConfig.type == "nation" && (roles.indexOf("Manager") >= 0)) {
                App.startActivityIndicator()
                var resourcesTableView
                var resources = new App.Collections.Resources({
                    skip: 0
                });
                resources.pending = 2;
                resources.fetch({
                    async:false,
                    success: function() {
                        resourcesTableView = new App.Views.PendingResourcesTable({
                            collection: resources
                        })
                        resourcesTableView.isManager = roles.indexOf("Manager");
                        App.$el.children('.body').empty();
                        App.$el.children('.body').html('<div id="parentLibrary"></div>');
                        App.$el.children('#parentLibrary').empty();
                        var btnText = '<p id="resourcePage" style="margin-top:20px"><a  id="addNewResource"class="btn btn-success" href="#resource/add">'+languageDict.attributes.Add_new_Resource+'</a>';

                        btnText += '<a id="requestResource" style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>'+languageDict.attributes.Request_Resource+'</a>';
                        btnText += '<button id="searchOfResource" style="margin-left:10px;"  class="btn btn-info" onclick="document.location.href=\'#resource/search\'">'+languageDict.attributes.Search+'<img width="25" height="0" style="margin-left: 10px;" alt="Search" src="img/mag_glass4.png"></button>'
                        $('#parentLibrary').append( btnText);
                        $('#parentLibrary').append('<p id="labelOnResource" style="font-size:30px;color:#808080;"><a href="#resources" style="font-size:30px;">'+languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">'+languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/pending"style="font-size:30px;color:#0088CC;text-decoration: underline;">'+languageDict.attributes.Pending_Resources+'</a></p>')

                        resourcesTableView.collections = App.collectionslist;
                        resourcesTableView.render();

                        $('#parentLibrary').append(resourcesTableView.el);
                        if (App.languageDict.get('directionOfLang').toLowerCase()==="right")
                        {
                            $('#requestResource').css({"margin-right" : "10px"});
                            $('#searchOfResource').addClass({"margin-right" : "10px"});
                        }
                        resourcesTableView.changeDirection();
                    }
                });
                App.stopActivityIndicator()
            }
            else {
                Backbone.history.navigate('resources', {
                    trigger: true
                })
            }
        },

        ResourceForm: function(resourceId) {
            var context = this
            var resource = (resourceId) ? new App.Models.Resource({
                _id: resourceId
            }) : new App.Models.Resource()
            resource.on('processed', function() {
                window.history.back();
            })
            var resourceFormView = new App.Views.ResourceForm({
                model: resource
            })
            App.$el.children('.body').html(resourceFormView.el)
            if (resource.id) {
                App.listenToOnce(resource, 'sync', function() {
                    resourceFormView.render();
                })
                resource.fetch({
                    async: false
                })
            } else {
                resourceFormView.render()
                $("input[name='addedBy']").val($.cookie("Member.login"));
            }
            $("input[name='addedBy']").attr("disabled", true);
            $("select[class='bbf-date']").attr("disabled", true);
            $("select[class='bbf-month']").attr("disabled", true);
            $("select[class='bbf-year']").attr("disabled", true);
            $('.form .field-subject select').attr("multiple", true);
            var subjectArray=App.languageDict.get('SubjectList');
            for(var i=0;i<subjectArray.length;i++)
            {
                $('.form .field-subject select').find('option').eq(i).html(subjectArray[i]);
            }
            $('.form .field-subject select').multiselect().multiselectfilter();
            $('.form .field-subject select').multiselect({
                checkAllText: App.languageDict.attributes.checkAll,
                uncheckAllText: App.languageDict.attributes.unCheckAll,
                selectedText: '# '+App.languageDict.attributes.Selected
            });
            $('.form .field-subject select').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
            $('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
            $('.form .field-Level select').attr("multiple", true);
            var levelArray=App.languageDict.get('LevelArray');
            for(var i=0;i<levelArray.length;i++)
            {
                $('.form .field-Level select').find('option').eq(i).html(levelArray[i]);
            }
            $('.form .field-Level select').multiselect().multiselectfilter();
            $('.form .field-Level select').multiselect({
                checkAllText: App.languageDict.attributes.checkAll,
                uncheckAllText: App.languageDict.attributes.unCheckAll,
                selectedText: '# '+App.languageDict.attributes.Selected
            });
            $('.form .field-Level select').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
            $('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
            if (resource.id == undefined) {
                $('.form .field-Level select').multiselect('uncheckAll');
                $('.form .field-subject select').multiselect('uncheckAll')
            }
            $('.form .field-Tag select').attr("multiple", true);
            $('.form .field-Tag select').click(function() {
                context.AddNewSelect(this.value)
            });
            $('.form .field-Tag select').dblclick(function() {
                context.EditTag(this.value)
            });
            var identifier = '.form .field-Tag select'
            this.RenderTagSelect(identifier)
            $('.form .field-Tag select').multiselect().multiselectfilter();
            $('.form .field-Tag select').multiselect({
                checkAllText: App.languageDict.attributes.checkAll,
                uncheckAllText: App.languageDict.attributes.unCheckAll,
                selectedText: '# '+App.languageDict.attributes.Selected
            });
            $('.form .field-Tag select').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
            $('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
            $('.form .field-Tag select').multiselect("uncheckAll");

            if (resource.id) {
                $('.form .field-subject select').multiselect("refresh");
                if (resource.get('Tag')) {
                    var total = resource.get('Tag').length
                    for (var counter = 0; counter < total; counter++) {
                        $('.form .field-Tag select option[value="' + resource.get('Tag')[counter] + '"]').attr('selected', 'selected')
                    }
                    $('.form .field-Tag select').multiselect("refresh");
                }
                if (resource.get('subject') == null) {
                    $(".form .field-subject select").find('option').removeAttr("selected");
                }
                if (resource.get('Tag') == null) {
                    $(".form .field-Tag select").find('option').removeAttr("selected");
                }
                if (resource.get('Level') == null) {
                    $(".form .field-Level select").find('option').removeAttr("selected")
                }
            }
            this.updateLabelsOfAddResourceForm(resourceId);
            if (App.languageDict.get('directionOfLang').toLowerCase()==="right"){
                this.updateAllignmentOfAddResourceForm();
            }
        },

        updateAllignmentOfAddResourceForm: function(){
            $('#resourceform').find('table').find('tbody').find('tr').find('td').find('h2').css('float','right');
            $('.field-title').find('label').css('float','right');
            $('.field-author').find('label').css('float','right');
            $('.field-Publisher').find('label').css('float','right');
            $('.field-language').find('label').css('float','right');
            $('.field-Year').find('label').css('float','right');
            $('.field-linkToLicense').find('label').css('float','right');
            $('.field-subject').find('label').css('float','right');
            $('.field-Level').find('label').css('float','right');
            $('.field-Tag').find('label').css('float','right');
            $('.field-Medium').find('label').css('float','right');
            $('.field-openWith').find('label').css('float','right');
            $('.field-resourceFor').find('label').css('float','right');
            $('.field-resourceType').find('label').css('float','right');
            $('.field-articleDate').find('label').css('float','right');
            $('.field-articleDate').find('.bbf-editor').find('div').css('float','right');
            $('.field-addedBy').find('label').css('float','right');
            $('#uploadLabel').css('float','right');
            $('#add_newCoellection').addClass('add_Collection_Non_Eng')
        },

        updateLabelsOfAddResourceForm : function(resourceId){
            $('.field-title').find('label').html(App.languageDict.attributes.Title);
            $('.field-author').find('label').html(App.languageDict.attributes.author);
            $('.field-Publisher').find('label').html(App.languageDict.attributes.publisher_attribution);
            $('.field-language').find('label').html(App.languageDict.attributes.language);
            $('.field-Year').find('label').html(App.languageDict.attributes.year);
            $('.field-linkToLicense').find('label').html(App.languageDict.attributes.link_to_license);
            $('.field-subject').find('label').html(App.languageDict.attributes.subject);
            $('.field-subject').find('.bbf-editor').find('select').multiselect({
                header: App.languageDict.attributes.Select_An_option,
                noneSelectedText: App.languageDict.attributes.Select_An_option
            });
            $('.field-Level').find('label').html(App.languageDict.attributes.level);
            $('.field-Level').find('.bbf-editor').find('select').multiselect({
                header: App.languageDict.attributes.Select_An_option,
                noneSelectedText: App.languageDict.attributes.Select_An_option
            });
            $('.field-Tag').find('label').html(App.languageDict.attributes.Collection);
            $('.field-Tag').find('.bbf-editor').find('select').multiselect({
                header: App.languageDict.attributes.Select_An_option,
                noneSelectedText: App.languageDict.attributes.Select_An_option
            });
            $('.field-Medium').find('label').html(App.languageDict.attributes.media);
            $('.field-openWith').find('label').html(App.languageDict.attributes.Open);
            $('.field-resourceFor').find('label').html(App.languageDict.attributes.resource_for);
            $('.field-resourceType').find('label').html(App.languageDict.attributes.resource_type);
            $('.field-articleDate').find('label').html(App.languageDict.attributes.article_Date);
            $('.field-addedBy').find('label').html(App.languageDict.attributes.added_by);
            $('.field-openUrl').find('label').html(App.languageDict.attributes.openUrl);
            var mediaArray=App.languageDict.get('mediaList');
            for(var i=0;i<mediaArray.length;i++)
            {
                $('.field-Medium').find('.bbf-editor').find('select').find('option').eq(i).html(mediaArray[i]);
            }
            var openWithArray=App.languageDict.get('openWithList');
            for(var i=0;i<openWithArray.length;i++)
            {
                $('.field-openWith').find('.bbf-editor').find('select').find('option').eq(i).html(openWithArray[i]);
            }
            var resourceForArray=App.languageDict.get('resourceForList');
            for(var i=0;i<resourceForArray.length;i++)
            {
                $('.field-resourceFor').find('.bbf-editor').find('select').find('option').eq(i).html(resourceForArray[i]);
            }
            var resourceTypeArray=App.languageDict.get('resourceTypeList');
            for(var i=0;i<resourceTypeArray.length;i++)
            {
                $('.field-resourceType').find('.bbf-editor').find('select').find('option').eq(i).html(resourceTypeArray[i]);
            }
            $('#fileAttachment').find('label').html(App.languageDict.attributes.Upload+' '+App.languageDict.attributes.Resources);
        },

        bellResourceSearch: function() {
            popAll()
            var search = new App.Views.Search()
            search.addResource = false
            search.render();
            App.$el.children('.body').html(search.el);
            $("#multiselect-collections-search").multiselect().multiselectfilter();
            $('#multiselect-collections-search').multiselect({
                header: App.languageDict.attributes.Select_An_option,
                noneSelectedText: App.languageDict.attributes.Select_An_option,
                checkAllText: App.languageDict.attributes.checkAll,
                uncheckAllText: App.languageDict.attributes.unCheckAll,
                selectedText: '# '+App.languageDict.attributes.Selected
            });
            $('#multiselect-collections-search').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
            $("#multiselect-levels-search").multiselect().multiselectfilter();
            $('#multiselect-levels-search').multiselect({
                header: App.languageDict.attributes.Select_An_option,
                noneSelectedText: App.languageDict.attributes.Select_An_option,
                checkAllText: App.languageDict.attributes.checkAll,
                uncheckAllText: App.languageDict.attributes.unCheckAll,
                selectedText: '# '+App.languageDict.attributes.Selected
            });
            $('#multiselect-levels-search').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
            $("#multiselect-medium-search").multiselect({
                multiple: false,
                header: App.languageDict.attributes.Select_An_option,
                noneSelectedText: App.languageDict.attributes.Select_An_option,
                selectedList: 1
            });
            $("#search-language").multiselect({
                multiple: false,
                header: App.languageDict.attributes.Select_An_option,
                noneSelectedText: App.languageDict.attributes.Select_An_option,
                selectedList: 1
            });
            $("#srch").hide()
            $(".search-bottom-nav").hide()
            $(".search-result-header").hide()
            $("#selectAllButton").hide()
            showSubjectCheckBoxes()
            $("#multiselect-subject-search").multiselect().multiselectfilter();
            $('#multiselect-subject-search').multiselect({
                header: App.languageDict.attributes.Select_An_option,
                noneSelectedText: App.languageDict.attributes.Select_An_option,
                checkAllText: App.languageDict.attributes.checkAll,
                uncheckAllText: App.languageDict.attributes.unCheckAll,
                selectedText: '# '+App.languageDict.attributes.Selected
            });
            $('#multiselect-subject-search').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
            $('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right")
            {
                $('#searchText').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                $('#SubjectCheckboxes').find('label').text(App.languageDict.attributes.subject).css("font-weight","Bold");;
            }
        },

        SearchBell: function(levelId, rid, resourceIds) {
            var levelInfo = new App.Models.CourseStep({
                "_id": levelId
            })
            levelInfo.fetch({
                success: function() {
                    if (typeof levelId === 'undefined') {
                        document.location.href = '#courses'
                    }
                    if (typeof rid === 'undefined') {
                        document.location.href = '#courses'
                    }
                    grpId = levelId
                    levelrevId = rid
                    ratingFilter.length = 0
                    rtitle.length = 0
                    rids.length = 0
                    var search = new App.Views.Search()
                    search.resourceids = levelInfo.get("resourceId")
                    search.addResource = true
                    search.render()
                    App.$el.children('.body').html(search.el)
                    $("#multiselect-collections-search").multiselect().multiselectfilter();
                    $("#multiselect-collections-search").multiselect({
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected,
                        noneSelectedText: App.languageDict.attributes.Select_An_option
                    });
                    $("#multiselect-collections-search").multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                    $('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                    $("#multiselect-levels-search").multiselect().multiselectfilter();
                    $("#multiselect-levels-search").multiselect({
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected,
                        noneSelectedText: App.languageDict.attributes.Select_An_option
                    });
                    $("#multiselect-levels-search").multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                    $("#multiselect-medium-search").multiselect({
                        multiple: false,
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        selectedList: 1
                    });
                    $("#search-language").multiselect({
                        multiple: false,
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        selectedList: 1
                    });
                    $("#srch").hide()
                    $(".search-bottom-nav").hide()
                    $(".search-result-header").hide()
                    $("#selectAllButton").hide()
                    showSubjectCheckBoxes()
                    $("#multiselect-subject-search").multiselect().multiselectfilter();
                    $("#multiselect-subject-search").multiselect({
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected,
                        noneSelectedText: App.languageDict.attributes.Select_An_option
                    });
                    $("#multiselect-subject-search").multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                }
            })
        },

        AssignResourcetoLevel: function() {
            if (typeof grpId === 'undefined') {
                document.location.href = '#courses'
            }
            var cstep = new App.Models.CourseStep({
                "_id": grpId
            })
            cstep.fetch({
                async: false
            })
            var oldIds = cstep.get("resourceId")
            var oldTitles = cstep.get("resourceTitles")
            $("input[name='result']").each(function() {
                if ($(this).is(":checked")) {
                    var rId = $(this).val();
                    if (oldIds.indexOf(rId) == -1) {
                        rtitle.push($(this).attr('rTitle'))
                        rids.push(rId)
                    }
                }
            });
            cstep.set("resourceId", oldIds.concat(rids))
            cstep.set("resourceTitles", oldTitles.concat(rtitle))
            cstep.save(null, {
                success: function(responseModel, responseRev) {
                    cstep.set("_rev", responseRev.rev)
                    alert(App.languageDict.attributes.Resource_Updated)
                    Backbone.history.navigate('level/view/' + responseRev.id + '/' + responseRev.rev, {
                        trigger: true
                    })
                }
            })
        },
        SearchPresources: function(publicationId) {
            var publications = new App.Models.Publication({
                "_id": publicationId
            })
            publications.fetch({
                success: function() {
                    var search = new App.Views.Search()
                    grpId = publicationId
                    search.addResource = true
                    search.Publications = true
                    App.$el.children('.body').html(search.el)
                    search.render();
                    $("#multiselect-collections-search").multiselect().multiselectfilter();
                    $('#multiselect-collections-search').multiselect({
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected
                    });
                    $('#multiselect-collections-search').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                    $("#multiselect-levels-search").multiselect().multiselectfilter();
                    $('#multiselect-levels-search').multiselect({
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected
                    });
                    $('#multiselect-levels-search').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                    $("#multiselect-medium-search").multiselect({
                        multiple: false,
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        selectedList: 1
                    });
                    $("#search-language").multiselect({
                        multiple: false,
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        selectedList: 1
                    });
                    $("#srch").hide()
                    $(".search-bottom-nav").hide()
                    $(".search-result-header").hide()
                    $("#selectAllButton").hide()
                    showSubjectCheckBoxes()
                    $("#multiselect-subject-search").multiselect().multiselectfilter();
                    $('#multiselect-subject-search').multiselect({
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected
                    });
                    $('#multiselect-subject-search').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                    $('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                },
                async: false
            })
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        Courses: function() {
            App.startActivityIndicator()
            courses = new App.Collections.Courses()
            courses.fetch({
                success: function() {
                    var languageDictValue;
                    var clanguage = getLanguage($.cookie('Member._id'));
                    languageDictValue = getSpecificLanguage(clanguage);
                    App.languageDict = languageDictValue;
                    var directionOfLang = App.languageDict.get('directionOfLang');
                    coursesTable = new App.Views.CoursesTable({
                        collection: courses
                    })
                    coursesTable.render();
                    var parentDiv='<div id="parentLibrary" style="visibility;hidden"></div>';
                    var lib_page = $.url().data.attr.fragment;
                    if(lib_page=="courses"){
                        $('.body').empty();
                        $('#parentLibrary').css('visibility', 'visible');
                    }
                    App.$el.children('.body').append(parentDiv);
                    var button = '<p id="library-top-buttons">'
                    button += '<a id="addCourseButton" class="btn btn-success" href="#course/add">'+App.languageDict.attributes.Add_Course+'</a>'
                    button += '<a id="requestCourseButton" class="btn btn-success" onclick=showRequestForm("Course")>'+App.languageDict.attributes.Request_Course+'</a>'
                    button += '<span id="searchSpan"><input id="searchText" value="" size="30" style="height:24px;margin-top:1%;" type="text"><span style="margin-left:10px">'
                    button += '<button class="btn btn-info" onclick="CourseSearch()">'+App.languageDict.attributes.Search+'</button></span>'
                    button += '</p>'
                    $('#parentLibrary').append( button);
                    $('#parentLibrary').append('<h3 id="headingOfCourses">'+App.languageDict.attributes.Courses+'</h3>')
                    $('#parentLibrary').append(coursesTable.el);
                    coursesTable.changeDirection();
                    if(directionOfLang.toLowerCase()==="right")
                    {
                        $("#requestCourseButton").addClass('addMarginsOnRequestCourse');
                        $("#addCourseButton").addClass('addMarginsOnCourseUrdu');
                        $('#searchText').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                        $('#searchText').css('margin-left','1%');
                        $('#headingOfCourses').css('margin-right','2%');
                    }
                    else
                    {
                        $('#searchSpan').css('float','right');
                        $('#requestCourseButton').css('margin-left','10px');
                        $("#addCourseButton").addClass('addMarginsOnCourse');
                        $('#searchText').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                    }
                }
            });
            App.stopActivityIndicator()
        },

        CreateTest: function(lid, rid, title) {
            $("#dialog").show()
            var that = this;
            var levelInfo = new App.Models.CourseStep({
                "_id": lid
            })
            levelInfo.fetch({
                success: function() {
                    $("#dialog").show();
                    var test = new App.Views.TestView()
                    test.levelId = lid
                    test.revId = levelInfo.get('_rev')
                    test.ltitle = title
                    var coursestepModel = new App.Models.CourseStep({
                     _id: lid
                    })
                    coursestepModel.fetch({
                        async: false
                    });
                    var coursestepQuestions = coursestepModel.get('questionslist');
                    if (coursestepQuestions != null && coursestepQuestions != '' && coursestepQuestions !=[] ) 
                    { 
                        var coursestepQuestionsIdes = ''
                        _.each(coursestepQuestions, function(item) {
                            coursestepQuestionsIdes += '"' + item + '",'
                        })
                        if (coursestepQuestionsIdes != ''){
                            coursestepQuestionsIdes = coursestepQuestionsIdes.substring(0, coursestepQuestionsIdes.length - 1);
                        }
                        var questionsColl = new App.Collections.CourseStepQuestions();
                        questionsColl.keys = encodeURI(coursestepQuestionsIdes)
                        questionsColl.fetch({
                            async: false
                        });
                        var sortedModels = that.sortQuestions(coursestepQuestions, questionsColl.models);
                        questionsColl.models = sortedModels;
                        var CourseStepQuestionsTable = new App.Views.CourseStepQuestionTable({
                            collection: questionsColl
                        })
                        CourseStepQuestionsTable.Id = lid;
                        CourseStepQuestionsTable.questionArray = coursestepQuestions;
                        CourseStepQuestionsTable.courseStepModel = levelInfo;
                        CourseStepQuestionsTable.render()
                    }
                    $("input[name='questionRow']").hide();
                    App.$el.children('.body').html(test.el)
                    test.render();
                    if (coursestepQuestions != null && coursestepQuestions != '' && coursestepQuestions !=[] ) {
                        $('#parentDiv').append(CourseStepQuestionsTable.el);
                    }
                    $("#Rearrange").remove();
                    $("#moveup").hide();
                    $("#movedown").hide();
                    for(var row=0;row<3 ;row++) {
                        for(var col=0;col<3;col++) {
                            for(var index=0;index<2;index++) {
                                $('#options-table').find('table').find('tr').eq(row).find('td').eq(col).find('input').eq(index).attr('placeholder',App.languageDict.attributes.Enter_Option);
                            }
                        }
                    }
                    if (levelInfo.get("questions")) {
                        test.displayQuestionsInView()
                    }
                }
            });
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang)
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

        CourseInfo: function(courseId) {
            var courseModel = new App.Models.Course()
            courseModel.set('_id', courseId)
            courseModel.fetch({
                async: false
            })
            var courseLeader = courseModel.get('courseLeader');
            var memberModelArr = [];
            for(var i = 0; i < courseLeader.length; i++) {
                var memberModel = new App.Models.Member()
                memberModel.set('_id', courseLeader[i]);
                memberModel.fetch({
                    async: false
                });
                memberModelArr.push(memberModel);
            }
            var viewCourseInfo = new App.Views.CourseInfoView({
                model: courseModel
            })
            viewCourseInfo.leader = memberModelArr
            viewCourseInfo.render()
            App.$el.children('.body').html("&nbsp")
            App.$el.children('.body').append('<div class="courseInfo-header"><a href="#usercourse/details/' + courseId + '/' + courseModel.get('name') + '"><button type="button" class="btn btn-info" id="back">'+App.languageDict.attributes.Back+'</button></a>&nbsp;&nbsp;&nbsp;&nbsp<a href="#course/resign/' + courseId + '"><button id="resignCourse" class="btn resignBtn btn-danger" value="0">'+App.languageDict.attributes.Resign+'</button></a>&nbsp;&nbsp;</div>')
            App.$el.children('.body').append(viewCourseInfo.el);
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        CourseReport: function(cId, cname) {
            var roles = this.getRoles()
            var course = new App.Models.Course();
            course.id = cId
            course.fetch({
                async: false
            })
            App.$el.children('.body').html('<div class="courseSearchResults_Bottom"></div>');
            $('.courseSearchResults_Bottom').append("<h2> " + cname + "</h2>")
            if (course.get('courseLeader') != undefined && course.get('courseLeader').indexOf($.cookie('Member._id'))!=-1 || roles.indexOf("Manager") != -1) {
                $('.courseSearchResults_Bottom h2').append('<button id="manageOnCourseProgress" class="btn btn-success"  onclick = "document.location.href=\'#course/manage/' + cId + '\'">'+App.languageDict.attributes.Manage+'</button>')
            }
            $('.courseSearchResults_Bottom').append('<p id="graph2title"style="text-align:center">'+App.languageDict.attributes.Individual_Member_Course_Progress+'</p>')
            App.$el.children('.body').append('<div id="detailView"><div id="graph2" class="flotHeight"></div><div id="choices" class="choice"></div></div><div id="birdEye"><div id="graph1" class="flotHeight"></div></div>')
            var allResults = new App.Collections.StepResultsbyCourse()
            if (course.get('courseLeader').indexOf($.cookie('Member._id')) == -1  &&  roles.indexOf("Manager") == -1) {
                allResults.memberId = $.cookie('Member._id')
            }
            allResults.courseId = cId
            allResults.fetch({
                async: false
            })
            var vi = new App.Views.CoursesStudentsProgress({
                collection: allResults,
                model:course,
                attributes:{
                    memberroles:roles
                }
            })
            vi.render()
            $('.body').append(vi.el);
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);
        },

        ManageCourse: function(courseId) {
            var that = this
            levels = new App.Collections.CourseLevels()
            levels.courseId = courseId
            var className = "Course"
            var model = new App.Models[className]()
            var modelForm = new App.Views[className + 'Form']({
                model: model
            })
            model.once('Model:ready', function() {
                // when the users submits the form, the course will be processed
                modelForm.on(className + 'Form:done', function() {
                    Backbone.history.navigate(reroute, {
                        trigger: true
                    })
                })
                App.$el.children('.body').html('<div id="AddCourseMainDiv"></div>');
                $('#AddCourseMainDiv').append('<br/><h3>'+App.languageDict.attributes.Course_Manage+'</h3>');
                $('#AddCourseMainDiv').append(modelForm.el);
                // Set up the form
                modelForm.render();
                $('.bbf-form').find('.field-CourseTitle').find('label').html(App.languageDict.attributes.Course_Title);
                $('.bbf-form').find('.field-languageOfInstruction').find('label').html(App.languageDict.attributes.Language_Of_Instruction);
                $('.bbf-form').find('.field-memberLimit').find('label').html(App.languageDict.attributes.Member_Limit);
                $('.bbf-form').find('.field-courseLeader').find('label').html(App.languageDict.attributes.Course_Leader);
                $('.bbf-form').find('.field-description').find('label').html(App.languageDict.attributes.Description);
                $('.bbf-form').find('.field-method').find('label').html(App.languageDict.attributes.Method);
                $('.bbf-form').find('.field-gradeLevel').find('label').html(App.languageDict.attributes.Grade_Level);
                $('.bbf-form').find('.field-subjectLevel').find('label').html(App.languageDict.attributes.Subject_Level);
                $('.bbf-form').find('.field-startDate').find('label').html(App.languageDict.attributes.Start_date);
                $('.bbf-form').find('.field-startTime').find('label').html(App.languageDict.attributes.Start_Time);
                $('.bbf-form').find('.field-endTime').find('label').html(App.languageDict.attributes.End_Time);
                $('.bbf-form').find('.field-endDate').find('label').html(App.languageDict.attributes.End_date);
                $('.bbf-form').find('.field-frequency').find('label').html(App.languageDict.attributes.Frequency);
                $('.bbf-form').find('.field-frequency').find('li').eq(0).find('label').html(App.languageDict.attributes.Daily);
                $('.bbf-form').find('.field-frequency').find('li').eq(1).find('label').html(App.languageDict.attributes.Weekly);
                $('.bbf-form').find('.field-location').find('label').html(App.languageDict.attributes.Location);
                $('.bbf-form').find('.field-backgroundColor').find('label').html(App.languageDict.attributes.Foreground_Color);
                $('.bbf-form').find('.field-foregroundColor').find('label').html(App.languageDict.attributes.Background_Color);
                $('.bbf-form').find('.field-Day').find('label').html(App.languageDict.attributes.Day);
                var DaysObj=App.languageDict.get("Days");
                $('.form .field-Day .bbf-editor ul').find('li').eq(0).find('label').html(lookup(App.languageDict, "Days." + "Saturday"));
                $('.form .field-Day .bbf-editor ul').find('li').eq(1).find('label').html(lookup(App.languageDict, "Days." + "Sunday"));
                $('.form .field-Day .bbf-editor ul').find('li').eq(2).find('label').html(lookup(App.languageDict, "Days." + "Monday"));
                $('.form .field-Day .bbf-editor ul').find('li').eq(3).find('label').html(lookup(App.languageDict, "Days." + "Tuesday"));
                $('.form .field-Day .bbf-editor ul').find('li').eq(4).find('label').html(lookup(App.languageDict, "Days." + "Wednesday"));
                $('.form .field-Day .bbf-editor ul').find('li').eq(5).find('label').html(lookup(App.languageDict, "Days." + "Thursday"));
                $('.form .field-Day .bbf-editor ul').find('li').eq(6).find('label').html(lookup(App.languageDict, "Days." + "Friday"));
                var gradeLevelArray=App.languageDict.get('GradeLevelList');
                for(var i=0;i<gradeLevelArray.length;i++)
                {
                    $('.form .field-gradeLevel select').find('option').eq(i).html(gradeLevelArray[i]);
                }
                var subjectLevelArray=App.languageDict.get('SubjectLevelList');
                for(var i=0;i<subjectLevelArray.length;i++)
                {
                    $('.form .field-subjectLevel select').find('option').eq(i).html(subjectLevelArray[i]);
                }
                $('.form .field-startDate input').datepicker({
                    todayHighlight: true
                });
                $('.form .field-endDate input').datepicker({
                    todayHighlight: true
                });
                $('.form .field-startTime input').timepicker({
                    'minTime': '8:00am',
                    'maxTime': '12:30am'
                });
                $('.form .field-endTime input').timepicker({
                    'minTime': '8:00am',
                    'maxTime': '12:30am'
                });
                levels.fetch({
                    success: function() {
                        levels.sort()
                        lTable = new App.Views.LevelsTable({
                            collection: levels
                        })
                        lTable.courseId = courseId
                        lTable.render()
                        $('#AddCourseMainDiv').append("</BR><h3>"+App.languageDict.attributes.Course_Steps+"</h3>")
                        $('#AddCourseMainDiv').append(lTable.el)
                        $("#moveup").hide()
                        $("#movedown").hide()
                        $("input[type='radio']").hide();

                        // Step Form
                        totalLevels = levels.models.length;
                        
                        
                        
                        var Cstep = new App.Models.CourseStep()
                        Cstep.set({
                            courseId: courseId
                        })
                        Cstep.set("totalMarks", 0);
                        var lForm = new App.Views.LevelForm({
                            model: Cstep
                        })
                        $('#AddCourseMainDiv').append('<div class="courseSearchResults_Bottom"></div>');
                        $('.courseSearchResults_Bottom').append('<h3 id="feedbackResoDiv">' + App.languageDict.attributes.New_Step + '</h3>');
                        lForm.edit = false
                        lForm.previousStep = 0
                        lForm.render()
                        $('.courseSearchResults_Bottom').append(lForm.el)
                        $("input[name='step']").attr("disabled", true);
                        
                        if (totalLevels != -1) {
                            var tl = parseInt(totalLevels) + 1
                            $("input[name='step']").val(tl)
                        }
                        Backbone.Form.validators.errMessages.required = App.languageDict.attributes.Required_Text;
                        $('.bbf-form .field-title label').html(App.languageDict.attributes.Title);
                        $('.bbf-form .field-stepMethod label').html(App.languageDict.attributes.Step_Method);
                        $('.bbf-form .field-description label').html(App.languageDict.attributes.Description);
                        $('.bbf-form .field-stepGoals label').html(App.languageDict.attributes.Step_Goals);
                        $('.bbf-form .field-step label').html(App.languageDict.attributes.Step);
                        $('.bbf-form .field-passingPercentage label').html(App.languageDict.attributes.Passing_Percentage);
                    }
                })
                var Roles = that.getRoles()
                if (Roles.indexOf('Manager') == -1)
                    $('.form .field-courseLeader select').attr("disabled", "true")
                $('.form .field-frequency input').click(function() {
                    if (this.value == 'Weekly') {
                        $('.form .field-Day').show()
                    } else {
                        $('.form .field-Day').hide()
                    }
                });
            })
            // Set up the model for the form
            if (courseId) {
                model.id = courseId
                model.once('sync', function() {
                    model.trigger('Model:ready')
                })
                model.fetch()
            } else {
                model.trigger('Model:ready')
            }
        },
        answerReview: function(memberid, stepid, attempts){
            var attemptsNo =parseInt(attempts);
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict = languageDictValue;
            var courseSteps = new App.Models.CourseStep()
                courseSteps.id = stepid;
                courseSteps.fetch({
                    async: false
                }) 
            var ppercentage = courseSteps.get("passingPercentage")
            var coursesid = courseSteps.get("courseId")
                var courseAnswer = new App.Collections.CourseAnswer()
                    courseAnswer.StepID = stepid
                    courseAnswer.MemberID = memberid
                    courseAnswer.pqattempts = attemptsNo
                    courseAnswer.fetch({
                        async: false
                    })
                console.log(courseAnswer)
                var answerview = new App.Views.AnswerReview({
                  collection: courseAnswer,
                  attributes: {
                            courseid: coursesid,
                            membersid: memberid,
                            pp: ppercentage,
                            StepID:stepid
                }})
                App.$el.children('.body').html(answerview.el);
                answerview.render();
                var directionOfLang = App.languageDict.get('directionOfLang');
                applyCorrectStylingSheet(directionOfLang)
        },

        courseDetails: function(courseId, courseName) {
            var courseModel = new App.Models.Course({
                _id: courseId
            })
            courseModel.fetch({
                async: false
            })
            var courseLeader = courseModel.get('courseLeader')
            var courseName = courseModel.get('name')
            var courseMembers = courseModel.get('members')
            var button = '<br><a href="#courses"><button class="btn btn-success">'+App.languageDict.attributes.Back_To_Course+'</button></a>'
            if (courseMembers && courseMembers.indexOf($.cookie('Member._id')) == -1) {
                button += '&nbsp;&nbsp;<button class="btn btn-danger" id="admissionButton" onClick=sendAdminRequest("' + courseLeader + '","' + encodeURI(courseName) + '","' + courseId + '")>'+App.languageDict.attributes.Admission+'</button><br/><br/>'
            } else {
                button += '<br/><br/>'
            }
            App.$el.children('.body').html('<div class="courseEditStep"></div>')
            $('.courseEditStep').append('<div id="courseName-heading"><h3>'+App.languageDict.attributes.Course_Details+' | ' + courseName + '</h3></div>')
            $('.courseEditStep').append(button)
            var memberModelArr = [];
            for(var i = 0; i < courseLeader.length; i++)
            {
                var memberModel = new App.Models.Member()
                memberModel.set('_id', courseLeader[i]);
                memberModel.fetch({
                    async: false
                });
                memberModelArr.push(memberModel);
            }
            var ccSteps = new App.Collections.coursesteps()
            ccSteps.courseId = courseId
            ccSteps.fetch({
                async: false
            })
            var CourseDetailsView = new App.Views.CourseView({
                model: courseModel
            })
            CourseDetailsView.courseLeader = memberModelArr
            CourseDetailsView.render()
            var courseStepsView = new App.Views.CourseStepsView({
                collection: ccSteps
            })
            courseStepsView.render()
            $('.courseEditStep').append(CourseDetailsView.el)
            $('.courseEditStep').append('<div id="courseSteps-heading"><h5>'+App.languageDict.attributes.Course_Steps+'</h5></div>')
            $('.courseEditStep').append(courseStepsView.el)
            $('#admissionButton').on('click', function(e) {
                $(document).trigger('Notification:submitButtonClicked')
            });
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang)
        },

        UserCourseDetails: function(courseId, name) {
            var memberId = $.cookie('Member._id')
            var ccSteps = new App.Collections.coursesteps()
            ccSteps.courseId = courseId
            ccSteps.fetch({
                success: function() {
                    App.$el.children('.body').html('&nbsp<div class="courseEditStep"></div>');
                    $('.courseEditStep').append('<p class="Course-heading">'+App.languageDict.attributes.Course+'<b>|</b>' + name + '    ' + '<a id="userCourseHeading" href="#CourseInfo/' + courseId + '"><button class="btn fui-eye"></button></a>' + '<a id="showBCourseMembers"  href="#course/members/'+ courseId + '"  class="btn btn-info">'+App.languageDict.attributes.Course_Members+'</a></p>')
                    var levelsTable = new App.Views.CourseLevelsTable({
                        collection: ccSteps,
                        attributes:{
                            membersid: memberId
                        }
                    })
                    levelsTable.courseId = courseId
                    levelsTable.render()
                    $('.courseEditStep').append(levelsTable.el)
                }
            });
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        CourseMembers: function(cId) {
            var courseMembers = new App.Views.CourseMembers()
            courseMembers.courseId = cId;
            App.$el.children('.body').empty();
            App.$el.children('.body').append('<div class="courseEditStep"></div>');
            courseMembers.render();
            $('.courseEditStep').append(courseMembers.el);
            var directionOfLang = App.languageDict.get('directionOfLang');
            if(directionOfLang.toLowerCase()==="right") {
                $('.courseEditStep').find('h3').css('margin-right','5%');
            } else {
                $('.courseEditStep').find('h3').css('margin-left','5%');
            }
            applyCorrectStylingSheet(directionOfLang)
        },

        CourseForm: function(courseId) {
            this.modelForm('Course', 'Course', courseId, 'courses');
        },

        CourseAssign: function(courseId) {
            var assignResourcesToCourseTable = new App.Views.AssignResourcesToCourseTable()
            assignResourcesToCourseTable.courseId = courseId
            assignResourcesToCourseTable.render()
            App.$el.children('.body').html(assignResourcesToCourseTable.el)
        },

        ResignCourse: function(courseId) {
            var memberId = $.cookie('Member._id')
            var courseModel = new App.Models.Course()
            courseModel.set('_id', courseId)
            courseModel.fetch({
                async: false
            })
            var courseMemebers = courseModel.get('members')
            var index = courseMemebers.indexOf(memberId)
            courseMemebers.splice(index, 1)
            courseModel.set({
                members: courseMemebers
            })
            var courseLeaders = courseModel.get('courseLeader')
            var index = courseLeaders.indexOf(memberId);
            if(index>-1){
                courseLeaders.splice(index, 1)
                courseModel.set({
                    courseLeader: courseLeaders
                })
            }
            courseModel.save();
            var memberProgress = new App.Collections.memberprogressallcourses()
            memberProgress.memberId = memberId
            memberProgress.fetch({
                async: false
            })
            memberProgress.each(function(m) {
                if (m.get("courseId") == courseId) {
                    m.destroy()
                }
            })
            var mail = new App.Models.Mail();
            var currentdate = new Date();
            var id = courseModel.get('courseLeader')
            var subject = App.languageDict.attributes.Course_Resignation+' | ' + courseModel.get('name') + ''
            var mailBody = App.languageDict.attributes.Hi+',<br>'+App.languageDict.attributes.Member+ ' ' + $.cookie('Member.login') + ' '+ App.languageDict.attributes.Has_Resign_From+ ' ' + courseModel.get('name') + '';
            mail.set("senderId", $.cookie('Member._id'))
            mail.set("receiverId", id)
            mail.set("subject", subject)
            mail.set("body", mailBody)
            mail.set("status", "0")
            mail.set("type", "mail")
            mail.set("sentDate", currentdate)
            mail.save();
            alert(App.languageDict.attributes.Resigned_Success_Msg +' ' + courseModel.get('name') + ' . ')
            Backbone.history.navigate('dashboard', {
                trigger: true
            })
        },

        CourseWeekOfAssignments: function(courseId, weekOf) {
            // Figure out our week range
            if (!weekOf) {// Last Sunday
                weekOf = moment().subtract('days', (moment().format('d'))).format("YYYY-MM-DD")
            }
            var startDate = weekOf
            var endDate = moment(weekOf).add('days', 7).format('YYYY-MM-DD')
            var table = new App.Views.AssignWeekOfResourcesToCourseTable()
            // Bind this view to the App's body
            App.$el.children('.body').html(table.el)
            // Set variables on this View
            table.course = new App.Models.Course()
            table.course.id = courseId
            table.resources = new App.Collections.Resources()
            table.assignments = new App.Collections.CourseAssignmentsByDate()
            table.assignments.courseId = courseId,
                table.assignments.startDate = startDate
            table.assignments.endDate = endDate
            table.weekOf = weekOf
            // Fetch the collections and model, render when ready
            table.resources.on('sync', function() {
                table.assignments.fetch()
            })
            table.assignments.on('sync', function() {
                table.course.fetch()
            })
            table.course.on('sync', function() {
                table.render()
            })
            table.resources.fetch()
        },

        AddLevel: function(courseId, levelId, totalLevels) {
            var lang = getLanguage($.cookie('Member._id'));
            var languageDictValue = getSpecificLanguage(lang);
            App.languageDict=languageDictValue;
            var Cstep = new App.Models.CourseStep()
            Cstep.set({
                courseId: courseId
            })
            Cstep.set("totalMarks",0);
            var coursedetail = new App.Models.Course({
                _id: courseId
            })
            coursedetail.fetch({
                async: false
            })
            var lForm = new App.Views.LevelForm({
                model: Cstep
            })
            App.$el.children('.body').html('<div class="courseSearchResults_Bottom"></div>');
            if (levelId == "nolevel") {
                $('.courseSearchResults_Bottom').append('<h3 id="feedbackResoDiv">'+App.languageDict.attributes.New_Step+'</h3>');
                lForm.edit = false
                lForm.previousStep = 0
                lForm.render()
                $('.courseSearchResults_Bottom').append(lForm.el)
                $("input[name='step']").attr("disabled", true);
            } else {
                Cstep.set({
                    "_id": levelId
                })
                Cstep.once('sync', function() {
                    $('.courseSearchResults_Bottom').append('<h3>'+App.languageDict.attributes.Edit_Step+'</h3>')
                    lForm.edit = true
                    lForm.ques1 = Cstep.get("questionslist")
                    lForm.res = Cstep.get("resourceId")
                    lForm.rest = Cstep.get("resourceTitles")
                    lForm.previousStep = Cstep.get("step")
                    lForm.render();
                    $('.courseSearchResults_Bottom').append(lForm.el)
                    $("input[name='step']").attr("disabled", true);
                })
                Cstep.fetch({async:false});
            }
            if (totalLevels != -1) {
                var tl = parseInt(totalLevels) + 1
                $("input[name='step']").val(tl)
            }
            Backbone.Form.validators.errMessages.required=App.languageDict.attributes.Required_Text;
            $('.bbf-form .field-title label').html(App.languageDict.attributes.Title);
            $('.bbf-form .field-stepMethod label').html(App.languageDict.attributes.Step_Method);
            $('.bbf-form .field-description label').html(App.languageDict.attributes.Description);
            $('.bbf-form .field-stepGoals label').html(App.languageDict.attributes.Step_Goals);
            $('.bbf-form .field-step label').html(App.languageDict.attributes.Step);
            $('.bbf-form .field-passingPercentage label').html(App.languageDict.attributes.Passing_Percentage);
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);
        },

        ViewLevel: function(lid, rid) {
            var levelInfo = new App.Models.CourseStep({
                "_id": lid
            });
            var that = this
            levelInfo.fetch({
                success: function() {
                    var levelDetails = new App.Views.LevelDetail({
                        model: levelInfo
                    })
                    levelDetails.render();
                    App.$el.children('.body').html('<div class="courseEditStep"></div>');
                    $('.courseEditStep').append('<h3>'  +App.languageDict.attributes.Step +levelInfo.get("step") + ' | ' + levelInfo.get("title") + '</h3>')
                    $('.courseEditStep').append('<a class="btn btn-success" href=\'#level/add/' + levelInfo.get("courseId") + '/' + lid + '/-1\'">'+App.languageDict.attributes.Edit_Step+'</a>&nbsp;&nbsp;')
                    $('.courseEditStep').append("<a class='btn btn-success' href='#course/manage/" + levelInfo.get('courseId') + "'>"+App.languageDict.attributes.Back_To_Course+" </a>&nbsp;&nbsp;")
                    $('.courseEditStep').append("</BR></BR><B>"+App.languageDict.attributes.Description+"</B></BR><TextArea id='LevelDescription' rows='5' cols='100' style='width:98%;'>" + levelInfo.get("description") + "</TextArea></BR>")
                    $('.courseEditStep').append("<button class='btn btn-success backToSearchButton' onclick='document.location.href=\"#savedesc/" + lid + "\"'>"+App.languageDict.attributes.Save+"</button></BR></BR>")
                    $('.courseEditStep').append('<B>'+App.languageDict.attributes.Resources+'</B>&nbsp;&nbsp;<a class="btn btn-success"  style="" href=\'#search-bell/' + lid + '/' + rid + '\'">'+App.languageDict.attributes.Add+'</a>')
                    $('.courseEditStep').append(levelDetails.el)
                    $('.courseEditStep').append('</BR>')
                    if (levelInfo.get("questionslist") == null) {
                        $('.courseEditStep').append('<a class="btn btn-success backToSearchButton"   href=\'#create-test/' + levelInfo.get("_id") + '/' + levelInfo.get("_rev") + '/' + levelInfo.get("title") + '\'">'+App.languageDict.attributes.Create_Test+'</a>&nbsp;&nbsp;')
                    } else {
                        $('.courseEditStep').append('<B>' + levelInfo.get("title") + ' - '+App.languageDict.attributes.Test+'</B><a class="btn btn-primary backToSearchButton"   href=\'#create-test/' + levelInfo.get("_id") + '/' + levelInfo.get("_rev") + '/' + levelInfo.get("title") + '\'">'+App.languageDict.attributes.Edit_Test+'</a>&nbsp;&nbsp;')
                    }
                }
            });
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang)
        },

        saveDescprition: function(lid) {
            var level = new App.Models.CourseStep({
                "_id": lid
            })
            var that = this
            level.fetch({
                success: function() {
                    level.set("description", $('#LevelDescription').val())
                    var that = this
                    level.save()
                    level.on('sync', function() {
                        document.location.href = '#level/view/' + lid + '/' + level.get("rev");
                    })
                }
            })
        },

        CourseSearch: function() {
            var cSearch
            cSearch = new App.Views.CourseSearch();
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict = languageDictValue;
            cSearch.render()
            var parentDiv='<div id="parentLibrary" style="visibility;hidden"></div>';
            var lib_page = $.url().data.attr.fragment;
            if(lib_page=="courses"){
                $('.body').empty();
                $('#parentLibrary').css('visibility', 'visible');
            }
            App.$el.children('.body').append(parentDiv);
            var button = '<p id="library-top-buttons">'
            button += '<a id="addCourseButton" class="btn btn-success" href="#course/add">'+App.languageDict.attributes.Add_Course+'</a>'
            button += '<a id="requestCourseButton" class="btn btn-success" onclick=showRequestForm("Course")>'+App.languageDict.attributes.Request_Course+'</a>'
            button += '<a  id="listAllCoursesBtn" class="btn btn-info" onclick="ListAllCourses()">'+App.languageDict.attributes.View_All_Courses+'</a>'
            button += '<span id="searchSpan"><input id="searchText" value="" size="30" style="height:24px;margin-top:1%;" type="text"><span>'
            button += '<button class="btn btn-info" onclick="CourseSearch()">'+App.languageDict.attributes.Search+'</button></span>'
            button += '</p>'
            $('#parentLibrary').append( button);
            $('#parentLibrary').append('<h3 id="headingOfCourses">'+App.languageDict.attributes.Courses+'</h3>')
            App.$el.children('.body').append(cSearch.el);
            cSearch.changeDirection();
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right") {
                $("#requestCourseButton").addClass('addMarginsOnRequestCourse');
                $("#addCourseButton").addClass('addMarginsOnCourseUrdu');
                $('#searchText').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                $('#searchText').css('margin-right','1%');
                $('#headingOfCourses').css('margin-right','2%');
                $('#searchSpan').find('span').css("margin-right","10px");
            } else {
                $('#searchSpan').css('float','right');
                $('#requestCourseButton').css('margin-left','10px');
                $("#addCourseButton").addClass('addMarginsOnCourse');
                $('#searchText').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                $('#listAllCoursesBtn').css("margin-left","10px");
                $('#searchSpan').find('span').css("margin-left","10px");
            }
        },

        ListMeetups: function() {
            var languageDictValue, lang;
            lang = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict = languageDictValue;
            var parentDiv='<div id="parentLibrary" style="visibility;hidden"></div>';
            var lib_page = $.url().data.attr.fragment;
            if(lib_page=="meetups") {
                $('.body').empty();
                $('#parentLibrary').css('visibility', 'visible');
            }
            App.$el.children('.body').append(parentDiv);
            $('#parentLibrary').append(parentDiv);
            $('#parentLibrary').html('<h3 id="meetUpHeading">'+App.languageDict.attributes.Meetups+'<a id="linkOfMeetUpHeading" class="btn btn-success" href="#meetup/add">'+App.languageDict.attributes.Add+' '+App.languageDict.attributes.Meetups+'</a></h3>');
            var meetUps = new App.Collections.Meetups()
            meetUps.fetch({
                async: false
            })
            var meetUpView = new App.Views.MeetUpTable({
                collection: meetUps
            })
            meetUpView.render()
            $('#parentLibrary').append(meetUpView.el);
            meetUpView.changeDirection();
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right") {
                this.changeAllignmentOfListMeetup();
            } else {
                $('#linkOfMeetUpHeading').css('margin-left','20px');
            }
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        changeAllignmentOfListMeetup:function(){
            $('#meetUpHeading').css('margin-right','2%');
            $('#meetUpHeading').addClass('addResource');
            $('#linkOfMeetUpHeading').addClass('addMarginsOnResource');
        },

        Meetup_Detail: function(meetupId, title) {
            var meetupModel = new App.Models.MeetUp({
                _id: meetupId
            })
            meetupModel.fetch({
                async: false
            })
            var meetup_details = new App.Views.MeetupDetails({
                model: meetupModel
            })
            meetup_details.render()
            App.$el.children('.body').html(meetup_details.el);
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        usermeetupDetails: function(meetupId, title) {
            var meetupModel = new App.Models.MeetUp({
                _id: meetupId
            })
            meetupModel.fetch({
                async: false
            })
            var meetupView = new App.Views.meetupView({
                model: meetupModel
            })
            meetupView.render()
            App.$el.children('.body').html(meetupView.el);
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'))
        },

        Meetup: function(meetUpId) {
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict=languageDictValue;
            var className = "MeetUp"
            var model = new App.Models[className]()
            if (meetUpId) {
                model.id = meetUpId
                model.fetch({
                    async: false
                })
            }
            var modelForm = new App.Views[className + 'Form']({
                model: model
            })
            modelForm.render()
            App.$el.children('.body').html(modelForm.el)
            $('.form .field-startTime input').timepicker({
                'minTime': '8:00am',
                'maxTime': '12:30am'
            })
            $('.form .field-endTime input').timepicker({
                'minTime': '8:00am',
                'maxTime': '12:30am'
            })
            $('.form .field-startDate input').datepicker({
                todayHighlight: true
            });
            $('.form .field-endDate input').datepicker({
                todayHighlight: true
            });
            $('.form .field-reoccuring input').click(function() {
                if (this.value == 'Weekly') {
                    $('.form .field-Day').show()
                } else {
                    $('.form .field-Day').hide()
                }
            });
            $('#MeetUpformButton').html(languageDictValue.attributes.Save);
            $('.form .field-title label').html(languageDictValue.attributes.Title);
            $('.form .field-description label').html(languageDictValue.attributes.Description);
            $('.form .field-startDate label').html(languageDictValue.attributes.Start_date);
            $('.form .field-endDate label').html(languageDictValue.attributes.End_date);
            $('.form .field-Day label').html(languageDictValue.attributes.Day);
            $('.form .field-startTime label').html(languageDictValue.attributes.Start_Time);
            $('.form .field-endTime label').html(languageDictValue.attributes.End_Time);
            $('.form .field-category label').html(languageDictValue.attributes.Category);
            $('.form .field-meetupLocation label').html(languageDictValue.attributes.Location);
            $('.form .field-recurring label').eq(0).html(languageDictValue.attributes.Recurring);
            $('.form .field-recurring label').eq(1).html(languageDictValue.attributes.Daily);
            $('.form .field-recurring label').eq(2).html(languageDictValue.attributes.Weekly);
            var DaysObj=App.languageDict.get("Days");
            $('.form .field-Day .bbf-editor ul').find('li').eq(0).find('label').html(lookup(App.languageDict, "Days." + "Saturday"));
            $('.form .field-Day .bbf-editor ul').find('li').eq(1).find('label').html(lookup(App.languageDict, "Days." + "Sunday"));
            $('.form .field-Day .bbf-editor ul').find('li').eq(2).find('label').html(lookup(App.languageDict, "Days." + "Monday"));
            $('.form .field-Day .bbf-editor ul').find('li').eq(3).find('label').html(lookup(App.languageDict, "Days." + "Tuesday"));
            $('.form .field-Day .bbf-editor ul').find('li').eq(4).find('label').html(lookup(App.languageDict, "Days." + "Wednesday"));
            $('.form .field-Day .bbf-editor ul').find('li').eq(5).find('label').html(lookup(App.languageDict, "Days." + "Thursday"));
            $('.form .field-Day .bbf-editor ul').find('li').eq(6).find('label').html(lookup(App.languageDict, "Days." + "Friday"));
            var gradeLevelArray=App.languageDict.get('categoryList');
            for(var i=0;i<gradeLevelArray.length;i++)
            {
                $('.form .field-category select').find('option').eq(i).html(gradeLevelArray[i]);
            }
            applyCorrectStylingSheet(languageDictValue.get('directionOfLang'));
            if(languageDictValue.get('directionOfLang').toLowerCase()==="right") {
                $('#meetUpForm').addClass('courseSearchResults_Bottom');
                $('.form .bbf-field').css('float','none');
                $('.form .field-endDate').css('margin-right','259px');
                $('.form .field-endDate').css('margin-left','0px');
                $('.form .field-recurring').css('float','right');
                $('.form .field-endTime').css('margin-right','259px');
                $('.form .field-endTime').css('margin-left','0px');
            } else {
                $('#meetUpForm').removeClass('courseSearchResults_Bottom');
                $('.form .bbf-field').css('float','left');
            }
        },

        deleteMeetUp: function(meetupId) {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            if(confirm(languageDictValue.attributes.meetUp_delete_confirm)) {
                var UserMeetups = new App.Collections.UserMeetups()
                UserMeetups.meetupId = meetupId
                UserMeetups.fetch({
                    async: false
                })
                var model;
                while (model = UserMeetups.first()) {
                    model.destroy();
                }
                var meetupModel = new App.Models.MeetUp({
                    _id: meetupId
                })
                meetupModel.fetch({
                    async: false
                })
                meetupModel.destroy()
                Backbone.history.navigate('meetups', {
                    trigger: true
                })
            } else {
                Backbone.history.navigate('meetups');
            }
        },

        Members: function() {
            var membersView = new App.Views.MembersView()
            membersView.render();
            App.$el.children('.body').html(membersView.el);
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
            membersView.changeDirection();
            if(App.configuration.get('type') == 'nation') {
	            $.ajax({
	                url: '/community/_design/bell/_view/getCommunityByCode',
	                type: 'GET',
	                dataType: "jsonp",
	                async: false,
	                success: function(json) {
	                	var communityList = '<option value="'+App.configuration.get('code')+'">'+App.configuration.get('name')+'</option>';
	                	$.each(json.rows, function(rec, index) {
	                		communityList += '<option value="'+this.value.Code+'">'+this.value.Name+'</option>';
	                	})
	                	communityList = '<select id="selectCommunity" style="margin-right: 30px;">'+communityList+'</select>';
	                	$(communityList).insertBefore('#searchText');
                	}
	            });
        	}
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right") {
                $('#membersSearchHeading').css('float','left');
                $("#AddNewMember").addClass('addMarginsOnCourseUrdu');
                $('#searchText').attr('placeholder',App.languageDict.attributes.Last_Name);
                $('#searchButtonOnMembers').css('margin-right','10px');
            } else {
                $('#membersSearchHeading').css('float','right');
                $('#searchText').css('margin-right','15px');
                $('#searchText').css('height','28px');
                $('#searchText').css('width','170px');
                $('#searchText').attr('placeholder',App.languageDict.attributes.Last_Name);
                $('#searchButtonOnMembers').css('margin-top','-10px');
            }
        },

        Reports: function() {
            App.startActivityIndicator()
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);
            var roles = this.getRoles()
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
                App.$el.children('.body').append('<p id="firstHeadingOfReports" style="margin-top:10px"><a id="fHonRep" class="btn btn-success" href="#reports/add">'+App.languageDict.attributes.Add_a_New_Report+'</a>' +
                    '<a id="sHonRep" style="margin-left:20px" class="btn btn-success" href="#logreports">'+App.languageDict.attributes.Activity_Report+'</a>' +
                    '<a style="margin-left:20px" class="btn btn-success" href="#trendreport">'+App.languageDict.attributes.Trend+' '+App.languageDict.attributes.Activity_Report+'</a></p>')
            } else {
                App.$el.children('.body').append('<p id="sHonRep" style="margin-top:10px;margin-left:10px;"><a class="btn btn-success" href="#logreports">'+App.languageDict.attributes.Activity_Report+'</a></p>')
            }
            var temp;
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false,
                success: function(){
                    temp = config.first().attributes.name;
                }
            })
            temp=temp.charAt(0).toUpperCase() + temp.slice(1);
            var typeofBell=config.first().attributes.type;
            if (typeofBell === "nation") {
                temp = temp +' '+ App.languageDict.attributes.Nation+' '+App.languageDict.attributes.Bell;
            } else {
                temp = temp + ' ' +App.languageDict.attributes.Nation+' '+App.languageDict.attributes.Bell;
            }
            App.$el.children('.body').append('<h4 id="secondHeadingOfReports"><span style="color:gray;">' + temp + '</span> | '+App.languageDict.attributes.Reports+'</h4>')
            var tableDiv="<div id='reportTable'></div>";
            App.$el.children('.body').append(tableDiv);
            $('#reportTable').append(resourcesTableView.el);
            if(directionOfLang.toLowerCase()==="right"){
                $('#firstHeadingOfReports').css('direction','rtl');
                $('#reportTable').css('direction','rtl');
                $('#secondHeadingOfReports').css('direction','rtl');
                $('#secondHeadingOfReports').css('direction','rtl');
                $('#fHonRep').addClass('addMarginsOnResource');
                $('#sHonRep').addClass('addMarginsOnResource');
            }
            App.stopActivityIndicator()
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

        aggregateDataForTrendReport: function(CommunityName, logData) {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            // now we will assign values from first of the activitylog records, returned for the period from startDate to
            // endDate, to local variables  so that we can keep aggregating values from all the just fetched activitylog
            // records into these variables and then just display them in the output
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
                alert(App.languageDict.attributes.No_Activity_Logged)
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
            //Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
            if (logReport.resources_names) {
                report_resNames = logReport.resources_names
            }
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
                    report_male_new_signups += (logDoc.male_new_signups ? logDoc.male_new_signups : 0);
                    report_female_new_signups += (logDoc.female_new_signups ? logDoc.female_new_signups : 0);
                    report_female_deleted += (logDoc.female_deleted_count ? logDoc.female_deleted_count : 0);
                    report_male_deleted += (logDoc.male_deleted_count ? logDoc.male_deleted_count : 0);
                    var resourcesIds = logDoc.resourcesIds;
                    //Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                    var resourcesNames = logDoc.resources_names;
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
                                //Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                                if (resourcesNames!= undefined && resourcesNames != null){
                                    if(resourcesNames.length > 0) {
                                        report_resNames.push(resourcesNames[i])
                                    }
                                }
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
                    var name = res.get('title');
                    // create most freq opened resource entry and push it into Most_Freq_Opened array
                    most_freq_res_entry = {
                        "resourceName": name,
                        "timesOpenedCumulative": times_opened_cumulative[indices[i]],
                        "timesOpenedByMales": report_male_opened[indices[i]],
                        "timesOpenedByFemales": report_female_opened[indices[i]]
                    };
                    if ((indexFound = report_resRated.indexOf(report_resOpened[indices[i]])) === -1) { // resource not rated
                        most_freq_res_entry["avgRatingCumulative"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["avgRatingByMales"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["avgRatingByFemales"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["timesRatedByMales"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["timesRatedByFemales"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["timesRatedCumulative"] = languageDictValue.attributes.Not_Applicable;
                    } else {
                        timesRatedTotalForThisResource = report_male_timesRated[indexFound] + report_female_timesRated[indexFound];
                        sumOfRatingsForThisResource = report_male_rating[indexFound] + report_female_rating[indexFound];
                        var testValueHighestFrequencyRating= Math.round((sumOfRatingsForThisResource / timesRatedTotalForThisResource) * 100) / 100;
                        var ratingMaxFreq;
                        if(isNaN(testValueHighestFrequencyRating)) {
                            ratingMaxFreq=0;
                        } else {
                            ratingMaxFreq=testValueHighestFrequencyRating;
                        }
                        most_freq_res_entry["avgRatingCumulative"] = ratingMaxFreq;
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
                    timesRatedTotalForThisResource = report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]];
                    // create highest rated resource entry and push it into Highest_Rated_Resources array
                    var testValueHighestRating=Math.round(resources_rated_cumulative[indicesHighestRated[i]] * 100) / 100;
                    var ratingHighest;
                    if(isNaN(testValueHighestRating)) {
                        ratingHighest=0;
                    } else {
                        ratingHighest=testValueHighestRating;
                    }
                    entry_rated_highest = {
                        "resourceName": name,
                        "avgRatingCumulative": ratingHighest,
                        "avgRatingByMales": report_male_rating[indicesHighestRated[i]],
                        "avgRatingByFemales": report_female_rating[indicesHighestRated[i]],
                        "timesRatedByMales": report_male_timesRated[indicesHighestRated[i]],
                        "timesRatedByFemales": report_female_timesRated[indicesHighestRated[i]],
                        "timesRatedCumulative": report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]]
                    };
                    if ((indexFound = report_resOpened.indexOf(report_resRated[indicesHighestRated[i]])) === -1) { // resource not rated
                        entry_rated_highest["timesOpenedByMales"] = languageDictValue.attributes.Not_Applicable;
                        entry_rated_highest["timesOpenedByFemales"] = languageDictValue.attributes.Not_Applicable;
                        entry_rated_highest["timesOpenedCumulative"] = languageDictValue.attributes.Not_Applicable;
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
                    });

                    var testValueLowestRating=Math.round(resources_rated_cumulative[indicesLowestRated[i]] * 100) / 100;
                    var ratingLowest;
                    if(isNaN(testValueLowestRating)){
                        ratingLowest=0;
                    } else {
                        ratingLowest=testValueLowestRating;
                    }
                    var name = res.get('title')
                    entry_rated_lowest = {
                        "resourceName": name,
                        "avgRatingCumulative": ratingLowest,
                        "avgRatingByMales": report_male_rating[indicesLowestRated[i]],
                        "avgRatingByFemales": report_female_rating[indicesLowestRated[i]],
                        "timesRatedByMales": report_male_timesRated[indicesLowestRated[i]],
                        "timesRatedByFemales": report_female_timesRated[indicesLowestRated[i]],
                        "timesRatedCumulative": report_male_timesRated[indicesLowestRated[i]] + report_female_timesRated[indicesLowestRated[i]]
                    };
                    if ((indexFound = report_resOpened.indexOf(report_resRated[indicesLowestRated[i]])) === -1) { // resource not rated
                        entry_rated_lowest["timesOpenedByMales"] = languageDictValue.attributes.Not_Applicable;
                        entry_rated_lowest["timesOpenedByFemales"] = languageDictValue.attributes.Not_Applicable;
                        entry_rated_lowest["timesOpenedCumulative"] = languageDictValue.attributes.Not_Applicable;
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
        getRegisteredMembersCount: function(callback) {
            var maleMembers = 0,
                femaleMembers = 0;
            $.ajax({
                url: '/activitylog/_design/bell/_view/GetMaleCountByCommunity?key="' + App.configuration.get('code') + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(json) {
                    if (json.rows[0]) {
                        maleMembers = json.rows[0].value
                    }
                    $.ajax({
                        url: '/activitylog/_design/bell/_view/GetFemaleCountByCommunity?key="' + App.configuration.get('code') + '"',
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

        getRegisteredMembersCountFromMembersDB: function(callback) {
            var maleMembers = 0,
                femaleMembers = 0;
            $.ajax({
                url: '/members/_design/bell/_view/MaleCountByCommunity?key="' + App.configuration.get('code') + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(json) {
                    if (json.rows[0]) {
                        maleMembers = json.rows[0].value
                    }
                    $.ajax({
                        url: '/members/_design/bell/_view/FemaleCountByCommunity?key="' + App.configuration.get('code') + '"',
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
        getTotalMemberVisits: function(callback) {
            var maleVisits = 0,
                femaleVisits = 0;
            $.ajax({
                url: '/activitylog/_design/bell/_view/GetMaleVisitsByCommunity?key="' + App.configuration.get('code') + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(json) {
                    if (json.rows[0]) {
                        maleVisits = json.rows[0].value
                    }
                    $.ajax({
                        url: '/activitylog/_design/bell/_view/GetFemaleVisitsByCommunity?key="' + App.configuration.get('code') + '"',
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

        trendReport: function() {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            var context = this;
            App.$el.children('.body').html('');
            $('<div id="trend-report-form"></div>').appendTo(App.$el.children('.body'));
            var label = $("<label>").text(languageDictValue.attributes.TrendReport_msg+' ');
            $('#trend-report-form').append(label);
            var today = new Date();
            var input = $('<input type="text">').attr({
                id: 'dateSelect',
                name: 'dateSelect',
                value: today.getFullYear().toString() + '-' + ((today.getMonth()) < 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + ((today.getDate()) < 9 ? '0' + today.getDate() : today.getDate())
            });
            input.width(85);
            input.appendTo(label);
            $('#dateSelect').datepicker({
                dateFormat: "yy-mm-dd",
                changeMonth: true, //this option for allowing user to select month
                changeYear: true //this option for allowing user to select from year range
            });
            var button = $('<input type="button">').attr({
                id: 'submit',
                name: 'submit',
                class: "btn btn-success",
                value: languageDictValue.attributes.Generate_Report
            });
            $('#trend-report-form').append(button);
            if (directionOfLang.toLowerCase() === "right") {
                $('#trend-report-form').addClass('courseSearchResults_Bottom');
            }else {
                $('#trend-report-form').removeClass('courseSearchResults_Bottom');
            }
            button.click(function() {
                var dateChosen = $('#dateSelect').val();
                if (dateChosen) {
                    // compute the month start date corresponding to the date chosen by user as the ending date for trend report
                    var endDateForTrendReport = $('#dateSelect').datepicker("getDate"); // selected date turned into javascript 'Date' format
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
                    var activityDataColl = new App.Collections.ActivityLog();
                    var urlTemp = App.Server + '/activitylog/_design/bell/_view/getDocByCommunityCode?include_docs=true&startkey=["' + App.configuration.get('code') + '","' + startDate + '"]&endkey=["' +
                        App.configuration.get('code') + '","' + endDate + '"]';
                    activityDataColl.setUrl(urlTemp);
                    activityDataColl.fetch({ // logData.logDate is not assigned any value so the view called will be one that uses start and
                        // end keys rather than logdate to fetch activitylog docs from the db
                        async: false
                    });
                    activityDataColl.toJSON();
                    // iterate over activitylog models inside the activityDataColl collection and assign each to the month range in which they lie
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
                        var min = context.turnDateToYYYYMMDDFormat(lastMonthStartDate);
                        var max = context.turnDateToYYYYMMDDFormat(endDateForTrendReport);
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
                    var monthNames = [lookup(languageDictValue, "Months." + "January"), lookup(languageDictValue, "Months." + "February"), lookup(languageDictValue, "Months." + "March"), lookup(languageDictValue, "Months." + "April"), lookup(languageDictValue, "Months." + "May"), lookup(languageDictValue, "Months." + "June"), lookup(languageDictValue, "Months." + "July"), lookup(languageDictValue, "Months." + "August"), lookup(languageDictValue, "Months." + "September"), lookup(languageDictValue, "Months." + "October"), lookup(languageDictValue, "Months." + "November"),lookup(languageDictValue, "Months." + "December")];
                    // show registered members at end of each month falling in duration of this report
                    var totalRegisteredMembers = {
                        male: 0,
                        female: 0
                    };
                    context.getRegisteredMembersCount(function(param1, param2) {
                        totalRegisteredMembers['male'] = param1;
                        totalRegisteredMembers['female'] = param2;
                    });
                    var totalRegisteredMembersFromMembersDb = {
                        male: 0,
                        female: 0
                    };
                    context.getRegisteredMembersCountFromMembersDB(function(param1, param2) {
                        totalRegisteredMembersFromMembersDb['male'] = param1;
                        totalRegisteredMembersFromMembersDb['female'] = param2;
                    });
                    var totalMemberVisits = {
                        male: 0,
                        female: 0
                    };
                    context.getTotalMemberVisits(function(param1, param2) {
                        totalMemberVisits['male'] = param1;
                        totalMemberVisits['female'] = param2;
                    });
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
                    // TrendActivityReport View from TrendActivityReport.js
                    var trendActivityReportView = new App.Views.TrendActivityReport();
                    trendActivityReportView.data = aggregateDataset;
                    trendActivityReportView.startDate = activityDataColl.startkey;
                    trendActivityReportView.endDate = activityDataColl.endkey;
                    trendActivityReportView.render();
                    App.$el.children('.body').html(trendActivityReportView.el);
                    $('#trend-report-div-total-members').highcharts({
                        chart: {
                            type: 'column',
                            borderColor: '#999999',
                            borderWidth: 2,
                            borderRadius: 10
                        },
                        title: {
                            text: languageDictValue.attributes.registered_past_twelve_months //Total Members Previously
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
                                text: languageDictValue.attributes.Members_Count
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
                            name: languageDictValue.attributes.Males,
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
                            name: languageDictValue.attributes.Females,
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
                            name: languageDictValue.attributes.Total,
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
                    //Total Member Visits
                    $('#trend-report-div-total-member-visits').highcharts({
                        chart: {
                            type: 'column',
                            borderColor: '#999999',
                            borderWidth: 2,
                            borderRadius: 10
                        },
                        title: {
                            text: languageDictValue.attributes.visits_past_twelve_months // Total Visits
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
                                text: languageDictValue.attributes.Visits_Count
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
                            name: languageDictValue.attributes.Males,
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
                            name: languageDictValue.attributes.Females,
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
                            name: languageDictValue.attributes.Total,
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
                    //Active Members This Month
                    $('#trend-report-div-new-memberships').highcharts({
                        chart: {
                            type: 'column',
                            borderColor: '#999999',
                            borderWidth: 2,
                            borderRadius: 10
                        },
                        title: {
                            text: languageDictValue.attributes.active_members_this_month
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
                                text: languageDictValue.attributes.Members_Count
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
                            name:languageDictValue.attributes.Males,
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
                            name: languageDictValue.attributes.Females,
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
                            name: languageDictValue.attributes.Total,
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
                    //Total Member Visits This Month
                    $('#trend-report-div-visits').highcharts({
                        chart: {
                            type: 'column',
                            borderColor: '#999999',
                            borderWidth: 2,
                            borderRadius: 10
                        },
                        title: {
                            text: languageDictValue.attributes.members_visits_this_month
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
                                text: languageDictValue.attributes.Visits_Count
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
                            name: languageDictValue.attributes.Males,
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
                            name: languageDictValue.attributes.Females,
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
                            name: languageDictValue.attributes.Total,
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
                    //   Total Resource Views This Month
                    $('#trend-report-div-total-resource-views-this-month').highcharts({
                        chart: {
                            type: 'column',
                            borderColor: '#999999',
                            borderWidth: 2,
                            borderRadius: 10
                        },
                        title: {
                            text: languageDictValue.attributes.resource_views_this_month
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
                                text: languageDictValue.attributes.Resource_Count
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
                            name: languageDictValue.attributes.Males,
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
                            name: languageDictValue.attributes.Females,
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
                            name: languageDictValue.attributes.Total,
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
                } else {
                    alert(App.languageDict.attributes.Select_Date);
                }
            });
            applyCorrectStylingSheet(directionOfLang);

        },
        isWithinRange: function(value, rangeMin, rangeMax) {

        },

        ReportForm: function(reportId) {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            var report = (reportId) ? new App.Models.CommunityReport({
                _id: reportId
            }) : new App.Models.CommunityReport()
            report.on('processed', function() {
                Backbone.history.navigate('report', {
                    trigger: true
                })
            })
            var reportFormView = new App.Views.ReportForm({
                model: report
            })
            reportFormView.render();
            App.$el.children('.body').html(reportFormView.el);
            if (report.id) {
                report.fetch()
            }
            reportFormView.render();
            $('.fields .bbf-form .field-title label').html(languageDictValue.attributes.Title);
            $('.fields .bbf-form .field-author label').html(languageDictValue.attributes.author);
            $('.fields .bbf-form .field-Date label').html(languageDictValue.attributes.Date);
            var DaysObj=App.languageDict.get("Months");
            for(var i=0;i<12;i++)
            {
                $('.fields .bbf-form .bbf-month option').eq(i).html(lookup(App.languageDict, "Months." + $('.fields .bbf-form .bbf-month option').eq(i).text().toString() ));
            }
            if (directionOfLang.toLowerCase() === "right") {

                $('.bbf-form').addClass('courseSearchResults_Bottom');
                $('#cont div').eq(0).css('width','100%');
                $('table').css('width','100%');
                $('.fields ul').addClass('courseSearchResults_Bottom')
            } else {
                $('.bbf-form').removeClass('courseSearchResults_Bottom');
                $('.fields ul').removeClass('courseSearchResults_Bottom')
            }
        },

        routeStartupTasks: function() {
            $('#invitationdiv').hide()
            $('#debug').hide()
        },

        Resource_Detail: function(rsrcid, sid, revid) {
            var resource = new App.Models.Resource({
                _id: rsrcid
            })
            resource.fetch({
                success: function() {
                    var Tags = resource.toJSON().Tag
                    var key = JSON.stringify(Tags);
                    var setTags = Array()
                    var TagColl = Backbone.Collection.extend({
                        url: App.Server + '/collectionlist/_design/bell/_view/DocById?keys=' + key + '&include_docs=true'
                    })
                    var collTag = new TagColl()
                    collTag.fetch({
                        async: false
                    })
                    collTag = collTag.first()
                    if (collTag != undefined) {
                        accessedTags = collTag.toJSON().rows
                        _.each(accessedTags, function(a) {

                            setTags.push(a.value)
                        })
                    }
                    resource.set({
                        'Tag': setTags
                    })
                    var resourceDetail = new App.Views.ResourcesDetail({
                        model: resource
                    })
                    resourceDetail.SetShelfId(sid, revid)
                    resourceDetail.render()
                    App.$el.children('.body').html(resourceDetail.el)
                }
            });
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        RenderTagSelect: function(iden) {
            var collections = new App.Collections.listRCollection()
            collections.major = true
            collections.fetch({
                async: false
            })
            collections.each(function(a) {
                $(iden).append('<option value="' + a.get('_id') + '" class="MajorCategory">' + a.get('CollectionName') + '</option>')
            })
            var subcollections = new App.Collections.listRCollection()
            subcollections.major = false
            subcollections.fetch({
                async: false
            })
            _.each(subcollections.last(subcollections.length).reverse(), function(a) {

                if (a.get('NesttedUnder') == '--Select--') {
                    $(iden).append('<option value="' + a.get('_id') + '">' + a.get('CollectionName') + '</option>')
                } else {
                    if ($(iden + ' option[value="' + a.get("NesttedUnder") + '"]') != null) {
                        $(iden).find('option[value="' + a.get("NesttedUnder") + '"]').after('<option value="' + a.get('_id') + '">' + a.get('CollectionName') + '</option>')
                    }
                }
            })
        },

        ResourceFeedback: function(resourceId) {
            var resource = new App.Models.Resource()
            resource.id = resourceId
            resource.on('sync', function() {
                var resourceFeedback = new App.Collections.ResourceFeedback()
                resourceFeedback.resourceId = resourceId
                var feedbackTable = new App.Views.FeedbackTable({
                    collection: resourceFeedback
                })
                resourceFeedback.on('sync', function() {
                    feedbackTable.render();
                    App.$el.children('.body').html('<div id="feedbackResourceDiv"></div>');
                    $('#feedbackResourceDiv').append('<h3>'+App.languageDict.attributes.Feedback_For+' "' + resource.get('title') + '"</h3>')
                    var url_togo = "#resource/feedback/add/" + resourceId + "/" + resource.get('title')
                    $('#feedbackResourceDiv').append('<a class="btn btn-primary"" href="' + url_togo + '"><i class="icon-plus"></i>'+App.languageDict.attributes.Add_your_feedback+'</a>')
                    $('#feedbackResourceDiv').append('<a class="btn btn-primary" style="margin:20px" href="#resources">'+App.languageDict.attributes.Back_to_Resources+'</a>')
                    $('#feedbackResourceDiv').append(feedbackTable.el)
                })
                resourceFeedback.fetch();
            })
            resource.fetch();
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);
            if(directionOfLang.toLowerCase()==="right") {
                $('.btable td').css('text-align','right');
                $('.btable th').css('text-align','right');
            } else {
                $('.btable td').css('text-align','left');
                $('.btable th').css('text-align','left');
            }
        },

        FeedbackForm: function(resourceId, title) {
            var feedbackModel = new App.Models.Feedback({
                resourceId: resourceId,
                memberId: $.cookie('Member._id')
            })
            feedbackModel.on('sync', function() {
                Backbone.history.navigate('resource/feedback/' + resourceId, {
                    trigger: true
                })
            })
            var resInfo = new App.Models.Resource({
                _id: resourceId
            })
            resInfo.fetch({
                async: false
            })
            var feedbackForm = new App.Views.FeedbackForm({
                model: feedbackModel
            })
            feedbackForm.rtitle = resInfo.get('title')
            var user_rating
            feedbackForm.render()
            App.$el.children('.body').html('<div id="feedbackResoDiv"></div>');
            $('#feedbackResoDiv').append('<h4 style="color:gray">'+App.languageDict.attributes.Add_Feedback_For+' '+'<span style="color:black;"> ' + resInfo.get('title') + '</span></h4>')
            $('#feedbackResoDiv').append('<p style="font-size:15px;">&nbsp;&nbsp;<span style="font-size:50px;">.</span>'+App.languageDict.attributes.Rating+'</p>')
            $('#feedbackResoDiv').append('<div id="star" data-score="0"></div>')
            $('#star').raty()
            $("#star > img").click(function() {
                feedbackForm.setUserRating($(this).attr("alt"))
            });
            $('#feedbackResoDiv').append(feedbackForm.el);
            $('.bbf-form').find('.field-comment').find('label').html(App.languageDict.attributes.Comment);
            var directionOfLang = App.languageDict.get('directionOfLang');
            applyCorrectStylingSheet(directionOfLang);
        },

        email: function() {
            App.$el.children('.body').html('&nbsp')
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()
            code = cofigINJSON.code
            Bellname = cofigINJSON.nationName
            var mymail = new App.Collections.Mails({
                skip: 0
            })
            mymail.fetch({
                async: false
            })
            var mailview = new App.Views.MailView({
                collection: mymail,
                community_code: code,
                nationName: Bellname
            })
            mailview.render()
            App.$el.children('.body').append(mailview.el)
            skipStack.push(skip)
            mailview.fetchRecords();
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
            $('#searchOnMail').find('input').eq(0).attr("placeholder",App.languageDict.get('searchMessages'))
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right"){
                $('#mailHeading').css({"color":"black","font-size":"25px","margin-right": "10%"})
                $('#searchOnMail').css("float","left");
                $('#errorMessage').css({"direction":"rtl"});
                $('#errorMessage').find('p').css({"color":"red","margin-right":"10%"});
            } else {
                $('#mailHeading').css({"color":"black","font-size":"25px"});
                $('#searchOnMail').css("float","right");
                $('#errorMessage').find('p').css({"color":"red","margin-left":"10%"});
            }
        },

        CoursesBarChart: function() {
            App.$el.children('.body').html('&nbsp') 
            App.$el.children('.body').append('<div id="detailView"><p id="graphtitle" style="text-align:center">'+App.languageDict.attributes.All_Courses_Progress+'</p><div id="graph2" class="flotHeight"></div><div id="choices" class="choice"></div></div><div id="birdEye"><div id="graph1" class="flotHeight"></div></div>')
            var coursesResults = new App.Collections.memberprogressallcourses()
            coursesResults.memberId = $.cookie('Member._id')
            coursesResults.fetch({
                async: false
            })
            var chart = new App.Views.CoursesChartProgress({
                collection: coursesResults
            })
            chart.render();
            App.$el.children('.body').append(chart.el);
            App.$el.children('.body').append('<div id="infoGraph"></div>')
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        AddToShelf: function(rId, title) {
            var memberShelfResource = new App.Collections.shelfResource()
            memberShelfResource.resourceId = rId
            memberShelfResource.memberId = $.cookie('Member._id')
            memberShelfResource.fetch({
                async: false
            })
            if (memberShelfResource.length == 0) {
                var shelfItem = new App.Models.Shelf()
                shelfItem.set('memberId', $.cookie('Member._id'))
                shelfItem.set('resourceId', rId)
                shelfItem.set('resourceTitle', unescape(title))
                //Adding the Selected Resource to the Shelf Hash(Dictionary)
                shelfItem.save(null, {
                    success: function(model, response, options) {}
                });
                alert(App.languageDict.attributes.Added_To_Shelf)
            } else {
                alert(App.languageDict.attributes.Duplicate_In_Shelf)
            }
        },

        AddToShelfAndSaveFeedback: function(rId, title) {
            var shelfResource = new App.Collections.shelfResource()
            shelfResource.resourceId = rId
            shelfResource.memberId = $.cookie('Member._id')
            shelfResource.fetch({
                async: false
            })
            if (shelfResource.length == 0) {
                var shelfItem = new App.Models.Shelf()
                shelfItem.set('memberId', $.cookie('Member._id'))
                shelfItem.set('resourceId', rId)
                shelfItem.set('resourceTitle', unescape(title))
                //Adding the Selected Resource to the Shelf Hash(Dictionary)
                shelfItem.save(null, {
                    success: function(model, response, options) {}
                });
                alert(App.languageDict.attributes.FeedBack_And_AddedToShelf)
            } else {
                alert(App.languageDict.attributes.FeedbackSaved_Not_Resource)
            }
        },

        CalendarFunction: function() {
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict=languageDictValue;
            App.$el.children('.body').html("<div id='addEvent' class='btn btn-primary' onclick =\"document.location.href='#addEvent'\">"+App.languageDict.attributes.Add_Event+"</div>")
            App.$el.children('.body').append("<br/><br/><div id='calendar'></div>")
            $(document).ready(function() {
                var temp2 = []
                var allEvents = new App.Collections.Calendars()
                allEvents.fetch({
                    async: false
                })
                allEvents.each(function(evnt) {
                    if (evnt.get('startDate') && evnt.get('endDate')) {
                        var sdate = evnt.get('startDate').split('/')
                        var edate = evnt.get('endDate').split('/')
                        daysindex = new Array(0, 1, 2, 3, 4, 5, 6)
                        var sdates = getScheduleDatesForCourse(new Date(sdate[2], --sdate[0], sdate[1]), new Date(edate[2], --edate[0], edate[1]), daysindex)
                        var stime = convertTo24Hour(evnt.get("startTime"))
                        var etime = convertTo24Hour(evnt.get("endTime"))
                        for (var i = 0; i < sdates.length; i++) {
                            var temp = new Object()
                            temp.title = evnt.get('title')
                            temp.start = new Date(sdates[i].setHours(stime))
                            temp.end = new Date(sdates[i].setHours(etime))
                            temp.url = "calendar/event/" + evnt.id
                            temp.allDay = false
                            temp2.push(temp)
                        }
                    }
                });
                var membercourses = new App.Collections.MemberCourses()
                membercourses.fetch({
                    async: false
                })
                membercourses.each(function(model) {
                    var daysindex
                    if (model.get("frequency") == "Daily") {
                        daysindex = new Array(0, 1, 2, 3, 4, 5, 6)
                    } else {
                        daysindex = new Array()
                        var week = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
                        var sweek = model.get("Day")
                        if (sweek instanceof Array) {} else {
                            var temp = sweek
                            sweek = new Array()
                            sweek[0] = temp
                        }
                        var i = 0
                        while (i < sweek.length) {
                            daysindex.push(week.indexOf(sweek[i]))
                            i++
                        }
                    }
                    if (model.get("startDate")) {
                        var sdate = model.get("startDate").split('/')
                        var edate = model.get("endDate").split('/')
                        var sdates = getScheduleDatesForCourse(new Date(sdate[2], --sdate[0], sdate[1]), new Date(edate[2], --edate[0], edate[1]), daysindex)
                        var stime = convertTo24Hour(model.get("startTime"))
                        var etime = convertTo24Hour(model.get("endTime"))
                        for (var i = 0; i < sdates.length; i++) {
                            var temp = new Object()
                            temp.title = '\nCourse: \n' + model.get('name')
                            temp.start = new Date(sdates[i].setHours(stime))
                            temp.end = new Date(sdates[i].setHours(etime))
                            temp.allDay = false
                            temp2.push(temp)
                        }
                    }
                });
                var memMeetup = new App.Collections.UserMeetups()
                memMeetup.memberId = $.cookie('Member._id')
                memMeetup.fetch({
                    async: false
                })
                memMeetup.each(function(meetup) {
                    model = new App.Models.MeetUp({
                        _id: meetup.get('meetupId')
                    })
                    model.fetch({
                        async: false
                    })
                    var daysindex
                    if (model.get("reoccuring") == "Daily") {
                        daysindex = new Array(0, 1, 2, 3, 4, 5, 6)
                    } else {
                        daysindex = new Array()
                        var week = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
                        var sweek = model.get("Day")
                        if (sweek instanceof Array) {} else {
                            var temp = sweek
                            sweek = new Array()
                            sweek[0] = temp
                        }
                        var i = 0
                        while (i < sweek.length) {
                            daysindex.push(week.indexOf(sweek[i]))
                            i++
                        }
                    }
                    if (model.get("startDate")) {
                        var sdate = model.get("startDate").split('/')
                        var edate = model.get("endDate").split('/')
                        var sdates = getScheduleDatesForCourse(new Date(sdate[2], --sdate[0], sdate[1]), new Date(edate[2], --edate[0], edate[1]), daysindex)
                        var stime = convertTo24Hour(model.get("startTime"))
                        var etime = convertTo24Hour(model.get("endTime"))
                        for (var i = 0; i < sdates.length; i++) {
                            var temp = new Object()
                            temp.title = '\nMeetup: \n' + model.get('title')
                            temp.start = new Date(sdates[i].setHours(stime))
                            temp.end = new Date(sdates[i].setHours(etime))
                            temp.allDay = false
                            temp2.push(temp)
                        }
                    }
                })
                var calendar = $('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    selectable: true,
                    eventClick: function(event) {
                        Backbone.history.navigate(event.url, {
                            trigger: true
                        })
                        return false
                    },
                    events: temp2
                });
            });
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        addEvent: function() {
            var model = new App.Models.Calendar()
            var modelForm = new App.Views.CalendarForm({
                model: model
            })
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict=languageDictValue;
            App.$el.children('.body').html('<h3 class="addEvent-heading">'+App.languageDict.get("Add_Event")+'</h3>')
            App.$el.children('.body').append(modelForm.el)
            modelForm.render();
            $('.bbf-form .field-title label').html(App.languageDict.get("Event_Name"));
            $('.bbf-form .field-description label').html(App.languageDict.get("Event_Description"));
            $('.bbf-form .field-startDate label').html(App.languageDict.get("Start_date"));
            $('.bbf-form .field-endDate label').html(App.languageDict.get("End_date"));
            $('.bbf-form .field-startTime label').html(App.languageDict.get("Start_Time"));
            $('.bbf-form .field-endTime label').html(App.languageDict.get("End_Time"));
            $('.bbf-form .field-startTime input').timepicker({
                'minTime': '8:00am',
                'maxTime': '12:30am'
            })
            $('.bbf-form .field-endTime input').timepicker({
                'minTime': '8:00am',
                'maxTime': '12:30am'
            })
            $('.bbf-form .field-startDate input').datepicker({
                todayHighlight: true
            });
            $('.bbf-form .field-endDate input').datepicker({
                todayHighlight: true
            });
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right"){
                $('.signup-form').css({"direction":"rtl"});
                $('.signup-submit').css({"margin-left":"0px","margin-right":"440px"});
            }
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        },

        calendaar: function(eventId) {
            App.$el.children('.body').html('&nbsp')
            var cmodel = new App.Models.Calendar({
                _id: eventId
            })
            cmodel.fetch({
                async: false
            })
            var eventView = new App.Views.EventInfo({
                model: cmodel
            })
            var languageDictValue;
            var lang = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(lang);
            App.languageDict=languageDictValue;
            eventView.render()
            App.$el.children('.body').append(eventView.el);
            if(App.languageDict.get("directionOfLang").toLowerCase()=="right"){
                $('#eventDetail-table').addClass('addResource');
                $('#eventDetail-table th h6').css("float","right");
                $('#eventDetail-table tbody').find('tr').eq(5).find('td a').css({"margin-left":"0px","margin-right":"10px"});
            }
            else {
                $('#eventDetail-table').removeClass('addResource');
            }
        },

        EditEvent: function(eventId) {
            var cmodel = new App.Models.Calendar({
                _id: eventId
            })
            cmodel.fetch({
                async: false
            })

            var modelForm = new App.Views.CalendarForm({
                model: cmodel
            })
            modelForm.update = true
            App.$el.children('.body').html('<h3 class="signup-heading">'+App.languageDict.get('Update_Event')+'</h3>')
            App.$el.children('.body').append(modelForm.el)
            modelForm.render()
        },
        //also used for collection editing from collection listing page
        EditTag: function(value) {
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var roles = this.getRoles()
            if (roles.indexOf("Manager") > -1) {

                if (value != 'Add New') {
                    var collections = new App.Collections.listRCollection()
                    collections.major = true
                    collections.fetch({
                        async: false
                    })
                    $('#invitationdiv').fadeIn(1000)
                    document.getElementById('cont').style.opacity = 0.2
                    document.getElementById('nav').style.opacity = 0.2
                    var collectionlist = new App.Models.CollectionList({
                        _id: value
                    })
                    collectionlist.fetch({
                        async: false
                    })
                    collections.remove(collectionlist)
                    var inviteForm = new App.Views.ListCollectionView({
                        model: collectionlist
                    })

                    inviteForm.render()

                    $('#invitationdiv').html('&nbsp')
                    $('#invitationdiv').append(inviteForm.el)
                    collections.each(function(a) {
                        $('#invitationForm .bbf-form .field-NesttedUnder select').append('<option value="' + a.get('_id') + '" class="MajorCategory">' + a.get('CollectionName') + '</option>')
                    })
                    $('#invitationForm .bbf-form .field-NesttedUnder select option[value="' + collectionlist.get('NesttedUnder') + '"]').attr('selected', 'selected');
                    if ($("#invitationForm .bbf-form .field-IsMajor input").is(':checked')) {
                        $("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'hidden')
                    } else {
                        $("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'visible')
                    }
                    $('#invitationForm .bbf-form .field-AddedDate input', this.el).datepicker({
                        todayHighlight: true
                    });
                    $("input[name='AddedBy']").attr("disabled", true);
                    var directionOfLang = App.languageDict.get('directionOfLang');
                    if (directionOfLang.toLowerCase() === "right") {
                        $('#invitationdiv').css('direction','ltr');
                        $('.field-CollectionName').find('label').html(App.languageDict.attributes.Collection_Name);
                        $('.field-NesttedUnder').find('label').html(App.languageDict.attributes.Nested_Under);
                        $('.field-NesttedUnder').find('.bbf-editor').find('select').find('option').eq(0).html(App.languageDict.attributes.Select_An_option);
                        $('.field-AddedDate').find('label').html(App.languageDict.attributes.Added_Date);
                        $('.field-Description').find('label').html(App.languageDict.attributes.Description);
                        $('.field-AddedBy').find('label').html(App.languageDict.attributes.added_by);
                        $('#formButton').html(App.languageDict.attributes.Save);
                        $('#cancelButton').html(App.languageDict.attributes.Cancel);
                    }
                }
            }
        },

        AddNewSelect: function(value) {
            if (value == 'Add New') {
                var collections = new App.Collections.listRCollection()
                collections.major = true
                collections.fetch({
                    async: false
                })
                $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.2
                document.getElementById('nav').style.opacity = 0.2
                var collectionlist = new App.Models.CollectionList()
                var inviteForm = new App.Views.ListCollectionView({
                    model: collectionlist
                })
                inviteForm.render()
                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el)
                $("input[name='AddedBy']").val($.cookie("Member.login"));
                var currentDate = new Date();
                $('#invitationForm .bbf-form .field-AddedDate input', this.el).datepicker({
                    todayHighlight: true
                });
                $('#invitationForm .bbf-form .field-AddedDate input', this.el).datepicker("setDate", currentDate);
                $("input[name='AddedBy']").attr("disabled", true);
                $("input[name='AddedDate']").attr("disabled", true);
                collections.each(function(a) {
                    $('#invitationForm .bbf-form .field-NesttedUnder select').append('<option value="' + a.get('_id') + '" class="MajorCategory">' + a.get('CollectionName') + '</option>')
                })
            } else {
                document.getElementById('cont').style.opacity = 1
                document.getElementById('nav').style.opacity = 1
                $('#invitationdiv').hide()
            }
            if (App.languageDict.get('directionOfLang').toLowerCase() === "right") {
                $('#invitationdiv').css('direction','ltr');
                $('.field-CollectionName').find('label').html(App.languageDict.attributes.Collection_Name);
                $('.field-NesttedUnder').find('label').html(App.languageDict.attributes.Nested_Under);
                $('.field-NesttedUnder').find('.bbf-editor').find('select').find('option').eq(0).html(App.languageDict.attributes.Select_An_option);
                $('.field-AddedDate').find('label').html(App.languageDict.attributes.Added_Date);
                $('.field-Description').find('label').html(App.languageDict.attributes.Description);
                $('.field-AddedBy').find('label').html(App.languageDict.attributes.added_by);
                $('#formButton').html(App.languageDict.attributes.Save);
                $('#cancelButton').html(App.languageDict.attributes.Cancel);
            }

        },

        Collection: function() {
            App.startActivityIndicator()
            var temp = $.url().data.attr.host.split(".") // get name of community
            temp = temp[0].substring(3)
            if (temp == "")
                temp = 'local'
            var roles = this.getRoles()
            var collections = new App.Collections.listRCollection()
            collections.major = true
            collections.fetch({
                success: function() {
                    var collectionTableView = new App.Views.CollectionTable({
                        collection: collections
                    })
                    collectionTableView.render()
                    App.$el.children('.body').html('<p id="firstParaOnCollections" style="margin-top:20px"><a id="addResourceOnCollection" class="btn btn-success" href="#resource/add">'+App.languageDict.attributes.Add_new_Resource+'</a><a id="requestResourceOnCollection" class="btn btn-success" onclick=showRequestForm("Resource")>'+App.languageDict.attributes.Request_Resource+'</a></p></span>')
                    var configurations = Backbone.Collection.extend({
                        url: App.Server + '/configurations/_all_docs?include_docs=true'
                    });
                    var config = new configurations();
                    config.fetch({
                        async: false
                    });
                    var jsonConfig = config.first().toJSON().rows[0].doc;
                    if(jsonConfig.type == "nation") {
                        if(roles.indexOf("Manager") >= 0 || roles.indexOf("SuperManager") >= 0 ) {
                            App.$el.children('.body').append('<p id="secLabelOnCollections" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;">'+App.languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;color:#0088CC;text-decoration: underline;">'+App.languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/pending"style="font-size:30px;">'+languageDict.attributes.Pending_Resources+'</a></p>')
                        } else {
                            App.$el.children('.body').append('<p id="secLabelOnCollections" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;">'+App.languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;color:#0088CC;text-decoration: underline;">'+App.languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/byownership"style="font-size:30px;">'+languageDict.attributes.Local_Resources+'</a></p>')
                        }
                    } else {
                        App.$el.children('.body').append('<p id="secLabelOnCollections" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;">'+App.languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;color:#0088CC;text-decoration: underline;">'+App.languageDict.attributes.Collection_s+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#resources/community"style="font-size:30px;">'+languageDict.attributes.Local_Resources+'</a></p>')
                    }
                    if (roles.indexOf("Manager") != -1)
                        $('#secLabelOnCollections').append('<button id="AddCollectionOnCollections"  class="btn btn-success"  onclick="AddColletcion()">'+App.languageDict.attributes.Add_Collection+'</button>')
                    App.$el.children('.body').append(collectionTableView.el);
                },
                async: false
            })
            var subcollections = new App.Collections.listRCollection()
            subcollections.major = false
            subcollections.fetch({
                async: false
            })
            if (roles.indexOf("Manager") != -1) {
                _.each(subcollections.last(subcollections.length).reverse(), function(a) {
                    if (a.get('NesttedUnder') == '--Select--') {
                        $('#collectionTable').append('<tr><td><a href="#listCollection/' + a.get('_id') + '/' + a.get('CollectionName') + '">' + a.get('CollectionName') + '</a></td><td><button onclick=EditColletcion(' + a.get('_id') + ')><i class="icon-edit pull-right"></i></button></td></tr>')
                    } else {
                        $('#' + a.get('NesttedUnder') + '').parent().after('<tr><td>&nbsp&nbsp&nbsp&nbsp<a href="#listCollection/' + a.get('_id') + '/' + a.get('CollectionName') + '">' + a.get('CollectionName') + '</a></td><td><button onclick=EditColletcion("' + a.get('_id') + '")><i class="icon-edit pull-right"></i></button></td></tr>')

                    }

                });
            } else {
                _.each(subcollections.last(subcollections.length).reverse(), function(a) {
                    if (a.get('NesttedUnder') == '--Select--') {
                        $('#collectionTable').append('<tr><td><a href="#listCollection/' + a.get('_id') + '/' + a.get('CollectionName') + '">' + a.get('CollectionName') + '</a></td><td></td></tr>')
                    } else {
                        $('#' + a.get('NesttedUnder') + '').parent().after('<tr><td>&nbsp&nbsp&nbsp&nbsp<a href="#listCollection/' + a.get('_id') + '/' + a.get('CollectionName') + '">' + a.get('CollectionName') + '</a></td><td></td></tr>')

                    }
                });
            }
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'))
            if(App.languageDict.get('directionOfLang').toLowerCase()==="right")
            {
                $('.table td').css('text-align','right');
                $('.table th').css('text-align','right');
            }
            else {
                $('.table td').css('text-align','left');
                $('.table th').css('text-align','left');
            }
            App.stopActivityIndicator();
        },

        mergecollection: function(collectionIdes, collectionText) {
            for (var i = 0; i < collectionIdes.length; i++) {
                var collModel = new App.Models.CollectionList({
                    _id: collectionIdes[i]
                })
                collModel.fetch({
                    success: function(res) {
                        res.destroy()
                    }
                })
            }
            var resColl = new App.Collections.Resources()
            resColl.collectionName = JSON.stringify(collectionIdes)
            resColl.fetch({
                success: function(res) {
                    var collectionModel = new App.Models.CollectionList()
                    collectionModel.set('CollectionName', collectionText)
                    collectionModel.set('Description', "")
                    collectionModel.set('IsMajor', true)
                    collectionModel.set('NesttedUnder', '--Select--')
                    collectionModel.set('AddedBy', $.cookie('Member.login'))
                    collectionModel.set('AddedDate', new Date())
                    collectionModel.set('show', true)
                    collectionModel.save(null, {
                        success: function(responceCollec, revInfo) {
                            var newCollId = revInfo.id
                            res.each(function(model) {
                                resourceTags = model.get('Tag')
                                if (Array.isArray(resourceTags)) {
                                    for (var i = 0; i < collectionIdes.length; i++)
                                        if (resourceTags.indexOf(collectionIdes[i]) != -1) {
                                            var index = resourceTags.indexOf(collectionIdes[i])
                                            resourceTags.splice(index, 1)
                                        }
                                    resourceTags.push(newCollId)
                                    model.set('Tag', resourceTags)
                                    model.save()
                                }
                            })
                            alert(App.languageDict.attributes.Collections_Merge_Success)
                            document.getElementById('cont').style.opacity = 1
                            document.getElementById('nav').style.opacity = 1
                            $('#invitationdiv').hide()
                            location.reload()
                        }
                    })
                }
            })
        },

        viewAllFeedback: function() {
            feed = new App.Collections.siteFeedbacks()
            feed.fetch({
                success: function() {
                    feedul = new App.Views.siteFeedbackPage({
                        collection: feed
                    })
                    feedul.render()
                    App.$el.children('.body').html('&nbsp')
                    App.$el.children('.body').append(feedul.el)
                }
            })
        },

        ListCollection: function(collectionId, collectionName) {
            App.startActivityIndicator()
            var that = this
            var temp = $.url().data.attr.host.split(".") // get name of community
            temp = temp[0].substring(3)
            if (temp == "")
                temp = 'local'
            var roles = this.getRoles()
            var collectionlist = new App.Models.CollectionList({
                _id: collectionId
            })
            collectionlist.fetch({
                async: false
            })
            var collId = Array()
            collId.push(collectionId)
            collId = JSON.stringify(collId);
            var resources = new App.Collections.Resources({
                collectionName: collId
            })
            resources.fetch({
                success: function() {
                    var resourcesTableView = new App.Views.ResourcesTable({
                        collection: resources
                    })
                    resourcesTableView.displayCollec_Resources = true
                    resourcesTableView.collections = App.collectionslist
                    resourcesTableView.isManager = roles.indexOf("Manager")
                    var languageDictValue,lang;
                    lang = getLanguage($.cookie('Member._id'));
                    languageDictValue = getSpecificLanguage(lang);
                    App.languageDict=languageDictValue;
                    App.$el.children('.body').empty();
                    App.$el.children('.body').html('<div id="parentLibrary"></div>');
                    App.$el.children('#parentLibrary').empty();
                    var btnText = '<p id="resourcePage" style="margin-top:20px"><a  id="addNewResource"class="btn btn-success" href="#resource/add">'+languageDict.attributes.Add_new_Resource+'</a>';

                    btnText += '<a id="requestResource" style="margin-left:10px" class="btn btn-success" onclick=showRequestForm("Resource")>'+languageDict.attributes.Request_Resource+'</a>';
                    $('#parentLibrary').append( btnText);

                    /*if(roles.indexOf("Manager") !=-1 &&  ( temp=='hagadera' || temp=='dagahaley' || temp=='ifo' || temp=='local' || temp=='somalia') )
                     App.$el.children('.body').append('<button style="margin:-90px 0px 0px 500px;" class="btn btn-success"  onclick = "document.location.href=\'#replicateResources\'">Sync Library to Somali Bell</button>')*/
                    $('#parentLibrary').append('<p id="labelOnResource" style="font-size:30px;color:#808080"><a href="#resources"style="font-size:30px;color:#0088CC;text-decoration: underline;">'+languageDict.attributes.Resources+'</a>&nbsp&nbsp|&nbsp&nbsp<a href="#collection" style="font-size:30px;">'+languageDict.attributes.Collection_s+'</a></p>')
                    $('#parentLibrary').append('<p id="colName"style="font-size: 30px;font-weight: bolder;color: #808080;width: 450px;word-wrap: break-word;">' + collectionlist.get('CollectionName') + '</p>')

                    resourcesTableView.render()
                    $('#parentLibrary').append(resourcesTableView.el);
                    if (languageDictValue.get('directionOfLang').toLowerCase()==="right")
                    {
                        $('#resourcePage').addClass('addResource');
                        $('#colName').addClass('addResource');
                        $('#colName').css("float","right");
                        $('#addNewResource').addClass('addMarginsOnResource');
                        $('#requestResource').addClass('addMarginsOnResource');
                        $('#labelOnResource').addClass('addResource');
                        //  $('#labelOnResource').attr("margin-right","2%");
                        $("#labelOnResource").css("margin-right","2%");
                        $('table').addClass('resourceTableClass');
                        $('.resourcInfoFirstCol').attr('colspan','8');
                        $('.resourcInfoCol').attr('colspan','3');
                        $('.resourcInfoCol').css('text-align','right');
                        $('.table th').css('text-align','right');
                        $('.table td').css('text-align','right');
                        $('#actionAndTitle').find('th').eq(1).css('text-align','center');
                    }
                    resourcesTableView.changeDirection();
                    //****************************************************************************
// make changes here for Issue # 70 (#resources)
                    //****************************************************************************
                    $('#backButton').click(function() {
                        Backbone.history.navigate('#collection', {
                            trigger: true
                        })
                    })
                    //****************************************************************************
                }
            });

            App.stopActivityIndicator()
        },
        NewsFeed: function() {
            this.underConstruction()
        },
        AllRequests: function() {
            App.$el.children('.body').html('&nbsp')
            var col = new App.Collections.Requests()
            col.fetch({
                async: false
            })
            var colView = new App.Views.RequestTable({
                collection: col
            })
            colView.render()
            App.$el.children('.body').append(colView.el);
            for(var i=1;i<=($('#requestsTable >tbody >tr').length)-1;i++)
            {
                $('#requestsTable').find('tr').eq(i).find('td').eq(1).html( App.languageDict.get($('#requestsTable').find('tr').eq(i).find('td').eq(1).html()));
            }
        },
        myRequests: function() {
            App.$el.children('.body').html('&nbsp')
            var col = new App.Collections.Requests({
                memberId: ($.cookie('Member._id'))
            })
            col.fetch({
                async: false
            })
            var colView = new App.Views.RequestTable({
                collection: col
            })
            colView.render()
            App.$el.children('.body').append(colView.el)
        },
        synchCommunityWithURL: function(communityurl, communityname) {
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "resources",
                    "target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/resources'
                }),
                success: function(response) {

                },
                async: false
            })
        },
        PochDB: function() {
            var memId = $.cookie('Member._id')
            var memName = $.cookie('Member.login')
            var logMember = new App.Collections.Members()
            var loggedIn = new App.Models.Member({
                "_id": memId
            })
            loggedIn.fetch({
                async: false
            })
            var URL = null
            var login = loggedIn.get("login")
            var hostUrl = Backbone.history.location.href
            hostUrl = hostUrl.split('/')
            var hostName = hostUrl[2].split('.')
            var FeedBackDb = new PouchDB('feedback');
            if (hostName[0].indexOf('cloudant') != -1) {
                // cloudant
                URL = 'http://' + hostName[0] + ':' + App.password + '@' + hostUrl[2]
            } else if (hostName[0].match(/^\d*[0-9](\.\d*[0-9])?$/)) {
                //other couchdbes that have no username and password
                URL = 'http://' + hostUrl[2]
            } else {
                URL = 'http://' + hostUrl[2]
            }
            FeedBackDb.replicate.to(URL + '/feedback', function(error, response) {
                if (error) {
                    console.log("FeedBackDb replication error :" + error)
                } else {
                    console.log("Successfully replicated FeedBackDb :" + response)
                }
            });
            this.syncResourceFeedback();
            this.WeeklyReports();
        },

        syncResourceFeedback: function() {
            var pouchResources = new PouchDB('resources');
            pouchResources.allDocs({
                include_docs: true
            }, function(err, response) {
                _.each(response.rows, function(pouchDoc) {

                    var resId = pouchDoc.doc._id
                    var couchResource = new App.Models.Resource({
                        _id: resId
                    })
                    couchResource.fetch({
                        success: function() {

                            if (couchResource.get('sum') == undefined || couchResource.get('timesRated') == undefined) {
                                couchResource.set('sum', 0)
                                couchResource.set('timesRated', 0)
                            } else {
                                couchResource.set('sum', parseInt(couchResource.get('sum')) + parseInt(pouchDoc.doc.sum))
                                couchResource.set('timesRated', parseInt(couchResource.get('timesRated')) + parseInt(pouchDoc.doc.timesRated))
                            }
                            couchResource.save(null, {
                                success: function(updatedModel, revisions) {
                                    pouchResources.put({
                                        sum: 0,
                                        timesRated: 0
                                    }, pouchDoc.doc._id, pouchDoc.doc._rev, function(err, info) {
                                        if (!err) {
                                            console.log(info)
                                        } else {
                                            console.log(err)
                                        }
                                    });

                                    pouchResources.remove(pouchDoc.doc._id, pouchDoc.doc._rev, function(err, removeResponse) {
                                        if (!err) {
                                            console.log(removeResponse)
                                        } else {
                                            console.log(err)
                                        }
                                    });

                                }
                            })

                        }
                    })

                })

            })

        },

        saveResources: function(URL) {
            var Resources = new PouchDB('resources');
            var Saving
            var Courses = new App.Collections.MemberCourses()
            Courses.memberId = $.cookie('Member._id')
            Courses.once('sync', function() {
                _.each(Courses.models, function(course) {
                    levels = new App.Collections.CourseLevels()
                    levels.courseId = course.id
                    levels.fetch({
                        async: false
                    })
                    levels.each(function(level) {
                        var resources = level.get('resourceId')
                        _.each(resources, function(res) {
                            var resource = new App.Models.Resource({
                                _id: res
                            })
                            resource.fetch({
                                success: function(resp) {
                                    var resModel = resp.toJSON()
                                    Resources.get(resModel._id, function(err, resdoc) {
                                        if (!err) {
                                            if (!resModel.sum || !resModel.timesRated) {
                                                resource.set('sum', 0)
                                                resource.set('timesRated', 0)
                                            } else {
                                                resource.set('sum', parseInt(resModel.sum) + parseInt(resdoc.sum))
                                                resource.set('timesRated', parseInt(resModel.timesRated) + parseInt(resdoc.timesRated))
                                            }
                                            resource.save(null, {
                                                success: function(rupdatedModel, revisoions) {
                                                    Resources.put({
                                                        sum: 0,
                                                        timesRated: 0
                                                    }, resdoc._id, resdoc._rev, function(error, info) {

                                                    })
                                                }
                                            })
                                        } else {
                                            Resources.post({
                                                _id: resModel._id,
                                                sum: 0,
                                                timesRated: 0
                                            })
                                        }
                                    })
                                }
                            })
                        })
                    })
                })
            })
            Courses.fetch()
        },

        saveFrequency: function(URL) {
            if ($.cookie('Member._id')) {
                var ResourceFrequencyDB = new PouchDB('resourcefrequency');
                var resourcefreq = new App.Collections.ResourcesFrequency()
                resourcefreq.memberID = $.cookie('Member._id')
                resourcefreq.fetch(null, {
                    success: function(doc, rev) {
                        var myjson = resourcefreq.first().toJSON()
                        ResourceFrequencyDB.put(myjson, myjson._id, myjson._rev, function(error, info) {
                            if (error) {
                                console.log("ResourceFrequencyDB replication error :" + error)
                            } else {
                                console.log("Successfully replicated ResourceFrequencyDB :" + info)
                            }
                        })
                    }
                })
                ResourceFrequencyDB.replicate.to(URL + '/resourcefrequency', function(error, response) {
                    if (error) {
                        console.log("ResourceFrequencyDB replication error :" + error)
                    } else {
                        console.log("Successfully replicated ResourceFrequencyDB :" + response)
                    }
                });
            }
        },

        LogQuery: function() {
            var type = "community";
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            });
            var config = new configurations();
            config.fetch({
                async: false
            });
            var currentConfig = config.first();
            var cofigINJSON = currentConfig.toJSON();
            if (cofigINJSON.rows[0].doc.type) {
                type = cofigINJSON.rows[0].doc.type
            }
            var log = new App.Views.LogQuery();
            log.type = type;
            log.render();
            App.$el.children('.body').html(log.el);
            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            if (directionOfLang.toLowerCase() === "right") {

                $('#start-date').css('margin-right','20px');
            }


            applyCorrectStylingSheet(directionOfLang);
            //currently hiding for all kind of communities and nations.
            $("#community-select").hide();
            $('#start-date').datepicker({
                dateFormat: "yy-mm-dd",
                todayHighlight: true
            });
            $('#end-date').datepicker({
                dateFormat: "yy-mm-dd",
                todayHighlight: true
            });

        },
        changeDateFormat: function(date) {
            var datePart = date.match(/\d+/g),
                year = datePart[0],
                month = datePart[1],
                day = datePart[2];
            return year + '/' + month + '/' + day;
        },
        deletePouchDB: function() {
            var Resources = new PouchDB('resources');
            Resources.destroy(function(err, info) {
                if (err)
                    console.log(err)
                else
                    console.log("deleted successfully " + info)
            })
            var FeedBackDb = new PouchDB('feedback');
            FeedBackDb.destroy(function(err, info) {
                if (err)
                    console.log(err)
                else
                    console.log("Successfully Deleted feedback" + info)
            });
            var Members = new PouchDB('members');
            Members.destroy(function(err, info) {
                if (err)
                    console.log(err)
                else
                    console.log("Successfully Deleted members" + info)
            });
            var ResourceFrequencyDB = new PouchDB('resourcefrequency');
            ResourceFrequencyDB.destroy(function(err, info) {
                if (err)
                    console.log(err)
                else
                    console.log("Successfully Destroy ResourceFrequency" + info)
            });
            var membercourseprogress = new PouchDB('membercourseprogress');
            membercourseprogress.destroy(function(err, info) {
                if (err)
                    console.log(err)
                else
                    console.log("Successfully Destroy membercourseprogress" + info)
            });
            var coursestep = new PouchDB('coursestep');
            coursestep.destroy(function(err, info) {
                if (err)
                    console.log(err)
                else
                    console.log("Successfully Destroy coursestep" + info)
            });

            var activitylogs = new PouchDB('activitylogs');
            activitylogs.destroy(function(err, info) {
                if (err)
                    console.log(err)
                else
                    console.log("Successfully Destroy activitylogs" + info)
            });
            return true
        },
        dbinfo: function() {
            var Resources = new PouchDB('resources');
            Resources.info(function(err, info) {
            })
            var FeedBackDb = new PouchDB('feedback');
            FeedBackDb.info(function(err, info) {
            })
            var Members = new PouchDB('members');
            Members.info(function(err, info) {
            })
            var ResourceFrequencyDB = new PouchDB('resourcefrequency');
            ResourceFrequencyDB.info(function(err, info) {
            })
            var CourseStep = new PouchDB('coursestep');
            CourseStep.info(function(err, info) {
            })
            var MemberCourseProgress = new PouchDB('membercourseprogress');
            MemberCourseProgress.info(function(err, info) {
            })
            var activitylogs = new PouchDB('activitylogs');
            activitylogs.info(function(err, info) {
            })
        },
        CompileAppManifest: function() {

            var apps = new App.Collections.Apps()
            var find = '{replace me}'
            var replace = '# Compiled at ' + new Date().getTime() + '\n'
            var defaultManifestURL = '/apps/_design/bell/manifest.default.appcache'
            var appsURL = '/apps/_design/bell'
            var transformedManifestURL = appsURL + '/manifest.appcache'

            apps.once('sync', function() {
                _.each(apps.models, function(app) {
                    _.each(app.get('_attachments'), function(value, key, list) {
                        if (key !== "manifest.appcache") replace += encodeURI('/apps/' + app.id + '/' + key) + '\n'
                    })
                })
                App.trigger('compile:appsListReady')
            })
            apps.fetch()

            App.once('compile:appsListReady', function() {

                $.get(defaultManifestURL, function(defaultManifest) {
                    var transformedManifest = defaultManifest.replace(find, replace)
                    $.getJSON(appsURL, function(appsDoc) {
                        var xhr = new XMLHttpRequest()
                        xhr.open('PUT', transformedManifestURL + '?rev=' + appsDoc._rev, true)
                        xhr.onload = function(response) {
                            App.trigger('compile:done')
                        }
                        xhr.setRequestHeader("Content-type", "text/cache-manifest");
                        xhr.send(new Blob([transformedManifest], {
                            type: 'text/plain'
                        }))
                    })
                })
            })
            App.once('compile:done', function() {
                alert(App.languageDict.attributes.Manifest_Error)
            })
        },

        CompileManifest: function() {
            App.startActivityIndicator()
            // The resources we'll need to inject into the manifest file
            var resources = new App.Collections.Resources()
            var apps = new App.Collections.Apps()
            var config = new App.Collections.Configurations()
            var MemberCourseProgress = new App.Collections.membercourseprogresses()
            var lang = new App.Collections.Languages()
            var members = new App.Collections.Members()
            var collectionlist = new App.Collections.listRCollection()
            var logMember = new App.Collections.Members()
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var login = loggedIn.get("login")
            logMember.login = login
            var Meetups = new App.Collections.Meetups()
            var Courses = new App.Collections.MemberCourses()
            Courses.memberId = $.cookie('Member._id')
            var Reports = new App.Collections.Reports()
            var memId = $.cookie('Member._id')
            var memName = $.cookie('Member.login')
            // The URL of the device where we'll store transformed files
            var deviceURL = '/devices/_design/all'
            // The location of the default files we'll tranform
            var defaultManifestURL = '/apps/_design/bell/manifest.default.appcache'
            var defaultUpdateURL = '/apps/_design/bell/update.default.html'
            var shelfitems = new App.Collections.shelfResource()
            shelfitems.compile = true
            // URLs to save transformed files to
            var transformedManifestURL = deviceURL + '/manifest.appcache'
            var transformedUpdateURL = deviceURL + '/update.html'
            // The string to find in the default manifest file that we'll replace with Resources
            var find = '{replace me}'
            var replace = '# Compiled at ' + new Date().getTime() + '\n'
            // Compile the new manifest file and save it to devices/all
            resources.on('sync', function() {
                App.trigger('compile:resourceListReady')
            })
            App.once('compile:resourceListReady', function() {
                apps.once('sync', function() {
                    _.each(apps.models, function(app) {
                        _.each(app.get('_attachments'), function(value, key, list) {
                            replace += encodeURI('/apps/' + app.id + '/' + key) + '\n'
                        })
                    })
                    App.trigger('compile:configurations')
                })
                apps.fetch()
            })
            App.once('compile:configurations', function() {
                config.once('sync', function() {
                    _.each(config.models, function(configs) {
                        replace += encodeURI('/configurations/_all_docs?include_docs=true') + '\n'
                    })
                    App.trigger('compile:languages')
                })
                config.fetch()
            })
            App.once('compile:languages', function() {
                lang.once('sync', function() {
                    _.each(lang.models, function(langs) {
                        replace += encodeURI('/languages/_all_docs?include_docs=true') + '\n'
                    })

                    App.trigger('compile:members')
                })
                lang.fetch()
            })
            App.once('compile:members', function() {

                members.once('sync', function() {
                    replace += encodeURI('/members/_design/bell/_view/Members?include_docs=true') + '\n'
                    _.each(members.models, function(mem) {
                        replace += encodeURI('/members/' + mem.id) + '\n'
                    })
                    App.trigger('compile:shelfResource')
                })
                members.fetch()
            })
            App.once('compile:shelfResource', function() {
                shelfitems.once('sync', function() {
                    replace += ('/shelf/_design/bell/_view/DuplicateDetection?include_docs=true&key="' + memId + '"') + '\n'
                    _.each(shelfitems.models, function(mem) {
                        var resId = mem.get('resourceId')
                        var resource = new App.Models.Resource({
                            _id: resId
                        })
                        resource.fetch({
                            success: function(resp) {
                                replace += encodeURI('/resources/' + resId) + '\n'
                                if (resource.get('kind') == 'Resource' && resource.get('_attachments')) {
                                    _.each(resource.get('_attachments'), function(value, key, list) {
                                        replace += encodeURI('/resources/' + resId + '/' + key) + '\n'
                                    })
                                }
                            }
                        })
                    })
                    App.trigger('compile:collectionList')
                })
                shelfitems.fetch()
            })
            App.once('compile:collectionList', function() {

                collectionlist.once('sync', function() {
                    replace += encodeURI('/collectionlist/_design/bell/_view/allrecords?include_docs=true') + '\n'
                    App.trigger('compile:Meetups')
                })
                collectionlist.fetch()
            })
            App.once('compile:Meetups', function() {
                Meetups.once('sync', function() {
                    replace += encodeURI('/meetups/_all_docs?include_docs=true') + '\n'
                    replace += encodeURI('/usermeetups/_design/bell/_view/getUsermeetups?key="' + memId + '"&include_docs=true') + '\n'
                    replace += encodeURI('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + memName + '"') + '\n'
                    _.each(Meetups.models, function(meetup) {
                        replace += encodeURI('/meetups/' + meetup.id) + '\n'
                    })
                    App.trigger('compile:Courses')
                })
                Meetups.fetch()
            })
            App.once('compile:Courses', function() {

                Courses.once('sync', function() {

                    replace += encodeURI('/courses/_all_docs?include_docs=true') + '\n'
                    replace += encodeURI('/courses/_design/bell/_view/GetCourses?key="' + memId + '"&include_docs=true') + '\n'

                    _.each(Courses.models, function(course) {
                        replace += encodeURI('/courses/' + course.id) + '\n'
                        replace += encodeURI('/coursestep/_design/bell/_view/StepsData?key="' + course.id + '"&include_docs=true') + '\n'
                        MemberCourseProgress.courseId = course.id
                        MemberCourseProgress.memberId = memId
                        MemberCourseProgress.fetch({
                            success: function() {
                                //don't encode this url because it contain's '[' & ']' which spoil the key
                                replace += ('/membercourseprogress/_design/bell/_view/GetMemberCourseResult?key=["' + memId + '","' + course.id + '"]&include_docs=true') + '\n'
                            }
                        })
                        levels = new App.Collections.CourseLevels()
                        levels.courseId = course.id
                        levels.fetch({
                            async: false
                        })
                        levels.each(function(level) {
                            var resources = level.get('resourceId')
                            _.each(resources, function(res) {
                                var resource = new App.Models.Resource({
                                    _id: res
                                })
                                resource.fetch({
                                    success: function(resp) {
                                        replace += encodeURI('/resources/' + res) + '\n'
                                        if (resource.get('kind') == 'Resource' && resource.get('_attachments')) {
                                            _.each(resource.get('_attachments'), function(value, key, list) {
                                                replace += encodeURI('/resources/' + res + '/' + key) + '\n'
                                            })
                                        }
                                    }
                                })

                            }, this)
                        }, this)
                    })
                    App.trigger('compile:CommunityReport')
                })
                Courses.fetch()
            })
            App.once('compile:CommunityReport', function() {
                Reports.once('sync', function() {
                    replace += encodeURI('/communityreports/_design/bell/_view/allCommunityReports?include_docs=true') + '\n'
                    _.each(Reports.models, function(report) {
                        replace += encodeURI('/communityreports/' + report.id) + '\n'
                    })
                    App.trigger('compile:appsListReady')
                })
                Reports.fetch()
            })
            App.once('compile:appsListReady', function() {
                $.get(defaultManifestURL, function(defaultManifest) {
                    var transformedManifest = defaultManifest.replace(find, replace)
                    $.getJSON(deviceURL, function(deviceDoc) {
                        var xhr = new XMLHttpRequest()
                        xhr.open('PUT', transformedManifestURL + '?rev=' + deviceDoc._rev, true)
                        xhr.onload = function(response) {
                            App.trigger('compile:done')
                        }
                        xhr.setRequestHeader("Content-type", "text/cache-manifest");
                        xhr.send(new Blob([transformedManifest], {
                            type: 'text/plain'
                        }))
                    })
                })
            })
            // Save the update.html file to devices/all
            App.once('compile:done', function() {
                $.get(defaultUpdateURL, function(defaultUpdateHTML) {
                    // We're not transforming the default yet
                    transformedUpdateHTML = defaultUpdateHTML
                    $.getJSON(deviceURL, function(deviceDoc) {
                        var xhr = new XMLHttpRequest()
                        xhr.open('PUT', transformedUpdateURL + '?rev=' + deviceDoc._rev, true)
                        xhr.onload = function(response) {
                            App.$el.children('.body').html('<a class="btn" href="' + transformedUpdateURL + '">Resources compiled. Click here to update your device.</a>')
                        }
                        xhr.setRequestHeader("Content-type", "text/html");
                        xhr.send(new Blob([transformedUpdateHTML], {
                            type: 'text/plain'
                        }))
                    })
                })
            })
            // Start the process
            resources.fetch()
            App.stopActivityIndicator()
        },

        UpdateManifest: function() {
            // The URL of the device where we'll store transformed files
            var deviceURL = '/devices/_design/all'
            // The location of the default files we'll tranform
            var defaultManifestURL = '/apps/_design/bell/manifest.default.appcache'
            // URLs to save transformed files to
            var transformedManifestURL = deviceURL + '/manifest.appcache'
            // The string to find in the default manifest file that we'll replace with Resources
            var find = '{replace me}'
            var replace = '# Compiled at ' + new Date().getTime() + '\n'

            // Compile the new manifest file and save it to devices/all


            $.get(defaultManifestURL, function(defaultManifest) {
                var transformedManifest = defaultManifest.replace(find, replace)
                $.getJSON(deviceURL, function(deviceDoc) {
                    var xhr = new XMLHttpRequest()
                    xhr.open('PUT', transformedManifestURL + '?rev=' + deviceDoc._rev, true)
                    xhr.onload = function(response) {}
                    xhr.setRequestHeader("Content-type", "text/cache-manifest");
                    xhr.send(new Blob([transformedManifest], {
                        type: 'text/plain'
                    }))
                })
            })


        },
        WeeklyReports: function() {
            var logdb = new PouchDB('activitylogs');
            var that = this;
            logdb.allDocs({
                    include_docs: true
                },
                function(err, response) {
                    if (!err) {
                        var collection = response.rows; // all docs from PouchDB's 'activitylogs' db
                        for (var i = 0; i < response.total_rows; i++) { // if # of rows is zero, then
                            // PouchDB's activitylogs db has no docs in it to sync to CouchDB's activitylog db
                            var pouchActivityLogDoc = collection[i].doc;
                            var activitylogDate = pouchActivityLogDoc.logDate;
                            var logModel = new App.Collections.ActivityLog();
                            logModel.logDate = activitylogDate;
                            logModel.fetch({
                                success: function(res, resInfo) {
                                    if (res.length == 0) { // CouchDB's activitylog db has ZERO (or NO) documents with attrib "logDate"
                                        // having value == collection[i].doc.logDate, so a new activitylog doc will be added to CouchDB
                                        // having same json as that of collection[i].doc's (pointed to by 'activitylog' var above)
                                        // from PouchDB's activitylogs db.
                                        that.createLogs(pouchActivityLogDoc);
                                    } else { // Couchdb's activitylog db does have atleast one doc having attrib "logDate" with a
                                        // value == collection[i].doc.logDate
                                        var logsonServer = res.first();
                                        that.updateLogs(pouchActivityLogDoc, logsonServer);
                                    }
                                },
                                error: function(err) {
                                    console.log("WeeklyReports:: Error looking for (daily) activitylog doc for today's date in CouchDB");
                                    //                                alert("WeeklyReports:: Error looking for (daily) activitylog doc for today's date in CouchDB");
                                }
                            });
                        }
                    } else {
                        console.log("Error fetching documents of 'activitylogs' db in PouchDB. Please try again or refresh page.");
                        //                    alert("Error fetching documents of 'activitylogs' db in PouchDB. Please try again or refresh page.");
                    }
                }
            );

        },
        createLogs: function(activitylog) {

            var toDelete_id = activitylog._id;
            var toDelete_rev = activitylog._rev;
            var logdb = new PouchDB('activitylogs');
            var dailylogModel = new App.Models.DailyLog();
            var dailyLog = activitylog;
            dailylogModel.set('logDate', activitylog.logDate);
            dailylogModel.set('community', activitylog.community);
            dailylogModel.set('resourcesIds', activitylog.resourcesIds)
            //***************************************************************************************
            //Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
            dailylogModel.set('resources_names', activitylog.resources_names) //Reources names to be added in activity log Issue # 84
            //*************************************************************************************
            dailylogModel.set('resources_opened', activitylog.resources_opened)
            dailylogModel.set('male_visits', activitylog.male_visits)
            dailylogModel.set('female_visits', activitylog.female_visits)

            dailylogModel.set('female_new_signups', ((activitylog.female_new_signups) ? activitylog.female_new_signups : 0))
            dailylogModel.set('male_new_signups', ((activitylog.male_new_signups) ? activitylog.male_new_signups : 0))

            dailylogModel.set('male_rating', activitylog.male_rating)
            dailylogModel.set('female_rating', activitylog.female_rating)
            dailylogModel.set('male_timesRated', activitylog.male_timesRated)
            dailylogModel.set('female_timesRated', activitylog.female_timesRated)
            dailylogModel.set('male_opened', activitylog.male_opened)
            dailylogModel.set('female_opened', activitylog.female_opened)
            dailylogModel.set('male_deleted_count', activitylog.male_deleted_count)
            dailylogModel.set('female_deleted_count', activitylog.female_deleted_count)

            dailylogModel.save(null, {
                success: function(res, resInfo) {
                    logdb.remove(activitylog, function(err, response) {
                        if (err) {
                            console.log('MyApp:: createLogs:: Failed to delete Pouch activitylog doc after it had been synced i-e its data pushed to (community) CouchDB');
                        } else {}
                    });
                }
            });

        },
        updateLogs: function(activitylog, logsonServer) {
            var activitylog_resRated = 0,
                activitylog_resOpened = 0;
            //***************************************************************************************
            // issue #84
            //**************************************************************************************
            var activitylog_resNames = 0;
            var logsonServer_resNames = 0;
            //***************************************************************************************
            var activitylog_male_deleted_count = 0,
                activitylog_female_deleted_count = 0;
            var logsonServer_male_deleted_count = 0,
                logsonServer_female_deleted_count = 0;
            var logsonServer_resRated = 0,
                logsonServer_resOpened = 0,
                logsonServer_male_visits = 0,
                logsonServer_female_visits = 0,
                logsonServer_female_new_signups = 0,
                logsonServer_male_new_signups = 0,
                logsonServer_male_rating = 0,
                logsonServer_female_rating = 0,
                logsonServer_male_timesRated = 0,
                logsonServer_female_timesRated = 0,
                logsonServer_male_opened = 0,
                logsonServer_female_opened = 0;
            //***************************************************************************************
            // issue #84
            //**************************************************************************************
            if (activitylog.resources_names) {
                activitylog_resNames = activitylog.resources_names
            }
            if (logsonServer.get('resources_names')) {
                logsonServer_resNames = logsonServer.get('resources_names')
            }
            //***************************************************************************************

            if (activitylog.resourcesIds) {
                activitylog_resRated = activitylog.resourcesIds
            }
            if (activitylog.resources_opened) {
                activitylog_resOpened = activitylog.resources_opened
            }
            if (logsonServer.get('resourcesIds')) {
                logsonServer_resRated = logsonServer.get('resourcesIds')
            }
            if (logsonServer.get('resources_opened')) {
                logsonServer_resOpened = logsonServer.get('resources_opened')
            }
            if (logsonServer.get('male_visits')) {
                logsonServer_male_visits = logsonServer.get('male_visits')
            }
            if (logsonServer.get('female_visits')) {
                logsonServer_female_visits = logsonServer.get('female_visits')
            }

            logsonServer_male_new_signups = ((logsonServer.get('male_new_signups')) ? logsonServer.get('male_new_signups') : 0);
            logsonServer_female_new_signups = ((logsonServer.get('female_new_signups')) ? logsonServer.get('female_new_signups') : 0);

            if (logsonServer.get('male_rating')) {
                logsonServer_male_rating = logsonServer.get('male_rating')
            }
            if (logsonServer.get('female_rating')) {
                logsonServer_female_rating = logsonServer.get('female_rating')
            }
            if (logsonServer.get('male_timesRated')) {
                logsonServer_male_timesRated = logsonServer.get('male_timesRated')
            }
            if (logsonServer.get('female_timesRated')) {
                logsonServer_female_timesRated = logsonServer.get('female_timesRated')
            }
            if (logsonServer.get('male_opened')) {
                logsonServer_male_opened = logsonServer.get('male_opened')
            }
            if (logsonServer.get('female_opened')) {
                logsonServer_female_opened = logsonServer.get('female_opened')
            }
            if (logsonServer.get('male_deleted_count')) {
                logsonServer_male_deleted_count = logsonServer.get('male_deleted_count')
            }
            if (logsonServer.get('female_deleted_count')) {
                logsonServer_female_deleted_count = logsonServer.get('female_deleted_count')
            }
            logsonServer_male_visits = parseInt(logsonServer_male_visits) + parseInt(activitylog.male_visits);
            logsonServer_female_visits = parseInt(logsonServer_female_visits) + parseInt(activitylog.female_visits);

            logsonServer_male_new_signups = parseInt(logsonServer_male_new_signups) + parseInt(((activitylog.male_new_signups) ? activitylog.male_new_signups : 0));
            logsonServer_female_new_signups = parseInt(logsonServer_female_new_signups) + parseInt(((activitylog.female_new_signups) ? activitylog.female_new_signups : 0));
            logsonServer_female_deleted_count = parseInt(logsonServer_female_deleted_count) + parseInt((activitylog.female_deleted_count) ? activitylog.female_deleted_count : 0);
            logsonServer_male_deleted_count = parseInt(logsonServer_male_deleted_count) + parseInt((activitylog.male_deleted_count) ? activitylog.male_deleted_count : 0);
            var resId, index;
            for (var i = 0; i < activitylog_resRated.length; i++) {
                resId = activitylog_resRated[i]
                index = logsonServer_resRated.indexOf(resId)
                //alert('index'+index)
                if (index == -1) {
                    logsonServer_resRated.push(resId)
                    logsonServer_male_rating.push(activitylog.male_rating[i])
                    logsonServer_female_rating.push(activitylog.female_rating[i])
                    logsonServer_male_timesRated.push(activitylog.male_timesRated[i])
                    logsonServer_female_timesRated.push(activitylog.female_timesRated[i])
                } else {
                    logsonServer_male_rating[index] = parseInt(logsonServer_male_rating[index]) + parseInt(activitylog.male_rating[i])
                    logsonServer_female_rating[index] = parseInt(logsonServer_female_rating[index]) + parseInt(activitylog.female_rating[i])
                    logsonServer_male_timesRated[index] = parseInt(logsonServer_male_timesRated[index]) + parseInt(activitylog.male_timesRated[i])
                    logsonServer_female_timesRated[index] = parseInt(logsonServer_female_timesRated[index]) + parseInt(activitylog.female_timesRated[i])
                }
            }
            for (i = 0; i < activitylog_resOpened.length; i++) {
                resId = activitylog_resOpened[i]
                resName = activitylog_resNames[i]
                //*********************************************
                // issue #84
                //********************************************
                //   logsonServer_resNames.push(resId)
                //*******************************************
                index = logsonServer_resOpened.indexOf(resId)
                if (index == -1) {
                    logsonServer_resOpened.push(resId)
                    logsonServer_resNames.push(resName)

                    logsonServer_male_opened.push(activitylog.male_opened[i])
                    logsonServer_female_opened.push(activitylog.female_opened[i])
                } else {
                    logsonServer_male_opened[index] = parseInt(logsonServer_male_opened[index]) + parseInt(activitylog.male_opened[i])
                    logsonServer_female_opened[index] = parseInt(logsonServer_female_opened[index]) + parseInt(activitylog.female_opened[i])
                }
            }
            //alert('in update logs')
            //***************************************************************************************
            // issue #84
            //**************************************************************************************
            logsonServer.set('resources_names', logsonServer_resNames);
            //*************************************************************************************
            logsonServer.set('resourcesIds', logsonServer_resRated);
            logsonServer.set('resources_opened', logsonServer_resOpened);
            logsonServer.set('male_visits', logsonServer_male_visits);
            logsonServer.set('female_visits', logsonServer_female_visits);

            logsonServer.set('male_new_signups', logsonServer_male_new_signups);
            logsonServer.set('female_new_signups', logsonServer_female_new_signups);


            logsonServer.set('male_rating', logsonServer_male_rating);
            logsonServer.set('female_rating', logsonServer_female_rating);
            logsonServer.set('male_timesRated', logsonServer_male_timesRated);
            logsonServer.set('female_timesRated', logsonServer_female_timesRated);
            logsonServer.set('male_opened', logsonServer_male_opened);
            logsonServer.set('female_opened', logsonServer_female_opened);
            logsonServer.set('male_deleted_count', logsonServer_male_deleted_count);
            logsonServer.set('female_deleted_count', logsonServer_female_deleted_count);
            var logdb = new PouchDB('activitylogs')
            logsonServer.save(null, {
                success: function(model, modelInfo) {
                    logdb.remove(activitylog, function(err, info) {
                        if (err) {
                            console.log("MyAppRouter:: updateLogs:: Failed to delete Pouch activitylog doc after it is synced i-e its data pushed to (community) CouchDB");
                        } else {}
                    });
                }
            });
        },
        LogActivity:  function(CommunityName, startDate, endDate) {

            var languageDictValue;
            var clanguage = getLanguage($.cookie('Member._id'));
            languageDictValue = getSpecificLanguage(clanguage);
            var rpt = new App.Views.ActivityReport()
            var type = "community"
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()
            if (cofigINJSON.rows[0].doc.type) {
                type = cofigINJSON.rows[0].doc.type
            }
            var logData = new App.Collections.ActivityLog()
            logData.startkey = this.changeDateFormat(startDate)
            logData.endkey = this.changeDateFormat(endDate)
            if (CommunityName != 'all') {
                logData.name = CommunityName
            }
            logData.fetch({
                async: false
            })
            // now we will assign values from first of the activitylog records, returned for the period from startDate to
            // endDate, to local variables  so that we can keep aggregating values from all the just fetched activitylog
            // records into these variables and then just display them in the output
            var logReport = logData.first();
            if (logReport == undefined) {
                alert(App.languageDict.attributes.No_Activity_Logged)
            }
            var report_resRated = logReport.get('resourcesIds')
            var report_resOpened = [];
//Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
            var report_resNames = [];
            if (logReport.get('resources_names')) {
                report_resNames = logReport.get('resources_names')
            }
//*******************************************************************************************
            if (logReport.get('resources_opened')) {
                report_resOpened = logReport.get('resources_opened')
            }
            var report_male_visits = 0;
            if (logReport.get('male_visits')) {
                report_male_visits = logReport.get('male_visits')
            }
            var report_female_visits = 0;
            if (logReport.get('female_visits')) {
                report_female_visits = logReport.get('female_visits')
            }
            var report_male_rating = []
            if (logReport.get('male_rating')) {
                report_male_rating = logReport.get('male_rating')
            }
            var report_female_rating = [];
            if (logReport.get('female_rating')) {
                report_female_rating = logReport.get('female_rating')
            }
            var report_male_timesRated = [];
            if (logReport.get('male_timesRated')) {
                report_male_timesRated = logReport.get('male_timesRated')
            }
            var report_female_timesRated = [];
            if (logReport.get('female_timesRated')) {
                report_female_timesRated = logReport.get('female_timesRated')
            }
            var report_male_opened = []
            if (logReport.get('male_opened')) {
                report_male_opened = logReport.get('male_opened')
            }
            var report_female_opened = []
            if (logReport.get('female_opened')) {
                report_female_opened = logReport.get('female_opened')
            }

            logData.each(function(logDoc, index) {
                if (index > 0) {
                    // add visits to prev total
                    report_male_visits += logDoc.get('male_visits');
                    report_female_visits += logDoc.get('female_visits');
                    resourcesIds = logDoc.get('resourcesIds');
                    resourcesOpened = logDoc.get('resources_opened');
                    //*********************************************************** #84
                    resourcesNames = logDoc.get('resources_names');
                    // ******************************************************************
                    for (var i = 0; i < resourcesIds.length; i++) {
                        resId = resourcesIds[i]
                        index = report_resRated.indexOf(resId)
                        if (index == -1) {
                            report_resRated.push(resId);
                            report_male_rating.push(logDoc.get('male_rating')[i])
                            report_female_rating.push(logDoc.get('female_rating')[i]);
                            report_male_timesRated.push(logDoc.get('male_timesRated')[i]);
                            report_female_timesRated.push(logDoc.get('female_timesRated')[i]);
                        } else {
                            report_male_rating[index] = report_male_rating[index] + logDoc.get('male_rating')[i];
                            report_female_rating[index] = report_female_rating[index] + logDoc.get('female_rating')[i];
                            report_male_timesRated[index] = report_male_timesRated[index] + logDoc.get('male_timesRated')[i];
                            report_female_timesRated[index] = report_female_timesRated[index] + logDoc.get('female_timesRated')[i];
                        }
                    }
                    if (resourcesOpened)
                        for (var i = 0; i < resourcesOpened.length; i++) {
                            resId = resourcesOpened[i]
                            index = report_resOpened.indexOf(resId)
                            if (index == -1) {
                                if(resourcesNames != undefined && resourcesNames != null) {
                                    if(resourcesNames.length > 0) {
                                        report_resNames.push(resourcesNames[i])
                                    }
                                }
                                report_resOpened.push(resId)
                                report_male_opened.push(logDoc.get('male_opened')[i])
                                report_female_opened.push(logDoc.get('female_opened')[i])
                            } else {
                                report_male_opened[index] = report_male_opened[index] + logDoc.get('male_opened')[i]
                                report_female_opened[index] = report_female_opened[index] + logDoc.get('female_opened')[i]
                            }
                        }
                }
            });



            // find most frequently opened resources
            var times_opened_cumulative = [],
                Most_Freq_Opened = [];
            for (var i = 0; i < report_resOpened.length; i++) {
                times_opened_cumulative.push(report_male_opened[i] + report_female_opened[i]);
            }
            //
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
                    var name = res.get('title');
                    // create most freq opened resource entry and push it into Most_Freq_Opened array
                    most_freq_res_entry = {
                        "resourceName": name,
                        "timesOpenedCumulative": times_opened_cumulative[indices[i]],
                        "timesOpenedByMales": report_male_opened[indices[i]],
                        "timesOpenedByFemales": report_female_opened[indices[i]]
                    };

                    if ((indexFound = report_resRated.indexOf(report_resOpened[indices[i]])) === -1) { // resource not rated
                        most_freq_res_entry["avgRatingCumulative"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["avgRatingByMales"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["avgRatingByFemales"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["timesRatedByMales"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["timesRatedByFemales"] = languageDictValue.attributes.Not_Applicable;
                        most_freq_res_entry["timesRatedCumulative"] = languageDictValue.attributes.Not_Applicable;
                    } else {
                        timesRatedTotalForThisResource = report_male_timesRated[indexFound] + report_female_timesRated[indexFound];
                        sumOfRatingsForThisResource = report_male_rating[indexFound] + report_female_rating[indexFound];
                        //place to add Code most
                        var testValueMostFrequencyRating=Math.round((sumOfRatingsForThisResource / timesRatedTotalForThisResource) * 100) / 100;
                        var ratingMaxFreq;
                        if(isNaN(testValueMostFrequencyRating))
                        {

                            ratingMaxFreq=0;
                        }
                        else{

                            ratingMaxFreq=testValueMostFrequencyRating;
                        }
                        most_freq_res_entry["avgRatingCumulative"] = ratingMaxFreq;
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
                    //place to add codde high
                    var testValueHighestFrequencyRating=Math.round(resources_rated_cumulative[indicesHighestRated[i]] * 100) / 100;
                    var ratingHighestFreq;
                    if(isNaN(testValueHighestFrequencyRating))
                    {

                        ratingHighestFreq=0;
                    }
                    else{

                        ratingHighestFreq=testValueHighestFrequencyRating;
                    }
                    timesRatedTotalForThisResource = report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]];
                    // create highest rated resource entry and push it into Highest_Rated_Resources array
                    entry_rated_highest = {
                        "resourceName": name,
                        "avgRatingCumulative":ratingHighestFreq,
                        "avgRatingByMales": report_male_rating[indicesHighestRated[i]],
                        "avgRatingByFemales": report_female_rating[indicesHighestRated[i]],
                        "timesRatedByMales": report_male_timesRated[indicesHighestRated[i]],
                        "timesRatedByFemales": report_female_timesRated[indicesHighestRated[i]],
                        "timesRatedCumulative": report_male_timesRated[indicesHighestRated[i]] + report_female_timesRated[indicesHighestRated[i]]
                    };
                    if ((indexFound = report_resOpened.indexOf(report_resRated[indicesHighestRated[i]])) === -1) { // resource not rated
                        entry_rated_highest["timesOpenedByMales"] = languageDictValue.attributes.Not_Applicable;
                        entry_rated_highest["timesOpenedByFemales"] = languageDictValue.attributes.Not_Applicable;
                        entry_rated_highest["timesOpenedCumulative"] = languageDictValue.attributes.Not_Applicable;
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
//place to add code low
                    var testValueLowestRating=Math.round(resources_rated_cumulative[indicesLowestRated[i]] * 100) / 100;
                    var ratingLowestFreq;
                    if(isNaN(testValueLowestRating))
                    {

                        ratingLowestFreq=0;
                    }
                    else{

                        ratingLowestFreq=testValueLowestRating;
                    }
                    entry_rated_lowest = {
                        "resourceName": name,
                        "avgRatingCumulative":ratingLowestFreq ,
                        "avgRatingByMales": report_male_rating[indicesLowestRated[i]],
                        "avgRatingByFemales": report_female_rating[indicesLowestRated[i]],
                        "timesRatedByMales": report_male_timesRated[indicesLowestRated[i]],
                        "timesRatedByFemales": report_female_timesRated[indicesLowestRated[i]],
                        "timesRatedCumulative": report_male_timesRated[indicesLowestRated[i]] + report_female_timesRated[indicesLowestRated[i]]
                    };
                    if ((indexFound = report_resOpened.indexOf(report_resRated[indicesLowestRated[i]])) === -1) { // resource not rated
                        entry_rated_lowest["timesOpenedByMales"] = languageDictValue.attributes.Not_Applicable;
                        entry_rated_lowest["timesOpenedByFemales"] = languageDictValue.attributes.Not_Applicable;
                        entry_rated_lowest["timesOpenedCumulative"] = languageDictValue.attributes.Not_Applicable;
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
                "Most_Freq_Open": Most_Freq_Opened,
                "Highest_Rated": Highest_Rated_Resources,
                "Lowest_Rated": Lowest_Rated_Resources
            };

            rpt.data = staticData;
            rpt.startDate = startDate
            rpt.endDate = endDate
            rpt.CommunityName = CommunityName
            rpt.render();
            App.$el.children('.body').html('<div id="requestsTable"></div>')
            $('#requestsTable').append(rpt.el)
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
        setNeedOptimizedBit: function() {
            var count = 0;
            var resources = new App.Collections.Resources()
            resources.fetch({
                async: false
            })
            resources.each(function(m) {
                if (m.get('openWith') === 'PDF.js') {
                    if (m.get('need_optimization') == undefined) {
                        m.set({
                            'need_optimization': true
                        })
                        m.save()
                    }
                }
                count++
            })
        },
        checkSum: function() {
            nationName = App.configuration.get('nationName');
            nationURL = App.configuration.get('nationUrl');
            remoteDesign = [];
            localDesign = [];
            $('.body').html('');
            $.ajax({
                    url: '/_all_dbs',
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(result) {
                           $('.body').append('<h4>'+ App.languageDict.attributes.Databases + ' : ' + result.length + '</h4>');
                   },
                   error: function(err) {
                       console.log(err);
                   }
		})

																								               $.ajax({
                url: 'http://' + nationURL + '/_all_dbs',
                type: 'GET',
                dataType: 'jsonp',
                async: false,
                success: function(result) {
                	$.each(result, function(i, val) {
                		if(val.substr(0, 1) != '_') {
                			 $.ajax({
            	                url: 'http://' + nationURL + '/'+val+'/_design/bell',
            	                type: 'GET',
            	                dataType: 'jsonp',
            	                async: false,
            	                success: function(resultR) {
            	                	if(resultR['_id'] != undefined) resultR['_id'] = '';
            	                	if(resultR['_rev'] != undefined) resultR['_rev'] = '';
            	                	remoteDesign[val] = hex_md5(JSON.stringify(resultR));
            	                	$.ajax({
                    	                url: '/'+val+'/_design/bell',
                    	                type: 'GET',
                    	                dataType: 'json',
                    	                async: false,
                    	                success: function(resultL) {
                    	                	if(resultL['_id'] != undefined) resultL['_id'] = '';
                    	                	if(resultL['_rev'] != undefined) resultL['_rev'] = '';
                    	                	localDesign[val] = hex_md5(JSON.stringify(resultL));
                    	                	if(localDesign[val] == remoteDesign[val]) 
                    	                		$('.body').append('<br/><b>' + val + '</b>: <span class="correct">'+ App.languageDict.attributes.Synced_Success + '</span>');
                    	                	else 
                    	                		$('.body').append('<br/><b>' + val + '</b>: <span class="wrong">'+ App.languageDict.attributes.Not_Synced + '</span>');
                    	                	
                    	                },
                    	                error: function(err) {
                    	                    console.log(err);
                    	                }
                    	            })
            	                },
            	                error: function(err) {
            	                    console.log(err);
            	                }
            	            })
            	            return true;
                		}
                		
                	});
                },
                error: function(err) {
                    console.log(err);
                }
            })
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
        }
    }))
})
