import unittest
import bell

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

    def test_login(self):
        """ NoneType -> NoneType
        
        Test login, logout, and configuration.
        Login, find the landing page and, if needed, fill out 
        the configuration, ensuring it is correctly accepted.
        Then, ensure correct log out.
        """
        driver = self.driver
        
        # login
        bell.login_test(self.driver, "admin", "password")
        
        # wait for the next page, and fill the configuration only if needed
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "dashboard")))
            self.logout_test()
        except:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[contains(@id, 'code')]")))
            self.configuration_test()
            self.logout_test()
                        
    def test_incorrect_login(self):
        """ NoneType -> NoneType
        
        Test incorrect username or password in login form.
        
        TODO: check username and password in CouchDB 
        """
        # test incorrect username
        self.incorrect_login("", "password")
        # test incorrect password
        self.incorrect_login("admin", "")
        
    def incorrect_login(self, username, password):
        """ (object, string, string) -> NoneType
        
        Helper function to try logging in with an incorrect parameter 
        (either username or password).
        Ensure the appropriate error message is received and the landing
        page is unchanged (still on the login page).
        """
        driver = self.driver
        # login
        bell.login_test(driver, username, password)
        sleep(5)
        
        # ensure appropriate error message
        actual = Alert(driver).text
        expected = "Login or password incorrect."
        self.assertEqual(actual, expected)
        Alert(driver).accept() 
        
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "login")))
        
        # ensure we're still on the login page
        actual = driver.current_url
        expected = bell.get_url() + "#login"
        self.assertEqual(actual, expected)   
        
    def logout_test(self):
        """ NoneType -> NoneType
        
        Helper function testing a correct logout operation.
        """
        driver = self.driver
        # test logout
        bell.logout(driver)
        # ensure logout was successful
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "login")))
        actual = driver.current_url
        expected = bell.get_url() + "#login"
        self.assertEqual(actual, expected)
        
    def configuration_test(self):
        """ NoneType -> NoneType
        
        Helper function filling out the configuration form and ensuring it
        is successfully added to a new nation.
        
        TODO: Check configuration values in CouchDB         
        """
        driver = self.driver
        
        fields = ["name", "code", "region", "nationName", "nationUrl", "notes"]
        # fill out all fields
        for field in fields:
            elem = driver.find_element_by_name(field)
            elem.send_keys("ole")

        # uncomment to test languages other than English
        # dropdown = Select(driver.find_element_by_name("selectLanguage"))
        # dropdown.select_by_value("Spanish")
        
        # submit the form
        submit = driver.find_element_by_id("formButton")
        submit.click()
        sleep(5)
        
        # if configuration was successful, accept confirmation alert
        actual = Alert(driver).text
        expected = "Configurations are successfully added."
        self.assertEqual(actual, expected)
        Alert(driver).accept()
        
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "dashboard")))
        
        # ensure configuration was submitted (TODO: check against CouchDB)
        actual = driver.current_url
        expected = bell.get_url() + "#dashboard"
        self.assertEqual(actual, expected)
         

if __name__ == "__main__":
    unittest.main()
