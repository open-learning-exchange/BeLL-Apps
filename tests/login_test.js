/// <reference path="./steps.d.ts" />
Feature('Login');

Scenario('test bad login', function* (I) {
    //// Bad username
    I.amOnPage('/');
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

Scenario('test successful login', (I) => {
    I.login('admin', 'password');
    I.seeInCurrentUrl('#dashboard');
});

Scenario('test second successful login', (I) => {
    I.login('admin', 'password');
    I.seeInCurrentUrl('#dashboard');
});

