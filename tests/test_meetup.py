"""Contains the unit tests and helper functions to test
 the meetup feature of the BeLL app"""
import datetime
import unittest
from selenium.common.exceptions import (NoSuchElementException,
                                        StaleElementReferenceException,
                                        TimeoutException)
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait
from time import sleep

import bell
from base_case import BaseCase, browsers, on_platforms


@on_platforms(browsers)
class MeetupTest(BaseCase):
    """Contains the unit tests and helper functions to test the meetup feature
     of the BeLL app"""

    def create_meetup(self, num_days=1, cancel=False, recurring=False):
        """Creates a meetup that lasts num_days, and if recurring is set to true,
         then it will select the recurring option. If cancel is set to true
         then it will hit cancel after filling the form."""
        driver = self.driver
        wait = WebDriverWait(driver, 30)
        bell.login(driver, "admin", "password")
        self.assertTrue(self.go_to_meetups())

        # Make sure the'Add Meetup' button is there and press it.
        # Keep clicking the button till its gone.
        add_id = 'linkOfMeetUpHeading'
        wait.until(EC.element_to_be_clickable((By.ID, add_id)))
        add_meetup_btn = driver.find_element_by_id(add_id)

        keepclicking = True
        while keepclicking:
            try:
                add_meetup_btn.click()
                sleep(1)
            except StaleElementReferenceException:
                keepclicking = False

        self.fill_meetup_form(recurring=recurring, num_of_days=num_days)
        if cancel is False:
            # Bring up the invite page, since this is a new meetup.
            submit = driver.find_element_by_id("MeetUpformButton")
            submit.click()
            wait.until(EC.presence_of_element_located((By.ID, 'formButton')))
        return True

    def fill_meetup_form(self, recurring, num_of_days):
        """Fills out the meetup form with filler information."""
        driver = self.driver
        wait = WebDriverWait(driver, 30)

        # Wait for the form to appear and fill it out.
        wait.until(EC.presence_of_element_located((By.ID, 'meetUpForm')))
        wait.until(EC.element_to_be_clickable((By.NAME, 'title')))

        elem = driver.find_element_by_name("title")
        elem.send_keys("test_meetup.py - Test Meetup")
        elem = driver.find_element_by_name("description")
        desc = "This is a test meeting automatically created by test_meetup.py"
        elem.send_keys(desc)
        elem = driver.find_element_by_name("startDate")
        elem.send_keys(datetime.datetime.now().strftime('%m/%d/%Y'))
        elem = driver.find_element_by_name("endDate")
        end_date = datetime.datetime.now() \
            + datetime.timedelta(days=num_of_days)
        elem.send_keys(end_date.strftime('%m/%d/%Y'))

        elem = driver.find_element_by_name("startTime")
        elem.send_keys("8:00am")
        elem = driver.find_element_by_name("endTime")
        elem.send_keys("11:00pm")

        elem = driver.find_element_by_name("category")
        wait.until(EC.element_to_be_clickable((By.NAME, 'category')))
        select = Select(elem)
        select.select_by_value('E Learning')

        elem = driver.find_element_by_name("meetupLocation")
        elem.send_keys("Test catagory")
        if recurring:
            css_sel = 'input[type="radio"]'
            recurring_radio = driver.find_element_by_css_selector(css_sel)
            recurring_radio.click()
            rec_id = recurring_radio.get_attribute("id")
            wait.until(EC.element_located_to_be_selected((By.ID, rec_id)))

    def go_to_meetups(self):
        """"Navigates to the meetups tab."""
        driver = self.driver
        wait = WebDriverWait(driver, 15)
        # Go to the meetups tab
        wait.until(EC.element_to_be_clickable((By.ID, 'itemsinnavbar')))
        old_page = driver.find_element_by_id('dashboard')
        css_sel = 'a[href="#meetups"]'
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, css_sel)))
        meetups_tab = driver.find_element_by_css_selector(css_sel)
        meetups_tab.click()

        # Clicking on the meetups link doesn't always work,
        # so keep trying until we are at the meetups page.
        # This might only be needed due to a bug in the site see:
        #  https://github.com/open-learning-exchange/BeLL-Apps/issues/585
        keeptrying = True
        numoftries = 0
        while keeptrying:
            try:
                # If the old page is stale then we are on the meetups tab.
                wait.until(EC.staleness_of(old_page))
                keeptrying = False
            except TimeoutException:
                wait.until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, css_sel)))
                meetups_tab = driver.find_element_by_css_selector(css_sel)
                meetups_tab.click()
                numoftries = numoftries + 1
                if numoftries == 4:
                    # If we still haven't got there something else went wrong.
                    keeptrying = False
                    return False

        heading_id = 'linkOfMeetUpHeading'
        wait.until(EC.presence_of_element_located((By.ID, heading_id)))
        return True

    def save_meetup(self):
        """Saves the currently open meetup."""
        driver = self.driver
        try:
            submit = driver.find_element_by_id("formButton")
            submit.click()
        except (TimeoutException, NoSuchElementException):
            print("Could not submit invatations. \
                    Check that you navigated to \
                    the invation screen and that formButton exists.")
            return False

        WebDriverWait(driver, 25).until(EC.alert_is_present())
        actual = Alert(driver).text
        expected = "Invitation sent successfully."
        Alert(driver).accept()
        return actual == expected

    def test_add_new_meetup_singleday(self):
        """Creates a meetup for a single day."""
        self.create_meetup(1)
        result = self.save_meetup()
        self.assertEqual(True, result)

    def test_delete_meetup(self):
        """Deletes all meetups containing 'test_meetup.py'"""
        driver = self.driver
        wait = WebDriverWait(driver, 25)
        bell.login(driver, "admin", "password")
        result = self.go_to_meetups()
        self.assertEqual(True, result)

        # Check if there is at least one row of meetups.
        is_meetups_present = False
        try:
            x_path = "//*[@id='parentLibrary']/table/tbody/tr[2]/td[4]/a"
            driver.find_element_by_xpath(x_path)
            is_meetups_present = True
        except NoSuchElementException:
            self.assertEqual(True, is_meetups_present)

        # Delete any meetups made by test_meetup.py
        meetups_xpath = \
            "//*[@id='parentLibrary']/table/tbody/tr[contains(.,'test_meetup.py')]\
            /td/a[@class='destroy btn btn-danger']"
        meetups = driver.find_elements_by_xpath(meetups_xpath)
        meetups_deleted = False
        attempts = 0
        while len(meetups) > 0:
            try:
                meetups[0].click()
                wait.until(EC.alert_is_present())
                Alert(driver).accept()
                wait.until(EC.staleness_of(meetups[0]))
                # Reload list -- the list is stale now that we deleted one.
                meetups = driver.find_elements_by_xpath(
                    "//*[@id='parentLibrary']/table/tbody/tr[contains(.,'Test')]\
                    /td/a[@class='destroy btn btn-danger']")
                meetups_deleted = True
            except (StaleElementReferenceException,
                    NoSuchElementException, TimeoutException):

                attempts = attempts + 1
                if attempts > 5:
                    meetups_deleted = False
                    break

        self.assertEqual(True, meetups_deleted)

    def test_invite_member(self):
        """Selects all members and invites them"""
        driver = self.driver
        wait = WebDriverWait(driver, 15)
        self.create_meetup(1)
        elem = driver.find_element_by_name("invitationType")
        wait.until(EC.element_to_be_clickable((By.NAME, 'invitationType')))

        invitation_type = Select(elem)
        index = 0
        for opt in invitation_type.options:
            if index == 1:
                opt.click()
            index = index + 1

        wait.until(EC.presence_of_element_located((By.NAME, 'members')))
        members_list = driver.find_element_by_name('members')
        chkboxes = members_list.find_elements_by_tag_name("input")

        for val in chkboxes:
            val.click()

        sleep(1)
        result = self.save_meetup()
        self.assertEqual(True, result)

    def test_multiday_meetup(self):
        """Tests a multiday meetup"""
        self.create_meetup(3)
        result = self.save_meetup()
        self.assertEqual(True, result)

    def test_recurring_meetup(self):
        """Tests a recurring meetup"""
        self.assertTrue(self.create_meetup(1, recurring=True))
        result = self.save_meetup()
        self.assertEqual(True, result)

    def test_cancel_meetup(self):
        """Creates a meetup and cancels on the form screen"""
        driver = self.driver
        self.create_meetup(1, cancel=True)
        wait = WebDriverWait(driver, 25)
        cancel_id = 'MeetUpcancel'
        wait.until(EC.element_to_be_clickable((By.ID, cancel_id)))
        cancel = driver.find_element_by_id(cancel_id)
        cancel.click()
        heading_id = 'linkOfMeetUpHeading'
        wait.until(EC.presence_of_element_located((By.ID, heading_id)))
        expected = \
            'http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#meetups'
        actual = driver.current_url
        self.assertEqual(expected, actual)

    if __name__ == "__main__":
        unittest.main()
