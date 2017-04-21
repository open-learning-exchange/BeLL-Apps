if (process.env.SAUCE_USERNAME) {
  exports.config = {
    "tests": "./*_test.js",
    "timeout": 10000,
    "output": "./output",
    "bootstrap": "./codeceptjs-init.js",
    "helpers": {
      "SauceLabsSession": {
        "require": "./saucelabs_helper.js"
      },
      "WebDriverIO": {
        "url": "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#login",
        "browser": "Firefox",
        "waitForTimeout": "10000",
        "user": process.env.SAUCE_USERNAME,
        "key": process.env.SAUCE_ACCESS_KEY,
        "host": "ondemand.saucelabs.com",
        "port": "80",
        "sauceConnect": true,
        "desiredCapabilities": {
          "browserName": "firefox",
          "platform": "Windows 10",
          "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
          "name": "codeceptJS.login_test",
          "build": process.env.TRAVIS_BUILD_NUMBER
        }
      }
    },
    "include": {
      "I": "./steps_file.js",
      "survey_po": "./pages/survey_po.js",
      "survey_dialog": "./pages/survey_dialog.js",
      "feedback_po": "./pages/feedback_po.js",
      "meetup_po": "./pages/meetup_po.js",
      "publication_po": "./pages/publication_po.js",
      "resource_po": "./pages/resource_po.js"
    },
    "mocha": {},
    "name": "tests"
  };
} else {
  exports.config = {
    "tests": "./*_test.js",
    "timeout": 10000,
    "output": "./output",
    "bootstrap": "./codeceptjs-init.js",
    "helpers": {
      "SauceLabsSession": {
        "require": "./saucelabs_helper.js"
      },
      "WebDriverIO": {
        "url": "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#",
        "browser": "firefox",
        "waitForTimeout": "10000"
      }
    },
    "include": {
        "I": "./steps_file.js",
        "feedback_po": "./pages/feedback_po.js",
        "meetup_po": "./pages/meetup_po.js",
        "publication_po": "./pages/publication_po.js",
        "resource_po": "./pages/resource_po.js",
        "survey_po": "./pages/survey_po.js",
        "survey_dialog": "./pages/survey_dialog.js"
    },
    "mocha": {},
    "name": "tests"
  }
}
