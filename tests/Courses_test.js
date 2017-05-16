
Feature('Courses');
var FirstLogin = false;
var loginCookies = [];


Before((I) => {
    I.login('admin', 'password');
    I.wait(10);
});

Scenario('Add Course', (I) => {
    var courses = '//*[@href="#courses"]';
    var addcourses = '//*[@id="addCourseButton"]';
    var check = '//*[@value="Daily"]';
    I.seeInCurrentUrl('#dashboard');
    I.waitForVisible(courses);
    I.waitForEnabled(courses);
    I.click(courses);
    I.wait(10);
    I.waitForVisible(addcourses);
    I.waitForEnabled(addcourses);
    I.click(addcourses);
    I.wait(10);
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
    I.wait(10);
    I.click('Continue');
    I.waitForVisible(courses);
    I.waitForEnabled(courses);
    I.click(courses);
    I.wait(20);
});

