
Feature('Courses');
var FirstLogin = false;
var loginCookies = [];


Before((I) => {
    I.login('admin', 'password');
    I.wait(10);
});

Scenario('Test For Course', (I) => {
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
    I.fillField('description', "This is all about topic science");
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
    I.wait(2);
    I.fillField('title', "Science Step");
    I.fillField('div.courseSearchResults_Bottom textarea[name=description]', 'This is all about topic science');
    I.executeScript(function() {
        $("[name=passingPercentage]").val(45);
    });
    I.click("Save");
    I.wait(4);
    I.click(("View Details").toString());
    I.wait(4);
    I.click("Create Test");
    I.wait(2);

    I.selectOption(selectQType, "Single Textbox");
    I.waitForVisible(singlelineTextarea);
    I.waitForEnabled(singlelineTextarea);
    I.fillField(singlelineTextarea, 'What is your Name');
    I.fillField(singlelineMarks, "100");
    I.click(saveSingleline);
    I.seeInPopup('Question has been saved');
    I.acceptPopup();
    I.wait(4);

    I.selectOption(selectQType, "Comment/Essay Box");
    I.waitForVisible(commentboxTextarea);
    I.waitForEnabled(commentboxTextarea);
    I.fillField(commentboxTextarea, 'What is your Name');
    I.fillField(commentboxMarks, "100");
    I.click(saveCommentbox);
    I.seeInPopup('Question has been saved');
    I.acceptPopup();
    I.wait(4);
    
    I.selectOption(selectQType, "Attachment");
    I.waitForVisible(attachmentTextarea);
    I.waitForEnabled(attachmentTextarea);
    I.fillField(attachmentTextarea, 'Upload file?');
    I.fillField(attachmentMarks, "100");
    I.click(saveAttachment);
    I.seeInPopup('Question has been saved');
    I.acceptPopup();
    I.wait(4);
    I.click(courses);
});

