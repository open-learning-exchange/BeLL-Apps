#!/usr/bin/python
import os
import sys
import unittest
from selenium import webdriver
from sauceclient import SauceClient
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# it's best to remove the hardcoded defaults and always get these values
# from environment variables
USERNAME = os.environ['SAUCE_USERNAME']
ACCESS_KEY = os.environ['SAUCE_ACCESS_KEY']
sauce = SauceClient(USERNAME, ACCESS_KEY)

browsers = [{"platform": "Windows 10",
             "browserName": "firefox",
             "version": "48",
             "tunnel-identifier": os.environ['TRAVIS_JOB_NUMBER'],
             "name": "integration",
             "build": os.environ['TRAVIS_BUILD_NUMBER']}]
 
def on_platforms(platforms):
    def decorator(base_class):
        module = sys.modules[base_class.__module__].__dict__
        for i, platform in enumerate(platforms):
            name = "%s_%s" % (base_class.__name__, i + 1)
            d = {'desired_capabilities' : platform}
            module[name] = type(name, (base_class,), d)
    return decorator
 
@on_platforms(browsers)



class Bell(unittest.TestCase):

    def setUp(self):
        self.desired_capabilities['name'] = self.id()
        sauce_url = "http://%s:%s@ondemand.saucelabs.com:80/wd/hub"
        self.driver = webdriver.Remote(
            desired_capabilities=self.desired_capabilities,
            command_executor=sauce_url % (USERNAME, ACCESS_KEY)
        )
        self.driver.implicitly_wait(30)

    def test_login(self):
        driver = self.driver
        # go to the home page
        driver.get("http://localhost:5982/apps/_design/bell/MyApp/index.html")
        # find the login element
        inputElement = driver.find_element_by_name("login")
        # type in the username
        inputElement.send_keys("admin")
        # find the password element
        inputElement = driver.find_element_by_name("password")
        # type in the password
        inputElement.send_keys("password")
        # submit the form
        inputElement.submit()
        # give it time to get to the next page
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "dashboard")))
        # print page
        print(driver.current_url)
        # ensure we're logged in
        assert driver.current_url == "http://localhost:5982/apps/_design/bell/MyApp/index.html#dashboard"

    def tearDown(self):
        print("Link to your job: https://saucelabs.com/jobs/%s" % self.driver.session_id)
        try:
            if sys.exc_info() == (None, None, None):
                sauce.jobs.update_job(self.driver.session_id, passed=True)
            else:
                sauce.jobs.update_job(self.driver.session_id, passed=False)
        finally:
            self.driver.quit()
 
if __name__ == '__main__':
    unittest.main()
