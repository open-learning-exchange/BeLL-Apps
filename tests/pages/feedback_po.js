'use strict';

let I;

module.exports = {

    _init() {
        I = require('../steps_file.js')();
    },

    // Locators:
    cancel: '//*[@id="CancelButton"]',
    feedbackList: '//*[@id="ViewAllButton"]',
    feedbackWindow: '//*[@id="site-feedback"]',
    submitButton: '//*[@id="formButton"]',
    feedbackText: '//*[@id="comment"]',
    feedbackPriority: '//*[@id="priority"]',

    open_feedback() {
        I.see("Feedback");
        I.click("Feedback");
        I.waitForVisible(this.feedbackWindow);
    },

    fill_feedback(priority, feedbackType, text) {
        var typeLocator = "//*[@id='site-feedback']/div[3]/input[@value='" + feedbackType + "']";
        if (priority > 0)
        {
            I.waitForVisible(this.feedbackPriority);
            I.click(this.feedbackPriority);
        }
        I.waitForVisible(typeLocator);
        I.click(typeLocator);
        I.fillField(this.feedbackText, text);

    },

    submit_feedback() {
        I.seeElement(this.submitButton);
        I.click(this.submitButton);
        I.wait(3);
        I.seeInPopup("Feedback successfully sent.");
        I.acceptPopup();
    },

    close_feedback() {
        I.waitForVisible(this.cancel);
        I.click(this.cancel);
        I.waitForInvisible(this.feedbackWindow);
    },

    view_feedback_list() {
        I.click(this.feedbackList);
        I.seeInCurrentUrl('#siteFeedback');
    }

}