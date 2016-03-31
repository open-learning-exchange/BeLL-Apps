$(function () {

    App.Views.CommunitySurveysTable = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        communitySurveysCollection:[],

        add: function (model) {
            console.log(model);
            this.$el.append('<tr id="' + model._id + '"><td>' + model.birthYearOfMember+ '</td><td>' + model.genderOfMember+ '</td><td><a name="' +model._id +
            '" class="openCommunitySurvey btn btn-info" href="#openCommunitySurvey/' + model._id + '">'+App.languageDictValue.get('Open')+'</a><label>&nbsp</label><a name="' +model._id +
                '" class="downloadCommunitySurveys btn btn-info">Download in CSV</a></td></tr>');
        },

        events:{
            "click .downloadCommunitySurveys": "downloadCommunitySurveys"
        },

        render: function () {
            var that = this;
            this.$el.html('<tr><th>'+App.languageDictValue.get('birthYear')+'</th><th>'+App.languageDictValue.get('Gender')+'</th><th>'+App.languageDictValue.get('Actions')+'</th></tr>');
            _.each(this.communitySurveysCollection,function(row){
                var survey = row;
                that.add(survey);
            });
        },

        downloadCommunitySurveys: function (e) {
            var that = this;
            var surveyResId = e.currentTarget.name;
            var surveyResModel;
            $.ajax({
                url: '/surveyresponse/_design/bell/_view/surveyResById?key="' + surveyResId + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(json) {
                    if (json.rows[0]) {
                        surveyResModel = json.rows[0].value;
                    }
                    if(surveyResModel) {
                        var surveyTitle = surveyResModel.SurveyTitle;
                        var surveyNo = surveyResModel.SurveyNo;
                        var commName = surveyResModel.communityName;
                        var genderOfMember = surveyResModel.genderOfMember;
                        var birthYearOfMember = surveyResModel.birthYearOfMember;
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
                        var answerModels = answersColl.models;
                        var answersArray = [];
                        var jsonArrayOfAnswers = [];
                        for(var i = 0 ; i < answerModels.length ; i++) {
                            answersArray.push(answerModels[i].attributes);
                        }
                        for(var j = 0 ; j < answersArray.length ; j++) {
                            var JSONObj = { "QType":"", "QStatement":"", "Options":[], "Ratings":[], "Answer":[] };
                            JSONObj.QType = answersArray[j].Type;
                            JSONObj.QStatement = answersArray[j].Statement;
                            if(answersArray[j].Options){
                                JSONObj.Options =answersArray[j].Options;
                            }
                            if(answersArray[j].Ratings){
                                JSONObj.Ratings =answersArray[j].Ratings;
                            }
                            JSONObj.Answer = answersArray[j].Answer;
                            jsonArrayOfAnswers.push(JSONObj);
                        }
                        that.JSONToCSVConvertor(jsonArrayOfAnswers, surveyTitle+ '/' + surveyNo + '/' + commName, genderOfMember+ '/' + birthYearOfMember);
                    }
                }
            })
        },

        JSONToCSVConvertor: function (JSONData, ReportTitle, label) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';
            //Set Report title in first row or line
            CSV += label + '\r\n\n';
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
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
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
            this.$el.append(link);
            link.click();
        }

    })
})