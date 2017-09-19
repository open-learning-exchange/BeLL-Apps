/// <reference path="./steps.d.ts" />
Feature('Login');

Scenario('Test for Bad Login', function* (I) {
    //// Bad username
    I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html');
    I.waitForVisible('//*[@name="login"]');
    I.fillField('Login', '');
    I.fillField('Password', 'password');
    I.click('Sign In');
    I.wait(1);
    I.seeInPopup("Login or password incorrect.");
    I.acceptPopup();
    // Bad password
    I.fillField('Login', 'admin');
    I.fillField('Password', 'incorrect password');
    I.click('Sign In');
    I.wait(1);
    I.seeInPopup("Login or password incorrect.");
    I.acceptPopup();
    I.wait(5);
    I.login('admin', 'password');
    I.wait(5);

    I.seeInCurrentUrl('#dashboard');
});

Scenario('Test for Successful Login', (I) => {
    I.login('admin', 'password');
    I.seeInCurrentUrl('#dashboard');
});

Scenario('Test for Second Successful Login', (I) => {
    I.login('admin', 'password');
    I.seeInCurrentUrl('#dashboard');
});
