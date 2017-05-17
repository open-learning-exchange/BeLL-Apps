'use strict';

let I;

module.exports = {

    _init() {
        I = require('../steps_file.js')();
    },

    // Locators
    meetupLink: '//*[@id="itemsinnavbar"]/li/a[@href="#meetups"]',
    addMeetupButton: '//*[@id="linkOfMeetUpHeading"]',
    meetupSaveButton: '//*[@id="MeetUpformButton"]',
    meetupFormCancel: '//*[@id="MeetUpcancel"]',
    form: '//*[@id="meetUpForm"]',
    meetupTitle: '//*[@name="title"]',
    meetupDesc: '//*[@name="description"]',
    meetupSdate: '//*[@name="startDate"]',
    meetupEdate: '//*[@name="endDate"]',
    meetupStime: '//*[@name="startTime"]',
    meetupEtime: '//*[@name="endTime"]',
    meetupCategory: '//*[@name="category"]',
    meetupLocation: '//*[@name="meetupLocation"]',
    meetupRecurringOpt: {
        Daily: '//*[@value="Daily"]', Weekly: '//*[@value="Weekly"]'
    },
    inviteWindow: '//*[@id="invitationdiv"]',
    inviteButton: '//*[@id="InviteMembers"]',
    inviteType: '//*[@name="invitationType"]',
    inviteSendButton: '//*[@id="formButton"]',
    cancelInvite: '//*[@id="cancelButton"]',

    go_to_meetups() {
        I.waitForVisible(this.meetupLink);
        I.wait(1);
        I.click(this.meetupLink);
        I.waitForVisible(this.addMeetupButton);
        I.see("Topic");
        I.see("Action");
    },
    create_meetup() {
        I.waitForVisible(this.addMeetupButton);
        I.click(this.addMeetupButton);
        I.waitForVisible(this.meetupSaveButton);
        I.see("Start a New Meetup");
    },
    delete_meetup(name) {
        let deleteBTN = '//*[@id="parentLibrary"]/table/tbody/tr[contains(.,"' + name + '")]/td[4]/a';
        I.waitForVisible(this.addMeetupButton);
        I.see("Topic");
        I.waitForVisible(deleteBTN);
        I.scrollTo(deleteBTN);
        I.wait(1);
        I.click(deleteBTN);
        I.wait(1);
        I.seeInPopup("Are you sure that you want to delete this meetup?");
        I.acceptPopup();
        I.wait(1);
        I.dontSeeElement(deleteBTN);

    },
    fill_meetup_form(title, desc, recurringState, sdate, edate, stime, etime, catagory, location) {
        I.seeInCurrentUrl("#meetup/add");
        I.waitForVisible(this.meetupSaveButton);
        I.see("Start a New Meetup");

        I.waitForVisible(this.form);

        I.fillField(this.meetupTitle, title);
        I.fillField(this.meetupDesc, desc);
        I.fillField(this.meetupSdate, sdate);
        I.fillField(this.meetupEdate, edate);
        I.fillField(this.meetupStime, stime);
        I.fillField(this.meetupEtime, etime);
        I.selectOption(this.meetupCategory, catagory);
        I.fillField(this.meetupLocation, location);

        if (recurringState === "Daily") {
            I.click(this.meetupRecurringOpt.Daily);
        }
        else if (recurringState === "Weekly") {
            I.click(this.meetupRecurringOpt.Weekly);
        }
    },

    invite_members(names, type) {
        I.waitForVisible(this.inviteButton);
        I.click(this.inviteButton);
        I.waitForVisible(this.inviteWindow);
        I.waitForVisible(this.inviteType);
        // The defualt option is all, so we only have to change it
        // if they have a list of memebers they want to add.
        if (type === "Members")
        {
            I.selectOption(this.inviteType, type)
            names.forEach(function (item) {
                I.click('//*[@id="invitationForm"]//li//li[contains(.,"' + item + '")]/input');
            });
        }
        I.click(this.inviteSendButton);
        I.wait(1);
        I.seeInPopup("Invitation sent successfully.");
        I.acceptPopup();
    },

    cancel_meetup()
    {
        I.waitForVisible(this.meetupFormCancel);
        I.wait(1);
        I.click(this.meetupFormCancel);
        I.waitForVisible(this.addMeetupButton);
        I.see("Topic");
    },

    save_meetup() {
        I.waitForVisible(this.inviteButton);
        I.click(this.inviteButton);
        I.waitForVisible(this.cancelInvite);
        I.click(this.cancelInvite);
        I.waitForStalenessOf(this.cancelInvite);
        I.waitForVisible(this.addMeetupButton);
    }
}
