/// <reference path="./steps.d.ts" />
Feature('Resource');

Before((I) => {
    I.login('admin', 'password');
    I.wait(2);
});


Scenario('test resources', (I, resource_po) => {

    let resource1 = {
        title: "Test Resource 1",
        author: "Test Author 1",
        year: "2017",
        language: "English",
        publisher: "OLE Virtual Interns",
        license: "None."
    };
    let resource2 = {
        title: "Test Resource 2",
        author: "Test Author 2",
        year: "2017",
        language: "Spanish",
        publisher: "OLE Virtual Interns",
        license: "None.",
        subject: ["Languages", "Learning"],
        levels: ["Professional", "Graduate"]
    };
    let resource3 = {
        title: "Test Resource 3",
        author: "Test Author 3",
        year: "2017",
        language: "English",
        publisher: "OLE Virtual Interns",
        license: "None.",
        collections: ["Test collection 1","Test collection 2"]
    };

    resource_po.go_to_resources();
    resource_po.add_resource();
    resource_po.fill_resource(resource1);
    resource_po.save_resource();
    resource_po.request_resource("I want a certain test resource!", true);
    resource_po.go_to_collections();
    resource_po.add_collection("Test collection 1", "This is a test collection created by resource_test.js", null);
    resource_po.submit_collection();
    resource_po.add_collection("Test collection 2", "This is a test collection created by resource_test.js", null);
    resource_po.submit_collection();
    resource_po.merge_collections(["Test collection 1", "Test collection 2."], "Merged Test Collections");
    resource_po.edit_collection("Test collection 1", "Should be gone", "Should be gone", null);
    resource_po.delete_current_collection(false);
    resource_po.go_to_resources();
    resource_po.add_resource();
    resource_po.fill_resource(resource2);
    resource_po.save_resource();
    resource_po.delete_resource("Test Resource 1");
});

//Scenario('test collections', (I, resource_po) => {
//});

//Scenario('test delete resource and collections', (I, resource_po) => {
//});

//Scenario('test add resource', (I, resource_po) => {
//});

//Scenario('test request resource', (I, resource_po) => {
//});

//Scenario('test switch to collection', (I, resource_po) => {
//});

//Scenario('test add collections', (I, resource_po) => {
//});

//Scenario('test add resource to collection', (I, resource_po) => {

//});

//Scenario('test add resource to collection', (I, resource_po) => {

//});
//Scenario('test add resource to collection', (I, resource_po) => {

//});
//Scenario('test merge collections', (I, resource_po) => {

//});
//Scenario('test delete resource', (I, resource_po) => {

//});
//Scenario('test delete collections', (I, resource_po) => {

//});
//Scenario('test delete collections', (I, resource_po) => {

//});



