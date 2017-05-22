
Feature('BecameAmember');

Scenario('test BecomeAmember', (I) => {
	var date = '//*[@data-type="date"]';
	var month = '//*[@data-type="month"]';
	var year = '//*[@data-type="year"]';
	var Gen = '//*[@name="Gender"]';
	var lvl = '//*[@name="levels"]';
	I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html')
	I.click('Become a Member');
	I.seeInCurrentUrl('#member/add')
	I.fillField('firstName', "YourFname");
	I.fillField('lastName', "YourLname");
	I.fillField('middleNames', "YourMName");
	I.fillField('login', "userlogin");
	I.fillField('password', "password");
	I.fillField('phone', "1234567890");
	I.fillField('email', "email@email.com");
	I.fillField('language', "English");
	I.selectOption(date, "1");
	I.selectOption(month, "October");
	I.selectOption(year, "2010")
	I.selectOption(Gen, "Male");
	I.selectOption(lvl, "Higher");
	I.click('Register');
	I.wait(2);
	I.seeInPopup('Successfully registered.');
	I.acceptPopup();
	I.wait(10);
});
