
Feature('Meetup');
var FirstLogin = false;
var loginCookies = [];


Before((I) => {
    I.login('admin', 'password');
    I.wait(10);
});

Scenario('Add Meetup', (I) => {
	var Meetup = '//*[@href="#meetups"]';
    var Addmeetup = '//*[@href="#meetup/add"]';
    var InviteMembers = '//*[@id="InviteMembers"]';
    var check = '//*[@value="Weekly"]';
    var Category = '//*[@name="category"]';
    I.seeInCurrentUrl('#dashboard');
    I.waitForVisible(Meetup);
    I.waitForEnabled(Meetup);
    I.click(Meetup);
    I.wait(10);
    I.waitForVisible(Addmeetup);
    I.waitForEnabled(Addmeetup);
    I.click(Addmeetup);
    I.wait(10);
    I.fillField('title', "Virtual Interns");
    I.fillField('description', "For Upgrading Bell-App");
    I.fillField('startDate', "05/23/2017");
    I.fillField('endDate', "05/23/2017");
    I.checkOption(check);
    I.fillField('startTime', "8:00am");
    I.fillField('endTime', "10:00am");
    I.selectOption(Category, "ICT");
    I.wait(5);
    I.fillField('meetupLocation', "Kathmandu");
    I.click(InviteMembers);
    I.wait(20);
});

