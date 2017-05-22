'use strict';

let I;

module.exports = {

    _init() {
        I = require('../steps_file.js')();
    },
    fnScrollTo: function (el) { return $(el)[0].scrollIntoView(true); },
    // Locators:
    libraryLink: '//*[@id="itemsinnavbar"]/li/a[@href="#resources"]',
    addResourceBtn: '//*[@id="addNewResource"]',
    saveResourceBtn: '//*[@name="save"]',
    cancelResourceBtn: '//*[@id="cancel"]',
    requestResourceBtn: '//*[@id="requestResource"]',
    requestWindow: '//*[@id="site-request"]',
    requestMessage: '//*[@name="request"]',
    requestSubmit: '//*[@id="formButton"]',
    requestCancel: '//*[@id="CancelButton"]',
    requestViewAll: '//*[@id="ViewAllButton"]',
    feilds: {
        title: '//*[@name="title"]',
        author: '//*[@name="author"]',
        year: '//*[@name="Year"]',
        language: '//*[@name="language"]',
        publisher: '//*[@name="Publisher"]',
        license: '//*[@name="linkToLicense"]'
    },

    subjectMenu: '//*[@id="resourceform"]/table/tbody/tr[2]/td/form/fieldset/ul/li[contains(@class,"bbf-field field-subject")]/div/button',
    selectAllSubject: '/html/body/div[contains(@class,"ui-multiselect-menu") and contains(.,"Arts")]/div/ul/li[1]/a/span[2]',
    subjectOptions: [
        '//*[@value="Agriculture"]',
        '//*[@value="Arts"]',
        '//*[@value="Business and Finance"]',
        '//*[@value="Environment"]',
        '//*[@value="Food and Nutrition"]',
        '//*[@value="Languages"]',
        '//*[@value="Literature"]',
        '//*[@value="Math"]',
        '//*[@value="Music"]',
        '//*[@value="Politics and Government"]',
        '//*[@value="Reference"]',
        '//*[@value="Religion"]',
        '//*[@value="Science"]',
        '//*[@value="Social Sciences"]',
        '//*[@value="Sports"]',
        '//*[@value="Technology"]'
    ],
    levelMenu: '//*[@id="resourceform"]/table/tbody/tr[2]/td/form/fieldset/ul/li[contains(@class,"bbf-field field-Level")]/div/button',
    selectAllLevels: '/html/body/div[contains(@class,"ui-multiselect-menu") and contains(.,"Graduate")]/div/ul/li[1]/a/span[2]',

    levelOptions: [
        '//*[@value="Early Education"]',
        '//*[@value="Lower Primary"]',
        '//*[@value="Upper Primary"]',
        '//*[@value="Lower Secondary"]',
        '//*[@value="Upper Secondary"]',
        '//*[@value="Undergraduate"]',
        '//*[@value="Graduate"]',
        '//*[@value="Professional"]'
    ],
    collectionMenu: '//*[@id="resourceform"]/table/tbody/tr[2]/td/form/fieldset/ul/li[contains(@class,"bbf-field field-Tag")]/div/button',
    selectAllCollections: '/html/body/div[contains(@class,"ui-multiselect-menu") and not(contains(.,"Arts")) and not(contains(.,"Graduate"))]/div/ul/li[1]/a/span[2]',


    go_to_resources() {
        I.wait(7);
        I.waitForVisible(this.libraryLink);
        I.click(this.libraryLink);
        I.waitForVisible(this.addResourceBtn);
        I.see("Resources");
        I.see("Collections ");
        I.seeInCurrentUrl('#resources');
    },

    add_resource() {
        I.seeInCurrentUrl('#resources');
        I.waitForVisible(this.addResourceBtn);
        I.click(this.addResourceBtn);
        I.waitForVisible(this.saveResourceBtn);
        I.see('New Resources');
    },

    delete_resource(name) {

    },

    check_resource(checkedValues) {

    },

    request_resource(message, doSubmit) {
        I.waitForVisible(this.requestResourceBtn);
        I.click(this.requestResourceBtn);
        I.waitForVisible(this.requestWindow);
        I.fillField(this.requestMessage, message);
        if (doSubmit) {
            I.click(this.requestSubmit);
            I.wait(1);
            I.seeInPopup("Request successfully sent.");
            I.acceptPopup();
        }
        else {
            I.click(this.requestCancel);
            I.waitForInvisible(this.requestWindow);
        }
    },
    view_requests(lookFor) {
        I.seeInCurrentUrl('#resources');
        I.waitForVisible(this.requestViewAll);
        I.click(this.requestViewAll);
        I.waitForVisible('//*[@id="requestsTable"]');
        I.seeInCurrentUrl('#AllRequests');
        if (lookFor != null) {
            // Look for a certain request.
            I.see(lookfor);
        }
        I.see("User");
        I.see("Category");
    },
    cancel_resource() {
        I.waitForVisible(this.cancelResourceBtn);
        I.click(this.cancelResourceBtn);
        I.waitForVisible(this.addResourceBtn);
        I.see("Resources");
        I.see("Collections ");
    },

    save_resource(expect_failure) {
        I.seeInCurrentUrl('#resource/add');
        I.waitForVisible(this.saveResourceBtn);
        I.click(this.saveResourceBtn);
        I.wait(1);
        if (expect_failure) {
            I.seeInPopup("Title already exists.");
            I.acceptPopup();
        }
        else {
            I.waitForVisible(this.addResourceBtn);
            I.seeInCurrentUrl('#resource');
        }
    },

    fill_resource(resource_form) {
        // TODO: if they don't specify Subject, Level, or collections select all.
        // TODO: if there is a file incuded upload it.
        I.waitForVisible(this.feilds.title);
        I.wait(1);
        I.fillField(this.feilds.title, resource_form.title);
        I.fillField(this.feilds.author, resource_form.author);
        I.fillField(this.feilds.year, resource_form.year);
        I.selectOption(this.feilds.language, resource_form.language);
        I.fillField(this.feilds.publisher, resource_form.publisher);
        I.fillField(this.feilds.license, resource_form.license);

        I.click(this.subjectMenu);
        if (resource_form.subjects && resource_form.subjects.length > 0) {
            resource_form.subjects.forEach(function (sub) {
                I.executeScript(function (el) { return $(el)[0].scrollIntoView(true); }, 'input[value="' + sub + '"]')
                I.checkOption('//*[@value="' + sub + '"]');
            });
        }
        else {
            I.click(this.selectAllSubject);
        }


        I.click(this.levelMenu);
        if (resource_form.levels && resource_form.levels.length > 0) {
            resource_form.levels.forEach(function (lvl) {
                I.executeScript(function (el) { return $(el)[0].scrollIntoView(true); }, 'input[value="' + lvl + '"]')
                I.checkOption('input[value="' + lvl + '"]');
            });
        }
        else {
            I.click(this.selectAllLevels);
        }

        I.click(this.collectionMenu);
        if (resource_form.collections && resource_form.collections.length > 0) {
            resource_form.collections.forEach(function (col) {
                I.executeScript(function (el) { return $(el)[0].scrollIntoView(true); }, 'input[value="' + col + '"]')
                I.checkOption('/html/body/div/ul/li/label[contains(.,"' + col + '")]/input');
            });
        }
        else {
            I.click(this.selectAllCollections);
        }
    },
    collectionsLink: '//*[@href="#collection"]',
    addCollections: '//*[@id="AddCollectionOnCollections"]',
    addCollectionWindow: '//*[@id="invitationForm"]',
    collectionName: '//*[@name="CollectionName"]',
    collectionDesc: '//*[@name="Description"]',
    parentCollection: '//*[@name="NesttedUnder"]',
    submitCollection: '//*[@id="invitationForm"]/*[@id="formButton"]',
    cancelCollection: '//*[@id="invitationForm"]/*[@id="cancelButton"]',

    deleteCollection: '//*[@id="invitationForm"]/*[@id="deleteButton"]',

    go_to_collections() {
        I.waitForVisible(this.libraryLink);
        I.click(this.libraryLink);

        I.waitForVisible(this.addResourceBtn);
        I.see("Resources");
        I.see("Collections ");
        I.seeInCurrentUrl('#resources');
        I.waitForVisible(this.collectionsLink);
        I.click(this.collectionsLink);
        I.waitForVisible(this.addCollections);
    },

    add_collection(name, desc, parent) {
        I.waitForVisible(this.addCollections);
        I.wait(3);
        I.click(this.addCollections);
        I.waitForVisible(this.addCollectionWindow);
        I.fillField(this.collectionName, name);
        I.fillField(this.collectionDesc, desc);
        if (parent != null) {
            I.selectOption(this.parentCollection, parent);
        }

    },

    submit_collection(expect_failure) {
        I.waitForVisible(this.addCollectionWindow);
        I.waitForVisible(this.submitCollection);
        I.click(this.submitCollection);
        I.wait(1);
        if (expect_failure) {
            I.seeInPopup("Enter collection name.");
            I.acceptPopup();
        }
        else {
            I.seeInPopup("Collection saved successfully.");
            I.acceptPopup();
            I.seeInCurrentUrl('#collection');
        }
    },

    cancel_create_collection() {
        I.waitForVisible(this.cancelCollection);
        I.click(this.cancelCollection);
        I.waitForInvisible(this.cancelCollection);
        I.seeInCurrentUrl('#collection');
    },

    edit_collection(name, newName, newDesc, newParent) {
        let editCollection = '//*[@id="collectionTable"]/tbody//*[text()="' + name + '"]/../../td/button';

        I.waitForVisible(editCollection);
        I.wait(7);
        I.click(editCollection);
        I.waitForVisible(this.addCollectionWindow);
        I.fillField(this.collectionName, newName);
        I.fillField(this.collectionDesc, newDesc);
        if (newParent) {
            I.selectOption(this.parentCollection, newParent);
        }
    },

    delete_current_collection(cancelDelete) {
        I.waitForVisible(this.deleteCollection);
        I.scrollTo(this.deleteCollection);
        I.click(this.deleteCollection);
        I.wait(1);
        if (cancelDelete === false) {
            I.seeInPopup("Are you sure you want to delete this collection?");
            I.acceptPopup();
            I.waitForInvisible(this.deleteCollection);
            I.seeInCurrentUrl('#collection');
        }
        else {
            I.seeElement(this.deleteCollection);
        }
    },
    merge_collections(collectionNames, newName) {

    }



}