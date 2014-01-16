# BeLL Apps Release Strategy

![BeLL Apps Release Strategy Diagram](bell-apps-release-strategy-diagram.png)

*The command line examples in the following steps make heavy use of the CouchDB Wedge utilities found [here](https://github.com/rjsteinert/CouchDB-Wedge).*

## #1 & #2 
Participating Nation and Community instances mirror themselves to their respective QA servers.

```
delete-all-dbs --couchurl http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
push-all-dbs --source http://nation-a:***@nation-a.cloudant.com --target http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
delete-all-dbs --couchurl http://bell-apps-nation-qa:***@bell-apps-nation-qa.cloudant.com;
push-all-dbs --source http://nation-a.cloudant.com --target http://bell-apps-nation-qa.cloudant.com;
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
Push the Release Candidate to the BeLL Apps Release Channel and tag it with a version in the Git repository.
```
git checkout dev;
git tag x.x;
git checkout stable;
git merge dev;
git push;
git push --tags;
delete-all-dbs --couchurl http://bell-apps-stable:***@bell-apps-stable.cloudant.com;
cd build;
./install --couchurl http://bell-apps-stable:***@bell-apps-stable.cloudant.com;
```


## #7 
Nation Servers will pull down the release from the Stable Channel. This will occur when a nation uses their BeLL Apps Sync button. This process looks in the `replicator` database (note this is not `/_replicator` or `/_replicate`) and carry out the instructions found. The instruction that accomplishes this step is installed in the following `curl` example.
```
curl -XPUT -H "Content-Type: application/json" http://nation-a:***@nation-a.cloudant.com/replicator -d '{"source": "http://bell-apps-stable:***@bell-apps-stable.cloudant.com", "target": "apps"}'
```

## #8 
Community Servers will pull down the release from the Stable Channel. This will occur when a community uses their BeLL Apps Sync button. This process looks in the `replicator` database (note this is not `/_replicator` or `/_replicate`) and carry out the instructions found. The instruction that accomplishes this step is installed because the Community servers mirror the `replicator` database of their parent Nation Server.
