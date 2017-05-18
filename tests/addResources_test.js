
Feature('AddResources');

Before((I) => {
	I.login('admin', 'password');
	I.wait(5);
});

Scenario('test AddResources', (I) => {
	var Lang = '//*[@name="language"]';
	var AddRes = '//*[@id="addNewResource"]';
	var resForm ='//*[@id="resourceform"]';
	var navBar = '//*[@id="itemsinnavbar"]';
	var subject = '//*[@class="ui-multiselect-checkboxes ui-helper-reset"]/li/label/input[@value="Agriculture"]';
	var level = '//*[@class="ui-multiselect-checkboxes ui-helper-reset"]/li/label/input[@value="Early Education"]';
	var selectLevel = '//*[@class="bbf-field field-Level"]/div/button[@type="button"]';
	var Open = '//*[@name="openWith"]';
	var resFor = '//*[@name="resourceFor"]';
	var media = '//*[@name="Medium"]';
	var SaveRes = '//*[@name="save"]';
	I.seeInCurrentUrl('#dashboard');
	I.wait(5);
	I.waitForVisible(navBar);
	I.waitForEnabled(navBar);
	I.click('Library');
	I.wait(2);
	I.seeInCurrentUrl('#resources');
	I.waitForVisible(AddRes);
	I.waitForEnabled(AddRes);
	I.click(AddRes);
	I.seeInCurrentUrl('#resource/add');
	I.wait(2);
	I.waitForVisible(resForm);
	I.waitForEnabled(resForm);
	I.wait(2);
	I.fillField('title', "Hello World");
	I.fillField('author', "Chris Martin");
	I.fillField('Year', "2015");
	I.selectOption(Lang, "English");
	I.fillField('Publisher', "Hello World");
	I.fillField('linkToLicense', "Hello World");
	I.click('Select an Option');
	I.waitForVisible(subject);
	I.waitForEnabled(subject);
	I.wait(2);
	I.checkOption(subject);
	I.click(selectLevel);
	I.waitForVisible(level);
	I.waitForEnabled(level);
	I.wait(2);
	I.checkOption(level);
	I.selectOption(Open, "PDF.js");
	I.selectOption(resFor, "Default");
	I.selectOption(media, "Graphics/Pictures");
	I.selectOption('//*[@name="resourceType"]', "Activities");
	I.fillField('openUrl', "https://www.google.co.uk");
	I.fillField('openWhichFile', "Hello World");
	I.waitForVisible(SaveRes);
	I.waitForEnabled(SaveRes);
	I.click(SaveRes);
	I.wait(2);
	I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.htmll#resources');
	I.wait(5);

});