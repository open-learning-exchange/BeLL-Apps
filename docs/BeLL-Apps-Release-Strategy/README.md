# BeLL Apps Release Strategy

![BeLL Apps Release Strategy Diagram](bell-apps-release-strategy-diagram.png)

## #1 & #2 
Participating Nation and Community instances mirror themselves to their respective QA servers.

```
delete-all-dbs --couchurl http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
mirror-a-couchdb-server --source http://nation-a:***@nation-a.cloudant.com --target http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
delete-all-dbs --couchurl http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
mirror-a-couchdb-server --source http://nation-a.cloudant.com --target http://bell-apps-nation-qa.cloudant.com;
```

## #3
We replace the code on the Release Candidate server with the code on the Dev server.
```
git checkout dev;
git tag x.x-release-candidate-x;
git push --tags;
delete-all-dbs --couchurl http://bell-apps-release-candidate:***@bell-apps-release-candidate.cloudant.com;
cd build;
./install --couchurl http://bell-apps-release-candidate:***@bell-apps-release-candidate.cloudant.com;
```

## #4 & #5 
We simulate a release by having the QA servers consume the Release Candidate. Run QA scripts. If QA Scripts fail, return to step one when another Release Candidate is ready. If QA Scripts pass, proceed to step #6.
```
curl -XPOST -H "Content-Type: application/json" http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com/_replicate -d '{"continuous":true, "source": "http://bell-apps-release-candidate:***@bell-apps-release-candidate.cloudant.com/apps", "target":"http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com/apps"}';
curl -XPOST -H "Content-Type: application/json" http://bell-apps-community-qa:***@bell-apps-community-qa.cloudant.com/_replicate -d '{"continuous":true, "source": "http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com/apps", "target":"http://bell-apps-community-qa:***@bell-apps-community-qa.cloudant.com/apps"}';
```

## #6 
Push the Release Candidate to the BeLL App Stable Channel and tag it with a version in the Git repository.
## #7 
Nation Servers will pull down the release from the Stable Channel.
## #8 
Community Servers will pull down the release from their respective nation servers.
