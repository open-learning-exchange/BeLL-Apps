from pbkdf2 import *
import pycouchdb
import sys
import md5
import time
import json

reload(sys)
sys.setdefaultencoding("utf-8")

try:
    host = sys.argv[1]
except:
    host = "http://localhost:5984"

if __name__ == "__main__":
    server = pycouchdb.Server(host)
    config = server.database("configurations")
    members = server.database("members")

    config = dict(list(config.all())[0]["doc"])
    print json.dumps(config,indent=2)

    for count, member in enumerate(members.all()):

        doc = member.get("doc")

        if "login" not in doc:
            continue
        if "credentials" in doc:
            continue

        print "|".join([str(count), doc.get("login"), doc.get("password")])
        hash = {"login": doc.get("login","nil"),
                "password": doc.get("password","nil"),
                "community": doc.get("community","nil")}

        if hash["community"] == config.get("code"):

            credentials = {}
            credentials["salt"] = md5.md5(str(hash["login"])).hexdigest()
            credentials["value"] = pbkdf2_hex(str(hash["password"]), credentials["salt"], 10, keylen=20)
            credentials["login"] = hash["login"]

            doc["credentials"] = credentials
            doc["password"] = ""
            members.save(doc)
            print "credentials set for %s" % hash["login"]
