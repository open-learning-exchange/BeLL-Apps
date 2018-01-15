/// <reference path="./steps.d.ts" />
Feature('Language', { retries: 3 });
var languages = [
    { lan: "Español", log: "Iniciar sesión" },
    { lan: "English", log: "Login" },
    { lan: "Arabic", log: "دخول" },
    { lan: "Urdu", log: "لاگ ان" }
];
Scenario('Test for Language Selection', (I) => {
    I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html');
    languages.forEach(function (item) {
        I.waitForVisible('//*[@id="onLoginLanguage"]');
        I.waitForEnabled('//*[@id="onLoginLanguage"]');
        // Removing this wait will cause the test to hang on occasion.
        I.wait(1); 
        I.selectOption('//*[@id="onLoginLanguage"]', item.lan);
        I.waitForStalenessOf("//*[contains(@id, '#login')]", 2);
        I.see(item.log);
    });
});
