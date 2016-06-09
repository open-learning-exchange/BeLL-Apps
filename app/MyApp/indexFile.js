var searchText = "";
var skip = 0; //Variable used to skip the number of records been fetched before.
var enablenext = 0;
var searchRecordsPerPage = 2;
var limitofRecords = 5;
var skipStack = new Array()
var ratingFilter = new Array();
var rtitle = new Array();
var rids = new Array();
var numberOfNotificattions = "."
url = "unknown";
var lastpage = false
var mailView;

var nation_version;
var new_publications_count;
var new_surveys_count;
var languageDict;

function applyStylingSheet() {
    var languageDictValue=loadLanguageDocs();

    var directionOfLang = languageDictValue.get('directionOfLang');

    if (directionOfLang.toLowerCase() === "right") {

        $('link[rel=stylesheet][href~="app/Home.css"]').attr('disabled', 'false');
        $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').removeAttr('disabled');

    } else if (directionOfLang.toLowerCase() === "left"){
        $('link[rel=stylesheet][href~="app/Home.css"]').removeAttr('disabled');
        $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').attr('disabled', 'false');
    }
    else{
        alert(languageDictValue.attributes.error_direction);
    }
}
function applyCorrectStylingSheet(directionOfLang){
    if (directionOfLang.toLowerCase() === "right") {

        $('link[rel=stylesheet][href~="app/Home.css"]').attr('disabled', 'false');
        $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').removeAttr('disabled');

    } else if (directionOfLang.toLowerCase() === "left"){
        $('link[rel=stylesheet][href~="app/Home.css"]').removeAttr('disabled');
        $('link[rel=stylesheet][href~="app/Home-Urdu.css"]').attr('disabled', 'false');
    }
    else{
        alert(languageDictValue.attributes.error_direction);
    }
}
function selectAllMembers (){
    if($("#selectAllMembersOnMembers").text()==App.languageDict.attributes.Select_All)
    {

        $("input[name='courseMember']").each( function () {
            $(this).prop('checked', true);
        })
        $("#selectAllMembersOnMembers").text(App.languageDict.attributes.Unselect_All)
    }
    else{
        $("input[name='courseMember']").each( function () {
            $(this).prop('checked', false);
        })
        $("#selectAllMembersOnMembers").text(App.languageDict.attributes.Select_All)

    }
}
function retrunBack(){
    window.history.back();
}
function removeMemberFromCourse(memberId){
    var that=this;
    var values=memberId.split(',');
    memberId=values[0];
    var courseId=values[1];
    var courseModel = new App.Models.Group({
        _id: courseId
    })
    courseModel.fetch({
        success:function(result){
            var members=result.get('members');
            members.splice(members.indexOf(memberId),1)

            result.set('members',members)

            result.save()
            memberCoursePro=new App.Collections.membercourseprogresses()
            memberCoursePro.memberId=memberId
            memberCoursePro.courseId=that.courseId

            memberCoursePro.fetch({async:false})
            while (model = memberCoursePro.first()) {
                model.destroy();
            }
            var groupMembers = new App.Views.GroupMembers();
            groupMembers.courseId = courseId;
            groupMembers.render();
            alert(App.languageDict.attributes.Removed_Member);
        }
    })

}

function changeLanguage(option)
{
    $.cookie('languageFromCookie',option.value);
    $.cookie('isChange',"true")
    location.reload();
}

