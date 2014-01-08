# BeLL Apps Release Strategy

![BeLL Apps Release Strategy Diagram](bell-apps-release-strategy-diagram.png)

## #1 & #2 
A participating Nation and Community instance copies themselves to their respective QA servers.

```
delete-all-dbs --couchurl http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
mirror-a-couchdb-server --source http://nation-a:***@nation-a.cloudant.com --target http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
delete-all-dbs --couchurl http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
mirror-a-couchdb-server --source http://nation-a.cloudant.com --target http://bell-apps-nation-qa.cloudant.com;
```

## #3
We push the code on the Dev server to the Release Candidate server.
```
delete-all-dbs --couchurl http://bell-apps-nation-qa.cloudant.com;
```

## #4 & #5 
We simulate a release by having the QA servers consume the Release Candidate. Run QA scripts. If QA Scripts fail, return to step one when another Release Candidate is ready. If QA Scripts pass, proceed to step #6.

## #6 
Push the Release Candidate to the BeLL App Stable Channel and tag it with a version in the Git repository.
## #7 
Nation Servers will pull down the release from the Stable Channel.
## #8 
Community Servers will pull down the release from their respective nation servers.
