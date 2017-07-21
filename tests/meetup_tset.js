/// <reference path="./steps.d.ts" />
Feature('Meetup');

var today = new Date();
var dd = today.getDate();

var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

Before((I) => {
    I.login('admin', 'password');
    I.wait(2);
});

Scenario('test single day meetup', (I, meetup_po) => {
    // Pick some dates
    let someDate = new Date();
    someDate.setDate(someDate.getDate() + 1); 
    let dd1 = 0, dd2 = someDate.getDate();
    let mm2 = someDate.getMonth() + 1;
    let yy2 = someDate.getFullYear();
    if (dd < 10) {
        dd1 = '0' + dd;
    }
    if (dd2 < 10) {
        dd2 = '0' + dd2;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (mm2 < 10) {
        mm2 = '0' + mm;
    }
    let sdate = mm + '-' + dd1 + '-' + yyyy;
    let edate = mm2 + '-' + dd2 + '-' + yy2;  

    // Do the actual tests
    meetup_po.go_to_meetups();
    meetup_po.create_meetup();
    meetup_po.fill_meetup_form("Test Single Day Meetup", "This is a single day meetup, automatically created by meetup_test.js",
        "none", sdate, edate, "8:00am", "11:00pm", 'E Learning', "Test location A");
    meetup_po.invite_members(null, 'All');
});

Scenario('test multiday meetup', (I, meetup_po) => {
    // Pick some dates
    let someDate = new Date();
    someDate.setDate(someDate.getDate() + 7);
    let dd1 = 0, dd2 = someDate.getDate();
    let mm2 = someDate.getMonth() + 1;
    let yy2 = someDate.getFullYear();
    if (dd < 10) {
        dd1 = '0' + dd;
    }
    if (dd2 < 10) {
        dd2 = '0' + dd2;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (mm2 < 10) {
        mm2 = '0' + mm;
    }
    let sdate = mm + '-' + dd1 + '-' + yyyy;
    let edate = mm2 + '-' + dd2 + '-' + yy2;

    // Do the actual tests
    meetup_po.go_to_meetups();
    meetup_po.create_meetup();
    meetup_po.fill_meetup_form("Multiple Day Meetup", "This is a multiple day meetup, automatically created by meetup_test.js",
        "none", sdate, edate, "7:00am", "5:00pm", 'First Time', "Test location B");
    meetup_po.invite_members(null, 'All');
});


Scenario('test recurring meetup', (I, meetup_po) => {
    // Pick some dates
    let someDate = new Date();
    someDate.setDate(someDate.getDate() + 60);
    let dd1 = 0, dd2 = someDate.getDate();
    let mm2 = someDate.getMonth() + 1;
    let yy2 = someDate.getFullYear();
    if (dd < 10) {
        dd1 = '0' + dd;
    }
    if (dd2 < 10) {
        dd2 = '0' + dd2;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (mm2 < 10) {
        mm2 = '0' + mm;
    }
    let sdate = mm + '-' + dd1 + '-' + yyyy;
    let edate = mm2 + '-' + dd2 + '-' + yy2;

    // Do the actual tests
    meetup_po.go_to_meetups();
    meetup_po.create_meetup();
    meetup_po.fill_meetup_form("Recurring Meetup", "This is a recurring  meetup, automatically created by meetup_test.js",
        "Daily", sdate, edate, "9:00am", "2:00pm", 'First Time', "Test location C");
    meetup_po.invite_members(null, 'All');
});
Scenario('test cancel meetup', (I, meetup_po) => {
    meetup_po.go_to_meetups();
    meetup_po.create_meetup();
    meetup_po.cancel_meetup();
});

Scenario('test delete meetup', (I, meetup_po) => {
    meetup_po.go_to_meetups();
    meetup_po.delete_meetup("Test Single Day Meetup");
    meetup_po.delete_meetup("Multiple Day Meetup");
    meetup_po.delete_meetup("Recurring Meetup");
});