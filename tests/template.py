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
class TemplateTest(BaseCase):
    
    def test_template(self):
        # change "template" to the name of what you're testing      
        ## YOUR CODE GOES HERE
        pass
        
 
if __name__ == "__main__":
    unittest.main()
        
    
