import unittest
import bell

from base_case import on_platforms
from base_case import browsers
from base_case import BaseCase

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

from time import sleep

@on_platforms(browsers)
class LanguageTest(BaseCase):

    def test_language(self):
        driver = self.driver
        
        # go to homepage
        driver.get(bell.get_url())
        # test all languages
        languages = ["Arabic", "English", "Spanish", "Urdu"]
        logins = ["دخول", "Login", "Iniciar sesión", "لاگ ان"]
        
        for language, login in zip(languages, logins):
            dropdown = Select(driver.find_element_by_id("onLoginLanguage"))
            dropdown.select_by_value(language)
            
            sleep(10)
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[contains(@id, 'login')]"))) 
            
            actual = driver.find_element_by_xpath("//label[contains(@for, 'login')]").text
            expected = login
            self.assertEqual(actual, expected)

if __name__ == "__main__":
    unittest.main()

