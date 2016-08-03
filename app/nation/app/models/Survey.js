$(function() {

    App.Models.Survey = Backbone.Model.extend({

        idAttribute: "_id",

        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/survey/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/survey/' + this.id // For READ
            } else {
                var url = App.Server + '/survey' // for CREATE
            }
            return url
        },

        defaults: {
            kind: 'survey',//Saves kind of document according to corresponding db's.Mostly used in couch db views.
            sentTo: [],//This array attribute saves 'names' of those communities to which a particular survey has been sent from nation.It saves value of 'name' attribute from configurations of community
            submittedBy: [],//This array attribute saves 'names' of those communities who submitted response of a particular survey to nation.It saves value of 'name' attribute from configurations of community
            questions: [],//Ids of questions added in a survey.These ids are actually coming from surveyquestions db.
            answersToQuestions: [],//Ids of answer docs for questions added in a survey.These ids are actually coming from surveyanswers db.
            genderOfMember: '',//Gender of member who is submitting his/her response to a particular survey
            birthYearOfMember: '',//BirthDate of member who is submitting his/her response to a particular survey
            communityName: '',//Name of community to which member(who is submitting his/her response to a particular survey) belongs.It saves value of 'name' attribute from configurations of community
            memberId: '',//This value is a resultant of member login id + value of community attribute of that member's doc.This attribute is used to differentiate b/w multiple survey response docs of same survey
            receiverIds: []//This array attribute saves memberIds(as explained above) of those members to which survey has been sent
        },

        schema: {
            Date: 'Text',//Date when survey was added
            SurveyNo: 'Number',//Unique identification number of a survey.
            SurveyTitle:'Text' //Title of a survey
        }

    })
})