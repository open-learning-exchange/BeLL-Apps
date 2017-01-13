
# Library of commonly used functions

from selenium.webdriver.common.alert import Alert
from time import sleep

# we use sleep to avoid timeout errors (TODO: should find a better way)
import pycouchdb


def get_url():
    """ NoneType -> string

    Returns the homepage url
    """
    return "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html"


def login(driver, username, password):
    """ (object, string, string) -> NoneType

    Try to login. If landing on the configuration page,
    fill out the configuration.
    """
    # login
    login_test(driver, username, password)
    # if we land on the configuration page, fill out the configuration form
    config_url = get_url() + "#configuration/add"
    if driver.current_url == config_url:
        configuration(driver)
    sleep(5)


def configuration(driver):
    """ (object) -> NoneType

    Fill out the configuration form, submit it, and accept
    the confirmation alert
    """
    fields = ["name", "code", "region", "nationName", "nationUrl", "notes"]

    # fill out all fields
    for field in fields:
        elem = driver.find_element_by_name(field)
        elem.send_keys("ole")

    # submit the form
    submit = driver.find_element_by_id("formButton")
    submit.click()
    sleep(5)

    # accept confirmation alert
    Alert(driver).accept()


def login_test(driver, username, password):
    """ (object, string, string) -> NoneType

    NOTE: this function is called directly only from the login test.
    For all other tests, call the login function instead.

    Navigate to the login page,
    insert username and password in the login form,
    and click the login button.
    """
    # go to the login page
    driver.get("http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html")
    # find the login element and enter the username
    elem = driver.find_element_by_name("login")
    elem.send_keys(username)
    # find the password element and enter the password
    elem = driver.find_element_by_name("password")
    elem.send_keys(password)
    # submit the form
    elem.submit()
    # wait 5 secs
    sleep(5)


def logout(driver):
    """ (object) -> NoneType

    Find the logout link and click on it.
    """
    # wait 5 secs
    sleep(5)
    # find logout link and click on it
    link = driver.find_element_by_link_text("Logout")
    link.click()
    # wait 5 secs
    sleep(5)


def create_member(**kwargs):
    """ Create a member in CouchDB with login='q' and password=''. """
    # TODO: Check if we really need global vars.
    # Maybe make bell a singleton:
    # http://stackoverflow.com/questions/17237857/python3-singleton-metaclass-method-not-working
    global db
    global doc
    server = pycouchdb.Server("http://nation:oleoleole@localhost:5981/")
    db = server.database("members")
    # or this way
    # http://stackoverflow.com/questions/5624912/kwargs-parsing-best-practice
    fname = kwargs['fname'] if "fname" in kwargs else "q"
    mname = kwargs['mname'] if "mname" in kwargs else "q"
    lname = kwargs['lname'] if "lname" in kwargs else "q"
    community = kwargs['community'] if "community" in kwargs else "NATION"

    doc = db.save({
        "kind": "Member",
        "roles": [
            "Learner"
        ],
        "bellLanguage": "English",
        "community": community,
        "lastName": lname,
        "status": "active",
        "Gender": "Male",
        "lastEditDate": "2017-01-09T20:48:41.178Z",
        "phone": "q",
        "credentials": {
            "value": "5605c1a22a715e2cb1966a1f4e244e87588c385c",
            "login": "q",
            "salt": "7694f4a66316e53c8cdd9d9954bd611d"
        },
        "nation": "earthbell",
        "levels": "1",
        "visits": "2",
        "lastLoginDate": "2017-01-09T05:00:00.000Z",
        "language": "q",
        "password": "",
        "firstName": fname,
        "email": "q",
        "middleNames": mname,
        "BirthDate": "1918-12-31T05:00:00.000Z",
        "login": "q",
        "region": "",
        "yearsOfTeaching": None,
        "teachingCredentials": None,
        "subjectSpecialization": None,
        "forGrades": None
    })


def delete_member():
    """ Delete the last member created from CouchDB. """
    db.delete(doc)
