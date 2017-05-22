/**************************************************************************************************************

Step 1 : Setup Members for the course  (Documents : members)
Step 2 : Setup courses  (Documents : courses)
Step 3 : Setup steps taken for courses  (Documents : coursestep)
Step 4 : Setup questions for courses  (Documents : coursequestion)
            questions type are :
            **Multiple Choice
            **Comment/Essay Box
            **Attachment
            **Single Textbox
Step 5 : question_id field should be update (Documents : coursestep)
Step 6 : Setup answers according to the questions type (Documents : courseanswer)
Step 7 : Setup progress for each member (Documents : membercourseprogress)

****************************************************************************************************************/

var sys = require('sys')
var fs = require('fs')
var exec = require('child_process').exec;
var program = require('commander');
var databases = []
program
    .version('0.0.2')
    .parse(process.argv);
if (!program.args[0]) return console.log('No CouchDB URL provided. Quiting now.')
var couchUrl = program.args[0]
var nano = require('nano')(couchUrl)

/**function start() {
    increaseLimits()
}**/

// Increase Limits so couchapp push works correctly
function increaseLimits() {
    exec('sudo launchctl limit maxfiles 150056 150056', function doneWithLaunchCtl() {
        exec('sudo ulimit -n 150056', function doneWithUlimit() {
            return createDummyCourses()
        })
    })
}

var n_members = 5 ; //Number of Iteration to run for members 
var n_courses = 25 ; //Number of Iteration to run for courses 
var defaultMember = [];
var default_NewMember = []; //Contains only MemberID
var defaultCourses = []; //Contains only CourseID and MemberList
var defaultCoursestep = []; 
var defaultCoursequestion = [];
var defaultUpdateCourse = [];
var defaultCourseAnswer = [];
var defaultMemberCourseProgress = [];
var dummyData = [];
var dummyData1 = [];
var dummyData2 = [];
var dummyData3 = [];

