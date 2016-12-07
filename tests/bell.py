def login(driver, username, password):
    """ (object, string, string) -> NoneType

    Navigate to the login page, 
    insert username and password in the login form,
    and click the login button.
    """
    # go to the login page
    driver.get("http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html")
    # find the login element and enter the username
    inputElement = driver.find_element_by_name("login")
    inputElement.send_keys(username)
    # find the password element and enter the password
    inputElement = driver.find_element_by_name("password")
    inputElement.send_keys(password)
    # submit the form
    inputElement.submit()
    

