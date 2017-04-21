'use strict';

let I;

module.exports = {

    _init() {
        I = require('../steps_file.js')();
    },

    // Locators:
    managerLink: '//*[@id="NationManagerLink"]',
    publicationsLink: '//*[@href="#publication"]',
    addIssue: '//*[@href="#publication/add"]',
    saveIssue: '//*[@name="save"]',
    cancelIssue: '//*[@id="cancel"]',
    deleteIssueBtns: '//*[@id="parentDiv"]/table/tbody/tr/td/*[@class="btn btn-danger destroy"]',
    editorName: '//*[@name="editorName"]',
    editorEmail: '//*[@name="editorEmail"]',
    editorPhone: '//*[@name="editorPhone"]',
    saveButton: '//*[@name="saveButton"]',

    go_to_publications(direct) {
        if (direct)
        {
            I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/nation/index.html#publication');
            I.wait(2);
            I.waitForVisible(this.addIssue);
        }
        else
        {
            I.waitForVisible(this.managerLink);
            I.click(this.managerLink);
            I.wait(10);
            I.waitForVisible(this.publicationsLink);
            I.click(this.publicationsLink);
            I.waitForVisible(this.addIssue);
            I.see("Publications");
            I.seeInCurrentUrl('#publication');
        }
    },

    create_publication(name, email, phone) {
        I.waitForVisible(this.addIssue);
        I.click(this.addIssue);
        I.waitForVisible(this.editorName);
        I.waitForVisible(this.saveIssue);
        I.fillField(this.editorName, name);
        I.fillField(this.editorEmail, email);
        I.fillField(this.editorPhone, phone);
    },

    save_publication()
    {
        I.seeInCurrentUrl('#publication/add');
        I.click(this.saveIssue);
        I.wait(1);
        I.seeInPopup("Issue saved");
        I.acceptPopup();
        I.wait(1);
    },

    cancel_publication()
    {
        I.waitForVisible(this.cancelIssue);
        I.click(this.cancelIssue);
        I.waitForVisible(this.addIssue);
        I.see("Publications");
        I.seeInCurrentUrl('#publication');
    },

    delete_publication()
    {
        I.waitForVisible(this.deleteIssueBtns);
        I.click(this.deleteIssueBtns);
        I.wait(1);
        I.seeInPopup("Are you sure you want to delete this publication?");
        I.acceptPopup();
        I.wait(1);
        I.seeInPopup("Model of publications is accessed.");
        I.acceptPopup();
    },

    return_home()
    {
        I.waitForVisible('//*[@id="itemsinnavbar"]/li/a');
        I.click('//*[@id="itemsinnavbar"]/li/a');
        I.waitForVisible(this.managerLink);
        I.wait(2);
    }


}