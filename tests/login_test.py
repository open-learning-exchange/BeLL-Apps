import bell
from base_case import on_platforms
from base_case import browsers
from base_case import BaseCase
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@on_platforms(browsers)
class LoginTest(BaseCase):
    
    def test_first_login(self):
        self.login_test("admin", "password", "c84_code", 
                        "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#configuration/add")
    
    def test_login(self):
        bell.login(self.driver, "admin", "password")
        WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "c84_code")))
        self.driver.get("http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#logout")
        self.login_test("admin", "password", "dashboard", 
                        "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#dashboard")
                        
    @unittest.expectedFailure
    def test_incorrect_username(self):
        self.login_test("", "password", "c84_code", 
                             "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#configuration/add")
        
    @unittest.expectedFailure    
    def test_incorrect_password(self):
        self.login_test("admin", "", "c84_code", 
                             "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#configuration/add")
        
    def login_test(self, username, password, id, expected):
        driver = self.driver
        # login
        bell.login(driver, username, password)
        # wait for the next page
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, id)))
        # ensure it is the correct page
        actual = driver.current_url
        self.assertEqual(actual, expected)
         

if __name__ == "__main__":
    unittest.main()
