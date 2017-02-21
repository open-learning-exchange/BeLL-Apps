import unittest
import bell

from base_case import on_platforms
from base_case import browsers
from base_case import BaseCase

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

from time import sleep
def checkJquery(driver):    
    JqueryActive = driver.execute_script("return jQuery.active")
    while JqueryActive != 0:
        sleep(0.5)
        JqueryActive = driver.execute_script("return jQuery.active")

@on_platforms(browsers)
class TestPublication(BaseCase):
    """ Contains publication test of Bell app."""
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
            
            self.click_manager_test()
            self.click_publications_test()
            self.click_and_add_issue()
            self.click_manager_test()
            self.click_publications_test()
            self.click_and_add_issue()
            self.click_manager_test()
            self.click_publications_test()
            self.delete_test()
            self.delete_test()
            self.logout_test()
            
        except:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[contains(@id, 'code')]")))
            self.configuration_test()
            self.logout_test()
                        

        
   
        
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

    def click_manager_test(self):
        """Clicks on the 'Manager' text and checks to see that
           the URL is correct."""
        
        
        driver = self.driver
        
        input_element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//*[@id="NationManagerLink"]'))) 
        checkJquery(driver);
        input_element.click()
        input_element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, "Publications")))       
        expected = 'http://127.0.0.1:5981/apps/_design/bell/nation/index.html#dashboard'
        actual = driver.current_url
        driver.implicitly_wait(10)
        self.assertEqual(actual, expected)
        
    def click_publications_test(self):
        """Clicks on 'publications' and checks URL"""
       
        
        driver = self.driver
        checkJquery(driver);
        input_element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="publications"]/tbody/tr[1]/th/a')))
        input_element.click()
        input_element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, "Add Issue")))
        driver.implicitly_wait(10)
        expected = 'http://127.0.0.1:5981/apps/_design/bell/nation/index.html#publication'
        actual = driver.current_url
        self.assertEqual(actual, expected)
        
    def click_and_add_issue(self):
        """Clicks 'add issue' button, checks URL then adds an issue which it checks by reaing the
           popup text"""
        
        driver = self.driver
        checkJquery(driver);
        input_element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, "Add Issue")))
        #input_element = driver.find_element_by_partial_link_text('Add Issue')
        input_element.click()
        #this is where I have stopped 1/5/2017 4:30
        input_element = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.NAME, "editorName")))
        expected = 'http://127.0.0.1:5981/apps/_design/bell/nation/index.html#publication/add'
        actual = driver.current_url
        self.assertEqual(actual, expected)

        checkJquery(driver);
        input_element = driver.find_element_by_name('editorName')
        input_element.send_keys('Test Name')
        input_element = driver.find_element_by_name('editorEmail')
        input_element.send_keys('Test@email.com')
        input_element = driver.find_element_by_name('editorPhone')
        input_element.send_keys('1111111')
        input_element = driver.find_element_by_name('save')
        input_element.click()

        element = WebDriverWait(driver, 10).until(EC.alert_is_present(),'Issue saved')
        alert = driver.switch_to.alert
        actual = alert.text
        expected = 'Issue saved.'        
        self.assertEqual(actual, expected)
        alert.accept()
        checkJquery(driver);
        input_element = driver.find_element_by_partial_link_text('My Home')
        input_element.click()
           

    def delete_test(self):
        """Clicks the first element with 'Delete' as text then checks deletion by reaing popup"""
        driver = self.driver
        checkJquery(driver);
        input_element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, "Delete")))        
        input_element = driver.find_element_by_xpath(".//*[contains(text(), 'Delete')]")
        input_element.click()
        alert = driver.switch_to.alert
        actual = alert.text
        expected = 'Are you sure you want to delete this publication?'
        alert.accept()
        element = WebDriverWait(driver, 10).until(EC.alert_is_present(),'Model of publications is accessed.')
        alert = driver.switch_to.alert
        alert.accept()

    
        
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
