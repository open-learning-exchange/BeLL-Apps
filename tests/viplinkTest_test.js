
Feature('CreateVipLink');

Before((I) => {
    I.login('admin', 'password');
});

Scenario('test CreateVipLink', (I) => {
	var managerLink = '//*[@id="NationManagerLink"]';
	var vpPage = '//*[@href="#viplink"]';
	var crLink = '//div/button[@class="create btn btn-success"]';
	I.seeInCurrentUrl('#dashboard');
	I.waitForVisible(managerLink);
	I.waitForEnabled(managerLink);
	I.click(managerLink);
	I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/nation/index.html#dashboard');
	I.wait(3);
	I.waitForVisible(vpPage);
	I.waitForEnabled(vpPage);
	I.click(vpPage)
	I.seeInCurrentUrl('#viplink');
	I.wait(3);
	I.fillField('domain-name-name', "Your domain name");
	I.waitForVisible(crLink);
	I.waitForEnabled(crLink);
	I.click(crLink);
	I.wait(2);
	I.seeInPopup('Vip link successfully created');
	I.acceptPopup();
	I.wait(2);
	I.seeInCurrentUrl('#viplink')
	I.wait(3)
});

Scenario('test second DeleteVipLink', (I) => {
	var managerLink = '//*[@id="NationManagerLink"]';
	var vpPage = '//*[@href="#viplink"]';
	var del ='//*[@class="parentDiv"]/table/tbody/tr[2]/td[5]/button[2]';
	I.seeInCurrentUrl('#dashboard');
	I.waitForVisible(managerLink);
	I.waitForEnabled(managerLink);
	I.click(managerLink);
	I.seeInCurrentUrl('#dashboard');
	I.wait(3);
	I.waitForVisible(vpPage);
	I.waitForEnabled(vpPage);
	I.click(vpPage);
	I.seeInCurrentUrl('#viplink');
	I.wait(3);
	I.waitForVisible(del);
	I.waitForEnabled(del);
	I.click(del);
	I.wait(2);
	I.seeInPopup("Are you sure that you want to delete this link?")
	I.acceptPopup();
	I.wait(2);
	I.seeInCurrentUrl('#viplink');
	I.wait(2);
});
