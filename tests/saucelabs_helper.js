
'use strict';
let Helper = codecept_helper;
let I;
var co = require('co');
var request = require('request');
var loginCount = 1; // Used to check for config page.
class SauceLabsSession extends Helper {

  getcookies() {
    // access current client of WebDriverIO helper
    let browser = this.helpers['WebDriverIO'].browser;
    // get all cookies according to http://webdriver.io/api/protocol/cookie.html
    // any helper method should return a value in order to be added to promise chain
    return browser.cookie();
  }

  saveCookies() {
    var getloginCookies = co.wrap(function* (client) {
      let tmp = yield client.getcookies();
      client.loginCookies = tmp.value;
    })
    return getloginCookies(this);
  }

  loadCookies() {
    var getloginCookies = co.wrap(function* (client) {
      let browser = client.helpers['WebDriverIO'].browser;
      //console.log(browser);
      for (let k in client.loginCookies) {
        console.log(client.loginCookies[k]);
        yield browser.setCookie({ name: client.loginCookies[k].name, value: client.loginCookies[k].value });
      }
    })
    return getloginCookies(this);
  }


  _after() {
    if (process.env.SAUCE_USERNAME) {
      var sessionId = this.helpers['WebDriverIO'].browser.requestHandler.sessionID;
      var sauce_url = "Test finished. Link to job: https://saucelabs.com/jobs/";
      sauce_url = sauce_url.concat(sessionId);
      console.log(sauce_url);


      var dataString = '{"passed": true}';
      var status_url = 'https://saucelabs.com/rest/v1/';
      status_url = status_url.concat(process.env.SAUCE_USERNAME);
      status_url = status_url.concat('/jobs/');
      status_url = status_url.concat(sessionId);

      var options = {
        url: status_url,
        method: 'PUT',
        body: dataString,
        auth: {
          'user': process.env.SAUCE_USERNAME,
          'pass': process.env.SAUCE_ACCESS_KEY
        }
      };

      function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }

      request(options, callback);
    }
  }
}

module.exports = SauceLabsSession;
