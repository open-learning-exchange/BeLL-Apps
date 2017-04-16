'use strict';
let I;

module.exports = {

    _init() {
        I = require('../steps_file.js')();
    },

    // Locators
    managerLink: '//*[@id="NationManagerLink"]',
    surveyList: '//*[@id="surveys"]/tbody/tr[1]/th/a',
    addSurveyBtn: "//a[contains(@href, '#survey/add')]",
    surveyTitle: '//*[@name="SurveyTitle"]',
    saveSurveybtn: '//*[@name="save"]',
    // The first survey in the table listing all surveys.
    firstSurvey: '//*[@id="parentDiv"]/table/tbody/tr[2]/td[7]/a[3]',
    selectQType: '//*[@id="add_new_question"]',
    viewCommunitiesList: '//button[contains(@onclick,"communitiesList")]',
    bellSelector: '//*[@name="bellSelector"]',
    openMemberlist: '//*[@id="main-body"]/div/div/button[@id="openMembersList"]',
    surveyMember: '//*[@name="surveyMember"]',
    includeAdmins: '//*[@name="includeAdmins"]',
    unselectAllMembers: '//*[@id="UnSelectAllMembers"]',
    selectAllBells: '//*[@id="selectAllBells"]',
    selectAllMembers: '//*[@id="selectAllMembers"]',
    sendSurvey: '//*[@id="sendSurveyToSelectedList"]',
    addQuestion: '//*[@id="addQuestion"]',

    go_to_surveys() {
        I.seeInCurrentUrl('#dashboard');
        I.waitForVisible(this.managerLink);
        I.waitForEnabled(this.managerLink);
        I.click(this.managerLink);
        I.wait(10);
        I.waitForVisible(this.surveyList, 20);
        I.waitForEnabled(this.surveyList, 20);
        I.click(this.surveyList);
        I.wait(10);
        I.waitForVisible(this.addSurveyBtn);
        I.waitForElement(this.addSurveyBtn);
    },
    delete_first_survey() {
        I.waitForVisible(this.firstSurvey);
        I.waitForElement(this.firstSurvey);
        I.click(this.firstSurvey);
        I.wait(2);
        I.seeInPopup('Are you sure you want to delete this survey?');
        I.acceptPopup();
    },
    add_survey(name) {
        I.click(this.addSurveyBtn);
        I.waitForVisible(this.surveyTitle);
        I.waitForEnabled(this.surveyTitle);
        I.fillField('SurveyTitle', name);
        I.waitForVisible(this.saveSurveybtn);
        I.waitForEnabled(this.saveSurveybtn);
        I.click(this.saveSurveybtn);
        I.wait(4);
        I.seeInPopup('Survey Saved!');
        I.acceptPopup();
        I.waitForVisible(this.addQuestion);
        I.seeInCurrentUrl('#surveydetail');
    },
    send_survey_to_bell() {
        I.waitForVisible(this.viewCommunitiesList);
        I.wait(1);
        I.click(this.viewCommunitiesList);
        I.waitForVisible(this.bellSelector);
        I.wait(1);
        I.checkOption(this.bellSelector);
        I.waitForVisible(this.openMemberlist);
        I.waitForEnabled(this.openMemberlist);
        I.wait(1);
        I.click(this.openMemberlist);
        I.waitForVisible(this.unselectAllMembers, 10);
        I.wait(2);
        I.see("Gender");
        I.see("Birth Year");
        I.click(this.unselectAllMembers);
        I.waitForVisible(this.selectAllMembers);
        I.wait(1);
        I.click(this.selectAllMembers);
        I.waitForVisible(this.sendSurvey);
        I.wait(1);
        I.click(this.sendSurvey);
        I.wait(1);
        I.seeInPopup('Survey has been sent successfully');
        I.acceptPopup();
    }
}