function changeMemberLanguage(option)
{
    var configurations = Backbone.Collection.extend({
        url: App.Server + '/configurations/_all_docs?include_docs=true'
    });
    var config = new configurations();
    config.fetch({
        async: false
    });
    var jsonConfig = config.first().toJSON().rows[0].doc;
    var member;
    var members = new App.Collections.Members()
    members.login = $.cookie('Member.login');
    members.fetch({
        success: function () {
            if (members.length > 0) {
                for(var i = 0; i < members.length; i++)
                {
                    if(members.models[i].get("community") == jsonConfig.code)
                    {
                        member = members.models[i];
                        member.set("bellLanguage",option.value);
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


    location.reload();
}

function submitSurvey(surveyId) {
    App.startActivityIndicator();
    var surveyModel = new App.Models.Survey({
        _id: surveyId
    });
    surveyModel.fetch({
        async: false
    });
    var surQuestions = surveyModel.get('questions');
    var surQuestionIdes = ''
    _.each(surQuestions, function(item) {
        surQuestionIdes += '"' + item + '",'
    })
    if (surQuestionIdes != ''){
        surQuestionIdes = surQuestionIdes.substring(0, surQuestionIdes.length - 1);
    }
    var questionsColl = new App.Collections.SurveyQuestions();
    questionsColl.keys = encodeURI(surQuestionIdes)
    questionsColl.fetch({
        async: false
    });
    var answersToSubmit = [];
    var requiredQuestionsCount = 0;
    var answerToRequiredQuestionsCount = 0;
    questionsColl = questionsColl.models;
    for(var i = 0 ; i < questionsColl.length ; i++) {
        questionsColl[i] = questionsColl[i].attributes;
        if(questionsColl[i].RequireAnswer == true) {
            requiredQuestionsCount++;
        }
    }
    var surveyTable = $("#survey-questions-table >tbody");
    surveyTable.find('>tr').each(function (i) {
        var tds = $(this).find('td'),
            questionId = tds.eq(0).attr('id'),
            questionTd = tds.eq(0)
        var questionType = questionId.split(',')[1];
        questionId = questionId.split(',')[0];
        if(questionType == 'Multiple Choice (Single Answer)') {
            var radioBtnName = questionTd.find('input').attr('name');
            var answer = $('input[name= "' + radioBtnName + '"]:checked').val();
            for(var j = 0; j < questionsColl.length; j++) {
                if(questionsColl[j]._id == questionId) {
                    var questionModel = questionsColl[j];
                    delete questionModel._id;
                    delete questionModel._rev;
                    questionModel["Answer"] = [];
                    if(answer != undefined) {
                        if (questionModel.RequireAnswer == true) {
                            answerToRequiredQuestionsCount++;
                        }
                        questionModel.Answer.push(answer);
                    }
                    answersToSubmit.push(questionModel);
                }
            }
        } else if(questionType == 'Rating Scale'){
            var ratingTable=questionTd.find('table >tbody');
            var ratingAnswers = [];
            var ratingCount = 0;
            ratingTable.find('>tr').each(function (k) {
                if(k != 0) {
                    ratingCount++;
                    var ratingTds = $(this).find('td');
                    var ratingTd = ratingTds.eq(1);
                    var ratingRadioBtnName = ratingTd.find('input').attr('name');
                    var answer = $('input[name= "' + ratingRadioBtnName + '"]:checked').val();
                    if(answer != undefined) {
                        ratingAnswers.push(answer);
                    }
                }
            });
            for(var j = 0; j < questionsColl.length; j++) {
                if(questionsColl[j]._id == questionId) {
                    var questionModel = questionsColl[j];
                    delete questionModel._id;
                    delete questionModel._rev;
                    questionModel["Answer"] = [];
                    if(ratingAnswers.length > 0) {
                        if (questionModel.RequireAnswer == true && ratingCount == ratingAnswers.length) {
                            answerToRequiredQuestionsCount++;
                        }
                        questionModel.Answer = ratingAnswers;
                    }
                    answersToSubmit.push(questionModel);
                }
            }
        } else if(questionType == 'Single Textbox') {
            var answer = questionTd.find('input').val();
            answer = answer.toString().trim();
            for(var j = 0; j < questionsColl.length; j++) {
                if(questionsColl[j]._id == questionId) {
                    var questionModel = questionsColl[j];
                    delete questionModel._id;
                    delete questionModel._rev;
                    questionModel["Answer"] = [];
                    if(answer != '') {
                        if (questionModel.RequireAnswer == true) {
                            answerToRequiredQuestionsCount++;
                        }
                        questionModel.Answer.push(answer);
                    }
                    answersToSubmit.push(questionModel);
                }
            }
        } else if(questionType == 'Comment/Essay Box') {
            var answer = questionTd.find('textarea').val();
            answer = answer.toString().trim();
            for(var j = 0; j < questionsColl.length; j++) {
                if(questionsColl[j]._id == questionId) {
                    var questionModel = questionsColl[j];
                    delete questionModel._id;
                    delete questionModel._rev;
                    questionModel["Answer"] = [];
                    if(answer != '') {
                        if (questionModel.RequireAnswer == true) {
                            answerToRequiredQuestionsCount++;
                        }
                        questionModel.Answer.push(answer);
                    }
                    answersToSubmit.push(questionModel);
                }
            }
        }
    });
    if(requiredQuestionsCount == answerToRequiredQuestionsCount) {
        var configurations = Backbone.Collection.extend({
            url: App.Server + '/configurations/_all_docs?include_docs=true'
        });
        var config = new configurations();
        config.fetch({
            async: false
        });
        var jsonConfig = config.first().toJSON().rows[0].doc;
        var members = new App.Collections.Members()
        var member, memberKey, gender, birthYear, memberLanguage;
        members.login = $.cookie('Member.login');
        members.fetch({
            success: function () {
                if (members.length > 0) {
                    for(var i = 0; i < members.length; i++)
                    {
                        if(members.models[i].get("community") == jsonConfig.code)
                        {
                            member = members.models[i];
                            gender = member.get('Gender');
                            if(member.get('BirthDate') != undefined) {
                                birthYear = member.get('BirthDate').split('-')[0];
                            } else {
                                birthYear = '2016';
                            }
                            memberKey = member.get('login') + '_' + member.get('community');
                            memberLanguage = member.get('bellLanguage');
                        }
                    }
                }
            },
            async:false

        });
        var config = new App.Collections.Configurations();
        var bellName;
        config.fetch({
            async: false,
            success: function(){
                bellName = config.first().attributes.name;
            }
        });
        var surveyResModel = surveyModel.attributes;
        delete surveyResModel._id;
        delete surveyResModel._rev;
        surveyResModel["answersToQuestions"] = [];
        surveyResModel["communityName"] = App.configuration.get('name');
        surveyResModel["genderOfMember"] = gender;
        surveyResModel["birthYearOfMember"] = birthYear;
        surveyResModel["memberId"] = memberKey;
        surveyResModel["memberLanguage"] = memberLanguage;
        var docIds = [];
        docIds.push(surveyId);
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            type: 'POST',
            url: '/_replicate',
            dataType: 'json',
            data: JSON.stringify({
                "source": "survey",
                "target": "surveyresponse",
                'doc_ids': docIds
            }),
            async: false,
            success: function (response) {
                console.log("Survey doc replicated");
            },
            error: function(status) {
                console.log("Unable to replicate survey doc");
            }
        });
        $.couch.db("surveyanswers").bulkSave({"docs": answersToSubmit}, {
            success: function(data) {
                var survey = new App.Models.Survey({
                    _id: surveyId
                });
                survey.fetch({
                    async: false
                });
                if(survey.get('submittedBy').indexOf(bellName) == -1) {
                    survey.get('submittedBy').push(bellName);
                    survey.save();
                }
                var answerDocIds = [];
                for(var i = 0 ; i < data.length ; i++) {
                    answerDocIds.push(data[i].id);
                }
                surveyResModel.answersToQuestions = answerDocIds;
                $.couch.db("surveyresponse").saveDoc(surveyResModel, {
                    success: function(data) {
                        alert(App.languageDict.get('Survey_Success_Message'));
                        App.stopActivityIndicator();
                        window.history.go(-1);
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
    } else {
        alert(App.languageDict.get('Survey_Error_Message_For_Required_Questions'));
        App.stopActivityIndicator();
        return;
    }
}

function sortQuestions(idsArrayForSortingOrder, modelsToSort) {
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
}

function showFeedbackForm() {
    App.renderFeedback()
    if (document.getElementById('site-feedback').style.visibility != 'visible') {
        $('#site-feedback').animate({
            height: '320px'
        })
        document.getElementById('site-feedback').style.visibility = 'visible'
    } else {
        $('#site-feedback').animate({
            height: 'toggle'
        })


    }
    $('#comment').attr('placeholder',App.languageDict.attributes.Give_Feedback);
    var languageDictValue, clanguage;
    if($.cookie('Member._id'))
    {
        clanguage= getLanguage($.cookie('Member._id'))
    }
    else if($.cookie('isChange')=="true" && $.cookie('Member._id')==null)
    {
        clanguage= $.cookie('languageFromCookie');
    }
    else
    {
        clanguage = App.configuration.get("currentLanguage");
    }
    languageDictValue = getSpecificLanguage(clanguage);
    if (languageDictValue.get('directionOfLang').toLowerCase() === "right") {
        $('#comment').css('text-align','right');
    }

}

function sendAdminRequest(courseLeader, courseName, courseId) {

    var currentdate = new Date();
    var mail = new App.Models.Mail();
    mail.set("senderId", $.cookie('Member._id'));
    mail.set("receiverId", courseLeader);
    mail.set("subject", App.languageDict.attributes.Course_Admission_Req+" | " + decodeURI(courseName));
    mail.set("body", App.languageDict.attributes.Admission_Req_Received+' '
    + $.cookie('Member.login') + ' ' +App.languageDict.attributes.For_Course+' ' + decodeURI(courseName) +
    ' <br/><br/><button class="btn btn-primary" id="invite-accept" value="' + courseId + '" >'+App.languageDict.attributes.Accept+
    '</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + courseId + '" >'+
    App.languageDict.attributes.Reject+'</button>');
    mail.set("status", "0");
    mail.set("type", "admissionRequest");
    mail.set("sentDate", currentdate);
    mail.save()
    $('#admissionButton').hide()
    alert(App.languageDict.attributes.RequestForCourse);


}
function getAvailableLanguages(){
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
}
function checkIfExistsInLangDb(language){
    var languages = new App.Collections.Languages();
    languages.fetch({
        async: false
    });
    var isPresent=false;
    for(var i=0;i<languages.length && !(isPresent) ;i++) {
        if (languages.models[i].attributes.hasOwnProperty("nameOfLanguage")) {
            if (languages.models[i].attributes.nameOfLanguage == language) {
               isPresent=true;
            }
        }
    }
    return isPresent;
}
function getNativeNameOfLang(language){
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
}
function getLanguage(loginName) {
    var members = new App.Collections.Members()
    var lang;
    var configurations = Backbone.Collection.extend({
        url: App.Server + '/configurations/_all_docs?include_docs=true'
    });
    var config = new configurations();
    config.fetch({
        async: false
    });
    var jsonConfig = config.first().toJSON().rows[0].doc;
    members.login = $.cookie('Member.login');
    members.fetch({
        success: function () {
            if (members.length > 0) {
                for(var i = 0; i < members.length; i++)
                {
                    if(members.models[i].get("community") == jsonConfig.code)
                    {
                        lang = members.models[i].get("bellLanguage");
                        break;
                    }
                }
            }
        },
        async:false
    });
    return lang;
}
function getSpecificLanguage(language){
    var languages = new App.Collections.Languages();
    languages.fetch({
        async: false
    });
    var configurations = Backbone.Collection.extend({
        url: App.Server + '/configurations/_all_docs?include_docs=true'
    })
    var config = new configurations()
    config.fetch({
        async: false
    })
    var currentConfig = config.first().toJSON().rows[0].doc;
    var clanguage= currentConfig.currentLanguage;
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
        var member;
        var members = new App.Collections.Members()
        members.login = $.cookie('Member.login');
        clanguage=currentConfig.currentLanguage;
        members.fetch({
            success: function () {
                if (members.length > 0) {
                    for(var i; i < members.length; i++)
                    {
                        if(members.models[i].get("community") == currentConfig.code)
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
}

function loadLanguageDocs(){
    var configurations = Backbone.Collection.extend({
        url: App.Server + '/configurations/_all_docs?include_docs=true'
    })
    var config = new configurations()
    config.fetch({
        async: false
    })
    var con = config.first();
    var currentConfig = config.first().toJSON().rows[0].doc;
    var clanguage= currentConfig.currentLanguage;
    var languages = new App.Collections.Languages();
    languages.fetch({
        async: false
    });
    for(var i=0;i<languages.length;i++) {
        if (languages.models[i].attributes.hasOwnProperty("nameOfLanguage")) {
            if (languages.models[i].attributes.nameOfLanguage == clanguage) {
                languageDict = languages.models[i];
                break;
            }
        }
    }
    return languageDict;
}

function searchResources() {
    skip = 0;
    popAll();
    lastpage = false;
    App.Router.SearchResult();
    $('#previous_button').remove()
    $('#searchText').focus();
    $("#searchText").val(searchText)
}

function popAll() {
    while (skipStack.length > 0) {
        skipStack.pop();
    }
}

function onFocus(obj) {
    var end = obj.value.length;
    if (obj.setSelectionRange)
        obj.setSelectionRange(end, end);
}

function showComposePopupMultiple(email) {
    $("#subject").val("")
    $("#recipients").val("")
    $("#mailbodytexarea").val("")

    var multipalMembers = new Array()
    $("input[name='courseMember']").each(function() {
        if ($(this).is(":checked")) {
            multipalMembers.push($(this).val());
        }
    })
    // if(email)
    $('#recipients').val(multipalMembers)
    showComposePopup()


}

function hideMail() {}

function showComposePopup() {
    $('#emailCompose').popup({
        horizontal: 'right',
        vertical: 'bottom',
        background: false,
        blur: false,
        scrolllock: true

    });
    $('#emailCompose').popup('show');
    $('.newEmailDiv').html('&nbsp;&nbsp;'+App.languageDict.attributes.New_Message);
    $('.mailrecipients input').attr('placeholder',App.languageDict.attributes.Recipients);
    $('.mailsubject input').attr('placeholder',App.languageDict.attributes.Subject_single);
    $('.mailbody button').eq(0).html(App.languageDict.attributes.Close);
    $('.mailbody button').eq(1).html(App.languageDict.attributes.Send);

}

function HandleBrowseClick(stepId) {
    var fileinput = document.forms["fileAttachment" + stepId]["_attachments"]
    fileinput.click();
}

function FieSelected(stepId) {
    var courseId = document.getElementById("courseId" + stepId).value;
    var stepTitle = document.getElementById("stepTitle" + stepId).value;
    var stepNo = document.getElementById("stepNo" + stepId).value;

    var courseModel = new App.Models.Group()
    courseModel.set('_id', courseId)
    courseModel.fetch({
        async: false
    })
    if (!courseModel.get("courseLeader")) {
        return
    }
    var img = $('input[type="file"]')
    var extension = img.val().split('.')
    if (img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt' && extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' && extension[(extension.length - 1)] != 'png') {
        alert(App.languageDict.attributes.Invalid_Attachment);
        return;
    }
    var currentdate = new Date();
    var mail = new App.Models.Mail();
    mail.set("senderId", $.cookie('Member._id'));
    mail.set("receiverId", courseModel.get("courseLeader"));
    mail.set("subject", "Assignment | " + courseModel.get("name"));
    mail.set("body", "Assignment submited for <b>" + stepTitle + '</b>.');
    mail.set("status", "0");
    mail.set("type", "mail");
    mail.set("sentDate", currentdate);
    mail.save()
    var assignmentpaper = new App.Models.AssignmentPaper();
    assignmentpaper.set("sentDate", currentdate);
    assignmentpaper.set("senderId", $.cookie('Member._id'));
    assignmentpaper.set("courseId", courseId);
    assignmentpaper.set("stepId", stepId);
    assignmentpaper.set("stepNo", stepNo);
    assignmentpaper.save(null, {
        success: function() {
            //assignmentpaper.unset('_attachments')
            if ($('input[type="file"]').val()) {
                assignmentpaper.saveAttachment("form#fileAttachment" + stepId, "form#fileAttachment" + stepId + " #_attachments", "form#fileAttachment" + stepId + " .rev")
            } else {
                ////no attachment
                alert(App.languageDict.attributes.No_Attachment)
            }
            assignmentpaper.on('savedAttachment', function() {
                /////Attatchment successfully saved
                alert(App.languageDict.attributes.Assignment_Submitted)
            }, assignmentpaper)

        }
    })
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function sendMail() {
    var configurations = Backbone.Collection.extend({
        url: App.Server + '/configurations/_all_docs?include_docs=true'
    })
    var config = new configurations()
    config.fetch({
        async: false
    })
    var currentConfig = config.first()
    var cofigINJSON = currentConfig.toJSON()
    var scode = cofigINJSON.rows[0].doc.code + cofigINJSON.rows[0].doc.nationName.substring(3, 5)
    var attachment = true
    var rec = $("#recipients").val()
    var invalidEmails = new Array()
    var invalidIndex = new Array()
    var mailingList = new Array()
    mailingList = rec.split(',')

    for (var i = 0; i < mailingList.length; i++) {
        var mailadd = mailingList[i]

        if (validateEmail(mailadd)) {
            if (mailadd != "mycommunity@olebell.org") {

                var temp = (mailadd.split('@')[0]).split('.')

                if (temp.length > 0) {
                    var code = temp[temp.length - 1]

                    if (code == scode && mailadd.split('@')[1] == 'olebell.org') {
                        //alert('valid mail')
                        ///valid email address
                    } else {
                        invalidEmails.push(mailadd)
                        invalidIndex.push(i)
                    }
                } else {
                    invalidIndex.push(i)
                    invalidEmails.push(mailadd)
                }
            }
        } else {
            invalidIndex.push(i)
            invalidEmails.push(mailadd)
        }
    }
    for (var i = 0; i < invalidIndex.length; i++) {
        mailingList.splice(invalidIndex[i], 1)
    }

    var subject = $("#subject").val();
    var mailBody = $("textarea#mailbodytexarea").val();
    var img = $('input[type="file"]')
    if (!img.val()) {
        attachment = false
    } else {
        var extension = img.val().split('.')
    }
    if (rec == "") {
        alert(App.languageDict.attributes.Enter_Recipient);
    } else if (subject == "") {
        alert(App.languageDict.attributes.Enter_subject);
    } else if (mailBody == "") {
        alert(App.languageDict.attributes.Enter_Message);
    } else if (attachment && img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt' && extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' && extension[(extension.length - 1)] != 'png') {
        alert(App.languageDict.attributes.Invalid_Attachment)
    } else {
        //alert(invalidEmails + ' are invalid email addresses.')

        if (mailingList.length <= 0) {
            return
        }
        var mailId = ''
        if (mailingList.indexOf('mycommunity@olebell.org') != -1) {
            var members = new App.Collections.Members()
            members.fetch({
                async: false
            })
            members.each(function(member) {
                mailId = member.get('login')
                sendSingleMail(mailId, mailBody, subject, mailingList)
            });
            alert(App.languageDict.attributes.Mail_Sent_Success)
            return
        }
        for (var i = 0; i < mailingList.length; i++) {
            if (mailingList[i].indexOf('@olebell.org') != -1) {

                var firstPart = mailingList[i].split("@")
                mailId = firstPart[0].substring(0, firstPart[0].lastIndexOf("."))
            } else {
                mailId = mailingList[i]
            }
            sendSingleMail(mailId, mailBody, subject, mailingList)

        }
        alert(App.languageDict.attributes.Mail_Sent_Success)
        $('#MakeMailForMembers').popup('hide');
    }

}

function sendSingleMail(mailId, mailBody, subject, mailingList) {
    $.getJSON('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + mailId + '"', function(response) {
        if (response.rows[0]) {
            var currentdate = new Date();
            var id = response.rows[0].doc._id
            var mail = new App.Models.Mail();
            mail.set("senderId", $.cookie('Member._id'));
            mail.set("receiverId", id);
            mail.set("subject", subject);
            mail.set("body", mailBody);
            mail.set("status", "0");
            mail.set("type", "mail");
            mail.set("sentDate", currentdate);
            mail.set('mailingList', mailingList);
            $('#emailCompose').popup('hide');

            mail.save(null, {
                success: function() {
                    mail.unset('_attachments')
                    if ($('input[type="file"]').val()) {
                        mail.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                    } else {
                        ////no attachment
                    }
                    mail.on('savedAttachment', function() {
                        /////Attatchment successfully saved
                    }, mail)

                }
            })
            $('#emailCompose').popup('hide');

        } else {
            alert(App.languageDict.attributes.Invalid_Email_Address+' ' + mailId)
        }

    });

}

function getScheduleDatesForCourse(startDate, endDate, days) {
    //startDate = new Date(2008, 2, 4);
    //endDate = new Date(2009, 2, 4);
    //var days = new Array(1,2,3)
    //alert(startDate + ' ' +endDate + ' ' +days)
    var day = startDate.getDay();
    var scheduleDates = new Array();
    while (startDate < endDate || startDate.valueOf() == endDate.valueOf()) {
        day = startDate.getDay();
        var tempDate = new Date(startDate.valueOf());
        for (var i = 0; i < days.length; i++) {
            if (day <= days[i]) {
                var t = startDate.getDate() + (days[i] - day)
                tempDate.setDate(t)
                //alert(day + ' ' + days[i] + ' ' + t + ' ' + tempDate)
                if (tempDate < endDate || tempDate.valueOf() == endDate.valueOf()) {
                    var sdate = new Date(tempDate.valueOf())
                    scheduleDates.push(sdate)
                } else {
                    //endDate.setHours(tempDate.getHours())
                    if (tempDate.valueOf() == endDate.valueOf()) {
                        var sdate = new Date(tempDate.valueOf())
                        scheduleDates.push(sdate)
                    } else {
                        break;
                    }
                }
            }
        }
        startDate.setDate(startDate.getDate() + (7 - startDate.getDay()))
    }
    return scheduleDates;

}

function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    return hours;
    if (time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    if (time.indexOf('pm') != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(am|pm)/, '');
}
$(window).scroll(function() {
    var $menu = $('#addEvent'),
        scrollpos = $(window).scrollTop();
    if (scrollpos >= 118) {
        $menu.css({
            "top": "0",
            "position": "fixed"
        });
    } else {
        $menu.css({
            "position": "fixed",
            "top": "68px"
        });
    }
});


function startRecording() {
    var that = this
    var mediaConstraints = {
        audio: true
    };
    var adio;
    navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    if (!!navigator.getUserMedia_) {
        //navigator.getUserMedia_('video', successCallback, errorCallback);
        navigator.getUserMedia_(mediaConstraints, onMediaSuccess, onMediaError);
    }

    function onMediaSuccess(stream) {
        var audio = document.createElement('audio');
        audio = mergeProps(audio, {
            controls: true,
            src: URL.createObjectURL(stream)
        });
        audio.volume = 0;
        audio.play();

        audiosContainer.appendChild(audio);
        audiosContainer.appendChild(document.createElement('hr'));

        var mediaRecorder = new MediaStreamRecorder(stream);
        adio = mediaRecorder;
        mediaRecorder.mimeType = 'audio/wav';

        mediaRecorder.ondataavailable = function(blob) {
            stopButtonPressed(blob); // list the audio and stop
        };

        // get blob after each 20 second!
        mediaRecorder.start(20 * 1000);

        alert(App.languageDict.attributes.time_Limit)
    }

    function onMediaError(e) {
        console.error('media error', e);
    }

    function stopButtonPressed(blob) {
        var a = document.createElement('a');
        a.target = '_blank';
        a.innerHTML = 'Listen Recording ' + (index++);
        a.style.color = 'black';
        a.href = URL.createObjectURL(blob);

        audiosContainer.appendChild(a);
        audiosContainer.appendChild(document.createElement('hr'));

        var audioPlayer = document.getElementsByTagName('audio')[0];
        audioPlayer.pause();
        alert(App.languageDict.attributes.Stopped)
    }
    var audiosContainer = document.getElementById('audios-container');
    var index = 1;
}

function AddToShelf(rId, title) {
    App.Router.AddToShelf(rId, title)
}
//Issue#61: Update buttons Add Feedback form when rating a resource
function AddToShelfAndSaveFeedback(rId, title) {
    App.Router.AddToShelfAndSaveFeedback(rId, title)
}

function showSubjectCheckBoxes() {
    //var subjects = ['Agriculture', 'Arts', 'Business and Finance', 'Environment', 'Food and Nutrition', 'Geography', 'Health and Medicine', 'History', 'Human Development', 'Languages', 'Law', 'Learning', 'Literature', 'Math', 'Music', 'Politics and Government', 'Reference', 'Religion', 'Science', 'Social Sciences', 'Sports', 'Technology'];
    var subjects=App.languageDict.get('SubjectList');
    var length = subjects.length;
    var htmlString = "<label style='font-size:16px'><b>"+App.languageDict.attributes.subject+"</b></label><br>";
    htmlString += "<select id='multiselect-subject-search' multiple='multiple' style='width: 370px;'>";
    for (var i = 0; i < length; i++) {
        htmlString = htmlString + '<option id="subject' + (i + 1) + '" value="' + subjects[i] + '">' + subjects[i] + '</option>';
    }
    htmlString += '</select>'
    $("#SubjectCheckboxes").html(htmlString);

}

function ResourceSearch() {
    // alert('in resource search function ')

    skip = 0;
    searchText = $("#searchText").val()
    searchType = $('#searchtype').val()

    var collectionFilter = new Array()
    var subjectFilter = new Array()
    var levelFilter = new Array()
    var languageFilter = new Array()
    ratingFilter.length = 0
    skipStack.push(skip)

    collectionFilter = $("#multiselect-collections-search").val()
    subjectFilter = $("#multiselect-subject-search").val()
    levelFilter = $("#multiselect-levels-search").val()
    languageFilter = $("#search-language").val()
    authorName = $('#Author-name').val()

    mediumFilter = $('#multiselect-medium-search').val()
    $("input[name='star']").each(function() {
        if ($(this).is(":checked")) {
            ratingFilter.push($(this).val());
        }
    })

    if (searchText != "" || (collectionFilter) || (subjectFilter) || (levelFilter) || (languageFilter) || (authorName) || (mediumFilter) || (ratingFilter && ratingFilter.length > 0)) {
        // alert('in search')

        var search = new App.Views.Search()

        search.collectionFilter = collectionFilter
        search.languageFilter = languageFilter
        search.levelFilter = levelFilter
        search.subjectFilter = subjectFilter
        search.ratingFilter = ratingFilter
        search.mediumFilter = mediumFilter
        search.authorName = authorName

        search.addResource = false

        App.$el.children('.body').html(search.el)
        search.render()


        $("#srch").show()
        $(".row").hide()
        $('#not-found').show()

        $(".search-bottom-nav").hide()
        $(".search-result-header").hide()
        $("#selectAllButton").hide()

    }

}

function backtoSearchView() {
    $('#not-found').hide()
    searchText = ''
    App.Router.bellResourceSearch();

}

function changeRatingImage(checkID, count) {
    //alert($('#' + checkID + 1).attr('src'));
    var imgName = "";
    if ($('#' + checkID + 1).attr('src') == "star-on.png") {
        imgName = "star-off.png";
    } else {
        imgName = "star-on.png";
    }
    for (var i = 1; i <= 5; i++) {
        $('#' + checkID + i).attr('src', imgName);
    }
}

function deleteResource(id){

    var mId = $.cookie('Member._id');
    var memberShelfResource = new App.Collections.shelfResource()
    memberShelfResource.resourceId = id;
    memberShelfResource.memberId = mId;
    memberShelfResource.fetch({
        async: false
    });

    memberShelfResource.each(
        function(e) {
            e.destroy()
        });
    alert(App.languageDict.attributes.Resource_RemovedFrom_Shelf_Success);
    //Backbone.history.loadUrl();
}

function openResourceDetail(id){
    var resourcefreq = new App.Collections.ResourcesFrequency();
    resourcefreq.memberID = $.cookie('Member._id');
    resourcefreq.fetch({
        async: false
    });

    if (resourcefreq.length == 0) {
        var freqmodel = new App.Models.ResourceFrequency();
        freqmodel.set("memberID", $.cookie('Member._id'));
        freqmodel.set("resourceID", [id]);
        freqmodel.set("reviewed", [0]);
        freqmodel.set("frequency", [1]);
        freqmodel.save();
    } else {
        var freqmodel = resourcefreq.first();
        var index = freqmodel.get("resourceID").indexOf(id.toString());
        if (index != -1) {
            var freq = freqmodel.get('frequency');
            freq[index] = freq[index] + 1;
            freqmodel.save();
        } else {
            freqmodel.get("resourceID").push(id);
            freqmodel.get("frequency").push(1);
            if (!freqmodel.get("reviewed")) {
                freqmodel.set("reviewed", [0]);
            } else {
                freqmodel.get("reviewed").push(0);
            }
            freqmodel.save();
        }
    }
    var resInfo = new App.Models.Resource({
        _id: id
    });
    resInfo.fetch({
        async:false
    });
    $('ul.nav').html($('#template-nav-logged-in').html()).hide();
    Backbone.history.navigate('resource/feedback/add/' + id + '/' + resInfo.get("title"), {
        trigger: true
    });
}
function showRequestForm(modl) {
    App.renderRequest(modl);

    if (App.languageDict.get('directionOfLang').toLowerCase() === "right") {

        $('#site-request').css('direction','rtl');
        $('#site-request').find('span').css('margin-right','4%');
        $('#site-request').find('form').css('margin-right','2%');
        $('#site-request').find('div').css('margin-right','2%');
    }
}

function showSearchView() {
    $('#not-found').hide()
    App.Router.SearchBell(grpId, levelrevId, 0);

}

function selectAllSearchResult() {
    $("input[name='result']").each(function() {
        $(this).prop('checked', true);
    })
}

function CourseSearch() {
    //alert("COURSE SEARCH");
    skip = 0;
    searchText = $("#searchText").val();
    App.Router.GroupSearch();

}

function ListAllCourses() {
    App.Router.Groups()
}

function AddColletcion() {
    App.Router.AddNewSelect("Add New")
}

function EditColletcion(value) {
    App.Router.EditTag(value)
}

function lookup(obj, key) {
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
}

function continueMerging() {

    var collections = $('#selectCollections').val()
    var collectionText = $('#collectionName').val()

    if (collections) {
        if (collections.length < 2)
            alert(App.languageDict.attributes.Merge_Error)
        else if (collectionText == "")
            alert(App.languageDict.attributes.Empty_Collection_Name)
        else
            App.Router.mergecollection(collections, collectionText)
    } else
        alert(App.languageDict.attributes.Please_Select_Collections);

}

function cancelMerging() {

    document.getElementById('cont').style.opacity = 1
    document.getElementById('nav').style.opacity = 1
    $('#invitationdiv').hide()
}
function updateLanguageDoc (){
    var that = this;
    $.ajax({
        url: '/languages/_all_docs?include_docs=true',
        type: 'GET',
        dataType: 'json',
        success: function (langResult) {
            var resultRows = langResult.rows;
            var docs = [];
            for(var i = 0 ; i < resultRows.length ; i++) {
                if( resultRows[i].doc.nameOfLanguage){
                    console.log("attribute already exist")
                }
                else{
                    if(resultRows[i].doc.Dashboard=="My Home")
                    {
                        resultRows[i].doc.nameOfLanguage = "English";
                        docs.push(resultRows[i].doc);
                    }
                }

            }

            $.couch.db("languages").bulkSave({"docs": docs}, {
                success: function(data) {
                    console.log("Languages updated");

                },
                error: function(status) {
                    console.log(status);
                }
            });
        }


    });
}
