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
    var EmailClick = '//*[@id="#mailsDash"]';
	var Accept = '//*[@id="#invite-accept"]'

    I.seeInCurrentUrl('#dashboard');
    I.waitForVisible(Meetup);
    I.waitForEnabled(Meetup);
    I.click(Meetup);
    I.seeInCurrentUrl('#meetups');
    I.waitForVisible(Addmeetup);
    I.waitForEnabled(Addmeetup);
    I.click(Addmeetup);
    I.seeInCurrentUrl('#meetup/add');
    I.wait(5);
    I.fillField('title', "Virtual Interns II");
    I.fillField('description', "For switching in Angular4 and upgrading.");
    I.fillField('startDate', "05/23/2017");
    I.fillField('endDate', "05/23/2017");
    I.checkOption(check);
    I.fillField('startTime', "8:00am");
    I.fillField('endTime', "10:00am");
    I.selectOption(Category, "ICT");
    I.fillField('meetupLocation', "Kathmandu");
    I.click(InviteMembers);
    I.wait(5);
    I.selectOption('invitationType',"All");
    I.click("Invite");
    I.wait(5);
});