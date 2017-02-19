import os
import sys
import unittest
from selenium import webdriver
try:
    from sauceclient import SauceClient
except:
    pass
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def is_travis():
    return "SAUCE_USERNAME" in os.environ

if is_travis():
    USERNAME = os.environ['SAUCE_USERNAME']
    ACCESS_KEY = os.environ['SAUCE_ACCESS_KEY']
    sauce = SauceClient(USERNAME, ACCESS_KEY)
    browsers = [{"platform": "Windows 10",
                 "browserName": "firefox",
                 "version": "50",
                 "tunnel-identifier": os.environ['TRAVIS_JOB_NUMBER'],
                 "name": "integration",
                 "build": os.environ['TRAVIS_BUILD_NUMBER']}]
else:
    USERNAME = ""
    ACCESS_KEY = ""
    browsers = [{"platform": "Windows 10",
                 "browserName": "firefox",
                 "version": "50"}]

def on_platforms(platforms):
    def decorator(base_class):
        module = sys.modules[base_class.__module__].__dict__
        for i, platform in enumerate(platforms):
            name = "%s_%s" % (base_class.__name__, i + 1)
            d = {'desired_capabilities' : platform}
            module[name] = type(name, (base_class,), d)
    return decorator

class BaseCase(unittest.TestCase):
    def setUp(self):
        if is_travis():
            self.desired_capabilities['name'] = self.id()
            sauce_url = "http://%s:%s@ondemand.saucelabs.com:80/wd/hub"
            self.driver = webdriver.Remote(desired_capabilities=self.desired_capabilities,
                                           command_executor=sauce_url % (USERNAME, ACCESS_KEY))
            self.driver.implicitly_wait(30)
        else:
            self.driver = webdriver.Firefox()
    def tearDown(self):
        if is_travis():
            print("Link to your job: https://saucelabs.com/jobs/%s" % self.driver.session_id)
            try:
                if sys.exc_info() == (None, None, None):
                    sauce.jobs.update_job(self.driver.session_id, passed=True)
                else:
                    sauce.jobs.update_job(self.driver.session_id, passed=False)
            finally:
                self.driver.quit()
        else:
            self.driver.close()
