module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },



            concat_views: {
                src: [
                    'app/MyApp/app/views/ConfigurationView.js',
                    'app/MyApp/app/views/listSyncDbView.js',
                    'app/MyApp/app/views/MemberLoginForm.js',
                    'app/MyApp/app/views/navBarView.js',
                    'app/MyApp/app/views/MemberForm.js',
                    'app/MyApp/app/views/siteFeedback.js',
                    'app/MyApp/app/views/Dashboard.js',
                    'app/MyApp/app/views/GroupSpan.js',
                    'app/MyApp/app/views/GroupsSpans.js',
                    'app/MyApp/app/views/ShelfSpan.js',
                    'app/MyApp/app/views/ShelfSpans.js',
                    'app/MyApp/app/views/MeetupSpan.js',
                    'app/MyApp/app/views/MeetupSpans.js',
                    'app/MyApp/app/views/TutorSpan.js',
                    'app/MyApp/app/views/TutorsSpans.js',
                    'app/MyApp/app/views/ResourcesTable.js',
                    'app/MyApp/app/views/PendingResourceTable.js',
                    'app/MyApp/app/views/ResourceRow.js',
                    'app/MyApp/app/views/PendingResourceRow.js',
                    'app/MyApp/app/views/ResourcesDetail.js',
                    'app/MyApp/app/views/ResourceForm.js',
                    'app/MyApp/app/views/Search.js',
                    'app/MyApp/app/views/SearchSpan.js',
                    'app/MyApp/app/views/SearchSpans.js',
                    'app/MyApp/app/views/RequestView.js',
                    'app/MyApp/app/views/FeedbackTable.js',
                    'app/MyApp/app/views/FeedbackRow.js',
                    'app/MyApp/app/views/FeedbackForm.js',
                    'app/MyApp/app/views/GroupsTable.js',
                    'app/MyApp/app/views/GroupRow.js',
                    'app/MyApp/app/views/GroupForm.js',
                    'app/MyApp/app/views/GroupView.js',
                    'app/MyApp/app/views/CourseStepsView.js',
                    'app/MyApp/app/views/BecomeMemberForm.js',
                    'app/MyApp/app/views/CoursesStudentsProgress.js',
                    'app/MyApp/app/views/CourseInfoView.js',
                    'app/MyApp/app/views/GroupMembers.js',
                    'app/MyApp/app/views/InvitationForm.js',
                    'app/MyApp/app/views/CourseSearch.js',
                    'app/MyApp/app/views/QuizView.js',
                    'app/MyApp/app/views/takeQuizView.js',
                    'app/MyApp/app/views/offlinetakeQuizView.js',
                    'app/MyApp/app/views/LevelForm.js',
                    'app/MyApp/app/views/LevelDetail.js',
                    'app/MyApp/app/views/LevelsTable.js',
                    'app/MyApp/app/views/LevelRow.js',
                    'app/MyApp/app/views/MeetUpTable.js',
                    'app/MyApp/app/views/meetupView.js',
                    'app/MyApp/app/views/MeetupDetails.js',
                    'app/MyApp/app/views/MeetUpRow.js',
                    'app/MyApp/app/views/MeetUpForm.js',
                    'app/MyApp/app/views/MembersTable.js',
                    'app/MyApp/app/views/MembersView.js',
                    'app/MyApp/app/views/MemberRow.js',
                    'app/MyApp/app/views/ReportsRow.js',
                    'app/MyApp/app/views/ReportsTable.js',
                    'app/MyApp/app/views/ReportForm.js',
                    'app/MyApp/app/views/CommunityReportCommentView.js',
                    'app/MyApp/app/views/CourseLevelsTable.js',
                    'app/MyApp/app/views/ResourceForm.js',
                    'app/MyApp/app/views/MeetupInvitation.js',
                    'app/MyApp/app/views/MailView.js',
                    'app/MyApp/app/views/CoursesChartProgress.js',
                    'app/MyApp/app/views/CalendarForm.js',
                    'app/MyApp/app/views/EventInfo.js',
                    'app/MyApp/app/views/CollectionTable.js',
                    'app/MyApp/app/views/CollectionRow.js',
                    'app/MyApp/app/views/ListCollectionView.js',
                    'app/MyApp/app/views/siteFeedbackPage.js',
                    'app/MyApp/app/views/siteFeedbackPageRow.js',
                    'app/MyApp/app/views/RequestTable.js',
                    'app/MyApp/app/views/RequestRow.js',
                    'app/MyApp/app/views/Configurations.js',
                    'app/MyApp/app/views/LogQuery.js',
                    'app/MyApp/app/views/ActivityReport.js',
                    'app/MyApp/app/views/ManageCommunity.js',
                    'app/MyApp/app/views/PublicationTable.js',
                    'app/MyApp/app/views/SurveyTable.js',
                    'app/MyApp/app/views/SurveyQuestionTable.js',
                    'app/MyApp/app/views/SurveyQuestionRow.js',
                    'app/MyApp/app/views/SurveyAnswerTable.js',
                    'app/MyApp/app/views/SurveyAnswerRow.js',
                    'app/MyApp/app/views/SurveyTableForMembers.js',
                    'app/MyApp/app/views/CommunityConfigurationsForm.js',
                    'app/MyApp/app/views/TrendActivityReport.js',
                    'app/MyApp/app/views/AdminForm.js'
                ],
                dest: 'app/MyApp/grunt/views.js'
            },

            concat_models: {
                src: [
                    'app/MyApp/app/models/Resource.js',
                    'app/MyApp/app/models/Group.js',
                    'app/MyApp/app/models/Assignment.js',
                    'app/MyApp/app/models/Feedback.js',
                    'app/MyApp/app/models/Calendar.js',
                    'app/MyApp/app/models/report.js',
                    'app/MyApp/app/models/Mail.js',
                    'app/MyApp/app/models/membercourseprogress.js',
                    'app/MyApp/app/models/CourseSchedule.js',
                    'app/MyApp/app/models/AssignmentPaper.js',
                    'app/MyApp/app/models/UserMeetup.js',
                    'app/MyApp/app/models/ReleaseNotes.js',
                    'app/MyApp/app/models/Member.js',
                    'app/MyApp/app/models/Credentials.js',
                    'app/MyApp/app/models/App.js',
                    'app/MyApp/app/models/Shelf.js',
                    'app/MyApp/app/models/Invitation.js',
                    'app/MyApp/app/models/CourseStep.js',
                    'app/MyApp/app/models/InviFormModel.js',
                    'app/MyApp/app/models/request.js',
                    'app/MyApp/app/models/reportComment.js',
                    'app/MyApp/app/models/CommunityReportComment.js',
                    'app/MyApp/app/models/CommunityReport.js',
                    'app/MyApp/app/models/ResourceFrequency.js',
                    'app/MyApp/app/models/MeetUp.js',
                    'app/MyApp/app/models/UserMeetup.js',
                    'app/MyApp/app/models/Publication.js',
                    'app/MyApp/app/models/Configuration.js',
                    'app/MyApp/app/models/CollectionList.js',
                    'app/MyApp/app/models/InviMeetup.js',
                    'app/MyApp/app/models/Language.js',
                    'app/MyApp/app/models/CourseInvitation.js',
                    'app/MyApp/app/models/DailyLog.js',
                    'app/MyApp/app/models/Survey.js',
                    'app/MyApp/app/models/Question.js',
                    'app/MyApp/app/models/AdminMember.js'
                ],
                dest: 'app/MyApp/grunt/models.js'
            },

            concat_vendor: {
                src: [
                    'app/MyApp/vendor/Spin.js',
                    'app/MyApp/vendor/jquery-1.7.2.js',
                    'app/MyApp/vendor/jquery-ui.js',
                    'app/MyApp/vendor/jquery-ui.custom.min.js',
                    'app/MyApp/vendor/fullcalendar.min.js',
                    'app/MyApp/vendor/jquery.timepicker.js',
                    'app/MyApp/vendor/Spin.js',
                    'app/MyApp/vendor/spectrum.js',
                    'app/MyApp/vendor/underscore-1.4.4.js',
                    'app/MyApp/vendor/backbone-1.0.0.js',
                    'app/MyApp/vendor/backbone-ui.js',
                    'app/MyApp/vendor/backbone-forms.js',
                    'app/MyApp/vendor/json2.js',
                    'app/MyApp/vendor/jquery.couch.js',
                    'app/MyApp/vendor/jquery.form.js',
                    'app/MyApp/vendor/sha1.js',
                    'app/MyApp/vendor/moment.min.js',
                    'app/MyApp/vendor/jquery.couch.js',
                    'app/MyApp/vendor/jquery.cookie.js',
                    'app/MyApp/vendor/backbone.couchdb.js',
                    'app/MyApp/vendor/html-encode.js',
                    'app/MyApp/vendor/jquery.url.js',
                    'app/MyApp/vendor/bootstrap/js/bootstrap.js',
                    'app/MyApp/vendor/jquery.raty.js',
                    'app/MyApp/vendor/raphael.js',
                    'app/MyApp/vendor/morris.js',
                    'app/MyApp/vendor/jquery-ui-1.10.3.custom.js',
                    'app/MyApp/vendor/jquery-ui.multidatespicker.js',
                    'app/MyApp/vendor/jquery.popupoverlay.js',
                    'app/MyApp/vendor/moment.min.js',
                    'app/MyApp/vendor/jQuery-multiselect/jquery.multiselect.js',
                    'app/MyApp/vendor/jQuery-multiselect/jquery.multiselect.filter.js',
                    'app/MyApp/vendor/bootstrap/js/bootstrap.js',
                    'app/MyApp/vendor/pouchdb-2.1.0.js',
                    'app/MyApp/vendor/jqBarGraph.js',
                    'app/MyApp/vendor/highcharts.js',
                    'app/MyApp/vendor/md5.min.js',
                    'app/MyApp/vendor/pbkdf2/sha1.js',
                    'app/MyApp/vendor/pbkdf2/pbkdf2.js',
                    'app/MyApp/vendor/pbkdf2/derive_key.js',
                    'app/MyApp/vendor/jshash-2.2/md5-min.js'
                ],
                dest: 'app/MyApp/grunt/vendor.js'
            },

            concat_collections: {
                src: [
                    'app/MyApp/app/collections/listRCollection.js',
                    'app/MyApp/app/collections/Groups.js',
                    'app/MyApp/app/collections/coursesteps.js',
                    'app/MyApp/app/collections/MemberGroups.js',
                    'app/MyApp/app/collections/GroupAssignments.js',
                    'app/MyApp/app/collections/NewsResources.js',
                    'app/MyApp/app/collections/Members.js',
                    'app/MyApp/app/collections/SearchResource.js',
                    'app/MyApp/app/collections/Calendars.js',
                    'app/MyApp/app/collections/siteFeedbacks.js',
                    'app/MyApp/app/collections/membercourseprogresses.js',
                    'app/MyApp/app/collections/memberprogressallcourses.js',
                    'app/MyApp/app/collections/AllInviteMember.js',
                    'app/MyApp/app/collections/Mails.js',
                    'app/MyApp/app/collections/MailUnopened.js',
                    'app/MyApp/app/collections/reportsComment.js',
                    'app/MyApp/app/collections/CourseScheduleByCourse.js',
                    'app/MyApp/app/collections/shelfResource.js',
                    'app/MyApp/app/collections/UserMeetups.js',
                    'app/MyApp/app/collections/Configurations.js',
                    'app/MyApp/app/collections/Resources.js',
                    'app/MyApp/app/collections/Apps.js',
                    'app/MyApp/app/collections/GroupAssignmentsByDate.js',
                    'app/MyApp/app/collections/AssignmentsByDate.js',
                    'app/MyApp/app/collections/ResourceFeedback.js',
                    'app/MyApp/app/collections/CourseLevels.js',
                    'app/MyApp/app/collections/SearchCourses.js',
                    'app/MyApp/app/collections/StepResultsbyCourse.js',
                    'app/MyApp/app/collections/leadermembers.js',
                    'app/MyApp/app/collections/Requests.js',
                    'app/MyApp/app/collections/EntityInvitation.js',
                    'app/MyApp/app/collections/Requests.js',
                    'app/MyApp/app/collections/courseprogressallmembers.js',
                    'app/MyApp/app/collections/CommunityReportComments.js',
                    'app/MyApp/app/collections/Reports.js',
                    'app/MyApp/app/collections/ResourcesFrequency.js',
                    'app/MyApp/app/collections/AssignmentPapers.js',
                    'app/MyApp/app/collections/Meetups.js',
                    'app/MyApp/app/collections/listRCollection.js',
                    'app/MyApp/app/collections/Publication.js',
                    'app/MyApp/app/collections/Languages.js',
                    'app/MyApp/app/collections/CourseInvitations.js',
                    'app/MyApp/app/collections/ActivityLog.js',
                    'app/MyApp/app/collections/SurveyQuestions.js',
                    'app/MyApp/app/collections/SurveyAnswers.js',
                    'app/MyApp/app/collections/AdminMembers.js'
                ],
                dest: 'app/MyApp/grunt/collections.js'
            }


        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', [
        'concat:concat_views',
        'concat:concat_models',
        'concat:concat_vendor',
        'concat:concat_collections'
    ]);
};
