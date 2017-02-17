import unittest
import bell

from base_case import on_platforms
from base_case import browsers
from base_case import BaseCase

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

from time import sleep
from random import choice
from string import ascii_lowercase

@on_platforms(browsers)
class ResourceTest(BaseCase):
    """ Tests adding one resource, creating two collections,
    adding the resource to one collection, merging the two
    collections, and deleting both the resource and the collection.
    """
    #TODO: Add Upload File with Resource
    #TODO: Add one more Collection
    #TODO: Add New Resource to Collection
    #TODO: Merge Collections
    #TODO: Delete Resource
    #TODO: Delete Collection

    def test_add_resource(self):
        """ NoneType -> NoneType

        Adds a resource and tests that the resource 
        was successfully added.
        """
        driver = self.driver
        self.setup_library()
        
        # add new resource
        button = driver.find_element_by_id("addNewResource")
        button.click()
        
        # test add resource page is reached
        expected = bell.get_url() + "#resource/add"
        actual = driver.current_url
        self.assertEqual(actual, expected)
        sleep(3)
        
        # fill out new resource form
        fill = "ole"
        fill = self.new_resource_form(fill)
        
        # test form successfully submitted
        sleep(10)
        actual = False
        elem = driver.find_element_by_xpath("//*[@id='parentLibrary']//table/tbody/tr/td[./p[contains(text(), '"+fill+"')]]")
        if fill in elem.text:
            actual = True
        expected = True
        self.assertEqual(actual, expected)

    def new_resource_form(self, fill):
        """ string -> string

        Fills in the form for a new resource, if the resource is 
        not present yet, otherwise creates a new resource. 
        Returns the resource title.
        """
        driver = self.driver
        fields = ["title", "author", "Publisher", "linkToLicense"]
        for field in fields:
            elem = driver.find_element_by_name(field)
            elem.clear()
            elem.send_keys(fill)
        
        elem = driver.find_element_by_name("Year")
        elem.clear()
        elem.send_keys("2016")
        
        select = Select(driver.find_element_by_name("language"))
        select.select_by_value("English")
        
        elem_list = driver.find_elements_by_xpath("//*[contains(text(), 'Select an Option')]")
        for i in range(len(elem_list)):
            elem_list[i].click()
            elem_list[i].send_keys(Keys.RETURN)
        
        # save resource
        button = driver.find_element_by_name("save")
        button.click()
        
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "addNewResource")))
        except:
            if Alert(driver) and Alert(driver).text == "Title already exists.":
                Alert(driver).accept()
                self.new_resource_form("".join(choice(ascii_lowercase) for i in range(3)))
        return fill                 

    def test_request_resource(self):
        """ NoneType -> NoneType

        Posts a request for a resource, and tests that the 
        request was correctly registered.
        """
        driver = self.driver
        self.setup_library()
        
        # fill string
        fill = "".join(choice(ascii_lowercase) for i in range(3))
        # access request form
        button = driver.find_element_by_id("requestResource")
        button.click()
        # fill out form
        elem = driver.find_element_by_name("request")
        elem.send_keys(fill)
        # submit form
        button = driver.find_element_by_xpath("//*[@id='formButton']")
        button.click()
        
        # test alert
        actual = Alert(driver).text
        expected = "Request successfully sent."
        self.assertEqual(actual, expected)
        Alert(driver).accept()
        
        sleep(5)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "requestResource")))
        
        # test it's actually there
        button = driver.find_element_by_id("requestResource")
        button.click()
        
        # view all requests
        button = driver.find_element_by_xpath("//*[contains(text(), 'View All')]")
        button.click()
        
        # find submitted request
        actual = False
        elem = driver.find_element_by_xpath("//*[@id='requestsTable']/tbody/tr[./td[contains(text(), '"+fill+"')]]")
        if fill in elem.text:           
            actual = True
        expected = True
        self.assertEqual(actual, expected)
        
    def test_new_collection(self):
        """ NoneType -> NoneType

        Creates a new collection and tests that it is correctly
        added.
        """
        driver = self.driver
        self.setup_library()
        
        # switch to collections
        elem = driver.find_element_by_xpath("//*[@id='labelOnResource']")
        link = elem.find_element_by_link_text("Collections")
        link.click()
        
        sleep(5)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "AddCollectionOnCollections")))
        # save added collections
        collections = []
        # add new collection
        collection = "".join(choice(ascii_lowercase) for i in range(3))
        collections.append(collection)
        button = driver.find_element_by_id("AddCollectionOnCollections")
        button.click()
        # fill out form
        sleep(5)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "invitationForm")))
        fields = ["CollectionName", "Description"]
        for field in fields:
            elem = driver.find_element_by_xpath("//label[contains(@for, '"+field+"')]")
            elem.send_keys(collection)         
        # submit form
        button = driver.find_element_by_link_text("Save")
        button.click()
        sleep(5)
        
        # test collection added successfully
        actual = Alert(driver).text
        expected = "Collection saved successfully."
        self.assertEqual(actual, expected)
        Alert(driver).accept()
        
        # test correct landing page
        sleep(10)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "AddCollectionOnCollections")))
        actual = driver.current_url
        expected = bell.get_url() + "#collection"
        self.assertEqual(actual, expected)

    def setup_library(self):
        """ NoneType -> NoneType

        Helper function to get to the resource page
        """
        driver = self.driver
        
        # login
        bell.login(driver, "admin", "password")
        
        # go to library
        library = driver.find_element_by_link_text("Library")
        library.click()
        
        # test resource page is reached
        expected = bell.get_url() + "#resources"
        actual = driver.current_url
        self.assertEqual(actual, expected)
        sleep(5)

if __name__ == "__main__":
    unittest.main()
