/// <reference path="./steps.d.ts" />
Feature('Feedback', { retries: 3 });

Before((I) => {
    I.login('admin', 'password');
    I.wait(2);
});

Scenario('Test for Feedback Bug', (I, feedback_po) => {
    feedback_po.open_feedback();
    feedback_po.fill_feedback(0, "Bug", "This is a test question");
    feedback_po.submit_feedback();
});

Scenario('Test for Feedback Question', (I, feedback_po) => {
    feedback_po.open_feedback();
    feedback_po.fill_feedback(1, "Question", "This is a test question");
    feedback_po.submit_feedback();
});

Scenario('Test for  Feedback Suggestion', (I, feedback_po) => {
    feedback_po.open_feedback();
    feedback_po.fill_feedback(0, "Question", "This is a test suggestion");
    feedback_po.submit_feedback();
});

Scenario('Test for Cancel Feedback', (I, feedback_po) => {
    feedback_po.open_feedback();
    feedback_po.close_feedback();
});