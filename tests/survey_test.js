/// <reference path="./steps.d.ts" />
Feature('Survey');

Before((I) => {
    I.login('admin', 'password');
    I.wait(10);
});

Scenario('Test add surveys', (I, survey_po, survey_dialog) => {
    var ratingLabels = ["Rating 1", "Rating 2", "Rating 3", "Rating 4", "Rating 5"];
    var d = new Date();
    var n = d.getTime();

    survey_po.go_to_surveys();
    survey_po.add_survey("Test Survey " + n);
    survey_dialog.add_survey_q(true);
    survey_dialog.fill_multiple_choice_q("This is a test Question.", "Choice 1\nChoice 2\nChoice 3");
    survey_dialog.submit_survey_q();
    survey_dialog.add_survey_q(true);
    survey_dialog.fill_rating_question_q("This is another test question.", ratingLabels, "Option 1\nOption 2\nOption 3\nOption 4\nOption 5");
    survey_dialog.submit_survey_q();
    survey_dialog.add_survey_q(true);
    survey_dialog.fill_single_text_q("You must enter some text for this question.");
    survey_dialog.submit_survey_q();
    survey_dialog.add_survey_q(false);
    survey_dialog.fill_multiline_text_q("This is an optional multiline text question.");
    survey_dialog.submit_survey_q();
    survey_po.send_survey_to_bell();
});

Scenario('Answer Survey', (I, survey_po) => {
    var membersurveys = '//*[@id="surveysForMember"]';
    var testSurvey = '//td[contains(.,"Test Survey")]/../td/a';
    var singleLineText = '//td[contains(@id,"Single Textbox")]/input';
    var multilineText = '//td[contains(@id,"Comment/Essay")]/textarea';
    var submitAnswers = '//*[@id="surveyBody"]/div/button[contains(@class, "submitSurveyBtn")]';

    I.waitForVisible(membersurveys);
    I.click(membersurveys);
    I.waitForVisible(testSurvey);
    I.wait(1);
    I.click(testSurvey);
    I.waitForVisible(submitAnswers);
    I.wait(1);
    I.click('//input[contains(@name,"Choice 1") and @value="Choice 2"]')
    I.click('//input[contains(@name,"Option 1Rating 1") and @value="Rating 1"]')
    I.click('//input[contains(@name,"Option 2Rating 1") and @value="Rating 2"]')
    I.click('//input[contains(@name,"Option 3Rating 1") and @value="Rating 3"]')
    I.click('//input[contains(@name,"Option 4Rating 1") and @value="Rating 4"]')
    I.click('//input[contains(@name,"Option 5Rating 1") and @value="Rating 5"]')
    I.fillField(singleLineText, "Example single line answer ");
    I.fillField(multilineText, "This answer is so long\nthat it takes multiple\nlines to enter!");
    I.click(submitAnswers);
    I.wait(1);
    I.seeInPopup('Survey has been submitted successfully');
    I.acceptPopup();
    I.wait(1)
    I.see("Submitted");
});

Scenario('Test delete survey', (I, survey_po) => {
    survey_po.go_to_surveys();
    survey_po.delete_first_survey();
});

