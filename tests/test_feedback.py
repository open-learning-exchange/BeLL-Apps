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
from selenium.webdriver.support import expected_conditions as EC

from time import sleep

@on_platforms(browsers)
class FeedbackTest(BaseCase):

    def test_feedback(self):
        driver = self.driver
        
        # go to homepage
        driver.get(bell.get_url())
        
        # set priority
        priority = False
        for i in range(2):
            if i == 1:
                # select urgent
                priority = True
                           
            categories = ["Bug", "Question", "Suggestion"]
            for category in categories:
                self.open_feedback()
                
                # if it's urgent, tick the box
                if priority == True:
                    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "priority")))
                    sleep(5)
                    # select urgent
                    urgent = driver.find_element_by_id("priority")
                    urgent.click()
                
                # send bug, question, and suggestion
                cat = driver.find_element_by_xpath("//*[@id='site-feedback']/div[3]/input[@value='"+category+"']")
                cat.click()
                
                # write the message
                message = driver.find_element_by_id("comment")
                message.send_keys("Awesome!")
                
                # submit feedback
                submit = driver.find_element_by_xpath("//*[@id='formButton'][contains(text(), 'Submit')]")
                submit.click()
                sleep(5)
                
                # if configuration was successful, accept confirmation alert
                actual = Alert(driver).text
                expected = "Feedback successfully sent."
                self.assertEqual(actual, expected)
                Alert(driver).accept()
                
                
          
    def open_feedback(self): 
        # open feedback menu
        sleep(5)
        link = self.driver.find_element_by_link_text("Feedback")
        link.click()
        sleep(5)

if __name__ == "__main__":
    unittest.main()
