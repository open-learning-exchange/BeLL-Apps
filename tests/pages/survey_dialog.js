'use strict';
let I;
module.exports = {
    _init() {
        I = actor();
    },
    // Vars:
    isCurrentQReqired: true,
    // Locators:
    // Many of these locators are extreamlty brittle because the elements are not
    // given an id or name.
    // Another issue is that there are duplicate elements - each question type
    // has its own elements even if it uses some of the same fields etc.
    // See https://github.com/open-learning-exchange/BeLL-Apps/issues/619
    root: '//*[@id="dialog"]',
    submit: '//*[@style="display: block;"]/div/input',
    cssSubmit: '#dialog > div[style*="display: block"] > div > input[type=submit]',
    fnScrollTo: function (el) { return $(el)[0].scrollIntoView(true); },
    selectQType: '//*[@id="add_new_question"]',
    addQuestion: '//*[@id="addQuestion"]',
    addQDialog: '//*[@id="dialog"]',
    // Multiple choice locators:
    qText: '//*[@id="question_text"]',
    ansChoicesFeild: '//*[@id="answer_choices"]',
    isRequired1: '//*[@id="required_question"]',
    // Rating locators
    ratingQText: "(//textarea[@id='question_text'])[4]",
    selectNumRatings: '//*[@id="select_rating"]',
    ratingLabelLocs: ['//*[@name="rating1_label"]', '//*[@name="rating2_label"]','//*[@name="rating3_label"]', '//*[@name="rating4_label"]', '//*[@name="rating5_label"]'],
    ratingIsRequired: "(//input[@id='required_question'])[4]",
    ratingAnsChoicesFeild: "(//textarea[@id='answer_choices'])[2]",
    // Single line q locators
    slQText: "(//textarea[@id='question_text'])[2]",
    slIsRequired: "(//input[@id='required_question'])[2]",
    // Multiline q locators
    mlQText: "(//textarea[@id='question_text'])[3]",
    mlIsRequired: "(//input[@id='required_question'])[3]",

    add_survey_q(isRequired) {
        this.isCurrentQReqired = isRequired;
        I.waitForVisible(this.addQuestion);
        I.waitForEnabled(this.addQuestion);
        I.wait(1);
        I.click(this.addQuestion);
        I.waitForVisible(this.addQDialog);
        I.waitForVisible(this.selectQType);
    },
    submit_survey_q() {
        I.waitForVisible(this.submit);
        I.executeScript(function (el)
        { return $(el)[0].scrollIntoView(true); },
            this.cssSubmit);
        I.click(this.submit);
        I.wait(2);
        I.seeInPopup('Question has been saved');
        I.acceptPopup();
        I.wait(2);
    },
    fill_multiple_choice_q(qtext, choices) {
        I.waitForVisible(this.qText);
        I.fillField(this.qText, qtext);
        I.fillField(this.ansChoicesFeild, choices);
        I.executeScript(this.fnScrollTo, this.cssSubmit);
        if (this.isCurrentQReqired) {
            I.scrollTo(this.isRequired1);
            I.click(this.isRequired1);
        }
    },
    fill_rating_question_q(QText, ratingLabels, ratingOptions) {
        var count = ratingLabels.length;
        if (count < 2 || count > 9)
        {
            I.say("Invalid number of rating choices. Expected 2 to 9 choices got " + count + " choices instead.");
        }
        I.selectOption(this.selectQType, "Rating Scale");
        I.fillField(this.ratingQText, QText);
        I.waitForVisible(this.selectNumRatings);
        I.selectOption(this.selectNumRatings, count + " ratings"); 

        if (ratingLabels.length > this.ratingLabelLocs.length) {
            count = this.ratingLabelLocs.length;
            I.say("Fill rating question was passed more labels than supported by the BeLL-Apps. Those after the Bell-App limit were ignored.");
        }

        for (var i = 0; i < count; i++) {
            console.log(this.ratingLabelLocs[i]);
            I.scrollTo(this.ratingLabelLocs[i]);
            I.fillField(this.ratingLabelLocs[i], ratingLabels[i]);
        }

        if (this.isCurrentQReqired) {
            I.scrollTo(this.ratingIsRequired);
            I.click(this.ratingIsRequired);
        }

        I.executeScript(function (el) {
            return $(el)[0].scrollIntoView(true);
        }, this.cssSubmit);

        I.scrollTo(this.submit);
        I.click(this.submit);
        I.wait(2);
        I.seeInPopup('Please provide atleast one options');
        I.acceptPopup();
        I.waitForVisible(this.ratingAnsChoicesFeild);
        I.scrollTo(this.ratingAnsChoicesFeild);
        I.fillField(this.ratingAnsChoicesFeild, ratingOptions);
    },
    fill_single_text_q(qText) {
        I.selectOption(this.selectQType, "Single Textbox");
        I.waitForVisible(this.slQText);
        I.scrollTo(this.slQText);
        I.fillField(this.slQText, qText);
        if (this.isCurrentQReqired) {
            I.scrollTo(this.slIsRequired);
            I.click(this.slIsRequired);
        }
    },
    fill_multiline_text_q(qText) {
        I.selectOption(this.selectQType, "Comment/Essay Box");
        I.waitForVisible(this.mlQText);
        I.scrollTo(this.mlQText);
        I.fillField(this.mlQText, qText);
        if (this.isCurrentQReqired) {
            I.scrollTo(this.mlIsRequired);
            I.click(this.mlIsRequired);
        }
    }
}