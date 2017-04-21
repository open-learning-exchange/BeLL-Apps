/// <reference path="./steps.d.ts" />
Feature('Language', { retries: 3 });
var languages = [
    { lan: "Spanish", log: "Iniciar sesión" },
    { lan: "English", log: "Login" },
    { lan: "Arabic", log: "دخول" },
    { lan: "Urdu", log: "لاگ ان" }
];
Scenario('test language selection', (I) => {
    I.amOnPage('/');
    languages.forEach(function (item) {
        I.waitForVisible('//*[@id="onLoginLanguage"]');
        I.waitForEnabled('//*[@id="onLoginLanguage"]');
        // Removing this wait will cause the test to hang on occasion.
        I.wait(1); 
        I.selectOption('//*[@id="onLoginLanguage"]', item.lan);
        I.waitForStalenessOf("//*[contains(@id, 'login')]", 2);

        I.waitForElement("//*[contains(@id, 'login')]", 10);
        I.see(item.log);
    });
});