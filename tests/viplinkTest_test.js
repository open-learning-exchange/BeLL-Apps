
Feature('CreateVipLink');

Before((I) => {
    I.login('admin', 'password');
});

Scenario('test CreateVipLink', (I) => {
	var managerLink = '//*[@id="NationManagerLink"]';
	var vpPage = '//*[@href="#viplink"]';
	I.seeInCurrentUrl('#dashboard');
	I.waitForVisible(managerLink);
	I.waitForEnabled(managerLink);
	I.click(managerLink);
	I.wait(5);
	I.waitForVisible(vpPage);
	I.waitForEnabled(vpPage);
	I.click(vpPage)
	I.seeInCurrentUrl('#viplink');
	I.wait(2);
	I.fillField('domain-name-name', "Your domain name");
	I.click('Create Link');
	I.seeInPopup('Vip link successfully created');
	I.acceptPopup();
	I.seeInCurrentUrl('#viplink')
	I.wait(10)
});

Scenario('test second DeleteVipLink', (I) => {
	var managerLink = '//*[@id="NationManagerLink"]';
	var vpPage = '//*[@href="#viplink"]';
	var del ='//*[@class="parentDiv"]/table/tbody/tr[2]/td[5]/button[2]';
	I.seeInCurrentUrl('#dashboard');
	I.waitForVisible(managerLink);
	I.waitForEnabled(managerLink);
	I.click(managerLink);
	I.wait(5);
	I.click(vpPage);
	I.seeInCurrentUrl('#viplink');
	I.wait(5);
	I.click(del);
	I.seeInPopup("Are you sure that you want to delete this link?")
	I.wait(3);
	I.acceptPopup();
	I.seeInCurrentUrl('#viplink');
	I.wait(5);
});