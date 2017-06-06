/// <reference path="./steps.d.ts" />
Feature('Courses');
var FirstLogin = false;
var loginCookies = [];

Before((I) => {
    I.login('admin', 'password');
    I.wait(10);
});

Scenario('Test for creating Course, Step and questions', (I, addquestion_po) => {
    var courses = '//*[@href="#courses"]';
    var addcourses = '//*[@id="addCourseButton"]';
    var check = '//*[@value="Daily"]';
    var selectQType = '//*[@id="add_new_question"]';
    var marks = '//*[@class="inputmarks"]';
    var singlelineTextarea = '//*[@id="6"]/div/textarea[@name="question_text"]';
    var singlelineMarks = '//*[@id="6"]/div/input[@type="number"]';
    var saveSingleline = '//*[@id="6"]/div/input[@value="Save Question"]';
    var commentboxTextarea = '//*[@id="8"]/div/textarea[@name="question_text"]';
    var commentboxMarks = '//*[@id="8"]/div/input[@type="number"]';
    var saveCommentbox = '//*[@id="8"]/div/input[@value="Save Question"]';
    var attachmentTextarea = '//*[@id="10"]/div/textarea[@name="question_text"]';
    var attachmentMarks = '//*[@id="10"]/div/input[@type="number"]';
    var saveAttachment = '//*[@id="10"]/div/input[@value="Save Question"]';
    var multipleTextarea = '//*[@id="1"]/div/textarea[@name="question_text"]';
    var multipleMarks = '//*[@id="1"]/div/div/input[@class="inputmarks"]';
    var saveMultiple = '//*[@id="1"]/div/input[@value="Save Question"]';
    var checkbox1 = '//*[@class="question_class"]/div[1]/input[@type="checkbox"]';
    var checkbox2 = '//*[@class="question_class"]/div[2]/input[@type="checkbox"]';
    var inputfield =  '//*[@class="question_class"]/div[1]/input[@type="textbox"]';
    var inputfield1 = '//*[@class="question_class"]/div[2]/input[@type="textbox"]';

    I.waitForVisible(courses);
    I.waitForEnabled(courses);
    I.click(courses);
    I.wait(5);
    I.waitForVisible(addcourses);
    I.waitForEnabled(addcourses);
    I.click(addcourses);
    I.wait(4);
    I.fillField('CourseTitle', "Science");
    I.fillField('languageOfInstruction', "English");
    I.fillField('memberLimit', "5");
    I.executeScript(function() {
       $("li#courseDescription > div textarea[name='description']").text("<strong><h2>Science</h2></strong><div><strong>           Science </strong>in a broad sense existed before the modern era and in many historical civilizations.");
    });
    I.fillField('method', "Science");
    I.selectOption('gradeLevel','10');
    I.selectOption('subjectLevel','Expert');
    I.fillField('startTime', "05/23/2017");
    I.fillField('endTime', "05/23/2017");
    I.fillField('startDate', "8:00am");
    I.fillField('endDate', "9:00am");
    I.checkOption(check);
    I.click('Continue');
    I.wait(2);
    I.seeInPopup('Course successfully created.');
    I.acceptPopup();
    I.wait(6);
    I.fillField('title', "Science Step");
    I.executeScript(function() {
        $("li#stepDescription > div textarea[name='description']").text("<strong><h2>Science</h2></strong><div><strong>           Science </strong>in a broad sense existed before the modern era and in many historical civilizations.");
    });
    I.executeScript(function() {
        $("[name=passingPercentage]").val(45);
    });
    I.click("Save");
    I.wait(10);
    I.click(("View Details").toString());
    I.wait(6);
    I.click("Create Test");
    I.wait(4);

    addquestion_po.selectQuestionType(selectQType,"Single Textbox",singlelineTextarea);
    addquestion_po.questionFillupAndSave(singlelineTextarea, 'What is your Name?', singlelineMarks, "100", saveSingleline)
    addquestion_po.selectQuestionType(selectQType,"Comment/Essay Box",commentboxTextarea);
    addquestion_po.questionFillupAndSave(commentboxTextarea, 'What is your Name', commentboxMarks, "100", saveCommentbox)
    addquestion_po.selectQuestionType(selectQType,"Attachment",attachmentTextarea);
    addquestion_po.questionFillupAndSave(attachmentTextarea, 'Upload file?', attachmentMarks, "100", saveAttachment)
    addquestion_po.selectQuestionType(selectQType,"Multiple Choice",multipleTextarea);
    I.fillField(multipleTextarea, 'Choice type question?');
    I.fillField(inputfield, "Cycle");
    I.fillField(inputfield1, "Bike");
    I.checkOption(checkbox1);
    I.checkOption(checkbox2);
    I.fillField(multipleMarks, "100");
    I.click(saveMultiple);
    I.seeInPopup('Question has been saved');
    I.acceptPopup();
    I.wait(4);
    I.click(courses);
    I.wait(10);
});


