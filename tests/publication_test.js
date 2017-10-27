/// <reference path="./steps.d.ts" />
Feature('Publication', { retries: 1 });

Before((I) => {
    I.login('admin', 'password');
    I.wait(2);
});

Scenario('Test for Add Publications', (I, publication_po) => {
    publication_po.go_to_publications();
    publication_po.create_publication("Test publication 1", "TestAuthor1@email.com", "1231075689");
    publication_po.save_publication();
    publication_po.return_home();
    publication_po.go_to_publications();
    publication_po.create_publication("Test publication 2", "TestAuthor2@email.com", "1232915426");
    publication_po.save_publication();
    publication_po.return_home();
    publication_po.go_to_publications();
    publication_po.create_publication("Test cancel publication", "nobody@null.net", "000111000");
    publication_po.cancel_publication();
});

Scenario('Test for Delete Publication', (I, publication_po) => {
    publication_po.go_to_publications();
    publication_po.delete_publication("Test publication 2");
});