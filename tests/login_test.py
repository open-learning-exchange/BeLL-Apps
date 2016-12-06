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
    def test_login(self):
        driver = self.driver
        # go to the home page
        driver.get("http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html")
        # find the login element and enter the username
        inputElement = driver.find_element_by_name("login")
        inputElement.send_keys("admin")
        # find the password element and enter the password
        inputElement = driver.find_element_by_name("password")
        inputElement.send_keys("password")
        # submit the form
        inputElement.submit()
        # give it time to get to the next page
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "c84_code")))
        # ensure we're logged in
        self.assertEqual(driver.current_url, "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#configuration/add")

if __name__ == "__main__":
    unittest.main()
