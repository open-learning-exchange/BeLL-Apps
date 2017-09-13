
Feature('Report');
var today = new Date();
var dd = today.getDate();

var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

Before((I) => {
	I.login('admin', 'password');
	I.wait(5);
});
Scenario('Test for Add Report', (I) => {
	let someDate = new Date();
	someDate.setDate(someDate.getDate()); 
	let dd1 = someDate.getDate();
	let mm2 = someDate.getMonth();
	let yy2 = someDate.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (dd1 < 10) {
		dd1 = '0' + dd1;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	if (mm2 < 10) {
		mm2 = '0' + mm2;
	}
	let sdate = yy2 + '-' + mm2 + '-' + dd1;
	let edate = yyyy + '-' + mm + '-' + dd; 

	var navBar = '//*[@id="itemsinnavbar"]';
	var report = '//*[@id="itemsinnavbar"]/li/a[@href="#reports"]';
	var newReport = '//*[@id ="fHonRep"]';
	var formClass = '//*[@class="form courseSearchResults_Bottom"]';
	var date = '//*[@data-type="date"]';
	var month = '//*[@data-type="month"]';
	var year = '//*[@data-type="year"]';
	var saveBtn = '//*[@name="save"]';
	var ActReport = '//*[@id="sHonRep"]';
	var dateVis = '//input[@type="date"]';
	var startDt = '//*[@id="start-date"]';
	var endDt = '//*[@id="end-date"]';
	var reportBtn = '//*[@id="report_button"]';
	var selectDt = '//*[@id="dateSelect"]';
	var genRep = '//*[@id="submit"]';
	var comment = '//div/table/tbody/tr[2]/td[6]/button[@id="commentButton"]';
	var subBtn = '//*[@id="submitFormButton"]';
	var clBtn ='//*[@id="cancelFormButton"]';
	I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html');
	I.waitForVisible(navBar);
	I.waitForEnabled(navBar);
	I.click(report);
	I.seeInCurrentUrl('#reports');
	I.wait(5)
	I.waitForVisible(newReport);
	I.waitForEnabled(newReport);
	I.click(newReport);
	I.seeInCurrentUrl('#reports/add');
	I.wait(2);
	I.waitForVisible(formClass);
	I.waitForEnabled(formClass);
	I.fillField('title', "New Report");
	I.fillField('author', "New Author");
	I.selectOption(date, "22");
	I.selectOption(month, "May");
	I.selectOption(year, "2017");
	I.waitForVisible(saveBtn);
	I.waitForEnabled(saveBtn);
	I.click(saveBtn);
	I.seeInCurrentUrl('#report');
	I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#reports');
	I.waitForVisible(ActReport);
	I.waitForEnabled(ActReport);
	I.click(ActReport);
	I.seeInCurrentUrl('#logreports');
	I.wait(2);
	I.waitForVisible(dateVis);
	I.fillField(startDt, sdate);
	I.fillField(endDt, edate);
	I.click(reportBtn);
	I.seeInCurrentUrl('#logreports');
	I.wait(5);
	I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html#reports');
	I.wait(2);
	I.waitForVisible(comment);
	I.waitForEnabled(comment);
	I.click(comment);
	I.executeScript(function() {
		$('.redactor_ ').html('<b>This is a comment to Trend Report</b>')
	});
	I.click(subBtn);
	I.wait(2);
	I.waitForVisible(clBtn);
	I.waitForEnabled(clBtn);
	I.click(clBtn);
	I.seeInCurrentUrl('#reports');
	I.wait(5);
	I.click('Trend Activity Report');
	I.seeInCurrentUrl('#trendreport');
	I.wait(2);
	I.waitForVisible(selectDt);
	I.waitForEnabled(selectDt);
	I.fillField(selectDt, edate);
	I.waitForVisible(genRep);
	I.waitForEnabled(genRep);
	I.click(genRep);
	I.seeInCurrentUrl('#trendreport');
	I.wait(5);


});
Scenario('Test for Delete Report', (I) => {
	var navBar = '//*[@id="itemsinnavbar"]';
	var report = '//*[@id="itemsinnavbar"]/li/a[@href="#reports"]';
	var delet = '//*[@class="btn btn-danger destroy"]';
	I.amOnPage('http://127.0.0.1:5981/apps/_design/bell/MyApp/index.html');
	I.wait(3);
	I.waitForVisible(navBar);
	I.waitForEnabled(navBar);
	I.click(report);
	I.seeInCurrentUrl('#reports');
	I.wait(2)
	I.waitForVisible(delet);
	I.waitForEnabled(delet);
	I.click(delet);
	I.wait(2);
	I.seeInPopup("Are you sure you want to delete this report?");
	I.acceptPopup();
	I.wait(1);
	I.seeInPopup("Successfully deleted report.");
	I.acceptPopup();
	I.seeInCurrentUrl('#reports');
	}); 
