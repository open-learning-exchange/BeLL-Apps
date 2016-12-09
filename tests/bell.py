# Library of commonly used functions

# we use sleep to avoid timeout errors (TODO: should find a better way)
from time import sleep

def login(driver, username, password):
    """ (object, string, string) -> NoneType

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
    
    