function createDummyCourses() {

    //Step 1
    var members = nano.db.use('members');
    nano.db.get('members', function(err, body) {
        if (err) console.log(err)
        //First you need to create Member:
        for(member = 0; member < n_members; member++){
            participation = member + 1;
            if(member < parseInt(n_members/2)){
                defaultMember.push({
                    "login": "member" + participation,
                    "kind": "Member",
                    "roles": ["Manager"],
                    "firstName": "Member " + participation,
                    "lastName": "Member " + participation,
                    "password": "password",
                    "Gender": "Male",
                    "status": "active",
                    "email": "member" + participation + ".somalia@olebell.org",
                    "visits": 0,
                    "BirthDate": "01/01/1985"
                });
            }else{
                defaultMember.push({
                    "login": "member" + participation,
                    "kind": "Member",
                    "roles": ["Learner"],
                    "firstName": "Member " + participation,
                    "lastName": "Member " + participation,
                    "password": "password",
                    "Gender": "Male",
                    "status": "active",
                    "email": "member" + participation + ".somalia@olebell.org",
                    "visits": 0,
                    "BirthDate": "01/01/1985"
                });
            }
        }

        members.bulk({"docs":defaultMember}, function(err, res) {
            if (err)
                return console.log(err);
            else {
                for(var i in res){
                    var member_id = res[i].id ;
                    default_NewMember.push([member_id]);
                }

                function randomMember(){
                    var random_number = Math.floor((Math.random() * res.length) + 1);
                    var random_member = [];
                    for(i = 0; i < random_number; i++){
                        random = res[Math.floor(Math.random() * res.length)];
                        if(random_member.indexOf(random.id) == -1)
                            random_member.push(random.id);
                    }
                    return random_member;
                }
                var courses = nano.db.use('courses');
                for(course = 0; course < n_courses; course++){
                    course_number = course + 1;
                    var subjectLevel;
                    if (course <=3){
                        subjectLevel = "Amateur";
                    }else if(course>=4 && course<=8){
                        subjectLevel = "Mid";
                    }else{
                        subjectLevel = "Beginner";
                    }
                    random_member_list = randomMember();
                    defaultCourses.push({
                        "CourseTitle": "Course " +course_number,
                        "Day": "0",
                        "backgroundColor": "",
                        "courseLeader": "",
                        "description": "This is Course " +course_number+" .",
                        "endDate": "12/12/2017",
                        "endTime": "17:00",
                        "foregroundColor": "",
                        "gradeLevel": "1",
                        "kind": "Course",
                        "languageOfInstruction": "English",
                        "location": "Alberta",
                        "memberLimit": "20",
                        "members": random_member_list,
                        "method": "Theory and Practical",
                        "name": "Course " +course_number,
                        "startDate": "01/01/2017",
                        "startTime": "10:00",
                        "subjectLevel": subjectLevel
                    });
                }

                //insert into courses
                courses.bulk({"docs":defaultCourses}, function(err, res) {
                    if (err)
                        return console.log(err);
                    else {
                        for(var i = 0; i< defaultCourses.length; i++){
                            for(var j in defaultCourses[i].members){
                                dummyData.push({
                                    courseID :  res[i].id,
                                    memberID : defaultCourses[i].members[j]
                                });
                            }
                        }

                        function randomCourses(){
                            var random_number = res[Math.floor(Math.random() * res.length)];
                            random = res[Math.floor(Math.random() * res.length)];
                            var random_course_id = random.id;
                            return random_course_id;
                        }

                        for(var i = 0; i < dummyData.length; i++){
                            var course_id = randomCourses();
                            defaultCoursestep.push({
                                "courseId": course_id,
                                "description": "This is course step "+ (parseInt(i)+1),
                                "kind": "Course Step",
                                "passingPercentage": "30",
                                //"questionslist": "",
                                "resourceId": "",
                                "resourceTitles": "",
                                "step": "1",
                                "stepGoals": "Knowledge",
                                "stepMethod": "Theory",
                                "title": "Course Step "+ (parseInt(i)+1),
                                "totalMarks": "100"
                            });
                        }
                        var coursestep = nano.db.use('coursestep');
                        coursestep.bulk({"docs":defaultCoursestep}, function(err, res) {
                            if (err)
                                return console.log(err);
                            else {
                                for(var i = 0; i< defaultCoursestep.length; i++){
                                    dummyData1.push({
                                        courseID :  defaultCoursestep[i].courseId,
                                        stepID : res[i].id
                                    });
                                    defaultCoursestep[i]._id = res[i].id; 
                                    defaultCoursestep[i]._rev = res[i].rev; 
                                }

                                function randomCourseStatement(){
                                    var statement = ["Multiple Choice", "Comment/Essay Box", "Attachment", "Single Textbox"];
                                    var type = statement[Math.floor(Math.random() * statement.length)];
                                    return type;
                                }

                                for(var i = 0; i < dummyData1.length; i++){
                                    var course_id = dummyData1[i].courseID;
                                    var step_id = dummyData1[i].stepID;
                                    var course_type = randomCourseStatement();
                                    switch(course_type){
                                        case "Multiple Choice" : defaultCoursequestion.push({
                                                                    "CorrectAnswer":  [
                                                                                        "A",
                                                                                        "B"
                                                                                        ],
                                                                    "Options": [
                                                                                "A",
                                                                                "B",
                                                                                "C",
                                                                                "D"
                                                                                ],
                                                                    "Statement": "Question "+ (parseInt(i)+1) +" ?",
                                                                    "Type": course_type,
                                                                    "courseId": course_id,
                                                                    "kind": "coursequestion",
                                                                    "stepId" : step_id,
                                                                    "Marks" : 90
                                                                });
                                                                break;
                                        case "Comment/Essay Box" : defaultCoursequestion.push({
                                                                        "Statement": "Question "+ (parseInt(i)+1) +" ?",
                                                                        "Type": course_type,
                                                                        "courseId": course_id,
                                                                        "kind": "coursequestion",
                                                                        "stepId" : step_id,
                                                                        "Marks" : 90
                                                                    });
                                                                    break;
                                        case "Attachment" : defaultCoursequestion.push({
                                                                        "Statement": "Question "+ (parseInt(i)+1) +" ?",
                                                                        "Type": course_type,
                                                                        "courseId": course_id,
                                                                        "kind": "coursequestion",
                                                                        "stepId" : step_id,
                                                                        "Marks" : 90
                                                                    });
                                                                    break;
                                        case "Single Textbox" : defaultCoursequestion.push({
                                                                        "Statement": "Question "+ (parseInt(i)+1) +" ?",
                                                                        "Type": course_type,
                                                                        "courseId": course_id,
                                                                        "kind": "coursequestion",
                                                                        "stepId" : step_id,
                                                                        "Marks" : 90
                                                                    });
                                                                    break;
                                    }
                                }
                                var coursequestion = nano.db.use('coursequestion');
                                coursequestion.bulk({"docs":defaultCoursequestion}, function(err, res) {
                                    if (err)
                                        return console.log(err);
                                    else {
                                        //need to update questionlist in coursestep
                                        for(var i = 0; i < defaultCoursequestion.length; i++){
                                            var question_list_id = [];
                                            for(var j in dummyData1){
                                                if(defaultCoursequestion[i].courseId == dummyData1[j].courseID && defaultCoursequestion[i].stepId == dummyData1[j].stepID){
                                                    var x = res[i].id;
                                                    if(question_list_id.indexOf(x) == -1)
                                                        question_list_id.push(x);
                                                }
                                            }
                                            defaultCoursestep[i].questionslist = question_list_id;
                                        }

                                        coursestep.bulk({"docs":defaultCoursestep},  function(err, body) {
                                            if (err)
                                                return console.log(err);
                                        });
                                        /////////////////////////////////////////////////
                                        for(var i = 0; i < defaultCoursequestion.length; i++){
                                            dummyData1[i].questionID = res[i].id;
                                            dummyData1[i].Type = defaultCoursequestion[i].Type;
                                            dummyData1[i].TotalMarks = defaultCoursequestion[i].Marks;
                                        }

                                        function randomObtainmarks(){
                                            var marks = Math.floor(Math.random() * 90);
                                            return marks;
                                        }

                                        for(var i = 0; i < dummyData1.length; i++){
                                            var course_type = dummyData1[i].Type;
                                            var question_id = dummyData1[i].questionID;
                                            var step_id = dummyData1[i].stepID;
                                            for(var j in dummyData){
                                                if(dummyData1[i].courseID == dummyData[j].courseID){
                                                    var member_id = dummyData[j].memberID;
                                                    var ObtainMarks = randomObtainmarks();
                                                    switch(course_type)
                                                    {
                                                        case "Multiple Choice" : defaultCourseAnswer.push({
                                                                                            "Answer":  [
                                                                                                        "A",
                                                                                                        "B"
                                                                                                        ],
                                                                                            "MemberID": member_id,
                                                                                            "ObtainMarks": ObtainMarks,
                                                                                            "QuestionID": question_id,
                                                                                            "StepID": step_id,
                                                                                            "kind": "courseanswer",
                                                                                            "pqattempts": 1
                                                                                        });
                                                                                    break;
                                                        case "Comment/Essay Box" : defaultCourseAnswer.push({
                                                                                            "Answer":  "Answer",
                                                                                            "MemberID": member_id,
                                                                                            "ObtainMarks": ObtainMarks,
                                                                                            "QuestionID": question_id,
                                                                                            "StepID": step_id,
                                                                                            "kind": "courseanswer",
                                                                                            "pqattempts": 1
                                                                                        });
                                                                                    break;
                                                        case "Attachment" : defaultCourseAnswer.push({
                                                                                            "Answer":  "Answer",
                                                                                            "MemberID": member_id,
                                                                                            "ObtainMarks": ObtainMarks,
                                                                                            "QuestionID": question_id,
                                                                                            "StepID": step_id,
                                                                                            "kind": "courseanswer",
                                                                                            "pqattempts": 1
                                                                                        });
                                                                                    break;
                                                        case "Single Textbox" : defaultCourseAnswer.push({
                                                                                            "Answer":  "Answer",
                                                                                            "MemberID": member_id,
                                                                                            "ObtainMarks": ObtainMarks,
                                                                                            "QuestionID": question_id,
                                                                                            "StepID": step_id,
                                                                                            "kind": "courseanswer",
                                                                                            "pqattempts": 1
                                                                                            });
                                                                                    break;
                                                    }
                                                }
                                            }
                                        }
                                        var courseanswer = nano.db.use('courseanswer');
                                        courseanswer.bulk({"docs":defaultCourseAnswer}, function(err, res){
                                            if(err){
                                                return console.log(err);
                                            }else{
                                                for(var i = 0; i< defaultCourseAnswer.length; i++){
                                                    dummyData2.push({
                                                        AnswerID :  res[i].id,
                                                        MemberID : defaultCourseAnswer[i].MemberID,
                                                        QuestionID : defaultCourseAnswer[i].QuestionID,
                                                        StepID : defaultCourseAnswer[i].StepID,
                                                        ObtainMarks : defaultCourseAnswer[i].ObtainMarks,
                                                    });
                                                }

                                                for(var i = 0; i < dummyData2.length; i++){
                                                    var memberIDs = dummyData2[i].MemberID;
                                                    var questionIDs = dummyData2[i].questionID;
                                                    for(var j in dummyData){
                                                        if(memberIDs == dummyData[j].memberID){
                                                            var courseIDs = dummyData[j].courseID;
                                                            var stepIDs = [];
                                                            for(var k in dummyData1){
                                                                if(courseIDs == dummyData1[k].courseID && questionIDs == dummyData1[k].QuestionID){
                                                                    var x =dummyData1[k].stepID;
                                                                    if(stepIDs.indexOf(x) == -1)
                                                                        stepIDs.push(x);
                                                                }
                                                            }
                                                        }
                                                        if(memberIDs && courseIDs){
                                                            dummyData3.push({
                                                                MemberID : memberIDs,
                                                                CourseID : courseIDs,
                                                                StepID : stepIDs
                                                            });
                                                        }
                                                    }

                                                }

                                                // For removing duplicated data in json object
                                                function hash(o){
                                                    return (o.CourseID + o.MemberID);
                                                }    

                                                var hashesFound = {};
                                                dummyData3.forEach(function(o){
                                                    hashesFound[hash(o)] = o;
                                                })

                                                var results = Object.keys(hashesFound).map(function(k){
                                                    return hashesFound[k];
                                                })

                                                ////////////////////////////////////////////////////
                                                for (var i = 0; i < defaultCourses.length; i++){
                                                    if(defaultCourses[i].questionID == defaultCourseAnswer[i].QuestionID &&  defaultCourses[i].memberID == defaultCourseAnswer[i].MemberID && defaultCourses[i].stepID == defaultCourseAnswer[i].StepID){
                                                        defaultCourses[i].answerID = res[i].id;
                                                        defaultCourses[i].ObtainMarks = defaultCourseAnswer[i].ObtainMarks;
                                                    }
                                                }

                                                for (var i = 0; i < results.length; i++){
                                                    var pqAttempts = [];
                                                    var stepResult = [];
                                                    var stepsStatus = [];
                                                    var count = results[i].StepID.length;
                                                    var steps = results[i].StepID;
                                                    for(var j = 0 ; j < count; j++ ){
                                                        pqAttempts.push(1);
                                                        var total_marks = [];
                                                        var total_status = [];
                                                        var marks = [];
                                                        for(var k = j; k < count ; k ++){
                                                            if(results[i].MemberID == dummyData2[k].MemberID && results[i].StepID[j] == dummyData2[k].StepID){
                                                                var obtain_marks = dummyData2[k].ObtainMarks;
                                                                marks = Math.ceil((obtain_marks / 90) * 100) ;
                                                                total_marks.push(null,""+marks+"");
                                                                if(marks!= ""){
                                                                    if(marks < 30){
                                                                        total_status.push([null,"1"]);
                                                                    }else{
                                                                        total_status.push([null,"0"]);
                                                                    }
                                                                }else{
                                                                    total_status.push([null,"0"]);
                                                                }
                                                            }
                                                        }
                                                        stepResult.push(total_marks);
                                                        stepsStatus.push(total_status);
                                                    }

                                                    defaultMemberCourseProgress.push({
                                                        "courseId":  results[i].CourseID,
                                                        "kind": "course-member-result",
                                                        "memberId": results[i].MemberID,
                                                        "pqAttempts": pqAttempts,
                                                        "stepsIds": steps,
                                                        "stepsResult": stepResult,
                                                        "stepsStatus": stepsStatus
                                                    });

                                                }
                                                //console.log(defaultMemberCourseProgress);
                                                //return false;
                                                var membercourseprogress = nano.db.use('membercourseprogress');
                                                membercourseprogress.bulk({"docs":defaultMemberCourseProgress}, function(err, res){
                                                    if(err){
                                                        return console.log(err);
                                                    }else{
                                                        done();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

function done(){
    console.log("done");
}

//
// Trigger Start 
//

start()