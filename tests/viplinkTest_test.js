
Feature('FirstTest');

Before((I) => {
    I.login('admin', 'password');
    I.wait(5);
});

Scenario('test something', (I) => {
	var myProg = '//*[@href="../nation/index.html#dashboard"]';
	var vpPage = '//*[@href="#viplink"]';
	I.click(myProg);
	I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/nation/index.html#dashboard')
	I.wait(5);
	I.click(vpPage);
	I.wait(5);
	I.seeInCurrentUrl('#viplink');
	I.wait(2);
	I.fillField('domain-name-name', "Your domain name");
	I.wait(2);
	I.click('Create Link');
	I.seeInPopup('Vip link successfully created');
	I.wait(3)
	I.acceptPopup();
	I.wait(5)
	I.seeInCurrentUrl('#viplink')
	I.wait(10)

});
