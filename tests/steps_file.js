
'use strict';
// in this file you can append custom step methods to 'I' object
module.exports = function () {

  var loginCount = 0; // Used to check for config page.
  var loginCookies = [];
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' fSunction here.

    login: function (email, password) {

      if (loginCount < 1) {
        this.amOnPage('/');
        this.fillField('Login', 'admin');
        this.fillField('Password', 'password');
        this.click('Sign In');
        this.saveCookies();
        this.waitForText('Set Configurations', 10);
        this.seeInCurrentUrl('#configuration/add');
        this.wait(1);
        var fields = ['//*[@name="name"]', "code", "region", "nationName", "nationUrl", "notes"];
        for (let fn in fields) {
          this.fillField(fields[fn], 'ole');
        }
        this.scrollTo('#formButton');
        this.click("Submit Configurations");
        this.wait(5);
        this.seeInPopup("Configurations are successfully added.")
        this.acceptPopup();
        this.seeInCurrentUrl('#dashboard');
      }
      else {

        this.amOnPage('/');
        this.loadCookies();
        this.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html');
        this.seeInCurrentUrl('#dashboard');
      }
      loginCount = loginCount + 1;
    }
  });
}
