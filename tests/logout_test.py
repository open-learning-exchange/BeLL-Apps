import unittest
import bell

from base_case import on_platforms
from base_case import browsers
from base_case import BaseCase

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@on_platforms(browsers)
class LogoutTest(BaseCase):
    
    def test_logout(self):
        driver = self.driver
        bell.login(driver, "admin", "password")
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "dashboard")))
        # at this point, we logged in and we are on the dashboard page
        # now, we want to logout
        ## YOUR CODE GOES HERE
        
        
        
        
        
        # NOTE: if you run the code as it is now, the following test will
        # fail. After writing your code, the test should pass.
        
        # wait for the login page to load
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "login")))
        # ensure we logged out successfully
        expected = "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#login"
        actual = driver.current_url
        self.assertEqual(actual, expected)
        
if __name__ == "__main__":
    unittest.main()
        
    
