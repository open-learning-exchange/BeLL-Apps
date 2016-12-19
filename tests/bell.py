# Library of commonly used functions

# we use sleep to avoid timeout errors (TODO: should find a better way)
from time import sleep

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
    if driver.current_url == "http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#configuration/add":
        configuration()
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
    
    

