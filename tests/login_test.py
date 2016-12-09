import unittest
import bell

from base_case import is_travis
from base_case import on_platforms
from base_case import browsers
from base_case import BaseCase

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

from time import sleep

@on_platforms(browsers)
class LoginTest(BaseCase):
                         
    def test_login_logout(self):
        
        input = ("admin", "password")
        # if remote, test first login, otherwise test second login
        if is_travis():
            self.login_test(*input, True)
            self.configuration_test()
            self.logout_test()
            self.login_test(*input)
        else:
            self.login_test(*input)
            self.logout_test()
                        
    @unittest.expectedFailure
    def test_incorrect_username(self):
        input = ("", "password")
        if is_travis():
            self.login_test(*input, True)
        else:
            self.login_test(*input)
        
    @unittest.expectedFailure    
    def test_incorrect_password(self):
        input = ("admin", "")
        if is_travis():
            self.login_test(*input, True)
        else:
            self.login_test(*input)
        
    def login_test(self, username, password, first=False):
        driver = self.driver
        url = "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html"
        if first:
            id = "c84_code"
            expected = url + "#configuration/add"
        else:
            id = "dashboard"
            expected = url + "#dashboard"
        # login
        bell.login(driver, username, password)
        # wait for the next page
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, id)))
        # ensure it is the correct page
        actual = driver.current_url
        self.assertEqual(actual, expected)
        
    def logout_test(self):
        driver = self.driver
        # test logout
        bell.logout(driver)
        # ensure logout was successful
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "login")))
        actual = driver.current_url
        expected = "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#login"
        self.assertEqual(actual, expected)
        
    def configuration_test(self):
        driver = self.driver
        fields = ["name", "code", "region", "nationName", "nationUrl", "version", "notes"] 
        for field in fields:
            elem = driver.find_element_by_name(field)
            elem.send_keys("ole")

        # uncomment to test languages other than English
        # dropdown = Select(driver_find_element_by_name("selectLanguage")
        # dropdown.select_by_value("Spanish")

        submit = driver.find_element_by_id("formButton")
        submit.click()
        
        # if configuration was successful, accept confirmation alert
        actual = Alert(driver).text
        expected = "Configurations are successfully added."
        self.assertEqual(actual, expected)
        Alert(driver).accept()
        
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "dashboard")))
        sleep(5)
        
        # ensure configuration was submitted (TODO: check against CouchDB)
        actual = driver.current_url
        expected = "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#dashboard"
        self.assertEqual(actual, expected)
         

if __name__ == "__main__":
    unittest.main()
